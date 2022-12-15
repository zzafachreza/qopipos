import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import { Linking } from 'react-native';
import { Alert } from 'react-native';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    NativeEventEmitter,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Text,
    ToastAndroid,
    View,
    StyleSheet
} from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { colors } from '../../utils/colors';

import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { fonts, myDimensi } from '../../utils/fonts';
import { getData, storeData } from '../../utils/localStorage';
import { MyButton, MyInput } from '../../components';
export default function PrinterNetwork() {
    const [open, setOpen] = useState(false);
    const [pairednet, setPairednet] = useState('');
    useEffect(() => {

        getData('pairednet').then(res => {
            if (!res) {
                setPairednet('000.000.000')
            } else {
                setPairednet(res)
            }
        })

    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
            justifyContent: 'center',
            backgroundColor: colors.border_form
        }}>
            {!open && <View style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center'
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontFamily: fonts.secondary[600],
                        fontSize: myDimensi / 2
                    }}>{pairednet}</Text>
                    <Text style={{
                        textAlign: 'center',
                        fontFamily: fonts.secondary[200],
                        fontSize: myDimensi / 5,
                        color: colors.border,
                    }}>pastikan tablet dan tab terhubung dalam 1 jaringan</Text>
                </View>
                <View style={{
                    flex: 1,
                }}>
                    <MyButton onPress={() => {

                        setOpen(true);
                    }} Icons="wifi" title="Ubah Alamat IP Printer" warna={colors.border} />
                </View>

            </View>}

            {open && <View style={{
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <TextInput autoFocus onChangeText={x => setPairednet(x)} keyboardType='number-pad' style={{
                        borderWidth: 1,
                        marginHorizontal: 10,
                        borderRadius: 10,
                        borderColor: colors.primary,
                        textAlign: 'center',
                        fontFamily: fonts.secondary[400],
                        fontSize: myDimensi / 3
                    }} placeholder="cth : 192.168.0.1" />
                </View>
                <View style={{
                    flex: 1,
                }}>
                    <MyButton onPress={() => {
                        storeData('pairednet', pairednet);
                        setOpen(false);
                    }} Icons="checkmark-circle-outline" title="Simpan" warna={colors.secondary} />
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 10,
                }}>
                    <MyButton onPress={() => {
                        setPairednet('000.000.000.000');
                        setOpen(false);
                    }} Icons="close-circle-outline" title="Batal" warna={colors.danger} />
                </View>

            </View>}

            {!open &&
                <View style={{}}>
                    <MyButton warna={colors.primary} Icons="print" onPress={() => {
                        NetPrinter.init().then(async () => {
                            NetPrinter.connectPrinter(pairednet, 9100).then(async res => {
                                await NetPrinter.printBill("<C>QOPI POS by ZAVALABS</C>\n<C>================</C>\n<C>Test Print Berhasil</C>\n\n");

                                await NetPrinter.printBill("<C>QOPI POS by ZAVALABS</C>\n<C>================</C>\n<C>Test Print Berhasil</C>\n\n");

                            })
                        })
                    }} title="Test Print" />
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})