import React, {useState, useRef, useEffect, useContext, useMemo} from 'react';
import {
  View,
  FlatList,
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {RadioGroup} from 'react-native-radio-buttons-group';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const DeliveryChallanEditUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  const [hasFetched, set_hasFetched] = useState(false);
  const [hasFetchedStateId, set_hasFetchedStateId] = useState(false);
  const [hasFetchedStateName, set_hasFetchedStateName] = useState(false);
  const [garmetList, set_garmetList] = useState([]);
  const [brandList, set_brandList] = useState([]);

  useEffect(() => {
    if (props.itemsObj) {
      if (props?.itemsObj.vendorsCustomerMap) {
        const MapList = Object.keys(props?.itemsObj?.vendorsCustomerMap).map(
          key => ({
            id: key,
            name: props?.itemsObj.vendorsCustomerMap[key],
          }),
        );
        set_filteredVendors(MapList);
        set_vendorsList(MapList);
      }
      if (props?.itemsObj.outprocesslinks) {
        const MapList = Object.keys(props?.itemsObj?.outprocesslinks).map(
          key => ({
            id: key,
            name: props?.itemsObj.outprocesslinks[key],
          }),
        );
        set_filteredProcess(MapList);
        setProcessList(MapList);
      }
      if (props?.itemsObj.outprocesslinks) {
        const MapList = Object.keys(props?.itemsObj?.outprocesslinks).map(
          key => ({
            id: key,
            name: props?.itemsObj.outprocesslinks[key],
          }),
        );
        set_filteredProcess(MapList);
        setProcessList(MapList);
      }
      if (props?.itemsObj.locationsMap) {
        const MapList = Object.keys(props?.itemsObj?.locationsMap).map(key => ({
          id: key,
          name: props?.itemsObj.locationsMap[key],
        }));
        setFilteredShipFrom(MapList);
        setFilteredReceivedAt(MapList);
        setShipFromList(MapList);
        setReceivedAtList(MapList);
      }
      //garmet type
      if (props?.itemsObj.productsMap) {
        const MapList = Object.keys(props?.itemsObj?.productsMap).map(key => ({
          id: key,
          name: props?.itemsObj.productsMap[key],
        }));
        set_garmetList(MapList);
      }
      //project  type
      if (props?.itemsObj.brandsMap) {
        const MapList = Object.keys(props?.itemsObj?.brandsMap).map(key => ({
          id: key,
          name: props?.itemsObj.brandsMap[key],
        }));
        set_brandList(MapList);
      }
      if (props.itemsObj.outprocessDetails) {
        if (props.itemsObj.outprocessDetails.vendor) {
          set_vendorId(props.itemsObj.outprocessDetails.vendor);
          set_vendorName(
            props?.itemsObj.vendorsCustomerMap[
              props.itemsObj.outprocessDetails.vendor
            ],
          );
          // console.log("vendor naem ==> ", props?.itemsObj.vendorsCustomerMap[props.itemsObj.outprocessDetails.vendor])
        }
        if (props.itemsObj.outprocessDetails.receivedLocationId) {
          setReceivedAtId(props.itemsObj.outprocessDetails.receivedLocationId);
          setReceivedAtName(
            props?.itemsObj.locationsMap[
              props.itemsObj.outprocessDetails.receivedLocationId
            ],
          );
        }
        if (props.itemsObj.outprocessDetails.companyLocationId) {
          setShipFromId(props.itemsObj.outprocessDetails.companyLocationId);
          setShipFromName(
            props?.itemsObj.locationsMap[
              props.itemsObj.outprocessDetails.companyLocationId
            ],
          );
        }
        if (props.itemsObj.outprocessDetails.processName) {
          set_processName(props.itemsObj.outprocessDetails.processName);
          // setShipFromName(props?.itemsObj.locationsMap[props.itemsObj.outprocessDetails.companyLocationId])
        }
        if (props.itemsObj.outprocessDetails.particulars) {
          const particulars = props.itemsObj.outprocessDetails.particulars;
          const childArray = particulars.map((item, index) => {
            const garmentTypeMapList = Object.keys(
              props.itemsObj.productsMap,
            ).map(key => ({
              id: key,
              name: props.itemsObj.productsMap[key],
            }));
            const brandTypeMapList = Object.keys(props.itemsObj.brandsMap).map(
              key => ({
                id: key,
                name: props.itemsObj.brandsMap[key],
              }),
            );
            let sizesArray = [];
            if (item.sizenames && item.sizeQuantities && item.sizereceviedqty) {
              sizesArray = item.sizenames.map((sizeName, idx) => ({
                sizename: sizeName,
                sizeqty: item.sizeQuantities[index],
                sizereceivedqty: item.sizereceviedqty[index],
                enteredInput: '0',
                SIZE_ID: Date.now() + idx + 1,
              }));
            }

            return {
              id: Date.now(),

              garmentTypeName:
                props.itemsObj.productsMap[item.garmentTypes.toString()],
              garmentTypeId: item.garmentTypes,
              showGarmentTypeList: false,
              filteredGarmentTypes: garmentTypeMapList || [],
              garmentTypesList: garmentTypeMapList || [],

              outprocessTypeName: item.outprocessType,
              outprocessTypeId: item.outprocessType,
              showOutprocessTypeList: false,
              filteredOutprocessTypes: [],
              outprocessTypesList: [],

              projectName: item.outprocessType,
              projectId: item.brandId,
              showProjectList: false,
              filteredProjects: brandTypeMapList || [],
              projectsList: brandTypeMapList || [],

              styleName: item.styleNoStr,
              styleId: item.styleId,
              showStyleList: false,
              filteredStyles: [],
              stylesList: [],
              childTable: sizesArray || [],
            };
          });

          console.log('child array ', childArray[0]?.childTable);
          setRows(childArray);
        }
      }
    }
  }, [props.itemsObj]);

  const [name, setName] = useState('');
    const [parallel, set_parallel] = useState(false);
    const [refNo, set_refNo] = useState('');
  
    // From Location
    const [fromLocationList, setFromLocationList] = useState([]);
    const [filteredFromLocation, setFilteredFromLocation] = useState([]);
    const [showFromLocationList, setShowFromLocationList] = useState(false);
    const [fromLocationName, setFromLocationName] = useState('');
    const [fromLocationId, setFromLocationId] = useState('');
  
    // To Location
    const [toLocationList, setToLocationList] = useState([]);
    const [filteredToLocation, setFilteredToLocation] = useState([]);
    const [showToLocationList, setShowToLocationList] = useState(false);
    const [toLocationName, setToLocationName] = useState('');
    const [toLocationId, setToLocationId] = useState('');
  
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [creationDate, setCreationDate] = useState('');
    const [challanDate, setChallanDate] = useState('');
    const [activeField, setActiveField] = useState(null);
    const [rows, setRows] = React.useState([]);
  
    const actionOnFromLocation = async item => {
      setFromLocationId(item.id);
      setFromLocationName(item.name);
      setShowFromLocationList(false);
    };
  
    const actionOnToLocation = item => {
      setToLocationId(item.id);
      setToLocationName(item.name);
      setShowToLocationList(false);
    };
  
    const handleSearchFromLocation = text => {
      if (text.trim().length > 0) {
        const filtered = fromLocationList.filter(item =>
          item.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredFromLocation(filtered);
      } else {
        setFilteredFromLocation(fromLocationList);
      }
    };
  
    const handleSearchToLocation = text => {
      if (text.trim().length > 0) {
        const filtered = toLocationList.filter(item =>
          item.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredToLocation(filtered);
      } else {
        setFilteredToLocation(toLocationList);
      }
    };
  
    // User Type State
    const [selectedRadioOption, setSelectedRadioOption] = useState('1');
  
    const radioOptions = useMemo(
      () => [
        {
          id: '1',
          label: 'Style',
          value: 'style',
          selected: selectedRadioOption === 'style',
          labelStyle: {color: '#000'},
        },
        {
          id: '2',
          label: 'Buyer PO',
          value: 'BuyerPO',
          selected: selectedRadioOption === 'BuyerPO',
          labelStyle: {color: '#000'},
        },
      ],
      [selectedRadioOption],
    );
  
    const handleRadioOptionChange = selectedId => {
      const selectedOption = radioOptions.find(
        button => button.id === selectedId,
      );
      setSelectedRadioOption(selectedOption.id);
    };
  
    const handleConfirm = date => {
      const extractedDate = date.toISOString().split('T')[0];
      const formattedDate = formatDateIntoDMY(extractedDate);
  
      if (activeField === 'deliveryDate') {
        setDeliveryDate(formattedDate);
      } else if (activeField === 'creationDate') {
        setCreationDate(formattedDate);
      } else if (activeField === 'challanDate') {
        setChallanDate(formattedDate);
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
  
    const addRow = () => {
      setRows([
        ...rows,
        {
          id: Date.now(),
  
          fabricOrRmTypeName: '',
          fabricOrRmTypeId: '',
          showfabricOrRmTypeList: false,
          filteredfabricOrRmTypes: [],
          fabricOrRmTypesList: [],
  
          fabricOrRmName: '',
          fabricOrRmNameId: '',
          showOfabricOrRmNameList: false,
          filteredfabricOrRmNames: [],
          fabricOrRmNamesList: [],
  
          childTable: [],
        },
      ]);
    };
  
    const actionOnfabricOrRmTypes = (item, rowId) => {
      setRows(
        rows.map(r =>
          r.id === rowId
            ? {
                ...r,
                fabricOrRmTypeName: item.name,
                fabricOrRmTypeId: item.id,
                showfabricOrRmTypeList: false,
              }
            : r,
        ),
      );
    };
  
    const actionOnfabricOrRmName = (item, rowId) => {
      setRows(
        rows.map(r =>
          r.id === rowId
            ? {
                ...r,
                fabricOrRmName: item.name,
                fabricOrRmNameId: item.id,
                showOfabricOrRmNameList: false,
              }
            : r,
        ),
      );
    };
  
    const handleSearchfabricOrRmType = (text, rowId) => {
      setRows(
        rows.map(r =>
          r.id === rowId
            ? {
                ...r,
                filteredfabricOrRmTypes: fabricOrRmTypesList.filter(item =>
                  item.name.toLowerCase().includes(text.toLowerCase()),
                ),
              }
            : r,
        ),
      );
    };
    const handleSearchfabricOrRmName = (text, rowId) => {
      setRows(
        rows.map(r =>
          r.id === rowId
            ? {
                ...r,
                filteredfabricOrRmNames: fabricOrRmNamesList.filter(item =>
                  item.name.toLowerCase().includes(text.toLowerCase()),
                ),
              }
            : r,
        ),
      );
    };
  
    const RemoveRow = id => {
      console.log('ROW ID ===> ', id);
      const filtered = rows.filter(item => item.id !== id);
      setRows(filtered);
    };


   const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    const tempObj = {};
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
          title={'New Out InProcessEdit UI'}
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
            marginTop: hp('2%'),
          }}>
          <View style={{marginBottom: 20}}>
            <RadioGroup
              containerStyle={{
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
              radioButtons={radioOptions}
              onPress={handleRadioOptionChange}
              layout="row"
              selectedId={
                radioOptions.find(item => item.id === selectedRadioOption)?.id
              }
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
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowFromLocationList(!showFromLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        fromLocationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'From Location *'}
                    </Text>
                    {fromLocationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {fromLocationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showFromLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchFromLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredFromLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredFromLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnFromLocation(item)}>
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
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                setShowToLocationList(!showToLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        toLocationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'To Location *'}
                    </Text>
                    {toLocationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {toLocationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showToLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchToLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredToLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredToLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnToLocation(item)}>
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
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Delivery Date"
                value={deliveryDate}
                placeholder=""
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('deliveryDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Creation Date"
                value={creationDate}
                placeholder=""
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('creationDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Challan Date Issued By Worker *"
                value={challanDate}
                placeholder=""
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('challanDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View
            style={{
              width: '90%',
              marginTop: 20,
              marginBottom: 30,
              marginHorizontal: 15,
            }}>
            <TouchableOpacity
              onPress={addRow}
              style={{
                backgroundColor: colors.color2,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled={true} horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>
                      *Fabric/RM Type
                    </Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>
                      *Fabric/RM Name
                    </Text>
                  </View>
                  {/* <View style={{width: 200}}>
                          <Text style={styles.table_head_captions}>
                            Project/Brand
                          </Text>
                        </View>
                        <View style={{width: 200}}>
                          <Text style={styles.table_head_captions}>*Style</Text>
                        </View> */}
                </View>

                {rows.map(row => (
                  <View key={row.id}>
                    <View style={styles.table_body_single_row}>
                      <View style={{width: 60}}>
                        <TouchableOpacity
                          style={{alignItems: '', justifyContent: ''}}
                          onPress={() => RemoveRow(row.id)}>
                          <Image source={closeImg} style={styles.imageStyle1} />
                        </TouchableOpacity>
                      </View>

                      <View style={{width: 200}}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: hp('1%'),
                            backgroundColor: '#ffffff',
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              borderWidth: 0.5,
                              borderColor: '#D8D8D8',
                              borderRadius: hp('0.5%'),
                              width: '100%',
                              overflow: 'hidden',
                            }}
                            onPress={() => {
                              setRows(
                                rows.map(r =>
                                  r.id === row.id
                                    ? {
                                        ...r,
                                        showfabricOrRmTypeList:
                                          !r.showfabricOrRmTypeList,
                                        filteredfabricOrRmTypes:
                                          r.fabricOrRmTypeList,
                                      }
                                    : {
                                        ...r,
                                        showfabricOrRmTypeList: false,
                                        filteredfabricOrRmTypes:
                                          r.fabricOrRmTypeList,
                                      },
                                ),
                              );
                            }}>
                            <View style={[styles.SectionStyle1]}>
                              <View style={{flexDirection: 'column'}}>
                                <Text
                                  style={
                                    row.fabricOrRmTypeId
                                      ? styles.dropTextLightStyle
                                      : styles.dropTextInputStyle
                                  }>
                                  {'*Fabric/RM Type'}
                                </Text>
                                <Text
                                  style={
                                    row.fabricOrRmTypeId
                                      ? styles.dropTextInputStyle
                                      : styles.dropTextLightStyle
                                  }>
                                  {row.fabricOrRmTypeId
                                    ? row.fabricOrRmTypeName
                                    : 'Select '}
                                </Text>
                              </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                              <Image
                                source={downArrowImg}
                                style={styles.imageStyle}
                              />
                            </View>
                          </TouchableOpacity>
                          {row.showfabricOrRmTypeList && (
                            <View style={styles.dropdownContent1}>
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                onChangeText={text =>
                                  handleSearchfabricOrRmType(text, row.id)
                                }
                                placeholderTextColor="#000"
                              />
                              <ScrollView nestedScrollEnabled={true}>
                                {row.filteredfabricOrRmTypes.length === 0 ? (
                                  <Text style={styles.noCategoriesText}>
                                    Sorry, no results found!
                                  </Text>
                                ) : (
                                  row.filteredfabricOrRmTypes.map(item => (
                                    <TouchableOpacity
                                      key={item?.id}
                                      onPress={() =>
                                        actionOnfabricOrRmTypes(item, row.id)
                                      }>
                                      <View style={styles.dropdownOption}>
                                        <Text style={{color: '#000'}}>
                                          {item?.name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={{width: 5}}></View>
                      <View style={{width: 200}}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: hp('1%'),
                            backgroundColor: '#ffffff',
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              borderWidth: 0.5,
                              borderColor: '#D8D8D8',
                              borderRadius: hp('0.5%'),
                              width: '100%',
                              overflow: 'hidden',
                            }}
                            onPress={() => {
                              setRows(
                                rows.map(r =>
                                  r.id === row.id
                                    ? {
                                        ...r,
                                        showfabricOrRmNameList:
                                          !r.showfabricOrRmNameList,
                                      }
                                    : {...r, showfabricOrRmNameList: false},
                                ),
                              );
                            }}>
                            <View style={[styles.SectionStyle1]}>
                              <View style={{flexDirection: 'column'}}>
                                <Text
                                  style={
                                    row.fabricOrRmNameId
                                      ? styles.dropTextLightStyle
                                      : styles.dropTextInputStyle
                                  }>
                                  {'*Fabric/RM Name '}
                                </Text>
                                <Text
                                  style={
                                    row.fabricOrRmNameId
                                      ? styles.dropTextInputStyle
                                      : styles.dropTextLightStyle
                                  }>
                                  {row.fabricOrRmNameId
                                    ? row.fabricOrRmName
                                    : 'Select '}
                                </Text>
                              </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                              <Image
                                source={downArrowImg}
                                style={{
                                  height: 20,
                                  width: 20,
                                  tintColor: 'red',
                                  aspectRatio: 1,
                                  marginRight: 20,
                                  resizeMode: 'contain',
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                          {row.showfabricOrRmNameList && (
                            <View style={styles.dropdownContent1}>
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search "
                                onChangeText={text =>
                                  handleSearchfabricOrRmName(text, row.id)
                                }
                                placeholderTextColor="#000"
                              />
                              <ScrollView nestedScrollEnabled={true}>
                                {row.filteredfabricOrRmNames.length === 0 ? (
                                  <Text style={styles.noCategoriesText}>
                                    Sorry, no results found!
                                  </Text>
                                ) : (
                                  row.filteredfabricOrRmNames.map(item => (
                                    <TouchableOpacity
                                      key={item?.id}
                                      onPress={() =>
                                        actionOnfabricOrRmName(item, row.id)
                                      }>
                                      <View style={styles.dropdownOption}>
                                        <Text style={{color: '#000'}}>
                                          {item?.name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* <View style={{width: 5}}></View>
                          <View style={{width: 200}}>
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: hp('1%'),
                                backgroundColor: '#ffffff',
                              }}>
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  borderWidth: 0.5,
                                  borderColor: '#D8D8D8',
                                  borderRadius: hp('0.5%'),
                                  width: '100%',
                                  overflow: 'hidden',
                                }}
                                onPress={() => {
                                  setRows(
                                    rows.map(r =>
                                      r.id === row.id
                                        ? {
                                            ...r,
                                            showProjectList: !r.showProjectList,
                                            filteredProjects: r.projectsList,
                                          }
                                        : {
                                            ...r,
                                            showProjectList: false,
                                            filteredProjects: r.projectsList,
                                          },
                                    ),
                                  );
                                }}>
                                <View style={[styles.SectionStyle1]}>
                                  <View style={{flexDirection: 'column'}}>
                                    <Text
                                      style={
                                        row.projectId
                                          ? styles.dropTextLightStyle
                                          : styles.dropTextInputStyle
                                      }>
                                      {'Project/Brand'}
                                    </Text>
                                    <Text
                                      style={
                                        row.projectId
                                          ? styles.dropTextInputStyle
                                          : styles.dropTextLightStyle
                                      }>
                                      {row.projectId ? row.projectName : 'Select '}
                                    </Text>
                                  </View>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                  <Image
                                    source={downArrowImg}
                                    style={{
                                      height: 20,
                                      width: 20,
                                      tintColor: 'red',
                                      aspectRatio: 1,
                                      marginRight: 20,
                                      resizeMode: 'contain',
                                    }}
                                  />
                                </View>
                              </TouchableOpacity>
                              {row.showProjectList && (
                                <View style={styles.dropdownContent1}>
                                  <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search "
                                    onChangeText={text =>
                                      handleSearchProject(text, row.id)
                                    }
                                    placeholderTextColor="#000"
                                  />
                                  <ScrollView nestedScrollEnabled={true}>
                                    {row.filteredProjects.length === 0 ? (
                                      <Text style={styles.noCategoriesText}>
                                        Sorry, no results found!
                                      </Text>
                                    ) : (
                                      row.filteredProjects.map(item => (
                                        <TouchableOpacity
                                          key={item?.id}
                                          onPress={() =>
                                            actionOnProjects(item, row.id)
                                          }>
                                          <View style={styles.dropdownOption}>
                                            <Text style={{color: '#000'}}>
                                              {item?.name}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      ))
                                    )}
                                  </ScrollView>
                                </View>
                              )}
                            </View>
                          </View>
      
                          <View style={{width: 5}}></View>
                          <View style={{width: 200}}>
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: hp('1%'),
                                backgroundColor: '#ffffff',
                              }}>
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  borderWidth: 0.5,
                                  borderColor: '#D8D8D8',
                                  borderRadius: hp('0.5%'),
                                  width: '100%',
                                  overflow: 'hidden',
                                }}
                                onPress={() => {
                                  setRows(
                                    rows.map(r =>
                                      r.id === row.id
                                        ? {
                                            ...r,
                                            showStyleList: !r.showStyleList,
                                          }
                                        : {...r, showStyleList: false},
                                    ),
                                  );
                                }}>
                                <View style={[styles.SectionStyle1]}>
                                  <View style={{flexDirection: 'column'}}>
                                    <Text
                                      style={
                                        row.styleId
                                          ? styles.dropTextLightStyle
                                          : styles.dropTextInputStyle
                                      }>
                                      {'*Style'}
                                    </Text>
                                    <Text
                                      style={
                                        row.styleId
                                          ? styles.dropTextInputStyle
                                          : styles.dropTextLightStyle
                                      }>
                                      {row.styleId ? row.styleName : 'Select '}
                                    </Text>
                                  </View>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                  <Image
                                    source={downArrowImg}
                                    style={{
                                      height: 20,
                                      width: 20,
                                      tintColor: 'red',
                                      aspectRatio: 1,
                                      marginRight: 20,
                                      resizeMode: 'contain',
                                    }}
                                  />
                                </View>
                              </TouchableOpacity>
                              {row.showStyleList && (
                                <View style={styles.dropdownContent1}>
                                  <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search "
                                    onChangeText={text =>
                                      handleSearchStyle(text, row.id)
                                    }
                                    placeholderTextColor="#000"
                                  />
                                  <ScrollView nestedScrollEnabled={true}>
                                    {row.filteredStyles.length === 0 ? (
                                      <Text style={styles.noCategoriesText}>
                                        Sorry, no results found!
                                      </Text>
                                    ) : (
                                      row.filteredStyles.map(item => (
                                        <TouchableOpacity
                                          key={item?.id}
                                          onPress={() =>
                                            actionOnStyles(item, row.id)
                                          }>
                                          <View style={styles.dropdownOption}>
                                            <Text style={{color: '#000'}}>
                                              {item?.name}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      ))
                                    )}
                                  </ScrollView>
                                </View>
                              )}
                            </View>
                          </View> */}
                    </View>
                    {/* {row?.childTable?.length > 0 && ( */}

                    {/* {row?.childTable?.map((item, index) => ( */}
                    <View style={styles.wrapper}>
                      <View style={styles.table}>
                        {/* Table Head */}
                        <View style={styles.table_head}>
                          <View style={{width: '30%'}}>
                            <Text style={styles.table_head_captions}>
                              Fabric
                            </Text>
                          </View>
                          <View style={{width: '15%'}}>
                            <Text style={styles.table_head_captions}>
                              Input Fabric Qty
                            </Text>
                          </View>
                          <View style={{width: '25%'}}>
                            <Text style={styles.table_head_captions}>
                              Approved Fabric
                            </Text>
                          </View>
                          <View style={{width: '25%'}}>
                            <Text style={styles.table_head_captions}>
                              UOM Fabric
                            </Text>
                          </View>
                        </View>

                        <View style={styles.table_body_single_row}>
                          <View style={{width: '30%'}}>
                            <Text style={styles.table_data}>
                              {'data?.fabric'}
                            </Text>
                          </View>
                          <View style={{width: '15%'}}>
                            <Text style={styles.table_data}>
                              {'data?.fabricqty'}
                            </Text>
                          </View>
                          <View style={{width: '25%'}}>
                            <TextInput
                              value={'imp'}
                              mode="outlined"
                              style={styles.input}
                              onChangeText={text => set_table_ip(text)}
                            />
                          </View>
                          <View style={{width: '25%'}}>
                            <Text style={styles.table_data}>
                              {'data?.uomfabric'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* ))} */}
                    {/* )} */}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Submit'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          leftButtonAction={() => backBtnAction()}
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

export default DeliveryChallanEditUI;

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
      width: '100%',
    },
    table: {
      backgroundColor: '#fff',
      elevation: 1,
      borderRadius: 5,
      overflow: 'hidden',
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      backgroundColor: colors.color2,
      alignItems: 'center',
      paddingVertical: 10,
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
      height: 220,
      maxHeight: 220,
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
    checkBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 15,
    },
    checkBoxText: {
      padding: 5,
      color: '#000',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
    table_data_input1: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 5,
      textAlign: 'center',
      flexDirection: 'row',
    },
  });
