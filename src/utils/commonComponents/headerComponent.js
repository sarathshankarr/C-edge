import React, { useState, useEffect } from 'react';
import {StyleSheet,Text,TouchableOpacity, View,Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import fonts from './../commonStyles/fonts';
import color from '../commonStyles/color';

const HeaderComponent = ({navigation, route,isChatEnable,isTImerEnable,isSettingsEnable,isBackBtnEnable,title,isTitleHeaderEnable,moduleName,headerColor,...props }) => {

    const backBtnAction = () => {
        props.backBtnAction();
    };
    return (

        <View style={{flex:1,backgroundColor:color.color2, paddingVertical: 17}}>
            <View style={[styles.headerView]}>
                <View style={{flexDirection:'row', position:'absolute'}}>

                <View style={{justifyContent:'center'}}>
                    <TouchableOpacity onPress = {() => backBtnAction()} style={{flexDirection:'row',alignItems:'center', width:wp('16%')}} disabled = {isBackBtnEnable ? false : true}>
                        {isBackBtnEnable ? <Image source={require("./../../../assets/images/png/backButtonImg.png")} style={styles.backBtnEnableStyle}/> : null}
                    </TouchableOpacity>
                </View>
                {isTitleHeaderEnable ? <View style={[styles.headerSelectionView]}><Text style={[styles.titleStyle]}>{title}</Text></View> : null}

                </View>
            </View>
        </View>
        
    );
};

export default HeaderComponent;

const styles = StyleSheet.create({

    headerView : {
        justifyContent:'center',
        flex:1,
        // borderBottomWidth:1,
        // borderBottomColor : '#dedede',
    },

    headerSelectionView : {
        flex:6,
        minHeight:hp('4%'),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },

    backBtnEnableStyle : {
        marginLeft: wp("2%"),
        width:wp('6%'),
        height:wp('6%'),
        resizeMode:'contain', 
        tintColor:"#ffffff"
    },

    titleStyle : {
        // fontSize: fonts.fontMedium,
        // fontWeight: 700,
        fontWeight:'600', 
        fontSize: 17,
        textAlign:'center',
        marginRight: wp("16%"),  
        color:'#ffffff'
    },
    
});