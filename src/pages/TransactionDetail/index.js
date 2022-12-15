import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    Linking,
    ActivityIndicator,
    Alert,
    Keyboard,
    TextInput,
} from 'react-native';

import { apiURL, getData, storeData, urlAPI, urlToken } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, myDimensi, windowHeight, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'react-native-elements/dist/helpers';

// printer


import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";

import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';


export default function TransactionDetail({ navigation, route }) {

    const [paired, setPaired] = useState({
        device_name: '',
        inner_mac_address: ''
    });

    const [pairednet, setPairednet] = useState('');


    const [loading, setLoading] = useState(false);

    const isFocused = useIsFocused();
    const [user, setUser] = useState({});
    const [pos, setPOS] = useState({});

    useEffect(() => {
        if (isFocused) {

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

            getData('pairednet').then(res => {
                if (!res) {
                    setPairednet('000.000.000')
                } else {
                    setPairednet(res)
                }
            })


            __getTransaction(route.params.inv);
            __getTransactionDetail(route.params.inv);
            __getTransactionStatus(route.params.inv);
            __getTransactionPOS(route.params.inv)
        }


    }, [isFocused]);




    const printData = async () => {

        BluetoothManager.connect(paired.inner_mac_address)
            .then(async (s) => {
                console.log(s);
                let columnWidths = [8, 20, 20];
                try {

                    NetPrinter.init().then(async () => {
                        NetPrinter.connectPrinter(pairednet, 9100).then(async res => {

                            detail.map(item => {

                                NetPrinter.printBill(`Order ID : ${header.inv}\n${item.nama_barang}\n${item.ukuran} ${item.ukuran}, ${item.suhu} ${item.data_topping == '' ? '' : ', ' + item.data_topping} ${item.catatan !== '' ? ', ' + item.catatan : ''}\n${header.tanggal_jam}`);



                            })

                        })
                    })


                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printText("" + header.nama_outlet + "\n\r", {
                        encoding: 'GBK',
                        codepage: 0,
                        widthtimes: 1,
                        heigthtimes: 1,
                        fonttype: 1
                    });
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printText("" + header.alamat_outlet + "\n\r", {
                        encoding: 'GBK',
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,
                        fonttype: 1
                    });
                    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printText("" + header.inv + "\n\r", {});
                    await BluetoothEscposPrinter.printText("" + header.tanggal_jam + "\n\r", {});
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printColumn([12, 6, 12],
                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["Customer", ':', pos.nama_lengkap], {});
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printText("*" + pos.jenis + "*\n\r", {});
                    // product detail
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

                    detail.map(item => {
                        BluetoothEscposPrinter.printColumn([19, 13],
                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                            ["" + item.qty + "x " + item.nama_barang, `@${new Intl.NumberFormat().format(item.total)}`], {
                            codepage: 0,
                            widthtimes: 0,
                            heigthtimes: 0,

                        });
                        BluetoothEscposPrinter.printText(`${item.ukuran} ${item.ukuran}, ${item.suhu} ${item.data_topping == '' ? '' : ', ' + item.data_topping} ${item.catatan !== '' ? ', ' + item.catatan : ''} \n\r`, {
                            fonttype: 2,
                        });

                    })

                    // last product
                    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
                    BluetoothEscposPrinter.printColumn([19, 13],
                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["Subtotal", `@${new Intl.NumberFormat().format(header.total_biaya)}`], {
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,

                    });
                    BluetoothEscposPrinter.printColumn([19, 13],
                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["PPN (Included)", ``], {
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,

                    });
                    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
                    BluetoothEscposPrinter.printColumn([19, 13],
                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["Metode Pembayaran", `${header.pembayaran}`], {
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,

                    });
                    BluetoothEscposPrinter.printColumn([19, 13],
                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                        ["Total", `@${new Intl.NumberFormat().format(header.total_bayar)}`], {
                        codepage: 0,
                        widthtimes: 0,
                        heigthtimes: 0,

                    });
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
                    await BluetoothEscposPrinter.printQRCode(
                        'https://qp-coffee.com/',
                        280,
                        BluetoothEscposPrinter.ERROR_CORRECTION.L,
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


    }


    const __getTransaction = (inv) => {
        axios.post(apiURL + 'v1_history_detail.php', {
            inv: inv,
            api_token: urlToken
        }).then(res => {
            // console.log(res.data);
            setHeader(res.data);

        });
    }

    const __getTransactionPOS = (inv) => {
        axios.post(apiURL + 'v1_history_detail_pos.php', {
            inv: inv,
            api_token: urlToken
        }).then(res => {
            console.log('POST', res.data);
            setPOS(res.data);

        });
    }


    const __getTransactionStatus = (inv) => {
        axios.post(apiURL + 'v1_history_detail_status.php', {
            inv: inv,
            api_token: urlToken
        }).then(res => {
            console.warn(res.data);
            setStatus(res.data)
        })
    }


    const __getTransactionDetail = (inv) => {
        axios.post(apiURL + 'v1_history_detail_produk.php', {
            inv: inv,
            api_token: urlToken
        }).then(res => {
            // console.log(res.data);
            setDatail(res.data);


        })
    }



    const [detail, setDatail] = useState([]);
    const [header, setHeader] = useState([]);
    const [status, setStatus] = useState([]);

    const MyList = ({ judul, isi, tanggal }) => {
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: colors.white,
            }}>

                <View style={{
                    marginLeft: 10,
                    width: 10,
                    borderLeftWidth: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: colors.primary,
                        width: 10,
                        marginLeft: -10,
                        height: 10,
                        borderRadius: 5,
                    }} />
                </View>
                <View style={{
                    flex: 1.5,
                    padding: 10,
                    justifyContent: 'flex-start',
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: myDimensi / 4,
                        color: colors.black,
                    }}>
                        {judul}
                    </Text>

                    <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: myDimensi / 4,
                        color: colors.black,

                    }}>
                        {isi}
                    </Text>
                    <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: myDimensi / 4,
                        color: colors.primary,

                    }}>
                        {tanggal}
                    </Text>


                </View>
            </View>
        )
    }

    const __renderItem = ({ item, index }) => {

        let jumlah = item.qty;
        return (

            <View style={{
                flexDirection: 'row',
                marginVertical: 5,
            }}>

                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: 1,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <Text
                                style={{
                                    fontFamily: fonts.secondary[600],
                                    fontSize: myDimensi / 4,
                                    marginRight: 10,

                                }}>
                                {item.qty}x
                            </Text>
                            <View>
                                <Text
                                    style={{
                                        fontFamily: fonts.secondary[600],
                                        fontSize: myDimensi / 4,
                                    }}>
                                    {item.nama_barang}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: fonts.secondary[400],
                                        fontSize: myDimensi / 4,
                                        color: colors.border_label
                                    }}>
                                    {item.ukuran}, {item.suhu} {item.data_topping == '' ? '' : ', ' + item.data_topping} {item.catatan !== '' ? ', ' + item.catatan : ''}
                                </Text>
                            </View>
                        </View>

                    </View>

                </View>
                <View style={{ marginRight: 10, justifyContent: 'center' }}>
                    <Text
                        style={{

                            fontFamily: fonts.primary[600],
                            color: colors.black,
                            fontSize: myDimensi / 4,
                        }}>
                        Rp. {new Intl.NumberFormat().format(item.total)}
                    </Text>
                </View>
            </View>


        );
    };
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.border_form,
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{
                    backgroundColor: colors.white,
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border_form,
                        paddingBottom: 10,
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 4,

                            }}>Transaksi</Text>
                            <Text style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: myDimensi / 4,
                                color: colors.border_label
                            }}>{header.inv}</Text>
                        </View>

                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Jenis Transaksi</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>{pos.jenis}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Pelanggan</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>{pos.nama_lengkap} / {pos.telepon}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Tanggal Transaksi</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>{header.tanggal_jam}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Status Transaksi</Text>
                        <View>
                            <Text style={{
                                backgroundColor: colors.primary,
                                padding: 5,
                                borderRadius: 5,
                                color: colors.white,
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 4
                            }}>{header.status}</Text>
                        </View>
                    </View>


                </View>

                {status.map(i => {
                    return (
                        <MyList judul={i.status} tanggal={i.tanggal_jam} isi={i.isi} />

                    )
                })}
                {/* detail produk */}

                <View style={{
                    marginTop: 10,
                    backgroundColor: colors.white,
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border_form,
                        paddingBottom: 10,
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 4,

                            }}>Detail Produk</Text>
                        </View>

                    </View>
                    {/* detail produk */}


                    <FlatList data={detail} renderItem={__renderItem} />
                </View>

                {/* detail pickup */}

                <View style={{
                    backgroundColor: colors.white,
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingBottom: 10,
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 4,
                                marginBottom: 10,

                            }}>Detail Outlet</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 10,
                                }}>
                                    <Image source={require('../../assets/pickup_location.png')} style={{
                                        width: 25,
                                        height: 20
                                    }} />
                                </View>
                                <View>
                                    <Text style={{
                                        fontFamily: fonts.primary[600],
                                        fontSize: myDimensi / 4,
                                        color: colors.black,
                                        marginBottom: 5,

                                    }}>Lokasi Outlet</Text>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        fontSize: myDimensi / 4,
                                        color: colors.primary,
                                    }}>{header.nama_outlet}</Text>
                                    <Text style={{
                                        fontFamily: fonts.primary[400],
                                        fontSize: myDimensi / 4,
                                        color: colors.black,

                                    }}>{header.alamat_outlet}</Text>
                                </View>
                            </View>


                        </View>

                    </View>

                </View>
                {/* Rincian Pembayaran */}

                <View style={{
                    backgroundColor: colors.white,
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border_form,
                        paddingBottom: 10,
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 4,

                            }}>Rincian Pembayaran</Text>
                        </View>

                    </View>
                    {/* detail produk */}

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Metode Pembayaran</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>{header.pembayaran}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Total Transaksi</Text>
                        <Text
                            style={{

                                fontFamily: fonts.primary[600],
                                color: colors.black,
                                fontSize: myDimensi / 4,
                            }}>
                            Rp. {new Intl.NumberFormat().format(header.total_biaya)}
                        </Text>
                    </View>
                    {/* <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Diskon Member</Text>
                        <Text
                            style={{

                                fontFamily: fonts.primary[400],
                                color: colors.border_label,
                                fontSize: myDimensi / 4,
                            }}>
                            Rp. {new Intl.NumberFormat().format(header.diskon_member)}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Diskon Voucher</Text>
                        <Text
                            style={{

                                fontFamily: fonts.primary[400],
                                color: colors.border_label,
                                fontSize: myDimensi / 4,
                            }}>
                            Rp. {new Intl.NumberFormat().format(header.diskon_voucher)}
                        </Text>
                    </View> */}
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 5,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: myDimensi / 4
                        }}>Total Pembayaran</Text>
                        <Text
                            style={{

                                fontFamily: fonts.primary[600],
                                color: colors.black,
                                fontSize: myDimensi / 4,
                            }}>
                            Rp. {new Intl.NumberFormat().format(header.total_bayar)}
                        </Text>
                    </View>

                </View>





            </ScrollView>

            <View style={{
                padding: 10,
                backgroundColor: colors.white
            }}>
                {!loading && <MyButton onPress={printData} title="Print Pesanan" Icons="print-outline" warna={colors.primary} />}
                {loading && <ActivityIndicator size="large" color={colors.primary} />}
            </View>


        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})