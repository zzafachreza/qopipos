import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, StatusBar } from 'react-native'
import React, { userState, useEffect, useState, useRef } from 'react'
import { fonts, myDimensi, windowHeight, windowWidth } from '../../utils/fonts'
import { colors } from '../../utils/colors'
import { Icon } from 'react-native-elements'
import { MyButton, MyGap, MyInput } from '../../components'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { apiURL, storeData, urlToken } from '../../utils/localStorage'
import { showMessage, hideMessage } from "react-native-flash-message";
import { Modalize } from 'react-native-modalize';

export default function Login({ navigation }) {


  const modalizeRef = useRef();
  const [loading, setLoading] = useState(false);
  const [buka, setBuka] = useState(true);

  const [kirim, setKirim] = useState({
    api_token: urlToken,
    email: '',
    password: '',
  });


  const __masuk_via_email = () => {
    console.log(kirim);

    setLoading(true);

    setTimeout(() => {
      console.log('send server', kirim);
      axios.post(apiURL + 'v1_login_kasir.php', kirim).then(res => {
        console.log(res.data);
        setLoading(false);

        if (res.data.status === 404) {
          showMessage({
            type: 'danger',
            message: res.data.message
          })
        } else if (res.data.status === 200) {
          storeData('user', res.data);
          navigation.replace('MainApp');

        }
      })

    }, 1200)
  }

  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white
    }}>


      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{
          flex: 0.8,
          justifyContent: 'center',
          padding: 20,
        }}>

          <Image source={require('../../assets/logo.png')} style={{
            resizeMode: 'contain',
            height: myDimensi / 0.5,
            alignSelf: 'center'
          }} />
        </View>

        <View style={{
          flex: 2,
          paddingHorizontal: windowWidth / 5,

        }}>
          <Text style={{
            fontFamily: fonts.primary.normal,
            fontSize: myDimensi / 3,
            color: colors.border_label,
            marginBottom: 5,
          }}>Username</Text>

          <View style={{
            position: 'relative'
          }}>
            <View style={{
              position: 'absolute',
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%', padding: 10,
            }}>
              <Icon type='ionicon' name='at-outline' size={myDimensi / 2.5} color={colors.primary} />
            </View>
            <TextInput autoCapitalize='none' value={kirim.username} onChangeText={v => setKirim({
              ...kirim,
              username: v
            })}

              style={{
                borderWidth: 1,
                borderColor: colors.border_form,
                borderRadius: 10,
                fontSize: myDimensi / 3,
                paddingLeft: 35,
                paddingTop: 12,
                fontFamily: fonts.primary.normal
              }}
              placeholder="Masukan username"
            />
          </View>

          <MyGap jarak={25} />
          <Text style={{
            fontFamily: fonts.primary.normal,
            fontSize: myDimensi / 3,
            color: colors.border_label,
            left: 2,
            marginBottom: 5,
          }}>Kata Sandi</Text>
          <View style={{
            position: "relative"
          }}>
            <View style={{
              position: 'absolute',
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%', padding: 10,
            }}>
              <Icon type='ionicon' name='lock-closed-outline' size={myDimensi / 2.5} color={colors.primary} />
            </View>
            <TextInput autoCapitalize='none' value={kirim.password} onChangeText={v => setKirim({
              ...kirim,
              password: v
            })} secureTextEntry={buka} style={{
              borderWidth: 1,
              borderColor: colors.border_form,
              borderRadius: 10,
              fontSize: myDimensi / 3,
              paddingLeft: 35,
              paddingTop: 12,
              fontFamily: fonts.primary.normal

            }} placeholder="Masukan kata sandi" />
            <TouchableOpacity onPress={() => {

              if (buka) {
                setBuka(false)
              } else {
                setBuka(true)
              }

            }} style={{
              position: 'absolute',
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%', padding: 10,
            }}>
              <Icon type='ionicon' name={buka ? 'eye-outline' : 'eye-off-outline'} size={myDimensi / 2.5} color={colors.border_label} />
            </TouchableOpacity>

          </View>



          <MyGap jarak={30} />
          {!loading && <MyButton onPress={__masuk_via_email} title="Masuk" warna={colors.primary} Icons="log-in-outline" />}
          {loading && <ActivityIndicator color={colors.primary} size="large" />}
          <MyGap jarak={10} />
        </View>
      </ScrollView>
      {
        loading && (
          <LottieView
            source={require('../../assets/animation.json')}
            autoPlay
            loop
            style={{ backgroundColor: colors.primary }}
          />
        )
      }
    </SafeAreaView>




  )
}

const styles = StyleSheet.create({})