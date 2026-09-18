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
import GrnAlertHost from '../common/GrnAlertHost';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const GrnCheckingListUI = ({route, ...props}) => {
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

  // Debounced search-box filter, client-side across the current page --
  // server-side filtering (searchField/searchValue) can be wired in later
  // by calling props.fetchMore(true, field, value) instead.
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
        const filtered = ItemsArray.filter(
          item =>
            item.lotNo?.toString().toUpperCase().includes(upper) ||
            item.poNumberWithSymbol?.toString().toUpperCase().includes(upper) ||
            item.vendorName?.toString().toUpperCase().includes(upper) ||
            item.userName?.toString().toUpperCase().includes(upper),
        );
        set_filterArray(filtered);
      }, 300);
    },
    [ItemsArray],
  );

  const onRefresh = useCallback(() => {
    set_refreshing(true);
    props.fetchMore(false);
    set_refreshing(false);
    set_recName('');
  }, [props.fetchMore]);

  const loadMore = useCallback(() => {
    // Loading more while the user is filtering the client-side search box
    // would append server rows the filter hasn't seen yet and silently
    // drop them from view -- only paginate while showing the unfiltered list.
    if (!recName) props.fetchMore(true);
  }, [props.fetchMore, recName]);

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

  const listFooter = useCallback(
    () => (props.isLoading ? <ActivityIndicator size="large" /> : null),
    [props.isLoading],
  );

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
                style={{height: 18, width: 18, tintColor: '#7F7F81', marginRight: 10}}
              />
              <TextInput
                style={[{flex: 1, color: '#000'}, Platform.OS === 'ios' && {paddingVertical: 12}]}
                underlineColorAndroid="transparent"
                placeholder="Search Lot / PO / Vendor / User"
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
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
