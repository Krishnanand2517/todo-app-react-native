import React, {useRef, useEffect} from 'react';
import {Animated, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';

const CustomScrollableTabBar = ({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps): React.JSX.Element => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      const tabWidth = 120;
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
      style={styles.tabBarWrapper}
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

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0.5)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}>
            <Animated.Text
              key={route.key}
              style={[
                styles.tabText,
                isFocused && styles.tabTextSelected,
                {opacity},
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
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabBarContentContainer: {
    alignItems: 'center',
  },
  tabText: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 32,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  tabTextSelected: {
    fontWeight: '700',
    backgroundColor: '#ADF7B6',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#000',
  },
});
