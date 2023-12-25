import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert,ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../redux/categoriesSlice';
import axios from 'axios';

const AddScreen = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const setStatestodefault = ()=>{
    setCategoryName('');
    setCategoryImage(null);
    setSubCategoryName('');
    setSubCategories([]);
    setIsLoading(false)
  }


  const handleChooseImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      setCategoryImage(image.path);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const handlePlusButton = () => {
    if (subCategoryName.trim() == '') {
      Alert.alert('Please write sub category name');
    } else {
      setSubCategories([...subCategories, { name: subCategoryName }]);
      setSubCategoryName('');
      Alert.alert('Success', 'Sub-category added successfully');
    }
  };

  const handleMinusButton = () => {
    if (subCategories == []) {
      Alert.alert('No Sub category with this name is available for remove')
    }
    if (subCategoryName.trim() !== '') {
      const updatedSubCategories = subCategories.filter(subCat => subCat.name !== subCategoryName);
      setSubCategories(updatedSubCategories);
      setSubCategoryName('');
      Alert.alert('Success', 'Sub-category removed successfully');
    }
  };

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const addCategories = async ()=>{
    try {
      const response = await axios.post('https://your-api-endpoint.com/categories', {
        category_name: categoryName,
        image: categoryImage,
        sub_cateries: subCategories,
      });

      console.log('API Response:', response);
      setIsLoading(false)

      Alert.alert('Success', 'Category added successfully');
      setStatestodefault();
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to add category');
      setIsLoading(false)
      setStatestodefault();
    }

  }

  const handleAddButton = () => {
    setIsLoading(true)
  if (categoryName =='') {
    Alert.alert("Please write category name")
    setIsLoading(false)
    return;
  }
  const tempArray = [...categories];  
  const newCategory = {
    _id: generateUniqueId(),
    category_name: categoryName,
    image: categoryImage, 
    sub_cateries: subCategories.map((subCat, index) => ({
      _id: `6586d833353e741a226e03f${index + 8}`, 
      name: subCat.name,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  }; 
  tempArray.push(newCategory)
  dispatch(setCategories(tempArray))
  addCategories()
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, styles.blackText]}>Add Categories & Subcategories</Text>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* Very light grey border at the top */}
        <View style={styles.topBorder} />

        {/* Input field for Category Name */}
        <Text style={styles.inputLabel}>Category Name</Text>
        <TextInput
          style={styles.input}
          value={categoryName}
          onChangeText={(text) => setCategoryName(text)}
        />

        {/* Category Image section */}
        <Text style={styles.inputLabel}>Category Image</Text>
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity
            style={styles.enlargedBox}
            onPress={handleChooseImage}
          >
            {categoryImage ? (
              <Image source={{ uri: categoryImage }} style={styles.categoryImagePreview} />
            ) : (
              <View style={styles.imageIconContainer}>
                <Image source={require('/Users/mac/Desktop/testApp/AwesomeProject/assets/photo.png')} style={styles.imageIcon} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chooseFileButton}
            onPress={handleChooseImage}
          >
            <Text style={styles.chooseFileButtonText}>Choose File</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.inputLabel, styles.subCategoryTitle]}>Create Sub-category</Text>
        <View style={styles.subCategoryContainer}>
          <TextInput
            style={styles.subCategoryInput}
            placeholder="Enter Sub-category Name"
            value={subCategoryName}
            onChangeText={(text) => setSubCategoryName(text)}
          />
          <TouchableOpacity
            style={styles.subCategoryButton}
            onPress={handlePlusButton}
          >
            <Image source={require('/Users/mac/Desktop/testApp/AwesomeProject/assets/add.png')} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.subCategoryContainer}>
          <TextInput
            style={styles.subCategoryInput}
            placeholder="Enter Sub-category Name"
            value={subCategoryName}
            onChangeText={(text) => setSubCategoryName(text)}
          />
          <TouchableOpacity
            style={styles.subCategoryButton1}
            onPress={handleMinusButton}
          >
            <Image source={require('/Users/mac/Desktop/testApp/AwesomeProject/assets/minus.png')} style={styles.minusIcon} />
          </TouchableOpacity>
        </View>
      </View>
  <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddButton}
        disabled={isLoading} 
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.addButtonText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  plusIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  minusIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
    paddingTop: 20,
    position: 'relative',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'lightgrey',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  blackText: {
    color: 'black',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  enlargedBox: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dotted',
    marginRight: 10,
  },
  categoryImagePreview: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginRight: 10,
  },
  imageIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 50,
    height: 50,
    tintColor: 'lightgrey',
  },
  chooseFileButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 'auto',
    width: 140,
    alignItems: 'center', 
  },
  chooseFileButtonText: {
    color: 'white',
  },
  subCategoryTitle: {
    marginTop: 10,
  },
  subCategoryContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  subCategoryInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 5,
    marginRight: 5,
  },
  subCategoryButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  subCategoryButton1: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  addButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    alignSelf: 'stretch',
    marginTop: 40,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddScreen;
