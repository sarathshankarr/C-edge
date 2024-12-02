import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

const FilterModal = ({ isVisible, onClose }) => {
  const categories = ['Cuisines', 'Ratings', 'Explore'];
  const items = {
    Cuisines: ['Afghani', 'American', 'Andhra', 'Arabian', 'Asian', 'Bakery', 'Barbecue', 'Bengali'],
    Ratings: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
    Explore: ['New Arrivals', 'Top Picks', 'Trending', 'Discounted'],
  };

  const [selectedCategory, setSelectedCategory] = useState('Cuisines'); // Default selected category
  const [searchText, setSearchText] = useState(''); // Text in the search bar

  // Filtered right-side list based on search text
  const filteredItems =
    items[selectedCategory]?.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Filter</Text>
        </View>

        <View style={styles.content}>
          {/* Left-Side List (Categories) */}
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            style={styles.leftList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  item === selectedCategory && styles.selectedCategory,
                ]}
                onPress={() => {
                  setSelectedCategory(item);
                  setSearchText(''); // Clear search when category changes
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    item === selectedCategory && styles.selectedCategoryText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Right-Side Content */}
          <View style={styles.rightSide}>
            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              placeholder={`Search ${selectedCategory.toLowerCase()}...`}
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Right-Side List */}
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No items found.</Text>
              }
            />
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedCategory('Cuisines');
              setSearchText('');
            }}
          >
            <Text style={styles.clearText}>Clear Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
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
    height: '70%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#ff6600',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rightSide: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom:15,
    marginHorizontal:10
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  applyButton: {
    padding: 10,
    backgroundColor: '#ff6600',
    borderRadius: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#333',
  },
  applyText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FilterModal;
