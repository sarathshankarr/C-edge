import React, { useState} from 'react';
import {View,SafeAreaView, Text} from 'react-native';
import { WebView } from 'react-native-webview';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import CommonStyles from '../../../utils/commonStyles/commonStyles';

const DashboardComponent = ({ navigation, route, ...props }) => {

  React.useEffect(() => {  
    
    
  }, []);

  const backBtnAction = () => {
    navigation.pop();
  };

  return (

    <View style={{flex:1}}>
  
      <SafeAreaView style={{flex: 1}}>
        {/* <WebView 
        style={{}}
          // source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiYTdjZTI4OTAtYzM4NC00MWYyLWI0YjQtZjliY2RlZTM1NGQ2IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9' }} 
          source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiOTU5MTYzZTYtN2Q3OS00NWI3LWE3MzYtZWIyZmVmYWNiNzQ5IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9&&isMobileView = true' }} 
        //   allowsInlineMediaPlayback={true}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
      
        /> */}
        {/* <Text>Home</Text> */}
        {/* <iframe title="Mobile dashboard" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiOTU5MTYzZTYtN2Q3OS00NWI3LWE3MzYtZWIyZmVmYWNiNzQ5IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9" frameborder="0" allowFullScreen="true"></iframe> */}
      </SafeAreaView>
        


    </View>

  );

}

export default DashboardComponent;

// const styles = StyleSheet.create({

//   mainComponentStyle : {
//     flex:1,
//     backgroundColor:'#F5F7F9',
//     alignItems :'center'
//   },


// });


