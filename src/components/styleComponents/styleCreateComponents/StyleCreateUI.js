import React, {useState, useRef, useEffect, useMemo, useContext} from 'react';
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
import {RadioGroup} from 'react-native-radio-buttons-group';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';
import color from '../../../utils/commonStyles/color';
import {ColorContext} from '../../colorTheme/colorTheme';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const StyleCreateUI = ({route, navigation, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props?.itemsArray) {
      if (props?.itemsArray.colorsMap) {
        setFilteredColor(props?.itemsArray.colorsMap);
        setColorList(props?.itemsArray.colorsMap);
      }
      if (props?.itemsArray.locationsMap) {
        setFilteredLocation(props?.itemsArray.locationsMap);
        setLocationList(props?.itemsArray.locationsMap);
      }
      if (props?.itemsArray.loadFabricStyles) {
        setFilteredFabric(props?.itemsArray.loadFabricStyles);
        setFabricList(props?.itemsArray.loadFabricStyles);
      }
      if (props?.itemsArray.sizeGroupsMap) {
        setFilteredSeason(props?.itemsArray.sizeGroupsMap);
        setSeasonList(props?.itemsArray.sizeGroupsMap);
      }
      if (props?.itemsArray.brandsMap) {
        setFilteredBrand(props?.itemsArray.brandsMap);
        setBrandList(props?.itemsArray.brandsMap);
      }
      if (props?.itemsArray.confMap) {
        setFilteredProcessWorkFlow(props?.itemsArray.confMap);
        setProcessWorkFlowList(props?.itemsArray.confMap);
      }
    }
    // console.log('props =====>  ', props?.itemsArray);
  }, [props.itemsArray]);

  useEffect(() => {
    if (props.sizeRangesMap) {
      setFilteredScaleOrSize(props.sizeRangesMap);
      setScaleOrSizeList(props.sizeRangesMap);
    }
  }, [props.sizeRangesMap]);

  useEffect(() => {
    if (props.sizeMap) {
      console.log('scale map ==> ', props.sizeMap);
      const updatedScaleMap = props.sizeMap.map(item => ({
        ...item,
        enteredQty: '0',
      }));

      set_scaleTable(updatedScaleMap);
    }
  }, [props.sizeMap]);

  useEffect(() => {
    if (props.colorObj) {
      console.log('color Obj', props.colorObj);

      if (props?.colorObj?.color) {
        setSelectedIndices([props.colorObj.color]);
        setEditColor(false);
      }
    }
  }, [props.colorObj]);

  const [name, setName] = useState('');
  const [scaleTable, set_scaleTable] = useState([]);
  const [showScaleTable, set_showScaleTable] = useState(false);
  const [styleNo, setStyleNo] = useState('');
  const [styleDescription, setStyleDescription] = useState('');
  const [customerStyleNo, setCustomerStyleNo] = useState('');
  const [buyerPOQty, setBuyerPOQty] = useState('');
  const [hsn, setHSN] = useState('');
  const [stylePriceFOB, setStylePriceFOB] = useState('0');
  const [mrpTagPrice, setMRPTagPrice] = useState('');
  const [approvedConsumption, setApprovedConsumption] = useState('');
  const [totalEnteredQty, setTotalEnteredQty] = useState('0');

  // Location
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, setFilteredLocation] = useState([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationId, setLocationId] = useState('');

  const actionOnLocation = item => {
    setLocationId(item.id);
    setLocationName(item.name);
    setShowLocationList(false);
  };

  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = locationList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredLocation(filtered);
    } else {
      setFilteredLocation(locationList);
    }
  };

  // Fabric
  const [fabricList, setFabricList] = useState([]);
  const [filteredFabric, setFilteredFabric] = useState([]);
  const [showFabricList, setShowFabricList] = useState(false);
  const [fabricName, setFabricName] = useState('');
  const [fabricId, setFabricId] = useState('');

  const actionOnFabric = item => {
    setFabricId(item.id);
    setFabricName(item.name);
    setShowFabricList(false);
    props.getColorBasedOnFabric(item.name);
  };

  const handleSearchFabric = text => {
    if (text.trim().length > 0) {
      const filtered = fabricList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredFabric(filtered);
    } else {
      setFilteredFabric(fabricList);
    }
  };

  // Color
  const [colorList, setColorList] = useState([]);
  const [filteredColor, setFilteredColor] = useState([]);
  const [showColorList, setShowColorList] = useState(false);
  const [editColor, setEditColor] = useState(true);
  const [colorName, setColorName] = useState([]);
  const [colorId, setColorId] = useState('0');
  const [selectedIndices, setSelectedIndices] = useState([]);

  const actionOnColor = id => {
    setSelectedIndices(prevSelected => {
      const exists = prevSelected.some(i => i === id);

      if (exists) {
        return prevSelected.filter(i => i !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSearchColor = text => {
    if (text.trim().length > 0) {
      const filtered = colorList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredColor(filtered);
    } else {
      setFilteredColor(colorList);
    }
  };

  // Season
  const [seasonList, setSeasonList] = useState([]);
  const [filteredSeason, setFilteredSeason] = useState([]);
  const [showSeasonList, setShowSeasonList] = useState(false);
  const [seasonName, setSeasonName] = useState('');
  const [seasonId, setSeasonId] = useState('');

  const actionOnSeason = item => {
    setSeasonId(item.id);
    setSeasonName(item.name);
    setShowSeasonList(false);
    setScaleOrSizeId('');
    setScaleOrSizeName('');
    set_scaleTable([]);
    props.getloadScalesOnSizeGroup(item.id);
  };

  const handleSearchSeason = text => {
    if (text.trim().length > 0) {
      const filtered = seasonList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredSeason(filtered);
    } else {
      setFilteredSeason(seasonList);
    }
  };

  // ScaleOrSize
  const [scaleOrSizeList, setScaleOrSizeList] = useState([]);
  const [filteredScaleOrSize, setFilteredScaleOrSize] = useState([]);
  const [showScaleOrSizeList, setShowScaleOrSizeList] = useState(false);
  const [scaleOrSizeName, setScaleOrSizeName] = useState('');
  const [scaleOrSizeId, setScaleOrSizeId] = useState('');

  const actionOnScaleOrSize = item => {
    setScaleOrSizeId(item.id);
    setScaleOrSizeName(item.name);
    setShowScaleOrSizeList(false);
    props.getSizesBasedOnScale(seasonId, item.id);
    set_showScaleTable(item.id ? true : false);
  };

  const handleSearchScaleOrSize = text => {
    if (text.trim().length > 0) {
      const filtered = scaleOrSizeList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredScaleOrSize(filtered);
    } else {
      setFilteredScaleOrSize(scaleOrSizeList);
    }
  };

  // Process Work Flow
  const [processWorkFlowList, setProcessWorkFlowList] = useState([]);
  const [filteredProcessWorkFlow, setFilteredProcessWorkFlow] = useState([]);
  const [showProcessWorkFlowList, setShowProcessWorkFlowList] = useState(false);
  const [processWorkFlowName, setProcessWorkFlowName] = useState('');
  const [processWorkFlowId, setProcessWorkFlowId] = useState('');

  const actionOnProcessWorkFlow = item => {
    setProcessWorkFlowId(item.id);
    setProcessWorkFlowName(item.name);
    setShowProcessWorkFlowList(false);
  };

  const handleSearchProcessWorkFlow = text => {
    if (text.trim().length > 0) {
      const filtered = processWorkFlowList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProcessWorkFlow(filtered);
    } else {
      setFilteredProcessWorkFlow(processWorkFlowList);
    }
  };

  // Brand
  const [brandList, setBrandList] = useState([]);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [showBrandList, setShowBrandList] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandId, setBrandId] = useState('');

  const actionOnBrand = item => {
    setBrandId(item.id);
    setBrandName(item.name);
    setShowBrandList(false);
  };

  const handleSearchBrand = text => {
    if (text.trim().length > 0) {
      const filtered = brandList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredBrand(filtered);
    } else {
      setFilteredBrand(brandList);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    if (
      !styleNo ||
      !customerStyleNo ||
      !locationId ||
      selectedIndices.length > 0 ||
      !seasonId ||
      buyerPOQty ||
      !scaleOrSizeId ||
      !hsn ||
      !processWorkFlowId
    ) {
      Alert.alert('Please fill all mandatory fields !');
      return;
    }
    if (totalEnteredQty != buyerPOQty) {
      Alert.alert('Entered Qty in the Sizes should be equal to Buyer Po Qty');
      return;
    }

    if (!brandId) {
      Alert.alert(
        'Confirm',
        'Do you want to Continue without Brand?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => proceedWithSubmission(),
          },
        ],
        {cancelable: false},
      );
      return;
    }

    proceedWithSubmission();
  };

  const proceedWithSubmission = () => {
    const consumptionObj = {};
    const invLimitObj = {};
    const emptyObj1 = {};
    const emptyObj2 = {};
    const emptyObj3 = {};
    const enteredQtyObj = {};

    scaleTable.forEach(item => {
      consumptionObj[item.id] = item.consumption;
      invLimitObj[item.id] = item.invLimit;
      emptyObj1[item.id] = '';
      emptyObj2[item.id] = '';
      emptyObj3[item.id] = '0';
      enteredQtyObj[item.id] = item.enteredQty;
    });

    console.log('empty obj ', enteredQtyObj);
    console.log('emptyObj1 ', emptyObj1);
    console.log('emptyObj2 ', emptyObj2);

    const colorStr = selectedIndices.join(',') + ',';
    const colorStr1 = selectedIndices.join(',');

    const tempObj = {
      styleNo: styleNo,
      styleDesc: styleDescription,
      customerStyle: customerStyleNo,
      locationId: locationId,
      fabricId: fabricId ? fabricId : '0',
      colorIDStr: colorStr,
      fabric: fabricName,
      multi_loc: locationId,
      colorId: selectedIndices.length === 1 ? colorStr1 : '0',
      brandId: brandId ? brandId : '0',
      poQty: buyerPOQty,
      sizeGroupId: seasonId,
      sizeRangeId: scaleOrSizeId,
      hsn: hsn,
      configurationId: processWorkFlowId,
      price: stylePriceFOB,
      rate: stylePriceFOB,
      mrp: mrpTagPrice ? mrpTagPrice : '0',
      newBrand: '',
      gst: '0',
      appConsumption: approvedConsumption,
      gsCodesMap: emptyObj2,
      gsCodesPriceMap: enteredQtyObj,
      articleNumberMap: emptyObj1,
      gscodesizeprice: emptyObj1,
      sizeWiseEAN: emptyObj1,
      sizeCons: consumptionObj,
      weightMap: emptyObj3,
      sizeWiseInvLimit: invLimitObj,
    };
    props.submitAction(tempObj);
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
          title={'Create Style'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%')}}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: 10,
            marginTop: hp('2%'),
          }}>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Style No *"
              value={styleNo}
              mode="outlined"
              onChangeText={text => {
                setStyleNo(text);
                setCustomerStyleNo(text);
              }}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Style Description"
              value={styleDescription}
              mode="outlined"
              multiline
              onChangeText={text => setStyleDescription(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Customer Style No *"
              value={customerStyleNo}
              mode="outlined"
              onChangeText={text => setCustomerStyleNo(text)}
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
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowLocationList(!showLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        locationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Location *'}
                    </Text>
                    {locationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {locationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnLocation(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
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
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowFabricList(!showFabricList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        fabricId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Fabric '}
                    </Text>
                    {fabricId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {fabricName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showFabricList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchFabric}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredFabric.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredFabric.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnFabric(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: editColor ? '#fff' : '#D8D8D8',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowColorList(!showColorList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        selectedIndices.length > 0
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Color *'}
                    </Text>
                    {selectedIndices.length > 0 ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {colorList
                          .filter(color => selectedIndices.includes(color.id))
                          .map(color => color.name)
                          .join(', ')}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showColorList && editColor && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchColor}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredColor.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredColor.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.itemContainer}
                        onPress={() => actionOnColor(item.id)}>
                        <CustomCheckBox
                          isChecked={selectedIndices.includes(item.id)}
                          onToggle={() => actionOnColor(item.id)}
                        />
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
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
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowSeasonList(!showSeasonList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        seasonId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Season  *'}
                    </Text>
                    {seasonId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {seasonName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showSeasonList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchSeason}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredSeason.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredSeason.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnSeason(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Buyer PO Qty *"
              value={buyerPOQty}
              mode="outlined"
              onChangeText={text => setBuyerPOQty(text)}
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
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowBrandList(!showBrandList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        brandId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Brand/Project'}
                    </Text>
                    {brandId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {brandName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showBrandList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchBrand}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredBrand.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBrand.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnBrand(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Style Price FOB "
              value={stylePriceFOB}
              mode="outlined"
              onChangeText={text => setStylePriceFOB(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Approved consumption"
              value={approvedConsumption}
              mode="outlined"
              onChangeText={text => setApprovedConsumption(text)}
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
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowScaleOrSizeList(!showScaleOrSizeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        scaleOrSizeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Scale/Size group *'}
                    </Text>
                    {scaleOrSizeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {scaleOrSizeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showScaleOrSizeList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchScaleOrSize}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredScaleOrSize.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredScaleOrSize.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnScaleOrSize(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {showScaleTable && (
            <View style={styles.wrapper}>
              <View style={styles.table}>
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: '10%', alignItems: 'center'}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: '1%'}} />
                  <View style={{width: '30%', alignItems: 'center'}}>
                    <Text style={styles.table_head_captions}>Cons.</Text>
                  </View>
                  <View style={{width: '1%'}} />
                  <View style={{width: '30%', alignItems: 'center'}}>
                    <Text style={styles.table_head_captions}>Inv Limit</Text>
                  </View>
                  <View style={{width: '1%'}} />
                  <View style={{width: '28%', alignItems: 'center'}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                </View>
              </View>

              {/* Table Body */}
              {scaleTable &&
                scaleTable.map((item, index) => (
                  <View key={index} style={styles.table_body_single_row}>
                    <View style={{width: '10%', alignItems: 'center'}}>
                      <Text style={styles.table_data}>{item.name}</Text>
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '30%'}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={item.consumption.toString()}
                        onChangeText={text => {
                          const updatedTable = [...scaleTable];
                          updatedTable[index].consumption = text;
                          set_scaleTable(updatedTable);
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '30%'}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={item.invLimit.toString()}
                        onChangeText={text => {
                          const updatedTable = [...scaleTable];
                          updatedTable[index].invLimit = text;
                          set_scaleTable(updatedTable);
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '28%'}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={item.enteredQty.toString()}
                        // onChangeText={text => {
                        //   const updatedTable = [...scaleTable];
                        //   updatedTable[index].enteredQty = text;
                        //   set_scaleTable(updatedTable);
                        // }}
                        onChangeText={text => {
                          const updatedTable = [...scaleTable];
                          updatedTable[index].enteredQty = text;

                          set_scaleTable(updatedTable);

                          const total = updatedTable.reduce(
                            (sum, item) =>
                              sum + (parseFloat(item.enteredQty) || 0),
                            0,
                          );
                          setTotalEnteredQty(total.toString());
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                ))}
            </View>
          )}

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Total Qty :"
              value={totalEnteredQty}
              mode="outlined"
              onChangeText={text => console.log(text)}
              editable={false}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="HSN *"
              value={hsn}
              mode="outlined"
              onChangeText={text => setHSN(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="MRP Tag price"
              value={mrpTagPrice}
              mode="outlined"
              onChangeText={text => setMRPTagPrice(text)}
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
                // borderWidth: 0.5,
                // borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowProcessWorkFlowList(!showProcessWorkFlowList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        processWorkFlowId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Process work flow *'}
                    </Text>
                    {processWorkFlowId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {processWorkFlowName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showProcessWorkFlowList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcessWorkFlow}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredProcessWorkFlow.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredProcessWorkFlow.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnProcessWorkFlow(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
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

export default StyleCreateUI;

const getStyles = colors =>
  StyleSheet.create({
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
      width: '100%', // Reduces extra space on the sides
      backgroundColor: '#fff',
      elevation: 1,
      borderRadius: 5,
      overflow: 'hidden',
    },
    table_head: {
      backgroundColor: colors.color2,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
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
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 5,
      paddingHorizontal: 5,
      alignItems: 'center',
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
    itemContainer: {
      borderBottomColor: '#e0e0e0',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 5,
      textAlign: 'center',
    },
  });
