import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, StatusBar } from 'react-native'
import React, { userState, useEffect, useState, useRef } from 'react'
import { fonts, myDimensi, windowHeight } from '../../utils/fonts'
import { colors } from '../../utils/colors'
import { Icon } from 'react-native-elements'
import { MyButton, MyGap, MyInput } from '../../components'
import axios from 'axios'
import OTPTextInput from 'react-native-otp-textinput';
import { Modalize } from 'react-native-modalize';
import CountDown from 'react-native-countdown-component';
import { apiURL } from '../../utils/localStorage'
import { showMessage, hideMessage } from "react-native-flash-message";
export default function Otp({ navigation, route }) {

    const modalizeRef = useRef();

    const [timerCount, setTimer] = useState('01:34')

    useEffect(() => {

    }, []);




    const [loading, setLoading] = useState(false);
    const [buka, setBuka] = useState(true);

    const [kirim, setKirim] = useState(route.params);


    const __kirim_otp = () => {

        setLoading(true);

        setTimeout(() => {
            axios.post(apiURL + 'v1_otp.php', kirim).then(res => {
                console.log(res.data);
                if (res.data.status == 404) {
                    showMessage({
                        type: 'danger',
                        message: res.data.message
                    })
                } else {
                    navigation.navigate('RegisterSuccess')
                }

            });

            setLoading(false);
        }, 1000)

    }

    return (

        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <StatusBar backgroundColor={'transparent'} barStyle="dark-content" />


                <View style={{
                    flex: 0.8,
                    justifyContent: 'center',
                    padding: 20,
                }}>
                    <Image source={require('../../assets/otp_mail.png')} style={{
                        resizeMode: 'contain',
                        height: myDimensi / 0.25,
                        alignSelf: 'center'
                    }} />

                    <Text style={{
                        fontFamily: fonts.primary[600],
                        fontSize: myDimensi / 1.5,
                        color: colors.black_font,
                        textAlign: 'center'
                    }}>Verifikasi Email Anda</Text>

                    <Text style={{
                        fontFamily: fonts.primary[400],
                        fontSize: myDimensi / 2,
                        color: colors.black_font,
                        textAlign: 'center'
                    }}>Masukkan kode yang kami kirimkan ke
                        email {kirim.email.replace(kirim.email.substr(0, 5), '*****')}</Text>



                </View>

                <View style={{
                    flex: 2,

                    paddingHorizontal: 10,

                }}>

                    <CountDown
                        until={10}
                        size={20}
                        onFinish={() => console.log('Finished')}
                        digitStyle={{ backgroundColor: colors.black }}
                        digitTxtStyle={{ color: colors.white }}
                        timeToShow={['M', 'S']}
                        timeLabels={{ m: '', s: '' }}
                    />
                    <View style={{
                        padding: 20,
                    }}>
                        <OTPTextInput handleTextChange={x => {
                            console.log(x)
                            setKirim({
                                ...kirim,
                                otp: x
                            })
                        }} tintColor={colors.primary} />
                    </View>
                    <Text style={{
                        fontFamily: fonts.primary.normal,
                        fontSize: myDimensi / 2,
                        color: colors.black_font,
                        textAlign: 'center'
                    }}>Tidak menerima kode ?</Text>
                    <TouchableOpacity>
                        <Text style={{
                            fontFamily: fonts.primary[600],
                            fontSize: myDimensi / 2,
                            color: colors.primary,
                            textAlign: 'center'
                        }}>Kirim Ulang</Text>
                    </TouchableOpacity>

                    <MyGap jarak={20} />

                    <View style={{
                        borderWidth: 1,
                        borderColor: colors.border_card,
                        padding: 10,
                        borderRadius: 10,
                    }}>
                        {!loading && <MyButton onPress={__kirim_otp} title="Konfirmasi" warna={colors.primary} />}
                    </View>

                    {loading && <ActivityIndicator color={colors.primary} size="large" />}

                </View>
                <MyGap jarak={50} />
                <Text style={{
                    fontFamily: fonts.primary.normal,
                    fontSize: myDimensi / 2,
                    color: colors.black_font,
                    textAlign: 'center'
                }}>Email Anda salah ?</Text>
                <TouchableOpacity onPress={() => modalizeRef.current.open()}>
                    <Text style={{
                        fontFamily: fonts.primary[600],
                        fontSize: myDimensi / 2,
                        color: colors.primary,
                        textAlign: 'center'
                    }}>Ganti Email</Text>
                </TouchableOpacity>

                <Modalize
                    withHandle={false}
                    scrollViewProps={{ showsVerticalScrollIndicator: false }}
                    snapPoint={windowHeight / 2}
                    HeaderComponent={
                        <View style={{ padding: 10, flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>

                                </View>
                                <TouchableOpacity onPress={() => modalizeRef.current.close()}>
                                    <Icon type="ionicon" name="close-outline" size={35} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    ref={modalizeRef} >
                    <View style={{ flex: 1, padding: 10, }}>

                        <Text
                            style={{
                                fontFamily: fonts.primary[600],
                                fontSize: myDimensi,
                                color: colors.black_font,
                            }}>
                            Ganti Email
                        </Text>
                        <MyGap jarak={10} />
                        <MyInput autoFocus placeholder="Masukan email baru" iconname="mail-outline" label="Masukkan email baru, pastikan email aktif!" />
                        <MyGap jarak={10} />
                        <MyButton warna={colors.primary} title="Konfirmasi" />
                    </View>
                </Modalize >
            </ScrollView>

        </SafeAreaView >




    )
}

const styles = StyleSheet.create({})