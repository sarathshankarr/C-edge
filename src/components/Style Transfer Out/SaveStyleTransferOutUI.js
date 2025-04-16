import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../utils/constants/constant';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const SaveStyleTransferOutUI = ({route, navigation, ...props}) => {
  const [rows, setRows] = useState([]);
  const [masterBoxName, setMasterBoxName] = useState('');
  const [buyerPONo, setBuyerPONo] = useState('');
  const [buyerName, setBuyerName] = useState('');

  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      console.log('items ===> ', props.itemsObj);
      if (props.itemsObj.masterboxname) {
        setMasterBoxName(props.itemsObj.masterboxname);
      }
      if (props.itemsObj.buyerpo) {
        setBuyerPONo(props.itemsObj.buyerpo);
      }
      if (props.itemsObj.buyername) {
        setBuyerName(props.itemsObj.buyername);
      }
      if (props.itemsObj.child) {

        const mappedChildItems = props.itemsObj.child.map((item, index) => {
          const barcodeArray = item.barcode ? item.barcode.split(",").map(b => b.trim()) : [];
          const sizeObjects = barcodeArray.map((code, idx) => ({
            SIZE_ID: idx + 1,  
            SIZE_VAL: code,
            checked:true
          }));
        
          return {
            id: Date.now(), 
            BoxName: props.itemsObj.boxid[item.masterboxId] || '',
            BoxId: item.masterboxId || '',
            showBoxList: false,
            BoxList:  [], 
            filteredBoxList: [],
            CustomerStyleName: item.style || '', 
            size: item.size || '', 
            Qty: item.qty || '', 
            childTable: sizeObjects, 
            PbuyerPoID: item.id || '' 
          };
        });
        console.log('child ===> ',mappedChildItems);

        setRows(mappedChildItems);
      }

    }
  }, [props.itemsObj]);

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    let obj = {
      umoType: uomType,
      umoDescription: uomDescription,
      fabuomvalue: fabricUom ? 1 : 0,
      workorderuom: workOrderUom,
      umoId: props?.itemsObj?.umoId,
    };
    props.submitAction(obj);
  };

  const backAction = async () => {
    props.backBtnAction();
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
          title={'Save Style Transfer Out'}
          backBtnAction={() => backAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'), width: '100%'}}>
        <View
          style={{
            marginBottom: hp('5%'),
            // width: '100%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Master Box Name"
              value={masterBoxName}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label=" Buyer PO No"
              value={buyerPONo}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Buyer Name"
              value={buyerName}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}> 
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>Box Name</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Style</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                </View>

                {rows.map(row => (
                  <View key={row.id}>
                    <View style={styles.table_body_single_row}>                  
                      <View style={{width: 200}}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: hp('1%'),
                            backgroundColor: '#ffffff',
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              borderWidth: 0.5,
                              borderColor: '#D8D8D8',
                              borderRadius: hp('0.5%'),
                              width: '100%',
                              overflow: 'hidden',
                            }}
                            onPress={() => {console.log("clicked open box list ")}}>
                            <View style={[styles.SectionStyle1]}>
                              <View style={{flexDirection: 'column'}}>
                                <Text
                                  style={
                                    row.BoxName
                                      ? styles.dropTextLightStyle
                                      : styles.dropTextInputStyle
                                  }>
                                  {'Box Name  '}
                                </Text>
                                <Text style={styles.dropTextInputStyle}>
                                  {row.BoxName ? row.BoxName : 'Select '}
                                </Text>
                              </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                              <Image
                                source={downArrowImg}
                                style={{
                                  height: 20,
                                  width: 20,
                                  tintColor: 'red',
                                  aspectRatio: 1,
                                  marginRight: 20,
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                          {false && (
                            <View style={styles.dropdownContent2}>
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search "
                                onChangeText={text =>
                                  console.log("text, row.id")
                                }
                                placeholderTextColor="#000"
                              />
                              <ScrollView nestedScrollEnabled={true}>
                                {row.filteredBoxList.length === 0 ? (
                                  <Text style={styles.noCategoriesText}>
                                    Sorry, no results found!
                                  </Text>
                                ) : (
                                  row.filteredBoxList.map(item1 => (
                                    <TouchableOpacity
                                      key={item1?.id}
                                      onPress={() =>
                                        console.log("item, row.id")
                                      }>
                                      <View style={styles.dropdownOption}>
                                        <Text style={{color: '#000'}}>
                                          {item1?.name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={{width: 5}}></View>
                      <View style={{width: 100}}>
                        <TextInput
                          style={styles.table_data_input}
                          value={row.CustomerStyleName}
                          editable={false}
                          // onChangeText={text => {
                          //   setRows(
                          //     rows.map(r =>
                          //       r.id === row.id
                          //         ? {...r, CustomerStyleName: text}
                          //         : r,
                          //     ),
                          //   );
                          // }}
                        />
                      </View>

                      <View style={{width: 5}}></View>
                      <View style={{width: 100}}>
                        <TextInput
                          style={styles.table_data_input}
                          value={row.size}
                          editable={false}
                          // onChangeText={text => {
                          //   setRows(
                          //     rows.map(r =>
                          //       r.id === row.id ? {...r, size: text} : r,
                          //     ),
                          //   );
                          // }}
                        />
                      </View>

                      <View style={{width: 5}}></View>
                      <View style={{width: 100}}>
                        <TextInput
                          style={styles.table_data_input}
                          value={row.Qty.toString()}
                          // onChangeText={text => {
                          //   setRows(
                          //     rows.map(r =>
                          //       r.id === row.id ? {...r, Qty: text} : r,
                          //     ),
                          //   );
                          // }}
                          editable={false}
                        />
                      </View>
                    </View>

                    {/* row2 */}

                    {row?.childTable?.length >= 0 && (
                      <View style={styles.table_body_single_row}>
                        <View
                          style={{
                            width: 470,
                            flexDirection: 'row',
                          }}>
                          {row?.childTable?.map((item, index) => (
                            <View
                              key={item?.SIZE_ID}
                              style={{
                                width: 100,
                                margin: 5,
                                alignItems: 'center',
                                padding: 10,
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems:'center'
                              }}>
                              <CustomCheckBox
                                isChecked={item?.checked}
                                onToggle={() => actionOnCheckBox(row.id, index)}
                              />

                              <Text style={{marginTop: 5, color: '#000'}}>
                                {item.SIZE_VAL}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={false}
          isRightBtnEnable={false}
          rightButtonAction={async () => submitAction()}
          leftButtonAction={async () => backAction()}
        />
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

export default SaveStyleTransferOutUI;

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      // borderTopRightRadius: 15,
      // borderTopLeftRadius: 15,
      alignItems: 'center',
    },
    popSearchViewStyle1: {
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
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
      fontWeight: '300',
      fontSize: 12,
      width: wp('60%'),
      alignSelf: 'flex-start',
      marginTop: hp('1%'),
      marginLeft: wp('4%'),
      color: '#000',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      // flex: 1,
      marginTop: hp('2%'),
      width: '100%',
      // paddingHorizontal: 10,
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      alignItems: 'center',
    },
    table_data: {
      fontSize: 11,
      color: '#000',
      alignItems: 'center',
    },
    table: {
      // margin: 15,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
    },
    searchInput: {
      marginTop: 10,
      borderRadius: 10,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginHorizontal: 10,
      paddingLeft: 10,
      marginBottom: 10,
      color: '#000000',
    },
    scrollView: {
      maxHeight: 150,
    },
    dropdownOption: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    dropdownContent1: {
      elevation: 5,
      // height: 220,
      maxHeight: 220,
      alignSelf: 'center',
      width: '98%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
    },
    noCategoriesText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
    },
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%', // Adjust width for better alignment
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
  });
