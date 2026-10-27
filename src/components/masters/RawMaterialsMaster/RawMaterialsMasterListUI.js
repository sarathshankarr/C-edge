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
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import * as Constant from '../../../utils/constants/constant';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import ListSearchBar from '../../../utils/commonComponents/ListSearchBar';

const RawMaterialsMasterListUI = ({route, ...props}) => {
  const list = props.list;

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={[CommonStyles.cellBackViewStyle, {marginBottom: 3}]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.trimName}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.description}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.activeStatus}
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

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable={true}
          isTitleHeaderEnable={true}
          title={'Raw Materials Master List'}
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
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Raw Material Name'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'Raw Material Type'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 1, textAlign: 'center'},
              ]}>
              {'BOM Status'}
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

      <AddNewItem navItem={'CreateRawMaterialsMasterComponent'} />

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopLeft}
            isRightBtnEnable={true}
            leftBtnTilte="NO"
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={popOkBtnAction}
          />
        </View>
      ) : null}

      {list.isLoading && (
        <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} />
      )}
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
});

export default RawMaterialsMasterListUI;
