import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
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

const GoodsReceiptNoteListUI = ({route, navigation, ...props}) => {
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

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={[CommonStyles.cellBackViewStyle, {marginBottom: 3}]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.poNumberWithPrefix}
            </Text>
          </View>
          <View
            style={{flex: 0.7, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.vendorName}
            </Text>
          </View>
          <View
            style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.rmFabric}
            </Text>
          </View>
          <View
            style={{flex: 0.7, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  const renderEmpty = () => {
    if (list.isLoading) {
      return null;
    }
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
          <TouchableOpacity
            style={{
              marginTop: 12,
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: '#26A69A',
            }}
            onPress={list.retry}>
            <Text style={{color: '#fff', fontWeight: '700'}}>{'Retry'}</Text>
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

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Goods Receipt Note List'}
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
              {'PO'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.7, textAlign: 'center'},
              ]}>
              {'Vendor'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'Type'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.7, textAlign: 'center'},
              ]}>
              {'Total Price'}
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

      {/* <AddNewItem navItem={'SaveGrnApprove'} /> */}

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
          />
        </View>
      ) : null}

      {list.isLoading ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default GoodsReceiptNoteListUI;

const styles = StyleSheet.create({
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



