import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

import Home from './screens/Home';
import {PaperProvider} from 'react-native-paper';
import CustomScrollableTabBar from './components/CustomScrollableTabBar';

const Tab = createMaterialTopTabNavigator();

const App = (): React.JSX.Element => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

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
            }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Tasks" component={Home} />
            <Tab.Screen name="Tasks2" component={Home} />
            <Tab.Screen name="Tasks3" component={Home} />
            <Tab.Screen name="Tasks4" component={Home} />
            <Tab.Screen name="Tasks5" component={Home} />
            <Tab.Screen name="Tasks6" component={Home} />
            <Tab.Screen name="Tasks7" component={Home} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
