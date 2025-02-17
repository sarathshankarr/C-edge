import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TextInputComponent from '../../../utils/commonComponents/textInputComponent';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

import * as Constant from './../../../utils/constants/constant';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';

const SaveStichingInUI = ({route, ...props}) => {
  const [enterSizesArray, set_enterSizesArray] = useState(undefined);
  const [locationsList, set_locationsList] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationId, set_locationId] = useState(0);
  const [locationName, set_locationName] = useState('');
  const [unitPrice, set_unitPrice] = useState('0');
  const [editLocation, set_editLocation] = useState(true);

  useEffect(() => {
    if (props?.itemObj) {
      // console.log("item OBJ from Props  ===> ", props.itemObj)

      set_enterSizesArray(props.itemObj.sizeDetails);
      set_locationsList(props?.itemObj?.locationMap);
      if (props?.itemObj?.companyLocation) {
        set_locationId(props?.itemObj?.companyLocation || 0);
        set_editLocation(false);
        set_locationName(
          props?.itemObj?.locationMap[props?.itemObj?.companyLocation],
        );
        // console.log('item OBJ from Props  ===> ', props?.itemObj?.locationMap);
      } else {
        set_locationsList(props?.itemObj?.locationMap);
      }
      set_unitPrice(props?.itemObj?.unitprice || '0');
    }
  }, [props.itemObj]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = () => {
    props.submitAction(enterSizesArray, locationId, unitPrice);
  };

  const untiPriceValue = (value, index) => {
    let tempArray = enterSizesArray;
    tempArray[index].enterQty = value;
    set_enterSizesArray(tempArray);
    console.log('updated enteredarray', tempArray);
  };

  const actionOnLocation = (locationId, locationName) => {
    set_locationName(locationName);
    set_locationId(locationId);
    set_showLocationList(false);
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
          title={'Save Stiching In'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={{marginBottom: hp('5%')}}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={130}
          extraScrollHeight={130}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={props.itemObj ? props.itemObj.styleName : undefined}
              labelText={'Style Name'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              setValue={textAnswer => {
                untiPriceValue(textAnswer);
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={props.itemObj ? props.itemObj.color : undefined}
              labelText={'Color'}
              isEditable={false}
              maxLengthVal={2000}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              setValue={textAnswer => {
                untiPriceValue(textAnswer);
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('1%'),
            }}>
            <TextInputComponent
              inputText={unitPrice}
              labelText={'Unit Price'}
              isEditable={true}
              maxLengthVal={2000}
              autoCapitalize={'none'}
              isBackground={'#dedede'}
              setValue={textAnswer => {
                set_unitPrice(textAnswer);
              }}
            />
          </View>

          <View
            style={{
              marginTop: hp('1%'),
              backgroundColor: editLocation ? '#ffffff' : '#dedede',
              width: '90%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                set_showLocationList(!showLocationList);
              }}>
                <View style={[styles.SectionStyle1]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        locationName
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Select Location '}
                    </Text>
                    {locationName ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {locationName}
                      </Text>
                    ) : null}
                  </View>
                </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showLocationList && editLocation ? (
              <View style={styles.popSearchViewStyle}>
                <ScrollView nestedScrollEnabled={true}>
                  {Object.keys(locationsList).map(locationId => (
                    <TouchableOpacity
                      key={locationId}
                      onPress={() =>
                        actionOnLocation(locationId, locationsList[locationId])
                      }>
                      <View style={styles.flatview}>
                        <Text style={styles.dropTextInputStyle}>
                          {locationsList[locationId]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <View style={CommonStyles.listStyle}>
            {enterSizesArray &&
              enterSizesArray.map((item, index) => (
                <View key={index} style={{marginTop: hp('1%')}}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TextInputComponent
                      labelText={item.size}
                      isEditable={true}
                      maxLengthVal={200}
                      autoCapitalize={'none'}
                      keyboardType={'numeric'}
                      setValue={textAnswer => {
                        untiPriceValue(textAnswer, index);
                      }}
                    />
                  </View>
                </View>
              ))}
          </View>
          <View style={{height: 180}} />
        </KeyboardAwareScrollView>
      </View>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Submit'}
          isLeftBtnEnable={false}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => submitAction()}
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

export default SaveStichingInUI;

const styles = StyleSheet.create({
  popSearchViewStyle: {
    height: hp('40%'),
    width: '100%',
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
    width: '80%',
    alignItems: 'center',
  },

  SectionStyle1: {
    flexDirection: 'row',
    // justifyContent: "center",
    alignItems: 'center',
    height: hp('7%'),
    width: '80%',
    borderRadius: hp('0.5%'),
    // alignSelf: "center",
    // backgroundColor: "grey",
  },

  imageStyle: {
    // margin: "4%",
    height: wp('12%'),
    aspectRatio: 1,
    marginRight: wp('8%'),
    resizeMode: 'contain',
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
});
