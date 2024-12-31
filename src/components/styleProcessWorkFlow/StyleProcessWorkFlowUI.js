import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import CommonStyles from '../../utils/commonStyles/commonStyles';
import * as Constant from '../../utils/constants/constant';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../utils/commonComponents/textInputComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../utils/commonComponents/bottomComponent';
import {ColorContext} from '../colorTheme/colorTheme';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const StockRequestEditUi = ({route, ...props}) => {
  const [data, setData] = useState([]);
  const [stockTable, set_stockTable] = useState([]);
  const [checkbox, set_checkbox] = useState(false);
  const [remarks, set_remarks] = useState('');
  const [flag, set_flag] = useState(true);

  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props?.itemsObj) {
      console.log('props from api==> ', props?.itemsObj);
      set_stockTable(props?.itemsObj);
    }
  }, [props?.itemsObj]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = remarks => {
    props.submitAction(remarks);
  };
  const ApproveAction = () => {
    console.log('Approved');
    props.submitAction(remarks, stockTable);
  };
  const RejectAction = remarks => {
    // props.submitAction(remarks);
    console.log('Rejected');
  };

  const handleCheckBoxToggle = () => {
    set_checkbox(!checkbox);
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
          title={'Style Process Floww'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={{marginBottom: hp('5%'), width: '100%'}}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={130}
          extraScrollHeight={130}
          showsVerticalScrollIndicator={false}>
          {stockTable?.length > 0 &&
            stockTable.map((table, tableIndex) => (
              <>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp('1%'),
                  }}>
                  <TextInputComponent
                    inputText={
                      props?.itemsObj[0] && props?.itemsObj[0][0]?.styleName
                        ? props?.itemsObj[0][0]?.styleName
                        : ''
                    }
                    labelText={'Style Name'}
                    isEditable={false}
                    maxLengthVal={200}
                    autoCapitalize={'none'}
                    isBackground={'#dedede'}
                    // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp('1%'),
                  }}>
                  <TextInputComponent
                    inputText={
                      props?.itemsObj[0] && props?.itemsObj[0][0]?.styledesc
                        ? props?.itemsObj[0][0]?.styledesc
                        : ''
                    }
                    labelText={'Style Desc'}
                    isEditable={false}
                    maxLengthVal={200}
                    autoCapitalize={'none'}
                    isBackground={'#dedede'}
                    // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp('1%'),
                  }}>
                  <TextInputComponent
                    inputText={
                      props?.itemsObj[0] && props?.itemsObj[0][0]?.shipqty
                        ? props?.itemsObj[0][0]?.shipqty
                        : ''
                    }
                    labelText={'Ship Qty'}
                    isEditable={false}
                    maxLengthVal={200}
                    autoCapitalize={'none'}
                    isBackground={'#dedede'}
                    // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp('1%'),
                  }}>
                  <TextInputComponent
                    inputText={
                      props?.itemsObj[0] && props?.itemsObj[0][0]?.username
                        ? props?.itemsObj[0][0]?.username
                        : ''
                    }
                    labelText={'User Name'}
                    isEditable={false}
                    maxLengthVal={200}
                    autoCapitalize={'none'}
                    isBackground={'#dedede'}
                    // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
                  />
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp('1%'),
                  }}>
                  <TextInputComponent
                    inputText={
                      props?.itemsObj[0] && props?.itemsObj[0][0]?.woNo
                        ? props?.itemsObj[0][0]?.woNo
                        : ''
                    }
                    labelText={'Work Order No'}
                    isEditable={false}
                    maxLengthVal={200}
                    autoCapitalize={'none'}
                    isBackground={'#dedede'}
                    // setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
                  />
                </View>
                <View key={tableIndex} style={styles.wrapper}>
                  <View style={styles.table}>
                    {/* Table Head */}
                    <View style={styles.table_head}>
                      <View style={{width: '35%'}}>
                        <Text style={styles.table_head_captions1}>
                          Process Name
                        </Text>
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '15%'}}>
                        <Text style={styles.table_head_captions1}>
                          Total Qty
                        </Text>
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '15%'}}>
                        <Text style={styles.table_head_captions}>
                          Processed Qty
                        </Text>
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '15%'}}>
                        <Text style={styles.table_head_captions}>D/M/R*</Text>
                      </View>
                      <View style={{width: '2%'}} />
                      <View style={{width: '15%'}}>
                        <Text style={styles.table_head_captions}>
                          Balance Qty
                        </Text>
                      </View>
                    </View>

                    {/* Table Body */}
                    {table.map((item, index) => (
                      <View
                        key={index}
                        style={[
                          styles.table_body_single_row,

                          item.processTotQty <= item.totQty &&
                            item.damagedqty === 0 &&
                            item.totQty !== 0 && {
                              backgroundColor: 'lightgreen',
                            },
                          item.processTotQty > item.totQty &&
                            item.damagedqty === 0 &&
                            item.totQty !== 0 && {backgroundColor: 'yellow'},
                          item.damagedqty !== 0 && {backgroundColor: 'orange'},
                        ]}>
                        <View style={{width: '35%'}}>
                          <Text style={styles.table_data}>{item.menuName}</Text>
                        </View>
                        <View style={{width: '1%'}} />
                        <View style={{width: '15%'}}>
                          <Text style={styles.table_data}>
                            {item.processTotQty}
                          </Text>
                        </View>
                        <View style={{width: '1%'}} />
                        <View style={{width: '15%'}}>
                          <Text style={styles.table_data}>{item.totQty}</Text>
                        </View>
                        <View style={{width: '1%'}} />
                        <View style={{width: '15%'}}>
                          <Text style={styles.table_data}>
                            {item.damagedqty}
                          </Text>
                        </View>
                        <View style={{width: '2%'}} />
                        <View style={{width: '15%'}}>
                          <Text style={styles.table_data}>{item.balQty}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ))}

          <View style={{marginBottom: 150}} />
        </KeyboardAwareScrollView>
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={() => popOkBtnAction()}
            popUpLeftBtnAction={() => popCancelBtnAction()}
          />
        </View>
      ) : null}

      {props.isLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default StockRequestEditUi;

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#E5E4E2',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      alignItems: 'center',
    },

    flatcontainer: {
      flex: 1,
    },

    flatview: {
      height: hp('8%'),
      marginBottom: hp('0.3%'),
      alignContent: 'center',
      justifyContent: 'center',
      borderBottomColor: 'black',
      borderBottomWidth: wp('0.1%'),
      width: wp('80%'),
      alignItems: 'center',
    },

    SectionStyle1: {
      flexDirection: 'row',
      // justifyContent: "center",
      alignItems: 'center',
      height: hp('7%'),
      width: wp('75%'),
      borderRadius: hp('0.5%'),
      // alignSelf: "center",
      // backgroundColor: "grey",
    },

    imageStyle: {
      // margin: "4%",
      height: wp('12%'),
      aspectRatio: 1,
      marginRight: wp('8%'),
      resizeMode: 'stretch',
    },

    dropTextInputStyle: {
      fontWeight: 'normal',
      fontSize: 18,
      marginLeft: wp('4%'),
      color: 'black',
      width: wp('80%'),
    },

    dropTextLightStyle: {
      fontWeight: 300,
      fontSize: 12,
      width: wp('60%'),
      alignSelf: 'flex-start',
      marginTop: hp('1%'),
      marginLeft: wp('4%'),
      color: '#000',
    },
    wrapper: {
      // justifyContent: 'center',
      // alignItems: 'center',
      flex: 1,
      marginTop: hp('2%'),
      width: '100%',
      marginBottom: 10,
      // marginHorizontal: 10
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      // padding: 7,
      width: '100%',
      backgroundColor: colors.color2,
      alignItems: 'center',
    },
    table_head_captions2: {
      fontSize: 15,
      color: 'black',
      fontWeight: 'bold',
      alignItems: 'center',
      textAlign: 'center',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
      textAlign: 'center',
    },
    table_head_captions1: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
      textAlign: 'center',
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    table_body_single_row1: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#ddd',
      // padding: 7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    table_data: {
      fontSize: 11,
      color: '#000',
      textAlign: 'center',
      alignSelf: 'center',
    },
    table: {
      margin: 15,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
    },
    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      // paddingHorizontal: 5,
      textAlign: 'center',
    },
  });
