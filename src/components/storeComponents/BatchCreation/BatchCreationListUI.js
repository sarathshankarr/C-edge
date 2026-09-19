import React, {useState, useCallback, useRef, useEffect} from 'react';
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
  Modal,
} from 'react-native';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import Svg, {Path, Circle} from 'react-native-svg';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let editImg = require('./../../../../assets/images/png/edit.png');
let deleteImg = require('./../../../../assets/images/png/delete.webp');
let pdfImg = require('./../../../../assets/images/png/pdf2.png');

const SEARCH_FIELDS = [
  {label: 'Batch Id', value: 'batchId'},
  {label: 'Batch Nos', value: 'batchname'},
  {label: 'Batch Creation Date', value: 'creationdate'},
  {label: 'Lot Nos', value: 'lotnos'},
  {label: 'PO No', value: 'ponos'},
];

const EyeIcon = () => (
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
);

const BatchCreationListUI = ({route, ...props}) => {
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState('');
  const [refreshing, set_refreshing] = useState(false);
  const [ItemsArray, set_ItemsArray] = useState([]);
  const [searchField, set_searchField] = useState(SEARCH_FIELDS[0]);
  const [isFieldPickerOpen, set_isFieldPickerOpen] = useState(false);

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

  const runSearch = useCallback(
    text => {
      const searchTerm = (text || '').trim();
      if (searchTerm.length === 0) {
        props.fetchMore();
        return;
      }
      props.onSearch(searchField.value, searchTerm);
    },
    [props.onSearch, props.fetchMore, searchField],
  );

  // Debounced search — only queries the server 350ms after typing stops
  const filterPets = useCallback(
    name => {
      set_recName(name);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => runSearch(name), 350);
    },
    [runSearch],
  );

  const onRefresh = useCallback(() => {
    set_refreshing(true);
    set_recName('');
    props.fetchMore();
    set_refreshing(false);
  }, [props.fetchMore]);

  const editRow = useCallback(
    item => {
      props.editRow(item);
    },
    [props.editRow],
  );

  const viewRow = useCallback(
    item => {
      props.viewRow(item);
    },
    [props.viewRow],
  );

  const deleteRow = useCallback(
    item => {
      props.deleteRow(item);
    },
    [props.deleteRow],
  );

  const downloadPDF = useCallback(
    item => {
      props.downloadBatchCreationPDF(item);
    },
    [props.downloadBatchCreationPDF],
  );

  const renderItem = useCallback(
    ({item}) => (
      <View style={CommonStyles.cellBackViewStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 0.5, textAlign: 'left'}]}>
            {item.id}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 1, textAlign: 'center'}]}>
            {item.batchNames}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 1, textAlign: 'center'}]}>
            {item.qualityName}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, {flex: 0.8, textAlign: 'center'}]}>
            {item.batchCreationDate}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', width: 150}}>
            {Number(item.isEdit) === 0 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, {backgroundColor: '#2979ff'}]}
                onPress={() => editRow(item)}>
                <Image source={editImg} style={{width: 16, height: 16, tintColor: '#fff'}} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, {backgroundColor: '#4caf50'}]}
                onPress={() => viewRow(item)}>
                <EyeIcon />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => downloadPDF(item)} style={{marginRight: 8}}>
              <Image source={pdfImg} style={{width: 30, height: 30, resizeMode: 'contain'}} />
            </TouchableOpacity>
            {Number(item.isEdit) === 0 ? (
              <TouchableOpacity onPress={() => deleteRow(item)}>
                <Image source={deleteImg} style={{width: 22, height: 22, resizeMode: 'contain'}} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.subRow}>
          <Text style={styles.subText}>Lot Nos: {item.lotNos || '-'}</Text>
          <Text style={styles.subText}>Total Issued: {item.totalIssued ?? '-'}</Text>
        </View>
      </View>
    ),
    [editRow, viewRow, deleteRow, downloadPDF],
  );

  // Each aaData row is a batch-detail row, not a batch — `id` is the parent
  // batchId and repeats across a batch's multiple detail/lot rows, so the
  // only per-row-unique field is batchDetailsId (see report §3 field mapping).
  const keyExtractor = useCallback(
    (item, index) => item.batchDetailsId?.toString() ?? `${item.id}_${index}`,
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
          title={'Batch Creation List'}
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
            <TouchableOpacity
              style={styles.fieldPickerBtn}
              onPress={() => set_isFieldPickerOpen(true)}>
              <Text style={styles.fieldPickerBtnText} numberOfLines={1}>
                {searchField.label}
              </Text>
            </TouchableOpacity>
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
                placeholder={`Search by ${searchField.label}`}
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                value={recName}
                onChangeText={filterPets}
              />
            </View>
          </View>
        ) : null}

        {filterArray && filterArray.length > 0 ? (
          <View style={CommonStyles.listCommonHeader}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 0.5, textAlign: 'left'}]}>
              {'Id'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 1, textAlign: 'center'}]}>
              {'Batch No'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 1, textAlign: 'center'}]}>
              {'Quality'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 0.8, textAlign: 'center'}]}>
              {'Date'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {width: 150, textAlign: 'center'}]}>
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

      <AddNewItem navItem={'CreateBatchCreation'} />

      <Modal visible={isFieldPickerOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => set_isFieldPickerOpen(false)}>
          <View style={styles.modalCard}>
            {SEARCH_FIELDS.map(field => (
              <TouchableOpacity
                key={field.value}
                style={styles.modalOption}
                onPress={() => {
                  set_searchField(field);
                  set_isFieldPickerOpen(false);
                  if (recName) runSearch(recName);
                }}>
                <Text style={styles.modalOptionText}>{field.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
    width: 32,
    height: 32,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
  fieldPickerBtn: {
    width: 90,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5177c0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 6,
  },
  fieldPickerBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#000',
  },
});

export default BatchCreationListUI;
