import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  TextInput,
  Alert,
  Button,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import * as Constant from '../../utils/constants/constant';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import ListSearchBar from '../../utils/commonComponents/ListSearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorContext} from '../colorTheme/colorTheme';
import AddNewItem from '../../utils/commonComponents/AddNewItem';
let searchImg = require('./../../../assets/images/png/searchIcon.png');
let addImg = require('./../../../assets/images/png/addition.png');
let addImg1 = require('./../../../assets/images/png/add.png');
let filterImg = require('./../../../assets/images/png/setting.png');
let filterImg1 = require('./../../../assets/images/png/filter.png');

const BoxwiseStyleTransferListUI = ({route, navigation, ...props}) => {
  const list = props.list;

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const renderEmpty = () => {
    if (list.isLoading || props.MainLoading) {
      return null;
    }
    if (list.error) {
      return (
        <View style={CommonStyles.noRecordsFoundStyle}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, styles.emptyText]}>
            {list.error}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={list.retry}>
            <Text style={styles.retryText}>{'Retry'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={CommonStyles.noRecordsFoundStyle}>
        <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
          {Constant.noRecFound}
        </Text>
      </View>
    );
  };

  const handleActions = (item, type) => {
    if (type === 'OUT') {
      props.handleInandOutDcPdfs(item.id, 0);
    } else {
      props.handleInandOutDcPdfs(item.id, 1);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={[
          CommonStyles.cellBackViewStyle,
          {
            marginBottom: 3,
            backgroundColor:
              item.totalQty === item.totalRecQty
                ? '#98FB98'
                : item.totalQty > item.totalRecQty &&
                  item.totalQty !== 0 &&
                  item.totalRecQty !== 0
                ? '#E9967A'
                : '#FFFFFF',
          },
        ]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.dcname}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.stylenamestr}
            </Text>
          </View>
          <View style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.totalQty}
            </Text>
          </View>
          <View style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.totalRecQty}
            </Text>
          </View>

          <View
            style={{
              flex: 0.7,
              flexDirection: 'column',
              alignItems: 'center',
              // gap: 10,
            }}>
            {/* PDF buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
              }}>
              {/* OUT DC */}
              <TouchableOpacity
                onPress={() => handleActions(item, 'OUT')}
                style={{alignItems: 'center', flex: 1}}>
                <Image
                  source={require('./../../../assets/images/png/pdf2.png')}
                  style={{width: 18, height: 18, resizeMode: 'contain'}}
                />
                <Text style={{fontSize: 8, fontWeight: 'bold',color:'#000'}}>OUT DC</Text>
              </TouchableOpacity>

              {/* IN DC */}
              <TouchableOpacity
                onPress={() => handleActions(item, 'IN')}
                style={{alignItems: 'center', flex: 1}}>
                <Image
                  source={require('./../../../assets/images/png/pdf2.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'contain',
                    marginBottom: 2,
                  }}
                />
                <Text style={{fontSize: 8, fontWeight: 'bold',color:'#000'}}>IN DC</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNavigation = () => {
    props.handleNavigation();
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
          title={'Box wise Style Transfer List'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        <ListSearchBar list={list} />

        {list.rows.length > 0 ? (
          <View style={CommonStyles.listCommonHeader}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'ID'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'StyleName'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'Total Sent Qty'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'Total Qty Received'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Action'}
            </Text>
          </View>
        ) : (
          renderEmpty()
        )}

        <View style={[CommonStyles.listStyle, {flex: 1, height: undefined}]}>
          <FlatList
            ref={list.listRef}
            data={list.rows}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              String(list.getKey(item) ?? 'idx-' + index)
            }
            showsVerticalScrollIndicator={false}
            onEndReached={list.loadMore}
            onScrollEndDrag={list.onScrollEnd}
            onMomentumScrollEnd={list.onScrollEnd}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              list.isLoadingMore ? <ActivityIndicator size="large" /> : null
            }
            refreshControl={
              <RefreshControl
                refreshing={list.isRefreshing}
                onRefresh={() => list.refresh()}
              />
            }
          />
        </View>
      </View>

      <AddNewItem navItem={'CreateBoxwiseStyleTransfer'} />
      {/* <AddNewItem navItem={'SaveBoxwiseStyleTransfer'} /> */}

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

      {props.MainLoading === true || list.isLoading ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default BoxwiseStyleTransferListUI;

const styles = StyleSheet.create({
  emptyText: {fontSize: 15, textAlign: 'center'},
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#26A69A',
  },
  retryText: {color: '#fff', fontWeight: '700'},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: 'black',
  },
  leftBtnTextStyle: {
    color: 'white',
    fontSize: fonts.fontMedium,
    fontWeight: '700',
    marginLeft: wp('1%'),
    marginRight: wp('1%'),
    textAlign: 'center',
  },
  leftButtonstyle: {
    // backgroundColor: colors.color2,
    // flex:1,
    height: hp('6%'),
    borderRadius: hp('0.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
