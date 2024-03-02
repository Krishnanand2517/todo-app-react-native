import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './screens/Home';
import AddCategory from './screens/AddCategory';
import {PaperProvider} from 'react-native-paper';
import CustomScrollableTabBar from './components/CustomScrollableTabBar';

export type RootTabsPropList = {
  [key: string]:
    | {
        taskCategory?: string;
        onDeleteCategory?: (category: string) => Promise<void>;
      }
    | undefined;
  AddCategory: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabsPropList>();

const AddCategoryScreen = ({route}: {route: any}) => {
  const {onAddCategory} = route.params;

  return <AddCategory onAddCategory={onAddCategory} />;
};

const App = (): React.JSX.Element => {
  const [categories, setCategories] = useState<string[]>(['All Tasks']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const value = await AsyncStorage.getItem('categories');
        let allCategories: string[] = [];

        if (value !== null) {
          allCategories = JSON.parse(value);
        } else {
          allCategories = ['All Tasks'];
          await AsyncStorage.setItem(
            'categories',
            JSON.stringify(allCategories),
          );
        }

        if (Array.isArray(allCategories) && allCategories.length > 0) {
          setCategories(allCategories);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(
            'Failed to fetch categories from storage:',
            error.message,
          );
        }
      }
    };

    fetchCategories();
    SplashScreen.hide();
  }, []);

  const onAddCategory = async (category: string) => {
    try {
      setCategories(prevCategories => {
        const updatedCategories = [...prevCategories, category];
        AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        return updatedCategories;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          'Failed to add new category in phone storage:',
          error.message,
        );
      }
    }
  };

  const onDeleteCategory = async (category: string) => {
    try {
      setCategories(prevCategories => {
        const updatedCategories = prevCategories.filter(
          prevCategory => prevCategory !== category,
        );
        AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        return updatedCategories;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          'Failed to delete category from phone storage:',
          error.message,
        );
      }
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            tabBar={props => <CustomScrollableTabBar {...props} />}
            screenOptions={{
              tabBarBounces: true,
              tabBarScrollEnabled: true,
              tabBarItemStyle: {width: 120},
            }}
            initialRouteName="All Tasks">
            {categories.map(category => (
              <Tab.Screen
                key={category}
                name={category}
                component={Home}
                initialParams={{taskCategory: category, onDeleteCategory}}
              />
            ))}
            <Tab.Screen
              name="AddCategory"
              component={AddCategoryScreen}
              initialParams={{onAddCategory}}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
