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
import * as Constant from './../../utils/constants/constant';
import CommonStyles from './../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from './../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TextInput} from 'react-native-paper';
import {RadioGroup} from 'react-native-radio-buttons-group';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
import {ColorContext} from '../colorTheme/colorTheme';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');
const CreateNewOutInProcessUI = ({route, navigation, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    if (props?.itemsObj) {
      // console.log('props from api   =====>  ', props?.itemsObj);
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
    }
  }, [props.itemsObj]);

  const [name, setName] = useState('');
  const [parallel, set_parallel] = useState(false);
  const [refNo, set_refNo] = useState('');

  const [garmetList, set_garmetList] = useState([]);
  const [brandList, set_brandList] = useState([]);

  const [shipFromList, setShipFromList] = useState([]);
  const [filteredShipFrom, setFilteredShipFrom] = useState([]);
  const [showShipFromList, setShowShipFromList] = useState(false);
  const [shipFromName, setShipFromName] = useState('');
  const [shipFromId, setShipFromId] = useState('');

  const [receivedAtList, setReceivedAtList] = useState([]);
  const [filteredReceivedAt, setFilteredReceivedAt] = useState([]);
  const [showReceivedAtList, setShowReceivedAtList] = useState(false);
  const [receivedAtName, setReceivedAtName] = useState('');
  const [receivedAtId, setReceivedAtId] = useState('');

  const [vendorsList, set_vendorsList] = useState([]);
  const [filteredVendors, set_filteredVendors] = useState([]);
  const [showVendorList, set_showVendorList] = useState(false);
  const [vendorId, set_vendorId] = useState(0);
  const [vendorName, set_vendorName] = useState('');

  const [processList, setProcessList] = useState([]);
  const [filteredProcess, set_filteredProcess] = useState([]);
  const [showProcessList, set_showProcessList] = useState(false);
  const [processName, set_processName] = useState('');
  const [processId, set_processId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [rows, setRows] = React.useState([]);

  const actionOnShipFrom = item => {
    setShipFromId(item.id);
    setShipFromName(item.name);
    setShowShipFromList(false);
  };

  const actionOnReceivedAt = item => {
    setReceivedAtId(item.id);
    setReceivedAtName(item.name);
    setShowReceivedAtList(false);
  };

  const actionOnVendors = item => {
    set_vendorId(item.id);
    set_vendorName(item.name);
    set_showVendorList(false);
  };

  const actionOnProcess = item => {
    set_processId(item.id);
    set_processName(item.name);
    set_showProcessList(false);
  };

  const handleSearchShipFrom = text => {
    if (text.trim().length > 0) {
      const filtered = shipFromList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredShipFrom(filtered);
    } else {
      setFilteredShipFrom(shipFromList);
    }
  };

  const handleSearchReceivedAt = text => {
    if (text.trim().length > 0) {
      const filtered = receivedAtList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredReceivedAt(filtered);
    } else {
      setFilteredReceivedAt(receivedAtList);
    }
  };

  const handleSearchVendor = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(vendorsList).filter(id =>
        vendorsList[id].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredVendors(filtered);
    } else {
      set_filteredVendors(Object.keys(vendorsList));
    }
  };

  const handleSearchProcess = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockProcesses.filter(process =>
        process.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredProcess(filtered);
    } else {
      set_filteredProcess(props.lists.getStockProcesses);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    const tempObj = {
      vendorcontractor: 1,
      user_type: productionType,
      type_code: type,
      group_code: group,
      vendor_code: '',
      terms_id: '',
      priceId: '',
      vendor_name: name,
      address1: address1,
      address2: address2,
      address3: address3,
      city: city,
      pin_code: zipPostalCode,
      mobile: phone,
      panno: '',
      gst: gst,
      whatsapp: whatsappPhone,
      state: stateId === 'ADD_NEW_STATE' ? '0' : stateId,
      country: countryId === 'ADD_NEW_COUNTRY' ? '0' : countryId,
      tax_type: '0',
      invfrm: '0',
      ship_mode: '0',
      region: '0',
      payment_priority: '',
      currency: currencyId,
      addnewstate: newState,
      addnewcountry: newCountry,
      location: locationName,
    };
    props.submitAction(tempObj);
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  // User Type State
  const [productionType, setProductionType] = useState('2');
  const productionTypeRadios = useMemo(
    () => [
      {
        id: '1',
        label: 'In House',
        value: 'inhose',
        selected: productionType === 'inhose',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Outward',
        value: 'outward',
        selected: productionType === 'outward',
        labelStyle: {color: '#000'},
      },
      {
        id: '3',
        label: 'In house(Contractor)',
        value: 'inhouse_contractor',
        selected: productionType === 'inhouse_contractor',
        labelStyle: {color: '#000'},
      },
    ],
    [productionType],
  );

  const handleproductionTypeChange = selectedId => {
    const selectedOption = productionTypeRadios.find(
      button => button.id === selectedId,
    );
    setProductionType(selectedOption.id);
  };

  // Group State
  const [group, setGroup] = useState('1');
  const groupRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Apparel',
        value: 'Apparel',
        selected: group === 'Apparel',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Non-Apparel',
        value: 'Non-Apparel',
        selected: group === 'Non-Apparel',
        labelStyle: {color: '#000'},
      },
    ],
    [group],
  );

  const handleGroupChange = selectedId => {
    const selectedOption = groupRadioButtons.find(
      button => button.id === selectedId,
    );
    setGroup(selectedOption.id);
  };

  // Type State
  const [type, setType] = useState('1');
  const typeRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Overseas',
        value: 'Overseas',
        selected: type === 'Overseas',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Domestic',
        value: 'Domestic',
        selected: type === 'Domestic',
        labelStyle: {color: '#000'},
      },
    ],
    [type],
  );

  const handleTypeChange = selectedId => {
    const selectedOption = typeRadioButtons.find(
      button => button.id === selectedId,
    );
    setType(selectedOption.id);
  };

  const handleConfirm = date => {
    const extractedDate = date.toISOString().split('T')[0];
    const formattedDate = formatDateIntoDMY(extractedDate);

    if (activeField === 'deliveryDate') {
      setDeliveryDate(formattedDate);
    } else if (activeField === 'creationDate') {
      setCreationDate(formattedDate);
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

        garmentTypeName: '',
        garmentTypeId: '',
        showGarmentTypeList: false,
        filteredGarmentTypes: garmetList || [],
        garmentTypesList: garmetList || [],

        outprocessTypeName: '',
        outprocessTypeId: '',
        showOutprocessTypeList: false,
        filteredOutprocessTypes: [],
        outprocessTypesList: [],

        projectName: '',
        projectId: '',
        showProjectList: false,
        filteredProjects: brandList || [],
        projectsList: brandList || [],

        styleName: '',
        styleId: '',
        showStyleList: false,
        filteredStyles: [],
        stylesList: [],
      },
    ]);
  };

  const handleSearchGarmetType = (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredGarmentTypes: garmetList.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : r,
      ),
    );
  };
  const actionOnGarmetTypes = (item, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              garmentTypeName: item.name,
              garmentTypeId: item.id,
              showGarmentTypeList: false,
            }
          : r,
      ),
    );
  };
  const actionOnProjects = (item, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              projectName: item.name,
              projectId: item.id,
              showProjectList: false,
            }
          : r,
      ),
    );
  };
  const actionOnOutProcessType = (item, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              outprocessTypeName: item.name,
              outprocessTypeId: item.id,
              showOutprocessTypeList: false,
            }
          : r,
      ),
    );
  };
  const actionOnStyles = (item, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              styleName: item.name,
              styleId: item.id,
              showStyleList: false,
            }
          : r,
      ),
    );
  };


  const handleSearchOutprocessType = (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredOutprocessTypes: props.lists.getStockTypes.filter(
                stockType =>
                  stockType.name.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : r,
      ),
    );
  };
  const handleSearchProject = (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredProjects: brandList.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : r,
      ),
    );
  };
  const handleSearchStyle = (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredStyles: props.lists.getStockTypes.filter(stockType =>
                stockType.name.toLowerCase().includes(text.toLowerCase()),
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

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Create New Out In Process'}
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
              radioButtons={productionTypeRadios}
              onPress={handleproductionTypeChange}
              layout="row"
              selectedId={
                productionTypeRadios.find(item => item.id === productionType)
                  ?.id
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
                set_showProcessList(!showProcessList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        processId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Process *'}
                    </Text>
                    {processId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {processName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showProcessList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcess}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredProcess.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredProcess.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnProcess(item)}>
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
                set_showVendorList(!showVendorList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        vendorId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Vendor *'}
                    </Text>
                    {vendorId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {vendorName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showVendorList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchVendor}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredVendors.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredVendors.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnVendors(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.checkBoxContainer}>
            <CustomCheckBox
              isChecked={false}
              onToggle={() => console.log('hi')}
            />
            <Text style={styles.checkBoxText}>
              Parallel Flow For Next Process
            </Text>
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

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Ref No "
              value={refNo}
              mode="outlined"
              onChangeText={text => set_refNo(text)}
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
                setShowShipFromList(!showShipFromList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shipFromId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Ship from '}
                    </Text>
                    {shipFromId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shipFromName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShipFromList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShipFrom}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShipFrom.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShipFrom.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShipFrom(item)}>
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
                setShowReceivedAtList(!showReceivedAtList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        receivedAtId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Received At'}
                    </Text>
                    {receivedAtId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {receivedAtName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showReceivedAtList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchReceivedAt}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredReceivedAt.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredReceivedAt.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnReceivedAt(item)}>
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
                {/* Table Head */}
                <View style={styles.table_head}>
                  <View style={{width: 60}}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>
                      *Types Of Garments
                    </Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>
                      *Outprocess Type
                    </Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>
                      Project/Brand
                    </Text>
                  </View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>*Style</Text>
                  </View>
                </View>

                {rows.map(row => (
                  <View key={row.id} style={styles.table_body_single_row}>
                    <View style={{width: 60}}>
                      <TouchableOpacity
                        style={{alignItems: '', justifyContent: ''}}
                        onPress={() => RemoveRow(row.id)}>
                        <Image source={closeImg} style={styles.imageStyle1} />
                      </TouchableOpacity>
                    </View>

                    {/* Types Of Garments Dropdown */}
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
                                      showGarmentTypeList:
                                        !r.showGarmentTypeList,
                                      filteredGarmentTypes: r.garmentTypesList,
                                    }
                                  : {
                                      ...r,
                                      showGarmentTypeList: false,
                                      filteredGarmentTypes: r.garmentTypesList,
                                    },
                              ),
                            );
                          }}>
                          <View style={[styles.SectionStyle1]}>
                            <View style={{flexDirection: 'column'}}>
                              <Text
                                style={
                                  row.garmentTypeId
                                    ? styles.dropTextLightStyle
                                    : styles.dropTextInputStyle
                                }>
                                {'*Types Of Garments '}
                              </Text>
                              <Text
                                style={
                                  row.garmentTypeId
                                    ? styles.dropTextInputStyle
                                    : styles.dropTextLightStyle
                                }>
                                {row.garmentTypeId
                                  ? row.garmentTypeName
                                  : 'Select garmets'}
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
                        {row.showGarmentTypeList && (
                          <View style={styles.dropdownContent1}>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search"
                              onChangeText={text =>
                                handleSearchGarmetType(text, row.id)
                              }
                              placeholderTextColor="#000"
                            />
                            <ScrollView nestedScrollEnabled={true}>
                              {row.filteredGarmentTypes.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                  Sorry, no results found!
                                </Text>
                              ) : (
                                row.filteredGarmentTypes.map(item => (
                                  <TouchableOpacity
                                    key={item?.id}
                                    onPress={() =>
                                      actionOnGarmetTypes(item, row.id)
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
                    {/* Outprocess Type */}
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
                                      showOutprocessTypeList:
                                        !r.showOutprocessTypeList,
                                    }
                                  : {...r, showOutprocessTypeList: false},
                              ),
                            );
                          }}>
                          <View style={[styles.SectionStyle1]}>
                            <View style={{flexDirection: 'column'}}>
                              <Text
                                style={
                                  row.outprocessTypeId
                                    ? styles.dropTextLightStyle
                                    : styles.dropTextInputStyle
                                }>
                                {'*Outprocess Type '}
                              </Text>
                              <Text
                                style={
                                  row.outprocessTypeId
                                    ? styles.dropTextInputStyle
                                    : styles.dropTextLightStyle
                                }>
                                {row.outprocessTypeId
                                  ? row.outprocessTypeName
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
                        {row.showOutprocessTypeList && (
                          <View style={styles.dropdownContent1}>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search "
                              onChangeText={text =>
                                handleSearchOutprocessType(text, row.id)
                              }
                              placeholderTextColor="#000"
                            />
                            <ScrollView nestedScrollEnabled={true}>
                              {row.filteredOutprocessTypes.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                  Sorry, no results found!
                                </Text>
                              ) : (
                                row.filteredOutprocessTypes.map(item => (
                                  <TouchableOpacity
                                    key={item?.id}
                                    onPress={() =>
                                      actionOnOutProcessType(item, row.id)
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
                    {/* Project/Brand */}
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
                    {/* style */}
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
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
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

export default CreateNewOutInProcessUI;

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
  });
