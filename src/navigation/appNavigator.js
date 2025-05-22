import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from '../components/loginComponent/loginComponent';
import HomeScreenComponent from '../components/homeScreenComponents/homeScreenComponent';
import POApprovalComponent from '../components/poComponents/poApprovalComponents/poApprovalComponent';
import POApproveListComponent from '../components/poComponents/poApproveListComponents/poApproveListComponent';
import StyleManageComponent from '../components/styleComponents/styleManageComponents/styleManageComponent';
import StyleDetailsComponent from '../components/styleComponents/styleDetailComponents/styleDetailsComponent';
import ViewTimeSummaryComponent from '../components/viewTimeSummaryComponents/viewTimeSummaryComponent';
import styleSizeDetailsComponents from '../components/styleComponents/styleSizeDetailsComponents/styleSizeDetailsComponent';
import CuttingMainComponent from '../components/cuttingComponents/cuttingMainComponents/cuttingMainComponent';
import FabricMainComponent from '../components/cuttingComponents/fabricComponents/fabricComponent';
import FinishingStyleComponent from '../components/finishingStyleComponents/finishinInComponents/loadFinishingComponents/finishingStyleComponent';
import ViewProcessFlowComponent from '../components/viewProcessFlowComponents/viewProcessFlowComponent';
import AddFinishingComponent from '../components/finishingStyleComponents/finishinInComponents/addFinishingComponents/addFinishingComponent';
import StyleSizeDetailsComponent from '../components/styleComponents/styleSizeDetailsComponents/styleSizeDetailsComponent';
import CuttingSaveComponent from '../components/cuttingComponents/cuttingSaveComponents/cuttingSaveComponent';
import SaveFininshingInComponent from '../components/finishingStyleComponents/finishinInComponents/saveFinishingInComponents/saveFinishingInComponent';
import StichingOutComponent from '../components/stichingComponents/stichingOutComponents/stichingOutComponent';
import SaveStichingOutComponent from '../components/stichingComponents/stichingOutComponents/saveStichingOutComponent';
import StoreApproveListComponent from '../components/storeComponents/storeApproveComponents/storeApproveListComponent';
import FinishingOutListComponent from '../components/finishingStyleComponents/finishingOutComponents/finishingOutListComponent';
import StichingInComponent from '../components/stichingComponents/stichingInComponents/stichingInComponent';
import BundlingComponent from '../components/bundlingComponents/bundlingComponent';
import SaveFininshingOutComponent from '../components/finishingStyleComponents/finishingOutComponents/saveFinishingOutComponent';
import SaveStichingInComponent from '../components/stichingComponents/stichingInComponents/saveStitchingInComponent';
import DashboardComponent from '../components/dashboard/dashboardComponent';
import Dashboard from '../pages/bottom/Dashboard/Dashboard';
import OrderManagement from '../pages/bottom/Order management/OrderManagement';
import StyleManagement from '../pages/bottom/styleManagement/styleManagement';
import Production from '../pages/bottom/Production/Production';
import Inventory from '../pages/bottom/inventory/inventory';
import FabricProcessInList from '../components/fabricProcessIn/fabricProcessIn/FabricProcessInList';
import FabricProcessInListUI from '../components/fabricProcessIn/fabricProcessIn/FabricProcessInListUI';
import SaveFabricProcessIn from '../components/fabricProcessIn/fabricProcessIn/SaveFabricProcessIn';
import SaveFabricProcessInUI from '../components/fabricProcessIn/fabricProcessIn/SaveFabricProcessInUI';
import Main from '../pages/main/main';
import CommonHeader from '../utils/commonComponents/CommonHeader';
import { SafeAreaView } from 'react-native';
import LocationStyleWiseInventory from '../components/inventory/Style Wise RMFabric Inventory/LocationStyleWiseInventory';
import LocationWiseRMFabInv from '../components/inventory/Location wise RMFabric Inventory/LocationWiseRMFabInv';
import StyleLocationInventory from '../components/inventory/Location Wise Style Inventory/StyleLocationInventory';
import DDAEdit from '../components/design/designDirectoryApproval/DDAEdit';
import DDAList from '../components/design/designDirectoryApproval/DDAList';
import Notifications from '../components/notifications/Notifications';
import StoreManagement from '../pages/bottom/StoreManagement/StoreManagement';
import StoreApproveEdit from '../components/storeComponents/StoreApproveEdit/storeApproveEdit';
import StockRequestList from '../components/storeComponents/StockRequest/StockRequestList';
import StockRecieveList from '../components/storeComponents/stockRecieve/StockRecieveList';
import StockRequestEdit from '../components/storeComponents/StockRequest/StockRequestEdit';
import StockRecieveEdit from '../components/storeComponents/stockRecieve/stockRecieveEdit';
import CreateRequest from '../components/storeComponents/StockRequest/CreateRequest/CreateRequest';
import StyleProcessWorkFlow from '../components/styleProcessWorkFlow/StyleProcessWorkFlow';
import ScanQRPage from '../components/qrScanner/ScanQRPage';
import CreateInProcessComponent from '../components/fabricProcessIn/fabricProcessIn/CreateInProcessComponent';
import MailConfirmation from '../components/forgetPassword/MailConfirmation';
import EnterOtp from '../components/forgetPassword/EnterOtp';
import ConfirmPassword from '../components/forgetPassword/ConfirmPassword';
import GatePassAckList from '../components/gatePassAcknowledgement/Listpage/GatePassAckList';
import GatePassAckEdit from '../components/gatePassAcknowledgement/EditPage/GatePassAckEdit';
import InventoryConsumptionReport from '../components/reports/InventoryConsumptionReport/InventoryConsumptionReport';


import Splash from '../pages/splash/splash';
import Settings from '../components/settings/Settings';
import SalesOrderReport from '../components/reports/SalesOrderReport/SalesOrderReport';
import ProductionProcessReport from '../components/reports/Production process report/ProductionProcessReport';
import StyleBomReport from '../components/reports/Style BOM report/StyleBomReport';
import WorkerWagesReport from '../components/reports/Worker wages report/WorkerWagesReport';
import FabricList from '../components/masters/Fabric/FabricList';
import FabricEdit from '../components/masters/Fabric/FabricEdit';
import SaveRawMaterialsMaster from '../components/masters/RawMaterialsMaster/SaveRawMaterialsMaster';
import RawMaterialsMasterList from '../components/masters/RawMaterialsMaster/RawMaterialsMasterList';
import CreateRawMaterialsMasterComponent from '../components/masters/RawMaterialsMaster/CreateRawMaterialsMasterComponent';
import CreateFabricComponent from '../components/masters/Fabric/CreateFabricComponent';
import CreateUomMasterComponent from '../components/masters/UOM Master/CreateUomMasterComponent';
import UomMasterList from '../components/masters/UOM Master/UomMasterList';
import SaveUomMaster from '../components/masters/UOM Master/SaveUomMaster';
import CreateLocationMasterComponent from '../components/masters/LocationMaster/CreateLocationMasterComponent';
import LocationMasterList from '../components/masters/LocationMaster/LocationMasterList';
import LocationMasterEdit from '../components/masters/LocationMaster/LocationMasterEdit';
import CreateRawMaterialTypeComponent from '../components/masters/Raw Material Type/CreateRawMaterialTypeComponent';
import RawMaterialTypeList from '../components/masters/Raw Material Type/RawMaterialTypeList';
import SaveRawMaterialType from '../components/masters/Raw Material Type/SaveRawMaterialType';
import CreateSeasonMasterComponent from '../components/masters/SeasonGroupMaster/CreateSeasonMasterComponent';
import SeasonMasterList from '../components/masters/SeasonGroupMaster/SeasonMasterList';
import SaveSeasonMaster from '../components/masters/SeasonGroupMaster/SaveSeasonMaster';
import CreateSizeMasterComponent from '../components/masters/SizeMaster/CreateSizeMasterComponent';
import SizeMasterList from '../components/masters/SizeMaster/SizeMasterList';
import SaveSizeMaster from '../components/masters/SizeMaster/SaveSizeMaster';
import CreateScaleOrSizeComponent from '../components/masters/ScaleOrSizeGroupMaster/CreateScaleOrSizeComponent';
import ScaleOrSizeMasterList from '../components/masters/ScaleOrSizeGroupMaster/ScaleOrSizeMasterList';
import SaveScaleOrSizeMaster from '../components/masters/ScaleOrSizeGroupMaster/SaveScaleOrSizeMaster';
import CreateColorMasterComponent from '../components/masters/Color Master/CreateColorMasterComponent';
import ColorMasterList from '../components/masters/Color Master/ColorMasterList';
import SaveColorMaster from '../components/masters/Color Master/SaveColorMaster';
import CreateVendorOrCustomerMasterComponent from '../components/masters/VendorOrCustomerMaster/CreateVendorOrCustomerMasterComponent';
import VendorOrCustomerMasterList from '../components/masters/VendorOrCustomerMaster/VendorOrCustomerMasterList';
import VendorOrCustomerMasterEdit from '../components/masters/VendorOrCustomerMaster/VendorOrCustomerMasterEdit';
import StyleCreate from '../components/styleComponents/styleCreateComponents/StyleCreate';
import PartProcessingList from '../components/Part Processing/PartProcessingList';
import SavePartProcessing from '../components/Part Processing/SavePartProcessing';
import CreatePartProcessing from '../components/Part Processing/CreatePartProcessing';
import CuttingReport from '../components/reports/CuttingReport/CuttingReport';
import BatchWiseReport from '../components/reports/Batch Wise Production Process Report/BatchWiseReport';
import CreatePurchaseOrderDraft from '../components/Purchase Order Draft/CreatePurchaseOrderDraft';
import PurchaseOrderDraftList from '../components/Purchase Order Draft/PurchaseOrderDraftList';
import SavePurchaseOrderDraft from '../components/Purchase Order Draft/SavePurchaseOrderDraft';
import GrnApproveList from '../components/GRN Approve/GrnApproveList';
import SaveGrnApprove from '../components/GRN Approve/SaveGrnApprove';
import CreateBoxPacking from '../components/Box Packing/CreateBoxPacking';
import BoxPackingList from '../components/Box Packing/BoxPackingList';
import SaveBoxPacking from '../components/Box Packing/SaveBoxPacking';
import CreateMasterBoxPacking from '../components/Master Box Packing/CreateMasterBoxPacking';
import masterBoxPackingList from '../components/Master Box Packing/MasterBoxPackingList';
import SaveMasterBoxPacking from '../components/Master Box Packing/SaveMasterBoxPacking';
import CreateWorkOrderStyle from '../components/Work Order Style/CreateWorkOrderStyle';
import WorkOrderStyleList from '../components/Work Order Style/WorkOrderStyleList';
import SaveWorkOrderStyle from '../components/Work Order Style/SaveWorkOrderStyle';
import CreateBillGeneration from '../components/Bill Generation/CreateBillGeneration';
import BillGenerationList from '../components/Bill Generation/BillGenerationList';
import SaveBillGeneration from '../components/Bill Generation/SaveBillGeneration';
import CreateNewProcessIn from '../components/New Process In/CreateNewProcessIn';
import NewProcessInList from '../components/New Process In/NewProcessInList';
import SaveNewProcessIn from '../components/New Process In/SaveNewProcessIn';
import CreateNewProcessOut from '../components/New Process Out/CreateNewProcessOut';
import NewProcessOutList from '../components/New Process Out/NewProcessOutList';
import SaveNewProcessOut from '../components/New Process Out/SaveNewProcessOut';
import CreateWorkOrderBuyerPo from '../components/Work Order Buyer Po/CreateWorkOrderBuyerPo';
import WorkOrderBuyerPoList from '../components/Work Order Buyer Po/WorkOrderBuyerPoList';
import SaveWorkOrderBuyerPo from '../components/Work Order Buyer Po/SaveWorkOrderBuyerPo';
import SaveStyleTransferOut from '../components/Style Transfer Out/SaveStyleTransferOut';
import CreateStyleTransferOut from '../components/Style Transfer Out/CreateStyleTransferOut';
import StyleTransferOutList from '../components/Style Transfer Out/StyleTransferOutList';
import GoodsReceiptNoteList from '../components/GoodsReceiptNote/GoodsReceiptNoteList';
import SaveGoodsReceiptNote from '../components/GoodsReceiptNote/SaveGoodsReceiptNote';
import CreateNewOutInProcess from '../components/NewOutInProcess/CreateNewOutInProcess';
import NewOutInProcessList from '../components/NewOutInProcess/NewOutInProcessList';
import NewOutInProcessEdit from '../components/NewOutInProcess/NewOutInProcessEdit';


const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="SplashComponent" screenOptions={{ animationEnabled: true, gestureEnabled: true }}>
      <Stack.Screen name="LoginComponent" component={LoginComponent} options={{ headerShown: false }} />
      <Stack.Screen name="SplashComponent" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreenComponent" component={HomeScreenComponent} options={{ headerShown: false }} />
      <Stack.Screen name="POApprovalComponent" component={POApprovalComponent} options={{ headerShown: false }} />
      <Stack.Screen name="POApproveListComponent" component={POApproveListComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StyleManageComponent" component={StyleManageComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StyleDetailsComponent" component={StyleDetailsComponent} options={{ headerShown: false }} />
      <Stack.Screen name="ViewTimeSummaryComponent" component={ViewTimeSummaryComponent} options={{ headerShown: false }} />
      <Stack.Screen name="styleSizeDetailsComponents" component={styleSizeDetailsComponents} options={{ headerShown: false }} />
      <Stack.Screen name="CuttingMainComponent" component={CuttingMainComponent} options={{ headerShown: false }} />
      <Stack.Screen name="FabricMainComponent" component={FabricMainComponent} options={{ headerShown: false }} />
      <Stack.Screen name="FinishingStyleComponent" component={FinishingStyleComponent} options={{ headerShown: false }} />
      <Stack.Screen name="ViewProcessFlowComponent" component={ViewProcessFlowComponent} options={{ headerShown: false }} />
      <Stack.Screen name="AddFinishingComponent" component={AddFinishingComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StyleSizeDetailsComponent" component={StyleSizeDetailsComponent} options={{ headerShown: false }} />
      <Stack.Screen name="CuttingSaveComponent" component={CuttingSaveComponent} options={{ headerShown: false }} />
      <Stack.Screen name="SaveFininshingInComponent" component={SaveFininshingInComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StichingOutComponent" component={StichingOutComponent} options={{ headerShown: false }} />
      <Stack.Screen name="SaveStichingOutComponent" component={SaveStichingOutComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StoreApproveListComponent" component={StoreApproveListComponent} options={{ headerShown: false }} />
      <Stack.Screen name="FinishingOutListComponent" component={FinishingOutListComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StichingInComponent" component={StichingInComponent} options={{ headerShown: false }} />
      <Stack.Screen name="BundlingComponent" component={BundlingComponent} options={{ headerShown: false }} />
      <Stack.Screen name="SaveFininshingOutComponent" component={SaveFininshingOutComponent} options={{ headerShown: false }} />
      <Stack.Screen name="SaveStichingInComponent" component={SaveStichingInComponent} options={{ headerShown: false }} />
      <Stack.Screen name="DashboardComponent" component={DashboardComponent} options={{ headerShown: false }} />
      <Stack.Screen name="StyleManagement" component={StyleManagement} options={{ headerShown: false }} />
      <Stack.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
      <Stack.Screen name="OrderManagement" component={OrderManagement} options={{ headerShown: false }} />
      <Stack.Screen name="Production" component={Production} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="FabricProcessInList" component={FabricProcessInList} options={{ headerShown: false }} />
      <Stack.Screen name="FabricProcessInListUI" component={FabricProcessInListUI} options={{ headerShown: false }} />
      <Stack.Screen name="SaveFabricProcessIn" component={SaveFabricProcessIn} options={{ headerShown: false }} />
      <Stack.Screen name="SaveFabricProcessInUI" component={SaveFabricProcessInUI} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInProcess" component={CreateInProcessComponent} options={{ headerShown: false }} />
      <Stack.Screen name="LocationStyleWiseInventory" component={LocationStyleWiseInventory} options={{ headerShown: false }} />
      <Stack.Screen name="LocationWiseRMFabInv" component={LocationWiseRMFabInv} options={{ headerShown: false }} />
      <Stack.Screen name="StyleLocationInventory" component={StyleLocationInventory} options={{ headerShown: false }} /> 
      <Stack.Screen name="DDAEdit" component={DDAEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="DDAList" component={DDAList} options={{ headerShown: false }} /> 
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} /> 
      <Stack.Screen name="StoreManagement" component={StoreManagement} options={{ headerShown: false }} /> 
      <Stack.Screen name="storeApproveEdit" component={StoreApproveEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="StockRequestList" component={StockRequestList} options={{ headerShown: false }} /> 
      <Stack.Screen name="StockRecieveList" component={StockRecieveList} options={{ headerShown: false }} /> 
      <Stack.Screen name="StockRequestEdit" component={StockRequestEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="StockRecieveEdit" component={StockRecieveEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateStockRequest" component={CreateRequest} options={{ headerShown: false }} /> 
      <Stack.Screen name="StyleProcessWorkFlow" component={StyleProcessWorkFlow} options={{ headerShown: false }} /> 
      <Stack.Screen name="ScanQRPage" component={ScanQRPage} options={{ headerShown: false }} /> 
      <Stack.Screen name="MailConfirmation" component={MailConfirmation} options={{ headerShown: false }} /> 
      <Stack.Screen name="EnterOtp" component={EnterOtp} options={{ headerShown: false }} /> 
      <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} options={{ headerShown: false }} /> 
      <Stack.Screen name="GatePassAckList" component={GatePassAckList} options={{ headerShown: false }} /> 
      <Stack.Screen name="GatePassAckEdit" component={GatePassAckEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} /> 
      <Stack.Screen name="InventoryConsumptionReport" component={InventoryConsumptionReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="SalesOrderReport" component={SalesOrderReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="ProductionProcessReport" component={ProductionProcessReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="StyleBomReport" component={StyleBomReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="WorkerWagesReport" component={WorkerWagesReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateFabricComponent" component={CreateFabricComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="masterFabricList" component={FabricList} options={{ headerShown: false }} /> 
      <Stack.Screen name="masterFabricEdit" component={FabricEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateRawMaterialsMasterComponent" component={CreateRawMaterialsMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="RawMaterialsMasterList" component={RawMaterialsMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveRawMaterialsMaster" component={SaveRawMaterialsMaster} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateUomMasterComponent" component={CreateUomMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="UomMasterList" component={UomMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveUomMaster" component={SaveUomMaster} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateLocationMasterComponent" component={CreateLocationMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="LocationMasterList" component={LocationMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="LocationMasterEdit" component={LocationMasterEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateRawMaterialTypeComponent" component={CreateRawMaterialTypeComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="RawMaterialTypeList" component={RawMaterialTypeList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveRawMaterialType" component={SaveRawMaterialType} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateSeasonMasterComponent" component={CreateSeasonMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="SeasonMasterList" component={SeasonMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveSeasonMaster" component={SaveSeasonMaster} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateSizeMasterComponent" component={CreateSizeMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="SizeMasterList" component={SizeMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveSizeMaster" component={SaveSizeMaster} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateScaleOrSizeComponent" component={CreateScaleOrSizeComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="ScaleOrSizeMasterList" component={ScaleOrSizeMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveScaleOrSizeMaster" component={SaveScaleOrSizeMaster} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateColorMasterComponent" component={CreateColorMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="ColorMasterList" component={ColorMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveColorMaster" component={SaveColorMaster} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateVendorOrCustomerMasterComponent" component={CreateVendorOrCustomerMasterComponent} options={{ headerShown: false }} /> 
      <Stack.Screen name="VendorOrCustomerMasterList" component={VendorOrCustomerMasterList} options={{ headerShown: false }} /> 
      <Stack.Screen name="VendorOrCustomerMasterEdit" component={VendorOrCustomerMasterEdit} options={{ headerShown: false }} /> 
      <Stack.Screen name="StyleCreate" component={StyleCreate} options={{ headerShown: false }} /> 
      <Stack.Screen name="PartProcessingList" component={PartProcessingList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SavePartProcessing" component={SavePartProcessing} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreatePartProcessing" component={CreatePartProcessing} options={{ headerShown: false }} /> 
      <Stack.Screen name="CuttingReport" component={CuttingReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="BatchWiseReport" component={BatchWiseReport} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreatePurchaseOrderDraft" component={CreatePurchaseOrderDraft} options={{ headerShown: false }} /> 
      <Stack.Screen name="PurchaseOrderDraftList" component={PurchaseOrderDraftList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SavePurchaseOrderDraft" component={SavePurchaseOrderDraft} options={{ headerShown: false }} /> 
      <Stack.Screen name="GrnApproveList" component={GrnApproveList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveGrnApprove" component={SaveGrnApprove} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateBoxPacking" component={CreateBoxPacking} options={{ headerShown: false }} /> 
      <Stack.Screen name="BoxPackingList" component={BoxPackingList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveBoxPacking" component={SaveBoxPacking} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateMasterBoxPacking" component={CreateMasterBoxPacking} options={{ headerShown: false }} /> 
      <Stack.Screen name="masterBoxPackingList" component={masterBoxPackingList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveMasterBoxPacking" component={SaveMasterBoxPacking} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateWorkOrderStyle" component={CreateWorkOrderStyle} options={{ headerShown: false }} /> 
      <Stack.Screen name="WorkOrderStyleList" component={WorkOrderStyleList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveWorkOrderStyle" component={SaveWorkOrderStyle} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateWorkOrderBuyerPo" component={CreateWorkOrderBuyerPo} options={{ headerShown: false }} /> 
      <Stack.Screen name="WorkOrderBuyerPoList" component={WorkOrderBuyerPoList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveWorkOrderBuyerPo" component={SaveWorkOrderBuyerPo} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateBillGeneration" component={CreateBillGeneration} options={{ headerShown: false }} /> 
      <Stack.Screen name="BillGenerationList" component={BillGenerationList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveBillGeneration" component={SaveBillGeneration} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateNewProcessIn" component={CreateNewProcessIn} options={{ headerShown: false }} /> 
      <Stack.Screen name="NewProcessInList" component={NewProcessInList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveNewProcessIn" component={SaveNewProcessIn} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveNewProcessOut" component={SaveNewProcessOut} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateStyleTransferOut" component={CreateStyleTransferOut} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateNewProcessOut" component={CreateNewProcessOut} options={{ headerShown: false }} /> 
      <Stack.Screen name="NewProcessOutList" component={NewProcessOutList} options={{ headerShown: false }} /> 
      <Stack.Screen name="StyleTransferOutList" component={StyleTransferOutList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveStyleTransferOut" component={SaveStyleTransferOut} options={{ headerShown: false }} /> 
      <Stack.Screen name="GoodsReceiptNoteList" component={GoodsReceiptNoteList} options={{ headerShown: false }} /> 
      <Stack.Screen name="SaveGoodsReceiptNote" component={SaveGoodsReceiptNote} options={{ headerShown: false }} /> 
      <Stack.Screen name="CreateNewOutInProcess" component={CreateNewOutInProcess} options={{ headerShown: false }} /> 
      <Stack.Screen name="NewOutInProcessList" component={NewOutInProcessList} options={{ headerShown: false }} /> 
      <Stack.Screen name="NewOutInProcessEdit" component={NewOutInProcessEdit} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

function AppNavigator() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1}}> 
        <AppStack />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default AppNavigator;

