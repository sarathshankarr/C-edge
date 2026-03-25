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
import * as Constant from './../../../utils/constants/constant';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import {ColorContext} from './../../colorTheme/colorTheme';
import CustomCheckBox2 from './CustomCheckBox2';

let closeImg = require('./.././../../../assets/images/png/close1.png');

const ViewStockIssueUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
      if (props.itemsObj) {
        setStockIssueObject(props.itemsObj);
        if(props.itemsObj?.status === 1){
          setSelectAllCheckBox(true);
        }
      }
      if (props.itemsObj?.issueList) {
        setRows(props.itemsObj?.issueList);
      }
      console.log(stockIssueObject)
  }, [props.itemsObj]);


  const [stockIssueObject, setStockIssueObject] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [selectedIdxs, setSelectedIdxs] = useState([]);

  const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);

  const checkedItems = useRef(new Map()); // ← persists across renders
  // Function to handle selection for From Location

  const backAction = async () => {
    props.backBtnAction();
  };

  let allSelected = -1;

  const toggleSelection = item => {
    if (item.sic_is_checked===1) return;
    setSelectedIdxs(prevIds => {
      let updated;
    
      if (prevIds.includes(item.sic_id)) {
        checkedItems.current.delete(item.sic_id);
        item.sic_approve_qty = 0.0;
        updated = prevIds.filter(id => id !== item.sic_id);
      } else {
        item.sic_approve_qty = item.sic_issue_qty;
        checkedItems.current.set(item.sic_id, item.sic_issue_qty);
        updated = [...prevIds, item.sic_id];
      }
    
      console.log(checkedItems.current);
      console.log([...checkedItems.current.entries()]);
      console.log([...checkedItems.current.keys()]);
      console.log([...checkedItems.current.values()]);
    
      const selectableCount = rows.filter(row => row.sic_is_checked === 0).length;
    const selectedCount = selectedIdxs.length;
  
    if (selectedCount === 0) allSelected = -1;
    else if (selectedCount === selectableCount) allSelected = 1;
    else allSelected = 0;
      return updated;
    });
    };


  const handleInputChange = (index, id, field, value) => {
    console.log('handle input change', index, field, value);
    const updatedRows = [...rows];
    updatedRows[index] = {...updatedRows[index], [field]: value};
    checkedItems.current.set(id, Number(value));
    console.log('checked id', id);
    console.log('checked items after input change', [...checkedItems.current.entries()]);

    setRows(updatedRows);
  };

  const totalSentQtyy = rows.reduce(
    (sum, row) => sum + Number(row.availQtyStr || 0),
    0,
  );

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  // const allSelected = useMemo(() => {
  //   const selectableCount = rows.filter(row => row.sic_is_checked === 0).length;
  //   const selectedCount = selectedIdxs.length;
  
  //   if (selectedCount === 0) return -1;
  //   if (selectedCount === selectableCount) return 1;
  //   return 0;
  // }, [selectedIdxs, rows]);
  
  const updateAllIndexes = () => {
    const editableIds = rows.filter(r => r.sic_is_checked===0).map(r => r.sic_id);
    // console.log('selectallcheckbox before', selectAllCheckBox);
    const newSelected = selectAllCheckBox
      ? []
      : [...selectedIdxs, ...editableIds];
      setSelectAllCheckBox(!selectAllCheckBox);
    // console.log('selectallcheckbox after', selectAllCheckBox);
    setSelectedIdxs(newSelected);
    if(newSelected.length>0) {
      rows.forEach(row => {
        if(newSelected.includes(row.sic_id)) {
          row.sic_approve_qty = row.sic_issue_qty;
          checkedItems.current.set(row.sic_id, row.sic_issue_qty);
        }
    }) } else {
      rows.forEach(row => {
        row.sic_is_checked===0 ? row.sic_approve_qty = 0.0 : row.sic_approve_qty;
        checkedItems.current.delete(row.sic_id);
      })
    }
    console.log([...checkedItems.current.entries()]);
    console.log(editableIds);
    const selectableCount = editableIds.length;
    const selectedCount = selectedIdxs.length;
  
    if (selectedCount === 0) allSelected = -1;
    else if (selectedCount === selectableCount) allSelected = 1;
    else allSelected = 0;
  };

  const actionOnStock = (status) => {
      console.log(checkedItems.current.keys());
      console.log(checkedItems.current.values());
      const ids = [...checkedItems.current.keys()].join(',');
      const values = [...checkedItems.current.values()].join(',');
      approveObject = {
        locId: stockIssueObject?.sim_location_id || 0,
        id: stockIssueObject?.sim_id || 0,
        stts: status,
        checkedValues: ids,
        enteredValues: values,
     }
     console.log('approve object', approveObject);
     props.approveItems(approveObject);

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
          title={'Stock Issue View'}
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

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap:10}}>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '600', width: 70}}>Process</Text>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>:</Text>
            <Text style={{fontSize: 16, color: '#000'}}>{stockIssueObject?.typeOfStock}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10,  gap:10}}>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '600', width: 70}}>Location</Text>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>:</Text>
            <Text style={{fontSize: 16, color: '#000'}}>{stockIssueObject?.locName}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10,  gap:10}}>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '600',width: 70}}>WO No</Text>
            <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>:</Text>
            <Text style={{fontSize: 16, color: '#000'}}>{stockIssueObject?.woNo}</Text>
          </View>

          {rows.length > 0 && (
            <View style={styles.wrapper}>
              <ScrollView nestedScrollEnabled={true} horizontal>
                <View style={styles.table}>
                  <View style={styles.table_head}>
                    <View style={{width: 60}}>
                        <CustomCheckBox2
                            isChecked={(rows.filter(row => row.sic_is_checked === 0).length)===selectedIdxs.length}
                            isIndeterminate={selectedIdxs.length>0 && (rows.filter(row => row.sic_is_checked === 0).length)>selectedIdxs.length}
                            onToggle={updateAllIndexes}
                            disabled={stockIssueObject?.status === 0 ? false : true}
                        />
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Type </Text>
                    </View>

                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>RM/Fabric</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Size</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>To Style</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Issued Qty</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Approve Qty</Text>
                    </View>
                  </View>


                  {rows.length > 0 &&
                    rows.map((row, index) => (
                      <View key={index} style={styles.table_body_single_row}>
                        <View style={{width: 60, opacity: row.sic_is_checked===1 ? 0.4 : 1,}}>
                        <CustomCheckBox2
                            isChecked={
                              selectedIdxs.includes(row.sic_id) ||
                              row.sic_is_checked===1
                            }
                            isIndeterminate={false}
                            onToggle={() => toggleSelection(row)}
                            disabled={row.sic_is_checked === 0 ? false : true}
                          />
                        </View>

                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.trimsType}</Text>
                        </View>
                       

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.fabRmName}</Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.size}</Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.stylename}</Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>
                            {row.sic_issue_qty}
                          </Text>
                        </View>

                        <View style={{width: 10}} />

                        {/* Rate */}
                        <View style={{width: 100}}>
                        <TextInput
                            style={[
                              styles.table_data_input,
                              {
                                backgroundColor: row.sic_is_checked === 0 ? '#fff' : '#f0f0f0',
                                color: row.sic_is_checked === 0 ? '#000' : '#999',
                              },
                            ]}
                            value={
                              row.sic_approve_qty !== undefined && row.sic_approve_qty !== null
                                ? String(row.sic_approve_qty)
                                : "0"
                            }
                            onChangeText={input =>
                              handleInputChange(index, row.sic_id, 'sic_approve_qty', input)
                            }
                            editable={row.sic_is_checked === 0 ? true : false}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    ))}

                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle1}>
         <View style={[styles.mainComponentStyle]}>
            {stockIssueObject?.status === 0 ? <TouchableOpacity style={styles.leftButtonstyle1} onPress={() =>  actionOnStock(1)}>

                <Text style={[styles.leftBtnTextStyle]}>{"Approve"}</Text>
            </TouchableOpacity> : null}

            <TouchableOpacity style={styles.leftButtonstyle} onPress={() =>  backAction(0)}>

                <Text style={[styles.leftBtnTextStyle]}>{"Back"}</Text>
            </TouchableOpacity>

            {stockIssueObject?.status === 0 ?  <TouchableOpacity style={styles.leftButtonstyle} onPress={() =>  actionOnStock(2)}>

                <Text style={[styles.leftBtnTextStyle]}>{"Close Request"}</Text>
            </TouchableOpacity> : null}

            </View>
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

export default ViewStockIssueUI;

const getStyles = colors =>
  StyleSheet.create({
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
      fontWeight: 300,
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
      marginTop: hp('5%'),
      width: '100%',
    },
    table: {
      width: '100%',
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
      // backgroundColor: '#5177c0',
      alignItems: 'center',
      paddingVertical: 7,
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
      color: '#000',
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
    dropdownContent1: {
      elevation: 5,
      // height: 220,
      maxHeight: 220,
      alignSelf: 'center',
      width: '98%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray',
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
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%',
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
    searchButton: {
      marginTop: 40,
      flex: 1,
      width: '50%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderWidth: 0.5,
      borderColor: '#D8D8D8',
      borderRadius: hp('0.5%'),
      backgroundColor: colors.color2,
    },
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
    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,

      borderColor: '#ccc',
      paddingHorizontal: 4,
      textAlign: 'center',
      backgroundColor: '#fff',
    },

    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%',
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
    mainComponentStyle : {
        width:wp('100%'),
        height:hp('100%'),
        backgroundColor:'white',
        position:"absolute",
        padding:20,
        justifyContent:'space-between',
        flexDirection:"row" 
    },
    
    rightButtonstyleEnable: {
        backgroundColor: colors.color2,
        flex:1,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
      },
    
      rightButtonstyleDisable: {
        backgroundColor: "grey",
        flex:1,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
      },
    
      leftButtonstyle : {
        // backgroundColor: "white",
        backgroundColor: colors.color2,
        flex:1.3,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
        borderColor:'black',
        borderWidth:1.0,
        marginHorizontal:wp('2%'),
      },
    
      leftButtonstyle1 : {
        // backgroundColor: "white",
        backgroundColor: colors.color2,
        flex:1.3,
        height: hp("7%"),
        borderRadius: hp("0.5%"),
        justifyContent: "center",
        alignItems:'center',
        borderColor:'black',
        borderWidth:1.0,
        marginHorizontal:wp('2%'),
      },
    
      rightBtnTextStyle: {
        color: 'white',
        fontSize: fonts.fontMedium,
        fontWeight : '700',
        marginLeft: wp("1%"),
        marginRight: wp("1%"),
        textAlign:'center'
      },
    
      leftBtnTextStyle: {
        color: '#fff',
        fontSize: fonts.fontMedium,
        fontWeight : '700',
        marginLeft: wp("1%"),
        marginRight: wp("1%"),
        textAlign:'center'
    },    
  });


