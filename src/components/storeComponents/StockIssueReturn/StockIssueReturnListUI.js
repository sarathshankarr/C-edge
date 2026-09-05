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
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import Svg, {Path, Circle} from 'react-native-svg';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const StockIssueReturnListUI = ({route, ...props}) => {
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  const [refreshing, set_refreshing] = useState(false);
  const [ItemsArray, set_ItemsArray] = useState([]);

  const isKeyboard = useRef(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
      set_ItemsArray(props.itemsArray);
    }
  }, [props.itemsArray]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

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
      props.downloadStockIssueReturnPDF(item);
    },
    [props.downloadStockIssueReturnPDF],
  );

  // Debounced search — only runs filter 300ms after the user stops typing
  const filterPets = useCallback(
    name => {
      set_recName(name);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const searchTerm = name.toString().toLowerCase().trim();
        if (searchTerm.length === 0) {
          set_filterArray(ItemsArray);
          return;
        }
        const upper = name.toUpperCase();
        const styleArray = ItemsArray.filter(
          item =>
            item.sird_id?.toString().toUpperCase().includes(upper) ||
            item.userName?.toString().toUpperCase().includes(upper) ||
            item.orderDate?.toString().toUpperCase().includes(upper),
        );
        set_filterArray(styleArray);
      }, 300);
    },
    [ItemsArray],
  );

  const onRefresh = useCallback(() => {
    set_refreshing(true);
    props.fetchMore();
    set_refreshing(false);
    set_recName('');
  }, [props.fetchMore]);

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
              {flex: 0.6, textAlign: 'left'},
            ]}>
            {item.sird_id}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.orderDate}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.userName}
          </Text>
          <View style={{flexDirection: 'row', rowGap: 10}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={() => handleActions(item)}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx={12} cy={12} r={3} stroke="#ffffff" strokeWidth={2} />
              </Svg>
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
    item => item.sird_id?.toString() ?? Math.random().toString(),
    [],
  );

  const listFooter = useCallback(
    () => (props.isLoading ? <ActivityIndicator size="large" /> : null),
    [props.isLoading],
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
          title={'Stock Issue Return List'}
          backBtnAction={backBtnAction}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        {filterArray ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                borderWidth: 1,
                borderColor: '#D1D1D1',
                borderRadius: 20,
                backgroundColor: '#F9F9F9',
                paddingHorizontal: 15,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
              <Image
                source={searchImg}
                style={{
                  height: 18,
                  width: 18,
                  tintColor: '#7F7F81',
                  marginRight: 10,
                }}
              />
              <TextInput
                style={[
                  {flex: 1, color: '#000'},
                  Platform.OS === 'ios' && {paddingVertical: 12},
                ]}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                value={recName}
                onFocus={() => (isKeyboard.current = true)}
                onChangeText={filterPets}
              />
            </View>
          </View>
        ) : null}

        {filterArray && filterArray.length > 0 ? (
          <View style={CommonStyles.listCommonHeader}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 0.6, textAlign: 'left'},
              ]}>
              {'Stock Id'}
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
              {'Created By'}
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
          <View style={CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? (
              <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                {Constant.noRecFound}
              </Text>
            ) : null}
          </View>
        )}

        <View style={CommonStyles.listStyle}>
          <FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={listFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>

      <AddNewItem navItem={'CreateStockIssueReturn'} />

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

      {props.MainLoading === true ? (
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

export default StockIssueReturnListUI;
