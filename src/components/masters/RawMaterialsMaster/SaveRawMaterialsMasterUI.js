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
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import {ColorContext} from '../../colorTheme/colorTheme';
import { RadioGroup } from 'react-native-radio-buttons-group';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const SaveRawMaterialsMasterUI = ({route, navigation, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  const [showScaleCheckbox, set_showScaleCheckbox]=useState(false);

  useEffect(() => {
    if (props.itemsObj) {
      if (props.itemsObj.trimName) {
        setRawMaterialName(props.itemsObj.trimName);
      }
      if (props.itemsObj.scale) {
        setScaleWise(props.itemsObj.scale===1);
        set_showScaleCheckbox(props.itemsObj.scale===1);
      }
      if (props.itemsObj.hsn) {
        setHsn(props.itemsObj.hsn);
      }
      if (props.itemsObj.gstRate) {
        setGstRate(props.itemsObj.gstRate);
      }
      if (props.itemsObj.inv_limit) {
        setInventoryLimit(props.itemsObj.inv_limit);
      }
      if (props.itemsObj.price) {
        setPrice(props.itemsObj.price);
      }
      if (props.itemsObj.packageQty) {
        setPackageQty(props.itemsObj.packageQty);
      }
      if (props.itemsObj.activeStatus) {
        set_bomStatus(props.itemsObj.activeStatus==='Y'? "Yes" : "No");
      }
      if (props.itemsObj.ispopdfScalewise) {
        setMergeInPoPdf(props.itemsObj.ispopdfScalewise===1 ? "Yes" : "No");
      }
      if (props.itemsObj.uomMap) {
        const menuID = props.itemsObj.uomId.toString();
        set_uomName(props?.itemsObj?.uomMap[menuID]);
        set_uomId(props.itemsObj.uomId.toString());
        const arrayList = Object.keys(props.itemsObj.uomMap).map(key => ({
          id: key,
          name: props.itemsObj.uomMap[key]
        }));
        setUOMList(arrayList);
        set_filteredUOM(arrayList);
      }
      if (props.itemsObj.colorMap) {
        const menuID = props.itemsObj.colorid.toString();
        set_colorName(props?.itemsObj?.colorMap[menuID]);
        set_colorId(props.itemsObj.colorid.toString());
        const arrayList = Object.keys(props.itemsObj.colorMap).map(key => ({
          id: key,
          name: props.itemsObj.colorMap[key]
        }));
        setColorList(arrayList);
        set_filteredColor(arrayList);
      }
      if (props.itemsObj.locationsMap) {
        const menuID = props.itemsObj.locationId.toString();
        setLocationName(props?.itemsObj?.locationsMap[menuID]);
        setLocationId(props.itemsObj.locationId.toString());
        const arrayList = Object.keys(props.itemsObj.locationsMap).map(key => ({
          id: key,
          name: props.itemsObj.locationsMap[key]
        }));
        setLocationList(arrayList);
        setFilteredLocation(arrayList);
      }
      if (props.itemsObj.trimTypesMap) {
        const menuID = props.itemsObj.trimTypeId.toString();
        set_rawMaterialTypeName(props?.itemsObj?.trimTypesMap[menuID]);
        set_rawMaterialTypeId(props.itemsObj.trimTypeId.toString());
        const arrayList = Object.keys(props.itemsObj.trimTypesMap).map(key => ({
          id: key,
          name: props.itemsObj.trimTypesMap[key]
        }));
        setRawMaterialTypeList(arrayList);
        set_filteredRawMaterialType(arrayList);
      }
      if (props.itemsObj.brandsMap) {
        const menuID = props.itemsObj.newTrimBrandId.toString();
        setBrandOrProjectName(props?.itemsObj?.brandsMap[menuID]);
        setBrandOrProjectId(props.itemsObj.newTrimBrandId.toString());
        const arrayList = Object.keys(props.itemsObj.brandsMap).map(key => ({
          id: key,
          name: props.itemsObj.brandsMap[key]
        }));
        setBrandOrProjectList(arrayList);
        setFilteredBrandOrProject(arrayList);
      }
    }
    console.log("ui props ==>>  ", props.itemsObj);
  }, [props.itemsObj]);



   const [showAddRawMaterialType, setShowAddRawMaterialType] = useState(false);
   const [showAddColor, setShowAddColor] = useState(false);
   const [showAddUom, setShowAddUom] = useState(false);
 
   const [rawMaterialName, setRawMaterialName] = useState('');
   const [gstRate, setGstRate] = useState('0');
   const [hsn, setHsn] = useState('');
   const [price, setPrice] = useState('0');
   const [inventoryLimit, setInventoryLimit] = useState('');
   const [packageQty, setPackageQty] = useState('');
   const [mergeInPoPdf, setMergeInPoPdf] = useState("Yes");
   const [bomStatus, set_bomStatus] = useState('Yes');
   const [rmBomStatus, set_rmBomStatus] = useState('Yes');
   const [scaleWise, setScaleWise] = useState(false);
   const [newRawMaterialType, setNewRawMaterialType] = useState('');
   const [newRmCode, setNewRmCode] = useState('');
   const [newColor, setNewColor] = useState('');
   const [colorCode, setColorCode] = useState('');
   const [uomType, setUomType] = useState('');
   const [uomDescription, setUomDescription] = useState('');
 
 
   // Raw Material Type
   const [rawMaterialTypeList, setRawMaterialTypeList] = useState([]);
   const [filteredRawMaterialType, set_filteredRawMaterialType] = useState([]);
   const [showRawMaterialTypeList, set_showRawMaterialTypeList] =useState(false);
   const [rawMaterialTypeName, set_rawMaterialTypeName] = useState('');
   const [rawMaterialTypeId, set_rawMaterialTypeId] = useState('');

 
   const actionOnRawMaterialType = item => {
     set_rawMaterialTypeId(item.id);
     set_rawMaterialTypeName(item.name);
     set_showRawMaterialTypeList(false);
     if (item.id === 'ADD_NEW_TRIMTYPE') {
       setShowAddRawMaterialType(true);
       console.log('setted true');
     } else {
       setShowAddRawMaterialType(false);
     }
   };
 
   const handleSearchRawMaterialType = text => {
     if (text.trim().length > 0) {
       const filtered = rawMaterialTypeList.filter(user =>
         user.name.toLowerCase().includes(text.toLowerCase()),
       );
       set_filteredRawMaterialType(filtered);
     } else {
       set_filteredRawMaterialType(rawMaterialTypeList);
     }
   };
 
   // Color
   const [colorList, setColorList] = useState([]);
   const [filteredColor, set_filteredColor] = useState([]);
   const [showColorList, set_showColorList] = useState(false);
   const [colorName, set_colorName] = useState('');
   const [colorId, set_colorId] = useState('');
 
   const actionOnColor = item => {
     set_colorId(item.id);
     set_colorName(item.name);
     set_showColorList(false);
     if (item.id === 'ADD_NEW_COLOR') {
       setShowAddColor(true);
     } else {
       setShowAddColor(false);
     }
   };
 
   const handleSearchColor = text => {
     if (text.trim().length > 0) {
       const filtered = colorList.filter(user =>
         user.name.toLowerCase().includes(text.toLowerCase()),
       );
       set_filteredColor(filtered);
     } else {
       set_filteredColor(colorList);
     }
   };
 
   // UOM (Unit of Measurement)
   const [uomList, setUOMList] = useState([]);
   const [filteredUOM, set_filteredUOM] = useState([]);
   const [showUOMList, set_showUOMList] = useState(false);
   const [uomName, set_uomName] = useState('');
   const [uomId, set_uomId] = useState('');
 
   const actionOnUOM = item => {
     set_uomId(item.id);
     set_uomName(item.name);
     set_showUOMList(false);
     if (item.id === 'ADD_NEW_UOM') {
       setShowAddUom(true);
     } else {
       setShowAddUom(false);
     }
   };
 
   const handleSearchUOM = text => {
     if (text.trim().length > 0) {
       const filtered = uomList.filter(user =>
         user.name.toLowerCase().includes(text.toLowerCase()),
       );
       set_filteredUOM(filtered);
     } else {
       set_filteredUOM(uomList);
     }
   };
 
   // BrandOrProject
   const [brandOrProjectList, setBrandOrProjectList] = useState([]);
   const [filteredBrandOrProject, setFilteredBrandOrProject] = useState([]);
   const [showBrandOrProjectList, setShowBrandOrProjectList] = useState(false);
   const [brandOrProjectName, setBrandOrProjectName] = useState('');
   const [brandOrProjectId, setBrandOrProjectId] = useState('');
 
   // Location
   const [locationList, setLocationList] = useState([]);
   const [filteredLocation, setFilteredLocation] = useState([]);
   const [showLocationList, setShowLocationList] = useState(false);
   const [locationName, setLocationName] = useState('');
   const [locationId, setLocationId] = useState('');
 
   // Handlers for BrandOrProject
   const actionOnBrandOrProject = item => {
     setBrandOrProjectId(item.id);
     setBrandOrProjectName(item.name);
     setShowBrandOrProjectList(false);
   };
 
   const handleSearchBrandOrProject = text => {
     if (text.trim().length > 0) {
       const filtered = brandOrProjectList.filter(project =>
         project.name.toLowerCase().includes(text.toLowerCase()),
       );
       setFilteredBrandOrProject(filtered);
     } else {
       setFilteredBrandOrProject(brandOrProjectList);
     }
   };
 
   // Handlers for Location
   const actionOnLocation = item => {
     setLocationId(item.id);
     setLocationName(item.name);
     setShowLocationList(false);
   };
 
   const handleSearchLocation = text => {
     if (text.trim().length > 0) {
       const filtered = locationList.filter(location =>
         location.name.toLowerCase().includes(text.toLowerCase()),
       );
       setFilteredLocation(filtered);
     } else {
       setFilteredLocation(locationList);
     }
   };
 
   const backBtnAction = () => {
     props.backBtnAction();
   };
 
   const popOkBtnAction = () => {
     props.popOkBtnAction();
   };
 
   const submitAction = async () => {
     // props.submitAction(Obj);
 
     const obj={
     "styleId":"",
    "ids":"",
    "trimconstruction_id":0,
    "trimTypeId":rawMaterialTypeId,
    "availQty":0,
    "fabricBrandId":"",
    "colorid":colorId,
    "color_shades":"",
    "newTrimBrandId":brandOrProjectId,
    "isFabric":0,
    "multi_rm_flag":0,
    "lycra_id":"",
    "trimName":rawMaterialName,
    "trimTypeName":rawMaterialTypeName,
    "packageQty":packageQty,
    "description":"",
    "allowedAdjustmentPercent":1,
    "sizeId":"",
    "uomId":uomId,
    "hsn":hsn,
    "locationId":locationId,
    "comments":"",
    "price":price,
    "aisbinSts":0,
    "copiedRMId":0,
    "batchid":0,
    "rmcode":"",
    "scale":scaleWise ? 1: 0,
    "menumapq":0,
    "brandItem":"",
    "inv_limit":inventoryLimit,
    "ispopdfScalewise":mergeInPoPdf==="Yes" ? 1:0,
    "trimTypeCode":newRmCode,
    "bomststatus":rmBomStatus ==="Yes" ? 1:0,
    "activeStatus":bomStatus ==="Yes"? "Y" :"N",
    "uomType":uomType,
    "uomTypeDescription":uomDescription,
    "newBatch":"",
    "batchDescription":"",
    "newColor":newColor,
    "colorCode":colorCode,
    "gstRate":gstRate,
    "Count":0,
    "procured_or_supplied":0,
    "budgeted":0
     }
   props.submitAction(obj);
   };
 
   const backAction = async () => {
     props.backBtnAction();
   };
 
   const bomStatusRadioButtons = useMemo(
     () => [
       {
         id: '1',
         label: 'Yes',
         value: 'Yes',
         selected: bomStatus === 'Yes',
         labelStyle: {color: '#000'},
       },
       {
         id: '2',
         label: 'No',
         value: 'No',
         selected: bomStatus === 'No',
         labelStyle: {color: '#000'},
       },
     ],
     [bomStatus],
   );
 
   const handlebomStatusChange = selectedId => {
     const selectedOption = bomStatusRadioButtons.find(
       button => button.id === selectedId,
     );
     set_bomStatus(selectedOption.value);
   };
 
   const rmBomStatusRadioButtons = useMemo(
     () => [
       {
         id: '1',
         label: 'Yes',
         value: 'Yes',
         selected: rmBomStatus === 'Yes',
         labelStyle: {color: '#000'},
       },
       {
         id: '2',
         label: 'No',
         value: 'No',
         selected: rmBomStatus === 'No',
         labelStyle: {color: '#000'},
       },
     ],
     [rmBomStatus],
   );
 
   const handleRmbomStatusChange = selectedId => {
     const selectedOption = rmBomStatusRadioButtons.find(
       button => button.id === selectedId,
     );
     set_rmBomStatus(selectedOption.value);
   };
 
   const mergeInPoPdfRadioButtons = useMemo(
     () => [
       {
         id: '1',
         label: 'Yes',
         value: 'Yes',
         selected: mergeInPoPdf === 'Yes',
         labelStyle: {color: '#000'},
       },
       {
         id: '2',
         label: 'No',
         value: 'No',
         selected: mergeInPoPdf === 'No',
         labelStyle: {color: '#000'},
       },
     ],
     [mergeInPoPdf],
   );
   const handlemergeInPoPdfChange = selectedId => {
     const selectedOption = mergeInPoPdfRadioButtons.find(
       button => button.id === selectedId,
     );
     setMergeInPoPdf(selectedOption.value);
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
          title={'Save Raw Materials Master'}
          backBtnAction={() => backAction()}
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
            marginHorizontal: wp('5%'),
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: rawMaterialTypeId ? '#D8D8D8' : '#fff',
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
                set_showRawMaterialTypeList(!showRawMaterialTypeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        rawMaterialTypeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Raw Material Type *  '}
                    </Text>
                    {rawMaterialTypeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {rawMaterialTypeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showRawMaterialTypeList && !rawMaterialTypeId && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchRawMaterialType}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredRawMaterialType.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredRawMaterialType.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnRawMaterialType(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {showAddRawMaterialType && (
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="New Raw Material Type "
                value={newRawMaterialType}
                mode="outlined"
                onChangeText={text => setNewRawMaterialType(text)}
              />
            </View>
          )}

          {showAddRawMaterialType && (
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="New RM Code "
                value={newRmCode}
                mode="outlined"
                onChangeText={text => setNewRmCode(text)}
              />
            </View>
          )}

          {showAddRawMaterialType && <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
            RM Type BOM Status
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={rmBomStatusRadioButtons}
              onPress={handleRmbomStatusChange}
              layout="row"
              selectedId={
                rmBomStatusRadioButtons.find(
                  item => item.value === rmBomStatus,
                )?.id
              }
            />
          </View>}

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Raw Material Name *"
              value={rawMaterialName}
              mode="outlined"
              editable={props.itemsObj.trimName ? false : true}
              onChangeText={text => setRawMaterialName(text)}
              style={{backgroundColor:'#D8D8D8'}}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: locationId ? '#D8D8D8' : '#fff',
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
                      {'Location *  '}
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

            {showLocationList && !locationId && (
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
              backgroundColor: colorId ? "#D8D8D8": '#fff',
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
                set_showColorList(!showColorList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        colorId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Color *  '}
                    </Text>
                    {colorId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {colorName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showColorList && !colorId && (
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
                        style={styles.dropdownOption}
                        onPress={() => actionOnColor(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {showAddColor && (
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="New Color "
                value={newColor}
                mode="outlined"
                onChangeText={text => setNewColor(text)}
              />
            </View>
          )}

          {showAddColor && (
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Color Code "
                value={colorCode}
                mode="outlined"
                onChangeText={text => setColorCode(text)}
              />
            </View>
          )}

          {showScaleCheckbox && <View style={[styles.checkboxItem, {marginTop: hp('2%')}]}>
            <CustomCheckBox
              isChecked={scaleWise}
              onToggle={() => setScaleWise(!scaleWise)}
            />
            <Text style={styles.checkboxLabel}>{'Scale Wise'}</Text>
          </View>}

          {scaleWise && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: hp('4%'),
              }}>
              <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                Merge in PO PDF
              </Text>
              <RadioGroup
                style={{flexDirection: 'row'}}
                radioButtons={bomStatusRadioButtons}
                onPress={handlebomStatusChange}
                layout="row"
                selectedId={
                  bomStatusRadioButtons.find(item => item.value === bomStatus)
                    ?.id
                }
              />
            </View>
          )}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: uomId ? '#D8D8D8':'#fff',
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
                set_showUOMList(!showUOMList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        uomId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'UOM *  '}
                    </Text>
                    {uomId ? (
                      <Text style={[styles.dropTextInputStyle]}>{uomName}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showUOMList && !uomId && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchUOM}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredUOM.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredUOM.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnUOM(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {showAddUom && (
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="UOM Type * "
                value={uomType}
                mode="outlined"
                onChangeText={text => setUomType(text)}
              />
            </View>
          )}

          {showAddUom && (
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="UOM Description "
                value={uomDescription}
                mode="outlined"
                onChangeText={text => setUomDescription(text)}
              />
            </View>
          )}

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="HSN *"
              value={hsn}
              mode="outlined"
              onChangeText={text => setHsn(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Price"
              value={price.toString()}
              mode="outlined"
              onChangeText={text => setPrice(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Inventory Limit"
              value={inventoryLimit.toString()}
              mode="outlined"
              onChangeText={text => setInventoryLimit(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Package Qty"
              value={packageQty.toString()}
              mode="outlined"
              onChangeText={text => setPackageQty(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="GST Rate(%) *"
              value={gstRate.toString()}
              mode="outlined"
              onChangeText={text => setGstRate(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: brandOrProjectId ? '#D8D8D8' : '#fff',
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
                setShowBrandOrProjectList(!showBrandOrProjectList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        brandOrProjectId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Brand/Project   '}
                    </Text>
                    {brandOrProjectId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {brandOrProjectName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showBrandOrProjectList && !brandOrProjectId && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchBrandOrProject}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredBrandOrProject.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBrandOrProject.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnBrandOrProject(item)}>
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              BOM Status
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={mergeInPoPdfRadioButtons}
              onPress={handlemergeInPoPdfChange}
              layout="row"
              selectedId={
                mergeInPoPdfRadioButtons.find(
                  item => item.value === mergeInPoPdf,
                )?.id
              }
            />
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

export default SaveRawMaterialsMasterUI;

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
      width: '45%', 
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
  });
