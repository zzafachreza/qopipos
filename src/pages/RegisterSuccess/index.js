import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, StatusBar } from 'react-native'
import React, { userState, useEffect, useState, useRef } from 'react'
import { fonts, myDimensi, windowHeight } from '../../utils/fonts'
import { colors } from '../../utils/colors'
import { Icon } from 'react-native-elements'
import { MyButton, MyGap, MyInput } from '../../components'
import axios from 'axios'
import OTPTextInput from 'react-native-otp-textinput';
import { Modalize } from 'react-native-modalize';

export default function RegisterSuccess({ navigation }) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',

            padding: 20,
        }}>
            <Image source={require('../../assets/register_icon.png')} style={{
                resizeMode: 'contain',
                height: myDimensi / 0.15,
                alignSelf: 'center'
            }} />
            <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: myDimensi / 1.5,
                color: colors.black_font,
                textAlign: 'center'
            }}>Pendaftaran Selesai</Text>
            <Text style={{
                marginTop: 10,
                marginBottom: 30,
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 2,
                color: colors.black_font,
                textAlign: 'center'
            }}>Terimakasih telah bergabung dengan kami. Silahkan menikmati semua fitur yang kami sediakan.</Text>

            <MyButton onPress={() => navigation.navigate('Login')} warna={colors.primary} title="Lanjutkan" />
        </View>
    )
}

const styles = StyleSheet.create({})