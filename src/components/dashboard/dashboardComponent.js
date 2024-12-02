import React, { useState} from 'react';
import {View,SafeAreaView} from 'react-native';
import { WebView } from 'react-native-webview';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import CommonStyles from "./../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../utils/commonComponents/headerComponent';

const DashboardComponent = ({ navigation, route, ...props }) => {

  React.useEffect(() => {  
    
    
  }, []);

  const backBtnAction = () => {
    navigation.pop();
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
          title={'Dashboard'}
          backBtnAction = {() => backBtnAction()}
        />
      </View>  

      <View style={CommonStyles.headerStyle1}>

      <SafeAreaView style={{ flex: 1 }}>
        {/* <WebView 
        style={{height:'100%'}}
          source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiYTdjZTI4OTAtYzM4NC00MWYyLWI0YjQtZjliY2RlZTM1NGQ2IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9' }} 
        /> */}
      </SafeAreaView>
      </View>  


    </View>

  );

}

export default DashboardComponent;

