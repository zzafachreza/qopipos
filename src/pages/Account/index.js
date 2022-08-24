import { FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../utils/colors'
import { apiURL, getData, urlToken } from '../../utils/localStorage';
import { fonts, myDimensi, windowHeight, windowWidth } from '../../utils/fonts';
import { Icon } from 'react-native-elements'
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';
export default function Account() {
    const [user, setUser] = useState({});
    useEffect(() => {
        getData('user').then(u => {
            setUser(u)
        });
    }, []);


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white
        }}>

            {/* header */}
            <View style={{
                flexDirection: 'row',
                backgroundColor: colors.primary,
                height: windowHeight / 15,

                padding: 10,
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={{
                        fontFamily: fonts.primary[600],
                        fontSize: myDimensi / 2,
                        color: colors.white
                    }}>Akun Saya</Text>
                </View>
                <TouchableOpacity style={{
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../assets/cart_white.png')} style={{
                        width: 20,
                        height: 20,
                    }} />
                </TouchableOpacity>

                <TouchableOpacity style={{
                    marginHorizontal: 15,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../assets/bell_white.png')} style={{
                        width: 16,
                        height: 20
                    }} />
                </TouchableOpacity>

                <TouchableOpacity style={{
                    marginHorizontal: 15,
                }}>
                    <Image source={require('../../assets/face.png')} style={{
                        width: myDimensi / 1,
                        height: myDimensi / 1,
                        borderRadius: 5,
                    }} />
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})