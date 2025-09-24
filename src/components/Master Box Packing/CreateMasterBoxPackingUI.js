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
import {useNavigation} from '@react-navigation/native';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const CreateMasterBoxPackingUI = ({route, ...props}) => {
  const navigation = useNavigation();

  const [masterBoxName, setMasterBoxName] = useState('');
  const [rows, setRows] = useState([]);
  const [buyerName, setbuyerName] = React.useState('');
  const [barcode, setBarcode] = React.useState('');

  const [lastestBoxId, setLastestBoxId] = React.useState(0);
  const [lastestBuyerPoId, setLastestBuyerPoId] = React.useState(0);
  const [lastestBoxList, setLastestBoxList] = React.useState('');

  const [proformaInvoiceList, setProformaInvoiceList] = useState([]);
  const [filteredProformaInvoice, set_filteredProformaInvoice] = useState([]);
  const [showProformaInvoiceList, set_showProformaInvoiceList] =
    useState(false);
  const [proformaInvoiceId, set_proformaInvoiceId] = useState('');
  const [selectedProformaIndices, setSelectedProformaIndices] = useState([]);

  const [poflag, setPoFlag] = useState(false);

  const {colors} = useContext(ColorContext);

  const styles = getStyles(colors);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  useEffect(() => {
    const fetchPoFlag = async () => {
      try {
        let companyObj = await AsyncStorage.getItem('companyObj');
        let flag =
          JSON.parse(companyObj)?.newFlagSetupMasterDAO?.nfsm_pi_style_wise;
        console.log('Po flag ', flag);
        setPoFlag(flag == '1');
      } catch (err) {
        console.error('Error fetching companyObj:', err);
      }
    };

    fetchPoFlag();
  }, []);

  useEffect(() => {
    if (props.lists) {
      // console.log(' props.lists ', props.lists);

      if (props.lists.buyerMap) {
        const buyerMapList = Object.keys(props.lists.buyerMap).map(key => ({
          id: key,
          name: props.lists.buyerMap[key],
        }));
        setFilteredBuyerPo(buyerMapList);
        setBuyerPoList(buyerMapList);
      }
      if (props.lists.proformaInvoiceMap) {
        const proformaInvoiceMapList = Object.keys(
          props.lists.proformaInvoiceMap,
        ).map(key => ({
          id: key,
          name: props.lists.proformaInvoiceMap[key],
        }));
        set_filteredProformaInvoice(proformaInvoiceMapList);
        setProformaInvoiceList(proformaInvoiceMapList);
      }
      // console.log(" props.lists.boxid ")
      if (props.lists.boxid) {
        if (!props.lists.boxid) return;
        const boxidList = Object.keys(props.lists.boxid).map(key => ({
          id: key,
          name: props.lists.boxid[key],
        }));
        setLastestBoxList(boxidList);

        // console.log("initial")
        // setRows([
        //   // ...rows,
        //   {
        //     id: Date.now(),
        //     BoxName: '',
        //     BoxId: '',
        //     showBoxList: false,
        //     BoxList: boxidList || [],
        //     filteredBoxList: boxidList || [],
        //     CustomerStyleName: '',
        //     size: '',
        //     Qty: '',
        //     childTable: [],
        //     PbuyerPoID: '',
        //     Barcode: '',
        //   },
        // ]);
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

        if (!lastestBoxId) return;

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

  useEffect(() => {
    if (props.barcodeData) {
      console.log('barcodeData ====> ', props.barcodeData);
      const len = props?.barcodeData?.length || '0';

      let boxItem = {};

      if (!props?.barcodeData?.boxKeyId) return;

      if (lastestBoxList?.length > 0) {
        boxItem = lastestBoxList?.find(
          item => item.id == props?.barcodeData?.boxKeyId,
        );
      }
      console.log('barcodeData set boxItem  ====> ', boxItem);
      setRows([
        ...rows,
        {
          id: Date.now(),
          BoxName: boxItem?.name,
          BoxId: boxItem?.id || '0',
          showBoxList: false,
          BoxList: lastestBoxList || [],
          filteredBoxList: lastestBoxList || [],
          CustomerStyleName: props.barcodeData.size || '',
          size: props.barcodeData.styleNo || '',
          Qty: props.barcodeData.qty || '',
          childTable: [],
          PbuyerPoID: '',
          Barcode: props.barcodeData.Barcode || '',
        },
      ]);
      // }
    }
  }, [props.barcodeData]);

  const backAction = async () => {
    props.backBtnAction();
  };

  const handleCallBarcodes = code => {
    setBarcode(code);
    console.log('code length ', code.length, code, code.length !== 8);
    if (code.length !== 9) return;

    const isDuplicate = rows.some(row => row.Barcode == code.trim());

    if (isDuplicate) {
      Alert.alert('This Barcode Is Already Selected...Please Check');
      return;
    }

    console.log('barcode scanned ', code);
    props.ValidateBarcode(code, poflag, selectedProformaIndices);
  };

  const handleScannedCode = text => {
    if (!text) {
      Alert.alert('Please Enter the Valid Barcode', text);
    }
    handleCallBarcodes(text);

    // if (text) {
    //   setRows(prev => [
    //     ...prev,
    //     {
    //       id: 1,
    //       BoxId: 'box_001',
    //       BoxName: 'Box Alpha',
    //       CustomerStyleName: 'Style 101',
    //       size: 'M',
    //       Qty: 10,
    //       showBoxList: false,
    //       filteredBoxList: [
    //         {id: 'box_001', name: 'Box Alpha'},
    //         {id: 'box_002', name: 'Box Beta'},
    //         {id: 'box_003', name: 'Box Gamma'},
    //       ],
    //       childTable: [
    //         {SIZE_ID: 1, SIZE_VAL: 'XS', checked: true},
    //         {SIZE_ID: 2, SIZE_VAL: 'S', checked: false},
    //         {SIZE_ID: 3, SIZE_VAL: 'M', checked: true},
    //       ],
    //     },
    //   ]);
    // } else {
    //   Alert.alert('Please Enter the Valid Barcode');
    // }
  };

  const submitAction = async () => {
    // const mappedRows = rows.flatMap(row => {
    //   const barcodeString = row.childTable?.length
    //     ? Array(row.childTable.length).fill(row.barcode).join(',')
    //     : '';

    //   return (
    //     row.childTable?.map(child => ({
    //       masterboxId: row.BoxId,
    //       barcode: barcodeString,
    //       boxId: child.SIZE_VAL,
    //       m_buyerpo_id: row.PbuyerPoID,
    //     })) || []
    //   );
    // });

    console.log('rows child==> ', rows);
    const mappedRows =
      rows.map(row => ({
        masterboxId: row.BoxId,
        barcode: row.Barcode ? row.Barcode : '',
        // row.childTable
        //     .filter(item => item.checked)
        //     .map(item => item.SIZE_VAL)
        //     .join(',') || '',
        boxId: 0, //id
        m_buyerpo_id: row.PbuyerPoID || '0',
      })) || [];

    const tempObj = {
      boxId: 0,
      masterBox: masterBoxName,
      buyerpoId: buyerPoId || '0',
      particulars: mappedRows || [],
      master_box_total_qty: totalQty || '0',
    };

    // return;
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
        childTable: [],
        PbuyerPoID: lastestBuyerPoId || '',
      },
    ]);
  };

  const [buyerPoList, setBuyerPoList] = useState([]);
  const [filteredBuyerPo, setFilteredBuyerPo] = useState([]);
  const [showBuyerPoList, setShowBuyerPoList] = useState(false);
  const [buyerPoName, setBuyerPoName] = useState('');
  const [buyerPoId, setBuyerPoId] = useState('');

  const actionOnBuyerPo = item => {
    setBuyerPoId(item.id);
    setBuyerPoName(item.name);
    setShowBuyerPoList(false);
    setLastestBuyerPoId(item.id);
  };

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

  const handleSearchProformaInvoice = text => {
    if (text.trim().length > 0) {
      const filtered = proformaInvoiceList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredProformaInvoice(filtered);
    } else {
      set_filteredProformaInvoice(proformaInvoiceList);
    }
  };

  const actionOnProformaInvoiceToggle = id => {
    setSelectedProformaIndices(prevSelected => {
      const exists = prevSelected.some(i => i === id);
      let updated;
      if (exists) {
        updated = prevSelected.filter(i => i !== id);
      } else {
        updated = [...prevSelected, id];
      }
      const sIds = updated.join(',');
      props.getDataFromSelectedCheckBox(sIds, poflag);
      return updated;
    });
  };

  const handleScan = () => {
    navigation.navigate('ScanQRPage', {
      onScanSuccess: scannedValue => {
        console.log('Scanned Code: ', scannedValue);
        handleScannedCode(scannedValue);
      },
    });
  };

  const totalQty = rows.reduce((acc, curr) => acc + Number(curr.Qty || '0'), 0);

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Create Master Box Packing'}
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
              label="Master Box Name : "
              value={masterBoxName}
              mode="outlined"
              onChangeText={text => setMasterBoxName(text)}
            />
          </View>

          {poflag && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: hp('2%'),
                width: '100%',
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
                  set_showProformaInvoiceList(!showProformaInvoiceList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          proformaInvoiceId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Proforma Invoice ID'}
                      </Text>
                      {proformaInvoiceId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {selectedProformaIndices.length > 0 ? (
                            <Text style={[styles.dropTextInputStyle]}>
                              {proformaInvoiceList
                                .filter(item =>
                                  selectedProformaIndices.includes(Number(item.id)),
                                )
                                .map(item => item.name)
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

              {showProformaInvoiceList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchProformaInvoice}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredProformaInvoice.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredProformaInvoice.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.itemContainer}
                          onPress={() => actionOnProformaInvoice(item)}>
                          <CustomCheckBox
                            isChecked={selectedProformaIndices.includes(
                              item.id,
                            )}
                            onToggle={() =>
                              actionOnProformaInvoiceToggle(item.id)
                            }
                          />
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* <View
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
          </View> */}

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Barcode"
              value={barcode}
              mode="outlined"
              onChangeText={text => handleCallBarcodes(text)}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 'auto',
              paddingVertical: hp('1.5%'),
              borderRadius: 10,
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5, // For Android shadow
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              onPress={handleScan}
              style={{alignItems: 'center'}}>
              <Image
                source={require('./../../../assets/images/png/scan.png')}
                style={{
                  height: 28,
                  width: 28,
                  marginBottom: hp('0.5%'),
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: '#333',
                  fontSize: hp('1.6%'),
                  fontWeight: '500',
                  marginTop: hp('0.3%'),
                }}>
                Scan
              </Text>
            </TouchableOpacity>
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
                    <Text style={styles.table_head_captions}>Box Name</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Style</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Size</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Qty</Text>
                  </View>
                  <View style={{width: 100}}>
                    <Text style={styles.table_head_captions}>Barcode</Text>
                  </View>
                </View>

                {/* Table Body - Rows */}
                {rows.length > 0 &&
                  rows.map(row => (
                    <View key={row.id}>
                      <View style={styles.table_body_single_row}>
                        <View style={{width: 60}}>
                          <TouchableOpacity
                            style={{alignItems: '', justifyContent: ''}}
                            onPress={() => handleRemoveRow(row.id)}>
                            <Image
                              source={closeImg}
                              style={styles.imageStyle1}
                            />
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
                        {/* {console.log("row.CustomerStyleName =====> ", row.CustomerStyleName)} */}
                        <View style={{width: 5}}></View>
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.CustomerStyleName}
                            editable={false}
                            multiline={true}
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
                            multiline={true}
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
                           multiline={true}
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
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.Barcode}
                            multiline={true}
                            onChangeText={text => console.log(tex)}
                            editable={false}
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
                              flexWrap: 'wrap',
                            }}>
                            {row?.childTable?.map((item, index) => (
                              <View
                                key={index}
                                style={{
                                  width: 100,
                                  margin: 5,
                                  alignItems: 'center',
                                  padding: 10,
                                  borderRadius: 5,
                                  flexDirection: 'row',
                                }}>
                                <CustomCheckBox
                                  isChecked={item?.checked}
                                  onToggle={() =>
                                    actionOnCheckBox(row.id, index)
                                  }
                                />

                                <Text style={{marginTop: 5, color: '#000'}}>
                                  {item.SIZE_VAL}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}

                <View style={styles.table_body_single_row}>
                  <View style={{width: 60}}></View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 200}}></View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}></View>

                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.dropTextInputStyle1}>Total Qty:</Text>
                  </View>

                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}>
                    <Text style={styles.dropTextInputStyle1}>{totalQty}</Text>
                  </View>
                  <View style={{width: 5}}></View>
                  <View style={{width: 100}}></View>
                </View>
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

export default CreateMasterBoxPackingUI;

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
    dropTextInputStyle1: {
      fontWeight: 'normal',
      fontSize: 18,
      color: 'black',
      textAlign: 'center',
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
      width: '100%',
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
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
