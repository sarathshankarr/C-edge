import React, { useState, useEffect } from 'react';
import {StyleSheet,View, ActivityIndicator,Text} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from "react-native-responsive-screen";
import CommonStyles from '../commonStyles/commonStyles';
import Fonts from '../../utils/commonStyles/fonts';

const LoaderComponent = ({navigation, route,loaderText,isButtonEnable,heightLoader,isLoader,showLoderBox,loaderText2,...props }) => {

    const [heightL, set_heightL] = useState('100%');
    const [showLoaderBox1, set_showLoaderBox1] = useState('show');
    const [lMsg, set_lMsg] = useState('');

    useEffect (() => {
        if(heightLoader){
            set_heightL(heightLoader);
        }

        if(showLoderBox){
            set_showLoaderBox1(showLoderBox);
        }

        if(loaderText2){
            set_lMsg(loaderText2);
        }else {
            set_lMsg('');
        }
        
    },[heightLoader,showLoderBox,loaderText2]);

    return (

        <View style={[styles.mainActivity,{height:hp(heightL)}]}>

            <View style = {styles.loaderBckViewStyle}>
                <View style={{marginTop:hp('2%')}}>                        
                    <ActivityIndicator  size="large" color="gray"></ActivityIndicator>
                </View>
                <Text style={[styles.textStyle]}>{lMsg}<Text style={styles.textStyle}>{loaderText}</Text></Text>
            </View>       
            
        </View>
        
    );
};

export default LoaderComponent;

const styles = StyleSheet.create({

    mainActivity : {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
        width:wp('100%'),
        height:hp('100%'),
    },

    textStyle : {
        ...CommonStyles.textStyleLight,
        fontSize: Fonts.fontNormal,
        color:'black',
        marginLeft : wp('2%'),
        marginRight: wp('2%'),
        marginTop : hp('2%'),
        marginBottom : hp('2%'),
        textAlign:'center'
    },

    loaderBckViewStyle : {
        width : wp('70%'),
        minHeight : hp('20%'),
        justifyContent: "center",
        alignItems: "center",
        borderWidth:0.1,
        backgroundColor : '#ffffff',
        borderRadius : 5,
    },

    dogStyle: {
        width: wp('25'),
        height: hp('12%'),
        alignSelf: 'center',
        resizeMode:'contain'
    },

});