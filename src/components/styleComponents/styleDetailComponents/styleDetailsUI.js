import React, {useState, useEffect} from 'react';
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
const Environment = getEnvironment();

let arrowImg = require('./../../../../assets/images/png/arrowImg.png');
// let shirt3 = require('./../../../../assets/images/png/shirt3.jpeg');

const TrimFabricComponent = () => (
  <View style={styles.componentContainer}>
    <Text style={styles.componentText}>Trim Fabric Details</Text>
    <Text style={styles.componentText}>Quantity: 100</Text>
    <Text style={styles.componentText}>Price: $10</Text>
  </View>
);

const MainFabricComponent = () => (
  <View style={styles.componentContainer}>
    <Text style={styles.componentText}>Main Fabric Details</Text>
    <Text style={styles.componentText}>Quantity: 200</Text>
    <Text style={styles.componentText}>Price: $20</Text>
  </View>
);

const LiningComponent = () => (
  <View style={styles.componentContainer}>
    <Text style={styles.componentText}>Lining Details</Text>
    <Text style={styles.componentText}>Quantity: 50</Text>
    <Text style={styles.componentText}>Price: $8</Text>
  </View>
);

const ThreadComponent = () => (
  <View style={styles.componentContainer}>
    <Text style={styles.componentText}>Thread Details</Text>
    <Text style={styles.componentText}>Quantity: 300</Text>
    <Text style={styles.componentText}>Price: $5</Text>
  </View>
);

const HeadingItemsList = [
  {id: 1, title: 'View Time and Action', component: <TrimFabricComponent />},
  {id: 2, title: 'Production Summary', component: <MainFabricComponent />},
  {id: 3, title: 'RM Allocation(BOM)', component: <LiningComponent />},
  {id: 4, title: 'Thread', component: <ThreadComponent />},
];

const StyleDetailsUI = ({route, ...props}) => {
  // console.log(
  //   'style details   ====> ',
  //   props.styleDetailsList.styleSizeDataResponseList,
  // );
  const [selectedTab, setSelectedTab] = useState('Trim Fabric');
  const renderContent = () => {
    const currentTab = HeadingItemsList.find(tab => tab.title === selectedTab);
    return currentTab ? currentTab.component : null;
  };

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

          <View style={{marginTop: hp('5%')}}>
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
                  {'Customer Style No *'}
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
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={sizeDetailsAction}
                  style={styles.buttonStyle}>
                  <Image source={arrowImg} style={styles.arrowIconStyle} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {props.styleDetailsList &&
          props.styleDetailsList.styleSizeDataResponseList &&
          props.styleDetailsList.styleSizeDataResponseList.length > 0 ? (
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

          {props.styleDetailsList &&
          props.styleDetailsList.styleSizeDataResponseList &&
          props.styleDetailsList.styleSizeDataResponseList.length > 0 ? (
            <View style={[CommonStyles.listStyle1]}>
              <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
                {props?.styleDetailsList?.styleSizeDataResponseList?.map(
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

          <View style={styles.tabsContainer}>
          <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
         >
            {HeadingItemsList.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  selectedTab === tab.title && styles.activeTabButton,
                ]}
                onPress={() => setSelectedTab(tab.title)}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.title && styles.activeTabText,
                  ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>

          <View style={styles.contentContainer}>{renderContent()}</View>

          <View style={{height: 200}}></View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'View Time and Action'}
          leftBtnTitle={'Production Summary'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => rgtBtnAction()}
          leftButtonAction={async () => lftBtnAction()}
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



export default StyleDetailsUI;

const styles = StyleSheet.create({
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
    flexWrap: 'wrap',  // This ensures the tabs will wrap to the next line if needed
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#f3f3f3',
    marginRight: 12,
    marginBottom: 10,  // Adds space between rows of tabs
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  activeTabButton: {
    backgroundColor: '#1f74ba' ,
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f9f9f9', // Added light background color for content area
  },
  componentContainer: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    elevation: 2, // Adds shadow to content for depth
    marginBottom: 20, // Spacing between content containers
    maxHeight: 250, // Optional: Prevent large content from overflowing unnecessarily
  },
  componentText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 8,
    lineHeight: 24,
  },
});
