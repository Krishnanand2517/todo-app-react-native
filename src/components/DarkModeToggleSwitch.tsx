import React, {useRef, useState, useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';

import ThemeContext, {ThemeContextType} from '../context/ThemeContext';

const DarkModeToggleSwitch = (): React.JSX.Element => {
  const {theme, setTheme} = useContext(ThemeContext) as ThemeContextType;

  let animationValue = 0;
  let dayOpacityValue = 1,
    nightOpacityValue = 0;
  if (theme === 'dark') {
    animationValue = 32;
    dayOpacityValue = 0;
    nightOpacityValue = 1;
  }

  const animation = useRef(new Animated.Value(animationValue)).current;
  const dayOpacity = useRef(new Animated.Value(dayOpacityValue)).current;
  const nightOpacity = useRef(new Animated.Value(nightOpacityValue)).current;

  const [isDay, setIsDay] = useState(theme === 'light');

  const toggleAnimation = () => {
    setIsDay(!isDay);
    setTheme(theme === 'light' ? 'dark' : 'light');

    Animated.parallel([
      Animated.timing(animation, {
        toValue: isDay ? 32 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(dayOpacity, {
        toValue: isDay ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nightOpacity, {
        toValue: isDay ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{translateX: animation}],
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={[styles.button, !isDay && styles.darkButton]}
        activeOpacity={0.9}
        onPress={toggleAnimation}>
        <Animated.View style={[styles.icon, animatedStyle]}>
          <Animated.Image
            source={require('../assets/day-icon.png')}
            style={[styles.iconImage, {opacity: dayOpacity}]}
          />
          <Animated.Image
            source={require('../assets/night-icon.png')}
            style={[styles.iconImage, {opacity: nightOpacity}]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default DarkModeToggleSwitch;

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 24,
  },
  button: {
    width: 70,
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
  },
  darkButton: {
    backgroundColor: '#000',
    borderColor: '#FFF',
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
