import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import fonts from '../../../utils/commonStyles/fonts';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import * as Constant from '../../../utils/constants/constant';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {formatPrice} from '../../../utils/constants/constant';
import FilterModal from '../../../utils/commonComponents/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorContext} from '../../colorTheme/colorTheme';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import CustomCheckBox from '../../../utils/commonComponents/CustomCheckBox';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let filterImg = require('./../../../../assets/images/png/setting.png');

const POApproveUI = ({route, ...props}) => {
  const [isListOpen, set_ListOpen] = useState(false);
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);
  const [refreshing, set_refreshing] = useState(false);
  const {colors} = useContext(ColorContext);

  const [ItemsArray, set_ItemsArray] = useState([]);
  const [showFilteredList, set_showFilteredList] = useState(false);
  const [filterCount, set_filterCount] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterReqBody, setfilterReqBody] = useState({});

  const [showModal, setShowmodal] = useState(false);
  const [companyList, setcompanyList] = useState();
  const [query, setquery] = useState('');
  const [latestPo, setLatestPO] = useState('');
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
  const [modalLists, setModalLists] = useState([]);

  const [categories, set_categories] = useState([
    {id: 'Vendor', fid: 'vendorName', value: 'Vendor', idxId: 'vendorId'},
    {id: 'Rm/Fabric', fid: 'rmFabric', value: 'Rm/Fabric', idxId: 'rmFabric'},
  ]);

  const styles = getStyles(colors);

  React.useEffect(() => {
    if (props.itemsArray) {
      console.log('props.itemsArray ==> ', props.itemsArray);
      set_filterArray(props.itemsArray);
      set_ItemsArray(props.itemsArray);
    }
    // getRequestBody();
  }, [props.itemsArray]);

  React.useEffect(() => {
    // console.log("modal list ==> ",props.modalList )
    if (props.modalList) {
      setModalLists(props.modalList);
      setcompanyList(props.modalList);
    }
  }, [props.modalList]);

  const getRequestBody = async () => {
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let usercompanyId = await AsyncStorage.getItem('companyId');
    let companyObj = await AsyncStorage.getItem('companyObj');
    let Obj = {
      menuId: 4,
      searchKeyValue: '',
      styleSearchDropdown: '-1',
      dataFilter: '0',
      locIds: 0,
      brandIds: 0,
      fromRecord: 0,
      toRecord: 25,
      userName: userName,
      userPwd: userPsd,
      categoryType: '',
      compIds: usercompanyId,
      company: JSON.parse(companyObj),
    };

    setfilterReqBody(Obj);
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const filterPets = name => {
    const searchTerm = name.toString().toLowerCase().trim();
    set_recName(name);
    if (searchTerm.length === 0) {
      set_filterArray(ItemsArray);
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);

    const styleArray = ItemsArray.filter(
      style =>
        style.vendorName.toUpperCase().includes(name.toUpperCase()) ||
        style.poNumberWithPrefix
          .toString()
          .toUpperCase()
          .includes(name.toUpperCase()) ||
        style.rmFabric.toUpperCase().includes(name.toUpperCase()),
    );

    if (styleArray && styleArray.length > 0) {
      set_filterArray(styleArray);
    } else {
      set_filterArray([]);
    }
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={CommonStyles.cellBackViewStyle}>
        {item.poSave === 2 && (
          <View
            style={{
              position: 'absolute',
              top: 1,
              right: 0,
              backgroundColor: colors.color2,
              paddingHorizontal: 10,
              paddingVertical: 2,
              borderTopLeftRadius: 7, // Capsule shape
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
              zIndex: 10,
            }}>
            <Text
              style={{
                // color: 'black',
                color: 'white',
                fontSize: 8,
                fontWeight: '600',
              }}>
              Draft
            </Text>
          </View>
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={[CommonStyles.tylesTextStyle, {flex: 1, textAlign: 'left'}]}>
            {item.poNumberWithPrefix}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1.3, textAlign: 'center'},
            ]}>
            {item.vendorName}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.rmFabric}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.approvalStatus}
          </Text>
          {/* <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1.2, textAlign: 'right', marginRight: wp('2%')},
            ]}>
            {formatPrice(item.price)}
          </Text> */}
          <View
            style={{
              flex: 1.2,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
            <View
              style={{
                flex: 1.2,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                // marginRight: wp('2%'),
              }}>
              <TouchableOpacity
                // onPress={() => Linking.openURL('mailto:abc@gmail.com')}>
                onPress={() => handleOpenModal(item)}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'contain',
                  }}
                  source={require('./../../../../assets/images/png/gmail.png')}
                />
              </TouchableOpacity>

              {item.approvalStatus ==="Approved" && <TouchableOpacity onPress={() => handleSendWhatsApp(item)}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'contain',
                  }}
                  source={require('./../../../../assets/images/png/whatsapp.png')}
                />
              </TouchableOpacity>}
            </View>
            <View
              style={{
                flex: 1.2,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 8,
              }}>
             {item.approvalStatus ==="Approved" && <TouchableOpacity onPress={() => handlePdf(item)}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'contain',
                  }}
                  source={require('./../../../../assets/images/png/pdf2.png')}
                />
              </TouchableOpacity>}

              <TouchableOpacity onPress={() => handleExcel(item)}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    resizeMode: 'contain',
                  }}
                  source={require('./../../../../assets/images/png/sheets.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const fetchMore = () => {
    if (!isFiltering) {
      props.fetchMore(true);
    }
  };

  const applyFilterFxn = (types, Ids, count) => {
    console.log('applyFilterFxn', types, Ids);
    props.applyFilterFxn(types, Ids);
    set_filterCount(count);
    set_showFilteredList(true);
    setFilterVisible(false);
  };

  const clearFilter = () => {
    onRefresh();
  };

  const onRefresh = () => {
    set_refreshing(true);
    props.fetchMore(false);
    set_refreshing(false);
    set_filterCount(0);
    set_recName('');
    set_showFilteredList(false);
    setFilterVisible(false);
    setIsFiltering(false);
  };

  const filteredCompanyList = modalLists.filter(item =>
    item?.vendor_name?.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelectFromModal = () => {
    console.log('selecetdIndexes ===> ', selectedIdxs);
    const ans = modalLists
      .filter(item => selectedIdxs.includes(item.vendorId))
      .map(
        item =>
          `${item.vendorId}_!${item.vendor_name}_!${item.ph}_!${item.email_id}_!${item.dba}`,
      )
      .join(',');

    console.log('result ===> ', ans);
    props.sendMail(ans, latestPo);
    setShowmodal(false);
  };

  const updateAllIndexes = () => {
    setSelectedIdxs(
      selectAllCheckBox ? [] : filteredCompanyList.map((_, index) => index),
    );
    setSelectAllCheckBox(!selectAllCheckBox);
  };

  const toggleSelection = Id => {
    setSelectedIdxs(prevSelected => {
      const exists = prevSelected.includes(Id);
      if (exists) {
        return prevSelected.filter(i => i !== Id);
      } else {
        return [...prevSelected, Id];
      }
    });
  };

  const handleOpenModal = item => {
    setModalLists([]);
    props.getModalList(item);
    setLatestPO(item.poNumber);
    setShowmodal(!showModal);
  };

  const handleSendWhatsApp = item => {
    props.sendWhatsApp(item);
  };
  const handlePdf = item => {
    props.handlePdf(item);
  };
  const handleExcel = item => {
    props.handleExcel(item);
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
          title={' List of Orders'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        {filterArray ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginBottom: 10,
              alignItems: 'center',
            }}>
            {/* Search Bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1, // Allows the search bar to take up available space
                borderWidth: 1,
                borderColor: '#D1D1D1',
                borderRadius: 20,
                backgroundColor: '#F9F9F9',
                paddingHorizontal: 15,
                // paddingVertical: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
              <Image
                source={searchImg}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: '#7F7F81',
                  marginRight: 10,
                }}
              />
              <TextInput
                style={[
                  {flex: 1, color: '#000'},
                  Platform.OS === 'ios' && {paddingVertical: 12}, // Apply padding only for iOS
                ]}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                value={recName}
                onFocus={() => (isKeyboard.current = true)}
                onChangeText={filterPets}
              />
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: '#D1D1D1',
                borderRadius: 20,
                backgroundColor: '#F9F9F9',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => {
                set_showFilteredList(true);
                setFilterVisible(!isFilterVisible);
              }}>
              <Image
                source={filterImg}
                style={{
                  height: 25,
                  width: 25,
                  tintColor: showFilteredList ? color.color2 : '#7F7F81',
                  marginRight: 10,
                }}
              />
              {filterCount ? (
                <Text
                  style={{
                    color: '#7F7F81',
                    fontSize: 14,
                    backgroundColor: color.color2,
                    borderRadius: 30,
                    color: '#fff',
                    padding: 5,
                  }}>
                  {filterCount}
                </Text>
              ) : (
                <Text style={{color: '#7F7F81', fontSize: 14}}>{'Filter'}</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        {filterArray && filterArray.length > 0 ? (
          <View style={CommonStyles.listCommonHeader1}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'PO'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1.3, textAlign: 'center'},
              ]}>
              {'Vendor'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'RM/Fabric'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'PO Status'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1.2, textAlign: 'center', marginRight: wp('2%')},
              ]}>
              {'Action'}
            </Text>
          </View>
        ) : (
          <View style={CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? (
              <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                {Constant.noRecFound}
              </Text>
            ) : null}
          </View>
        )}

        <View style={CommonStyles.listStyle}>
          {showFilteredList ? (
            <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              onEndReached={() => fetchMore()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() =>
                props.isLoading && <ActivityIndicator size="large" />
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowmodal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowmodal(false)}>
          <View style={styles.companyModalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.companyModalContainer}>
          <View style={styles.companyModalHeader}>
            <View />
            <Text style={styles.companyModalHeaderText}>{'Style Pop Up'}</Text>
            <TouchableOpacity
              onPress={() => {
                setShowmodal(false);
                setquery('');
              }}>
              <Image
                source={require('./../../../../assets/images/png/close.png')}
                style={{width: 30, height: 30, tintColor: colors.color2}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.companyModalSearchBarContainer}>
            <View style={styles.companyModalSearchBarContainer}>
              <View style={{flex: 1, marginRight: 10}}>
                <TextInput
                  style={styles.companyModalSearchBar}
                  placeholder="Search ..."
                  placeholderTextColor="#aaa"
                  onChangeText={text => setquery(text)}
                />
              </View>

              <TouchableOpacity
                style={styles.searchButton1}
                onPress={handleSelectFromModal}>
                <Text style={styles.searchbuttonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.companyModalItemContentHeader}>
            <View
              style={[
                styles.checkboxItem,
                {marginTop: hp('2%'), marginBottom: hp('2%'), flex: 0.5},
              ]}>
              <CustomCheckBox
                isChecked={false}
                onToggle={() => console.log('hi')}
              />
            </View>

            <Text style={styles.companyModalDropdownItemTextHeader}>Name</Text>
            <View style={{flex: 0.2}} />

            <Text style={styles.companyModalDropdownItemTextHeader}>
              Contacts
            </Text>
            <View style={{flex: 0.2}} />

            <Text style={styles.companyModalDropdownItemTextHeader}>
              Email Id
            </Text>
            <View style={{flex: 0.2}} />
            <Text style={styles.companyModalDropdownItemTextHeader}>Dept</Text>
          </View>

          <View style={styles.companyModalListContainer}>
            {filteredCompanyList.length === 0 ? (
              <Text style={styles.companyModalNoResultsText}>
                No results found
              </Text>
            ) : (
              <FlatList
                data={filteredCompanyList}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={styles.companyModalDropdownItem}
                    onPress={() => toggleSelection(item.vendorId)}>
                    <View style={styles.companyModalItemContent}>
                      <View
                        style={[
                          styles.checkboxItem,
                          {
                            marginTop: hp('2%'),
                            marginBottom: hp('2%'),
                            flex: 0.5,
                          },
                        ]}>
                        <CustomCheckBox
                          isChecked={selectedIdxs.includes(item.vendorId)}
                          onToggle={() => toggleSelection(item.vendorId)}
                        />
                      </View>

                      <Text style={styles.companyModalDropdownItemText}>
                        {item.vendor_name}
                      </Text>
                      <View style={{flex: 0.2}} />
                      <Text style={styles.companyModalDropdownItemText}>
                        {item.ph}
                      </Text>
                      <View style={{flex: 0.2}} />
                      <Text style={styles.companyModalDropdownItemText}>
                        {item.email_id}
                      </Text>
                      <View style={{flex: 0.2}} />
                      <Text style={styles.companyModalDropdownItemText}>
                        {item.dba}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.companyModalSeparator} />
                )}
                contentContainerStyle={styles.companyModalFlatListContent}
              />
            )}
          </View>
        </View>
      </Modal>

      <FilterModal
        isVisible={isFilterVisible}
        categoriesList={categories}
        selectedCategoryListAPI={'getSelectedCategoryList_poApproval'}
        onClose={() => setFilterVisible(false)}
        applyFilterFxn={applyFilterFxn}
        clearFilter={clearFilter}
        reqBody={filterReqBody}
      />

      <AddNewItem navItem={'CreatePurchaseOrderDraft'} />

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

      {props.MainLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default POApproveUI;

const getStyles = colors =>
  StyleSheet.create({
    companyModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    companyModalContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 10,
      height: '70%',
      paddingVertical: 8,
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },

    companyModalHeader: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    companyModalHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    companyModalSearchBarContainer: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    companyModalSearchBar: {
      height: 40,
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      color: '#333',
      borderWidth: 1,
      borderColor: '#ddd',
      flex: 1,
    },
    searchButton1: {
      height: 40,
      backgroundColor: colors.color2,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginLeft: 10,
    },
    searchbuttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },

    companyModalSearchBar: {
      height: 40,
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      color: '#333',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    companyModalListContainer: {
      flex: 1,
      marginTop: 8,
    },
    companyModalFlatListContent: {
      paddingVertical: 4,
    },
    companyModalNoResultsText: {
      color: '#888',
      textAlign: 'center',
      padding: 10,
      fontSize: 16,
    },
    companyModalDropdownItem: {
      paddingVertical: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    companyModalItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 4,
      paddingHorizontal: 12,
    },
    companyModalItemContentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 4,
      paddingHorizontal: 12,
      backgroundColor: '#d8d8d8',
    },
    companyModalDropdownItemText: {
      fontSize: 15,
      color: '#333',
      flex: 1,
      textAlign: 'center',
    },
    companyModalDropdownItemTextHeader: {
      fontSize: 16,
      color: '#333',
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
