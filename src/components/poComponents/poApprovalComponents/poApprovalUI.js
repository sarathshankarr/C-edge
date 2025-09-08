import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import * as Constant from '../../../utils/constants/constant';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {formatPrice} from '../../../utils/constants/constant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

const POApprovalUI = ({route, ...props}) => {
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploadedMediaFiles, setUploadedMediaFiles] = useState([]);
  const [loadMedia, setLoadMedia] = useState([]);
  const [showApporve, setShowApprove] = useState(true);
  const [poNumber, setPoNumber] = useState('');

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const approveAction = value => {
    if (showApporve) {
      props.approveAction(value);
    } else {
      props.backBtnAction();
    }
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const setRemarks = text => {
    props.set_remarks(text);
  };

  useEffect(() => {
    if (props.itemsObj) {
      // console.log('po ===> ', props.itemsObj);
      if (props?.itemsObj?.poFiles) {
        const filenames = props.itemsObj.poFiles.replace(/,+$/, '').split(',');

        const grnUrls = props.itemsObj?.grnImgFile || [];

        const result = filenames.map((name, index) => ({
          name,
          uri: `/usr/LibImages/${name}`,
          type: name.split('.').pop().toLowerCase(),
          url: grnUrls[index] || '',
        }));

        console.log('length ===> ', result?.length);
        setLoadMedia(result);
      }

      if (props.itemsObj.poNumberWithPrefix) {
        // console.log('apporval ===> ', props.itemsObj.poNumberWithPrefix);
        setPoNumber(props.itemsObj.poNumberWithPrefix);
      }
      if (props.itemsObj.approval) {
        console.log('apporval ===> ', props.itemsObj.approval);
        setShowApprove(props.itemsObj.approval === 0 ? true : false);
      }
    }
  }, [props.itemsObj]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardSpace(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardSpace(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

        // Check if adding these images would exceed the limit
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

  // const handleUpload = () => {
  //   Alert.alert(
  //     'Upload File',
  //     'What would you like to upload?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Documents/Audio',
  //         onPress: handleDocumentPicker,
  //       },
  //       {
  //         text: 'Images/Videos',
  //         onPress: handleImagePicker,
  //       },
  //     ],
  //     {cancelable: true},
  //   );
  // };

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

  const handleupload = async () => {
    const MAX_DOCUMENT = 10;
    const MAX_FILE_SIZE_MB = 1;

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

      const oversizedFiles = selectedDocs.filter(
        file => file.size && file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
      );

      if (oversizedFiles.length > 0) {
        Alert.alert(
          'File Too Large',
          `Each file must be less than ${MAX_FILE_SIZE_MB}MB. Please remove large files and try again.`,
        );
        return;
      }

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
        // User cancelled the picker, do nothing
      } else {
        console.error('Error picking documents:', error);
        Alert.alert('Error', 'Something went wrong while picking documents.');
      }
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

  //  const uploadFiles = () => {
  //     let formData = new FormData();

  //     // galleryImages.forEach((image, index) => {
  //     //   formData.append('files1', {
  //     //     uri: image.uri,
  //     //     type: image.mime || 'image/jpeg', // Default MIME type
  //     //     name: `image_${index}_${Date.now()}.jpg`,
  //     //   });
  //     // });
  //     galleryImages.forEach((media, index) => {
  //       const isVideo = media.mime?.startsWith('video');
  //       const extension = isVideo ? 'mp4' : 'jpg'; // You can enhance this based on actual mime if needed
  //       const name = `media_${index}_${Date.now()}.${extension}`;

  //       formData.append('files1', {
  //         uri: media.uri,
  //         type: media.mime || (isVideo ? 'video/mp4' : 'image/jpeg'), // Default MIME type
  //         name,
  //       });
  //     });

  //     documents.forEach((document, index) => {
  //       formData.append('files2', {
  //         uri: document.uri,
  //         type: document.type || 'application/pdf', // Default MIME type for PDFs
  //         name:
  //           document.name ||
  //           `document_${index}_${Date.now()}.${document.name.split('.').pop()}`,
  //       });
  //     });

  //     props.uploadMedia(formData);
  //   };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Approve Orders'}
          backBtnAction={() => backBtnAction()}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        style={{backgroundColor: 'white'}}>
        <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
          <View style={CommonStyles.headerStyle}>
            {/* <View style={{marginTop: hp('2%')}}>
              <Text
                style={{textAlign: 'left', fontWeight: '700', color: '#000'}}>
                {'PO# : '}
              </Text>
              <Text
                style={{fontWeight: '400', color: 'black', textAlign: 'left'}}>
                {poNumber || ''}
              </Text>
            </View> */}
            <View
              style={{
                marginTop: hp('2%'),
                marginBottom: hp('2%'),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '700', color: '#000'}}>{'PO# : '}</Text>
              <Text style={{fontWeight: '400', color: 'black'}}>
                {poNumber || ''}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                height: hp('8%'),
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {textAlign: 'center'},
                  ]}>
                  {'Issue Date'}
                </Text>
                <Text
                  style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
                  {props.startDate ? props.startDate : 'N/A'}
                </Text>
              </View>

              <View>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {textAlign: 'center'},
                  ]}>
                  {'Delivery Date'}
                </Text>
                <Text
                  style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
                  {props.deliveryDate ? props.deliveryDate : 'N/A'}
                </Text>
              </View>
            </View>

              <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {
                  alignItems: 'center',
                  marginLeft: 10,
                  backgroundColor: 'white',
                },
              ]}>
              {'Notes/Comments  :'}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'black',
                marginHorizontal: 10,
                marginTop: 15,
                borderRadius: 10,
                backgroundColor: 'white',
              }}>
              <TextInput
                placeholder=""
                autoCapitalize="none"
                multiline
                value={props.notes}
                onChangeText={text => props.set_notes(text)}
                style={[
                  styles.input,
                  Platform.OS === 'ios' && {paddingVertical: 20},
                ]}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp('2%'),
                backgroundColor: 'lightgray',
                paddingVertical: 5,
                paddingHorizontal: 5,
                borderRadius: 5,
              }}>
              <Text
                style={[
                  CommonStyles.tylesHeaderTextStyle,
                  {flex: 1.5, textAlign: 'left'},
                ]}>
                {'Item'}
              </Text>
              <Text
                style={[
                  CommonStyles.tylesHeaderTextStyle,
                  {flex: 1, textAlign: 'center'},
                ]}>
                {'Qty'}
              </Text>
              <Text
                style={[
                  CommonStyles.tylesHeaderTextStyle,
                  {flex: 1.5, textAlign: 'center'},
                ]}>
                {'Style'}
              </Text>
              <Text
                style={[
                  CommonStyles.tylesHeaderTextStyle,
                  {flex: 1, textAlign: 'right', marginRight: wp('2%')},
                ]}>
                {'Amount'}
              </Text>
            </View>

            <View style={[CommonStyles.listStyle1, {flex: 1}]}>
              <ScrollView nestedScrollEnabled={true}>
                {props?.itemsArray?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={true}
                    onPress={() => actionOnRow(item, index)}
                    style={CommonStyles.cellBackViewStyle}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          CommonStyles.tylesTextStyle,
                          {flex: 1.5, textAlign: 'left'},
                        ]}>
                        {item.itemdesc}
                        {item.color ? `(${item.color})` : ''}
                      </Text>
                      <Text
                        style={[
                          CommonStyles.tylesTextStyle,
                          {flex: 1, textAlign: 'center'},
                        ]}>
                        {item.itemQty}
                      </Text>
                      <Text
                        style={[
                          CommonStyles.tylesTextStyle,
                          {flex: 1.5, textAlign: 'center'},
                        ]}>
                        {item.styleName || ' N/A'}
                      </Text>
                      <Text
                        style={[
                          CommonStyles.tylesTextStyle,
                          {flex: 1, textAlign: 'right', marginRight: wp('2%')},
                        ]}>
                        {Number(item.amount).toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={{marginTop: 15}}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {textAlign: 'right', marginTop: 15},
              ]}>
              {props?.gstName
                ? 'Total GST    -  ' + props?.totalGstAmount.toFixed(2)
                : 'Total Tax Amount   -  ' + props?.totalGstAmount.toFixed(2)}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {textAlign: 'right', marginTop: 20},
              ]}>
              {'Total Amount -  ' +
                (Number(props?.itemDetails?.tcs) > 0
                  ? (
                      parseInt(props?.itemDetails?.tcs) +
                      parseInt(props?.itemDetails?.totalAmountIncludingGST)
                    ).toFixed(2)
                  : Number(props?.itemDetails?.totalAmountIncludingGST).toFixed(
                      2,
                    ))}
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              marginTop: 10,
              marginBottom: 30,
              width: '90%',
            }}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {
                  alignItems: 'center',
                  marginLeft: 10,
                  backgroundColor: 'white',
                },
              ]}>
              {'Remarks  :'}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'black',
                marginHorizontal: 10,
                marginTop: 15,
                borderRadius: 10,
                backgroundColor: 'white',
              }}>
              <TextInput
                placeholder=""
                autoCapitalize="none"
                multiline
                numberOfLines={3}
                value={props.remarks}
                onChangeText={text => setRemarks(text)}
                style={[
                  styles.input,
                  Platform.OS === 'ios' && {paddingVertical: 20},
                ]}
              />
            </View>

            <TouchableOpacity
              onPress={handleupload}
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
                  source={require('./../../../../assets/images/png/upload.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#333',
                  }}>
                  Upload
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
                                  source={require('./../../../../assets/images/png/play.png')}
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
                              <Text style={{color: '#fff', fontSize: 14}}>
                                ✕
                              </Text>
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
                              source={require('./../../../../assets/images/png/paper-pin.png')}
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
                                source={require('./../../../../assets/images/png/close.png')}
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
                marginBottom: 30,
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
                          source={require('./../../../../assets/images/png/paper-pin.png')}
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

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => downloadFile(doc)}>
                          <Image
                            source={require('./../../../../assets/images/png/download.png')}
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
                                      source={require('./../../../../assets/images/png/close.png')}
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

            <View style={{height: 150}} />
          </View>

        </View>
      </ScrollView>
      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Approve'}
          leftBtnTitle={showApporve ? 'Reject' : 'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={showApporve}
          isRightBtnEnable={showApporve}
          leftButtonAction={async () => approveAction(100)}
          rightButtonAction={async () => approveAction(101)}
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
    </KeyboardAvoidingView>
  );
};

export default POApprovalUI;

const styles = StyleSheet.create({
  input: {
    color: 'black',
  },
});
