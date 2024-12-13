import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import CommonStyles from '../../../../utils/commonStyles/commonStyles';
import * as Constant from '../../../../utils/constants/constant';
import HeaderComponent from '../../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../../../utils/commonComponents/textInputComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../../utils/commonComponents/bottomComponent';
import CustomCheckBox from '../../../../utils/commonComponents/CustomCheckBox';
import {RadioButton} from 'react-native-paper';
import * as APIServiceCall from '../../../../utils/apiCalls/apiCallsComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../../../utils/commonStyles/color';

let downArrowImg = require('./../../../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../../../assets/images/png/close1.png');

const CreateRequestUi = ({route, ...props}) => {
  const [rows, setRows] = React.useState([]);

  const [data, setData] = useState([]);
  const [stockTable, set_stockTable] = useState([]);
  const [checkbox, set_checkbox] = useState(false);
  const [remarks, set_remarks] = useState('');
  const [generalRadio, set_generalRadio] = useState('Yes');
  const [buyerRadio, set_buyerRadio] = useState('No');
  const [displayStyleRadio, set_displayStyleRadio] = useState('No');

  const [availableQty, set_availableQty] = useState(0);

  const [showLocationList, set_showLocationList] = useState(false);
  const [locationName, set_locationName] = useState('');
  const [locationId, set_locationId] = useState(0);

  // Fabric
  const [showFabricList, set_showFabricList] = useState(false);
  const [fabricName, set_fabricName] = useState('');
  const [fabricId, set_fabricId] = useState(0);
  const [editFabric, set_editFabric] = useState(true);

  // Styles
  const [showStylesList, set_showStylesList] = useState(false);
  const [stylesName, set_stylesName] = useState('');
  const [stylesId, set_stylesId] = useState(0);

  // Process
  const [showProcessList, set_showProcessList] = useState(false);
  const [processName, set_processName] = useState('');
  const [processId, set_processId] = useState(0);

  // UnitMaster
  const [showUnitMasterList, set_showUnitMasterList] = useState(false);
  const [unitMasterName, set_unitMasterName] = useState('');
  const [unitMasterId, set_unitMasterId] = useState(0);

  const [filteredStockStyles, set_filteredStockStyles] = useState([]);
  const [filteredStockFabrics, set_filteredStockFabrics] = useState([]);
  const [filteredUnitMaster, set_filteredUnitMaster] = useState([]);

  const [enteredFabQty, set_enteredFabQty] = useState('0');

  const [dataFromStockType, set_dataFromStockType] = useState({
    row: '',
    id: '',
  });
  const [dataFromStock, set_dataFromStock] = useState({
    row: '',
    id: '',
  });

  const [itemsObj, set_itemsObj] = useState({
    approvedFabric: '',
    approvedFabricConsumption: '',
    allowanceFabric: '',
    totalFabricApprovedWithAllowance: '',
    availFabricQty: '',
    uomfabric: '',
    fabricqty: '',
  });

  // const [stocksList, set_stocksList] = useState([]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        stockType: '',
        stock: '',
        size: '',
        availableQty: '',
        inputQty: '',
        uom: '',
        stockTypeId: '',
        stockId: '',
        showStockTypesList: false,
        showStocksList: false,
        stocksList: [],
        filteredStockTypes: props?.lists?.getStockTypes,
        filteredStocks: [],
        editStockType: true,
        editStock: true,
      },
    ]);
  };

  useEffect(() => {
    if (props?.lists) {
      if (props.lists.getStockStyles) {
        set_filteredStockStyles(props.lists.getStockStyles);
      }
      if (props.lists.getStockFabrics) {
        set_filteredStockFabrics(props.lists.getStockFabrics);
      }
      if (props.lists.getBatches) {
        set_filteredUnitMaster(props.lists.getBatches);
      }
    }
  }, [props]);

  const RemoveRow = id => {
    console.log('ROW ID ===> ', id);
    const filtered = rows.filter(item => item.id !== id);
    setRows(filtered);
  };

  useEffect(() => {
    if (props?.lists) {
      setData(props?.lists);
    }
  }, [props?.lists]);

  useEffect(() => {
    if (stylesId) {
      set_itemsObj({
        approvedFabric: '',
        approvedFabricConsumption: '',
        allowanceFabric: '',
        totalFabricApprovedWithAllowance: '',
        availFabricQty: '',
        uomfabric: '',
        fabricqty: '',
      });
      console.log('HI===> ', stylesId);
      getFabricByStyleId1();
    }
  }, [stylesId]);

  useEffect(() => {
    if (!stylesId && fabricId) {
      set_itemsObj({
        approvedFabric: '',
        approvedFabricConsumption: '',
        allowanceFabric: '',
        totalFabricApprovedWithAllowance: '',
        availFabricQty: '',
        uomfabric: '',
        fabricqty: '',
      });
      getFabricByfabricId();
    }
  }, [fabricId]);

  useEffect(() => {
    if (dataFromStock?.row && dataFromStock?.id) {
      console.log(
        'Inside stock type use efect ===========> ',
        dataFromStock.row,
        dataFromStock.id,
      );
      getStockQty(dataFromStock.row, dataFromStock.id);
    }
  }, [dataFromStock]);

  useEffect(() => {
    if (dataFromStockType?.row && dataFromStockType?.id) {
      console.log(
        'Inside stock  use efect ===========> ',
        dataFromStockType.row,
        dataFromStockType.id,
      );

      getStockbyTypeId(dataFromStockType.row, dataFromStockType.id);
    }
  }, [dataFromStockType]);

  const getFabricByStyleId1 = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    props.setLoad(true);
    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
      "processId": 0,
      "woStyleId": stylesId,
    };
    let STOREDETAILSAPIObj = await APIServiceCall.getFabricByStyleId(obj);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_fabricId(STOREDETAILSAPIObj.responseData.fabricId);
      set_fabricName(STOREDETAILSAPIObj.responseData.fabric);
      set_editFabric(false);
      set_itemsObj(prev => ({
        ...prev,
        approvedFabric: STOREDETAILSAPIObj.responseData.approvedFabric,
      }));
      set_itemsObj(prev => ({
        ...prev,
        approvedFabricConsumption:
          STOREDETAILSAPIObj.responseData.approvedFabricConsumption,
      }));
      set_itemsObj(prev => ({
        ...prev,
        allowanceFabric: STOREDETAILSAPIObj.responseData.allowanceFabric,
      }));
      set_itemsObj(prev => ({
        ...prev,
        totalFabricApprovedWithAllowance:
          STOREDETAILSAPIObj.responseData.totalFabricApprovedWithAllowance,
      }));
      set_itemsObj(prev => ({
        ...prev,
        availFabricQty: STOREDETAILSAPIObj.responseData.availFabricQty,
      }));
      set_itemsObj(prev => ({
        ...prev,
        uomfabric: STOREDETAILSAPIObj.responseData.uomType,
      }));

      if (
        STOREDETAILSAPIObj?.responseData?.trimConstructionsList &&
        STOREDETAILSAPIObj?.responseData?.trimConstructionsList?.length > 0
      ) {
        setRows([]); // Clear previous rows
        STOREDETAILSAPIObj.responseData.trimConstructionsList.forEach(
          (item, index) => {
            setRows(prevRows => [
              ...prevRows,
              {
                id: index,
                stockType: item.trimType,
                stock: item.trimConstruction,
                size: item.scaleSizes,
                availableQty: item.stockAvailQty,
                inputQty: '0',
                uom: item.uomType,
                stockTypeId: item.trimTypeId,
                stockId: item.trimConstructionId,
                showStockTypesList: false,
                showStocksList: false,
                stocksList: [],
                filteredStockTypes: [],
                filteredStocks: [],
                editStockType: false,
                editStock: false,
              },
            ]);
          },
        );
      }

      set_availableQty(STOREDETAILSAPIObj.responseData.availFabricQty);

      console.log(
        'Values to Prepopulate',
        STOREDETAILSAPIObj.responseData.approvedFabric,
        STOREDETAILSAPIObj.responseData.approvedFabricConsumption,
        STOREDETAILSAPIObj.responseData.allowanceFabric,
        STOREDETAILSAPIObj.responseData.totalFabricApprovedWithAllowance,
        STOREDETAILSAPIObj.responseData.availFabricQty,
        STOREDETAILSAPIObj.responseData.uomType,
      );
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const getFabricByfabricId = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    // set_isLoading(true);
    props.setLoad(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "processId": 0,
      "woStyleId": fabricId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
    };

    let STOREDETAILSAPIObj = await APIServiceCall.getFabricByfabricId(obj);
    // set_isLoading(false);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      // set_editFabric(false);
      // set_itemsObj((prev) => ({ ...prev, approvedFabric: STOREDETAILSAPIObj.responseData.approvedFabric }));
      // set_itemsObj((prev) => ({ ...prev, approvedFabricConsumption: STOREDETAILSAPIObj.responseData.approvedFabricConsumption }));
      // set_itemsObj((prev) => ({ ...prev, allowanceFabric: STOREDETAILSAPIObj.responseData.allowanceFabric }));
      // set_itemsObj((prev) => ({ ...prev, totalFabricApprovedWithAllowance: STOREDETAILSAPIObj.responseData.totalFabricApprovedWithAllowance }));
      set_itemsObj(prev => ({
        ...prev,
        availFabricQty: STOREDETAILSAPIObj.responseData.availFabricQty,
      }));
      set_itemsObj(prev => ({
        ...prev,
        uomfabric: STOREDETAILSAPIObj.responseData.uomType,
      }));
      set_availableQty(STOREDETAILSAPIObj.responseData.availFabricQty);

      console.log(
        'Values to Prepopulate',
        STOREDETAILSAPIObj.responseData.approvedFabric,
        STOREDETAILSAPIObj.responseData.approvedFabricConsumption,
        STOREDETAILSAPIObj.responseData.allowanceFabric,
        STOREDETAILSAPIObj.responseData.totalFabricApprovedWithAllowance,
        STOREDETAILSAPIObj.responseData.availFabricQty,
        STOREDETAILSAPIObj.responseData.uomType,
      );
      // set_itemsObj((prev) => ({ ...prev, fabricqty: STOREDETAILSAPIObj.responseData.fabricqty}));
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const getStockbyTypeId = async (rowId, stockTId) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    // set_isLoading(true);
    props.setLoad(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "processId": 0,
      "trimTypeId": stockTId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    };

    let STOREDETAILSAPIObj = await APIServiceCall.getTrimsByTypeId(obj);
    // set_isLoading(false);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      // setRows(STOREDETAILSAPIObj.responseData);
      setRows(
        rows.map(row =>
          row.id === rowId
            ? {
                ...row,
                stocksList: STOREDETAILSAPIObj.responseData,
                filteredStocks: STOREDETAILSAPIObj.responseData,
              }
            : row,
        ),
      );

      console.log(' Trims List ==> ', STOREDETAILSAPIObj?.responseData[0]);
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const getStockQty = async (rowId, trimId) => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    props.setLoad(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "trimId": trimId,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

    };

    let STOREDETAILSAPIObj = await APIServiceCall.getStockQty(obj);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      setRows(
        rows.map(row =>
          row.id === rowId
            ? {
                ...row,
                uom: STOREDETAILSAPIObj.responseData.uomstock,
                availableQty: STOREDETAILSAPIObj.responseData.stockAvailQty,
              }
            : row,
        ),
      );

      console.log(
        'getStockQty==> ',
        STOREDETAILSAPIObj.responseData.uomstock,
        STOREDETAILSAPIObj.responseData.stockAvailQty,
      );
    } else {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      console.log('service fail msg', 'else');
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      console.log('service fail msg', STOREDETAILSAPIObj.error);
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
    }
  };

  const getRmQtyByLot = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    // set_isLoading(true);
    props.setLoad(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),
      "processId": 0,
      "woStyleId": 0,
      "trimId": 175,
      "locationId": 1,
      "lotId": 1,
      "sizeId": 0,
    };

    let STOREDETAILSAPIObj = await APIServiceCall.getRmQtyByLot(obj);
    // set_isLoading(false);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_stockQtyItemsObj(prev => ({
        ...prev,
        uomstock: STOREDETAILSAPIObj.responseData.uomstock,
      }));
      set_stockQtyItemsObj(prev => ({
        ...prev,
        stockAvailQty: STOREDETAILSAPIObj.responseData.stockAvailQty,
      }));
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };
  const getRmQtyByLocation = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    // set_isLoading(true);
    props.setLoad(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

      "processId": 0,
      "woStyleId": 0,
      "trimId": 175,
      "locationId": 1,
      "lotId": 1,
    };

    let STOREDETAILSAPIObj = await APIServiceCall.getRmQtyByLocation(obj);
    // set_isLoading(false);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_stockQtyItemsObj(prev => ({
        ...prev,
        uomstock: STOREDETAILSAPIObj.responseData.uomstock,
      }));
      set_stockQtyItemsObj(prev => ({
        ...prev,
        stockAvailQty: STOREDETAILSAPIObj.responseData.stockAvailQty,
      }));
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };
  const getFabQtyByLocation = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    // set_isLoading(true);
    props.setLoad(true);

    let obj = {
      "username": userName,
      "password": userPsd,
      "compIds": usercompanyId,
      "company":JSON.parse(companyObj),

      "processId": 0,
      "woStyleId": 0,
      "trimId": 266,
      "locationId": 1,
      "lotId": 0,
    };

    let STOREDETAILSAPIObj = await APIServiceCall.getFabQtyByLocation(obj);
    // set_isLoading(false);
    props.setLoad(false);

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.statusData) {
      set_stockQtyItemsObj(prev => ({
        ...prev,
        uomstock: STOREDETAILSAPIObj.responseData.uomstock,
      }));
      set_stockQtyItemsObj(prev => ({
        ...prev,
        stockAvailQty: STOREDETAILSAPIObj.responseData.stockAvailQty,
      }));
    } else {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    if (STOREDETAILSAPIObj && STOREDETAILSAPIObj.error) {
      popUpAction(
        Constant.SERVICE_FAIL_MSG,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const ApproveAction = () => {
    console.log('Approved');

    const requestDetails = rows.map(detail => ({
      stockType: detail.stockTypeId,
      stockTypeName: detail.stockType,
      stock: detail.stockId,
      stock_rm_lot: 0,
      stockLocationId: 1,
      styleRmSizeId: detail.size,
      inputQty: detail.inputQty,
      uomstock: detail.uom,
    }));

    let tempObj = {
      processId: processId,
      woStyleId: stylesId,
      trimId: fabricId,
      locationId: locationId,
      unitMasterId: unitMasterId,
      comments: remarks,
      general: generalRadio === 'Yes' ? '1' : '0',
      styleWise: displayStyleRadio === 'Yes' ? '1' : '0',
      fabricQty: enteredFabQty,
      uom: itemsObj?.uomfabric,
      rmDetails: requestDetails,
    };

    // console.log("SAVING OBJ=====>   ", tempObj);
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const handleCheckBoxToggle = () => {
    set_checkbox(!checkbox);
  };

  const actionOnFabrics = (id, name) => {
    set_fabricId(id);
    set_fabricName(name);
    set_showFabricList(false);
  };

  // Action for Styles
  const actionOnStyles = (stylesId, stylesName) => {
    set_stylesId(stylesId);
    set_stylesName(stylesName);
    set_showStylesList(false);
  };

  // Action for Process
  const actionOnProcess = (processId, processName) => {
    set_processId(processId);
    set_processName(processName);
    set_showProcessList(false);
  };

  // Action for UnitMaster
  const actionOnUnitMaster = (unitMasterId, unitMasterName) => {
    set_unitMasterId(unitMasterId);
    set_unitMasterName(unitMasterName);
    set_showUnitMasterList(false);
  };

  const actionOnStocks = async (item, rowId) => {
    set_dataFromStock({
      row: rowId,
      id: item?.id,
    });

    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              stock: item?.name,
              stockId: item?.id,
              showStocksList: false,
            }
          : row,
      ),
    );

    // await getStockQty(rowId, item?.id);
  };

  const actionOnStockTypes = async (item, rowId) => {
    set_dataFromStockType({
      row: rowId,
      id: item?.id,
    });

    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              stockType: item?.name,
              stockTypeId: item?.id,
              showStockTypesList: false,
            }
          : row,
      ),
    );

    // await getStockbyTypeId(rowId, item.id);
  };

  const handleSearchStyles = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockStyles.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredStockStyles(filtered);
    } else {
      set_filteredStockStyles(props.lists.getStockStyles);
    }
  };

  const handleSearchFabrics = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredStockFabrics(filtered);
    } else {
      set_filteredStockFabrics(props.lists.getStockFabrics);
    }
  };

  const handleSearchUnitMaster = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getBatches.filter(unitMaster =>
        unitMaster.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredUnitMaster(filtered);
    } else {
      set_filteredUnitMaster(props.lists.getBatches);
    }
  };

  const handleSearchStockType = (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredStockTypes: props.lists.getStockTypes.filter(stockType =>
                stockType.name.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : r,
      ),
    );
  };

  const handleSearchStock = (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredStocks: r.stocksList.filter(stock =>
                stock.name.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : r,
      ),
    );
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
          title={'Create Request'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}>
        <View style={{marginBottom: hp('5%')}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('3%'),
              backgroundColor: '#ffffff',
            }}>
            <View style={{flexDirection: 'column', marginTop: hp('1%')}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: hp('1%'),
                }}>
                <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                  General
                </Text>
                <Text style={{marginRight: wp('2%'), color: '#000'}}>Yes</Text>
                <RadioButton
                  value="Yes"
                  status={generalRadio === 'Yes' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    set_generalRadio('Yes');
                    set_buyerRadio('No');
                    set_displayStyleRadio('No');
                  }}
                />

                <Text
                  style={{
                    marginRight: wp('2%'),
                    marginLeft: wp('4%'),
                    color: '#000',
                  }}>
                  No
                </Text>
                <RadioButton
                  value="No"
                  status={generalRadio === 'No' ? 'checked' : 'unchecked'}
                  onPress={() => set_generalRadio('No')}
                />
              </View>

              {generalRadio === 'No' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: hp('1%'),
                  }}>
                  <Text
                    style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                    Buyer PO Wise
                  </Text>
                  <Text style={{marginRight: wp('2%'), color: '#000'}}>
                    Yes
                  </Text>
                  <RadioButton
                    value="Yes"
                    status={buyerRadio === 'Yes' ? 'checked' : 'unchecked'}
                    onPress={() => set_buyerRadio('Yes')}
                  />
                  <Text
                    style={{
                      marginRight: wp('2%'),
                      marginLeft: wp('4%'),
                      color: '#000',
                    }}>
                    No
                  </Text>
                  <RadioButton
                    value="No"
                    status={buyerRadio === 'No' ? 'checked' : 'unchecked'}
                    onPress={() => set_buyerRadio('No')}
                  />
                </View>
              )}

              {generalRadio === 'No' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: hp('1%'),
                  }}>
                  <Text
                    style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                    Display Style Wise
                  </Text>
                  <Text
                    style={{
                      marginRight: wp('2%'),
                      color: '#000',
                      color: '#000',
                    }}>
                    Yes
                  </Text>
                  <RadioButton
                    value="Yes"
                    status={
                      displayStyleRadio === 'Yes' ? 'checked' : 'unchecked'
                    }
                    onPress={() => set_displayStyleRadio('Yes')}
                  />
                  <Text
                    style={{
                      marginRight: wp('2%'),
                      marginLeft: wp('4%'),
                      color: '#000',
                    }}>
                    No
                  </Text>
                  <RadioButton
                    value="No"
                    status={
                      displayStyleRadio === 'No' ? 'checked' : 'unchecked'
                    }
                    onPress={() => set_displayStyleRadio('No')}
                  />
                </View>
              )}
            </View>
          </View>

          {generalRadio === 'No' && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp('3%'),
                backgroundColor: '#ffffff',
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
                  set_showStylesList(!showStylesList);
                }}>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        stylesId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Styles '}
                    </Text>
                    <Text style={[styles.dropTextInputStyle]}>
                      {stylesId ? stylesName : 'Select Style'}
                    </Text>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {/* {showStylesList ? (
                            <View style={styles.popSearchViewStyle}>
                                <ScrollView nestedScrollEnabled={true}>
                                    {props?.lists?.getStockStyles?.map((item) => (
                                        <TouchableOpacity key={item?.id} onPress={() => actionOnStyles(item.id, item.name)}>
                                            <View style={styles.flatview}>
                                                <Text style={styles.dropTextInputStyle}>{item?.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        ) : null} */}

              {showStylesList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchStyles}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredStockStyles.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredStockStyles.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnStyles(item.id, item.name)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#f8f8f8',
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
                set_showFabricList(!showFabricList);
              }}>
              <View style={[styles.SectionStyle1, {}]}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={
                      fabricId
                        ? [styles.dropTextLightStyle]
                        : [styles.dropTextInputStyle]
                    }>
                    {'Fabric '}
                  </Text>
                  <Text style={[styles.dropTextInputStyle]}>
                    {fabricId ? fabricName : 'Select fabric'}
                  </Text>
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showFabricList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchFabrics}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredStockFabrics.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredStockFabrics.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnFabrics(item.id, item.name)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {generalRadio === 'No' && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp('1%'),
              }}>
              <TextInputComponent
                inputText={
                  itemsObj?.approvedFabric
                    ? `${itemsObj?.approvedFabric} (${itemsObj?.approvedFabricConsumption})`
                    : ''
                }
                labelText={'Approved Fabric(Consumption) )'}
                isEditable={false}
                maxLengthVal={200}
                autoCapitalize={'none'}
                isBackground={'#dedede'}
                // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
              />
            </View>
          )}

          {generalRadio === 'No' && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp('1%'),
              }}>
              <TextInputComponent
                inputText={
                  itemsObj?.allowanceFabric ? itemsObj?.allowanceFabric : ''
                }
                labelText={'Fabric Allowance ( % )'}
                isEditable={false}
                maxLengthVal={200}
                autoCapitalize={'none'}
                isBackground={'#dedede'}
                // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
              />
            </View>
          )}

          {generalRadio === 'No' && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp('1%'),
              }}>
              <TextInputComponent
                inputText={
                  itemsObj?.totalFabricApprovedWithAllowance
                    ? itemsObj?.totalFabricApprovedWithAllowance?.toString()
                    : ''
                }
                labelText={'Approved Fabric With Allowance'}
                isEditable={false}
                maxLengthVal={200}
                autoCapitalize={'none'}
                isBackground={'#dedede'}
                // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
              />
            </View>
          )}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={
                itemsObj?.availFabricQty
                  ? itemsObj?.availFabricQty?.toString()
                  : '0'
              }
              labelText={'Fabric Available Qty '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              // setValue={(textAnswer) => { set_enteredFabQty(textAnswer) }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={itemsObj?.uomfabric ? itemsObj?.uomfabric : ''}
              labelText={'UOM Fabric '}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={enteredFabQty}
              labelText={'Fabric Qty '}
              isEditable={true}
              maxLengthVal={200}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              setValue={textAnswer => {
                set_enteredFabQty(textAnswer);
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#ffffff',
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
                set_showProcessList(!showProcessList);
              }}>
              <View style={[styles.SectionStyle1, {}]}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={
                      processId
                        ? [styles.dropTextLightStyle]
                        : [styles.dropTextInputStyle]
                    }>
                    {'Process '}
                  </Text>
                  <Text style={[styles.dropTextInputStyle]}>
                    {processId ? processName : 'Select Process'}
                  </Text>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showProcessList ? (
              <View style={styles.popSearchViewStyle}>
                <ScrollView nestedScrollEnabled={true}>
                  {props?.lists?.getMenus?.map(item => (
                    <TouchableOpacity
                      key={item?.id}
                      onPress={() => actionOnProcess(item.id, item.name)}>
                      <View style={styles.flatview}>
                        <Text style={styles.dropTextInputStyle}>
                          {item?.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              backgroundColor: '#ffffff',
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
                set_showUnitMasterList(!showUnitMasterList);
              }}>
              <View style={[styles.SectionStyle1, {}]}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={
                      unitMasterId
                        ? [styles.dropTextLightStyle]
                        : [styles.dropTextInputStyle]
                    }>
                    {'Unit Master '}
                  </Text>
                  <Text style={[styles.dropTextInputStyle]}>
                    {unitMasterId ? unitMasterName : 'Select Unit Master'}
                  </Text>
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showUnitMasterList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchUnitMaster}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredUnitMaster.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredUnitMaster.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnUnitMaster(item.id, item.name)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* //==========Remarks========= */}

          <View
            style={{
              width: '90%',
              marginTop: 20,
              marginBottom: 20,
              marginHorizontal: 15,
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
              {'Comments  :'}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: 'black',
                marginTop: 15,
                borderRadius: 10,
                backgroundColor: 'white',
                width: '100%',
              }}>
              <TextInput
                style={[
                  styles.input,
                  Platform.OS === 'ios' && {paddingVertical: 10}, // Apply padding only for iOS
                ]}
                placeholder=""
                autoCapitalize="none"
                multiline
                numberOfLines={2}
                value={remarks}
                onChangeText={text => set_remarks(text)}
              />
            </View>
          </View>

          {displayStyleRadio === 'No' && (
            <View
              style={{
                width: '90%',
                marginTop: 20,
                marginBottom: 30,
                marginHorizontal: 15,
              }}>
              <TouchableOpacity
                onPress={addRow}
                style={{
                  backgroundColor: color.color2,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                  Add Stock
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>Stock Type</Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>Stock</Text>
                  </View>
                  <View style={{width: 80}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Available Qty
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Input Quantity
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Stock UOM</Text>
                  </View>
                </View>

                {/* Table Body - Rows */}
                {rows.map(row => (
                  <View key={row.id} style={styles.table_body_single_row}>
                    <View style={{width: 60}}>
                      <TouchableOpacity
                        style={{alignItems: 'center'}}
                        onPress={() => RemoveRow(row.id)}>
                        <Image source={closeImg} style={styles.imageStyle1} />
                      </TouchableOpacity>
                    </View>

                    {/* Stock Type Dropdown */}
                    <View style={{width: 200}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: hp('1%'),
                          backgroundColor: row?.editStockType
                            ? '#ffffff'
                            : '#dedede',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            borderWidth: 0.5,
                            borderColor: '#D8D8D8',
                            borderRadius: hp('0.5%'),
                            width: '100%',
                            overflow: 'hidden',
                          }}
                          onPress={() => {
                            setRows(
                              rows.map(r =>
                                r.id === row.id
                                  ? {
                                      ...r,
                                      showStockTypesList: !r.showStockTypesList,
                                      showStocksList: false,
                                    }
                                  : {...r, showStockTypesList: false},
                              ),
                            );
                          }}>
                          <View style={[styles.SectionStyle1]}>
                            <View style={{flexDirection: 'column'}}>
                              <Text
                                style={
                                  row.stockType
                                    ? styles.dropTextLightStyle
                                    : styles.dropTextInputStyle
                                }>
                                {'StockTypes '}
                              </Text>
                              <Text style={styles.dropTextInputStyle}>
                                {row.stockTypeId
                                  ? row.stockType
                                  : 'Select Stock Type'}
                              </Text>
                            </View>
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <Image
                              source={downArrowImg}
                              style={{height: 40, width: 40}}
                            />
                          </View>
                        </TouchableOpacity>

                        {row.showStockTypesList && row.editStockType && (
                          <View style={styles.popSearchViewStyle}>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search Stock Type"
                              onChangeText={text =>
                                handleSearchStockType(text, row.id)
                              }
                              placeholderTextColor="#000"
                            />
                            <ScrollView nestedScrollEnabled={true}>
                              {row.filteredStockTypes.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                  Sorry, no results found!
                                </Text>
                              ) : (
                                row.filteredStockTypes.map(item => (
                                  <TouchableOpacity
                                    key={item?.id}
                                    onPress={() =>
                                      actionOnStockTypes(item, row.id)
                                    }>
                                    <View style={styles.flatview}>
                                      <Text style={styles.dropTextInputStyle}>
                                        {item?.name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ))
                              )}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Stock Dropdown */}
                    <View style={{width: 200}}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: hp('2%'),
                          backgroundColor: row.editStock
                            ? '#ffffff'
                            : '#dedede',
                        }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            borderWidth: 0.5,
                            borderColor: '#D8D8D8',
                            borderRadius: hp('0.5%'),
                            width: '100%',
                            overflow: 'hidden',
                          }}
                          onPress={() => {
                            setRows(
                              rows.map(r =>
                                r.id === row.id
                                  ? {
                                      ...r,
                                      showStocksList: !r.showStocksList,
                                      showStockTypesList: false,
                                    }
                                  : {...r, showStocksList: false},
                              ),
                            );
                          }}>
                          <View style={[styles.SectionStyle1]}>
                            <View style={{flexDirection: 'column'}}>
                              <Text
                                style={
                                  row.stockId
                                    ? styles.dropTextLightStyle
                                    : styles.dropTextInputStyle
                                }>
                                {'Stock '}
                              </Text>
                              <Text style={styles.dropTextInputStyle}>
                                {row.stockId ? row.stock : 'Select Stock'}
                              </Text>
                            </View>
                          </View>
                          <View style={{justifyContent: 'center'}}>
                            <Image
                              source={downArrowImg}
                              style={styles.imageStyle}
                            />
                          </View>
                        </TouchableOpacity>

                        {row.showStocksList && row.editStock && (
                          <View style={styles.popSearchViewStyle}>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search Stock"
                              onChangeText={text =>
                                handleSearchStock(text, row.id)
                              }
                              placeholderTextColor="#000"
                            />
                            <ScrollView nestedScrollEnabled={true}>
                              {row.filteredStocks.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                  Sorry, no results found!
                                </Text>
                              ) : (
                                row.filteredStocks.map(item => (
                                  <TouchableOpacity
                                    key={item?.id}
                                    onPress={() =>
                                      actionOnStocks(item, row.id)
                                    }>
                                    <View style={styles.flatview}>
                                      <Text style={styles.dropTextInputStyle}>
                                        {item?.name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ))
                              )}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Remaining columns... */}
                    <View style={{width: 80}}>
                      <Text style={styles.table_data}>{row.size}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.availableQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={row.inputQty}
                        onChangeText={text => {
                          setRows(
                            rows.map(r =>
                              r.id === row.id ? {...r, inputQty: text} : r,
                            ),
                          );
                        }}
                      />
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.uom}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={{marginBottom: 150}} />
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          leftButtonAction={() => backBtnAction()}
          rightButtonAction={async () => ApproveAction()}
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

export default CreateRequestUi;

const styles = StyleSheet.create({
  popSearchViewStyle: {
    height: hp('40%'),
    width: wp('90%'),
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
    borderWidth: 1,
    marginTop: 3,
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
    alignItems: 'center',
    height: hp('7%'),
    width: wp('75%'),
    borderRadius: hp('0.5%'),
  },

  // Adjust the image style to make it smaller and visible
  // imageStyle: {
  //     height: wp("6%"),
  //     aspectRatio: 1,
  //     marginRight: wp('4%'),
  //     resizeMode: 'contain',
  // },

  imageStyle: {
    height: 50,
    width: 50,
    aspectRatio: 1,
    marginRight: 20,
    resizeMode: 'contain',
  },
  imageStyle1: {
    height: 30,
    aspectRatio: 1,
    resizeMode: 'contain',
    tintColor: 'red',
    alignSelf: 'center',
  },

  dropTextInputStyle: {
    fontWeight: 'normal',
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: '300',
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
    flex: 1,
    marginTop: hp('2%'),
    width: '95%',
    marginBottom: 10,
    marginHorizontal: 10,
  },

  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: color.color2,
    alignItems: 'center',
  },

  table_head_captions: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 5,
  },

  table_body_single_row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10, // Adjust vertical padding for rows
    paddingHorizontal: 5, // Add horizontal padding
    justifyContent: 'center',
    alignItems: 'center',
  },

  table_data: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 5, // Add padding for data cells
  },

  table: {
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: '#fff',
  },

  checkbox_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  table_data_input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    textAlign: 'center',
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
  input: {
    color: '#000',
  },
  dropdownContent1: {
    elevation: 5,
    height: 220,
    alignSelf: 'center',
    width: '90%',
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
