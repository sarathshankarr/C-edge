import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {ColorContext} from '../../components/colorTheme/colorTheme';

let searchImg = require('./../../../assets/images/png/searchIcon.png');

// Search bar for useSearchablePagedList screens: search-field picker + text box
// + Search button, and an optional 2-option date filter.
// Pass the hook's return value as `list`.
const ListSearchBar = ({list}) => {
  const {colors} = useContext(ColorContext);
  const [isPickerOpen, setPickerOpen] = useState(false);

  const selected =
    list.searchOptions.find(o => o.value === list.searchField) ||
    list.searchOptions[0];

  return (
    <View style={{width: '100%', marginBottom: 8}}>
      {list.dateFilters.length > 0 ? (
        <View style={styles.segment}>
          {list.dateFilters.map(f => {
            const active = f.value === list.dateFilter;
            return (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.segmentItem,
                  active && {backgroundColor: colors.color2},
                ]}
                onPress={() => list.setDateFilter(f.value)}>
                <Text style={[styles.segmentText, active && {color: '#fff'}]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.fieldPicker}
          onPress={() => setPickerOpen(true)}>
          <Text style={styles.fieldPickerText} numberOfLines={1}>
            {selected?.label}
          </Text>
          <Text style={styles.caret}>{'▾'}</Text>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Image source={searchImg} style={styles.searchIcon} />
          <TextInput
            style={[
              {flex: 1, color: '#000'},
              Platform.OS === 'ios' && {paddingVertical: 10},
            ]}
            underlineColorAndroid="transparent"
            placeholder="Search"
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
            returnKeyType="search"
            value={list.searchText}
            onChangeText={list.setSearchText}
            onSubmitEditing={list.submitSearch}
          />
          {list.searchText || list.activeSearch ? (
            <TouchableOpacity onPress={list.clearSearch} hitSlop={8}>
              <Text style={styles.clearText}>{'✕'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.searchBtn, {backgroundColor: colors.color2}]}
          onPress={list.submitSearch}>
          <Text style={styles.searchBtnText}>{'Search'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setPickerOpen(false)}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>{'Search by'}</Text>
            <FlatList
              data={list.searchOptions}
              keyExtractor={o => o.value}
              renderItem={({item}) => {
                const active = item.value === list.searchField;
                return (
                  <TouchableOpacity
                    style={styles.pickerRow}
                    onPress={() => {
                      list.setSearchField(item.value);
                      setPickerOpen(false);
                    }}>
                    <Text
                      style={[
                        styles.pickerRowText,
                        active && {color: colors.color2, fontWeight: '700'},
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ListSearchBar;

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
  },
  segmentText: {color: '#555', fontSize: 13, fontWeight: '600'},
  fieldPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '34%',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 6,
  },
  fieldPickerText: {color: '#000', fontSize: 13, flexShrink: 1},
  caret: {color: '#7F7F81', marginLeft: 4},
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
  },
  searchIcon: {height: 16, width: 16, tintColor: '#7F7F81', marginRight: 6},
  clearText: {color: '#7F7F81', fontSize: 16, paddingHorizontal: 4},
  searchBtn: {
    marginLeft: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchBtnText: {color: '#fff', fontWeight: '700', fontSize: 13},
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 30,
  },
  pickerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    maxHeight: '70%',
  },
  pickerTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  pickerRow: {paddingHorizontal: 16, paddingVertical: 12},
  pickerRowText: {color: '#000', fontSize: 14},
});
