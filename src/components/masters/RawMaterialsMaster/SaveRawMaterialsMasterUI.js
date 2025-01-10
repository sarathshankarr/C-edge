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
const SaveRawMaterialsMasterUI = ({route, navigation, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      // if (props.itemsObj.datestr) {
      //   setDate(props.itemsObj.datestr);
      // }
      // if (props.itemsObj.machineNosMap) {
      //   const menuID = props.itemsObj.fpt_machine_id.toString();
      //   set_MachineNoName(props?.itemsObj?.machineNosMap[menuID]);
      //   set_MachineNoId(props.itemsObj.fpt_machine_id.toString());
      //   setMachineNoList(props.itemsObj.machineNosMap);
      //   set_filteredmachineNo(Object.keys(props.itemsObj.machineNosMap || {}));
      // }
    }
  }, [props.itemsObj]);

  const [rawMaterialName, setRawMaterialName] = useState('');
  const [hsn, setHsn] = useState('');
  const [gstRate, setGstRate] = useState('');

  // Raw Material Type
  const [rawMaterialTypeList, setRawMaterialTypeList] = useState([]);
  const [filteredRawMaterialType, set_filteredRawMaterialType] = useState([]);
  const [showRawMaterialTypeList, set_showRawMaterialTypeList] =
    useState(false);
  const [rawMaterialTypeName, set_rawMaterialTypeName] = useState('');
  const [rawMaterialTypeId, set_rawMaterialTypeId] = useState('');

  const actionOnRawMaterialType = item => {
    set_rawMaterialTypeId(item.id);
    set_rawMaterialTypeName(item.name);
    set_showRawMaterialTypeList(false);
  };

  const handleSearchRawMaterialType = text => {
    if (text.trim().length > 0) {
      const filtered = rawMaterialTypeList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredRawMaterialType(filtered);
    } else {
      set_filteredRawMaterialType(rawMaterialTypeList);
    }
  };

  // Location
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, set_filteredLocation] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationName, set_locationName] = useState('');
  const [locationId, set_locationId] = useState('');

  const actionOnLocation = item => {
    set_locationId(item.id);
    set_locationName(item.name);
    set_showLocationList(false);
  };

  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = locationList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(locationList);
    }
  };

  // Color
  const [colorList, setColorList] = useState([]);
  const [filteredColor, set_filteredColor] = useState([]);
  const [showColorList, set_showColorList] = useState(false);
  const [colorName, set_colorName] = useState('');
  const [colorId, set_colorId] = useState('');

  const actionOnColor = item => {
    set_colorId(item.id);
    set_colorName(item.name);
    set_showColorList(false);
  };

  const handleSearchColor = text => {
    if (text.trim().length > 0) {
      const filtered = colorList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredColor(filtered);
    } else {
      set_filteredColor(colorList);
    }
  };

  // UOM (Unit of Measurement)
  const [uomList, setUOMList] = useState([]);
  const [filteredUOM, set_filteredUOM] = useState([]);
  const [showUOMList, set_showUOMList] = useState(false);
  const [uomName, set_uomName] = useState('');
  const [uomId, set_uomId] = useState('');

  const actionOnUOM = item => {
    set_uomId(item.id);
    set_uomName(item.name);
    set_showUOMList(false);
  };

  const handleSearchUOM = text => {
    if (text.trim().length > 0) {
      const filtered = uomList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredUOM(filtered);
    } else {
      set_filteredUOM(uomList);
    }
  };

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
          title={'Save Raw Materials Master'}
          backBtnAction={() => backAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                set_showRawMaterialTypeList(!showRawMaterialTypeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        rawMaterialTypeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Raw Material Type *  '}
                    </Text>
                    {rawMaterialTypeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {rawMaterialTypeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showRawMaterialTypeList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchRawMaterialType}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredRawMaterialType.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredRawMaterialType.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnRawMaterialType(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Raw Material Name *"
              value={rawMaterialName}
              mode="outlined"
              onChangeText={text => setRawMaterialName(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="GST Rate(%) *"
              value={gstRate}
              mode="outlined"
              onChangeText={text => setGstRate(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="HSN *"
              value={hsn}
              mode="outlined"
              onChangeText={text => setHsn(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                set_showLocationList(!showLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        locationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Raw Material Type *  '}
                    </Text>
                    {locationName ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {locationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnLocation(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                set_showColorList(!showColorList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        colorId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Color *  '}
                    </Text>
                    {colorId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {colorName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showColorList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchColor}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredColor.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredColor.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnColor(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                set_showUOMList(!showUOMList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        uomId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'UOM *  '}
                    </Text>
                    {uomId ? (
                      <Text style={[styles.dropTextInputStyle]}>{uomName}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showUOMList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchUOM}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredUOM.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredUOM.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnUOM(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{height: 100}} />
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

export default SaveRawMaterialsMasterUI;

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
