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

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const SaveSeasonMasterUI = ({route, navigation, ...props}) => {
  const [seasonGroupName, set_seasonGroupName] = useState("");
   const [seasonGroupDescription, set_seasonGroupDescription] = useState("");
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
    }
  }, [props.itemsObj]);

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    if (!outTime) {
      Alert.alert('Please Enter outTime  !');
      return;
    }
    if (props.itemsObj.fpt_menuOut_id === 608 && !fabricType) {
      Alert.alert('Please Enter  Fabric type');
      return;
    }

    let obj1 = {
      printedMtr: table_ip,
      printedmtrId: table[0]?.poft_id,
      totalPrintedMtr:
        Number(table[0]?.poft_tot_printed_mtr) +
        Number(table_ip ? table_ip : '0'),
      remainingPrint: table[0]?.poft_remaining_print,
      matchingId: table[0]?.poft_matcing_id,
    };
    const formatted_date = formatDateForSave(date);
    // let Obj=props?.itemsObj;
    // Obj.fpt_entry_date=formatted_date,
    // Obj.fpt_intime=inTime,
    // Obj.fpt_outtime=outTime,
    // Obj.fpt_machine_id=MachineNoId,
    // Obj.fpt_attendby_id=attendedById,
    // Obj.fpt_roll_trolley=rollNo,
    // Obj.fpt_fabricProcessed=fabricProcessed
    // Obj.Fpt_temparature = props.itemsObj.fpt_temparature;
    // Obj.previousqty =props?.itemsObj?.fpt_issued ;
    // Obj.inmenuId = props?.itemsObj?.fpt_menuIn_id;
    // Obj.fpt_printing_id =obj1?.printedmtrId;
    // Obj.fpt_matching_id = obj1?.matchingId;
    // Obj.fpt_order_id = props?.itemsObj?.fpt_order_id;
    // Obj.fpt_desing_id = props?.itemsObj?.fpt_desing_id;
    // Obj.sfpt_batchNo_id = props?.itemsObj?.fpt_batchNo_id;
    // Obj.printedMtr = Number(obj1?.printedMtr);
    // Obj.printedmtrId = obj1?.printedmtrId;
    // Obj.totalPrintedMtr = obj1?.totalPrintedMtr;
    // Obj.remainingPrint = obj1?.remainingPrint;
    // Obj.matchingId = obj1?.matchingId;
    // console.log("saving, table Obj ==> ", Obj.printedMtr,Obj.printedmtrId , Obj.remainingPrint,  Obj.totalPrintedMtr, Obj.matchingId);

    // console.log("condn for proccc ================> ", props?.itemsObj?.fpt_menuIn_id,Number(obj1?.printedMtr), props?.itemsObj?.fpt_menuIn_id===591  )
    let obj2 = {
      fpt_entry_date: formatted_date,
      fpt_machine_id: MachineNoId,
      fpt_attendby_id: attendedById,
      fpt_intime: inTime ? inTime : '',
      fpt_outtime: outTime ? outTime : '',
      Fpt_temparature: props.itemsObj.fpt_temparature,
      fpt_mcspeed: props.itemsObj.fpt_mcspeed,
      fpt_qty: props.itemsObj.fpt_qty,
      fpt_afterprocessedwidth: props?.itemsObj?.fpt_afterprocessedwidth,
      fpt_fabricProcessed:
        props?.itemsObj?.fpt_menuIn_id === 591
          ? Number(obj1?.printedMtr)
          : fabricProcessed,
      fpt_fabric_rejected: props?.itemsObj?.fpt_fabric_rejected,
      fpt_ph: props?.itemsObj?.fpt_ph,
      fpt_roll_trolley: props?.itemsObj?.fpt_roll_trolley,
      fpt_partyno: props?.itemsObj?.fpt_partyno,
      previousqty: props?.itemsObj?.fpt_issued,
      inmenuId: props?.itemsObj?.fpt_menuIn_id,
      fpt_menuOut_id: props?.itemsObj?.fpt_menuOut_id,
      printingId: props?.itemsObj?.printingId,
      fpt_printing_id: obj1?.printedmtrId,
      fpt_matching_id: obj1?.matchingId,
      fpt_order_id: props?.itemsObj?.fpt_order_id,
      fpt_desing_id: props?.itemsObj?.fpt_desing_id,
      fpt_batchNo_id: props?.itemsObj?.fpt_batchNo_id,
      fpt_pound: props?.itemsObj?.fpt_pound,
      fpt_shrinkage: props?.itemsObj?.fpt_shrinkage,
      fabricType: fabricType,
      fpt_freshPcs: Number(fresh),
      fpt_twoPcs: Number(twoPieces),
      fpt_printDamgePcs: Number(printDamagePieces),
      fpt_bgradePcs: Number(bGradePieces),
      fpt_fent: Number(fent),
      fpt_chindi: Number(chindi),
      fpt_steam: props?.itemsObj?.fpt_steam,
      fpt_speed: props?.itemsObj?.fpt_speed,
      fpt_weight: props?.itemsObj?.fpt_weight,
      fpt_yard: props?.itemsObj?.fpt_yard,
      fpt_glm: props?.itemsObj?.fpt_glm,
      fpt_shift_id: props?.itemsObj?.fpt_shift_id,
      printedMtr: Number(obj1?.printedMtr),
      printedmtrId: obj1?.printedmtrId,
      totalPrintedMtr: obj1?.totalPrintedMtr,
      remainingPrint: obj1?.remainingPrint,
      matchingId: obj1?.matchingId,
      templist: props?.itemsObj?.templist,
      applilist: props?.itemsObj?.applilist,
      niplist: props?.itemsObj?.niplist,
      stlist: props?.itemsObj?.stlist,
    };
    // console.log("REQ OBJ ========> ", obj2);
    props.submitAction(obj2);
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
          title={'Edit Season Group Master'}
          backBtnAction={() => backAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'),width: '100%'}}>
        <View
          style={{
            marginBottom: hp('5%'),
            // width: '100%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{marginTop: hp('2%')}}>
                     <TextInput
                       label="Season Group Name"
                       value={seasonGroupName}
                       mode="outlined"
                       onChangeText={text => set_seasonGroupName(text)}
                     />
                   </View>
                   <View style={{marginTop: hp('2%')}}>
                     <TextInput
                       label="Season Group Description"
                       value={seasonGroupDescription}
                       mode="outlined"
                       onChangeText={text => set_seasonGroupDescription(text)}
                     />
                   </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={
            props.itemsObj.fpt_fabricProcessed +
              props.itemsObj.fpt_fabric_rejected !==
            props.itemsObj.fpt_issued
          }
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

export default SaveSeasonMasterUI;

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
  });