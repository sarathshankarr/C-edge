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
const SaveFabricProcessInUI = ({route, navigation, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      // console.log("Props from data =========> ", props.itemsObj);

      if (props.itemsObj.inOutTimesMap) {
        const inOutTimesMapList = Object.keys(props.itemsObj.inOutTimesMap).map(
          key => ({
            id: key,
            name: props.itemsObj.inOutTimesMap[key],
          }),
        );

        if(props.itemsObj.fpt_outtime){
          const menuID = props.itemsObj.fpt_outtime.toString();
          setOutTimeName(props?.itemsObj?.inOutTimesMap[menuID]);
          setOutTimeId(props.itemsObj.fpt_outtime.toString());
        }
        if(props.itemsObj.fpt_intime){
          const menuID = props.itemsObj.fpt_intime.toString();
          setInTimeName(props?.itemsObj?.inOutTimesMap[menuID]);
          setInTimeId(props.itemsObj.fpt_intime.toString());
        }

        setFilteredOutTime(inOutTimesMapList);
        setFilteredInTime(inOutTimesMapList);
        setInTimeList(inOutTimesMapList);
        setOutTimeList(inOutTimesMapList);
      }

      if (props.itemsObj.processMap) {
        const menuID = props.itemsObj.fpt_menuOut_id.toString();
        console.log('menuID =========> ', menuID);
        set_processName(props?.itemsObj?.processMap[menuID]);
        if (menuID === '590') {
          set_editFabricIssued(false);
          console.log('setted false');
        }
      }
      if (props.itemsObj.datestr) {
        setDate(props.itemsObj.datestr);
      }
      // if (props.itemsObj.fpt_outtime) {
      //   set_outTime(props.itemsObj.fpt_outtime);
      // }
      // if (props.itemsObj.fpt_intime) {
      //   set_inTime(props.itemsObj.fpt_intime);
      // }
      if (props.itemsObj.fpt_shift_id) {
        console.log(
          'Shiift id ====> ',
          menuID,
          props?.itemsObj?.shiftMap[menuID],
        );
        const menuID = props.itemsObj.fpt_shift_id.toString();
        set_shift(props?.itemsObj?.shiftMap[menuID]);
      }
      if (props.itemsObj.fpt_lot_no) {
        set_lotNo(props.itemsObj.fpt_lot_no);
      }
      if (props.itemsObj.fpt_roll_trolley) {
        set_rollNo(props.itemsObj.fpt_roll_trolley);
      }
      if (props.itemsObj.fpt_issued) {
        set_fabricIssued(props.itemsObj.fpt_issued);
      }
      if (props.itemsObj.fpt_batch_id) {
        set_batch(props.itemsObj.fpt_batch_id);
      }
      if (props.itemsObj.batchname) {
        set_batchNoName(props.itemsObj.batchname);
      }
      if (props.itemsObj.machineNosMap) {
        const menuID = props.itemsObj.fpt_machine_id.toString();
        set_MachineNoName(props?.itemsObj?.machineNosMap[menuID]);
        set_MachineNoId(props.itemsObj.fpt_machine_id.toString());
        setMachineNoList(props.itemsObj.machineNosMap);
        set_filteredmachineNo(Object.keys(props.itemsObj.machineNosMap || {}));
      }
      if (props.itemsObj.empMap) {
        const menuID = props.itemsObj.fpt_attendby_id.toString();
        set_attendedByName(props?.itemsObj?.empMap[menuID]);
        set_attendedById(props.itemsObj.fpt_attendby_id.toString());
        setAttendedByList(props.itemsObj.empMap);
        set_filteredattendedBy(Object.keys(props.itemsObj.empMap || {}));
      }
      if (props.itemsObj.fabricname) {
        set_fabricNo(props.itemsObj.fabricname);
      }
      if (props.itemsObj.fpt_qty) {
        set_quality(props.itemsObj.fpt_qty);
      }
      if (props.itemsObj.orderNo) {
        set_OrderNo(props.itemsObj.orderNo);
      }
      if (props.itemsObj.designNo) {
        set_designNO(props.itemsObj.designNo);
      }
      if (props.itemsObj.matchname) {
        set_machineNo(props.itemsObj.matchname);
      }
      if (props?.itemsObj?.fabricType) {
        setFabricType(props?.itemsObj?.fabricType);
      }
      if (props.itemsObj.fabricPrintingOrderFormDAO) {
        settable(props.itemsObj.fabricPrintingOrderFormDAO);
      }
      if (props.itemsObj.fpt_menuOut_id) {
        // console.log("entering menuout id ", props.itemsObj.fpt_menuOut_id === 608, props.itemsObj.fpt_menuOut_id)
        if (props.itemsObj.fpt_menuOut_id === 608) {
          set_edit6fields(true);
        }
      }
      console.log(
        'priting id   ',
        props.itemsObj.printingId,
        //   props.itemsObj.fpt_fabricProcessed,
        //   props.itemsObj.fpt_fabric_rejected,
        //   props.itemsObj.fpt_issued,
        //   props.itemsObj.fpt_fabricProcessed + props.itemsObj.fpt_fabric_rejected,
        //   props.itemsObj.fpt_fabricProcessed + props.itemsObj.fpt_fabric_rejected !== props.itemsObj.fpt_issued
      );
    }
  }, [props.itemsObj]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fabricProcessed, set_fabricProcessed] = useState('0');

  const [processList, setProcessList] = useState([]);
  const [orderNoList, setOrderNoList] = useState([]);
  const [machineNoList, setMachineNoList] = useState([]);
  const [attendedByList, setAttendedByList] = useState([]);
  const [shiftList, set_shiftList] = useState([]);
  const [batchNoList, set_batchNoList] = useState([]);

  const [table, settable] = useState([]);

  const [showProcessList, set_showProcessList] = useState(false);
  const [processName, set_processName] = useState('');
  const [processId, set_processId] = useState('');

  const [showOrderNoList, set_showOrderNoList] = useState(false);
  const [OrderNoName, set_OrderNoName] = useState('');
  const [OrderNoId, set_OrderNoId] = useState('');

  const [showMachineNoList, set_showMachineNoList] = useState(false);
  const [MachineNoName, set_MachineNoName] = useState('');
  const [MachineNoId, set_MachineNoId] = useState('');

  const [showattendedByList, set_showattendedByList] = useState(false);
  const [attendedByName, set_attendedByName] = useState('');
  const [attendedById, set_attendedById] = useState('');

  const [showBatchNoList, set_showBatchNoList] = useState(false);
  const [batchNoName, set_batchNoName] = useState('');
  const [batchNoId, set_batchNoId] = useState('');

  const [date, setDate] = useState('');

  const [shift, set_shift] = useState('');
  const [shiftId, set_shiftId] = useState(0);
  const [showShiftList, set_showShiftList] = useState(false);

  const [inTime, set_inTime] = useState('');
  const [outTime, set_outTime] = useState('');
  const [batchNo, set_batchNo] = useState('');
  const [lotNo, set_lotNo] = useState('');
  const [rollNo, set_rollNo] = useState('');
  const [fabricIssued, set_fabricIssued] = useState('');
  const [orderNO, set_OrderNo] = useState('');

  const [filteredorderNO, set_filteredorderNO] = useState([]);
  const [filteredmachineNo, set_filteredmachineNo] = useState([]);
  const [filteredattendedBy, set_filteredattendedBy] = useState([]);
  const [filteredProcess, set_filteredProcess] = useState([]);
  const [filteredBatchNo, set_filteredBatchNo] = useState([]);

  const [machineNo, set_machineNo] = useState('');
  const [attendedBy, set_attendedBy] = useState('');
  const [fabricNo, set_fabricNo] = useState('');
  const [quality, set_quality] = useState('');
  const [designNO, set_designNO] = useState('');
  const [batch, set_batch] = useState('');
  const [table_ip, set_table_ip] = useState('');

  const [chindi, setChindi] = useState('0');
  const [fent, setFent] = useState('0');
  const [bGradePieces, setBGradePieces] = useState('0');
  const [printDamagePieces, setPrintDamagePieces] = useState('0');
  const [twoPieces, setTwoPieces] = useState('0');
  const [fabricType, setFabricType] = useState('');
  const [fresh, setFresh] = useState('0');

  const [editFabricIssued, set_editFabricIssued] = useState(true);
  const [edit6fields, set_edit6fields] = useState(false);

  const [inTimeList, setInTimeList] = useState([]);
  const [filteredInTime, setFilteredInTime] = useState([]);
  const [showInTimeList, setShowInTimeList] = useState(false);
  const [inTimeName, setInTimeName] = useState('');
  const [inTimeId, setInTimeId] = useState('');

  const [outTimeList, setOutTimeList] = useState([]);
  const [filteredOutTime, setFilteredOutTime] = useState([]);
  const [showOutTimeList, setShowOutTimeList] = useState(false);
  const [outTimeName, setOutTimeName] = useState(''); // Set a default if needed
  const [outTimeId, setOutTimeId] = useState('');

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    if (!outTimeId) {
      Alert.alert('Please Select outTime  !');
      return;
    }
    if (!inTimeId) {
      Alert.alert('Please Select inTime  !');
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
      fpt_intime: inTimeId ? inTimeId : '',
      fpt_outtime: outTimeId ? outTimeId : '',
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

  const actionOnProcess = item => {
    set_processId(item.id);
    set_processName(item.name);
    set_showProcessList(false);
  };

  const actionOnMachineNo = (id, name) => {
    set_MachineNoId(id);
    set_MachineNoName(name);
    set_showMachineNoList(false);
  };

  const actionOnAttendedBy = (id, name) => {
    set_attendedById(id);
    set_attendedByName(name);
    set_showattendedByList(false);
  };
  const actionOnShift = item => {
    set_shiftId(item.id);
    set_shift(item.name);
    set_showShiftList(false);
  };
  const actionOnBatchNo = item => {
    set_batchNoId(item.id);
    set_batchNo(item.name);
    set_showBatchNoList(false);
  };

  const actionOnInTime = item => {
    setInTimeId(item.id);
    setInTimeName(item.name);
    setShowInTimeList(false);
  };

  const handleSearchInTime = text => {
    if (text.trim().length > 0) {
      const filtered = inTimeList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredInTime(filtered);
    } else {
      setFilteredInTime(inTimeList);
    }
  };

  const actionOnOutTime = item => {
    setOutTimeId(item.id);
    setOutTimeName(item.name);
    setShowOutTimeList(false);
  };

  const handleSearchOutTime = text => {
    if (text.trim().length > 0) {
      const filtered = outTimeList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredOutTime(filtered);
    } else {
      setFilteredOutTime(outTimeList);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formattedDate = date.toISOString().split('T')[0];
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleSearchMachineNo = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(machineNoList).filter(locationId =>
        machineNoList[locationId].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredmachineNo(filtered);
    } else {
      set_filteredmachineNo(Object.keys(machineNoList));
    }
  };
  const handleSearchAttendedBy = text => {
    if (text.trim().length > 0) {
      // const filtered = attendedByList.filter(user =>
      //   user.name.toLowerCase().includes(text.toLowerCase()),
      // );
      const filtered = Object.keys(attendedByList).filter(locationId =>
        attendedByList[locationId].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredattendedBy(filtered);
    } else {
      // set_filteredattendedBy(attendedByList);
      set_filteredattendedBy(Object.keys(attendedByList));
    }
  };

  const handleSearchProcess = text => {
    if (text.trim().length > 0) {
      const filtered = processList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredProcess(filtered);
    } else {
      set_filteredProcess(attendedByList);
    }
  };

  const handleSearchBatchNo = text => {
    if (text.trim().length > 0) {
      const filtered = attendedByList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredattendedBy(filtered);
    } else {
      set_filteredattendedBy(attendedByList);
    }
  };

  function formatDateForSave(inp) {
    const [d, m, y] = inp.split('/');
    let ans = [y, m, d];
    ans = ans.join('-');
    return ans;
  }

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'In Process - Add'}
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
              marginTop: hp('2%'),
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                set_showProcessList(!showProcessList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        processName
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Process *  '}
                    </Text>
                    {processName ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {processName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {false && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcess}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredProcess.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredProcess.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnProcess(item)}>
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
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Date *"
                value={date ? date : 'N/A'}
                mode="outlined"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker();
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../../assets/images/png/calendar.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                set_showShiftList(!showShiftList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shift
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Shift * '}
                    </Text>
                    {shift ? (
                      <Text style={[styles.dropTextInputStyle]}>{shift}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShiftList ? (
              <View style={styles.dropdownContent1}>
                {shiftList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownOption}
                    onPress={() => actionOnShift(item)}>
                    <Text style={{color: '#000'}}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          {/* <View style={{marginTop: hp('2%'), flexDirection: 'row',width: '95%',}}>
            <View style={{width: '45%', marginRight: '9%'}}>
              <TextInput
                label="Out Time"
                value={outTime}
                mode="outlined"
                onChangeText={text => set_outTime(text)}
              />
            </View>
            <View style={{width: '45%'}}>
              <TextInput
                label="In Time"
                value={inTime}
                mode="outlined"
                onChangeText={text => set_inTime(text)}
              />
            </View>
          </View> */}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowOutTimeList(!showOutTimeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        outTimeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Out Time '}
                    </Text>
                    {outTimeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {outTimeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showOutTimeList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchOutTime}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredOutTime.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredOutTime.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnOutTime(item)}>
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
              marginTop: hp('2%'),
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowInTimeList(!showInTimeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        inTimeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'In Time '}
                    </Text>
                    {inTimeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {inTimeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showInTimeList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchInTime}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredInTime.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredInTime.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnInTime(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Batch No *"
              value={batchNoName}
              mode="outlined"
              editable={false}
              onChangeText={text => set_batchNoName(text)}
            />
          </View>

          <View
            style={{marginTop: hp('2%'), flexDirection: 'row', width: '95%'}}>
            <View style={{width: '45%', marginRight: '9%'}}>
              <TextInput
                label="Lot No"
                value={lotNo}
                mode="outlined"
                editable={false}
                onChangeText={text => set_lotNo(text)}
              />
            </View>

            <View style={{width: '45%'}}>
              <TextInput
                label="Roll/Trolley"
                value={rollNo}
                mode="outlined"
                onChangeText={text => set_rollNo(text)}
              />
            </View>
          </View>

          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Fabric Issued"
              value={fabricIssued.toString()}
              mode="outlined"
              editable={false}
              onChangeText={text => set_fabricIssued(text)}
            />
          </View>

          <View
            style={{marginTop: hp('2%'), flexDirection: 'row', width: '95%'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="Fabric Processed "
                value={fabricProcessed}
                mode="outlined"
                editable={editFabricIssued}
                onChangeText={text => set_fabricProcessed(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  position: 'absolute',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_fabricProcessed
                  ? props?.itemsObj?.fpt_fabricProcessed.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Batch *"
              value={batch.toString()}
              mode="outlined"
              editable={false}
              onChangeText={text => set_batch(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                set_showMachineNoList(!showMachineNoList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        MachineNoName
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Machine No * '}
                    </Text>
                    {MachineNoName ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {MachineNoName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showMachineNoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchMachineNo}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredmachineNo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredmachineNo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() =>
                          actionOnMachineNo(item, machineNoList[item])
                        }>
                        <Text style={{color: '#000'}}>
                          {machineNoList[item]}
                        </Text>
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
              marginTop: hp('2%'),
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                set_showattendedByList(!showattendedByList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        attendedByName
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Attended By  *'}
                    </Text>
                    {attendedByName ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {attendedByName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showattendedByList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchAttendedBy}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredattendedBy.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredattendedBy.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() =>
                          actionOnAttendedBy(item, attendedByList[item])
                        }>
                        <Text style={{color: '#000'}}>
                          {attendedByList[item]}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Fabric no"
              value={fabricNo}
              mode="outlined"
              editable={false}
              onChangeText={text => set_fabricNo(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Quality"
              value={quality}
              mode="outlined"
              editable={false}
              onChangeText={text => set_quality(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="OrderNo"
              value={orderNO}
              mode="outlined"
              editable={false}
              onChangeText={text => set_OrderNo(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Design"
              value={designNO}
              mode="outlined"
              editable={false}
              onChangeText={text => set_designNO(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="MatchingName"
              value={machineNo}
              mode="outlined"
              editable={false}
              onChangeText={text => set_machineNo(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'), width: '95%'}}>
            <TextInput
              label="Fabric Type"
              value={fabricType}
              mode="outlined"
              editable={true}
              onChangeText={text => setFabricType(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'), flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="Fresh "
                value={fresh}
                mode="outlined"
                editable={edit6fields}
                onChangeText={text => setFresh(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  position: 'absolute',
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_freshPcs
                  ? props?.itemsObj?.fpt_freshPcs.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          <View style={{marginTop: hp('2%'), flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="Two Pieces "
                value={twoPieces}
                mode="outlined"
                editable={edit6fields}
                onChangeText={text => setTwoPieces(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  position: 'absolute',
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_twoPcs
                  ? props?.itemsObj?.fpt_twoPcs.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          <View style={{marginTop: hp('2%'), flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="Print Damage Pieces"
                value={printDamagePieces}
                mode="outlined"
                editable={edit6fields}
                onChangeText={text => setPrintDamagePieces(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  position: 'absolute',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_printDamgePcs
                  ? props?.itemsObj?.fpt_printDamgePcs.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          <View style={{marginTop: hp('2%'), flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="B-Grade Pieces"
                value={bGradePieces}
                mode="outlined"
                editable={edit6fields}
                onChangeText={text => setBGradePieces(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  position: 'absolute',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_bgradePcs
                  ? props?.itemsObj?.fpt_bgradePcs.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          <View style={{marginTop: hp('2%'), flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="Fent"
                value={fent}
                mode="outlined"
                editable={edit6fields}
                onChangeText={text => setFent(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  position: 'absolute',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_fent
                  ? props?.itemsObj?.fpt_fent.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          <View style={{marginTop: hp('2%'), flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <TextInput
                label="Chindi"
                value={chindi}
                mode="outlined"
                editable={edit6fields}
                onChangeText={text => setChindi(text)}
              />
            </View>
            <View style={{position: 'relative'}}>
              <Text
                style={{
                  backgroundColor: colors.color2,
                  color: 'white',
                  padding: 3,
                  paddingHorizontal: 10,
                  borderRadius: Platform.OS === 'ios' ? 12 : 30,
                  overflow: 'hidden',
                  position: 'absolute',
                  left: -10,
                  bottom: 15,
                }}>
                {props?.itemsObj?.fpt_chindi
                  ? props?.itemsObj?.fpt_chindi.toString()
                  : '0'}
              </Text>
            </View>
          </View>

          {props.itemsObj.fpt_menuOut_id === 590 && (
            <View style={styles.wrapper}>
              <View style={styles.table}>
                {/* Table Head */}
                {table && table?.length > 0 && (
                  <View style={styles.table_head}>
                    <View style={{width: '10%', alignItems: 'center'}}>
                      <Text style={styles.table_head_captions}>Matching</Text>
                    </View>
                    <View style={{width: '22%', alignItems: 'flex-end'}}>
                      <Text style={styles.table_head_captions}>Order Mtr</Text>
                    </View>
                    <View style={{width: '20%', alignItems: 'center'}}>
                      <Text style={styles.table_head_captions}>
                        Printed Mtr
                      </Text>
                    </View>
                    <View style={{width: '2%'}} />
                    <View style={{width: '22%', alignItems: 'flex-end'}}>
                      <Text style={styles.table_head_captions}>
                        Total Printed Mtr
                      </Text>
                    </View>
                    <View style={{width: '2%'}} />
                    <View style={{width: '22%', alignItems: 'flex-end'}}>
                      <Text style={styles.table_head_captions}>
                        Remaining to Print
                      </Text>
                    </View>
                  </View>
                )}

                {/* Table Body */}
                {table &&
                  table?.length > 0 &&
                  table.map((item, index) => (
                    <View key={index} style={styles.table_body_single_row}>
                      <View style={{width: '10%', alignItems: 'center'}}>
                        <Text style={styles.table_data}>
                          {item.matchingName}
                        </Text>
                      </View>

                      <View style={{width: '22%', alignItems: 'center'}}>
                        <Text style={styles.table_data}>
                          {item?.poft_order_mtr?.toString()}
                        </Text>
                      </View>
                      <View style={{width: '20%'}}>
                        <View style={{flexDirection: 'column'}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={table_ip}
                            mode="outlined"
                            onChangeText={text => set_table_ip(text)}
                          />
                          <Text
                            style={{
                              backgroundColor: colors.color2,
                              color: '#fff',
                              padding: 2,
                              paddingHorizontal: 10,
                              borderRadius: Platform.OS === 'ios' ? 12 : 30,
                              overflow: 'hidden',
                              textAlign: 'center',
                            }}>
                            {props?.itemsObj?.fpt_fabricProcessed}
                          </Text>
                        </View>
                      </View>
                      <View style={{width: '2%'}} />
                      <View style={{width: '22%', alignItems: 'center'}}>
                        <Text style={styles.table_data}>
                          {(
                            Number(item?.poft_tot_printed_mtr) +
                            Number(table_ip ? table_ip : '0')
                          )?.toString()}
                        </Text>
                      </View>
                      <View style={{width: '2%'}} />
                      <View style={{width: '22%', alignItems: 'center'}}>
                        <Text style={styles.table_data}>
                          {item?.poft_remaining_print?.toString()}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          )}

          <View style={{height: 150}} />
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

export default SaveFabricProcessInUI;

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
    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 5,
      textAlign: 'center',
    },
  });
