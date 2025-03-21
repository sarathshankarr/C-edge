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

const CreateBoxPackingUI = ({route, navigation, ...props}) => {
  const [boxName, setBoxName] = React.useState('');
  const [buyerName, setbuyerName] = React.useState('');
  const [barcode, setBarcode] = React.useState('');
  const [packerName, setPackerName] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const {colors} = useContext(ColorContext);

  const styles = getStyles(colors);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  useEffect(() => {
    if (props.lists1) {
      console.log('data need to set lists 1==> ', props.lists1);
      if (props.lists1.buyername) {
        setbuyerName(props.lists1.buyername);
      }
      if (props.lists1.styles) {
        const stylespList = Object.keys(props.lists1.styles).map(key => ({
          id: key,
          name: props.lists1.styles[key],
        }));
        // console.log('setting tables list ===============> ', stylespList);
        // setCustomerStyleTableList(stylespList);

        setRows([
          ...rows,
          {
            id: Date.now(),
            orderName: '',
            CustomerStyleName: '',
            CustomerStyleId: '',
            showCustomerStyleList: false,
            CustomerStyleList: stylespList || [],
            filteredCustomerStyle: stylespList || [],
            showColorList: false,
            colorList: [],
            filteredColor: [],
            selectedIndices: [],
            childTable: [],
          },
        ]);
      }
    }
  }, [props.lists1]);

  useEffect(() => {
    if (props.lists2) {
      console.log('data need to set lists2 ==> ', props.lists2);
      if (props.lists2.buyerMap) {
        const colorsList = Object.keys(props.lists2.buyerMap).map(key => ({
          id: key,
          name: props.lists2.buyerMap[key],
        }));
        console.log('setting color  ===============> ', colorsList);
        const childItems = props.lists2?.ja?.myArrayList?.map(item => ({
          SIZE_ID: item.map.SIZE_ID,
          SIZE_VAL: item.map.SIZE_VAL,
          enteredInput: '0',
        }));
        console.log(
          'setting child  ===============> ',
          props.lists2?.ja?.myArrayList,
        );
        // setColorList(colorsList);
        setRows(
          rows.map(row =>
            row.id === rowId_ColorList
              ? {
                  ...row,
                  colorList: colorsList,
                  filteredColor: colorsList,
                  childTable: childItems,
                }
              : row,
          ),
        );
      }
    }
  }, [props.lists2]);

  useEffect(() => {
    if (props.initialDataLists) {
      if (props.initialDataLists.locationsMap) {
        const locationsMapList = Object.keys(
          props.initialDataLists.locationsMap,
        ).map(key => ({
          id: key,
          name: props.initialDataLists.locationsMap[key],
        }));

        setFilteredLocation(locationsMapList);
        setLocationList(locationsMapList);
      }
      if (props.initialDataLists.buyerMap) {
        const buyerMapList = Object.keys(props.initialDataLists.buyerMap).map(
          key => ({
            id: key,
            name: props.initialDataLists.buyerMap[key],
          }),
        );
        buyerMapList.reverse();
        setFilteredBuyerPo(buyerMapList);
        setBuyerPoList(buyerMapList);
      }
      // console.log('data need to set ==> ', props.initialDataLists);
    }
  }, [props.initialDataLists]);

  // Ship To state variables
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, setFilteredLocation] = useState([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationId, setLocationId] = useState('');

  const [rowId_ColorList, setRowId_ColorList] = useState('');

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

  // BuyerPo state variables
  const [buyerPoList, setBuyerPoList] = useState([]);
  const [filteredBuyerPo, setFilteredBuyerPo] = useState([]);
  const [showBuyerPoList, setShowBuyerPoList] = useState(false);
  const [buyerPoName, setBuyerPoName] = useState('');
  const [buyerPoId, setBuyerPoId] = useState('');

  const [colorList, setColorList] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);

  // Function to handle selection of a BuyerPo item
  const actionOnBuyerPo = item => {
    setBuyerPoId(item.id);
    setBuyerPoName(item.name);
    setShowBuyerPoList(false);
    const tempObj = {buyerPoId: item.id};
    props.getData(tempObj, 1);
  };

  // Function to filter BuyerPo list based on search input
  const handleSearchBuyerPo = text => {
    if (text.trim().length > 0) {
      const filtered = buyerPoList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredBuyerPo(filtered);
    } else {
      setFilteredBuyerPo(buyerPoList);
    }
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const submitAction = async () => {
   
      // rows.forEach((item, index)=>{
      //   console.log("hiiiii", item.selectedIndices[0],item.childTable.map(item=>item.SIZE_ID).join(','), item.childTable.map(item=>item.enteredInput).join(','),item.CustomerStyleId)
      // })

      let result = rows.map(item => {
        return `${item.selectedIndices[0]}#${item.childTable.map(child => child.SIZE_ID).join(',')}:${item.childTable.map(child => child.enteredInput).join(',')}:${item.childTable.map(_ => 0).join(',')}:${item.CustomerStyleId}~`;
      }).join('~');
      
      // console.log("Final String ==> ", result);


    // "897#1,:3,:0,:6771553~897#1,:2,:0,:6771553~"
// return;
    const tempObj = {
      locId: locationId,
      bpmID: 0,
      boxname: boxName,
      creationDate: '2025-03-12',
      packerName: '',
      tableValues: result,
      enterCount: 1,
      buyerPoId: buyerPoId,
      scannedBarcodeList: [],
    };
    props.submitAction(tempObj);
  };

  const handleSearchCustomerStyle = async (text, rowId) => {
    setRows(
      rows.map(r =>
        r.id === rowId
          ? {
              ...r,
              filteredCustomerStyle: r.CustomerStyleList?.filter(stockType =>
                stockType.name.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : r,
      ),
    );
  };

  const actionOnCustomerStyle = async (item, rowId) => {
    setRows(
      rows.map(row =>
        row.id === rowId
          ? {
              ...row,
              CustomerStyleName: item?.name,
              CustomerStyleId: item?.id,
              showCustomerStyleList: false,
            }
          : row,
      ),
    );
    setRowId_ColorList(rowId);
    const tempObj = {
      buyerPoId: buyerPoId,
      styleId: item?.id,
    };

    await props.getData(tempObj, 2);
  };

  const handleRemoveRow = id => {
    console.log('ROW ID ===> ', id);
    const filtered = rows.filter(item => item.id !== id);
    setRows(filtered);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        CustomerStyleName: '',
        CustomerStyleId: '',
        showCustomerStyleList: false,
        CustomerStyleList: [],
        filteredCustomerStyle: [],
        showColorList: false,
        colorList: [],
        filteredColor: [],
        selectedIndices: [],
      },
    ]);
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
          title={'Create Box Packing'}
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
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Box Name "
              value={boxName}
              mode="outlined"
              onChangeText={text => setBoxName(text)}
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
                width: '100%',
                justifyContent: 'space-between',
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
                      {'Location '}
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
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowBuyerPoList(!showBuyerPoList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        buyerPoId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Buyer PO '}
                    </Text>
                    {buyerPoId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {buyerPoName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showBuyerPoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchBuyerPo}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredBuyerPo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBuyerPo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnBuyerPo(item)}>
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
                    <Text style={styles.table_head_captions}>
                      *Customer Style
                    </Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 200}}>
                    <Text style={styles.table_head_captions}>Color</Text>
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
                                        showCustomerStyleList:
                                          !r.showCustomerStyleList,
                                      }
                                    : {...r, showCustomerStyleList: false},
                                ),
                              );
                            }}>
                            <View style={[styles.SectionStyle1]}>
                              <View style={{flexDirection: 'column'}}>
                                <Text
                                  style={
                                    row.CustomerStyleId
                                      ? styles.dropTextLightStyle
                                      : styles.dropTextInputStyle
                                  }>
                                  {'Customer Style *'}
                                </Text>
                                <Text style={styles.dropTextInputStyle}>
                                  {row.CustomerStyleId
                                    ? row.CustomerStyleName
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
                          {row.showCustomerStyleList && (
                            <View style={styles.dropdownContent2}>
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search "
                                onChangeText={text =>
                                  handleSearchCustomerStyle(text, row.id)
                                }
                                placeholderTextColor="#000"
                              />
                              <ScrollView nestedScrollEnabled={true}>
                                {row.filteredCustomerStyle.length === 0 ? (
                                  <Text style={styles.noCategoriesText}>
                                    Sorry, no results found!
                                  </Text>
                                ) : (
                                  row.filteredCustomerStyle.map(item => (
                                    <TouchableOpacity
                                      key={item?.id}
                                      onPress={() =>
                                        actionOnCustomerStyle(item, row.id)
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
                    </View>

                    {/* row2 */}

                    {row?.childTable?.length > 0 &&
                      row?.selectedIndices?.length > 0 && (
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
                                <TextInput
                                  style={styles.table_data_input1}
                                  label={item.SIZE_VAL}
                                  value={item.enteredInput}
                                  mode="outlined"
                                  onChangeText={text =>
                                    updateChildInput(row.id, item.SIZE_ID, text)
                                  }
                                />
                                <Text style={{marginTop: 5, color: 'gray'}}>
                                  {'hi'}
                                </Text>
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

export default CreateBoxPackingUI;

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
      // flex: 1,
      marginTop: hp('2%'),
      // width: '95%',
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
      paddingVertical: 10,
      paddingHorizontal: 5,
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
    table_data_input1: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 5,
      textAlign: 'center',
      flexDirection: 'row',
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
    itemContainer: {
      borderBottomColor: '#e0e0e0',
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
