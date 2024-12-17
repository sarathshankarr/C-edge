import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent'
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateIntoDMY } from '../../../utils/constants/constant';
import { RadioButton, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const CreateInProcessUI = ({ route, navigation, ...props }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [enterSizesArray, set_enterSizesArray] = useState(undefined)
  const [locationsList, set_locationsList] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationId, set_locationId] = useState(0);
  const [selectedLocation, set_selectedLocation] = useState('ab');
  const [unitPrice, set_unitPrice] = useState('');

  const [showOrderDD, set_showOrderDD] = useState(false);

  const [processList, setProcessList] = useState([]);
  const [orderNoList, setOrderNoList] = useState([]);
  const [machineNoList, setMachineNoList] = useState([]);
  const [attendedByList, setAttendedByList] = useState([]);
  const [shiftList, set_shiftList] = useState([]);
  const [batchNoList, set_batchNoList] = useState([]);
  const [designNoList, set_designNoList] = useState([]);
  const [matchingNoList, set_matchingNoList] = useState([]);

  const [filteredorderNO, set_filteredorderNO] = useState([]);
  const [filteredmachineNo, set_filteredmachineNo] = useState([]);
  const [filteredattendedBy, set_filteredattendedBy] = useState([]);
  const [filteredProcess, set_filteredProcess] = useState([]);
  const [filteredBatchNo, set_filteredBatchNo] = useState([]);
  const [filteredDesignNo, set_filteredDesignNo] = useState([]);
  const [filteredMatchingNo, set_filteredMatchingNo] = useState([]);


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

  const [shift, set_shift] = useState('');
  const [shiftId, set_shiftId] = useState('');
  const [showShiftList, set_showShiftList] = useState(false);

  const [showDesignNoList, set_showDesignNoList] = useState(false);
  const [designNoName, set_designNoName] = useState('');
  const [designNoId, set_designNoId] = useState('');

  const [showMatchingNoList, set_showMatchingNoList] = useState(false);
  const [matchingNoName, set_matchingNoName] = useState('');
  const [matchingNoId, set_matchingNoId] = useState('');


  const [date, setDate] = useState('N/A');
  const [inTime, set_inTime] = useState('');
  const [lotNo, set_lotNo] = useState('');
  const [rollNo, set_rollNo] = useState('');
  const [fabricIssued, set_fabricIssued] = useState('');
  const [fabricIssuedLimit, set_fabricIssuedLimit] = useState('');
  const [orderNO, set_OrderNo] = useState('0');
  const [table, set_table] = useState([]);

  const [machineNo, set_machineNo] = useState('');
  const [attendedBy, set_attendedBy] = useState('');
  const [fabricNo, set_fabricNo] = useState('');
  const [quality, set_quality] = useState('');
  const [designNO, set_designNO] = useState('');
  const [batch, set_batch] = useState('');
  const [partyName, set_partyName] = useState('');
  const [addmachno, set_addmachno] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [fabricId, set_fabricId] = useState(0);

  const [fabricGreyWidth, set_fabricGreyWidth] = useState('');
  const [beforeProcessWidth, set_beforeProcessWidthh] = useState('');
  const [pieces, set_pieces] = useState('');

  const [showAddmcNO, set_showAddmcNO] = useState(false);

  const [previousQty, set_previousQty] = useState(0);
  const [printingId, set_printingId] = useState(0);


  useEffect(() => {
    // console.log("USE EFFECT ===>", )
    handleConfirm(new Date());

    if (props?.itemsArray) {
      if (props.itemsArray.processMap) {
        set_filteredProcess(props.itemsArray.processMap);
        setProcessList(props.itemsArray.processMap);
      }
      if (props.itemsArray.machineNosMap) {
        set_filteredmachineNo(props.itemsArray.machineNosMap);
        setMachineNoList(props.itemsArray.machineNosMap);
        // console.log("machineNoList===> ", props.itemsArray.machineNosMap);

      }
      if (props.itemsArray.empMap) {
        set_filteredattendedBy(props.itemsArray.empMap);
        setAttendedByList(props.itemsArray.empMap);
      }
      if (props.itemsArray.shiftMap) {
        set_shiftList(props.itemsArray.shiftMap);
      }
    }
  }, [props.itemsArray]);


  useEffect(() => {

    if (processId) {
      set_filteredBatchNo([]);
      set_batchNoList([]);
      set_batchNoId('');
      set_batchNoName('');
      set_OrderNoId('');
      set_OrderNoName('');
      set_filteredorderNO([]);
      set_showOrderNoList(false);
      set_designNoId('');
      set_designNoName('');
      set_designNoList([]);
      set_filteredDesignNo([]);
      set_table([]);
      const excludedProcessIds = ["593", "595", "597", "599", "601", "603", "605", "607", "609"];
      if (!excludedProcessIds.includes(processId)) {
        // console.log("inside if id is  not in the list", processId);
        getBatchNoListByProcessId()
      } else {
        // console.log("inside else id is in the list", processId)
        getBatchDetailsByBatchId2();
      }
    }

  }, [processId]);

  useEffect(() => {

    if (batchNoId) {
      // console.log("getBatchDetailsByBatchId", batchNoId)
      getBatchDetailsByBatchId();
    }

  }, [batchNoId]);

  useEffect(() => {

    if (OrderNoId) {
      set_designNoId('');
      set_designNoName('');
      set_designNoList([]);
      set_filteredDesignNo([]);
      
      if (processId === "591") {
        // console.log("getting design dd  for printing");
        getDesignNoListIfPrinting();
      } else {
        // console.log("getting design dd  for not  printing");
        getDesignNoListIfNotPrinting();
      }
    }

  }, [OrderNoId]);

  useEffect(() => {

    if (designNoId) {
      if (processId === "591") {
        set_table([]);
        // console.log("inside if of getting child instead of matchingNO")
        getApiItemDetails();
      } else {
        // console.log("inside after s des=> geting matchno list ")
        getMatchingNoList()
      }
    }

  }, [designNoId]);



  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();

  };


  const submitAction = async () => {

    console.log({ 
      "date": date,
      "shiftId": shiftId,
      "inTime": inTime,
      "batchNoId": batchNoId,
      "batch": batch,
      "MachineNoId": MachineNoId,
      "attendedById": attendedById,
      "processId": processId,
      "OrderNoId":OrderNoId , 
      "designNoId":designNoId ,
       "matchingNoId":matchingNoId}
    );

    if (!processId || !date || !Number(shiftId) || !inTime || !batchNoId || !batch || (!MachineNoId && !(showAddmcNO && addmachno)) || !attendedById) {
      Alert.alert("Please fill all mandatory fields !");
      return;
    }

    if (Number(processId) >=591) {
      // if (!OrderNoId || !designNoId || (Number(processId) !== 591 || !matchingNoId)) {
      //   Alert.alert("Please fill all mandatory fields !");
      //   return;
      // }
      if (!OrderNoId || !designNoId || (Number(processId) !== 591 && !matchingNoId)) {
        Alert.alert("Please fill all mandatory fields!");
        return;
      }
    }

    if(Number(processId) === 591){
      if (selectedIndex===null) {
        Alert.alert("Please Select Atleast one Matching ");
        return;
      }
    }
      if (Number(fabricIssued) > Number(fabricIssuedLimit)) {
        Alert.alert("Qty Should Not Be More than ", fabricIssuedLimit);
        return;
      }
    
    
  
    const s = batchNoId.split('_');
    const a = s[0];
    const b = s[1];

    let obj1;

    table.map((item, index) => {
      if (index === selectedIndex) {
        obj1 = {
          "matchingName": item.matchingName,
          "orderMtr": item.ordermtr,
          "totMtr": item.totMtr,
          "img":item.Image,
          "matchId":item.matchId,
          "remainTot": item.remainTot,
        };
      }
    });

    const Obj = {
      "processid": processId ? Number(processId) : 0,
      "fabricId": fabricId ? fabricId : 0,
      "batchId": b ? Number(b) : 0,
      "creationDate": date ? date : "",
      "machineId": MachineNoId ? Number(MachineNoId) : 0,
      "shiftId":  Number(shiftId),
      "attendedById": attendedById ? Number(attendedById) : 0,
      "intime": inTime,
      "batchNo": a ? Number(a) : "",
      "quality": quality,
      "lotNo": lotNo ? lotNo : "",
      "partyName": partyName,
      "rollTrolley": rollNo ? rollNo : "0",
      "fabricGreyWidth": fabricGreyWidth ? fabricGreyWidth : "",
      "noOfPieces": pieces ? pieces : "",
      "fabricIssued": fabricIssued ? Number(fabricIssued) : 0,
      "colorid": 0,
      "previousqty": previousQty ?Number(previousQty) : 0.0,
      "orderNo": OrderNoId ? Number(OrderNoId) : 0,
      "designId": designNoId ? Number(designNoId) : 0,
      "beforeProcessWidth": beforeProcessWidth ? beforeProcessWidth : "",
      "printingId": printingId ? Number(printingId) : 0,
      "addmachno": addmachno,
      "matchId": matchingNoId ? Number(matchingNoId) : 0,
      "matchimg": "",
      "orderId": OrderNoId ? Number(OrderNoId) : 0,
      "designNo": designNoId ? Number(designNoId) : 0,
      "newdesignNo":  designNoId ? Number(designNoId) : 0,
      "matchingId": matchingNoId ? Number(matchingNoId) : 0,
      "fabricPrintingOrderFormDAO": [
        {
          "poft_fpt_batchNo_id": a ? Number(a) : 0,
          "poft_order_id": OrderNoId ? Number(OrderNoId) : 0,
          "poft_design_id": designNoId ? Number(designNoId) : 0,
          "poft_matcing_id": obj1?.matchId ? Number(obj1?.matchId) : 0,
          "poft_design_img": obj1?.img ?  obj1?.img : "",
          "poft_order_mtr": obj1?.orderMtr ? obj1?.orderMtr : 0,
          "poft_tot_printed_mtr": obj1?.totMtr ? obj1?.totMtr : 0,
          "poft_remaining_print": obj1?.remainTot ? obj1?.remainTot : 0,
          "poft_printingMenuId": processId ? Number(processId) : 0
        }
      ]
    };

    // console.log("saving obj ", Obj)
    // return;
    props.submitAction(Obj);
    // Alert.alert("Save Button Clicked");
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const actionOnProcess = (item) => {
    set_processId(item.id);
    set_processName(item.name);
    set_showProcessList(false);
  }
  const actionOnMachineNo = (item) => {
    set_MachineNoId(item.id);
    set_MachineNoName(item.name);
    set_showMachineNoList(false);
    if(item.id==="ADD"){
      set_showAddmcNO(true);
    }else{
      set_showAddmcNO(false);
      set_addmachno('');
    }
  }
  const actionOnOrderNo = (item) => {
    set_OrderNoId(item.id);
    set_OrderNoName(item.name);
    set_showOrderNoList(false);
  }
  const actionOnAttendedBy = (item) => {
    set_attendedById(item.id);
    set_attendedByName(item.name);
    set_showattendedByList(false);
  }
  const actionOnShift = (item) => {
    set_shiftId(item.id);
    set_shift(item.name);
    set_showShiftList(false);
  }
  const actionOnBatchNo = (item) => {
    set_batchNoId(item.id);
    set_batchNoName(item.name);
    set_showBatchNoList(false);
  }
  const actionOnDesignNo = (item) => {
    set_designNoId(item.id);
    set_designNoName(item.name);
    set_showDesignNoList(false);
  }
  const actionOnMatchingNo = async(item) => {
    set_matchingNoId(item.id);
    set_matchingNoName(item.name);
    set_showMatchingNoList(false);
    if(processId && OrderNoId && designNoId){
      if(Number(processId)> 591){
        console.log("calling =========================================")
        await getfabIssuedafterPrinting(item.id);
        await getBatchListAfterPriniting(item.id);
      }
    }
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleSearchProcess = text => {
    if (text.trim().length > 0) {
      const filtered = processList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredProcess(filtered);
    } else {
      set_filteredProcess(processList);
    }
  };

  const handleSearchOrderNo = text => {
    if (text.trim().length > 0) {
      const filtered = orderNoList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredorderNO(filtered);
    } else {
      set_filteredorderNO(orderNoList);
    }
  };
  const handleSearchMachineNo = text => {
    if (text.trim().length > 0) {
      const filtered = machineNoList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      
      set_filteredmachineNo(filtered);

    } else {
      set_filteredmachineNo(machineNoList);
    }
  };
  const handleSearchAttendedBy = text => {
    if (text.trim().length > 0) {
      const filtered = attendedByList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredattendedBy(filtered);
    } else {
      set_filteredattendedBy(attendedByList);
    }
  };
  const handleSearchDesignNo = text => {
    if (text.trim().length > 0) {
      const filtered = designNoList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredattendedBy(filtered);
    } else {
      set_filteredattendedBy(designNoList);
    }
  };

  const handleSearchBatchNo = text => {
    console.log("text inside ", text);
    if (text.trim().length > 0) {
      const filtered = batchNoList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()) || user.name.includes(text),
      );
      set_filteredBatchNo(filtered);
    } else {
      set_filteredBatchNo(batchNoList);
    }
  };
  const handleSearchMatchingNo = text => {
    if (text.trim().length > 0) {
      const filtered = matchingNoList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredattendedBy(filtered);
    } else {
      set_filteredattendedBy(matchingNoList);
    }
  };

  const getBatchNoListByProcessId = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    props.set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "menuId": processId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let STOREDETAILSAPIObj = await APIServiceCall.getBatchNoListByProcessId(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      const processList = Object.keys(STOREDETAILSAPIObj.responseData.batchNoMap).map(key => ({
        id: key,
        name: STOREDETAILSAPIObj.responseData.batchNoMap[key]
      }));
      set_filteredBatchNo(processList);
      set_batchNoList(processList);
    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getBatchDetailsByBatchId = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    props.set_isLoading(true);
    const s = batchNoId.split('_');
    const a = s[0];
    const b = s[1];
    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

      // "menuId": processId === "591" ? "591" : '0',
      "menuId": 0,
      "batchId": b,
      "processid": processId,
      "batchNo": a,
      "batchName": batchNoName,
      "printingId": printingId ? printingId : 0,
      "orderName": OrderNoId ? OrderNoId : 0,
      "newdesignNo":designNoId ? designNoId : 0,
      "matchingName": matchingNoId ? matchingNoId : 0
    }

    console.log("req  body after selecting batch id ", obj);

    let STOREDETAILSAPIObj = await APIServiceCall.getBatchDetailsByBatchId(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj?.statusData) {
      
      console.log("get details by batch id", STOREDETAILSAPIObj?.responseData)
      set_fabricNo(STOREDETAILSAPIObj?.responseData?.fabricNo);
      set_lotNo(STOREDETAILSAPIObj?.responseData?.lotNo);
      set_quality(STOREDETAILSAPIObj?.responseData?.qualityName);
      set_batch(STOREDETAILSAPIObj?.responseData?.batchId);
      set_fabricId(STOREDETAILSAPIObj?.responseData?.fabricId);
      set_fabricIssued(STOREDETAILSAPIObj?.responseData?.mtr);
      set_fabricIssuedLimit(STOREDETAILSAPIObj?.responseData?.mtr);
      set_fabricGreyWidth(STOREDETAILSAPIObj?.responseData?.fabricGreyWidth);
      set_pieces(STOREDETAILSAPIObj?.responseData?.noOfPieces);
      set_partyName(STOREDETAILSAPIObj?.responseData?.partyName);
      set_rollNo(STOREDETAILSAPIObj?.responseData?.rolltrolley);

      if (STOREDETAILSAPIObj?.responseData?.ordersMap) {
        const orderList = Object.keys(STOREDETAILSAPIObj?.responseData?.ordersMap).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.ordersMap[key]
        }));
        console.log("after selecting batch id ==> ", STOREDETAILSAPIObj?.responseData);

        if(processId==='591'){
          set_filteredorderNO(orderList);
          setOrderNoList(orderList);
        // console.log("Processid 591 so list is there ",orderList )
      }else{
        set_filteredorderNO([]);
        setOrderNoList([]);
        // console.log("Processid not 591 so list is not there ", processId )
        }
        
      }

    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getBatchDetailsByBatchId2 = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    props.set_isLoading(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }

    let STOREDETAILSAPIObj = await APIServiceCall.getBatchDetailsByBatchId2(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj?.statusData) {
      if (STOREDETAILSAPIObj?.responseData?.ordersMap) {
        const orderList = Object.keys(STOREDETAILSAPIObj?.responseData?.ordersMap).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.ordersMap[key]
        }));

        set_showOrderDD(true);
        set_filteredorderNO(orderList);
        setOrderNoList(orderList);
        console.log("order after printing ===> ", orderList);
      }

    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getApiItemDetails = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    props.set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "designId": designNoId,
      "orderNo": OrderNoId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let STOREDETAILSAPIObj = await APIServiceCall.getApiItemDetails(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      if (STOREDETAILSAPIObj.responseData.myArrayList) {
        let result = STOREDETAILSAPIObj.responseData.myArrayList.map(item => item.map);
        console.log("Table content ", result)
        set_table(result);
      }
    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getDesignNoListIfPrinting = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    props.set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "designId": OrderNoId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let STOREDETAILSAPIObj = await APIServiceCall.getDesignNoListIfPrinting(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {

      if (STOREDETAILSAPIObj.responseData.designMap1) {
        if (STOREDETAILSAPIObj.responseData.designMap1) {
          const designList = Object.keys(STOREDETAILSAPIObj.responseData.designMap1).map(key => ({
            id: key,
            name: STOREDETAILSAPIObj.responseData.designMap1[key]
          }));
          set_filteredDesignNo(designList);
          set_designNoList(designList);
          console.log("design List ===> ", designList);

        }

      }

    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getDesignNoListIfNotPrinting = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');


    props.set_isLoading(true);
    const s = batchNoId.split('_');
    const a = s[0];
    const b = s[1];
    let obj = {
      "username": userName,
      "password": userPsd,
      "orderId": OrderNoId,
      "batchNo": a,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let STOREDETAILSAPIObj = await APIServiceCall.getDesignNoListIfNotPrinting(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      if (STOREDETAILSAPIObj.responseData.designMap) {
        const designList = Object.keys(STOREDETAILSAPIObj.responseData.designMap).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.designMap[key]
        }));
        set_filteredDesignNo(designList);
        set_designNoList(designList);
        console.log("design List ===> ", designList);
      }
    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getMatchingNoList = async () => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    props.set_isLoading(true);
    const s = batchNoId.split('_');
    const a = s[0];
    const b = s[1];
    let obj = {
      "username": userName,
      "password": userPsd,
      "batchId": b,
      "orderId": OrderNoId,
      "designId": designNoId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let STOREDETAILSAPIObj = await APIServiceCall.getMatchingNoList(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {

      if (STOREDETAILSAPIObj.responseData.matchingMap) {

        const matchingList = Object.keys(STOREDETAILSAPIObj.responseData.matchingMap).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.matchingMap[key]
        }));
        set_filteredMatchingNo(matchingList);
        set_matchingNoList(matchingList);
      }

    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };

  const getBatchListAfterPriniting = async (mId) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    props.set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "designId" : designNoId,
      "batchId" :0,
      "orderId" : OrderNoId,
      "batchNo" : 0,
      "matchingId": mId,
      "newdesignNo":designNoId,
      "processId" : processId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    let STOREDETAILSAPIObj = await APIServiceCall.getBatchListAfterPriniting(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {

      if (STOREDETAILSAPIObj.responseData.batchNoMap) {

        const batchNoList = Object.keys(STOREDETAILSAPIObj.responseData.batchNoMap).map(key => ({
          id: key,
          name: STOREDETAILSAPIObj.responseData.batchNoMap[key]
        }));
        set_filteredBatchNo(batchNoList);
        set_batchNoList(batchNoList);
      }

      console.log("getBatchListAfterPriniting ===> ", STOREDETAILSAPIObj.responseData)

    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

  };
  const getfabIssuedafterPrinting = async (mId) => {

    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    const s = batchNoId?.split('_');
    const a = s[0];
    const b = s[1];
    props.set_isLoading(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "orderId" : OrderNoId,
      "batchNo" : a ? a : 0,
      "matchingId": mId,
      "newdesignNo":designNoId,
      "processid" : processId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    }
    
    let STOREDETAILSAPIObj = await APIServiceCall.getfabIssuedafterPrinting(obj);
    props.set_isLoading(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {

      if (STOREDETAILSAPIObj.responseData) {

       
          if(Number(processId)===608 || Number(processId)===609){
          
              set_fabricIssued(STOREDETAILSAPIObj.responseData?.poft_printend_mtr)
              set_previousQty(STOREDETAILSAPIObj.responseData?.poft_printend_mtr)
              set_printingId(STOREDETAILSAPIObj.responseData?.poft_id)
              
          }else{
            set_fabricIssued(STOREDETAILSAPIObj.responseData?.poft_printend_mtr)
            set_previousQty(STOREDETAILSAPIObj.responseData?.poft_printend_mtr)
            set_printingId(STOREDETAILSAPIObj.responseData?.poft_id)
          }
          console.log("response for fab issued ", STOREDETAILSAPIObj.responseData)
      }

    } else {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      props?.popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }

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
          title={'In Process - Add'}
          backBtnAction={() => backBtnAction()}
        />
      </View>


      <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} extraScrollHeight={130} showsVerticalScrollIndicator={false} style={{ marginBottom: hp('15%') }}>
        <View style={{ marginBottom: hp('5%'), width: '90%', marginHorizontal: wp('5%') }}>

          <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:"#fff", marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showProcessList(!showProcessList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={processName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Process *  '}</Text>
                    {processName ? <Text style={[styles.dropTextInputStyle]}>{processName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>


            {showProcessList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcess}
                  placeholderTextColor="#000"
                />
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
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
                        <Text style={{ color: '#000' }}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}

          </View>


          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('2%') }} >
            <View style={{ width: '85%' }}>
              <TextInput
                label='Date *'
                value={date ? formatDateIntoDMY(date) : ""}
                mode='outlined'
              />
            </View>
            <TouchableOpacity onPress={() => { showDatePicker() }} style={{ padding: 5 }}>
              <Image source={require('./../../../../assets/images/png/calendar.png')} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:"#fff", marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showShiftList(!showShiftList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={shiftId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Shift * '}</Text>
                    {shiftId ? <Text style={[styles.dropTextInputStyle]}>{shift}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
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
                    <Text style={{ color: '#000' }}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}


          </View>

          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="In Time *"
              value={inTime}
              mode='outlined'
              onChangeText={text => set_inTime(text)}
            />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:"#fff", marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showBatchNoList(!showBatchNoList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={batchNoId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Batch Name  '}</Text>
                    {batchNoId ? <Text style={[styles.dropTextInputStyle]}>{batchNoName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>


            {showBatchNoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchBatchNo}
                  placeholderTextColor="#000"
                />
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                  {filteredBatchNo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBatchNo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnBatchNo(item)}>
                        <Text style={{ color: '#000' }}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}

          </View>


          <View style={{ marginTop: hp('2%'), flexDirection: 'row' }}>
            <View style={{ width: '45%', marginRight: '9%' }}>
              <TextInput
                label="Lot No"
                value={lotNo}
                mode='outlined'
                onChangeText={text => set_lotNo(text)}
              />
            </View>

            <View style={{ width: '45%' }}>
              <TextInput
                label="Roll/Trolley"
                value={rollNo.toString()}
                mode='outlined'
                onChangeText={text => set_rollNo(text)}
              />
            </View>
          </View>

          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Fabric Issued"
              value={fabricIssued}
              mode='outlined'
              onChangeText={text => set_fabricIssued(text)}
            />
          </View>

          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Batch *"
              value={batch ? batch?.toString() : ''}
              mode='outlined'
              editable={false}
              onChangeText={text => set_batch(text)}
            />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:"#fff", marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showMachineNoList(!showMachineNoList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={MachineNoName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Machine No * '}</Text>
                    {MachineNoName ? <Text style={[styles.dropTextInputStyle]}>{MachineNoName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
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
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                  {filteredmachineNo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredmachineNo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnMachineNo(item)}>
                        <Text style={{ color: '#000' }}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}

          </View>

          {showAddmcNO && <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Add Machine No"
              value={addmachno}
              mode='outlined'
              onChangeText={text => set_addmachno(text)}
            />
          </View>}

          <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:"#fff", marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showattendedByList(!showattendedByList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={attendedByName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Attended By  *'}</Text>
                    {attendedByName ? <Text style={[styles.dropTextInputStyle]}>{attendedByName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
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
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                  {filteredattendedBy.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredattendedBy.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnAttendedBy(item)}>
                        <Text style={{ color: '#000' }}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}


          </View>

          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Fabric no"
              value={fabricNo}
              mode='outlined'
              onChangeText={text => set_fabricNo(text)}
            />
          </View>

          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Quality"
              value={quality}
              mode='outlined'
              onChangeText={text => set_quality(text)}
            />
          </View>
          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Before Process width"
              value={beforeProcessWidth}
              mode='outlined'
              onChangeText={text => set_beforeProcessWidthh(text)}
            />
          </View>
          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Pieces"
              value={pieces}
              mode='outlined'
              onChangeText={text => set_pieces(text)}
            />
          </View>
          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Party Name"
              value={partyName}
              mode='outlined'
              onChangeText={text => set_partyName(text)}
            />
          </View>
          <View style={{ marginTop: hp('2%') }}>
            <TextInput
              label="Fabric Grey Width"
              value={fabricGreyWidth}
              mode='outlined'
              onChangeText={text => set_fabricGreyWidth(text)}
            />
          </View>

          {processId && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showOrderNoList(!showOrderNoList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={OrderNoName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Order No '}</Text>
                    {OrderNoName ? <Text style={[styles.dropTextInputStyle]}>{OrderNoName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showOrderNoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchOrderNo}
                  placeholderTextColor="#000"
                />
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                  {filteredorderNO.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredorderNO.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnOrderNo(item)}>
                        <Text style={{color:'#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}


          </View>}

          {processId && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showDesignNoList(!showDesignNoList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={designNoId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Design No '}</Text>
                    {designNoId ? <Text style={[styles.dropTextInputStyle]}>{designNoName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showDesignNoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchDesignNo}
                  placeholderTextColor="#000"
                />
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                  {filteredDesignNo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredDesignNo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnDesignNo(item)}>
                        <Text  style={{color:'#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}


          </View>}

          {processId &&  processId !== "591"  && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('2%') }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showMatchingNoList(!showMatchingNoList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={matchingNoId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Matching No '}</Text>
                    {matchingNoId ? <Text style={[styles.dropTextInputStyle]}>{matchingNoName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showMatchingNoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchMatchingNo}
                  placeholderTextColor="#000"
                />
                <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                  {filteredMatchingNo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredMatchingNo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnMatchingNo(item)}>
                        <Text style={{ color: '#000' }}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}


          </View>}


          {/* <View style={{
            flexDirection: 'row', marginTop: hp('2%'), justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10,
            paddingHorizontal: 20
          }}>
            <Text style={{ fontWeight: 'bold' }}>Matching Image:</Text>
            <Image src={'https://reactnative.dev/img/tiny_logo.png'} style={{ height: 140, width: 140 }} />
          </View> */}

          {processId === "591" && OrderNoId && designNoId && (
            <View style={styles.wrapper}>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{ width: '10%', alignItems: 'center' }}>
                    <Text style={styles.table_head_captions}>Sr. No</Text>
                  </View>
                  <View style={{ width: '20%', alignItems: 'center' }}>
                    <Text style={styles.table_head_captions}>Matching</Text>
                  </View>
                  {/* <View style={{ width: '18%', alignItems: 'center' }}>
                    <Text style={styles.table_head_captions}>Image</Text>
                  </View> */}
                  <View style={{ width: '22%', alignItems: 'flex-end' }}>
                    <Text style={styles.table_head_captions}>Order Mtr</Text>
                  </View>
                  <View style={{ width: '2%' }} />
                  <View style={{ width: '22%', alignItems: 'flex-end' }}>
                    <Text style={styles.table_head_captions}>Total Printed Mtr</Text>
                  </View>
                  <View style={{ width: '2%' }} />
                  <View style={{ width: '22%', alignItems: 'flex-end' }}>
                    <Text style={styles.table_head_captions}>Remaining to Print</Text>
                  </View>
                </View>

                {/* Table Body */}
                {table && table?.length > 0 && table.map((item, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{ width: '10%', alignItems: 'center' }}>
                      <RadioButton
                        value="Yes"
                        status={selectedIndex === index ? 'checked' : 'unchecked'}
                        onPress={() => setSelectedIndex(index)}
                      />
                    </View>
                    <View style={{ width: '20%', alignItems: 'center' }}>
                      <Text style={styles.table_data}>{item.matchingName}</Text>
                    </View>
                    {/* <View style={{ width: '18%', alignItems: 'center' }}>
                      <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{ height: 40, width: 40 }} />
                    </View> */}
                    <View style={{ width: '22%', alignItems: 'flex-end' }}>
                      <Text style={styles.table_data}>{Number(item?.ordermtr)?.toFixed(2)}</Text>
                    </View>
                    <View style={{ width: '2%' }} />
                    <View style={{ width: '22%', alignItems: 'flex-end' }}>
                      <Text style={styles.table_data}>{Number(item?.totMtr)?.toFixed(2)}</Text>
                    </View>
                    <View style={{ width: '2%' }} />
                    <View style={{ width: '22%', alignItems: 'flex-end' }}>
                      <Text style={styles.table_data}>{Number(item?.remainTot)?.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}


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

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
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
      </View> : null}

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}

    </View>
  );
}

export default CreateInProcessUI;

const styles = StyleSheet.create({

  popSearchViewStyle: {
    height: hp("40%"),
    width: wp("90%"),
    backgroundColor: '#f0f0f0',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    // borderTopRightRadius: 15,
    // borderTopLeftRadius: 15,
    alignItems: "center",
  },
  popSearchViewStyle1: {
    width: wp("90%"),
    backgroundColor: '#f0f0f0',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    alignItems: "center",
  },

  flatcontainer: {
    flex: 1,
  },

  flatview: {
    height: hp("8%"),
    marginBottom: hp("0.3%"),
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "black",
    borderBottomWidth: wp("0.1%"),
    width: wp('80%'),
    alignItems: "center",
  },

  SectionStyle1: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    height: hp("7%"),
    width: wp("75%"),
    borderRadius: hp("0.5%"),
    // alignSelf: "center",
    // backgroundColor: "grey",
  },

  imageStyle: {
    // margin: "4%",
    height: wp("12%"),
    aspectRatio: 1,
    marginRight: wp('8%'),
    resizeMode: 'stretch',
  },

  dropTextInputStyle: {
    fontWeight: "normal",
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: 300,
    fontSize: 12,
    width: wp("60%"),
    alignSelf: 'flex-start',
    marginTop: hp("1%"),
    marginLeft: wp('4%'),
    color: '#000'
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('2%'),
    width: '100%'
  },
  table: {
    width: '95%', // Reduces extra space on the sides
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#5177c0',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,

  },
  table_head_captions: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  table_body_single_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 7,
    backgroundColor: '#fff',
    paddingHorizontal: 5,

  },
  table_data: {
    fontSize: 13,
    color: '#333',
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
    marginTop:3
  },
  noCategoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },

})
