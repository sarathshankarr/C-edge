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

