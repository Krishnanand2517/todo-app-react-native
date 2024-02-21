import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Home from './screens/Home';
import AddTask from './screens/AddTask';
import EditTask from './screens/EditTask';
import {PaperProvider} from 'react-native-paper';

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  EditTask: {task: Task};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddTask" component={AddTask} />
            <Stack.Screen name="EditTask" component={EditTask} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
