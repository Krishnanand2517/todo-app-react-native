import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import AddTask from './screens/AddTask';
import EditTask from './screens/EditTask';

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  EditTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="EditTask" component={EditTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
