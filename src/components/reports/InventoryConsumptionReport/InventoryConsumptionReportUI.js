import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
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

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../../assets/images/png/close1.png');

const InventoryConsumptionReportUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  const [data, setData] = useState([]);
  const [checkbox, set_checkbox] = useState(false);
  const [remarks, set_remarks] = useState('');
  const [generalRadio, set_generalRadio] = useState('Yes');
  const [buyerRadio, set_buyerRadio] = useState('No');
  const [displayStyleRadio, set_displayStyleRadio] = useState('No');

  const [general, set_general] = useState('Yes');
  const [customFormat, setCustomFormat] = useState('No');
  const [fabric, setFabric] = useState('Yes');
  const [style, setStyle] = useState('No');
  const [rm, setRm] = useState('No');
  const [rollWise, setrollWise] = useState('Yes');

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

  //   useEffect(() => {
  //     if (props?.lists) {
  //       if (props.lists.getStockStyles) {
  //         set_filteredStockStyles(props.lists.getStockStyles);
  //       }
  //       if (props.lists.getStockFabrics) {
  //         set_filteredStockFabrics(props.lists.getStockFabrics);
  //       }
  //     }
  //   }, [props]);

  //   useEffect(() => {
  //     if (props?.lists) {
  //       setData(props?.lists);
  //     }
  //   }, [props?.lists]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const ApproveAction = () => {
    console.log('Approved');

    const requestDetails = rows.map(detail => ({
      stockType: detail.stockTypeId,
      stockTypeName: detail.stockType,
      stock: detail.stockId,
      stock_rm_lot: 0,
      stockLocationId: 1,
      styleRmSizeId: detail.size,
      inputQty: detail.inputQty,
      uomstock: detail.uom,
    }));

    let tempObj = {
      processId: processId,
      woStyleId: stylesId,
      trimId: fabricId,
      locationId: locationId,
      unitMasterId: unitMasterId,
      comments: remarks,
      general: generalRadio === 'Yes' ? '1' : '0',
      styleWise: displayStyleRadio === 'Yes' ? '1' : '0',
      fabricQty: enteredFabQty,
      uom: itemsObj?.uomfabric,
      rmDetails: requestDetails,
    };

    // console.log("SAVING OBJ=====>   ", tempObj);
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const actionOnRawMaterialType = (id, name) => {
    set_rawMaterialTypeId(id);
    set_rawMaterialTypeName(name);
    set_showRawMaterialTypeList(false);
  };
  const actionOnRawMaterial = (id, name) => {
    set_rawMaterialId(id);
    set_rawMaterialName(name);
    set_showRawMaterialList(false);
  };
  const actionOnLocation = (id, name) => {
    set_locationId(id);
    set_locationName(name);
    set_showLocationList(false);
  };
  const actionOnStyle = (id, name) => {
    set_styleId(id);
    set_styleName(name);
    set_showStyleList(false);
  };
  const actionOnFabric = (id, name) => {
    set_fabricId(id);
    set_fabricName(name);
    set_showFabricList(false);
  };

  const handleSearchRawMaterialType = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredRawMaterialType(filtered);
    } else {
      set_filteredRawMaterialType(props.lists.getStockFabrics);
    }
  };
  const handleSearchRawMaterial = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredRawMaterial(filtered);
    } else {
      set_filteredRawMaterial(props.lists.getStockFabrics);
    }
  };
  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(props.lists.getStockFabrics);
    }
  };
  const handleSearchStyle = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(props.lists.getStockFabrics);
    }
  };
  const handleSearchFabric = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabrics.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredLocation(filtered);
    } else {
      set_filteredLocation(props.lists.getStockFabrics);
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
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp('1%'),
              justifyContent: 'space-evenly',
              marginTop: hp('2%'),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <RadioButton
                value="Yes"
                status={general === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => {
                  set_general('Yes');
                  setCustomFormat('No');
                }}
              />
              <Text style={{fontWeight: 'bold', color: '#000'}}>General</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <RadioButton
                value="No"
                status={customFormat === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setCustomFormat('Yes');
                  set_general('No');
                }}
              />
              <Text style={{fontWeight: 'bold', color: '#000'}}>
                Custom Format
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp('1%'),
              justifyContent: 'space-evenly',
              marginTop: hp('2%'),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <RadioButton
                value="Yes"
                status={fabric === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFabric('Yes');
                  setRm('No');
                  setStyle('No');
                }}
              />

              <Text style={{fontWeight: 'bold', color: '#000'}}>Fabric</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <RadioButton
                value="Yes"
                status={rm === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFabric('No');
                  setRm('Yes');
                  setStyle('No');
                }}
              />
              <Text style={{fontWeight: 'bold', color: '#000'}}>{'RM'}</Text>
            </View>
            {general === 'Yes' && (
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <RadioButton
                  value="Yes"
                  status={style === 'Yes' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setFabric('No');
                    setRm('No');
                    setStyle('Yes');
                  }}
                />
                <Text style={{fontWeight: 'bold', color: '#000'}}>Style</Text>
              </View>
            )}
          </View> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp('1%'),
              justifyContent: 'space-between',
              marginTop: hp('2%'),
            }}>
            <RadioButton.Group
              onValueChange={newValue => {
                if (newValue === 'General') {
                  set_general('Yes');
                  setCustomFormat('No');
                } else {
                  set_general('No');
                  setCustomFormat('Yes');
                }
              }}
              value={general === 'Yes' ? 'General' : 'Custom Format'}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center',width:'50%'}}>
                  <RadioButton value="General" />
                  <Text style={{fontWeight: 'bold', color: '#000'}}>
                    General
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center',width:'50%'}}>
                  <RadioButton value="Custom Format" />
                  <Text style={{fontWeight: 'bold', color: '#000'}}>
                    Custom Format
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: hp('2%'),
            }}>
            <RadioButton.Group
              onValueChange={newValue => {
                if (newValue === 'Fabric') {
                  setFabric('Yes');
                  setRm('No');
                  setStyle('No');
                } else if (newValue === 'RM') {
                  setFabric('No');
                  setRm('Yes');
                  setStyle('No');
                } else if (newValue === 'Style') {
                  setFabric('No');
                  setRm('No');
                  setStyle('Yes');
                }
              }}
              value={
                fabric === 'Yes' ? 'Fabric' : rm === 'Yes' ? 'RM' : 'Style'
              }
              >
               <View
                style={{
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                  // alignItems: 'center',
                  // flex: 1,
                }}> 
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width:'33%'                  }}>
                  <RadioButton value="Fabric" />
                  <Text style={{fontWeight: 'bold', color: '#000'}}>
                    Fabric
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                   width:'33%'
                  }}>
                  <RadioButton value="RM" />
                  <Text style={{fontWeight: 'bold', color: '#000'}}>RM</Text>
                </View>
                {general === 'Yes' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width:'33%'
                    }}>
                    <RadioButton value="Style" />
                    <Text style={{fontWeight: 'bold', color: '#000'}}>
                      Style
                    </Text>
                  </View>
                )}
              </View>
            </RadioButton.Group>
          </View>




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
            <View style={{width: '85%'}}>
              <TextInput
                label="Start Date"
                value={startDate ? startDate : ''}
                placeholder="Start Date"
                mode="outlined"
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
                placeholder="End Date"
                mode="outlined"
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

          {/* {fabric === 'Yes' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: hp('1%'),
                justifyContent: 'space-evenly',
                marginTop: hp('2%'),
              }}>
              <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                Roll Wise
              </Text>
              <Text style={{marginRight: wp('2%'), color: '#000'}}>Yes</Text>
              <RadioButton
                value="Yes"
                status={rollWise === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setrollWise('Yes');
                }}
              />

              <Text
                style={{
                  marginRight: wp('2%'),
                  marginLeft: wp('4%'),
                  color: '#000',
                }}>
                No
              </Text>
              <RadioButton
                value="No"
                status={rollWise === 'No' ? 'checked' : 'unchecked'}
                onPress={() => setrollWise('No')}
              />
            </View>
          )} */}
         {fabric === 'Yes' && (   <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', marginTop: hp('2%') }}>
            <Text style={{ width: '50%', fontWeight: 'bold', color: '#000' }}>Roll Wise</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setrollWise(newValue)}
              value={rollWise}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: wp('2%'), color: '#000' }}>Yes</Text>
                <RadioButton value="Yes" />
                <Text style={{ marginRight: wp('2%'), marginLeft: wp('4%'), color: '#000' }}>No</Text>
                <RadioButton value="No" />
              </View>
            </RadioButton.Group>
          </View>
          )}

          <View style={{marginBottom: 150}} />
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
      height: hp('7%'),
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
  });
