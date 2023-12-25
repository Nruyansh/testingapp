import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image , ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../redux/categoriesSlice';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ViewScreen = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://dmapi.ipaypro.co/app_task/categories');
        const data = response.data?.result;
        dispatch(setCategories(data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch]);

  const renderDropdown = ({ item }) => {
    if (selectedCategory && selectedCategory._id === item._id) {
      return (
        <FlatList
          data={item.sub_cateries}
          keyExtractor={(subItem) => subItem._id}
          renderItem={({ item: subItem }) => (
            <TouchableOpacity
              style={styles.subcategoryItem}
              onPress={() => handleSubcategoryPress(subItem)}
            >
              {subItem.name ? (
                <>
                  <Text style={styles.subcategoryText}>{subItem.name}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      selectedSubcategories.includes(subItem._id) && styles.selectedCheckbox,
                    ]}
                  />
                </>
              ) : (
                <Text style={styles.subcategoryText}>No items available</Text>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.subcategoryItem}>
              <Text style={styles.subcategoryText}>No subcategory available</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    return null;
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(
      selectedCategory && selectedCategory._id === category._id ? null : category
    );
    setSelectedSubcategories([]); 
  };

  const handleSubcategoryPress = (subItem) => {
    const updatedSubcategories = [...selectedSubcategories];
    if (updatedSubcategories.includes(subItem._id)) {
      
      const index = updatedSubcategories.indexOf(subItem._id);
      updatedSubcategories.splice(index, 1);
    } else {
     
      updatedSubcategories.push(subItem._id);
    }
    setSelectedSubcategories(updatedSubcategories);
  };

  const getCategoryImage = (categoryName) => {
    const trimmedCategoryName = categoryName.trim();
    switch (trimmedCategoryName) {
      case 'Fruits':
        return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/apple.png');
      case 'Non-Veg':
        return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/chicken-leg.png');
      case 'Fast Food':
        return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/fast-food.png');
      case 'Cake':
        return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/pie.png');
      case 'Diet Food':
        return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/avocado.png');
      case 'Resturant':
          return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/restaurant.png')
      case 'Juicy Fruit':
            return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/melon.png')
      default:
        return require('/Users/mac/Desktop/testApp/AwesomeProject/assets/fast-food.png');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, styles.blackText]}>Categories & Subcategories</Text>
    {loading ? (

<ActivityIndicator size="large" color="#1e90ff" />
    ):(
      <FlatList
      data={categories}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.renderItem}>
          <TouchableOpacity onPress={() => handleCategoryPress(item)}>
            <View
              style={[
                styles.categoryItem,
                selectedCategory && selectedCategory._id === item._id && styles.selectedCategory,
              ]}
            >
              <Text style={styles.verticalDots}>⋮</Text>
              <Image source={getCategoryImage(item.category_name)} style={styles.categoryImage} />
              <Text style={[styles.categoryName, styles.blackText]}>{item.category_name}</Text>
              <Text style={styles.chevronIcon}>
                {selectedCategory && selectedCategory._id === item._id ? '⌵' : '^'}
              </Text>
            </View>
          </TouchableOpacity>
          {renderDropdown({ item })}
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  renderItem: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomColor: 'lightgrey',
  },
  selectedCategory: {
    backgroundColor: '#f0f0f0',
  },
  categoryImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  verticalDots: {
    fontSize: 20,
    marginRight: 10,
    color: 'lightgrey',
  },
  categoryName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subcategoryItem: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  subcategoryText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  selectedCheckbox: {
    backgroundColor: 'skyblue',
    borderColor: 'skyblue',
  },
  blackText: {
    color: 'black',
  },
  chevronIcon: {
    fontSize: 20,
    color: 'lightgrey',
  },
});

export default ViewScreen;

