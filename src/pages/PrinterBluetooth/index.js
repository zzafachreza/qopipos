import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native';
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
import { MyButton } from '../../components';

export default function PrinterBluetooth() {
    const [printer, setPrinter] = useState([]);
    const [paired, setPaired] = useState({
        device_name: '',
        inner_mac_address: ''
    });


    useEffect(() => {

        getData('paired').then(res => {
            if (!res) {
                setPaired({
                    device_name: '',
                    inner_mac_address: ''
                })
            } else {
                setPaired(res)
            }
        })

        BLEPrinter.init().then(() => {
            BLEPrinter.getDeviceList().then(res => {
                console.log(res);
                setPrinter(res);
            });
        });
    }, []);


    const __renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                Alert.alert('Qopi POS', 'Pilih perangkat ' + item.device_name + ' jadi yang utama ?', [
                    {
                        text: 'TIdak',
                    },
                    {
                        text: 'IYA',
                        onPress: () => {
                            setPaired(item);
                            storeData('paired', item);
                        }
                    }
                ])
            }} style={{
                padding: 10,
                backgroundColor: paired.inner_mac_address == item.inner_mac_address ? colors.border_form : colors.white,
                marginVertical: 1,
            }}>
                <Text style={{
                    fontFamily: fonts.primary[600],
                    fontSize: myDimensi / 4
                }}>{item.device_name}</Text>
                <Text style={{
                    fontFamily: fonts.primary[400],
                    fontSize: myDimensi / 4
                }}>{item.inner_mac_address}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
            backgroundColor: colors.border_form
        }}>
            <FlatList renderItem={__renderItem} data={printer} />
            <MyButton onPress={async () => {
                BluetoothManager.connect(paired.inner_mac_address)
                    .then(async (s) => {
                        console.log(s);
                        let columnWidths = [8, 20, 20];
                        try {

                            // NetPrinter.init().then(async () => {
                            //     NetPrinter.connectPrinter('192.168.0.77', 9100).then(async res => {
                            //         await NetPrinter.printBill("<C>QOPI POS by ZAVALABS</C>\n<C>================</C>\n<C>Test Print Berhasil</C>\n\n");

                            //         await NetPrinter.printBill("<C>QOPI POS by ZAVALABS</C>\n<C>================</C>\n<C>Test Print Berhasil</C>\n\n");

                            //     })
                            // })


                            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
                            // await BluetoothEscposPrinter.printPic(logoCetak, { width: 250, left: 150 });
                            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                            await BluetoothEscposPrinter.printColumn(
                                [37],
                                [BluetoothEscposPrinter.ALIGN.LEFT],
                                ['Qopi POS BY Zavalabs'],
                                {
                                    encoding: 'GBK',
                                    codepage: 0,
                                    widthtimes: 1,
                                    heigthtimes: 1,
                                    fonttype: 1
                                },
                            );
                            await BluetoothEscposPrinter.printColumn(
                                [32],
                                [BluetoothEscposPrinter.ALIGN.CENTER],
                                ['Test Printer Berhasil '],
                                {},
                            );

                            await BluetoothEscposPrinter.printText('\r\n\r\n', {});
                        } catch (e) {
                            alert(e.message || 'ERROR');
                        }



                    }, (e) => {
                        this.setState({
                            loading: false
                        })
                        alert(e);
                    })

            }} warna={colors.primary} title="Test Print" Icons="print" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})