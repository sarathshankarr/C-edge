import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Modal, ScrollView, TextInput, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as APIServiceCall from './../apiCalls/apiCallsComponent'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import TextInputComponent from './textInputComponent';
import { extractLocationIds } from '../constants/constant';
import color from '../commonStyles/color';


const CommonHeader = ({ title, showDrawerButton }) => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [showList1, set_showList1] = useState(false);
  const [showList2, set_showList2] = useState(false);
  const [styleTypeID, set_styleTypeID] = useState('');
  const [item1, set_item1] = useState('');
  const [itemId1, set_itemId1] = useState(0);
  const [item2, set_item2] = useState('');
  const [itemId2, set_itemId2] = useState(0);
  const [loadingList2, setLoadingList2] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [enteredTxt, setEnteredTxt] = useState("");
  const [scannedValue, setScannedValue] = useState("");

  const [companyList, setcompanyList] = useState({});
  const [selectedCompanyName, setselectedCompanyName] = useState('')
  const [selectedCompanyId, setselectedCompanyId] = useState(0);
  const [showCompanyList, setshowCompanyList] = useState(false);

  const dropdownButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });


  let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
  let closeImg = require('./../../../assets/images/png/close1.png');

  const [styleList2, set_styleList2] = useState([]);
  const [filterStyleList2, set_filterStyleList2] = useState([]);

  const [filterStyleList1, set_filterStyleList1] = useState([
    { id: 1, name: 'Style Wise', labelId: 'style' },
    { id: 2, name: 'BuyerPO Wise', labelId: 'buyerpo' },
    { id: 3, name: 'Project / Brand Wise', labelId: 'project' },
    { id: 4, name: 'Customer Style No Wise', labelId: 'customer' },
    { id: 5, name: 'Order Wise', labelId: 'order' },
    { id: 6, name: 'Bar code', labelId: 'barcode' }
  ]);


  const [styleList1, set_styleList1] = useState([
    { id: 1, name: 'Style Wise', labelId: 'style' },
    { id: 2, name: 'BuyerPO Wise', labelId: 'buyerpo' },
    { id: 3, name: 'Project / Brand Wise', labelId: 'project' },
    { id: 4, name: 'Customer Style No Wise', labelId: 'customer' },
    { id: 5, name: 'Order Wise', labelId: 'order' },
    { id: 6, name: 'Bar code', labelId: 'barcode' }
  ]);





  const loadAllNotifications = async () => {

    // let userName = await AsyncStorage.getItem('userName');
    // let userPsd = await AsyncStorage.getItem('userPsd');
    let userId = await AsyncStorage.getItem('userId');
    let roleId = await AsyncStorage.getItem('roleId');
    let companyId = await AsyncStorage.getItem('companyId');

    if (!userId || !roleId || !companyId) {
      console.log("NOt calling notifications API, somevalue is missing ", userId, roleId, companyId);
      return;
    }

    // set_isLoading(true);
    let obj = {
      "userId": userId,
      "roleId": roleId,
      "companyId": companyId
    }

    let GETNOTIFICATIONSAPIObj = await APIServiceCall.loadAllNotifications(obj);
    // set_isLoading(false);

    if (GETNOTIFICATIONSAPIObj && GETNOTIFICATIONSAPIObj.statusData) {

      if (GETNOTIFICATIONSAPIObj && GETNOTIFICATIONSAPIObj.responseData) {
        // set_itemsArray(GETNOTIFICATIONSAPIObj.responseData);
        // set_latestId(GETNOTIFICATIONSAPIObj.responseData[0]?.id || 0);
        const unreadNotifications = GETNOTIFICATIONSAPIObj?.responseData?.filter(notification => notification.m_read === 0);
        setUnreadCount(unreadNotifications?.length);
        console.log("notifications No : ", unreadCount, unreadNotifications?.length);
      }
    } else {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      console.log("Error in Fetching notifications==> ")
    }

    if (GETNOTIFICATIONSAPIObj && GETNOTIFICATIONSAPIObj.error) {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
      console.log("Error in Fetching notifications, the error is ==> ", GETNOTIFICATIONSAPIObj.error)
    }

  };



  const loadStyleList = async () => {
    setLoadingList2(true);
    let userName = await AsyncStorage.getItem('userName');
    let userPsd = await AsyncStorage.getItem('userPsd');
    let roleId = await AsyncStorage.getItem('roleId');
    let companyObj = await AsyncStorage.getItem('companyObj');

    let obj = {
      "username": userName,
      "password": userPsd,
      "process": styleTypeID,
      "company": JSON.parse(companyObj),
    }

    let STYLELISTAPIOBJ = await APIServiceCall.loadStyleStatusLists(obj);
    // set_isLoading(false);

    if (STYLELISTAPIOBJ && STYLELISTAPIOBJ.statusData) {

      if (STYLELISTAPIOBJ && STYLELISTAPIOBJ.responseData) {
        const filtered = Object.entries(STYLELISTAPIOBJ.responseData).map(([key, value], index) => ({
          id: index,
          k: key,
          name: value,
        }));

        set_filterStyleList2(filtered);
        set_styleList2(filtered);

        console.log("filtered===> ", filtered[0]);
      }
    } else {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      console.log("Error in Fetching loadStyleList==> ")
    }

    if (STYLELISTAPIOBJ && STYLELISTAPIOBJ.error) {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
      console.log("Error in Fetching loadStyleList, the error is ==> ", STYLELISTAPIOBJ.error)
    }
    setLoadingList2(false);

  };

  const getCompanyObj = async (newCompanyID) => {
    

    let obj = {
      "companyId": newCompanyID
    }

    let GETNEWCOMPANYOBJ = await APIServiceCall.getNewCompanyObject(obj);
    // set_isLoading(false);

    if (GETNEWCOMPANYOBJ && GETNEWCOMPANYOBJ.statusData) {

      if (GETNEWCOMPANYOBJ && GETNEWCOMPANYOBJ.responseData) {
        // console.log("GETNEWCOMPANYOBJ No : ", GETNEWCOMPANYOBJ.responseData);
        await AsyncStorage.setItem('companyObj', JSON.stringify(GETNEWCOMPANYOBJ.responseData));
        await AsyncStorage.setItem('companyId', (newCompanyID).toString());
        
        let locIds = await AsyncStorage.getItem('locIds');
        const extractedLocationIds = await extractLocationIds(locIds, newCompanyID)
        await AsyncStorage.setItem('CurrentCompanyLocations', extractedLocationIds);
         
        let curr = await AsyncStorage.getItem('companyId');
         console.log("CurrentCompanyLocation" , curr);
      }
    } else {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false);
      console.log("Error in Fetching GETNEWCOMPANYOBJ==> ")
    }

    if (GETNEWCOMPANYOBJ && GETNEWCOMPANYOBJ.error) {
      // popUpAction(Constant.SERVICE_FAIL_MSG, Constant.DefaultAlert_MSG, 'OK', true, false)
      console.log("Error in  GETNEWCOMPANYOBJ ==> ", GETNEWCOMPANYOBJ.error)
    }

  };



  useEffect(() => {
    if (styleTypeID) {
      if (itemId1 === 6) {
        setShowQr(true);
        return;
      } else {
        setShowQr(false);
        set_itemId2(0);
        set_item2('');
        set_showList2(false);
        loadStyleList();
      }

    }
  }, [styleTypeID])

  useEffect(() => {
    if (scannedValue) {
      setScannedValue('');
      set_item1('');
      set_item2('');
      set_itemId1(0);
      set_itemId2(0);
      setEnteredTxt('');
      set_styleTypeID('');
      setShowQr(false);
      set_filterStyleList2([]);
      navigation.navigate('StyleProcessWorkFlow', { 'process': styleTypeID, 'style': scannedValue });
    }

  }, [scannedValue])

  useEffect(() => {
    const interval = setInterval(() => {
      loadAllNotifications();
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadAllNotifications();
    getCompaniesList()
  }, [])

  const getCompaniesList = async () => {
    try {
      let companiesList = await AsyncStorage.getItem('CompaniesList');
      console.log("Companies list in CH ===> ", companiesList);

      const parsedList = companiesList ? JSON.parse(companiesList) : {};
      setcompanyList(parsedList);

      if (Object.keys(parsedList).length > 0) {
        const [[firstKey, firstValue]] = Object.entries(parsedList);
        setselectedCompanyId(firstKey);
        setselectedCompanyName(firstValue);
      } else {
        console.log("No companies found");
      }
    } catch (error) {
      console.error("Error fetching companies list: ", error);
    }
  };


  const handleSearchList1 = text => {
    if (text.trim().length > 0) {
      const filtered = styleList1.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase())
      );
      set_filterStyleList1(filtered);
    } else {
      set_filterStyleList1(styleList1);
    }
  };

  const handleSearchList2 = text => {
    setLoadingList2(true);
    set_filterStyleList2([]);
    if (text.trim().length > 0) {
      const filtered = styleList2.filter(fabric =>
        fabric.name.toLowerCase().includes(text.toLowerCase())
      );
      set_filterStyleList2(filtered);
    } else {
      set_filterStyleList2(styleList2);
    }
    setLoadingList2(false);
  };

  const actionOnList1 = (id, name, type) => {
    set_item1(name);
    set_itemId1(id);
    set_styleTypeID(type);
    set_showList1(false);
  }

  const actionOnList2 = (id, name) => {
    set_item2(name);
    set_itemId2(id);
    set_showList2(false);
  }

  const handleSave = () => {
    setModalVisible(false);
    if (!styleTypeID || (!itemId2 && !showQr) || (enteredTxt?.trim()?.length === 0 && showQr)) {
      console.log("not going to search ");
      return;
    }
    set_item1('');
    set_item2('');
    set_itemId1(0);
    set_itemId2(0);
    setEnteredTxt('');
    set_styleTypeID('');
    setShowQr(false);
    set_filterStyleList2([]);
    if (showQr) {
      navigation.navigate('StyleProcessWorkFlow', { 'process': styleTypeID, 'style': enteredTxt })
    } else {
      navigation.navigate('StyleProcessWorkFlow', { 'process': styleTypeID, 'style': itemId2 })
    }
  }

  const handleCloseInModal = () => {
    setModalVisible(false);
    set_item1('');
    set_item2('');
    set_itemId1(0);
    set_itemId2(0);
    setEnteredTxt('');
    set_styleTypeID('');
    setShowQr(false);
    set_filterStyleList2([]);
  }

  const handleScan = () => {
    console.log("Scan CLicked");
    setModalVisible(false);
    set_item1('');
    set_item2('');
    set_itemId1(0);
    set_itemId2(0);
    setEnteredTxt('');
    set_styleTypeID('');
    setShowQr(false);
    set_filterStyleList2([]);
    // navigation.navigate('ScanQRPage');
    navigation.navigate('ScanQRPage', {
      onScanSuccess: (scannedValue) => {
        console.log("Scanned Code: ", scannedValue);
        if (scannedValue && scannedValue[0] === 'W') {
          setScannedValue(scannedValue);
        } else {
          Alert.alert("Please Scan a Valid Barcode ", scannedValue);
        }
      }
    });

  }




  // const handleSelectCompany = async (id , name) => {
  //   console.log("changin compnay===> ", id, name);
  //   setselectedCompanyId(id);
  //   setselectedCompanyName(name);
  //   setshowCompanyList(false);
  //   await getCompanyObj(id);

  // };

  // const openDropdown = () => {
  //   dropdownButtonRef.current.measure((fx, fy, width, height, px, py) => {
  //     setDropdownPosition({ top: py + height, left: px, width });
  //     setshowCompanyList(true);
  //   });
  // };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showDrawerButton ? (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              resizeMode="contain"
              source={require('../../../assets/images/png/menu.png')}
              style={styles.menuimg}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              source={require('../../../assets/images/png/back_arrow.png')}
              style={styles.menuimg}
            />
          </TouchableOpacity>
        )}

        {/* {Object.keys(companyList).length > 0 && <View style={styles.companyDropdownContainer}>

          <TouchableOpacity
            ref={dropdownButtonRef}
            style={styles.dropdownButton}
            onPress={openDropdown}
          >
            <Text style={{ color: '#000' }}>{selectedCompanyId ? selectedCompanyName : "Company"}</Text>
            <Image source={downArrowImg} style={styles.dropdownArrowIcon} />
          </TouchableOpacity>

          {showCompanyList && (
            <Modal transparent animationType="none" onRequestClose={() => setshowCompanyList(false)}>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setshowCompanyList(false)}
              >
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                    },
                  ]}
                >

                  {Object.keys(companyList).length === 0 ? (
                    <Text style={{ color: '#000', textAlign: 'center', padding: 10 }}>No results found</Text>
                  ) : (
                    <FlatList
                      data={Object.keys(companyList)}
                      keyExtractor={(item) => item.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => handleSelectCompany(item, companyList[item])}
                        >
                          <Text style={{ color: '#000' }}>{companyList[item]}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}

                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>} */}
        {/* <Text style={{color:'#fff', fontWeight:'bold', marginLeft:15,fontSize:22,fontFamily:'serif'}}>C-EDGE</Text> */}
        <Text 
         style={{
           color: '#FFFFFF', 
           fontWeight: 'bold', 
           marginLeft: 20, 
           fontSize: 24, 
           fontFamily: 'serif', 
           letterSpacing: 1, 
           textTransform: 'uppercase', 
           alignSelf: 'center'
         }}
        >
          C-EDGE
        </Text>






      </View>

      <View style={styles.leftSection}>


        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Image
            resizeMode="contain"
            // source={require('../../../assets/images/png/searchIcon.png')}
            // source={require('../../../assets/images/png/actionItem.png')}
            source={require('../../../assets/images/png/sort.png')}
            style={styles.menuimg2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Image
            resizeMode="contain"
            source={require('../../../assets/images/png/notification.png')}
            style={styles.menuimg1}
          />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>


            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Style Status</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseInModal}
              >
                <Image source={closeImg} style={styles.modalCloseIcon} />
              </TouchableOpacity>
            </View>


            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('2%'), backgroundColor: '#ffffff' }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%") }}
                onPress={() => { set_showList1(!showList1) }}
              >
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={itemId1 ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Style Type '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{itemId1 ? item1 : 'Select '}</Text>
                  </View>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showList1 && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchList1}
                    placeholderTextColor="#000"
                  />
                  <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                    {filterStyleList1.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filterStyleList1.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnList1(item.id, item.name, item.labelId)}
                        >
                          <Text style={{ color: '#000' }}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {!showQr && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('2%'), backgroundColor: '#ffffff' }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: "#D8D8D8", borderRadius: hp("0.5%"), width: wp("90%") }}
                onPress={() => { set_showList2(!showList2) }}
              >
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={itemId2 ? [styles.dropTextLightStyle] : [styles.dropTextInputStyle]}>{'Style '}</Text>
                    <Text style={[styles.dropTextInputStyle]}>{itemId2 ? item2 : 'Select '}</Text>
                  </View>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showList2 && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchList2}
                    placeholderTextColor="#000"
                  />
                  {loadingList2 ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : (
                    <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
                      {filterStyleList2.length === 0 ? (
                        <Text style={styles.noCategoriesText}>
                          Sorry, no results found!
                        </Text>
                      ) : (
                        filterStyleList2.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownOption}
                            onPress={() => actionOnList2(item.k, item.name)}
                          >
                            <Text style={{ color: '#000' }}>{item.name}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>}

            {/* {showQr &&
              (<View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', width:'90%' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('1%'), width:'50%' }} >
                  <TextInputComponent
                    inputText={enteredTxt}
                    labelText={'Style Name'}
                    isEditable={true}
                    maxLengthVal={200}
                    autoCapitalize={"none"}
                    isBackground={'#dedede'}
                    setValue={(textAnswer) => { setEnteredTxt(textAnswer) }}
                  />
                </View>

                <View style={{flexDirection:'column', width:'50%', alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => handleScan()}>
                    <Image source={require('../../../assets/images/png/scan.png')} style={{ height: 20, width: 20 }} />
                  </TouchableOpacity>
                  <Text style={{color:'#000', }}>Scan</Text>
                </View>


              </View>
              )

            } */}

            {showQr && (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginVertical: hp('2%')
              }}>
                <View style={{
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: '75%',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 10,
                  padding: hp('1%')
                }} >
                  <Text style={{
                    color: '#666',
                    fontSize: hp('2%'),
                    marginBottom: hp('0.5%')
                  }}>Style Name</Text>

                  <TextInput
                    value={enteredTxt}
                    onChangeText={(text) => setEnteredTxt(text)}
                    placeholder="Enter Style Name"
                    maxLength={200}
                    style={{
                      height: hp('5%'),
                      fontSize: hp('2%'),
                      backgroundColor: '#fff',
                      paddingHorizontal: wp('2%'),
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 5,
                      color: '#333',
                      width: '100%',
                    }}
                  />
                </View>

                {/* QR Scan Button */}
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '25%',
                  padding: hp('1%'),
                  borderColor: '#dcdcdc',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,

                }}>
                  <TouchableOpacity onPress={() => handleScan()} style={{ elevation: 10 }}>
                    <Image source={require('../../../assets/images/png/scan.png')} style={{
                      height: 40,
                      width: 40,
                      marginBottom: hp('0.5%'),

                    }} />
                  </TouchableOpacity>
                  <Text style={{
                    color: '#000',
                    fontSize: hp('1.8%'),
                    fontWeight: '500',
                    marginTop: hp('0.5%')
                  }}>Scan</Text>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false)
                  set_item1('');
                  set_item2('');
                  set_itemId1(0);
                  set_itemId2(0);
                  set_filterStyleList2([]);
                }}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSave}
              >
                <Text style={styles.searchbuttonText}>Search</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 17,
    backgroundColor: color.color2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex:1,
  },
  menuimg: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    tintColor: "white",
  },
  menuimg1: {
    height: 25,
    width: 25,
    tintColor: "white",
  },
  menuimg2: {
    height: 20,
    width: 20,
    tintColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: 'white',
  },
  notificationButton: {
    justifyContent: 'flex-end',
    marginRight: 15
  },
  unreadBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 1,
    minWidth: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  SectionStyle1: {
    flexDirection: "row",
    alignItems: "center",
    height: hp("7%"),
    width: wp("75%"),
    borderRadius: hp("0.5%"),
  },

  imageStyle: {
    height: 50,
    width: 50,
    aspectRatio: 1,
    marginRight: 20,
    resizeMode: 'contain',
  },

  dropTextInputStyle: {
    fontWeight: "normal",
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: "300",
    fontSize: 12,
    width: wp("60%"),
    alignSelf: 'flex-start',
    marginTop: hp("1%"),
    marginLeft: wp('4%'),
    color: '#000'
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
    alignSelf: 'center',
    width: '100%',
    // backgroundColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#e0e0e0',
    borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
    borderWidth: 1,
    marginTop:3
  },
  noCategoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    marginTop: '20%',
    // backgroundColor:'transparent'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderRadius: 20,
    width: '95%',
    marginHorizontal: 10
  },
  modalButton: {
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    width: '100%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },

  modalTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  modalCloseButton: {
    padding: 10,
  },

  modalCloseIcon: {
    tintColor: 'red',
    height: 20,
    width: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp("90%"),
    marginTop: hp('5%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: '#ffffff',
  },

  closeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#D8D8D8',
    borderRadius: hp("0.5%"),
    backgroundColor: '#f8f8f8',
    marginRight: 10,
  },

  searchButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#D8D8D8',
    borderRadius: hp("0.5%"),
    backgroundColor: color.color2,
  },

  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  searchbuttonText: {
    fontSize: 16,
    color: '#fff',
  },

  companyDropdownContainer: {
    position: 'relative',
    zIndex: 1000,
    backgroundColor: '#fff',
    // width: '50%',
    borderRadius: 10,
    marginLeft: 15,

  },

  headerText: {
    color: 'white',
    fontSize: 18,
  },
  dropdownButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: 210,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    maxHeight: 200,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
  },
  dropdownArrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
});

export default CommonHeader;
