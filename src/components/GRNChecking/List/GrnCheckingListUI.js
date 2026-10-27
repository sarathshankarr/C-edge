import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import GrnAlertHost from '../common/GrnAlertHost';
import ListSearchBar from '../../../utils/commonComponents/ListSearchBar';

const GrnCheckingListUI = ({route, ...props}) => {
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

  const downloadPdf = useCallback(
    item => {
      props.downloadOverallPdf(item);
    },
    [props.downloadOverallPdf],
  );

  const downloadBarcode = useCallback(
    item => {
      props.downloadBarcodePdf(item);
    },
    [props.downloadBarcodePdf],
  );

  const renderItem = useCallback(
    ({item}) => {
      // Barcode PDF only ever exists for approved Fabric rows -- everything
      // else (RM, or Fabric with nothing approved yet) has just the
      // overall PDF, so keep it on a single row next to the check-in
      // button instead of stacked above an empty placeholder slot.
      const showBarcode = item.hasApprovedBatches && item.itemType === 'Fabric';
      return (
      <TouchableOpacity onPress={() => {}} style={CommonStyles.cellBackViewStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 0.9, textAlign: 'left'}]}>
            {item.lotNo || '-'}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 1, textAlign: 'center'}]}>
            {item.poNumberWithSymbol}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 1, textAlign: 'center'}]}>
            {item.vendorName || '-'}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 0.9, textAlign: 'center'}]}>
            {item.userName || '-'}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 76}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={() => handleActions(item)}>
              <Image
                source={require('./../../../../assets/images/png/grn.png')}
                style={{width: 18, height: 18, resizeMode: 'contain', tintColor: '#fff'}}
              />
            </TouchableOpacity>
            {showBarcode ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => downloadPdf(item)} style={{marginBottom: 4}}>
                  <Image
                    source={require('./../../../../assets/images/png/pdf2.png')}
                    style={{width: 22, height: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => downloadBarcode(item)}>
                  <Image
                    source={require('./../../../../assets/images/png/barcode_download.png')}
                    style={{width: 22, height: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
            ) : item.hasApprovedBatches ? (
              <TouchableOpacity onPress={() => downloadPdf(item)}>
                <Image
                  source={require('./../../../../assets/images/png/pdf2.png')}
                  style={{width: 22, height: 22, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            ) : (
              <View style={{width: 22, height: 22}} />
            )}
          </View>
        </View>
      </TouchableOpacity>
      );
    },
    [handleActions, downloadPdf, downloadBarcode],
  );

  const keyExtractor = useCallback(
    item => `${item.poNumber}_${item.itemType}`,
    [],
  );

  const renderEmpty = () => {
    if (list.error) {
      return (
        <View style={CommonStyles.noRecordsFoundStyle}>
          <Text
            style={[
              CommonStyles.tylesHeaderTextStyle,
              {fontSize: 15, textAlign: 'center'},
            ]}>
            {list.error}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={list.retry}>
            <Text style={{color: '#fff', fontWeight: '700'}}>{'Retry'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={CommonStyles.noRecordsFoundStyle}>
        {!list.isLoading ? (
          <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
            {Constant.noRecFound}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <GrnAlertHost />
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'GRN Checking'}
          backBtnAction={backBtnAction}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        <ListSearchBar list={list} />

        {list.rows.length > 0 ? (
          <View style={CommonStyles.listCommonHeader}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 0.9, textAlign: 'left'}]}>
              {'Lot No'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 1, textAlign: 'center'}]}>
              {'PO No'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 1, textAlign: 'center'}]}>
              {'Vendor'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 0.9, textAlign: 'center'}]}>
              {'User'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {width: 76, textAlign: 'center'}]}>
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
            ListFooterComponent={
              list.isLoadingMore ? <ActivityIndicator size="large" /> : null
            }
            onEndReached={list.loadMore}
            onScrollEndDrag={list.onScrollEnd}
            onMomentumScrollEnd={list.onScrollEnd}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={list.isRefreshing}
                onRefresh={() => list.refresh()}
              />
            }
          />
        </View>
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopupLeft}
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
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#26A69A',
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#4caf50',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default GrnCheckingListUI;
