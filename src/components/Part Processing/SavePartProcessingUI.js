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

const SavePartProcessingUI = ({route, navigation, ...props}) => {
  const [employeeBarcode, setEmployeeBarcode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [rows, setRows] = React.useState([]);


  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      console.log('props for edit save ', props.itemsObj);
    
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

  const [processList, setProcessList] = useState([]);
  const [filteredProcess, setFilteredProcess] = useState([]);
  const [showProcessList, setShowProcessList] = useState(false);
  const [processName, setProcessName] = useState('');
  const [processId, setProcessId] = useState('');

  const actionOnProcess = item => {
    setProcessId(item.id);
    setProcessName(item.name);
    setShowProcessList(false);
  };

  const handleSearchProcess = text => {
    if (text.trim().length > 0) {
      const filtered = processList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProcess(filtered);
    } else {
      setFilteredProcess(processList);
    }
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
          title={'Edit Part Processing'}
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
              label="Employee Barcode *"
              value={employeeBarcode}
              mode="outlined"
              onChangeText={text => setEmployeeBarcode(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Barcode *"
              value={barcode}
              mode="outlined"
              onChangeText={text => setBarcode(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowProcessList(!showProcessList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        processId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Process *'}
                    </Text>
                    {processId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {processName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showProcessList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcess}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredProcess.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredProcess.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnProcess(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={{width: 120}}>
                    <Text style={styles.table_head_captions}>Style No</Text>
                  </View>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Damage Qty
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Process
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Part</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Barcode</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Employee Name</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Remarks</Text>
                  </View>
                </View>

                {/* Table Body - Rows */}
                {rows.map(row => (
                  <View key={row.id} style={styles.table_body_single_row}>
                    <View style={{width: 60}}>
                      <TouchableOpacity
                        style={{alignItems: '', justifyContent: ''}}
                        onPress={() => RemoveRow(row.id)}>
                        <Image source={closeImg} style={styles.imageStyle1} />
                      </TouchableOpacity>
                    </View>

                    <View style={{width: 120}}>
                      <Text style={styles.table_data}>{row.size}</Text>
                    </View>
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{row.size}</Text>
                    </View>

                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{row.size}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.availableQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={row.inputQty}
                        onChangeText={text => {
                          setRows(
                            rows.map(r =>
                              r.id === row.id ? {...r, remarks: text} : r,
                            ),
                          );
                        }}
                      />
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.availableQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.availableQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.availableQty}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.availableQty}</Text>
                    </View>
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
          rigthBtnState={true}
          isRightBtnEnable={
            props.itemsObj.fpt_fabricProcessed +
              props.itemsObj.fpt_fabric_rejected !==
            props.itemsObj.fpt_issued
          }
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

export default SavePartProcessingUI;

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
      fontWeight: 300,
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
  });
