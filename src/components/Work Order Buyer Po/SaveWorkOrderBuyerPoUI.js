import React, {useState, useEffect, useContext, useMemo} from 'react';
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
import {TextInput} from 'react-native-paper';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
import {RadioGroup} from 'react-native-radio-buttons-group';
let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const SaveWorkOrderBuyerPoUI = ({route, navigation, ...props}) => {
  const [fabricRows, setFabricRows] = useState([]);
  const [trimFabricRows, setTrimFabricRows] = useState([]);
  const [quantityRows, setQuantityRows] = useState([]);
  const [styleName, setStyleName] = useState('');
  const [buyer, setBuyer] = useState('');
  const [woNo, setWoNo] = useState('');
  const [buyerPoNo, setBuyerPoNo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [date, setDate] = useState('');
  const [quantityAllowance, setQuantityAllowance] = useState('');
  const [wash, setWash] = useState('');
  const [embroidery, setEmbroidery] = useState('');
  const [print, setPrint] = useState('');
  const [jobWork, setJobWork] = useState('');
  const [multiWo, setMultiWo] = useState('');
  const [ratio, setRatio] = useState('');

 

  const [checkboxData, setCheckboxData] = useState([]);


  const [trimFabricRadio, set_trimFabricRadio] = useState('Yes');


  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      console.log('props for child ===>  ', props.itemsObj);
      if (props.itemsObj.style) {
        setStyleName(props.itemsObj.style);
      }
      if (props.itemsObj.buyerName) {
        setBuyer(props.itemsObj.buyerName);
      }
      if (props.itemsObj.soIdStr) {
        setBuyerPoNo(props.itemsObj.soIdStr);
      }
      if (props.itemsObj.woIdWithSymbol) {
        setWoNo(props.itemsObj.woIdWithSymbol);
      }
      if (props.itemsObj.creationDate) {
        setDeliveryDate(props.itemsObj.creationDate);
      }
     
      if (props.itemsObj.sizesGSCodesList) {
        setQuantityRows(props.itemsObj.sizesGSCodesList);
      }
      // if (props.itemsObj.qtyAllowance) {
        setQuantityAllowance(props.itemsObj?.qtyAllowance?.toString() || '0.0');
      // }
      if (props.itemsObj.trimRequestSectionList) {
        setTrimFabricRows(props.itemsObj.trimRequestSectionList);
      }
     

      const newCheckboxData = [
        // Row 1
        [
          { label: 'Non Woven', isChecked: props.itemsObj.wovenStatus===1},
          { label: 'Charcoal', isChecked: props.itemsObj.charcoalStatus===1 },
          { label: 'Roll Form', isChecked: props.itemsObj.rollStatus ===1},
          { label: 'Fusable', isChecked: props.itemsObj.fusableStatus ===1},
        ],
        // Row 2
        [
          { label: 'Woven', isChecked: props.itemsObj.wovenStatus ===2},
          { label: 'White', isChecked: props.itemsObj.charcoalStatus===2 },
          { label: 'Cut Form', isChecked: props.itemsObj.rollStatus===2 },
          { label: 'Non Fusable', isChecked: props.itemsObj.fusableStatus ===2},
        ]
      ];
      setCheckboxData(newCheckboxData);

      if (props.itemsObj.washStatus) {
        setWash(props.itemsObj.washStatus === 'N' ? 'No' : 'Yes');
      }
      // if (props.itemsObj.isjobworkSelected) {
      setJobWork(props.itemsObj.isjobworkSelected === 0 ? 'No' : 'Yes');
      console.log("isJobworkSelected   ",props.itemsObj.isjobworkSelected );

      // }
      if (props.itemsObj.printStatus) {
        setPrint(props.itemsObj.printStatus === 'N' ? 'No' : 'Yes');
      }
      if (props.itemsObj.embStatus) {
        setEmbroidery(props.itemsObj.embStatus === 'N' ? 'No' : 'Yes');
      }

      setRatio(props.itemsObj.ratiocheckbox === 1 ? true : false);
      setMultiWo(props.itemsObj.multiwo === 1 ? true : false);



      if (
        props.itemsObj.approvedFabCon ||
        props.itemsObj.fabricColor ||
        props.itemsObj.fabricTotAllow ||
        props.itemsObj.fabricName ||
        props.itemsObj.fabricTotCon
      ) {
        const obj = {
          fabricName: props.itemsObj.fabricName || '',
          color: props.itemsObj.fabricColor,
          approvedFabCon: props.itemsObj.approvedFabCon,
          fabricTotCon: props.itemsObj.fabricTotCon,
          fabricTotAllow: props.itemsObj.fabricTotAllow,
        };
        setFabricRows([obj]);
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

  const toggleCheckbox = (rowIndex, colIndex) => {
    const updatedData = [...checkboxData];
    updatedData[rowIndex][colIndex].isChecked = !updatedData[rowIndex][colIndex].isChecked;
    setCheckboxData(updatedData);
  };
  

  const trimFabricRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Yes',
        value: 'Yes',
        selected: trimFabricRadio === 'Yes',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'No',
        value: 'No',
        selected: trimFabricRadio === 'No',
        labelStyle: {color: '#000'},
      },
    ],
    [trimFabricRadio],
  );

  const handletrimFabricRadioChange = selectedId => {
    const selectedOption = trimFabricRadioButtons.find(
      button => button.id === selectedId,
    );
    set_trimFabricRadio(selectedOption.value);
  };

  const totalValue = quantityRows.reduce(
    (acc, val) => acc + val.gs_code_quantity,
    0,
  );

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'View Work Order (Buyer PO)'}
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
              label="Style Name"
              value={styleName}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Buyer"
              value={buyer}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="WO NO"
              value={woNo}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label=" Buyer PO No"
              value={buyerPoNo}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View> 
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Delivery Date"
              value={deliveryDate}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="QuantityAllowance "
              value={`${quantityAllowance} %`}
              mode="outlined"
              onChangeText={text => console.log(text)}
            />
          </View>

          <Text
            style={{
              width: '100%',
              fontWeight: 'bold',
              color: '#000',
              marginVertical: 20,
            }}>
            Fabric Details
          </Text>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Color</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Consumption
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Total Consumption
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>
                      Total Consumption(With Allowance)
                    </Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Fabric Name</Text>
                  </View>
                </View>
           
                {fabricRows.map((row, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.color}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {row.approvedFabCon}
                      </Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.fabricTotCon}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {row.fabricTotAllow}
                      </Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.fabricName}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <Text
            style={{
              width: '100%',
              fontWeight: 'bold',
              color: '#000',
              marginVertical: 20,
            }}>
            Trim Fabric Details
          </Text>
          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Raw Material</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Consumption</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Remarks</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Required Qty</Text>
                  </View>
                </View>
                {trimFabricRows.map((row, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.color}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.consumption}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.remarks}</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{row.trimFabricStr}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <Text
            style={{
              width: '100%',
              fontWeight: 'bold',
              color: '#000',
              marginVertical: 20,
            }}>
            Quantity
          </Text>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={{width: 150}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                </View>
                {quantityRows.map((row, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{width: 150}}>
                      <Text style={styles.table_data}>{row.sizeCode}</Text>
                    </View>
                    <View style={{width: 200}}>
                      <Text style={styles.table_data}>
                        {row.gs_code_quantity}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={styles.table_body_single_row}>
                  <View style={{width: 150}}>
                    <Text style={styles.table_data}>Total Quantity</Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_data}>{totalValue}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          <Text
            style={{
              width: '100%',
              fontWeight: 'bold',
              color: '#000',
              marginVertical: 20,
            }}>
            Interlining
          </Text>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                {checkboxData.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.table_body_single_row}>
                    {row.map((item, colIndex) => (
                      <View key={colIndex} style={{width: 150}}>
                        <TouchableOpacity
                          style={styles.itemContainer}
                          // onPress={() => toggleCheckbox(rowIndex, colIndex)}>
                          onPress={() => console.log("rowIndex, colIndex", rowIndex, colIndex)}>
                          <CustomCheckBox
                            isChecked={item.isChecked}
                            onToggle={() => console.log("rowIndex, colIndex", rowIndex, colIndex)}
                          />
                          <Text style={{color: '#000'}}>{item.label}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
              width: '100%',
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              WASH
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={trimFabricRadioButtons}
              onPress={handletrimFabricRadioChange}
              layout="row"
              selectedId={
                trimFabricRadioButtons.find(item => item.value === wash)?.id
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
              width: '100%',
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              EMBROIDERY
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={trimFabricRadioButtons}
              onPress={handletrimFabricRadioChange}
              layout="row"
              selectedId={
                trimFabricRadioButtons.find(item => item.value === embroidery)
                  ?.id
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
              width: '100%',
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              PRINT
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={trimFabricRadioButtons}
              onPress={handletrimFabricRadioChange}
              layout="row"
              selectedId={
                trimFabricRadioButtons.find(item => item.value === print)?.id
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
              width: '100%',
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              Job Work
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={trimFabricRadioButtons}
              onPress={handletrimFabricRadioChange}
              layout="row"
              selectedId={
                trimFabricRadioButtons.find(item => item.value === jobWork)?.id
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
              width: '100%',
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              Multi WO
            </Text>
            <View
              style={{
                width: 100,
                margin: 5,
                alignItems: 'center',
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
              }}>
              <CustomCheckBox
                isChecked={multiWo}
                onToggle={() => console.log('hi')}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
              width: '100%',
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              Ratio
            </Text>
            <View
              style={{
                width: 100,
                margin: 5,
                alignItems: 'center',
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
              }}>
              <CustomCheckBox
                isChecked={ratio}
                onToggle={() => console.log('hi')}
              />
            </View>
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

export default SaveWorkOrderBuyerPoUI;

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
      marginBottom: hp('2%'),
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
      textAlign: 'center',
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
      textAlign: 'center',
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
    itemContainer: {
      // borderBottomColor: '#e0e0e0',
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 12,
      // borderBottomWidth: 1,
      // borderBottomColor: '#ccc',
    },
  });


