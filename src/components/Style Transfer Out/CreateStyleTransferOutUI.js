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
  Modal,
  TouchableWithoutFeedback,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

  const CreateStyleTransferOutUI = ({route, navigation, ...props}) => {
    const [masterBoxName, setMasterBoxName] = useState('');
    const [rows, setRows] = useState([]);
    const [buyerName, setbuyerName] = React.useState('');
    const [barcode, setBarcode] = React.useState('');
    const [lastestBoxId, setLastestBoxId] = React.useState(0);
    const [lastestBuyerPoId, setLastestBuyerPoId] = React.useState(0);
    const [lastestBoxList, setLastestBoxList] = React.useState('');
  
    const [inHouse, setInHouse] = useState('Yes');
    const [customer, setCustomer] = useState('No');
  
    const [singleColor, setSingleColor] = useState('Yes');
    const [multiColor, setMultiColor] = useState('No');
    const [customerStyle, setCustomerStyle] = useState('No');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState('');
  
    const {colors} = useContext(ColorContext);
  
    const styles = getStyles(colors);
  
    const backBtnAction = () => {
      props.backBtnAction();
    };
  
    const popOkBtnAction = () => {
      props.popOkBtnAction();
    };
  
    useEffect(() => {
      if (props.lists) {
        if (props.lists.buyerMap) {
          const buyerMapList = Object.keys(props.lists.buyerMap).map(key => ({
            id: key,
            name: props.lists.buyerMap[key],
          }));
          setFilteredBuyerPo(buyerMapList);
          setBuyerPoList(buyerMapList);
        }
        if (props.lists.boxid) {
          const boxidList = Object.keys(props.lists.boxid).map(key => ({
            id: key,
            name: props.lists.boxid[key],
          }));
          setLastestBoxList(boxidList);
          setRows([
            ...rows,
            {
              id: Date.now(),
              BoxName: '',
              BoxId: '',
              showBoxList: false,
              BoxList: boxidList || [],
              filteredBoxList: boxidList || [],
              CustomerStyleName: '',
              size: '',
              Qty: '',
              childTable: [],
              PbuyerPoID: '',
            },
          ]);
        }
      }
    }, [props.lists]);
  
    useEffect(() => {
      if (props.quality) {
        console.log('quality ====> ', props.quality);
  
        if (props?.quality?.selectedSizeCodesJson) {
          let parsedData = JSON.parse(props?.quality?.selectedSizeCodesJson);
  
          let updatedData = parsedData.map(item => ({
            ...item,
            checked: false,
          }));
  
          setRows(prevRows =>
            prevRows.map(row =>
              row.BoxId === lastestBoxId
                ? {
                    ...row,
                    size: props.quality.size,
                    Qty: props.quality.qty,
                    CustomerStyleName: props.quality.style,
                    childTable: updatedData,
                    PbuyerPoID: lastestBuyerPoId,
                  }
                : row,
            ),
          );
        }
      }
    }, [props.quality]);
  
    const backAction = async () => {
      props.backBtnAction();
    };
  
    const submitAction = async () => {
      const mappedRows = rows.flatMap(row => {
        const barcodeString = row.childTable?.length
          ? Array(row.childTable.length).fill(row.barcode).join(',')
          : '';
  
        return (
          row.childTable?.map(child => ({
            masterboxId: row.BoxId,
            barcode: barcodeString,
            boxId: child.SIZE_VAL,
            m_buyerpo_id: row.PbuyerPoID,
          })) || []
        );
      });
  
      const tempObj = {
        boxId: 0,
        masterBox: masterBoxName,
        buyerpoId: buyerPoId,
        particulars: mappedRows || [],
      };
  
      // console.log('temp obj ===> ', tempObj);
      props.submitAction(tempObj);
    };
  
    const handleRemoveRow = id => {
      console.log('ROW ID ===> ', id);
      const filtered = rows.filter(item => item.id !== id);
      setRows(filtered);
    };
  
    const handleSearchboxName = async (text, rowId) => {
      setRows(
        rows.map(r =>
          r.id === rowId
            ? {
                ...r,
                filteredBoxList: r.BoxList?.filter(item =>
                  item.name.toLowerCase().includes(text.toLowerCase()),
                ),
              }
            : r,
        ),
      );
    };
  
    const actionOnboxName = async (item, rowId) => {
      setRows(
        rows.map(row =>
          row.id === rowId
            ? {
                ...row,
                BoxName: item?.name,
                BoxId: item?.id,
                showBoxList: false,
              }
            : row,
        ),
      );
      setLastestBoxId(item.id);
  
      const tempObj = {
        sId: item.id,
        bId: buyerPoId,
      };
      await props.getData(tempObj, 1);
    };
    const actionOnCheckBox = async (rowId, idx) => {
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === rowId
            ? {
                ...row,
                childTable: row.childTable.map((item, index) =>
                  index === idx ? {...item, checked: !item.checked} : item,
                ),
              }
            : row,
        ),
      );
    };
  
    const addRow = () => {
      setRows([
        ...rows,
        {
          id: Date.now(),
          BoxName: '',
          BoxId: '',
          showBoxList: false,
          BoxList: lastestBoxList || [],
          filteredBoxList: lastestBoxList || [],
          CustomerStyleName: '',
          size: '',
          Qty: '',
          childTable: [{SIZE_VAL:205, SIZE_SIZE_ID:1},{SIZE_VAL:205, SIZE_SIZE_ID:2},{SIZE_VAL:205, SIZE_SIZE_ID:3}],
          PbuyerPoID: lastestBuyerPoId || '',
          showColorList: false,
          colorList: [],
          filteredColor: [],
          selectedIndices: [],
        },
      ]);
    };
  
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
  
    // To Customer
    const [toCustomerList, setToCustomerList] = useState([]);
    const [filteredToCustomer, setFilteredToCustomer] = useState([]);
    const [showToCustomerList, setShowToCustomerList] = useState(false);
    const [toCustomerName, setToCustomerName] = useState('');
    const [toCustomerId, setToCustomerId] = useState('');
  
    const actionOnFromLocation = item => {
      setFromLocationId(item.id);
      setFromLocationName(item.name);
      setShowFromLocationList(false);
    };
  
    const actionOnToLocation = item => {
      setToLocationId(item.id);
      setToLocationName(item.name);
      setShowToLocationList(false);
    };
  
    const actionOnToCustomer = item => {
      setToCustomerId(item.id);
      setToCustomerName(item.name);
      setShowToCustomerList(false);
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
  
    const handleSearchToCustomer = text => {
      if (text.trim().length > 0) {
        const filtered = toCustomerList.filter(item =>
          item.name.toLowerCase().includes(text.toLowerCase()),
        );
        setFilteredToCustomer(filtered);
      } else {
        setFilteredToCustomer(toCustomerList);
      }
    };
  
    const inHouseRadioButtons = useMemo(
      () => [
        {
          id: '1',
          label: 'In House',
          value: 'In House',
          selected: inHouse === 'Yes',
          labelStyle: {color: '#000'},
        },
        {
          id: '2',
          label: 'Customer',
          value: 'Customer',
          selected: customer === 'Yes',
          labelStyle: {color: '#000'},
        },
      ],
      [inHouse, customer],
    );
  
    const colorStyleRadioButtons = useMemo(
      () => [
        {
          id: '1',
          label: 'Single Color',
          value: 'Single Color',
          selected: singleColor === 'Yes',
          labelStyle: {color: '#000'},
        },
        {
          id: '2',
          label: 'Multi Color',
          value: 'Multi Color',
          selected: multiColor === 'Yes',
          labelStyle: {color: '#000'},
        },
        {
          id: '3',
          label: 'Customer ',
          value: 'Customer Style',
          selected: customerStyle === 'Yes',
          labelStyle: {color: '#000'},
        },
      ],
      [singleColor, multiColor, customerStyle],
    );
  
    const handleInHouseChange = selectedId => {
      const selectedOption = inHouseRadioButtons.find(
        button => button.id === selectedId,
      );
      if (selectedOption.value === 'In House') {
        setInHouse('Yes');
        setCustomer('No');
      } else {
        setInHouse('No');
        setCustomer('Yes');
      }
    };
  
    const handleColorStyleChange = selectedId => {
      const selectedOption = colorStyleRadioButtons.find(
        button => button.id === selectedId,
      );
      if (selectedOption.value === 'Single Color') {
        setSingleColor('Yes');
        setMultiColor('No');
        setCustomerStyle('No');
      } else if (selectedOption.value === 'Multi Color') {
        setSingleColor('No');
        setMultiColor('Yes');
        setCustomerStyle('No');
      } else if (selectedOption.value === 'Customer Style') {
        setSingleColor('No');
        setMultiColor('No');
        setCustomerStyle('Yes');
      }
    };
  
    const handleConfirm = d => {
      const formattedDate = d.toISOString().split('T')[0];
      setDate(formattedDate);
      hideDatePicker();
    };
  
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const actionOnColor = (colorId, rowId) => {
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === rowId
            ? {
                ...row,
                selectedIndices: row.selectedIndices.includes(colorId)
                  ? row.selectedIndices.filter(id => id !== colorId)
                  : [...row.selectedIndices, colorId],
                // showColorList: false,
              }
            : row,
        ),
      );
    };
  
    const handleSearchColor = async (text, rowId) => {
      setRows(
        rows.map(r =>
          r.id === rowId
            ? {
                ...r,
                filteredColor: r.colorList?.filter(item =>
                  item.name.toLowerCase().includes(text.toLowerCase()),
                ),
              }
            : r,
        ),
      );
    };
  
    // check for create box packing ...
    const updateChildInput = (rowId, sizeId, text) => {
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === rowId
            ? {
                ...row,
                childTable: row.childTable.map(child =>
                  child.SIZE_ID === sizeId
                    ? {...child, enteredInput: text}
                    : child,
                ),
              }
            : row,
        ),
      );
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
            title={'Save Style TransferOut UI'}
            backBtnAction={() => backBtnAction()}
          />
        </View>
  
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={130}
          extraScrollHeight={130}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: hp('15%'), width: '100%'}}>
          <View
            style={{
              marginBottom: hp('5%'),
              width: '90%',
              marginHorizontal: wp('5%'),
            }}>
            <View style={{height: 15}} />
  
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={inHouseRadioButtons}
              onPress={handleInHouseChange}
              layout="row"
              selectedId={
                inHouseRadioButtons.find(
                  item =>
                    item.value === (inHouse === 'Yes' ? 'In House' : 'Customer'),
                )?.id
              }
            />
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={colorStyleRadioButtons}
              onPress={handleColorStyleChange}
              layout="row"
              selectedId={
                colorStyleRadioButtons.find(
                  item =>
                    item.value ===
                    (singleColor === 'Yes'
                      ? 'Single Color'
                      : multiColor === 'Yes'
                      ? 'Multi Color'
                      : customerStyle === 'Yes'
                      ? 'Customer Style'
                      : ''),
                )?.id
              }
            />
  
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
                borderRadius: 5,
              }}>
              <View style={{width: '85%', paddingHorizontal: 10}}>
                <TextInput
                  label="Date"
                  value={date ? Constant.formatDateIntoDMY(date) : ''}
                  mode="outlined"
                  color="#000"
                />
              </View>
              <TouchableOpacity onPress={showDatePicker} style={{padding: 5}}>
                <Image
                  source={require('./../../../assets/images/png/calendar11.png')}
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
            </View>
  
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: hp('4%'),
                width: '100%',
              }}>
              <View
                style={{
                  width: 100,
                  margin: 5,
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <CustomCheckBox
                  isChecked={true}
                  onToggle={() => console.log('hi')}
                />
              </View>
              <Text style={{width: '50%', fontWeight: 'bold', color: '#000'}}>
                Returnable
              </Text>
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
                  width: '100%',
                  justifyContent: 'space-between',
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
                        {'From Location '}
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
                  width: '100%',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  setShowToCustomerList(!showToLocationList);
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
                        {'To Location '}
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
                backgroundColor: '#fff',
                marginTop: hp('2%'),
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
                  setShowToCustomerList(!showToCustomerList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          toCustomerId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'To Customer '}
                      </Text>
                      {toCustomerId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {toCustomerName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
  
                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>
  
              {showToCustomerList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchToCustomer}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredToCustomer.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredToCustomer.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnToCustomer(item)}>
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
                label="Buyer Name"
                value={buyerName}
                mode="outlined"
                onChangeText={text => setbuyerName(text)}
              />
            </View>
  
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Barcode"
                value={barcode}
                mode="outlined"
                onChangeText={text => setBarcode(text)}
              />
            </View>
  
            <View
              style={{
                // width: '90%',
                marginTop: 20,
                marginBottom: 30,
                // marginHorizontal: 15,
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
                  Add Stock
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
                    <View style={{width: 5}}></View>
                    <View style={{width: 200}}>
                      <Text style={styles.table_head_captions}>Style</Text>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Total Qty</Text>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Style Cost</Text>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Goods Value</Text>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 200}}>
                      <Text style={styles.table_head_captions}>
                        Sample Process
                      </Text>
                    </View>
                    <View style={{width: 5}}></View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Process Qty</Text>
                    </View>
                  </View>
  
                  {/* Table Body - Rows */}
                  {rows.map(row => (
                    <View key={row.id}>
                      <View style={styles.table_body_single_row}>
                        <View style={{width: 60}}>
                          <TouchableOpacity
                            style={{alignItems: '', justifyContent: ''}}
                            onPress={() => handleRemoveRow(row.id)}>
                            <Image source={closeImg} style={styles.imageStyle1} />
                          </TouchableOpacity>
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
                                          showBoxList: !r.showBoxList,
                                        }
                                      : {...r, showBoxList: false},
                                  ),
                                );
                              }}>
                              <View style={[styles.SectionStyle1]}>
                                <View style={{flexDirection: 'column'}}>
                                  <Text
                                    style={
                                      row.BoxId
                                        ? styles.dropTextLightStyle
                                        : styles.dropTextInputStyle
                                    }>
                                    {'Box Name  '}
                                  </Text>
                                  <Text style={styles.dropTextInputStyle}>
                                    {row.BoxId ? row.BoxName : 'Select '}
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
                            {row.showBoxList && (
                              <View style={styles.dropdownContent2}>
                                <TextInput
                                  style={styles.searchInput}
                                  placeholder="Search "
                                  onChangeText={text =>
                                    handleSearchboxName(text, row.id)
                                  }
                                  placeholderTextColor="#000"
                                />
                                <ScrollView nestedScrollEnabled={true}>
                                  {row.filteredBoxList.length === 0 ? (
                                    <Text style={styles.noCategoriesText}>
                                      Sorry, no results found!
                                    </Text>
                                  ) : (
                                    row.filteredBoxList.map(item => (
                                      <TouchableOpacity
                                        key={item?.id}
                                        onPress={() =>
                                          actionOnboxName(item, row.id)
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
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.CustomerStyleName}
                            editable={false}
                            onChangeText={text => {
                              setRows(
                                rows.map(r =>
                                  r.id === row.id
                                    ? {...r, CustomerStyleName: text}
                                    : r,
                                ),
                              );
                            }}
                          />
                        </View>
  
                        <View style={{width: 5}}></View>
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.size}
                            editable={false}
                            onChangeText={text => {
                              setRows(
                                rows.map(r =>
                                  r.id === row.id ? {...r, size: text} : r,
                                ),
                              );
                            }}
                          />
                        </View>
  
                        <View style={{width: 5}}></View>
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.Qty.toString()}
                            onChangeText={text => {
                              setRows(
                                rows.map(r =>
                                  r.id === row.id ? {...r, Qty: text} : r,
                                ),
                              );
                            }}
                            editable={false}
                          />
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
                                          showColorList: !r.showColorList,
                                        }
                                      : {...r, showColorList: false},
                                  ),
                                );
                              }}>
                              <View>
                                <View style={[styles.SectionStyle1, {}]}>
                                  <View style={{flexDirection: 'column'}}>
                                    <Text
                                      style={
                                        row.selectedIndices.length > 0
                                          ? [styles.dropTextLightStyle]
                                          : [styles.dropTextInputStyle]
                                      }>
                                      {'Color *'}
                                    </Text>
                                    {row.selectedIndices.length > 0 ? (
                                      <Text style={[styles.dropTextInputStyle]}>
                                        {row.colorList
                                          .filter(color =>
                                            row.selectedIndices.includes(
                                              color.id,
                                            ),
                                          )
                                          .map(color => color.name)
                                          .join(', ')}
                                      </Text>
                                    ) : null}
                                  </View>
                                </View>
                              </View>
  
                              <View style={{justifyContent: 'center'}}>
                                <Image
                                  source={downArrowImg}
                                  style={styles.imageStyle}
                                />
                              </View>
                            </TouchableOpacity>
  
                            {row.showColorList && (
                              <View style={styles.dropdownContent1}>
                                <TextInput
                                  style={styles.searchInput}
                                  placeholder="Search "
                                  onChangeText={text =>
                                    handleSearchColor(text, row.id)
                                  }
                                  placeholderTextColor="#000"
                                />
                                <ScrollView
                                  style={styles.scrollView}
                                  nestedScrollEnabled={true}>
                                  {row?.filteredColor?.length === 0 ? (
                                    <Text style={styles.noCategoriesText}>
                                      Sorry, no results found!
                                    </Text>
                                  ) : (
                                    row?.filteredColor?.map((item, index) => (
                                      <TouchableOpacity
                                        key={index}
                                        style={styles.itemContainer}
                                        onPress={() =>
                                          actionOnColor(item.id, row.id)
                                        }>
                                        <CustomCheckBox
                                          isChecked={row.selectedIndices.includes(
                                            item.id,
                                          )}
                                          onToggle={() =>
                                            actionOnColor(item.id, row.id)
                                          }
                                        />
                                        <Text style={{color: '#000'}}>
                                          {item.name}
                                        </Text>
                                      </TouchableOpacity>
                                    ))
                                  )}
                                </ScrollView>
                              </View>
                            )}
                          </View>
                        </View>
  
                        <View style={{width: 5}}></View>
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.CustomerStyleName}
                            editable={false}
                            onChangeText={text => {
                              setRows(
                                rows.map(r =>
                                  r.id === row.id
                                    ? {...r, CustomerStyleName: text}
                                    : r,
                                ),
                              );
                            }}
                          />
                        </View>
                      </View>
  
                      {/* row2 */}
  
                      {row?.childTable?.length >= 0 && (
                        <View style={styles.table_body_single_row}>
                          <View
                            style={{
                              width: 470,
                              flexDirection: 'row',
                            }}>
                            {row?.childTable?.map((item, index) => (
                              <View
                                key={item?.SIZE_ID}
                                style={{
                                  width: 100,
                                    margin: 5,
                                    alignItems: 'center',
                                    padding: 10,
                                    borderRadius: 5,
                                }}>
                                   <Text style={{marginTop: 5, color: '#000'}}>
                                  {item.SIZE_VAL}
                                </Text>
                                <TextInput
                                  style={styles.table_data_input1}
                                  label={item.SIZE_VAL}
                                  value={item.enteredInput}
                                  mode="outlined"
                                  onChangeText={text =>
                                    updateChildInput(row.id, item.SIZE_ID, text)
                                  }
                                />
                              </View>
                            ))}
                          </View>
                        </View>
                       )} 
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
  
  export default CreateStyleTransferOutUI;
  
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
      table_data_input1: {
        fontSize: 16,
        color: '#000',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 5,
        textAlign: 'center',
        flexDirection: 'row',
      },
      popSearchViewStyleTable: {
        height: hp('40%'),
        width: 200,
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
        width: '100%',
        marginBottom: 10,
        // marginHorizontal: 10,
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
      dropdownContent2: {
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
  
