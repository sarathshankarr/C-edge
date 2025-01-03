import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../../utils/commonComponents/textInputComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import { ColorContext } from '../../colorTheme/colorTheme';
let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const FabricEditUi = ({ route, ...props }) => {

  const { colors } = useContext(ColorContext);
  const styles = getStyles(colors);

  const [enterSizesArray, set_enterSizesArray] = useState(undefined)
  const [locationsList, set_locationsList] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationId, set_locationId] = useState(0);
  const [locationName, set_locationName] = useState('');

  const [colorId, set_colorId] = useState(0);
  const [colorName, set_colorName] = useState('');

  const [uomId, set_uomId] = useState(0);
  const [uomName, set_uomName] = useState('');

  const [fabricId, set_fabricId] = useState(0);
  const [fabricName, set_fabricName] = useState('');

  const [approvedStatus, set_approvedStatus] = useState('');

  const [dataObj, set_dataObj] = useState([]);

  const [disableButton, set_disableButton] = useState(true);


  const [showStatusArrayList, set_showStatusArrayList] = useState(false);
  const [statusArrayId, set_statusArrayId] = useState(0);
  const [statusArrayName, set_statusArrayName] = useState("");

  const [statusArray, setStatusArray] = useState([
    { id: 0, value: "Select Status" },
    { id: 1, value: "Approved" },
    { id: 2, value: "Rejected" },
  ])

  const [unitPrice, set_unitPrice] = useState('0');
  const [editLocation, set_editLocation] = useState(false);
  const [editStatus, set_editStatus] = useState(true);

  const [remarks1, set_remarks1] = useState("");
  const [remarks2, set_remarks2] = useState("");

  const [rmTable, setRmTable] = useState([]);
  const [sizesTable, setSizesTable] = useState([]);


  const imageArray = [
    { id: 0, value: props.itemsObj.img1 },
    { id: 0, value: props.itemsObj.img2 },
    { id: 0, value: props.itemsObj.img3 },
    { id: 0, value: props.itemsObj.img4 },

  ];


  useEffect(() => {
    if (props.itemsObj) {
      set_dataObj(props?.itemsObj);


      if (props?.itemsObj?.color) {
        const colorNum=Number(props?.itemsObj?.color)
        set_colorId(colorNum);
        set_colorName(props?.itemsObj?.colorsMap[colorNum])
      }

      if (props?.itemsObj?.uom) {
        set_uomId(props?.itemsObj?.uom);
        set_uomName(props?.itemsObj?.uomMap[props.itemsObj.uom]);
      }

      if (props?.itemsObj?.fabricId) {
        set_fabricId(props?.itemsObj?.fabricId);
        set_fabricName(props?.itemsObj?.loadFabricStyles[props.itemsObj.fabricId]);
        // set_fabricName(props?.itemsObj?.fabric);
      }

      if (props?.itemsObj?.locationId) {
        set_locationId(props?.itemsObj?.locationId);
        set_locationName(props?.itemsObj?.locationsMap[props.itemsObj.locationId]);
      }

      if (props?.itemsObj?.design_farma_id) {
        set_farmaId(props?.itemsObj?.design_farma_id);
        set_farmaName(props?.itemsObj?.farmaMap[props.itemsObj.design_farma_id]);
      }

      if (props?.itemsObj?.design_Dey_No) {
        set_dyeNoId(props?.itemsObj?.design_Dey_No);
        set_dyeNoName(props?.itemsObj?.dyenoMap[props.itemsObj.design_Dey_No]);
      }

      if (props?.itemsObj?.cap_category_id) {
        set_capCategoryId(props?.itemsObj?.cap_category_id);
        set_capCategoryName(props?.itemsObj?.capcategoryMap[props.itemsObj.cap_category_id]);
      }

      if (props?.itemsObj?.closure_id) {
        set_closureId(props?.itemsObj?.closure_id);
        set_closureName(props?.itemsObj?.closureMap[props.itemsObj.closure_id]);
      }

      if (props?.itemsObj?.sizegroupId) {
        set_seasonId(props?.itemsObj?.sizegroupId);
        set_seasonName(props?.itemsObj?.sizeGroupsMap[props.itemsObj.sizegroupId]);
      }

      if (props?.itemsObj?.sizeRangeId) {
        set_scaleId(props?.itemsObj?.sizeRangeId);
        set_scaleName(props?.itemsObj?.sizeRangesMap[props.itemsObj.sizeRangeId]);
      }


      if (props?.itemsObj?.note) {
        set_remarks1(props?.itemsObj?.note)
      }
      if (props?.itemsObj?.approveRemarks) {
        set_remarks2(props?.itemsObj?.approveRemarks)
      }

      if (props?.itemsObj?.rmItems) {
        setRmTable(props?.itemsObj?.rmItems)
      }
      if (props?.itemsObj?.sizesGSCodesList) {
        setSizesTable(props?.itemsObj?.sizesGSCodesList)
      }

      if (props?.itemsObj?.approveStatus) {
        set_statusArrayId(props?.itemsObj?.approveStatus);
        set_approvedStatus(props?.itemsObj?.approveStatus);
        // console.log("props?.itemsObj?.approveStatus==> ", props?.itemsObj?.approveStatus);

        if (props?.itemsObj?.approveStatus === "1") {
          set_statusArrayName(statusArray[1].value);
          set_editStatus(false);
          set_disableButton(false);
        } else if (props?.itemsObj?.approveStatus === "2") {
          set_statusArrayName(statusArray[2].value)
          set_disableButton(false);
          set_editStatus(false);
        } else {
          set_statusArrayName(statusArray[0].value)
        }
      }

    }
  }, [props.itemsObj]);
  
  const [farmaId, set_farmaId] = useState(0);
  const [farmaName, set_farmaName] = useState('');
  
  const [dyeNoId, set_dyeNoId] = useState(0);
  const [dyeNoName, set_dyeNoName] = useState('');
    
  const [capCategoryId, set_capCategoryId] = useState(0);
  const [capCategoryName, set_capCategoryName] = useState('');
  
  const [closureId, set_closureId] = useState(0);
  const [closureName, set_closureName] = useState('');
  
  const [seasonId, set_seasonId] = useState(0);
  const [seasonName, set_seasonName] = useState('');
  
  const [scaleId, set_scaleId] = useState(0);
  const [scaleName, set_scaleName] = useState('');
  

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    props.submitAction(props?.itemsObj?.designId, remarks1, statusArrayId, remarks2);
  };

  const untiPriceValue = (value, index) => {
    let tempArray = enterSizesArray;
    tempArray[index].enterQty = value;
    set_enterSizesArray(tempArray);
    // console.log('--------', tempArray)
  };

  const actionOnLocation = (locationId, locationName) => {
    set_locationName(locationName);
    set_locationId(locationId);
    set_showLocationList(false);
  }

  const actionOnStatus = (item) => {
    set_statusArrayName(item?.value);
    set_statusArrayId(item?.id);
    set_showStatusArrayList(false);
  }


  return (

    <View style={[CommonStyles.mainComponentViewStyle]}>

      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Master Fabric Edit'}
          backBtnAction={() => backBtnAction()}
        />
      </View>


      <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} extraScrollHeight={130} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: hp('5%') }}>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={dataObj ? dataObj?.designName : "N/A"}
              labelText={'Design Name *'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true}
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >
            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{ flexDirection: 'column', }}>
                    <Text style={locationId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Location  * '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{locationName ? locationName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}


          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >
            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{ flexDirection: 'column', }}>
                    <Text style={props.itemsObj?.designType ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Design Type * '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{props?.itemsObj?.designType ? props?.itemsObj?.designType : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}


          </View>


          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={colorName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Color '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{colorName ? colorName : "select"}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}


          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={uomName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'UOM *'}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{uomName ? uomName : 'N/A'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={farmaId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Farma '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{farmaId ? farmaName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

          </View>
       
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={dyeNoId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Dye No '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{dyeNoName ? dyeNoName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={capCategoryId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Cap Category '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{capCategoryName ? capCategoryName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={closureId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Closure '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{closureName ? closureName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props.itemsObj.size : ""}
              labelText={'Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.artwork : 'N/A'}
              labelText={'Artwork'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props?.itemsObj ? props?.itemsObj?.desciption : 'N/A'}
              labelText={'Description'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={fabricName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Fabric'}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{fabricName ? fabricName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}


          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={seasonId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Season '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{seasonName ? seasonName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

           </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editLocation ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showLocationList(!showLocationList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={scaleId ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Scale '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{scaleName ? scaleName : 'select'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showLocationList && editLocation ? (
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
            ) : null}

           </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.size : ''}
              labelText={'Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          
          {sizesTable?.length > 0 && sizesTable.map((item, index)=> (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} key={index} >
            <TextInputComponent
              inputText={item ?  item?.design_gs_quantity.toString() : ""}
              labelText={item?.sizeCode}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          ))
          }

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.front_logo_image : ''}
              labelText={'Front logo image + Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.back_logo_image : ''}
              labelText={'Back logo image + Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.visor_logo_image : ''}
              labelText={'Visor logo image + Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.brandWoven : ''}
              labelText={'Brand woven label'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.tag : ''}
              labelText={'Tag '}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.barcode_rfid : ''}
              labelText={'Barcode or RFID'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>



          <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, fontSize:18 }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black', marginTop: 15, borderRadius: 10, backgroundColor: 'white' }}>
              <TextInput
                placeholder=""
                autoCapitalize="none"
                multiline
                numberOfLines={3}
                value={remarks1}
                onChangeText={(text) => set_remarks1(text)}
                style={{ color: 'black' }}
              />
            </View>
          </View>

          <View style={{
            flexDirection: 'row', marginTop: hp('2%'), justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
            <Text style={{ fontWeight: 'bold', color:'#000', fontSize: 20 }}>Design Image   </Text>

            <Image source={{ uri: `data:image/png;base64,${props?.itemsObj?.designImg}` }} style={{ height: 120, width: 120 }} />
          </View>

          {/* <View style={{ width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#000' }}>Images : </Text>
            <View style={{
              flexDirection: 'row',
              marginTop: hp('2%'),
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexWrap: 'wrap',
            }}>
              {imageArray.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: `data:image/png;base64,${item.value}` }}
                  style={{ height: 120, width: 120, padding: 5 }}
                />
              ))}
            </View>

          </View> */}
          {/* <View style={{ width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#000' }}>Images : </Text>
            <View style={{
              flexDirection: 'row',
              marginTop: hp('2%'),
              justifyContent: 'space-between',
              alignItems: 'flex-start', // Align items to the start of the container
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexWrap: 'wrap', // Wrap images to the next line
            }}>
              {imageArray.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: `data:image/png;base64,${item.value}` }}
                  style={{
                    height: 120,
                    width: 120,
                    margin: 5, // Add margin around the images
                  }}
                />
              ))}
            </View>
          </View> */}

          <View style={{ width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#000', marginBottom: 10 }}>Images : </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',  // Align images to the start of the container
              alignItems: 'flex-start',      // Align items to the start of the container
              flexWrap: 'wrap',              // Wrap images to the next line
            }}>
              {imageArray.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: `data:image/png;base64,${item.value}` }}
                  style={{
                    height: 120,
                    width: '40%',
                    margin: 5, 
                  }}
                />
              ))}
            </View>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.rightside_logo_image : 'N/A'}
              labelText={'Right Side logo image + Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.leftside_logo_image : ''}
              labelText={'Left Side logo image + Size'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} // Allow multiline input
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>
          
           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.washcare : ''}
              labelText={'Wash care'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.inside_printing_tape : ''}
              labelText={'Inside printing tape '}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>

           <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%') }} >
            <TextInputComponent
              inputText={props.itemsObj ? props?.itemsObj?.j_hook : ''}
              labelText={'J Hook'}
              isEditable={false}
              maxLengthVal={200}
              multiline={true} 
              autoCapitalize={"none"}
              isBackground={'#dedede'}
              setValue={(textAnswer) => { untiPriceValue(textAnswer) }}
            />
          </View>


          {rmTable?.length > 0 && <View style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.table_head_captions}>RM Type</Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={styles.table_head_captions}>RM Name</Text>
                </View>
              </View>

              {rmTable?.map((item, index) => (
                <View key={index} style={styles.table_body_single_row}>
                  <View style={{ width: '50%' }}>
                    <Text style={styles.table_data}>{item.rmType}</Text>
                  </View>
                  <View style={{ width: '50%' }}>
                    <Text style={styles.table_data}>{item.rmname}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>}


          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), backgroundColor: editStatus ? '#ffffff' : '#dedede' }} >

            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#000", borderRadius: hp("0.5%"), width: wp("90%"), }} onPress={() => { set_showStatusArrayList(!showStatusArrayList) }}>

              <View>
                <View style={[styles.SectionStyle1, {}]}>

                  <View style={{ flexDirection: 'column', }}>
                    <Text style={statusArrayName ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Approved Status:'}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{statusArrayName ? statusArrayName : 'Select Status'}</Text>
                  </View>

                </View>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>

            </TouchableOpacity>

            {showStatusArrayList && editStatus ? (
              // <View style={styles.popSearchViewStyle}>
              //   <ScrollView nestedScrollEnabled={true}>
              //     {statusArray?.map((item) => (
              //       <TouchableOpacity key={item.id} onPress={() => actionOnStatus(item)}>
              //         <View style={styles.flatview}>
              //           <Text style={styles.dropTextInputStyle}>{item.value}</Text>
              //         </View>
              //       </TouchableOpacity>
              //     ))}
                 <View style={styles.dropdownContent1}>
                      {statusArray.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownOption}
                          onPress={() => actionOnStatus(item)}>
                          <Text style={{color: '#000'}}>{item.value}</Text>
                        </TouchableOpacity>
                      ))}
                  </View> 
              //   </ScrollView>
              // </View>
            ) : null}


          </View>

          <View style={{ width: 'auto', marginTop: 30, marginBottom: 30 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, fontSize:18 }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black', marginTop: 15, borderRadius: 10, backgroundColor: 'white', width: '100%' }}>
              {/* <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, { alignItems: 'center', marginLeft: 10, backgroundColor: 'white' }]}>{'Remarks  :'}</Text>
            <View style={{ borderWidth: 1, borderColor: 'black',  marginTop: 15, borderRadius: 10, backgroundColor: 'white' }}> */}
              <TextInput
                placeholder=""
                autoCapitalize="none"
                multiline
                numberOfLines={3}
                value={remarks2}
                editable={editStatus}
                onChangeText={(text) => set_remarks2(text)}
                style={{ color: 'black' }}
              />
            </View>
          </View>

          <View style={{ marginBottom: 100 }} />
        </View>
      </KeyboardAwareScrollView>


      <View style={CommonStyles.bottomViewComponentStyle}>

        <BottomComponent
          rightBtnTitle={'Submit'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={disableButton}
          leftButtonAction={() => backBtnAction()}
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

export default FabricEditUi;

const getStyles = (colors) => StyleSheet.create({

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
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('2%'),
    width: '90%',
    marginBottom: 10,
    // marginHorizontal:10
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    backgroundColor: colors.color2,
    alignItems: 'center'
  },
  table_head_captions: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center'

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
     color:'#000',
  },
  table: {
    margin: 15,
    // width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: '#fff',
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
    marginTop:3
  },
  dropdownOption: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

})


