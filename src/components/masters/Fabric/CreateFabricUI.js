import React, {useState, useRef, useEffect, useMemo} from 'react';
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
import * as APIServiceCall from './../../../utils/apiCalls/apiCallsComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from '../../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioGroup} from 'react-native-radio-buttons-group';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
const CreateFabricUI = ({route, navigation, ...props}) => {
  useEffect(() => {
    if (props?.itemsArray) {
      if (props.itemsArray.fabrictypeMap) {
        setFabricTypeList(props.itemsArray.fabrictypeMap);
        set_filteredFabricType(props.itemsArray.fabrictypeMap);
      }
      if (props.itemsArray.uomMap) {
        set_filteredUOM(props.itemsArray.uomMap);
        setUOMList(props.itemsArray.uomMap);
      }
      if (props.itemsArray.colorMap) {
        set_filteredColor(props.itemsArray.colorMap);
        setColorList(props.itemsArray.colorMap);
      }
      if (props.itemsArray.locationsMap) {
        set_filteredLocation(props.itemsArray.locationsMap);
        setLocationList(props.itemsArray.locationsMap);
      }
      if (props.itemsArray.brandsMap) {
        setFilteredBrandOrProject(props.itemsArray.brandsMap);
        setBrandOrProjectList(props.itemsArray.brandsMap);
      }
    }
  }, [props.itemsArray]);

  const [fabricNo, setFabricNo] = useState('');
  const [fabricCode, setFabricCode] = useState('');
  const [hsn, setHsn] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [rate, setRate] = useState('');
  const [gsm, setGsm] = useState('');
  const [fabricWidth, setFabricWidth] = useState('');
  const [inventoryLimit, setInventoryLimit] = useState('');

  const [showAddColor, setShowAddColor] = useState(false);
  const [showAddUom, setShowAddUom] = useState(false);
  const [showAddBrandOrProject, setShowAddBrandOrProject] = useState(false);
  const [showAddFabricType, setShowAddFabricType] = useState(false);

  const [trimFabricRadio, set_trimFabricRadio] = useState('Yes');
  const [updateRollWiseQtyRadio, set_updateRollWiseQtyRadio] = useState('Yes');

  const [addBrandProjectName, setAddBrandProjectName] = useState('');
  const [addBrandProjectDescription, setAddBrandProjectDescription] =useState('');
  const [addNewFabricType, setAddNewFabricType] = useState('');
  const [addFabricTypeDescription, setAddFabricTypeDescription] = useState('');
  const [newColor, setNewColor] = useState('');
  const [colorCode, setColorCode] = useState('');
  const [uomType, setUomType] = useState('');
  const [uomDescription, setUomDescription] = useState('');

  // Location
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, set_filteredLocation] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationName, set_locationName] = useState('');
  const [locationId, set_locationId] = useState('');

  const actionOnLocation = item => {
    set_locationId(item.id);
    set_locationName(item.name);
    set_showLocationList(false);
  };

  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = locationList.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(locationList);
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

  const [brandOrProjectList, setBrandOrProjectList] = useState([]);
  const [filteredBrandOrProject, setFilteredBrandOrProject] = useState([]);
  const [showBrandOrProjectList, setShowBrandOrProjectList] = useState(false);
  const [brandOrProjectName, setBrandOrProjectName] = useState('');
  const [brandOrProjectId, setBrandOrProjectId] = useState('');

  const actionOnBrandOrProject = item => {
    setBrandOrProjectId(item.id);
    setBrandOrProjectName(item.name);
    setShowBrandOrProjectList(false);
    if (item.id === 'ADD_NEW_BRAND') {
      setShowAddBrandOrProject(true);
    } else {
      setShowAddBrandOrProject(false);
    }
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

  const [fabricTypeList, setFabricTypeList] = useState([]);
  const [filteredFabricType, set_filteredFabricType] = useState([]);
  const [showFabricTypeList, set_showFabricTypeList] = useState(false);
  const [fabricTypeName, set_fabricTypeName] = useState('');
  const [fabricTypeId, set_fabricTypeId] = useState('');

  const actionOnFabricType = item => {
    set_fabricTypeId(item.id);
    set_fabricTypeName(item.name);
    set_showFabricTypeList(false);
    if (item.id === 'ADD_NEW_FABRIC_TYPE') {
      setShowAddFabricType(true);
    } else {
      setShowAddFabricType(false);
    }
  };

  const handleSearchFabricType = text => {
    if (text.trim().length > 0) {
      const filtered = fabricTypeList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredFabricType(filtered);
    } else {
      set_filteredFabricType(fabricTypeList);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    const obj={
       "fabricNo":fabricNo,
	     "designCodes":"",
	     "newColor":newColor,
	     "fabriccode":fabricCode,
	     "fabricsort":"",
	     "fabriccontent":"",
	     "millname":"",
	     "fabricId":"0",
	     "fabricType":addNewFabricType,
	     "fabricDescription":addFabricTypeDescription,
	     "fabricTypeId":fabricTypeId==="ADD_NEW_FABRIC_TYPE" ? '0' : fabricTypeId,
	     "rate":rate,
	     "brandName":addBrandProjectName,
	     "brandDescription":addBrandProjectDescription,
	     "gsm":gsm,
       "fabricWidth":fabricWidth,
       "colorid":colorId ==='ADD_NEW_COLOR' ? '0' : colorId,
       "locationId":locationId,
       "uomId":uomId ==='ADD_NEW_UOM' ? '0': uomId,
       "hsn":hsn,
       "gstRate":gstRate,
       "inv_limit":inventoryLimit,
       "bomststatus":1,
       "fabricBrandId":brandOrProjectId ==='ADD_NEW_BRAND' ? '0' : brandOrProjectId,
       "newcolor":newColor,
       "newcolorcode":colorCode,
       "umoType":uomType,
       "umoDescription":uomDescription,
       "newFabricType":addNewFabricType,
       "newFabricDescription":addFabricTypeDescription,
       "newBrandName":addBrandProjectName,
       "newBrandDescription":addBrandProjectDescription,
       "bomststatus":trimFabricRadio ==="Yes"?1:0,
       "aisbinSts":updateRollWiseQtyRadio ==="Yes"?1:0,
    }
    props.submitAction(obj);
  };

  const backAction = async () => {
    props.backBtnAction();
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

  const updateRollWiseQtyRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Yes',
        value: 'Yes',
        selected: updateRollWiseQtyRadio === 'Yes',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'No',
        value: 'No',
        selected: updateRollWiseQtyRadio === 'No',
        labelStyle: {color: '#000'},
      },
    ],
    [updateRollWiseQtyRadio],
  );

  const handleUpdateRollWiseQtyRadioChange = selectedId => {
    const selectedOption = updateRollWiseQtyRadioButtons.find(
      button => button.id === selectedId,
    );
    set_updateRollWiseQtyRadio(selectedOption.value);
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
          title={'Create Fabric UI'}
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
            marginHorizontal: wp('5%'),
          }}>
          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="Fabric No *"
              value={fabricNo}
              mode="outlined"
              onChangeText={text => setFabricNo(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              width: '95%'
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent:'space-between'
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

            {showColorList && (
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
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="New Color "
                value={newColor}
                mode="outlined"
                onChangeText={text => setNewColor(text)}
              />
            </View>
          )}

          {showAddColor && (
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="Color Code "
                value={colorCode}
                mode="outlined"
                onChangeText={text => setColorCode(text)}
              />
            </View>
          )}

          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="Fabric Code"
              value={fabricCode}
              mode="outlined"
              onChangeText={text => setFabricCode(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
               width: '95%'
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent:'space-between'
              }}
              onPress={() => {
                set_showLocationList(!showLocationList);
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
               width: '95%'
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
               width: '100%',
                justifyContent:'space-between'
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

            {showUOMList && (
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
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="UOM Type * "
                value={uomType}
                mode="outlined"
                onChangeText={text => setUomType(text)}
              />
            </View>
          )}

          {showAddUom && (
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="UOM Description "
                value={uomDescription}
                mode="outlined"
                onChangeText={text => setUomDescription(text)}
              />
            </View>
          )}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
               width: '95%'
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
               width: '100%',
                justifyContent:'space-between'
              }}
              onPress={() => {
                set_showFabricTypeList(!showFabricTypeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        fabricTypeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Fabric Type   '}
                    </Text>
                    {fabricTypeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {fabricTypeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showFabricTypeList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchFabricType}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredFabricType.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredFabricType.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnFabricType(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {showAddFabricType && (
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="New Fabric Type "
                value={addNewFabricType}
                mode="outlined"
                onChangeText={text => setAddNewFabricType(text)}
              />
            </View>
          )}

          {showAddFabricType && (
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="Fabric Type Description "
                value={addFabricTypeDescription}
                mode="outlined"
                onChangeText={text => setAddFabricTypeDescription(text)}
              />
            </View>
          )}

          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="HSN *"
              value={hsn}
              mode="outlined"
              onChangeText={text => setHsn(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="GST Rate(%) *"
              value={gstRate}
              mode="outlined"
              onChangeText={text => setGstRate(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="Rate "
              value={rate}
              mode="outlined"
              onChangeText={text => setRate(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
               width: '95%'
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent:'space-between'
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

            {showBrandOrProjectList && (
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

          {showAddBrandOrProject && (
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="Brand/Project Name "
                value={addBrandProjectName}
                mode="outlined"
                onChangeText={text => setAddBrandProjectName(text)}
              />
            </View>
          )}

          {showAddBrandOrProject && (
            <View style={{marginTop: hp('2%'),width: '95%'}}>
              <TextInput
                label="Brand/Project Description "
                value={addBrandProjectDescription}
                mode="outlined"
                onChangeText={text => setAddBrandProjectDescription(text)}
              />
            </View>
          )}

          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="Fabric Width  "
              value={fabricWidth}
              mode="outlined"
              onChangeText={text => setFabricWidth(text)}
            />
          </View>
          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="GSM "
              value={gsm}
              mode="outlined"
              onChangeText={text => setGsm(text)}
            />
          </View>

          <View style={{marginTop: hp('2%'),width: '95%'}}>
            <TextInput
              label="Inventory Limit "
              value={inventoryLimit}
              mode="outlined"
              onChangeText={text => setInventoryLimit(text)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
               width: '95%'
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              Trim Fabric
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={trimFabricRadioButtons}
              onPress={handletrimFabricRadioChange}
              layout="row"
              selectedId={
                trimFabricRadioButtons.find(
                  item => item.value === trimFabricRadio,
                )?.id
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('4%'),
               width: '95%'
            }}>
            <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
              Update Roll Wise Qty
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={updateRollWiseQtyRadioButtons}
              onPress={handleUpdateRollWiseQtyRadioChange}
              layout="row"
              selectedId={
                updateRollWiseQtyRadioButtons.find(
                  item => item.value === updateRollWiseQtyRadio,
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

export default CreateFabricUI;

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
});
