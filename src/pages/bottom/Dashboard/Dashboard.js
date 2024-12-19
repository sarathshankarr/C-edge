// import React, { useState} from 'react';
// import {View,SafeAreaView, Text} from 'react-native';
// import { WebView } from 'react-native-webview';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
// import CommonStyles from '../../../utils/commonStyles/commonStyles';

// const DashboardComponent = ({ navigation, route, ...props }) => {

//   React.useEffect(() => {  
    
    
//   }, []);

//   const backBtnAction = () => {
//     navigation.pop();
//   };

//   return (

//     <View style={{flex:1}}>
  
//       <SafeAreaView style={{flex: 1}}>
//         {/* <WebView 
//         style={{}}
//           // source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiYTdjZTI4OTAtYzM4NC00MWYyLWI0YjQtZjliY2RlZTM1NGQ2IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9' }} 
//           source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiOTU5MTYzZTYtN2Q3OS00NWI3LWE3MzYtZWIyZmVmYWNiNzQ5IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9&&isMobileView = true' }} 
//         //   allowsInlineMediaPlayback={true}
//         // javaScriptEnabled={true}
//         // domStorageEnabled={true}
      
//         /> */}
//         {/* <Text>Home</Text> */}
//         {/* <iframe title="Mobile dashboard" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiOTU5MTYzZTYtN2Q3OS00NWI3LWE3MzYtZWIyZmVmYWNiNzQ5IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9" frameborder="0" allowFullScreen="true"></iframe> */}
//       </SafeAreaView>
        


//     </View>

//   );

// }

// export default DashboardComponent;

// // const styles = StyleSheet.create({

// //   mainComponentStyle : {
// //     flex:1,
// //     backgroundColor:'#F5F7F9',
// //     alignItems :'center'
// //   },


// // });


import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
// import CommonStyles from "./../../../utils/commonStyles/commonStyles";

const DashboardComponent = ({ route, ...props }) => {

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentWrapper}>
          <Image
            source={require('./../../../../assets/images/png/coming-soon.png')}
            style={styles.image}
            resizeMode="contain"
          />
          {/* <Image
            source={require('./../../../../assets/images/png/comingsoon.png')}
            style={styles.image}
            resizeMode="contain"
          /> */}
          {/* <Text style={styles.title}>Coming Soon</Text> */}
          <Text style={styles.subtitle}>
            This page is under development. Please check other sections or come back later.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  image: {
    width: wp('50%'),
    height: hp('25%'),
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    textAlign: 'center',
    color: '#666',
    lineHeight: wp('5.5%'),
  },
});

export default DashboardComponent;