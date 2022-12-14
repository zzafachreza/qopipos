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

import ThermalPrinterModule from 'react-native-thermal-printer';

export default function TransactionDetail({ navigation, route }) {




    const [textPrint, setTextPrint] = useState({
    });
    const isFocused = useIsFocused();
    const [user, setUser] = useState({});

    useEffect(() => {
        if (isFocused) {
            __getTransaction(route.params.inv);
            __getTransactionDetail(route.params.inv);
            __getTransactionStatus(route.params.inv);
        }
    }, [isFocused]);


    const __getTransaction = (inv) => {
        axios.post(apiURL + 'v1_history_detail.php', {
            inv: inv,
            api_token: urlToken
        }).then(res => {
            // console.log(res.data);
            setHeader(res.data);
            setTextPrint({
                ...textPrint,
                header:
                    `[L]<b>${res.data.nama_outlet}</b>\n\n` +
                    `[L]${res.data.alamat_outlet}\n` +
                    `[L]--------------------------------\n` +
                    `[L]${res.data.tanggal_jam}\n` +
                    `[L]Order ID     : ${res.data.inv}\n` +
                    `[L]Collected By : qp coffee\n` +
                    `[L]--------------------------------\n` +
                    `[L]            <b>*dine in*</b>\n\n` +

                    `[L]<b>1x Hot Qopi Latte</b>      <b>@11,200</b>\n` +
                    `[L]Regular,Cold, + Cendol\n` +

                    `[L]<b>2x Es Qopi Cendol</b>      <b>@36,200</b>\n` +
                    `[L]Regular,Hot\n` +

                    `[L]<b>1x Es Qopi Cincau</b>      <b>@21,000</b>\n` +
                    `[L]Regular,Cold, + Marie Regal\n` +
                    `[L]--------------------------------\n` +
                    `[L]Subtotal               @68,200\n` +
                    `[L]PPN (Included)\n` +
                    `[L]--------------------------------\n` +
                    `[L]<b>Total               @68,200</b>\n` +
                    `[L]--------------------------------\n` +
                    `[L]Cash                        <b>@0</b>\n` +
                    `[L]Change                      <b>@0</b>\n` +
                    `[L]--------------------------------\n` +
                    `[L]qopi-coffee.com                    \n` +
                    `[L]qpcoffee.id                        \n` +
                    `[L]qpcoffee.id                        \n`
                ,



            })
        })
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
            setDatail(res.data)
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
                    <View style={{
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
                    </View>
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
                <MyButton onPress={async () => {
                    // inside async function
                    try {
                        await ThermalPrinterModule.printBluetooth({
                            payload: textPrint.header,
                            printerNbrCharactersPerLine: 10

                        });


                    } catch (err) {
                        //error handling
                        console.log(err.message);
                    }
                }} title="Print Pesanan" Icons="print-outline" warna={colors.primary} />
            </View>


        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})