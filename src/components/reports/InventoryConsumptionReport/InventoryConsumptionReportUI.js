import React, {useState, useRef, useEffect, useContext, useMemo} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import CommonStyles from '../../../utils/commonStyles/commonStyles';
import * as Constant from '../../../utils/constants/constant';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import TextInputComponent from '../../../utils/commonComponents/textInputComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import {RadioButton} from 'react-native-paper';
import {ColorContext} from '../../colorTheme/colorTheme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../../assets/images/png/close1.png');

const InventoryConsumptionReportUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);



  const [general, set_general] = useState('Yes');
  const [customFormat, setCustomFormat] = useState('No');
  const [fabric, setFabric] = useState('Yes');
  const [style, setStyle] = useState('No');
  const [rm, setRm] = useState('No');
  const [rollWise, setrollWise] = useState('Yes');

  const [comboStyle, setComboStyle] = useState(false);

  const [rawMaterialTypeList, setRawMaterialTypeList] = useState([]);
  const [filteredRawMaterialType, set_filteredRawMaterialType] = useState([]);
  const [showRawMaterialTypeList, set_showRawMaterialTypeList] =
    useState(false);
  const [rawMaterialTypeName, set_rawMaterialTypeName] = useState('');
  const [rawMaterialTypeId, set_rawMaterialTypeId] = useState('');

  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [filteredRawMaterial, set_filteredRawMaterial] = useState([]);
  const [showRawMaterialList, set_showRawMaterialList] = useState(false);
  const [rawMaterialName, set_rawMaterialName] = useState('');
  const [rawMaterialId, set_rawMaterialId] = useState('');

  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, set_filteredLocation] = useState([]);
  const [showLocationList, set_showLocationList] = useState(false);
  const [locationName, set_locationName] = useState('');
  const [locationId, set_locationId] = useState('');

  const [styleList, setStyleList] = useState([]);
  const [filteredStyle, set_filteredStyle] = useState([]);
  const [showStyleList, set_showStyleList] = useState(false);
  const [styleName, set_styleName] = useState('');
  const [styleId, set_styleId] = useState('');

  const [fabricList, setFabricList] = useState([]);
  const [filteredFabric, set_filteredFabric] = useState([]);
  const [showFabricList, set_showFabricList] = useState(false);
  const [fabricName, set_fabricName] = useState('');
  const [fabricId, set_fabricId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, set_startDate] = useState('');
  const [endDate, set_endDate] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  

  useEffect(() => {
    if (props?.lists) {
      if (props?.lists.stylesMap) {
        const formattedMap = Object.keys(props?.lists.stylesMap).map(key => ({
          id: key,
          name: props?.lists.stylesMap[key],
        }));
        set_filteredStyle(formattedMap);
        setStyleList(formattedMap);
      }
      if (props?.lists.fabricMap) {
        const formattedMap = Object.keys(props?.lists.fabricMap).map(key => ({
          id: key,
          name: props?.lists.fabricMap[key],
        }));
        set_filteredFabric(formattedMap);
        setFabricList(formattedMap);
      }
      if (props?.lists.rawMaterialMap) {
        const formattedMap = Object.keys(props?.lists.rawMaterialMap).map(
          key => ({
            id: key,
            name: props?.lists.rawMaterialMap[key],
          }),
        );
        set_filteredRawMaterial(formattedMap);
        setRawMaterialList(formattedMap);
      }
      if (props?.lists.rawMaterialTypeMap) {
        const formattedMap = Object.keys(props?.lists.rawMaterialTypeMap).map(
          key => ({
            id: key,
            name: props?.lists.rawMaterialTypeMap[key],
          }),
        );
        set_filteredRawMaterialType(formattedMap);
        setRawMaterialTypeList(formattedMap);
      }
      if (props?.lists.companyLocationsMap) {
        const formattedMap = Object.keys(props?.lists.companyLocationsMap).map(
          key => ({
            id: key,
            name: props?.lists.companyLocationsMap[key],
          }),
        );
        set_filteredLocation(formattedMap);
        setLocationList(formattedMap);
      }
    }
  }, [props?.lists]);

  useEffect(() => {
    if (props?.rmTypeList) {
      const list = props?.rmTypeList.rmTypes || [];
      const formattedMap = list.map(item => ({
        id: item.FABRICRM_ID,
        name: item.FABRICRM_VAL,
      }));
      set_filteredRawMaterial(formattedMap);
      setRawMaterialList(formattedMap);
      set_rawMaterialId('');
      set_rawMaterialName('');
    }
  }, [props?.rmTypeList]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const formattedDateIntoYMD = date => {
    let [d, m, y] = date.split('-');
    let formatted = [y, m, d].join('-');
    return formatted;
  };
  const formattedDateCustomFormat = date => {
    let [d, m, y] = date.split('-');
    let formatted = [d, m,y].join('/');
    return formatted;
  };

  const ApproveAction = () => {
    console.log('Approved');
 if (fabric === 'Yes' && !fabricId) {
      Alert.alert("Alert", "Please select a Fabric before proceeding !");
      return;
    }

    // rm selected but id missing
    if (rm === 'Yes' && !rawMaterialId) {
      Alert.alert("Alert", "Please select an Raw Material before proceeding !");
      return;
    }

    // style selected but id missing
    if (style === 'Yes' && !styleId) {
      Alert.alert("Alert", "Please select a Style before proceeding !");
      return;
    }



    let tempObj = {
      startDate: general==="Yes"? formattedDateIntoYMD(startDate) : formattedDateCustomFormat(startDate),
      endDate:general==="Yes"? formattedDateIntoYMD(endDate) : formattedDateCustomFormat(endDate),
      fabricId: fabricId || '0',
      rawMaterialId: rawMaterialId || '0',
      rawMaterialTypeId: rawMaterialTypeId || '0',
      styleId: styleId || '0',
      itemType: fabric ==="Yes" ? "fabric" : rm==="Yes" ? "rm": "style",
      procuredOrSupplied: rollWise === 'Yes'? '1' : '0' , 
      location: locationId || '0',
      multiStyle: '',
      multiRm: '',
      isCombo: comboStyle ? '1' : '0',
      comboSelectedStyleIds: selectedIndices.join(',') || '',
      type:general==="Yes"? "general" : "customFormat",
    };

    console.log("SAVING OBJ=====>   ", tempObj);
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const actionOnRawMaterialType = item => {
    set_rawMaterialTypeId(item.id);
    set_rawMaterialTypeName(item.name);
    set_showRawMaterialTypeList(false);
    props.getICReportTrimTypeList(item.id);
  };
  const actionOnRawMaterial = item => {
    set_rawMaterialId(item.id);
    set_rawMaterialName(item.name);
    set_showRawMaterialList(false);
  };
  const actionOnLocation = item => {
    set_locationId(item.id);
    set_locationName(item.name);
    set_showLocationList(false);
  };
  const actionOnStyle = item => {
    set_styleId(item.id);
    set_styleName(item.name);
    set_showStyleList(false);
  };
  const actionOnFabric = item => {
    set_fabricId(item.id);
    set_fabricName(item.name);
    set_showFabricList(false);
  };

  const handleSearchRawMaterialType = text => {
    if (text.trim().length > 0) {
      const filtered = rawMaterialTypeList.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredRawMaterialType(filtered);
    } else {
      set_filteredRawMaterialType(rawMaterialTypeList);
    }
  };
  const handleSearchRawMaterial = text => {
    if (text.trim().length > 0) {
      const filtered = rawMaterialList.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredRawMaterial(filtered);
    } else {
      set_filteredRawMaterial(rawMaterialList);
    }
  };
  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = locationList.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(locationList);
    }
  };
  const handleSearchStyle = text => {
    if (text.trim().length > 0) {
      const filtered = styleList.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredStyle(filtered);
    } else {
      set_filteredStyle(styleList);
    }
  };
  const handleSearchFabric = text => {
    if (text.trim().length > 0) {
      const filtered = fabricList.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredFabric(filtered);
    } else {
      set_filteredFabric(fabricList);
    }
  };

  const handleConfirm = date => {
    const extractedDate = date.toISOString().split('T')[0];
    const formattedDate = formatDateIntoDMY(extractedDate);

    if (activeField === 'endDate') {
      set_endDate(formattedDate);
    } else if (activeField === 'startDate') {
      set_startDate(formattedDate);
    }
    hideDatePicker();
  };

  const showDatePicker = field => {
    setActiveField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null);
  };

  function formatDateIntoDMY(inp) {
    const [y, m, d] = inp.split('-');
    let ans = [d, m, y];
    ans = ans.join('-');
    return ans;
  }

  const generalRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'General',
        value: 'General',
        selected: general === 'Yes',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Custom Format',
        value: 'Custom Format',
        selected: customFormat === 'Yes',
        labelStyle: {color: '#000'},
      },
    ],
    [general, customFormat],
  );

  // Define radio buttons for Fabric, RM, and Style
  const categoryRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Fabric',
        value: 'Fabric',
        selected: fabric === 'Yes',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'RM',
        value: 'RM',
        selected: rm === 'Yes',
        labelStyle: {color: '#000'},
      },
      ...(general === 'Yes'
        ? [
            {
              id: '3',
              label: 'Style',
              value: 'Style',
              selected: style === 'Yes',
              labelStyle: {color: '#000'},
            },
          ]
        : []),
    ],
    [fabric, rm, style, general],
  );

  // Define radio buttons for Roll Wise
  const rollWiseRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Yes',
        value: 'Yes',
        selected: rollWise === 'Yes',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'No',
        value: 'No',
        selected: rollWise === 'No',
        labelStyle: {color: '#000'},
      },
    ],
    [rollWise],
  );

  const handleGeneralChange = selectedId => {
    const selectedOption = generalRadioButtons.find(
      button => button.id === selectedId,
    );
    if (selectedOption.value === 'General') {
      set_general('Yes');
      setCustomFormat('No');
    } else {
      set_general('No');
      setCustomFormat('Yes');
    }
  };

  const handleCategoryChange = selectedId => {
    const selectedOption = categoryRadioButtons.find(
      button => button.id === selectedId,
    );
    if (selectedOption.value === 'Fabric') {
      setFabric('Yes');
      setRm('No');
      setStyle('No');
    } else if (selectedOption.value === 'RM') {
      setFabric('No');
      setRm('Yes');
      setStyle('No');
    } else if (selectedOption.value === 'Style') {
      setFabric('No');
      setRm('No');
      setStyle('Yes');
    }
  };

  const handleRollWiseChange = selectedId => {
    const selectedOption = rollWiseRadioButtons.find(
      button => button.id === selectedId,
    );
    setrollWise(selectedOption.value);
  };

   const actionOnMultipleStyles = id => {
    setSelectedIndices(prevSelected => {
      const exists = prevSelected.some(i => i === id);

      if (exists) {
        return prevSelected.filter(i => i !== id);
      } else {
        return [...prevSelected, id];
      }
    });
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
          title={'Inventory Consumption Report'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{height: 20}} />

          <RadioGroup
            style={{flexDirection: 'row'}}
            radioButtons={generalRadioButtons}
            onPress={handleGeneralChange}
            layout="row"
            selectedId={
              generalRadioButtons.find(
                item =>
                  item.value ===
                  (general === 'Yes' ? 'General' : 'Custom Format'),
              )?.id
            }
          />

          <RadioGroup
            style={{flexDirection: 'row', color: '#000'}}
            radioButtons={categoryRadioButtons}
            onPress={handleCategoryChange}
            layout="row"
            selectedId={
              categoryRadioButtons.find(
                item =>
                  item.value ===
                  (fabric === 'Yes'
                    ? 'Fabric'
                    : rm === 'Yes'
                    ? 'RM'
                    : style === 'Yes'
                    ? 'Style'
                    : ''),
              )?.id
            }
          />

          {/* dates */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%', paddingHorizontal: 10}}>
              <TextInput
                label="Start Date"
                value={startDate ? startDate : ''}
                placeholder="Start Date"
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('startDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="End Date"
                value={endDate ? endDate : ''}
                placeholderTextColor="#000"
                placeholder="End Date"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('endDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          {/* drop down lists */}

          {rm === 'Yes' && (
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
                        {'Raw Material Type    '}
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

              {showRawMaterialTypeList && (
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
          )}

          {rm === 'Yes' && (
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
                  set_showRawMaterialList(!showRawMaterialList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          rawMaterialId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'* Raw Material'}
                      </Text>
                      {rawMaterialId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {rawMaterialName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showRawMaterialList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchRawMaterial}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredRawMaterial.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredRawMaterial.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnRawMaterial(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
          {style === 'Yes' && (
            <View
              style={[
                styles.checkboxItem,
                {marginTop: hp('4%'), marginBottom: hp('0.5%')},
              ]}>
              <CustomCheckBox
                isChecked={comboStyle}
                onToggle={() => setComboStyle(!comboStyle)}
              />
              <Text style={styles.checkboxLabel}>{'Combo Style Inv'}</Text>
            </View>
          )}

          {style === 'Yes' && !comboStyle && (
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
                  set_showStyleList(!showStyleList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          styleId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Style *'}
                      </Text>
                      {styleId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {styleName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showStyleList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchStyle}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredStyle.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredStyle.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnStyle(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

           {style === 'Yes' && comboStyle && <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              width: '95%',
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
                set_showStyleList(!showStyleList);
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
                      {'Style'}
                    </Text>
                    {selectedIndices.length > 0 ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {selectedIndices.length > 0 ? (
                          <Text style={[styles.dropTextInputStyle]}>
                            {styleList
                              .filter(color =>
                                selectedIndices.includes(color.id),
                              )
                              .map(color => color.name)
                              .join(', ')}
                          </Text>
                        ) : null}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showStyleList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchStyle}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredStyle.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredStyle.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.itemContainer}
                        onPress={() => actionOnMultipleStyles(item.id)}>
                        <CustomCheckBox
                          isChecked={selectedIndices.includes(item.id)}
                          onToggle={() => actionOnMultipleStyles(item.id)}
                        />
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>}

          

          {fabric === 'Yes' && (
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
                  set_showFabricList(!showFabricList);
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
                        {'Fabric *'}
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
          )}

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
                      {'Location'}
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

          {fabric === 'Yes' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: hp('2%'),
              }}>
              <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                Roll Wise
              </Text>
              <RadioGroup
                style={{flexDirection: 'row'}}
                radioButtons={rollWiseRadioButtons}
                onPress={handleRollWiseChange}
                layout="row"
                selectedId={
                  rollWiseRadioButtons.find(item => item.value === rollWise)?.id
                }
              />
            </View>
          )}

          {/* <View style={{marginBottom: 150}} /> */}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Search'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={false}
          rigthBtnState={true}
          isRightBtnEnable={true}
          leftButtonAction={() => backBtnAction()}
          rightButtonAction={async () => ApproveAction()}
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

export default InventoryConsumptionReportUI;

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#fff',
      alignSelf: 'center',
      alignItems: 'center',
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
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
      alignItems: 'center',
      minHeight: hp('7%'),
      width: wp('75%'),
      borderRadius: hp('0.5%'),
    },

    // Adjust the image style to make it smaller and visible
    // imageStyle: {
    //     height: wp("6%"),
    //     aspectRatio: 1,
    //     marginRight: wp('4%'),
    //     resizeMode: 'contain',
    // },

    imageStyle: {
      height: 50,
      width: 50,
      aspectRatio: 1,
      marginRight: 20,
      resizeMode: 'contain',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
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
      flex: 1,
      marginTop: hp('2%'),
      width: '95%',
      marginBottom: 10,
      marginHorizontal: 10,
    },

    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },

    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
      textAlign: 'center',
      paddingHorizontal: 5,
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 10, // Adjust vertical padding for rows
      paddingHorizontal: 5, // Add horizontal padding
      justifyContent: 'center',
      alignItems: 'center',
    },

    table_data: {
      fontSize: 11,
      color: '#000',
      textAlign: 'center',
      alignSelf: 'center',
      paddingHorizontal: 5, // Add padding for data cells
    },

    table: {
      margin: 15,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
    },

    checkbox_container: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 5,
      textAlign: 'center',
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
    input: {
      color: '#000',
    },
    dropdownContent1: {
      elevation: 5,
      height: 220,
      alignSelf: 'center',
      width: '90%',
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      marginVertical: 8,
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
     itemContainer: {
      borderBottomColor: '#e0e0e0',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
