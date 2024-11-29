import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "./../../../../utils/constants/constant";
import CommonStyles from "./../../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../../utils/commonComponents/alertComponent';
import TextInputComponent from './../../../../utils/commonComponents/textInputComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomComponent from './../../../../utils/commonComponents/bottomComponent';
let downArrowImg = require('./../../../../../assets/images/png/dropDownImg.png');


const SaveFinishingInUI = ({ route, ...props }) => {

  const [enterSizesArray, set_enterSizesArray] = useState(undefined)
  const [locationsList, set_locationsList] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationId, set_locationId] = useState(0);
  const [locationName, set_locationName] = useState('');
  const [unitPrice, set_unitPrice] = useState('0');
  const [editLocation, set_editLocation]=useState(true);
  const [filteredLocations, set_filteredLocations] = useState([]);



  useEffect(() => {

    if (props.itemsObj) {
      set_enterSizesArray(props.itemsObj.sizeDetails);
      set_locationsList(props?.itemsObj?.locationMap);
      set_locationName(props?.itemsObj?.location);
      set_unitPrice(props?.itemsObj?.unitprice || '0');
      if(props?.itemsObj?.companyLocation){
        set_locationId(props?.itemsObj?.companyLocation || 0);
        set_editLocation(false);
        set_locationName(props?.itemsObj?.locationMap[props?.itemsObj?.companyLocation])
      }else{
        set_locationsList(props?.itemsObj?.locationMap);
        set_filteredLocations(Object.keys(props?.itemsObj?.locationMap || {}));
      }   
     }

  }, [props.itemsObj]);

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
    console.log("updated enteredarray", tempArray);
  };

  const actionOnLocation = (locationId, locationName) => {
    set_locationName(locationName);
    set_locationId(locationId);
    set_showLocationList(false);
  }

  const handleSearchLocations = (text) => {
    // set_searchText(text);
    if (text.trim().length > 0) {
      const filtered = Object.keys(locationsList).filter(locationId =>
        locationsList[locationId].toLowerCase().includes(text.toLowerCase())
      );
      set_filteredLocations(filtered);
    } else {
      set_filteredLocations(Object.keys(locationsList));
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
          title={'Save Finishing Details'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={{ marginTop: hp('3%') }}>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'left' }]}>{'Style - '}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'left' }]}>{props.itemsObj ? props.itemsObj.styleName : null}</Text>
        </View>

      </View>

      {/* <View style = {{marginTop:hp('3%'),width:wp('90%'),marginBottom:hp('2%')}}>

        <View style = {{flexDirection:'row'}}>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'left'}]}>{'Main Fabric - '}</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle,{textAlign:'left'}]}>{props.itemsObj ? props.itemsObj.fabricType : null}</Text>
        </View>
        
      </View> */}

      <View style={{ marginBottom: hp('5%') }}>

        <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} extraScrollHeight={130} showsVerticalScrollIndicator={false}>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >

            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.styleName : undefined}
              labelText={'Style Name'}
              isEditable={false}
              maxLengthVal={200}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >

            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.color : undefined}
              labelText={'Color'}
              isEditable={false}
              maxLengthVal={2000}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />

          </View>


          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >

            <TextInputComponent
              inputText={unitPrice}
              labelText={'Unit Price'}
              isEditable={true}
              maxLengthVal={2000}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { set_unitPrice(textAnswer) }}
            />

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'),backgroundColor:editLocation ? '#ffffff':'#dedede' }} >


            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={locationName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Select Location '}</Text>
                    {locationName ? <Text style={[styles.dropTextInputStyle]}>{locationName}</Text> : null}
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {/* {showLocationList && editLocation? (
              <View style={styles.popSearchViewStyle}>
                <ScrollView nestedScrollEnabled={true}>
                  {Object.keys(locationsList).map((locationId) => (
                    <TouchableOpacity key={locationId} onPress={() => actionOnLocation(locationId, locationsList[locationId])}>
                      <View style={styles.flatview}>
                        <Text style={styles.dropTextInputStyle}>{locationsList[locationId]}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null} */}
            {showLocationList && editLocation && (
                <View style={styles.dropdownContent}>
                  {/* Search bar */}
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    onChangeText={handleSearchLocations}
                    placeholderTextColor="#000"
                  />

                  {/* Dropdown list */}
                  <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
                    {/* Check if filtered results are empty */}
                    {filteredLocations.length === 0 ? (
                      <Text style={styles.noCategoriesText}>Sorry, no results found!</Text>
                    ) : (
                      filteredLocations.map((locationId) => (
                        <TouchableOpacity key={locationId} onPress={() => actionOnLocation(locationId, locationsList[locationId])}>
                          <View style={styles.dropdownOption}>
                            <Text style={styles.dropTextInputStyle}>{locationsList[locationId]}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}


          </View>

          <View style={CommonStyles.listStyle}>
            {enterSizesArray && enterSizesArray.map((item, index) => (
              <View key={index} style={{ marginTop: hp('1%') }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TextInputComponent
                    labelText={item.size}
                    isEditable={true}
                    maxLengthVal={200}
                    autoCapitalize={"none"}
                    keyboardType={'numeric'}
                    setValue={(textAnswer) => { untiPriceValue(textAnswer, index) }} // Assuming untiPriceValue is defined elsewhere
                  />
                </View>
              </View>
            ))}
          </View>

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

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
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
      </View> : null}

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}

    </View>
  );
}

export default SaveFinishingInUI;

const styles = StyleSheet.create({

  popSearchViewStyle: {
    height: hp("40%"),
    width: wp("90%"),
    backgroundColor: '#E5E4E2',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: "center",
  },

  flatcontainer: {
    flex: 1,
  },

  flatview: {
    height: hp("8%"),
    marginBottom: hp("0.3%"),
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "black",
    borderBottomWidth: wp("0.1%"),
    width: wp('80%'),
    alignItems: "center",
  },

  SectionStyle1: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    height: hp("7%"),
    width: wp("75%"),
    borderRadius: hp("0.5%"),
    // alignSelf: "center",
    // backgroundColor: "grey",
  },

  imageStyle: {
    // margin: "4%",
    height: wp("12%"),
    aspectRatio: 1,
    marginRight: wp('8%'),
    resizeMode: 'stretch',
  },

  dropTextInputStyle: {
    fontWeight: "normal",
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: 300,
    fontSize: 12,
    width: wp("60%"),
    alignSelf: 'flex-start',
    marginTop: hp("1%"),
    marginLeft: wp('4%'),
    color:'#000'

  },
  dropdownContent: {
    elevation: 5,
    height: 220,
    alignSelf: 'center',
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
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
    // paddingHorizontal: wp("2%"),
    maxHeight: 150,
  },

  dropdownOption: {
    padding: hp("1.5%"),
    borderBottomWidth: 0.5,
    borderColor: '#D8D8D8',
  },
  noCategoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },

})