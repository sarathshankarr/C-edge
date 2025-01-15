import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as APIServiceCall from '../../../utils/apiCalls/apiCallsComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const CreateScaleOrSizeMasterUI = ({route, navigation, ...props}) => {
  // Size Group
  const [sizeGroupList, setSizeGroupList] = useState([]);
  const [filteredSizeGroup, setFilteredSizeGroup] = useState([]);
  const [showSizeGroupList, setShowSizeGroupList] = useState(false);
  const [sizeGroupName, setSizeGroupName] = useState('');
  const [sizeGroupId, setSizeGroupId] = useState('');
  const [showSizeGroup, setShowSizeGroup] = useState(false);

  const actionOnSizeGroup = item => {
    setSizeGroupId(item.id);
    setSizeGroupName(item.name);
    setShowSizeGroupList(false);
  };

  const handleSearchSizeGroup = text => {
    if (text.trim().length > 0) {
      const filtered = sizeGroupList.filter(group =>
        group.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredSizeGroup(filtered);
    } else {
      setFilteredSizeGroup(sizeGroupList);
    }
  };

  const sizesList = [
    'S1',
    'S2',
    'S3',
    'S4',
    'total',
    'S5',
    'XS',
    'SSOC',
    'MSOC',
    'LSOC',
    'XL',
    '2XL',
    '3XL',
    '4XL',
    '5XL',
    'S',
    'M',
    'L',
  ];

  const [checkedSizes, setCheckedSizes] = useState(
    sizesList.map(() => false), // Initially all checkboxes are unchecked
  );

  const handleCheckBoxToggle = index => {
    const updatedCheckedSizes = [...checkedSizes];
    updatedCheckedSizes[index] = !updatedCheckedSizes[index]; // Toggle the checkbox
    setCheckedSizes(updatedCheckedSizes);

    console.log(`Toggled: ${sizesList[index]}`); // Log the size name
  };

  useEffect(() => {
    if (props?.itemsArray) {
    }
  }, [props.itemsArray]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    console.log({
      date: date,
      shiftId: shiftId,
      inTime: inTime,
      batchNoId: batchNoId,
      batch: batch,
      MachineNoId: MachineNoId,
      attendedById: attendedById,
      processId: processId,
      OrderNoId: OrderNoId,
      designNoId: designNoId,
      matchingNoId: matchingNoId,
    });

    if (
      !processId ||
      !date ||
      !Number(shiftId) ||
      !inTime ||
      !batchNoId ||
      !batch ||
      (!MachineNoId && !(showAddmcNO && addmachno)) ||
      !attendedById
    ) {
      Alert.alert('Please fill all mandatory fields !');
      return;
    }

    if (Number(processId) >= 591) {
      // if (!OrderNoId || !designNoId || (Number(processId) !== 591 || !matchingNoId)) {
      //   Alert.alert("Please fill all mandatory fields !");
      //   return;
      // }
      if (
        !OrderNoId ||
        !designNoId ||
        (Number(processId) !== 591 && !matchingNoId)
      ) {
        Alert.alert('Please fill all mandatory fields!');
        return;
      }
    }

    if (Number(processId) === 591) {
      if (selectedIndex === null) {
        Alert.alert('Please Select Atleast one Matching ');
        return;
      }
    }
    if (Number(fabricIssued) > Number(fabricIssuedLimit)) {
      Alert.alert('Qty Should Not Be More than ', fabricIssuedLimit);
      return;
    }

    const s = batchNoId.split('_');
    const a = s[0];
    const b = s[1];

    let obj1;

    // console.log("saving obj ", Obj)
    // return;
    props.submitAction(Obj);
    // Alert.alert("Save Button Clicked");
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
          title={'Create Scale or Size Master'}
          backBtnAction={() => backBtnAction()}
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
                setShowSizeGroupList(!showSizeGroupList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        sizeGroupId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Size Group *  '}
                    </Text>
                    {sizeGroupId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {sizeGroupName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showSizeGroupList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchSizeGroup}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredSizeGroup.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredSizeGroup.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnSizeGroup(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>
          <Text
            style={
              [styles.dropTextInputStyle, {marginTop: hp('2%'),}]
            }>
            {'Size  *  '}
          </Text>
          <View style={styles.checkboxContainer}>
            {sizesList.map((size, index) => (
              <View key={index} style={styles.checkboxItem}>
                <CustomCheckBox
                  isChecked={checkedSizes[index]}
                  onToggle={() => handleCheckBoxToggle(index)}
                />
                <Text style={styles.checkboxLabel}>{size}</Text>
              </View>
            ))}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
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

export default CreateScaleOrSizeMasterUI;

const styles = StyleSheet.create({
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
    flex: 1,
    marginTop: hp('2%'),
    width: '100%',
  },
  table: {
    width: '95%', // Reduces extra space on the sides
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#5177c0',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  table_head_captions: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  table_body_single_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 7,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  table_data: {
    fontSize: 13,
    color: '#333',
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
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Ensure items wrap to the next row
    justifyContent: 'flex-start',
    padding: 10,
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
