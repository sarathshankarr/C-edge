import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import {ColorContext} from '../../colorTheme/colorTheme';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';
let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const SaveColorMasterUI = ({route, navigation, ...props}) => {
  const [colorName, set_colorName] = useState('');
  const [colorCode, set_colorCode] = useState('');
  const [colorDescription, set_colorDescription] = useState('');

  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      console.log('props for edit save ', props.itemsObj);
      if (props?.itemsObj?.umoType) {
        setUomType(props?.itemsObj?.umoType);
      }
      if (props?.itemsObj?.umoDescription) {
        setUomDescription(props?.itemsObj?.umoDescription);
      }
      if (props?.itemsObj?.workorderuom) {
        setWorkOrderUom(props?.itemsObj?.workorderuom);
      }
      if (props?.itemsObj?.fabuomvalue) {
        seFabricUom(props?.itemsObj?.fabuomvalue === 1 ? true : false);
      }
    }
  }, [props.itemsObj]);

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    let obj = {
      umoType: uomType,
      umoDescription: uomDescription,
      fabuomvalue: fabricUom ? 1 : 0,
      workorderuom: workOrderUom,
      umoId: props?.itemsObj?.umoId,
    };
    props.submitAction(obj);
  };

  const backAction = async () => {
    props.backBtnAction();
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
          title={'Edit Color Master'}
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
              label="Color Name *"
              value={colorName}
              mode="outlined"
              editable={props?.itemsObj?.colorName ? false : true}
              onChangeText={text => set_colorName(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Color Code "
              value={colorCode}
              mode="outlined"
              multiline
              numberOfLines={3}
              editable={props?.itemsObj?.colorCode ? false : true}
              onChangeText={text => set_colorCode(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Color Description"
              value={colorDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              editable={props?.itemsObj?.colorDescription ? false : true}
              onChangeText={text => set_colorDescription(text)}
            />
          </View>

          {/* <View  style={[styles.checkboxItem, {marginTop: hp('2%')}]}>
                <CustomCheckBox
                  isChecked={fabricUom}
                  onToggle={() => seFabricUom(!fabricUom)}
                />
                <Text style={styles.checkboxLabel}>{"Fabric UOM"}</Text>
          </View> */}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={false}
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

export default SaveColorMasterUI;

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
  });
