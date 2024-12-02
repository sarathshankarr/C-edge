import React, { useState, useEffect } from 'react';
import {View,StyleSheet,TouchableOpacity,Text,Image,FlatList,ImageBackground,SafeAreaView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import CommonStyles from "./../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView } from 'react-native-webview';

let shirt1 = require('./../../../assets/images/png/person.png');

const HomeScreenUI = ({route, ...props }) => {

  const [userName, set_userName] = useState('');

  useEffect(() => {  
    getUserName();
  }, []);

  const getUserName = async () => {
    let userName = await AsyncStorage.getItem('userDisplayName');
    console.log('UserName', userName)
    if(userName) {
      set_userName(userName);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item,index) => {
    props.actionOnRow(item,index);
  };

  const renderItem = ({ item, index }) => {

    return (

      <TouchableOpacity onPress={() => actionOnRow(item,index)} style={styles.cellBackViewStyle}>
        <Image style={[styles.hideOpenIconStyle,{flex:2}]} source={item.itemImg}></Image>
        <Text style={[styles.tylesTextStyle,{flex:1}]}>{item.itemName}</Text>
      </TouchableOpacity>
        
    );
  };

  return (

    <View style={[styles.mainComponentStyle]}>

       <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={false}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Welcome'}
          backBtnAction = {() => backBtnAction()}
        />
      </View> 
 

    <View style={styles.userDetailsStyle}>

        <View style={{marginRight:wp('1%'),flexDirection:'row',justifyContent:'space-between',width: wp('90%'),alignItems:'center'}}>
          <Text style={[styles.headerTextStyle]}>{'Hi '+ userName}</Text>
          <View style={styles.UserProfStyle}>
            <ImageBackground imageStyle = {{borderRadius:100}} resizeMode='stretch' style={[CommonStyles.imgStyle1]} source={shirt1}></ImageBackground>
          </View>
        </View>

      </View>

       <View style={styles.listStyle}>

        <FlatList
          data={props.itemsArray}
          renderItem={renderItem}
          keyExtractor={(item, index) => "" + index}
          numColumns={2}
          showsVerticalScrollIndicator = {false}
        />

      </View>  

     </View>

    // <SafeAreaView style={{ flex: 1 }}>
    //     <WebView 
    //       source={{ uri: 'https://app.powerbi.com/view?r=eyJrIjoiYTdjZTI4OTAtYzM4NC00MWYyLWI0YjQtZjliY2RlZTM1NGQ2IiwidCI6IjUyMTM1MzRhLTVkYmEtNGIxYS04YjlkLTU4Nzc4NjllMjk0YiJ9' }} 
    //     />
    //   </SafeAreaView>

    
  );
}
  
  export default HomeScreenUI;

  const styles = StyleSheet.create({

    mainComponentStyle : {
      flex:1,
      backgroundColor: "#52c0db",
      alignItems :'center'
    },

    headerTextStyle : {
      fontSize : 20,
      fontWeight : '400',
      color:'black'
    },

    tylesTextStyle : {
      fontSize : 20,
      fontWeight : '400',
      marginRight : wp('2%'),
      marginLeft : wp('2%'),
      color:'black'
      
    },

    cellBackViewStyle : {
      margin:wp('2%'),
      borderWidth:1,
      borderColor:'#EAEAEA',
      borderRadius:15,
      backgroundColor:'#E5E4E2',
      height: hp("20%"),
      width: wp("45%"),
      alignItems:'center',
      justifyContent:'center',
      alignSelf:'center',
      
    },

    flatlistStyle : {
      width: wp("100%"),
      alignContent:'center'
    },

    listStyle : {
      width:wp('100%'),
      height:hp('72%'),
      backgroundColor: "#52c0db",
    },

    hideOpenIconStyle : {
      width: wp('15%'),
      height: hp('5%'),
      resizeMode: 'contain',
      tintColor:'grey'
    },

    userDetailsStyle : {
      width: wp('90%'),
      minHeight: hp('15%'),
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: "#52c0db",
    },

    UserProfStyle : {
      width: wp('15%'),
      aspectRatio:1,
      borderRadius : 100,
      // backgroundColor:'#bed0d0',
      borderWidth:1,
      borderColor:'black',
      justifyContent:'center'
    },

  });


  /**
   

   

   */