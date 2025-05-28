import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../utils/constants/constant';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import {ColorContext} from '../colorTheme/colorTheme';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
import ReactNativeBlobUtil from 'react-native-blob-util';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const SaveGoodsReceiptNoteUI = ({route, navigation, ...props}) => {
  const [po, setPo] = useState('');
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState('');
  const [itemOrTrims, setItemOrTrims] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [totalTax, set_totaTax] = useState(0);
  const [selectCheckboxes, set_selectCheckboxes] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadMedia, setLoadMedia] = useState([]);
  const [uploadedMediaFiles, setUploadedMediaFiles] = useState([]);

  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      // console.log('save grn approvve ', props.itemsObj);

      if (props.itemsObj.pomaster) {
        if (props.itemsObj.pomaster.poNumberWithSymbol) {
          setPo(props.itemsObj.pomaster.poNumberWithSymbol);
        }

        if (props.itemsObj.pomaster.createionDateStr) {
          setDate(props.itemsObj.pomaster.createionDateStr);
        }
        if (props.itemsObj.pomaster.itemTrimsType) {
          setItemOrTrims(props.itemsObj.pomaster.itemTrimsType);
        }
        // if (props.itemsObj.grnImgFile) {
        //   console.log("============> ", props.itemsObj.grnImgFile);
        // }

        if (props.itemsObj.pomaster.grnpdf) {
          const filenames = props.itemsObj.pomaster.grnpdf
            .replace(/,+$/, '')
            .split(',');

            const grnUrls = props.itemsObj?.grnImgFile  || [];

          const result = filenames.map((name, index) => ({
            name,
            uri: `/usr/LibImages/${name}`,
            type: name.split('.').pop().toLowerCase(),
            url: grnUrls[index] || '',
          }));

          console.log('length ===> ', result?.length);
          setLoadMedia(result);
        }
        if (props.itemsObj.pomaster.companyName) {
          setShipTo(props.itemsObj.pomaster.companyName);
        }
        if (
          props.itemsObj.pomaster.transportCost ||
          props.itemsObj.pomaster.additional_cost ||
          props.itemsObj.pomaster.poTcs
        ) {
          const {transportCost, additional_cost, poTcs} =
            props.itemsObj.pomaster;

          const total =
            (parseFloat(transportCost) || 0) +
            (parseFloat(additional_cost) || 0) +
            (parseFloat(poTcs) || 0);

          if (total > 0) set_totaTax(total);
        }
        if (props.itemsObj.pomaster.poMasterChildMappingDao) {
          const dataMap = props.itemsObj.pomaster.poMasterChildMappingDao;
          // console.log('save grn approvve  child ', dataMap);

          const childMap = dataMap.map((item, index) => ({
            roll: item.rollNo,
            requiredQty: item.quantitystr,
            remainingQty: item.remQty,
            enteredQty: item.recqty,
            presentReceivedQty: item.receivedQty,
            fabric: item.fabrecqty,
            price: item.price,
            grnNo: item.grnUniqueNo,
            gstPercent: item.gstper,
            itemRate: item.itemratestr,
            discountAccount: item.discAmnt,
            gst: item.gstamntstr,
            total: item.totalWithGst,
            fabric: item.itemdesc,
          }));

          setRows(childMap);
        }
      }
    }
  }, [props.itemsObj]);

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    let obj = {
      vendorId: props.itemsObj.pomaster.vendorId,
      shiploc: 2,
      additional_cost: 0,
      itemTrimsType: itemOrTrims,
      notes: '',
      contactId: 0,
      vendorCustomerId: 2,
      transportCost: 0,
      poNumber: 212,
      posave: 2,
      p_conv_rate: 0.0,
      buyerno: '',
      dispatch: '',
      roundOff: 0.0,
      isCustStyleWise: 0,
      additionalAmount: 0,
      poTcs: 21.0,
      seqIdForStyle: '',
      modify_user: '',
      styleOrBuyerpo: 0,
      referenceDateStr: '',
      referenceDate: '2025-03-06',
      gateno: '',
      grn_totamnt: 1071.0,
      itemStr:
        '295#100.0#1#477#Fabric##0.0##0#10.0000#0#App#0#0#0#0#5#1000.00#50.00#0#0.00#0##0#0,',
    };
    props.submitAction(obj);
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const totalItemRate = rows.reduce(
    (sum, item) => sum + parseFloat(item.itemRate || 0),
    0,
  );
  const totalDiscount = rows.reduce(
    (sum, item) => sum + parseFloat(item.discountAccount || 0),
    0,
  );
  const totalGst = rows.reduce(
    (sum, item) => sum + parseFloat(item.gst || 0),
    0,
  );
  const totalAmount = rows.reduce(
    (sum, item) => sum + parseFloat(item.total || 0),
    0,
  );
  const totalpresentReceivedQty = rows.reduce(
    (sum, item) => sum + parseFloat(item.presentReceivedQty || 0),
    0,
  );

  const handleImagePicker = () => {
    const MAX_IMAGES = 10;

    if (galleryImages.length >= MAX_IMAGES) {
      Alert.alert(
        'Limit Reached',
        `You can only upload up to ${MAX_IMAGES} images.`,
      );
      return;
    }
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'any',
    })
      .then(images => {
        const newImages = images.map(image => ({
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        }));

        if (galleryImages.length + newImages.length > MAX_IMAGES) {
          Alert.alert(
            'Limit Exceeded',
            `You can only upload up to ${MAX_IMAGES} images in total.`,
          );
        } else {
          setGalleryImages(prevImages => [...prevImages, ...newImages]);
        }
      })
      .catch(error => {
        console.error('Error picking images:', error);
      });
  };

  const removeImage = (index, imageType) => {
    if (imageType === 'selfie') {
      setSelfieImages(selfieImages.filter((_, i) => i !== index));
    } else if (imageType === 'gallery') {
      setGalleryImages(galleryImages.filter((_, i) => i !== index));
    } else if (imageType === 'document') {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const handleDocumentPicker = async () => {
    const MAX_DOCUMENT = 10;

    if (documents.length >= MAX_DOCUMENT) {
      Alert.alert(
        'Limit Reached',
        `You can only upload up to ${MAX_DOCUMENT} documents.`,
      );
      return;
    }

    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.audio,
          DocumentPicker.types.allFiles,
        ],
      });

      // Process the selected documents
      const selectedDocs = Array.isArray(res) ? res : [res];

      for (let doc of selectedDocs) {
        const fileType = doc.name?.split('.').pop()?.toLowerCase();
      }

      // Check if adding these documents exceeds the limit
      const newDocuments = [...documents, ...selectedDocs];
      if (newDocuments.length > MAX_DOCUMENT) {
        Alert.alert(
          'Limit Exceeded',
          `You can only upload up to ${MAX_DOCUMENT} documents.`,
        );
        return;
      }

      // Add documents to state if all files are supported and within limit
      setDocuments(newDocuments);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User canceled the document picker
      } else {
        console.error('Error picking document:', error);
      }
    }
  };

  const handleUpload = () => {
    Alert.alert(
      'Upload File',
      'What would you like to upload?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Documents/Audio',
          onPress: handleDocumentPicker,
        },
        {
          text: 'Images/Videos',
          onPress: handleImagePicker,
        },
      ],
      {cancelable: true},
    );
  };

  const handleupload2 = async () => {
    const MAX_DOCUMENT = 10;

    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.audio,
          DocumentPicker.types.allFiles,
        ],
        allowMultiSelection: true,
      });

      const selectedDocs = Array.isArray(res) ? res : [res];

      const totalDocs = uploadedMediaFiles.length + selectedDocs.length;
      if (totalDocs > MAX_DOCUMENT) {
        Alert.alert(
          'Limit Exceeded',
          `You can only upload up to ${MAX_DOCUMENT} documents.`,
        );
        return;
      }

      setUploadedMediaFiles(prev => [...prev, ...selectedDocs]);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        console.error('Error picking documents:', error);
        Alert.alert('Error', 'Something went wrong while picking documents.');
      }
    }
  };

  const openFile = file => {
    if (file.url) {
      Linking.openURL(file.url);
    } else {
      Alert.alert('Download Error', 'File URI is invalid.');
    }
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Storage Permission Required',
              message: 'This app needs access to your media to download files',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else if (Platform.Version >= 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message:
                'This app needs access to your storage to download files',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);
          return (
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED
          );
        }
      }
      return true;
    } catch (err) {
      console.warn('Error requesting storage permission:', err);
      return false;
    }
  };

  const getMimeType = extension => {
    const mimeTypes = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      zip: 'application/zip',
      txt: 'text/plain',
      csv: 'text/csv',
      // Add more types as needed
    };
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  };

  const downloadFile = async doc => {
    try {
      const hasPermission =
        Platform.OS === 'android' ? await requestStoragePermission() : true;
      if (!hasPermission) return;

      const {fs} = ReactNativeBlobUtil;
      const fileName = doc.name || 'downloaded_file';
      const url = doc.url;
      const fileExtension = fileName.split('.').pop();
      const filePath = `/storage/emulated/0/Download/${fileName}`;

      console.log('doenload ==> ', fileName, url);

      const mimeType = getMimeType(fileExtension);

      const res = await ReactNativeBlobUtil.config({
        path: filePath,
        fileCache: true,
        appendExt: fileExtension,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: `Downloading ${fileName}`,
          mime: mimeType,
          mediaScannable: true,
        },
      }).fetch('GET', url);

      Alert.alert('Download Success', `File downloaded to: ${filePath}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', `Failed to download file: ${error.message}`);
    }
  };

  const uploadFiles1 = () => {
    let formData = new FormData();

    galleryImages.forEach((media, index) => {
      const isVideo = media.mime?.startsWith('video');
      const extension = isVideo ? 'mp4' : 'jpg';
      const name = `media_${index}_${Date.now()}.${extension}`;

      formData.append('files1', {
        uri: media.uri,
        type: media.mime || (isVideo ? 'video/mp4' : 'image/jpeg'),
        name,
      });
    });

    documents.forEach((document, index) => {
      formData.append('files2', {
        uri: document.uri,
        type: document.type || 'application/pdf', // Default MIME type for PDFs
        name:
          document.name ||
          `document_${index}_${Date.now()}.${document.name.split('.').pop()}`,
      });
    });

    props.uploadMedia(formData);
  };

  const uploadFiles = () => {
    let formData = new FormData();

    uploadedMediaFiles.forEach((file, index) => {
      // Determine the MIME type
      const mimeType = file.mime || file.type || 'application/octet-stream';

      // Determine file extension
      let extension = 'bin';
      if (file.name) {
        const parts = file.name.split('.');
        if (parts.length > 1) {
          extension = parts.pop().toLowerCase();
        }
      } else if (mimeType.startsWith('image/')) {
        extension = 'jpg';
      } else if (mimeType.startsWith('video/')) {
        extension = 'mp4';
      } else if (mimeType.startsWith('audio/')) {
        extension = 'mp3';
      } else if (mimeType === 'application/pdf') {
        extension = 'pdf';
      } else if (mimeType.includes('msword')) {
        extension = 'doc';
      } else if (mimeType.includes('officedocument')) {
        extension = 'docx';
      }

      // Determine the name
      const name = file.name || `file_${index}_${Date.now()}.${extension}`;

      const uri = file.uri || file.fileCopyUri;

      if (!uri) {
        console.warn(`Skipping file at index ${index} due to missing URI.`);
        return;
      }

      formData.append('files', {
        uri,
        type: mimeType,
        name,
      });
    });

    props.uploadMedia(formData);
  };

  const removeUploadedMedia = indexToRemove => {
    setUploadedMediaFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Edit Goods Receipt Notes'}
          backBtnAction={() => backAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'), width: '100%'}}>
        <View
          style={{
            marginBottom: hp('5%'),
            // width: '100%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="PO#"
              value={po}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Date"
              value={date}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="ITEM/TRIMS"
              value={itemOrTrims}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Ship To"
              value={shipTo}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={{width: 100}}>
                    <View
                      style={[
                        styles.checkboxItem,
                        {
                          // marginTop: hp('2%'),
                          // marginBottom: hp('2%'),
                          flex: 0.5,
                        },
                      ]}>
                      <CustomCheckBox
                        isChecked={selectCheckboxes}
                        onToggle={() => set_selectCheckboxes(!selectCheckboxes)}
                      />
                    </View>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Roll No/Lot.</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Required Qty</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Rem Qty/Entered Qty
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Present Received
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Fabric</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Price</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>GRN No</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>GST%</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Item Rate</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Disc. Amount</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>GST</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Total</Text>
                  </View>
                </View>
                {rows.map((row, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{width: 100}}>
                      <View
                        style={[
                          styles.checkboxItem,
                          {
                            // marginTop: hp('1%'),
                            // marginBottom: hp('2%'),
                            flex: 0.5,
                          },
                        ]}>
                        <CustomCheckBox
                          isChecked={false}
                          // isChecked={selectedIdxs.includes(index)}
                          onToggle={() => console.log(index)}
                        />
                      </View>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.roll}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.requiredQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {row.remainingQty}/{row.enteredQty}
                      </Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {row.presentReceivedQty}
                      </Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.fabric}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.price}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.grnNo}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.gstPercent}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.itemRate}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {row.discountAccount}
                      </Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.gst}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.total}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.table_body_single_row}>
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={{width: 100}} />
                  ))}
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>
                      {totalpresentReceivedQty.toFixed(2)}
                    </Text>
                  </View>
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={{width: 100}} />
                  ))}
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>
                      {totalItemRate.toFixed(2)}
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>
                      {totalDiscount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>{totalGst.toFixed(2)}</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>
                      {totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.table_body_single_row}>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>{'Total'}</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_data}>
                      {(
                        parseFloat(totalAmount || 0) + parseFloat(totalTax || 0)
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={handleupload2}
            style={{
              borderRadius: 12,
              backgroundColor: '#f8f8f8',
              paddingVertical: 20,
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 4,
              marginVertical: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'contain',
                  marginBottom: 10,
                }}
                source={require('./../../../assets/images/png/upload.png')}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333',
                }}>
                Upload Images
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{marginTop: hp('2%')}}>
            {uploadedMediaFiles.length > 0 && (
              <>
                {/* Images & Videos Horizontal Scroll View */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{paddingLeft: 10}}>
                  {uploadedMediaFiles
                    .filter(
                      file =>
                        (file.type || file.mime)?.startsWith('image/') ||
                        (file.type || file.mime)?.startsWith('video/'),
                    )
                    .map((item, index) => {
                      const isVideo =
                        item.mime?.startsWith('video/') ||
                        item.uri?.endsWith('.mp4');
                      return (
                        <View
                          key={index}
                          style={{
                            marginRight: 10,
                            position: 'relative',
                            borderRadius: 10,
                            overflow: 'hidden',
                            width: 100,
                            height: 130,
                            alignItems: 'center',
                          }}>
                          <View style={{width: 100, height: 100}}>
                            <Image
                              source={{uri: item.uri || item.fileCopyUri}}
                              style={{
                                width: 100,
                                height: 100,
                                resizeMode: 'cover',
                              }}
                            />
                            {isVideo && (
                              <Image
                                source={require('./../../../assets/images/png/play.png')}
                                style={{
                                  position: 'absolute',
                                  top: '35%',
                                  left: '35%',
                                  width: 30,
                                  height: 30,
                                  opacity: 0.8,
                                  resizeMode: 'contain',
                                }}
                              />
                            )}
                          </View>

                          <TouchableOpacity
                            onPress={() => removeUploadedMedia(index)}
                            style={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              borderRadius: 12,
                              width: 24,
                              height: 24,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text style={{color: '#fff', fontSize: 14}}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </ScrollView>

                {/* Other Media (PDF, DOC, Audio, etc.) Vertical List */}
                <View style={{marginVertical: 10, paddingHorizontal: 10}}>
                  {uploadedMediaFiles
                    .filter(
                      file =>
                        !(
                          file.mime?.startsWith('image/') ||
                          file.mime?.startsWith('video/')
                        ),
                    )
                    .map((doc, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#fff',
                          borderRadius: 12,
                          padding: 15,
                          marginVertical: 6,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.1,
                          shadowRadius: 5,
                          elevation: 3,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Image
                            source={require('./../../../assets/images/png/paper-pin.png')}
                            style={{
                              width: 28,
                              height: 28,
                              resizeMode: 'contain',
                            }}
                          />
                          <Text
                            numberOfLines={1}
                            style={{
                              marginLeft: 10,
                              fontSize: 16,
                              fontWeight: '500',
                              color: '#333',
                              flexShrink: 1,
                            }}>
                            {doc.name}
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            onPress={() => removeUploadedMedia(index)}>
                            <Image
                              source={require('./../../../assets/images/png/close.png')}
                              style={{
                                width: 20,
                                height: 20,
                                resizeMode: 'contain',
                                marginHorizontal: 5,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={uploadFiles}
            style={{
              borderRadius: 12,
              backgroundColor: '#f8f8f8',
              paddingVertical: 15,
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 4,
              marginVertical: 10,
              marginTop: 30,
              marginBottom:30
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
              }}>
              Submit
            </Text>
          </TouchableOpacity>

          <View style={{marginVertical: 10, paddingHorizontal: 10}}>
            {loadMedia.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: 10,
                  }}>
                  Uploaded Files
                </Text>
                {loadMedia.map((doc, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      padding: 15,
                      marginVertical: 6,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.1,
                      shadowRadius: 5,
                      elevation: 3,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        marginRight: 10,
                      }}>
                      <Image
                        source={require('./../../../assets/images/png/paper-pin.png')}
                        style={{width: 28, height: 28, resizeMode: 'contain'}}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: '500',
                          color: '#333',
                          flexShrink: 1,
                        }}>
                        {doc.name}
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity onPress={() => downloadFile(doc)}>
                        <Image
                          source={require('./../../../assets/images/png/download.png')}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginHorizontal: 5,
                          }}
                        />
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                        onPress={() => removeImage(index, 'document')}>
                        <Image
                          source={require('./../../../assets/images/png/close.png')}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginHorizontal: 5,
                          }}
                        />
                      </TouchableOpacity> */}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => submitAction()}
          leftButtonAction={async () => backAction()}
        />
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={() => popOkBtnAction()}
            popUpLeftBtnAction={() => popCancelBtnAction()}
          />
        </View>
      ) : null}

      {props.isLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default SaveGoodsReceiptNoteUI;

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      // borderTopRightRadius: 15,
      // borderTopLeftRadius: 15,
      alignItems: 'center',
    },
    popSearchViewStyle1: {
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      alignItems: 'center',
    },

    flatcontainer: {
      flex: 1,
    },

    flatview: {
      height: hp('8%'),
      marginBottom: hp('0.3%'),
      alignContent: 'center',
      justifyContent: 'center',
      borderBottomColor: 'black',
      borderBottomWidth: wp('0.1%'),
      width: wp('80%'),
      alignItems: 'center',
    },

    SectionStyle1: {
      flexDirection: 'row',
      // justifyContent: "center",
      alignItems: 'center',
      height: hp('7%'),
      width: wp('75%'),
      borderRadius: hp('0.5%'),
      // alignSelf: "center",
      // backgroundColor: "grey",
    },

    imageStyle: {
      // margin: "4%",
      height: wp('12%'),
      aspectRatio: 1,
      marginRight: wp('8%'),
      resizeMode: 'stretch',
    },

    dropTextInputStyle: {
      fontWeight: 'normal',
      fontSize: 18,
      marginLeft: wp('4%'),
      color: 'black',
      width: wp('80%'),
    },

    dropTextLightStyle: {
      fontWeight: 300,
      fontSize: 12,
      width: wp('60%'),
      alignSelf: 'flex-start',
      marginTop: hp('1%'),
      marginLeft: wp('4%'),
      color: '#000',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      // flex: 1,
      marginTop: hp('2%'),
      width: '100%',
      // paddingHorizontal: 10,
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      alignItems: 'center',
    },
    table_data: {
      fontSize: 11,
      color: '#000',
      alignItems: 'center',
    },
    table: {
      // margin: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
    },
    searchInput: {
      marginTop: 10,
      borderRadius: 10,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginHorizontal: 10,
      paddingLeft: 10,
      marginBottom: 10,
      color: '#000000',
    },
    scrollView: {
      maxHeight: 150,
    },
    dropdownOption: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    dropdownContent1: {
      elevation: 5,
      // height: 220,
      maxHeight: 220,
      alignSelf: 'center',
      width: '98%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
    },
    noCategoriesText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
    },
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%', // Adjust width for better alignment
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
    uploadanyimg: {
      width: 65,
      height: 65,
      marginLeft: 10,
    },
    imagePreviewContainer: {
      flexDirection: 'row',
      marginVertical: 5,
    },
    imagePreview: {
      width: 70,
      height: 70,
      marginHorizontal: 5,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
    },
    removeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    removeButton: {
      position: 'absolute',
      top: 0, // Position the button at the top edge of the image
      right: 0, // Align the button to the right edge
      backgroundColor: 'gray',
      borderRadius: 15,
      width: 25,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadSection: {
      marginTop: 16,
      marginBottom: 20,
      marginHorizontal: 10,
    },
    documentItem: {
      justifyContent: 'center',
    },
    removeButton1: {
      position: 'absolute',
      top: 0, // Position the button at the top edge of the image
      right: 5, // Align the button to the right edge
      backgroundColor: 'gray',
      borderRadius: 15,
      width: 25,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

{
  /* <View style={styles.uploadSection}>
            {documents.length > 0 && (
              <View>
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginHorizontal: 10,
                      }}>
                      {doc.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton1}
                      onPress={() => removeImage(index, 'document')}>
                      <Text>x</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View> */
}

{
  /* <View style={{marginTop: hp('2%')}}>
            {galleryImages.length > 0 && (
              <ScrollView horizontal style={styles.imagePreviewContainer}>
                {galleryImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{uri: image.uri}}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index, 'gallery')}>
                      <Text style={styles.removeButtonText}>x</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View> */
}
