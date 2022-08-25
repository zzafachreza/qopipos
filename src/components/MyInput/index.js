import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { fonts, myDimensi } from '../../utils/fonts';
import { TextInput } from 'react-native-gesture-handler';

export default function MyInput({
  onFocus,
  label,
  iconname,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  autoFocus,
  multiline,
  iconLeft = true,
  label2,
  paddingLeft = 30,
  styleLabel,
  height = 40,
  onSubmitEditing,
  nolabel = false,
  colorIcon = colors.primary,
}) {
  return (
    <>

      {!nolabel && <Text style={{
        fontFamily: fonts.primary.normal,
        fontSize: myDimensi / 2,
        color: colors.border_label,
        marginBottom: 5,
      }}>{label}</Text>}

      <View style={{
        position: 'relative'
      }}>
        {iconLeft && <View style={{
          position: 'absolute',
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', padding: 10,
        }}>
          <Icon type='ionicon' name={iconname} size={myDimensi / 3} color={colors.primary} />
        </View>}
        <TextInput onSubmitEditing={onSubmitEditing} autoFocus={autoFocus} autoCapitalize='none' value={value} onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={{
            borderWidth: 1,
            borderColor: colors.border_form,
            borderRadius: 10,
            height: height,
            fontSize: myDimensi / 5,
            paddingLeft: paddingLeft,
            paddingTop: 10,
            fontFamily: fonts.primary.normal
          }}
          placeholder={placeholder}
        />
        {!iconLeft && <View style={{
          position: 'absolute',
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', padding: 10,
        }}>
          <Icon type='ionicon' name={iconname} size={myDimensi / 3} color={colors.primary} />
        </View>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
