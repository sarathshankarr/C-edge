import React, { useState, useEffect,useRef } from 'react';
import HomeScreenUI from './homeScreenUI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreenComponent = ({ navigation, route, ...props }) => {

  const [itemsArray, set_itemsArray] = useState([
    // {id:0, itemName : 'Action Item', itemImg : require('./../../../assets/images/png/actionItem.png')},
    {id:1, itemName : 'Dashboard', itemImg : require('./../../../assets/images/png/dashboard.png')},
    {id:2, itemName : 'PO Approval', itemImg : require('./../../../assets/images/png/styleMange.png')},
    {id:3, itemName : 'Style Management', itemImg : require('./../../../assets/images/png/styleMange.png')},
    // {id:4, itemName : 'Stock Request', itemImg : require('./../../../assets/images/png/storeReq.png')},
    // {id:5, itemName : 'Stock Approve', itemImg : require('./../../../assets/images/png/storeApprove.png')},
    // {id:6, itemName : 'Stock Receive', itemImg : require('./../../../assets/images/png/storeReceive.png')},
    // {id:7, itemName : 'View Work Orders', itemImg : require('./../../../assets/images/png/workOrders.png')},
    {id:8, itemName : 'Cutting In', itemImg : require('./../../../assets/images/png/cutting.png')},
    // {id:9, itemName : 'Bundling', itemImg : require('./../../../assets/images/png/bundling.png')},
    {id:10, itemName : 'Stitching In', itemImg : require('./../../../assets/images/png/stichingIn.png')},
    {id:11, itemName : 'Stitching Out', itemImg : require('./../../../assets/images/png/stichingOut.png')},
    {id:12, itemName : 'Finishing In', itemImg : require('./../../../assets/images/png/finishing.png')},
    {id:13, itemName : 'Finishing Out', itemImg : require('./../../../assets/images/png/finishing.png')},
    {id:14, itemName : 'LogOut', itemImg : require('./../../../assets/images/png/logOut.png')},
    {id:14, itemName : 'Main', itemImg : require('./../../../assets/images/png/logOut.png')},
  ]);

  const backBtnAction = () => {
    navigation.navigate('LoginComponent');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userDisplayName'); 
      await AsyncStorage.removeItem('admin'); 
      await AsyncStorage.removeItem('userName'); 
      await AsyncStorage.removeItem('userPsd'); 
      // navigation.closeDrawer(); 
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginComponent' }], 
    });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };


  const actionOnRow = (item,index) => {

    if(item && item.itemName === 'Dashboard') {
      navigation.navigate('DashboardComponent');
    } else if(item && item.itemName === 'PO Approval') {
      navigation.navigate('POApproveListComponent');
    } else if(item && item.itemName === 'Style Management') {
      navigation.navigate('StyleManageComponent');
    } else if(item && item.itemName === 'Cutting In') {
      navigation.navigate('CuttingMainComponent');
    } else if(item && item.itemName === 'Finishing In') {
      navigation.navigate('FinishingStyleComponent');
    } else if(item && item.itemName === 'Finishing Out') {
      navigation.navigate('FinishingOutListComponent');
    } else if(item && item.itemName === 'Stitching Out') {
      navigation.navigate('StichingOutComponent');
    } else if(item && item.itemName === 'Stitching In') {
      navigation.navigate('StichingInComponent');
    } else if(item && item.itemName === 'Store Approve') {
      navigation.navigate('StoreApproveListComponent');
    } else if(item && item.itemName === 'Bundling') {
      navigation.navigate('BundlingComponent');
    } else if(item && item.itemName === 'Main') {
      navigation.navigate('Main');
    } else if(item && item.itemName === 'LogOut') {
      handleLogout();
    }
    
  };

  return (

    <HomeScreenUI
      itemsArray = {itemsArray}
      backBtnAction = {backBtnAction}
      actionOnRow = {actionOnRow}
    />

  );

}

export default HomeScreenComponent;