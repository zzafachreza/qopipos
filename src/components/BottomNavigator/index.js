import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { myDimensi } from '../../utils/fonts';

export default function BottomNavigator({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ backgroundColor: colors.white, flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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

        let iconName = 'desktop';
        let labelName = 'POS';

        if (label === 'Home') {
          iconName = 'desktop-outline';
        } else if (label === 'Account') {
          iconName = 'person-outline';
          labelName = 'Akun'
        } else if (label === 'History') {
          iconName = 'receipt-outline';
          labelName = 'Transaksi';
        } else if (label === 'Wish') {
          iconName = 'heart-outline';
          labelName = 'Favorit';
        } else if (label === 'CartSewa') {
          iconName = 'file-tray-full-outline';
          labelName = 'Sewa';
        } else if (label === 'Pesanan') {
          iconName = 'cube-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={
              label === 'Chat'
                ? () =>
                  Linking.openURL(
                    'https://api.whatsapp.com/send?phone=6289653763986',
                  )
                : onPress
            }
            onLongPress={onLongPress}
            style={{ flex: 1 }}>
            <View
              style={{
                color: isFocused ? colors.white : '#919095',
                paddingTop: 5,
                paddingBottom: 0,
                fontSize: 12,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
              <View
                style={{
                  width: 80,
                  bottom: 0,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={isFocused ? iconName.replace('-outline', '') : iconName}
                  type="ionicon"
                  size={myDimensi / 2}
                  color={isFocused ? colors.primary : colors.primary}
                />

                <Text
                  style={{
                    fontSize: myDimensi / 5,
                    color: isFocused ? colors.primary : colors.primary,
                  }}>
                  {labelName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: iconName => ({
    // paddingTop: 5,
    // paddingBottom: 5,
    // fontSize: 12,
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
  }),
  box: iconName => ({}),
});