import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddCategoryProps {
  onAddCategory: (category: string) => Promise<void>;
  navigation: any;
}

const AddCategory = ({onAddCategory, navigation}: AddCategoryProps) => {
  const [category, setCategory] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    setIsEmpty(category.trim() === '');

    const checkDuplicate = async () => {
      const value = await AsyncStorage.getItem('categories');
      let allCategories: string[] = [];

      if (value !== null) {
        allCategories = JSON.parse(value);
      }

      setIsDuplicate(allCategories.includes(category));
    };

    checkDuplicate();
  }, [category]);

  const onDoneButtonPressed = async () => {
    await onAddCategory(category);
    setCategory('');

    setTimeout(() => {
      navigation.navigate(category, {
        taskCategory: category,
      });
    }, 200);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headWrapper}>
          <Text style={styles.headingText}>Add a New Category</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              (isEmpty || isDuplicate) && styles.addButtonDisabled,
            ]}
            onPress={onDoneButtonPressed}
            activeOpacity={0.7}
            disabled={isEmpty || isDuplicate}>
            <Text style={styles.addButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.categoryInput}
            value={category}
            onChangeText={setCategory}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    backgroundColor: '#FFF6E9',
  },
  container: {
    margin: 24,
  },
  headWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#2B2D42',
  },
  addButton: {
    backgroundColor: '#33B249',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
  },
  addButtonDisabled: {
    backgroundColor: '#D3D3D3',
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  inputWrapper: {
    marginTop: 24,
  },
  categoryInput: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#2B2D42',
  },
});
