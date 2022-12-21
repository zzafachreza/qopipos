import { Linking, SafeAreaView, StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import { apiURL, getData } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { fonts, myDimensi } from '../../utils/fonts';
import { MyButton } from '../../components';
import axios from 'axios';



export default function PaymentCash({ navigation, route }) {

    const [item, setItem] = useState(route.params);
    const sendServer = () => {
        console.log(item);
        axios.post(apiURL + 'v1_cash.php', item).then(res => {
            console.log(res.data);
            Alert.alert('Qopi POS', 'Transaksi berhasil ' + res.data);
            navigation.replace('MainApp')
        })
    }


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 10,
        }}>
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 3,
                        }}>Total Trasaksi</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: myDimensi / 1.5,
                        }}>Rp. {new Intl.NumberFormat().format(item.harga_total)}</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 3,
                        }}>Bayar</Text>
                        <TextInput onChangeText={x => {
                            setItem({
                                ...item,
                                bayar: x,
                                kembalian: x - item.harga_total
                            })
                        }} style={{
                            width: '80%',
                            textAlign: 'center',
                            fontFamily: fonts.secondary[600],
                            fontSize: myDimensi / 1.5,
                        }} autoFocus keyboardType='number-pad' />
                    </View>
                    <View>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 3,
                        }}>Kembalian</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: myDimensi / 1.5,
                        }}>Rp. {new Intl.NumberFormat().format(item.kembalian)}</Text>
                    </View>
                </View>
            </View>
            {item.bayar > item.harga_total && <MyButton onPress={sendServer} title="Simpan Transaksi" warna={colors.primary} />}
            {item.bayar < item.harga_total && <Text style={{
                textAlign: 'center',
                fontFamily: fonts.secondary[600],
                color: colors.danger
            }}>Kurang Bayar...</Text>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})