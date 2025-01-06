import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import fonts from '../../utils/commonStyles/fonts';
import color from './color';

const CommonStyles = StyleSheet.create({

    mainComponentStyle : {
        flex:1,
        backgroundColor:'white'          
    },
    
    textInputStyle: {
        flex: 1,
        color: 'black',
        height:hp('10%'),
        fontSize : 14,
        fontWeight : '400',
    },

    textInputContainerStyle: {
        flexDirection: 'row',
        width: wp('80%'),
        height: hp('10%'),
        borderRadius: hp('0.5%'),
        borderBottomWidth: 1,
        marginTop: hp('2%'),
        borderColor: '#dedede',
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation:5,
    },

    customPopUpStyle: {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },

    hideOpenIconStyle : {
        width: wp('6%'),
        height: hp('6%'),
        resizeMode: 'contain',
        tintColor:color.color2
    },

    bottomViewComponentStyleCTR : {
        height:hp('16%'),
        // flex:1,
        width:wp('100%'),
        backgroundColor:'white',
        // position:"absolute",
        // bottom:0,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 25,
    },
    bottomViewComponentStyle : {
        height:hp('12%'),
        width:wp('100%'),
        backgroundColor:'white',
        position:"absolute",
        bottom:0,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 25,
    },

    headerView : {
        backgroundColor:'red',
        width:wp('100%'),
        height:hp('8%'),
        justifyContent:'center',
        
    },

    psdHeaderTextStyle : {
        fontSize : 18,
        fontWeight : '400',
        color : '#a7a7a7',
        opacity : 0.6
    },

    btnTextStyle : {
        fontSize : 18,
        fontWeight : '500',
        color : 'white',
    },

    forgotBtnTextStyle : {
        fontSize : 15,
        fontWeight : '300',
        color : 'white',
    },

    // mainComponentViewStyle : {
    //     flex:1,
    //     backgroundColor:'white',
    //     alignItems :'center',
    //     backgroundColor: '#f0f0f0',
    //     width:'full'
    // },
    mainComponentViewStyle: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        width: '100%',  // Make sure it takes the full width of the screen
        justifyContent: 'flex-start',  // Ensure it starts from the top if needed
      },
      
    headerStyle : {
        flex:1,
        minHeight:hp('10%'),
        width:wp('90%'),
        marginTop:hp('2%'),
        
    },

    headerStyle1 : {
        height:hp('100%'),
        width:wp('100%'),        
    },
  
    listStyle : {
        width:wp('90%'),
        height:hp('75%'),
        // backgroundColor:'#fff',
        // backgroundColor: '#f0f0f0',
        // backgroundColor: 'transparent', 
        marginTop: hp("2%"),
        marginBottom: hp("5%"),
         
    },
    listStyle1 : {
        width:wp('90%'),
        maxHeight:hp('40%'),
        backgroundColor:'white',
        marginTop: hp("2%"),
        marginBottom: hp("5%"), 
    },
    listStyle2 : {
        width:wp('90%'),
        maxHeight:hp('50%'),
        backgroundColor:'white',
        marginTop: hp("2%"),
        marginBottom: hp("5%"), 
    },
  
    cellBackViewStyle : {
        // borderBottomWidth:1,
        // borderColor:'#EAEAEA',
        backgroundColor:'#fff',
        minHeight: hp("8%"),
        // width: wp("90%"),
        alignItems:'center',
        justifyContent:'center',
        elevation:8,
        borderRadius:10,
        marginBottom:5,
        paddingHorizontal:15,
        paddingVertical:10,
        margin:1,
    },
    listCommonHeader:{
        flexDirection :'row',
        justifyContent:'space-between',
        backgroundColor:'lightgray', 
        alignItems:'center',
        borderRadius:5,
        paddingHorizontal:5, 
        paddingVertical:5
    },
    listCommonHeader1:{
        flexDirection :'row',
        justifyContent:'space-between',
        backgroundColor:'lightgray', 
        alignItems:'center',
        borderRadius:5,
        paddingHorizontal:5, 
        paddingVertical:10
    },
  
    tylesTextStyle : {
        fontSize : fonts.fontSmall,
        fontWeight : '400',
        color:'black',
        marginLeft : wp('0.2%'),
        marginRight : wp('0.2%'),
    },
  
    tylesHeaderTextStyle : {
        fontSize : fonts.fontXSmall,
        fontWeight : '700',
        color:'#000',
        marginLeft : wp('0.2%'),
        marginRight : wp('0.2%'),
        
    },

    topSubViewStyle : {
        height:hp('20%'),
        aspectRatio:1,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        borderWidth:2,
        borderColor:'#5177c0'
    },
  
    imgStyle : {
        width: wp('48%'),
        height: hp('20%'),
        alignSelf:'center'
    },

    topViewStyle : {
        height:hp('20%'),
        width:wp('90%'),
        justifyContent:'center',
        alignItems:'center'
    },

    imgStyle1 : {
        height : hp('4.5%'),
        aspectRatio:1,
        alignSelf:'center',    
    },

    searchBarStyle : {
        width:wp('90%'),
        height:hp('6%'),
        justifyContent: 'center',
        alignItems:'center',
        flexDirection:'row',
        // marginTop: hp("1%"),
        marginBottom: hp("2%"),
        alignSelf:'center',
        borderWidth:1,
        borderColor:'#A0A0A0',
        borderRadius:10,
    },
    searchBarStyle1 : {
        // width:wp('60%'),
        height:hp('6%'),
        justifyContent: 'center',
        alignItems:'flex-start',
        flexDirection:'row',
        // marginTop: hp("1%"),
        marginBottom: hp("2%"),
        alignSelf:'left',
        borderWidth:1,
        borderColor:'#A0A0A0',
        borderRadius:5,
    },

    searchTextInputStyle: {
        flex: 1,
        color: 'black',
        height:hp('5%'),
        paddingLeft:wp('2%'),
        fontSize:fonts.fontMedium,
        fontFamily: 'Barlow-Regular',
        alignSelf:'center',
        justifyContent:'center',
        alignItems: 'center', 
    },

    searchInputContainerStyle: {
        flexDirection: 'row',
        width: wp('89%'),
        height: hp('5%'),
        borderRadius: 5,
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'center',
    },
    

    searchIconStyle : {      
        aspectRatio:1,
        height:hp('4.5%'),
        marginLeft:hp('2%'), 
    },

    searchImageStyle : {
        height: hp("4%"),
        width: wp("4%"),
        resizeMode:'contain',
        marginLeft:hp('2%'), 
    },

    selImageStyle : {
        height: hp("3%"),
        width: wp("3%"),
        resizeMode:'contain',
    },
    noRecordsFoundStyle: {
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 16, 
        fontWeight:'bold',
        fontSize:20
      },

});

export default CommonStyles;