import React, { useEffect } from 'react';
import {
  Dimensions,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../utils/colors';
import { windowWidth } from '../../utils/fonts';
import { getData } from '../../utils/localStorage';

export default function Splash({ navigation }) {
  const scaleLogo = new Animated.Value(0.1);
  const scaleText = new Animated.Value(100);

  Animated.timing(scaleLogo, {
    toValue: 1,
    duration: 1000,
  }).start();


  useEffect(() => {
    const unsubscribe = getData('user').then(res => {
      if (!res) {
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      } else {
        setTimeout(() => {
          navigation.replace('MainApp');
        }, 2000);
      }
    });

  }, []);

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={{
          resizeMode: 'contain',
          height: windowWidth / 3,
          aspectRatio: scaleLogo,
        }}
      />
      <ActivityIndicator size="large" color={colors.primary} />
    </SafeAreaView>
  );
}
