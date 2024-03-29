import React, {useRef, useEffect, useContext} from 'react';
import {Animated, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';

import ThemeContext, {ThemeContextType} from '../context/ThemeContext';

const CustomScrollableTabBar = ({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps): React.JSX.Element => {
  const {theme} = useContext(ThemeContext) as ThemeContextType;

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      const tabWidth = 80;
      const offset = state.index * tabWidth;
      scrollViewRef.current.scrollTo({x: offset, animated: true});
    }
  }, [state]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      style={[
        styles.tabBarWrapper,
        theme === 'dark' && styles.tabBarWrapperDark,
      ]}
      contentContainerStyle={styles.tabBarContentContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        let opacity: number | Animated.AnimatedInterpolation<number> = 1;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, {
              taskCategory: label,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (state.routes.length >= 2) {
          const inputRange = state.routes.map((_, i) => i);
          opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0.5)),
          });
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}>
            <Animated.Text
              style={[
                styles.tabText,
                isFocused && styles.tabTextSelected,
                {opacity},
                theme === 'dark' && styles.tabTextDark,
                isFocused && theme === 'dark' && styles.tabTextSelectedDark,
              ]}>
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CustomScrollableTabBar;

const styles = StyleSheet.create({
  tabBarWrapper: {
    height: 60,
    flexGrow: 0,
    // borderBottomWidth: 2,
    // borderBottomColor: '#000',
    backgroundColor: '#FFF6E9',
  },
  tabBarWrapperDark: {
    backgroundColor: '#121212',
  },
  tabBarContentContainer: {
    alignItems: 'center',
  },
  tabText: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 32,
    fontSize: 16,
    color: '#000',
    fontFamily: 'NunitoSans-Bold',
  },
  tabTextDark: {
    color: '#FFF',
    opacity: 0.87,
  },
  tabTextSelected: {
    fontFamily: 'NunitoSans-Bold',
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  tabTextSelectedDark: {
    borderBottomColor: '#FFF',
  },
});
