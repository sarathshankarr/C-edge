import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ColorContext } from '../../components/colorTheme/colorTheme';

const Splash = () => {
  const navigation = useNavigation();
  const Logo = require('./../../../assets/images/png/Logo.png');
  const { colors } = useContext(ColorContext);
  const styles = getStyles(colors);

  // Shared values for animations
  const translateX = useSharedValue(-300);
  const dotAnimations = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  useEffect(() => {
    // Slide-in animation for logo
    translateX.value = withTiming(0, { duration: 1500, easing: Easing.out(Easing.exp) });

    // Start bounce animations for dots with delays for wave effect
    dotAnimations.forEach((dot, index) => {
      dot.value = withDelay(
        index * 200, // Stagger start times
        withRepeat(
          withSequence(
            withTiming(-10, { duration: 300, easing: Easing.out(Easing.cubic) }), // Bounce up
            withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }) // Bounce down
          ),
          -1, // Infinite repeat
          false
        )
      );
    });

    // Check login status after animations
    const checkLoginStatus = async () => {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginComponent' }],
        });
      }, 2000);
    };

    checkLoginStatus();
  }, [translateX, dotAnimations, navigation]);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getDotStyle = (index) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: dotAnimations[index].value }],
    }));

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.Image style={[styles.logo, logoStyle]} source={Logo} />

      {/* Animated Dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((_, index) => (
          <Animated.View key={index} style={[styles.dot, getDotStyle(index)]} />
        ))}
      </View>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.color2,
    marginHorizontal: 8,
  },
});

export default Splash;
