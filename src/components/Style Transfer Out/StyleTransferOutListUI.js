import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import * as Constant from '../../utils/constants/constant';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import AddNewItem from '../../utils/commonComponents/AddNewItem';
import ListSearchBar from '../../utils/commonComponents/ListSearchBar';

const StyleTransferOutListUI = ({route, navigation, ...props}) => {
  const list = props.list;

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const handlePdf1 = async item => {
    props.handlePdf(item, 1);
  };
  const handlePdf2 = async item => {
    props.handlePdf(item, 2);
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
          <View style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.idstr}
            </Text>
          </View>
          <View style={{flex: 0.7, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.styleno}
            </Text>
          </View>
          <View style={{flex: 0.5, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.toLocIdStr}
            </Text>
          </View>
          {/* <View
            style={{flex: 0.7, justifyContent: 'center'}}>
            <Text style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
              {item.username}
            </Text>
          </View> */}
          {/* <View
            style={{
              flex: 0.7,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => handlePdf1(item)}>
              <Text
                style={[CommonStyles.tylesTextStyle, {textAlign: 'center', marginBottom:5}]}>
                {'OUT DC'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePdf2(item)} style={{}}>
              <Text
                style={[CommonStyles.tylesTextStyle, {textAlign: 'center'}]}>
                {'IN DC'}
              </Text>
            </TouchableOpacity>
          </View> */}
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
                        onPress={() => handlePdf1(item)}
                        style={{alignItems: 'center', flex: 1}}>
                        <Image
                          source={require('./../../../assets/images/png/pdf2.png')}
                          style={{width: 18, height: 18, resizeMode: 'contain'}}
                        />
                        <Text style={{fontSize: 8,  fontWeight: 'bold'}}>
                          OUT DC
                        </Text>
                      </TouchableOpacity>
          
                      {/* IN DC */}
                      <TouchableOpacity
                        onPress={() => handlePdf2(item)}
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
                        <Text style={{fontSize: 8,  fontWeight: 'bold'}}>
                          IN DC
                        </Text>
                      </TouchableOpacity>
                    </View>
          
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
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Style Transfer Out List'}
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
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'ST NO'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.7, textAlign: 'center'},
              ]}>
              {'Style (Color) '}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.5, textAlign: 'center'},
              ]}>
              {'To Location'}
            </Text>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.7, textAlign: 'center'},
              ]}>
              {'PDF'}
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

      <AddNewItem navItem={'CreateStyleTransferOut'} />

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

      {list.isLoading || props.isLoading ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};
export default StyleTransferOutListUI;

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
