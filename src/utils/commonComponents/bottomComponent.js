import React, { useState, useEffect, useContext } from 'react';
import {StyleSheet,Text,TouchableOpacity, View,} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import fonts from './../commonStyles/fonts';
import { ColorContext } from '../../components/colorTheme/colorTheme';

const BottomComponent = ({navigation, route,leftBtnTitle,rightBtnTitle,isLeftBtnEnable,isRightBtnEnable,rigthBtnState,...props }) => {


    const { colors } = useContext(ColorContext);
    const styles = getStyles(colors);

    const leftButtonAction = () => {
        props.leftButtonAction();
    };

    const rightButtonAction = () => {
        props.rightButtonAction();
    };

    return (

        <View style={[styles.mainComponentStyle]}>
            {isLeftBtnEnable ? <TouchableOpacity style={styles.leftButtonstyle} onPress={() => {leftButtonAction()}}>

                <Text style={[styles.leftBtnTextStyle]}>{leftBtnTitle}</Text>
            </TouchableOpacity> : null}

            {isRightBtnEnable ? <TouchableOpacity style={rigthBtnState ? [styles.rightButtonstyleEnable] : [styles.rightButtonstyleEnable,{opacity:0.4}]} disabled = {rigthBtnState ? false : true} onPress={() => {rightButtonAction()}}>
                {<Text style={[styles.rightBtnTextStyle]}>{rightBtnTitle}</Text>}
            </TouchableOpacity> : null}
            
        </View>
    );
};

export default BottomComponent;

const getStyles = (colors) => StyleSheet.create({

    mainComponentStyle : {
        width:wp('100%'),
        height:hp('100%'),
        backgroundColor:'white',
        position:"absolute",
        padding:20,
        justifyContent:'space-between',
        flexDirection:"row" 
    },

    rightButtonstyleEnable: {
        backgroundColor: colors.color2,
        flex:1,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
      },

      rightButtonstyleDisable: {
        backgroundColor: "grey",
        flex:1,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
      },
    
      leftButtonstyle : {
        // backgroundColor: "white",
        backgroundColor: "#E7E7E9",
        flex:1,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
        borderColor:'black',
        borderWidth:1.0,
        marginHorizontal:wp('2%'),
      },

      rightBtnTextStyle: {
        color: 'white',
        fontSize: fonts.fontMedium,
        fontWeight : '700',
        marginLeft: wp("1%"),
        marginRight: wp("1%"),
        textAlign:'center'
      },

      leftBtnTextStyle: {
        color: 'black',
        fontSize: fonts.fontMedium,
        fontWeight : '700',
        marginLeft: wp("1%"),
        marginRight: wp("1%"),
        textAlign:'center'
    },

});