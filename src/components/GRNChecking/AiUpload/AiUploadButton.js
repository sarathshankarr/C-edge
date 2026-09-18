import React, {useState} from 'react';
import {TouchableOpacity, Text, View, ActivityIndicator, Alert, StyleSheet, Platform, PermissionsAndroid, Modal, Image} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import DocumentScanner from 'react-native-document-scanner-plugin';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {createPdf} from 'react-native-pdf-from-image';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as Constant from '../../../utils/constants/constant';

// Upload-cloud icon (Feather-style outline), matching the reference look.
const UploadCloudIcon = ({color = '#4F46E5', size = 16}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 16l-4-4-4 4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 12v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Shared "AI Doc Upload" trigger for Lot / Bale / RM -- offers camera
// photo, gallery photo, a PDF file pick, and a CamScanner-style
// continuous multi-page scan, then hands the resulting file to the given
// upload job's `.upload(file, extraFields)` (see useAiUploadJob.js).
// Camera/gallery photos go through the sync endpoint; PDFs (file-picked
// or scanned) go async (multi-page capable) -- useAiUploadJob decides
// this itself from the file's mime type / the forceAsync flag.
//
// The multi-page scan uses `react-native-document-scanner-plugin`
// (Google ML Kit on Android, VisionKit on iOS) -- a SEPARATE native
// camera activity/view controller from this app's own
// `react-native-vision-camera`-based barcode/QR scanners
// (src/components/qrScanner, qrScanner2). Nothing here touches those
// files or shares any camera session/instance with them, so QR/barcode
// scanning elsewhere in the app is unaffected.
const AiUploadButton = ({label, job, extraFields, style, disabled}) => {
  const [scanning, set_scanning] = useState(false);
  const [previewFile, set_previewFile] = useState(null);
  const [pdfPreviewFile, set_pdfPreviewFile] = useState(null);
  const [pickerVisible, set_pickerVisible] = useState(false);
  const toFile = (uri, mime, name) => ({uri, type: mime, name});

  // Android only: this app's AndroidManifest already declares the CAMERA
  // permission (for other features), and the scanner plugin's own docs
  // say that's exactly the case where its native camera activity needs
  // the runtime permission requested explicitly first, or it fails with
  // "Permission Denial: starting Intent ... IMAGE_CAPTURE".
  const ensureCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // Scans, builds the combined PDF, then hands off to a PDF preview step
  // (below) instead of uploading right away -- same "see it, then confirm"
  // pattern as the camera-photo preview.
  const scanAndPreview = async () => {
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to scan documents.');
      return;
    }
    set_scanning(true);
    try {
      // No maxNumDocuments cap -- the plugin's own native UI already lets
      // the user keep capturing page after page until they tap its Done
      // action, which is exactly the "continuous until OK" flow asked for.
      const {scannedImages, status} = await DocumentScanner.scanDocument();
      console.log('GRNCHK_UPLOAD scanDocument result', JSON.stringify({status, pageCount: scannedImages?.length}));
      if (status !== 'success' || !scannedImages || scannedImages.length === 0) {
        return;
      }

      // The scanner's own crop is full camera resolution (often 3000-4000px
      // wide, near-lossless) -- embedding that straight into a PDF is what
      // produces multi-MB-per-page files. Down-scale + re-compress each
      // page to a size that's still perfectly legible for the AI extractor
      // (a printed/handwritten ticket, not a photograph needing fine detail)
      // before it goes into the PDF.
      const compressedImages = await Promise.all(
        scannedImages.map(async (imgPath, idx) => {
          try {
            const resized = await ImageResizer.createResizedImage(
              imgPath,
              1100,
              1500,
              'JPEG',
              45,
              0,
            );
            return resized.uri || resized.path;
          } catch (resizeErr) {
            console.log('GRNCHK_UPLOAD page compress error, using original', idx, resizeErr);
            return imgPath;
          }
        }),
      );
      console.log('GRNCHK_UPLOAD compressed pages', JSON.stringify(compressedImages));

      const pdfName = `grncheck_scan_${Date.now()}`;
      const {filePath} = await createPdf({imagePaths: compressedImages, name: pdfName, paperSize: 'A4'});
      console.log('GRNCHK_UPLOAD createPdf result', JSON.stringify({filePath}));
      try {
        const stat = await ReactNativeBlobUtil.fs.stat(filePath.replace('file://', ''));
        console.log('GRNCHK_UPLOAD final PDF size', JSON.stringify({sizeBytes: stat.size, sizeKB: Math.round(stat.size / 1024)}));
      } catch (statErr) {
        console.log('GRNCHK_UPLOAD could not stat final PDF', statErr);
      }
      const uri = filePath?.startsWith('file://') ? filePath : `file://${filePath}`;
      set_pdfPreviewFile(toFile(uri, 'application/pdf', `${pdfName}.pdf`));
    } catch (e) {
      console.log('scanAndPreview error', e);
      Alert.alert(Constant.DefaultAlert_MSG, 'Could not complete the document scan.');
    } finally {
      set_scanning(false);
    }
  };

  const confirmPdfPreviewUpload = async () => {
    const file = pdfPreviewFile;
    set_pdfPreviewFile(null);
    console.log('GRNCHK_UPLOAD source=MultiPageScan', JSON.stringify({file, extraFields}));
    if (file) await job.upload(file, extraFields, {forceAsync: true});
  };

  const retakePdfPreview = () => {
    set_pdfPreviewFile(null);
    scanAndPreview();
  };

  const cancelPdfPreview = () => set_pdfPreviewFile(null);

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    const perm =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const granted = await PermissionsAndroid.request(perm, {
      title: 'Storage Permission Required',
      message: 'This app needs access to your storage to download the PDF',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // Copies the already-generated (local) scan PDF to the device's Downloads
  // folder -- this is a plain file copy, not a network download, since the
  // PDF already exists on-device from createPdf() before any upload happens.
  const downloadPdfPreview = async () => {
    if (!pdfPreviewFile) return;
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to save the PDF.');
      return;
    }
    try {
      const sourcePath = pdfPreviewFile.uri.replace('file://', '');
      const destPath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/${pdfPreviewFile.name}`
          : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${pdfPreviewFile.name}`;
      await ReactNativeBlobUtil.fs.cp(sourcePath, destPath);
      Alert.alert(
        Constant.SuccessAlert_MSG,
        Platform.OS === 'android' ? `PDF saved successfully at ${destPath}` : 'PDF saved successfully',
      );
    } catch (e) {
      console.log('downloadPdfPreview error', e);
      Alert.alert(Constant.DefaultAlert_MSG, Constant.SERVICE_FAIL_PDF_MSG);
    }
  };

  // Camera capture goes to a preview-and-confirm step instead of uploading
  // straight away -- the user sees exactly what was captured and taps OK
  // (or Retake, to shoot again, or Cancel to abandon it) before anything
  // is sent to the server.
  const openCameraForPreview = async () => {
    try {
      const img = await ImageCropPicker.openCamera({mediaType: 'photo'});
      const name = `capture_${Date.now()}.jpg`;
      set_previewFile(toFile(img.path, img.mime || 'image/jpeg', name));
    } catch (e) {
      if (e?.code !== 'E_PICKER_CANCELLED') console.log('openCamera error', e);
    }
  };

  const confirmPreviewUpload = async () => {
    const file = previewFile;
    set_previewFile(null);
    console.log('GRNCHK_UPLOAD source=CameraPhoto', JSON.stringify({file, extraFields}));
    if (file) await job.upload(file, extraFields);
  };

  const retakePreview = () => {
    set_previewFile(null);
    openCameraForPreview();
  };

  const cancelPreview = () => set_previewFile(null);

  const pickFromGallery = async () => {
    try {
      const img = await ImageCropPicker.openPicker({mediaType: 'photo'});
      const name = `gallery_${Date.now()}.jpg`;
      const file = toFile(img.path, img.mime || 'image/jpeg', name);
      console.log('GRNCHK_UPLOAD source=Gallery', JSON.stringify({file, extraFields}));
      await job.upload(file, extraFields);
    } catch (e) {
      if (e?.code !== 'E_PICKER_CANCELLED') console.log('GRNCHK_UPLOAD openPicker error', e);
    }
  };

  const pickFile = async () => {
    try {
      const [doc] = await DocumentPicker.pick({type: [DocumentPicker.types.pdf]});
      const file = toFile(doc.fileCopyUri || doc.uri, doc.type || 'application/pdf', doc.name);
      console.log('GRNCHK_UPLOAD source=FilePicker', JSON.stringify({file, extraFields}));
      await job.upload(file, extraFields, {forceAsync: true});
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) console.log('GRNCHK_UPLOAD DocumentPicker error', e);
    }
  };

  // A custom modal, NOT Alert.alert -- Android's native Alert dialog only
  // ever renders 3 buttons (it silently drops anything past that, with no
  // error), so a 4-option-plus-Cancel source picker cannot be built on
  // Alert.alert on Android. This is a plain bottom-sheet-style list
  // instead, unbounded in option count.
  const SOURCE_OPTIONS = [
    {key: 'camera', label: 'Take Photo', onPress: openCameraForPreview},
    {key: 'gallery', label: 'Choose from Gallery', onPress: pickFromGallery},
    {key: 'file', label: 'Choose File (PDF)', onPress: pickFile},
    {key: 'scan', label: 'Scan Documents (Multi-page)', onPress: scanAndPreview},
  ];

  const pick = () => set_pickerVisible(true);

  const choosePickerOption = option => {
    set_pickerVisible(false);
    option.onPress();
  };

  const sourcePickerModal = (
    <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => set_pickerVisible(false)}>
      <TouchableOpacity
        style={styles.previewBackdrop}
        activeOpacity={1}
        onPress={() => set_pickerVisible(false)}>
        <View style={styles.pickerCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.previewTitle}>Upload Document</Text>
          <Text style={styles.pickerSubtitle}>Choose a source</Text>
          {SOURCE_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.key}
              style={styles.pickerOption}
              onPress={() => choosePickerOption(option)}>
              <Text style={styles.pickerOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.pickerCancel} onPress={() => set_pickerVisible(false)}>
            <Text style={styles.pickerCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const previewModal = (
    <Modal visible={!!previewFile} transparent animationType="fade" onRequestClose={cancelPreview}>
      <View style={styles.previewBackdrop}>
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Preview</Text>
          {previewFile ? (
            <Image source={{uri: previewFile.uri}} style={styles.previewImage} resizeMode="contain" />
          ) : null}
          <View style={styles.previewActionsRow}>
            <TouchableOpacity style={[styles.previewBtn, styles.previewBtnMuted]} onPress={cancelPreview}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.previewBtn, styles.previewBtnMuted]} onPress={retakePreview}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewBtn} onPress={confirmPreviewUpload}>
              <Text style={styles.buttonText}>OK, Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const pdfPreviewModal = (
    <Modal visible={!!pdfPreviewFile} transparent animationType="fade" onRequestClose={cancelPdfPreview}>
      <View style={styles.previewBackdrop}>
        <View style={styles.pdfPreviewCard}>
          <Text style={styles.previewTitle}>PDF Preview</Text>
          {pdfPreviewFile ? (
            <Pdf
              source={{uri: pdfPreviewFile.uri}}
              style={styles.pdfPreview}
              trustAllCerts={false}
              onError={e => console.log('Pdf preview error', e)}
            />
          ) : null}
          <View style={styles.previewActionsRow}>
            <TouchableOpacity style={[styles.previewBtn, styles.previewBtnMuted]} onPress={cancelPdfPreview}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.previewBtn, styles.previewBtnMuted]} onPress={retakePdfPreview}>
              <Text style={styles.buttonText}>Re-scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.previewBtn, styles.previewBtnMuted]} onPress={downloadPdfPreview}>
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewBtn} onPress={confirmPdfPreviewUpload}>
              <Text style={styles.buttonText}>OK, Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (scanning) {
    return (
      <>
        <View style={[styles.button, styles.buttonBusy, style]}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.buttonText}>Scanning document(s)...</Text>
        </View>
        {previewModal}
        {sourcePickerModal}
        {pdfPreviewModal}
      </>
    );
  }

  if (job.uploading) {
    return (
      <>
        <View style={[styles.button, styles.buttonBusy, style]}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.buttonText}>
            {job.progress
              ? Constant.GRNCHK_EXTRACTING_PROGRESS(job.progress.completedPages, job.progress.totalPages)
              : Constant.GRNCHK_UPLOAD_PROCESSING}
          </Text>
          {job.isAsyncJobRunning ? (
            <TouchableOpacity onPress={job.cancelJob} style={styles.cancelLink}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {previewModal}
        {sourcePickerModal}
        {pdfPreviewModal}
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.uploadTrigger, disabled && styles.uploadTriggerDisabled, style]}
        onPress={pick}
        disabled={disabled}>
        <UploadCloudIcon color={disabled ? '#9CA3AF' : '#4338CA'} size={16} />
        <Text style={[styles.uploadTriggerText, disabled && styles.uploadTriggerTextDisabled]}>
          {label || 'AI Doc Upload'}
        </Text>
      </TouchableOpacity>
      {previewModal}
      {sourcePickerModal}
      {pdfPreviewModal}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2979ff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBusy: {
    backgroundColor: '#607d8b',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Frosted-glass look for the idle "AI Doc Upload" trigger specifically:
  // the button's own color (#2979ff) moves to the text, and the
  // background becomes a translucent tint of that same color instead of
  // a solid fill, with a soft matching border for the glass edge.
  uploadTrigger: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#a5b4fc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  uploadTriggerText: {
    color: '#4338CA',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 6,
  },
  uploadTriggerDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  uploadTriggerTextDisabled: {
    color: '#9CA3AF',
  },
  cancelLink: {
    marginLeft: 8,
  },
  cancelLinkText: {
    color: '#ffcdd2',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCard: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  previewImage: {
    width: '100%',
    height: 320,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  previewActionsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  previewBtn: {
    flex: 1,
    backgroundColor: '#2979ff',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  previewBtnMuted: {
    backgroundColor: '#607d8b',
  },
  pickerCard: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
  },
  pickerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  pickerOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#000',
  },
  pickerCancel: {
    paddingVertical: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  pickerCancelText: {
    fontSize: 14,
    color: '#e53935',
    fontWeight: '600',
  },
  pdfPreviewCard: {
    width: '92%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
  },
  pdfPreview: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 6,
  },
});

export default AiUploadButton;
