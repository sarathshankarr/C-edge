import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {getEnvironment} from '../../../config/environment/environmentConfig';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import color from '../../../utils/commonStyles/color';
import { ColorContext } from '../../colorTheme/colorTheme';
const Environment = getEnvironment();

let arrowImg = require('./../../../../assets/images/png/arrowImg.png');
// let shirt3 = require('./../../../../assets/images/png/shirt3.jpeg');


const HeadingItemsList = [
  {id: 1, title: 'Production Summary' },
  {id: 2, title: 'View Time and Action' },
  {id: 3, title: 'RM Allocation(BOM)'},
  // {id: 4, title: 'Thread'},
];

const StyleDetailsUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);
  
  const [selectedTab, setSelectedTab] = useState(1);
 

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const rgtBtnAction = () => {
    props.rgtBtnAction();
  };

  const lftBtnAction = () => {
    props.viewProcessFlowAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const sizeDetailsAction = () => {
    props.sizeDetailsAction();
  };
  
  // console.log("styleDetailsList  style1==>",  props.listItems.styleDetailsList.styleSizeDataResponseList )
  // console.log("productionSummary  style2==>",  props.listItems.productionSummary.styleresponselist );
  console.log("timeAndAction  style3==>",  props.listItems.timeAndAction )
  
  
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={CommonStyles.cellBackViewStyle}>
        <View style={[{flexDirection: 'row'}]}>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.size}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 2, textAlign: 'center'},
            ]}>
            {item.sizeQty}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  let imgURL = Environment.uri + 'ImageServlet?Path=' + props.image;

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Details'}
          backBtnAction={() => backBtnAction()}
        />
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}>
        <View style={CommonStyles.headerStyle}>
          <View style={[CommonStyles.topViewStyle]}>
            <View style={CommonStyles.topSubViewStyle}>
              {/* {console.log('Image URL ====>', imgURL)} */}
              <Image
                // borderRadius={100}
                style={[CommonStyles.imgStyle]}
                source={{uri: imgURL}}
              />
            </View>
          </View>

          <View style={{marginTop: hp('5%'), marginBottom: hp('5%')}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'Style No'}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.styleName
                    ? props.itemObj.styleName
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'Fabric'}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.fabricName
                    ? props.itemObj.fabricName
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'Customer Style No '}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.customerStyle
                    ? props.itemObj.customerStyle
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'Shipping Date'}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.shippingDate
                    ? props.itemObj.shippingDate
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'Season'}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.season
                    ? props.itemObj.season
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'FOB Price'}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.fob
                    ? props.itemObj.fob
                    : 'N/A'}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: hp('1%'),
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {'Total Qty'}
                </Text>
                <Text
                  style={[
                    CommonStyles.tylesHeaderTextStyle,
                    {marginLeft: hp('1%')},
                  ]}>
                  {':'}
                </Text>
              </View>
              <View style={{width: '60%', paddingLeft: hp('1%')}}>
                <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>
                  {props.itemObj && props.itemObj.totalQty
                    ? props.itemObj.totalQty
                    : 'N/A'}
                </Text>
              </View>
              {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={sizeDetailsAction}
                  style={styles.buttonStyle}>
                  <Image source={arrowImg} style={styles.arrowIconStyle} />
                </TouchableOpacity>
              </View> */}
            </View>
          </View>

          {props.listItems.styleDetailsList &&
          props.listItems.styleDetailsList.styleSizeDataResponseList &&
          props.listItems.styleDetailsList.styleSizeDataResponseList.length > 0 ? (
            <View style={[CommonStyles.listCommonHeader1, {marginTop: 10}]}>
              <Text
                style={[
                  CommonStyles.tylesHeaderTextStyle,
                  {flex: 1, textAlign: 'center'},
                ]}>
                {'Size'}
              </Text>
              <Text
                style={[
                  CommonStyles.tylesHeaderTextStyle,
                  {flex: 2, textAlign: 'center'},
                ]}>
                {'Quantity'}
              </Text>
              {/* <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left'}]}>{'L'}</Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle,{flex:1,textAlign:'left',}]}>{'XL'}</Text> */}
            </View>
          ) : null}

          {props.listItems.styleDetailsList &&
          props.listItems.styleDetailsList.styleSizeDataResponseList &&
          props.listItems.styleDetailsList.styleSizeDataResponseList.length > 0 ? (
            <View style={[CommonStyles.listStyle1]}>
              <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
                {props?.listItems.styleDetailsList?.styleSizeDataResponseList?.map(
                  (item, index) => (
                    <View key={index}>{renderItem({item, index})}</View>
                  ),
                )}
              </ScrollView>
            </View>
          ) : (
            <View style={CommonStyles.noRecordsFoundStyle}>
              {!props.isLoading ? (
                <Text
                  style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                  {Constant.noRecFound}
                </Text>
              ) : null}
            </View>
          )}

          <View style={{}}>
            <ScrollView
              // horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
               >
              {HeadingItemsList.map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabButton,
                    selectedTab === tab.id && styles.activeTabButton,
                  ]}
                  onPress={() => setSelectedTab(tab.id)}>
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab.id && styles.activeTabText,
                    ]}>
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>


          {selectedTab ==1 && <View  style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>
                <View style={{width: '55%'}}>
                  <Text style={styles.table_head_captions1}>Production Name</Text>
                </View>
                <View style={{width: '2%'}} />
                <View style={{width: '20%'}}>
                  <Text style={styles.table_head_captions1}>Total Qty</Text>
                </View>
                <View style={{width: '2%'}} />
                <View style={{width: '20%'}}>
                  <Text style={styles.table_head_captions}>Processed Qty</Text>
                </View>
                <View style={{width: '1%'}} />

              </View>

              {/* Table Body */}
              {props.listItems.productionSummary && props.listItems.productionSummary.styleresponselist && props.listItems.productionSummary.styleresponselist.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.table_body_single_row,

                    // item.processTotQty <= item.totQty &&
                    //   item.damagedqty === 0 &&
                    //   item.totQty !== 0 && {
                    //     backgroundColor: 'lightgreen',
                    //   },
                    // item.processTotQty > item.totQty &&
                    //   item.damagedqty === 0 &&
                    //   item.totQty !== 0 && {backgroundColor: 'yellow'},
                    // item.damagedqty !== 0 && {backgroundColor: 'orange'},
 
                  ]}>
                  <View style={{width: '55%'}}>
                    <Text style={styles.table_data}>{item.processName}</Text>
                  </View>
                  <View style={{width: '2%'}} />
                  <View style={{width: '20%'}}>
                    <Text style={styles.table_data}>{item.totalqty}</Text>
                  </View>
                  <View style={{width: '2%'}} />
                  <View style={{width: '20%'}}>
                  <Text style={styles.table_data}>{item.processqty}</Text>
                  </View>
                  <View style={{width: '1%'}} />
                </View>
              ))}
            </View>
          </View>}

          {selectedTab ==2 && <View  style={styles.wrapper}>
            <View style={styles.table}>
              {/* Table Head */}
              <View style={styles.table_head}>
                <View style={{width: '35%'}}>
                  <Text style={styles.table_head_captions1}>Process</Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions1}>Start Date</Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>End Date</Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>Actual Start Date</Text>
                </View>
                <View style={{width: '2%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>Actual Start Date</Text>
                </View>
              </View>

              {/* Table Body */}
              {props.listItems.timeAndAction && props.listItems.timeAndAction.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.table_body_single_row,

                    // item.processTotQty <= item.totQty &&
                    //   item.damagedqty === 0 &&
                    //   item.totQty !== 0 && {
                    //     backgroundColor: 'lightgreen',
                    //   },
                    // item.processTotQty > item.totQty &&
                    //   item.damagedqty === 0 &&
                    //   item.totQty !== 0 && {backgroundColor: 'yellow'},
                    // item.damagedqty !== 0 && {backgroundColor: 'orange'},
                  ]}>
                  <View style={{width: '35%'}}>
                    <Text style={styles.table_data}>{item.processName}</Text>
                  </View>
                  <View style={{width: '1%'}} />
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_data}>{item.plannedEndDate}</Text>
                  </View>
                  <View style={{width: '1%'}} />
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_data}>{item.plannedStartDate}</Text>
                  </View>
                  <View style={{width: '1%'}} />
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_data}>{item.actualStartDate}</Text>
                  </View>
                  <View style={{width: '2%'}} />
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_data}>{item.actualEndDate}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>}

          <View style={{height: 200}}></View>
        </View>
      </KeyboardAwareScrollView>

      {/* <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'View Time and Action'}
          leftBtnTitle={'Production Summary'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => rgtBtnAction()}
          leftButtonAction={async () => lftBtnAction()}
        />
      </View> */}

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

export default StyleDetailsUI;

const getStyles = colors =>
  StyleSheet.create({

  buttonStyle: {
    height: hp('5%'),
    width: wp('10%'),
    alignItems: 'flex-end',
  },

  arrowIconStyle: {
    width: wp('6%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  scrollView: {
    // paddingHorizontal: wp("2%"),
    maxHeight: 200,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius:10
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#f3f3f3',
    marginRight: 5,
    marginBottom: 10, // Adds space between rows of tabs
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  activeTabButton: {
    backgroundColor: '#1f74ba',
    elevation: 3, // Slight increase in shadow for active tab
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500', // Makes text slightly bolder for better readability
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wrapper: {
    flex: 1,
    marginTop: hp('2%'),
    width: '100%',
    marginBottom: 10,
    marginHorizontal: 5,
    backgroundColor:'red'
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    // padding: 7,
    width: '100%',
    backgroundColor: colors.color2,
    alignItems: 'center',
  },
  table_head_captions2: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  table_head_captions: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
  },
  table_head_captions1: {
    fontSize: 15,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
  },

  table_body_single_row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table_data: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    alignSelf: 'center',
  },
  table: {
    // margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: '#fff',
  },
  table_data_input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    // paddingHorizontal: 5,
    textAlign: 'center',
  },

});
