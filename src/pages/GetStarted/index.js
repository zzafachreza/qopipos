import { Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { fonts, myDimensi, windowHeight } from '../../utils/fonts'
import { colors } from '../../utils/colors'
import { MyButton, MyGap } from '../../components'

export default function GetStarted({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/getstarted.png')} style={{
            flex: 1,
            padding: 10,
        }}>
            {/* <StatusBar translucent={true} backgroundColor={'transparent'} /> */}
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image source={require('../../assets/getstarted_icon.png')} />
            </View>
            <View style={{
                padding: 10,
            }}>
                <Text style={{
                    fontFamily: fonts.primary[600],
                    color: colors.white,
                    fontSize: myDimensi,
                    marginBottom: 10,
                }}>Selamat Datang!</Text>

                <MyButton Icons="mail-outline" onPress={() => navigation.navigate('Login')} warna={colors.primary} title="Masuk dengan Email" />
                <MyGap jarak={10} />
                <MyButton onPress={() => navigation.navigate('Register')} title="Buat Akun" />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({})