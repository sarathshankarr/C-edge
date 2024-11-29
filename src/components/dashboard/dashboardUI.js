import React, { useState, useEffect } from 'react';
import {View,TouchableOpacity,Text,SafeAreaView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import CommonStyles from "./../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import { WebView } from 'react-native-webview';

const DashboardUI = ({route, ...props }) => {
  
  useEffect(() => {

  }, []);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  return (

    <View style={{ flex: 1 }}>

      {/* <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Dashboard'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>   */}

      

      <SafeAreaView style={{ flex: 1 }}>
        {/* <WebView 
        style={{width :'100%', height:100}}
          source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiYTdjZTI4OTAtYzM4NC00MWYyLWI0YjQtZjliY2RlZTM1NGQ2IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9' }} 
        /> */}
      </SafeAreaView>
     


    </View>
  );
}
  
export default DashboardUI;