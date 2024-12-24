import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import CustomCheckBox from './CustomCheckBox';
import  * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorContext } from '../../components/colorTheme/colorTheme';

const FilterModal = ({isVisible, onClose, categoriesList, selectedCategoryListAPI,applyFilterFxn,clearFilter,reqBody}) => {

  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [searchText, setSearchText] = useState(''); 
  const [isLoading, set_isLoading] = useState(false);
  const [selectedCategoryItems, set_selectedCategoryItems] = useState([]);
  const [selectedCategoryFilteredItems, set_selectedCategoryFilteredItems] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]); 

  const [prepopulateSelectedCategory, setPrepopulateSelectedCategory] = useState('');
  const [prepoluateIndices, setPrepoluateIndices] = useState([]); 
  const [prepopulateFilterList, setprepopulateFilterList] = useState([]); 
  const [searchCacheResults, setSearchCacheResults] = useState({}); 

  const { colors } = useContext(ColorContext);
  const styles = getStyles(colors);




useEffect(()=>{
  if(prepopulateSelectedCategory){
    setSelectedCategory(prepopulateSelectedCategory)
  }
  if(prepoluateIndices){
    setSelectedIndices(prepoluateIndices)
  }
  if(prepopulateFilterList){
    set_selectedCategoryFilteredItems(prepopulateFilterList)
  }

  setSearchCacheResults({});

},[isVisible])


  const handleFilterList=(text='')=>{
    const property = selectedCategory?.fid;
    // const filtered = selectedCategoryItems.filter((item) =>item[property].toUpperCase().includes(text.toUpperCase() || ''));
    const filtered = selectedCategoryItems.filter((item) => {
      const value = item[property];
      const searchValue = text.toUpperCase() || '';
      return typeof value === 'string'
        ? value.toUpperCase().includes(searchValue)
        : value.toString().includes(searchValue);
    });
        
    set_selectedCategoryFilteredItems(filtered);
    setSearchText(text);
  }


//   const toggleSelection = (index) => {
//     setSelectedIndices((prevSelected) => {
//         if (prevSelected.includes(index)) {
//             return prevSelected.filter((i) => i !== index);
//         } else {
//             return [...prevSelected, index];
//         }
//     });
// };

const toggleSelection = (item) => {
  setSelectedIndices((prevSelected) => {
      const exists = prevSelected.some((i) => i === item);
      
      if (exists) {
          return prevSelected.filter((i) => i !== item);
      } else {
          return [...prevSelected, item];
      }
  });
};



    const getSelectedCategoryListFBI = async (functionName, id) => {

      // let userName = await AsyncStorage.getItem('userName');
      // let userPsd = await AsyncStorage.getItem('userPsd');
      // let usercompanyId = await AsyncStorage.getItem('companyId');
  
      set_isLoading(true);

      let obj = reqBody;
      obj.categoryType=id;

      // console.log("rightside  req body", functionName, id);
  
      // let categoreisListAPIOBJ = await APIServiceCall.getSelectedCategoryListFBI(obj);
      // if (typeof APIServiceCall[functionName] === 'function') {

        let categoreisListAPIOBJ = await APIServiceCall[functionName](obj);

      set_isLoading(false);
      
      if(categoreisListAPIOBJ && categoreisListAPIOBJ.statusData){
  
        if(categoreisListAPIOBJ && categoreisListAPIOBJ.responseData){
          set_selectedCategoryItems(categoreisListAPIOBJ.responseData);
          set_selectedCategoryFilteredItems(categoreisListAPIOBJ.responseData);
          setSearchCacheResults(prevLists => ({
            ...prevLists,
            [id] : categoreisListAPIOBJ.responseData
          }))
        } 
  
      } else {
        // popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
        console.log("categoreisListAPIOBJ ===> ", categoreisListAPIOBJ)
      }
  
      if(categoreisListAPIOBJ && categoreisListAPIOBJ.error) {
        // popUpAction(Constant.SERVICE_FAIL_MSG,Constant.DefaultAlert_MSG,'OK', true,false);
        console.log("categoreisListAPIOBJ ===> ", categoreisListAPIOBJ.error)
      }
    };


    const handleSelectCategory=(item)=>{
      setSelectedCategory(item);
      setSearchText('');
      // getSelectedCategoryListFBI(selectedCategoryListAPI, item.id);
      // setSelectedIndices([]);

      const ide=item.id;
      // console.log("why not ===> ",searchCacheResults.ide);
      if(searchCacheResults[ide]){
        set_selectedCategoryItems(searchCacheResults[ide]);
        set_selectedCategoryFilteredItems(searchCacheResults[ide]);
        console.log("Caching ......");
      }else{
        getSelectedCategoryListFBI(selectedCategoryListAPI, item.id);
      }
      setSelectedIndices([]);
    }

    const handleAppyFilter=()=>{

    const ids = selectedIndices
    .map(item => {
      const prop = selectedCategory.idxId; 
      return item[prop]; 
    })
    .join(',');
  
  console.log(" Selected Indices ids", ids); 
  
   

      const count=selectedIndices.length;
      const type=selectedCategory.id
      applyFilterFxn(type, ids, count);
      setPrepoluateIndices(selectedIndices);
      setPrepopulateSelectedCategory(selectedCategory);
      setprepopulateFilterList(selectedCategoryItems);
    }

    // console.log("cache Obj ===> ", Object.keys(searchCacheResults));

    const handleClearFilter=()=>{
      clearFilter();
      setSelectedIndices([]);
      setSearchText('');
      setPrepoluateIndices([])
      setPrepopulateSelectedCategory('');
      setSelectedCategory('');
      setprepopulateFilterList([])
    }


  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Filter</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('./../../../assets/images/png/close.png')}
              style={{width: 30, height: 30, tintColor: colors.color2}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[styles.filterHeaderBorder, {borderBottomColor: '#e0e0e0'}]}
        />

        <View style={styles.content}>
          {/* Left-Side List (Categories) */}
          <FlatList
            data={categoriesList}
            keyExtractor={item => item.id}
            style={styles.leftList}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  item.id === selectedCategory.id && styles.selectedCategory,
                ]}
                onPress={() => handleSelectCategory(item)}>
                <Text
                  style={[
                    styles.categoryText,
                    item === selectedCategory && styles.selectedCategoryText,
                  ]}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Right-Side Content */}
          <View style={styles.rightSide}>
            <View style={styles.dynamicFilterHeader}>
              <Text style={styles.dynamicFilterText}>
                Filter by {selectedCategory.value}
              </Text>
              <View
                style={[
                  styles.dynamicHeaderBorder,
                  {borderBottomColor: '#ff6600'},
                ]}
              />
            </View>

            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              placeholder={`Search`}
              placeholderTextColor='black'
              value={searchText}
              onChangeText={handleFilterList}
            />

            {/* Right-Side List */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.color2} />
                </View>
            ) : (
            <FlatList
              data={selectedCategoryFilteredItems}
              keyExtractor={(item, index) => `batchname-${index}`}
              renderItem={({ item, index }) => (
                <View style={styles.itemContainer}>
                  <CustomCheckBox
                        isChecked={selectedIndices.includes(item)}
                        onToggle={() => toggleSelection(item)}
                    />
                  <Text style={styles.itemText}>{item[selectedCategory.fid]}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No items found.</Text>
              }
            />
            )}
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleClearFilter()}>
            <Text style={styles.clearText}>Clear Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={()=>handleAppyFilter()}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    height: '80%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterHeaderBorder: {
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  leftList: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedCategory: {
    // backgroundColor: '#ff6600',
    borderLeftWidth: 3,
    // borderLeftColor: '#ff6600',
    borderLeftColor: colors.color2,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    // color: '#ff6600',
    color: colors.color2,
    fontWeight: 'bold',
  },
  rightSide: {
    width: '70%',
    paddingHorizontal: 15,
  },
  dynamicFilterHeader: {
    marginBottom: 10,
  },

  dynamicFilterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    fontFamily: 'Roboto-Medium',
    textAlign: 'left',
    marginBottom: 10,
    letterSpacing: 0.65,
  },

  dynamicHeaderBorder: {
    // borderBottomWidth: 2,
    marginTop: 5,
    width: '100%',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    color:'#000'
  },
  itemContainer: {
    paddingVertical: 10,
    // borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom:15,
    marginHorizontal:10
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    // backgroundColor: '#ff6600',
    backgroundColor: colors.color2,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    color: '#333',
  },
  applyText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
});

export default FilterModal;
