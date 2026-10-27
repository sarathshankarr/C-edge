import React, {useState, useRef, useCallback, useEffect} from 'react';
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
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import ListSearchBar from '../../../utils/commonComponents/ListSearchBar';
import Svg, {Path, Circle} from 'react-native-svg';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const StockIssueListUI = ({route, ...props}) => {
  const list = props.list;

  const backBtnAction = useCallback(() => {
    props.backBtnAction();
  }, [props.backBtnAction]);

  const popOkBtnAction = useCallback(() => {
    props.popOkBtnAction();
  }, [props.popOkBtnAction]);

  const handleActions = useCallback(
    item => {
      props.actionOnRow(item);
    },
    [props.actionOnRow],
  );

  const downloadPDF = useCallback(
    item => {
      props.downloadStockIssuePDF(item);
    },
    [props.downloadStockIssuePDF],
  );

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

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => {}}
        style={CommonStyles.cellBackViewStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 0.4, textAlign: 'left'},
            ]}>
            {item.g_id}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.location}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.referenceDate}
          </Text>
          <View style={{flexDirection: 'row', rowGap: 10}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.button,
                {backgroundColor: item.status === 1 ? '#2979ff' : '#4caf50'},
              ]}
              onPress={() => handleActions(item)}>
              {item.status === 1 ? (
                <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                    stroke="#ffffff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle
                    cx={12}
                    cy={12}
                    r={3}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </Svg>
              ) : (
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M5 12L10 17L19 7"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => downloadPDF(item)}>
              <Image
                source={require('./../../../../assets/images/png/pdf2.png')}
                style={{width: 32, height: 32, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleActions, downloadPDF],
  );

  // Stable key extractor using the item's own ID
  const keyExtractor = useCallback(
    item => item.g_id?.toString() ?? Math.random().toString(),
    [],
  );

  const listFooter = useCallback(
    () => (list.isLoadingMore ? <ActivityIndicator size="large" /> : null),
    [list.isLoadingMore],
  );

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Stock Issue List'}
          backBtnAction={backBtnAction}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        <ListSearchBar list={list} />

        {list.rows.length > 0 ? (
          <View style={CommonStyles.listCommonHeader}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'left'},
              ]}>
              {'SId'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Location'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Creation Date'}
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
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            onEndReached={list.loadMore}
            onScrollEndDrag={list.onScrollEnd}
            onMomentumScrollEnd={list.onScrollEnd}
            onEndReachedThreshold={0.2}
            ListFooterComponent={listFooter}
            refreshControl={
              <RefreshControl
                refreshing={list.isRefreshing}
                onRefresh={() => list.refresh()}
              />
            }
          />
        </View>
      </View>

      <AddNewItem navItem={'CreateStockIssue'} />

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={popOkBtnAction}
            popUpLeftBtnAction={() => {}}
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
  button: {
    width: 32,
    height: 32,
    borderRadius: 21,
    backgroundColor: '#2979ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2979ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default StockIssueListUI;
