import React, {useState} from 'react';
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
import color from '../commonStyles/color';
import CustomCheckBox from './CustomCheckBox';
import  * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';

const FilterModal = ({isVisible, onClose, categoriesList, selectedCategoryListAPI,applyFilterFxn}) => {

  const [selectedCategory, setSelectedCategory] = useState('Cuisines'); 
  const [searchText, setSearchText] = useState(''); 
  const [isLoading, set_isLoading] = useState(false);
  const [selectedCategoryItems, set_selectedCategoryItems] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]); 



  // Filtered right-side list based on search text
  const filteredItems =  [];

  const toggleSelection = (index) => {
    setSelectedIndices((prevSelected) => {
        if (prevSelected.includes(index)) {
            return prevSelected.filter((i) => i !== index);
        } else {
            return [...prevSelected, index];
        }
    });
};


    const getSelectedCategoryListFBI = async (functionName, id) => {

      let userName = await AsyncStorage.getItem('userName');
      let userPsd = await AsyncStorage.getItem('userPsd');
      // let usercompanyId = await AsyncStorage.getItem('companyId');
  
      set_isLoading(true);
      let obj =  {
        "username": userName,
        "password": userPsd,
        "categoryType" : id
      }
  
      // let categoreisListAPIOBJ = await APIServiceCall.getSelectedCategoryListFBI(obj);
      // if (typeof APIServiceCall[functionName] === 'function') {

        let categoreisListAPIOBJ = await APIServiceCall[functionName](obj);

      set_isLoading(false);
      
      if(categoreisListAPIOBJ && categoreisListAPIOBJ.statusData){
  
        if(categoreisListAPIOBJ && categoreisListAPIOBJ.responseData){
          set_selectedCategoryItems(categoreisListAPIOBJ.responseData)
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
      setSelectedCategory(item.id);
      setSearchText('');
      getSelectedCategoryListFBI(selectedCategoryListAPI, item.id);
    }

    const handleAppyFilter=()=>{
      const ids=selectedIndices.join(',');
      const type=selectedCategory.id
      applyFilterFxn(type, ids)
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
              style={{width: 30, height: 30, tintColor: color.color2}}
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
                  item.id === selectedCategory && styles.selectedCategory,
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
                Filter by {selectedCategory}
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
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Right-Side List */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={item => item}
              renderItem={({ item, index }) => (
                <View style={styles.itemContainer}>
                  <CustomCheckBox
                        isChecked={selectedIndices.includes(index)}
                        onToggle={() => toggleSelection(index)}
                    />
                  <Text style={styles.itemText}>{item}</Text>
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
            onPress={() => {
              setSelectedCategory('Cuisines');
              setSearchText('');
            }}>
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

const styles = StyleSheet.create({
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
    borderLeftColor: color.color2,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    // color: '#ff6600',
    color: color.color2,
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
    backgroundColor: color.color2,
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