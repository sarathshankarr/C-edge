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
import {ColorContext} from '../../colorTheme/colorTheme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../../assets/images/png/close1.png');

const StyleBomReportUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  const [data, setData] = useState([]);
  const [checkbox, set_checkbox] = useState(false);

  const [reportType, setReportType] = useState('Consolidated Report');
  const [selection, setSelection] = useState('Style');
  const [balanceQty, setBalanceQty] = useState(false);
  const [rows, setRows] = useState([]);

  const [buyerPOList, setBuyerPOList] = useState([]);
  const [filteredBuyerPO, set_filteredBuyerPO] = useState([]);
  const [showBuyerPOList, set_showBuyerPOList] = useState(false);
  const [buyerPOName, set_buyerPOName] = useState('');
  const [buyerPOId, set_buyerPOId] = useState('');

  const [stylesList, setStylesList] = useState([]);
  const [filteredStyles, set_filteredStyles] = useState([]);
  const [showStylesList, set_showStylesList] = useState(false);
  const [stylesName, set_stylesName] = useState('');
  const [stylesId, set_stylesId] = useState('');
  const [initialStyleList, set_initialStyleList] = useState([]);
  const [BuyerPOStyleList, set_BuyerPOStyleList] = useState([]);

  const [rmNameList, setRMNameList] = useState([]);
  const [filteredRMName, set_filteredRMName] = useState([]);
  const [showRMNameList, set_showRMNameList] = useState(false);
  const [rmName, set_rmName] = useState('');
  const [rmId, set_rmId] = useState('');

  const [fabricOrTrimsList, setFabricOrTrimsList] = useState([]);
  const [filteredFabricOrTrims, setFilteredFabricOrTrims] = useState([]);
  const [showFabricOrTrimsList, setShowFabricOrTrimsList] = useState(false);
  const [fabricOrTrimsName, setFabricOrTrimsName] = useState('');
  const [fabricOrTrimsId, setFabricOrTrimsId] = useState('');

  useEffect(() => {
    if (props?.lists) {
      // console.log('create listss ===> ', props?.lists);
      if (props?.lists.styleMap1) {
        const stylesMap = Object.keys(props?.lists.styleMap1).map(key => ({
          id: key,
          name: props?.lists.styleMap1[key],
        }));
        set_filteredStyles(stylesMap);
        setStylesList(stylesMap);
        set_initialStyleList(stylesMap);
        set_BuyerPOStyleList(stylesMap);
      }
      if (props?.lists.buyerpomap) {
        const buyerPoMap = Object.keys(props?.lists.buyerpomap).map(key => ({
          id: key,
          name: props?.lists.buyerpomap[key],
        }));
        setBuyerPOList(buyerPoMap);
        set_filteredBuyerPO(buyerPoMap);
      }
      if (props?.lists.trimsConstructionsmap) {
      }
    }
  }, [props?.lists]);

  useEffect(() => {
    if (props?.stylelist) {
      console.log('create style list buyer po listss ===> ', props?.stylelist);
      if (props?.stylelist.fabRmMap) {
        const stylesMap = Object.keys(props?.stylelist.fabRmMap).map(key => ({
          id: key,
          name: props?.stylelist.fabRmMap[key],
        }));
        set_filteredStyles(stylesMap);
        setStylesList(stylesMap);
        set_BuyerPOStyleList(stylesMap);
      }
    }
  }, [props?.stylelist]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const ApproveAction = () => {
    console.log('Approved');

    const IdsList = rows.map(item => item.ids).join(",");

    let tempObj = {
      multistyle: IdsList+",",
      QtyVal: balanceQty ? 1 :0 ,
      soId: buyerPOId ? buyerPOId : 0 ,
    };

    console.log("SAVING OBJ=====>   ", tempObj);
    props.submitAction(tempObj);
  };

  const RejectAction = remarks => {
    console.log('Rejected');
  };

  const actionOnBuyerPO = item => {
    set_buyerPOId(item.id);
    set_buyerPOName(item.name);
    set_showBuyerPOList(false);

    props.getStyleListFromBuyerPo(item.id);
  };
  const actionOnStyles = item => {
    set_stylesId(item.id);
    set_stylesName(item.name);
    set_showStylesList(false);
  };

  const actionOnRMName = (id, name) => {
    set_rmId(id);
    set_rmName(name);
    set_showRMNameList(false);
  };
  const actionOnFabricOrTrims = (id, name) => {
    setFabricOrTrimsId(id);
    setFabricOrTrimsName(name);
    setShowFabricOrTrimsList(false);
  };

  const handleSearchCustomer = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredCustomer(filtered);
    } else {
      set_filteredCustomer(props.lists.getStockCustomers);
    }
  };

  const handleSearchBuyerPO = text => {
    if (text.trim().length > 0) {
      const filtered = buyerPOList.filter(buyerPO =>
        buyerPO.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredBuyerPO(filtered);
    } else {
      set_filteredBuyerPO(buyerPOList);
    }
  };

  const handleSearchStyles = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockStyles.filter(style =>
        style.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredStyles(filtered);
    } else {
      set_filteredStyles(props.lists.getStockStyles);
    }
  };

  const handleSearchFabricOrTrims = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockFabricOrTrims.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredFabricOrTrims(filtered);
    } else {
      setFilteredFabricOrTrims(props.lists.getStockFabricOrTrims);
    }
  };

  const handleSearchRMName = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockRMNames.filter(rmName =>
        rmName.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredRMName(filtered);
    } else {
      set_filteredRMName(props.lists.getStockRMNames);
    }
  };

  const reportRadioButtons = useMemo(
    () => [
      // {
      //   id: '1',
      //   label: 'PDF',
      //   value: 'PDF',
      //   selected: reportType === 'PDF',
      //   labelStyle: {color: '#000'},
      // },
      {
        id: '2',
        label: 'Consolidated Report',
        value: 'Consolidated Report',
        selected: reportType === 'Consolidated Report',
        labelStyle: {color: '#000'},
      },
    ],
    [reportType],
  );

  const handleReportChange = selectedId => {
    const selectedOption = reportRadioButtons.find(
      button => button.id === selectedId,
    );
    if (selectedOption) {
      setReportType(selectedOption.value);
    }
  };

  const selectionRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Style',
        value: 'Style',
        selected: selection === 'Style',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Buyer Po',
        value: 'Buyer Po',
        selected: selection === 'Buyer Po',
        labelStyle: {color: '#000'},
      },
    ],
    [selection],
  );

  const handleSelectionChange = selectedId => {
    const selectedOption = selectionRadioButtons.find(
      button => button.id === selectedId,
    );
    if (selectedOption) {
      setSelection(selectedOption.value);
    }
    console.log('changed radio ==> ', selectedId);

    const newList = selectedId === '1' ? initialStyleList : BuyerPOStyleList;

    set_filteredStyles(newList);
    setStylesList(newList);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        Type: 'Style',
        StyleName: stylesName || '',
        ids:stylesId
      },
    ]);
  };

  const handleRemoveRow = id => {
    console.log('handleRemoveRow ==> ', id);
    setRows(prev => prev.filter((item, index) => item.id !== id));
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
          title={'Style Bom Report'}
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
            marginTop: hp('2%'),
          }}>
          <RadioGroup
            style={{flexDirection: 'row'}}
            radioButtons={reportRadioButtons}
            onPress={handleReportChange}
            layout="row"
            selectedId={
              reportRadioButtons.find(item => item.value === reportType)?.id
            }
          />

          {reportType === 'Consolidated Report' && (
            <View
              style={[
                styles.checkboxItem,
                {marginTop: hp('2%'), marginBottom: hp('2%')},
              ]}>
              <CustomCheckBox
                isChecked={balanceQty}
                onToggle={() => setBalanceQty(!balanceQty)}
              />
              <Text style={styles.checkboxLabel}>{'Balance Qty'}</Text>
            </View>
          )}

          {reportType === 'Consolidated Report' && (
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={selectionRadioButtons}
              onPress={handleSelectionChange}
              layout="row"
              selectedId={
                selectionRadioButtons.find(item => item.value === selection)?.id
              }
            />
          )}

          {/* drop down lists */}

          {reportType === 'Consolidated Report' && selection === 'Buyer Po' && (
            <View
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
                  set_showBuyerPOList(!showBuyerPOList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          buyerPOId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Buyer PO'}
                      </Text>
                      {buyerPOId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {buyerPOName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showBuyerPOList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchBuyerPO}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredBuyerPO.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredBuyerPO.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnBuyerPO(item)}>
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
                set_showStylesList(!showStylesList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        stylesId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Styles'}
                    </Text>
                    {stylesId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {stylesName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showStylesList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchStyles}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredStyles.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredStyles.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnStyles(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {/* {reportType === 'PDF' && (
            <View
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
                  justifyContent:"space-between"
                }}
                onPress={() => {
                  setShowFabricOrTrimsList(!showFabricOrTrimsList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          fabricOrTrimsId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Fabric/Trims'}
                      </Text>
                      {fabricOrTrimsId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {fabricOrTrimsName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showFabricOrTrimsList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchFabricOrTrims}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredFabricOrTrims.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredFabricOrTrims.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnBuyerPO(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {reportType === 'PDF' && (
            <View
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
                  justifyContent:"space-between"

                }}
                onPress={() => {
                  set_showRMNameList(!showRMNameList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          rmId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'RM Type'}
                      </Text>
                      {rmId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {rmName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showRMNameList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchRMName}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredRMName.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredRMName.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnRMName(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )} */}

          <View
            style={{
              marginTop: 20,
              marginBottom: 30,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
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
                Add Style
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
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Style</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 150}}>
                    <Text style={styles.table_head_captions}>Total Qty</Text>
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
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.Type}</Text>
                      </View>

                      <View style={{width: 5}}></View>
                      <View style={{width: 150}}>
                        <Text style={styles.table_data}>{row.StyleName}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={{marginBottom: 150}} />
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Download'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
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

export default StyleBomReportUI;

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
  });
