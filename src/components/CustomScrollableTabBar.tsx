import React from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';

const CustomScrollableTabBar = ({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps): React.JSX.Element => {
  return (
    <ScrollView
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

        return (
          <Text
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabText, isFocused && styles.tabTextSelected]}>
            {label}
          </Text>
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
    color: '#888888',
  },
  tabTextSelected: {
    fontWeight: '700',
    color: '#000',
    backgroundColor: '#ADF7B6',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#000',
  },
});
