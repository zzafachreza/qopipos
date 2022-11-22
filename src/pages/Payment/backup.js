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
import midtransClient from 'midtrans-client';
import { apiURL, getData, storeData, urlAPI, urlToken } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, myDimensi, windowHeight, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import 'intl';
import base64 from 'react-native-base64'
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
export default function Payment({ navigation, route }) {
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);;
    const [loading, setLoading] = useState(false);
    const [itemz, setItem] = useState({});
    const [bayar, setBayar] = useState('');
    const [openQR, setOpenQR] = useState(false);
    const [url, setUrl] = useState('');

    const isFocused = useIsFocused();

    const APIKEY = "U0ItTWlkLXNlcnZlci1GTVcxMTRPMDhHLVgxZlhqR1ZnVkk1M3E6"

    const sendBayar = () => {

        getData('user').then(res => {

            const dd = {
                fid_user: res.id,
                fid_outlet: res.fid_outlet,
                harga_total: total,
                bayar: bayar,

            }



            axios.post(apiURL + 'v1_payment.php', dd).then(res => {
                console.warn('respon', res.data.actions[1].url);
                // Linking.openURL(res.data.actions[0].url)
                setUrl(res.data.actions[0].url);
                setOpenQR(true);
            })
        })

        // axios.post(apiURL + 'v1_payment.php',{

        // })




        // var myHeaders = new Headers();
        // myHeaders.append("Accept", "application/json");
        // myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Basic ");

        // var raw = "\n\n";

        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        //     body: raw,
        //     redirect: 'follow'
        // };

        // fetch("https://api.sandbox.midtrans.com/v2/SANDBOX-G710367688-806/status", requestOptions)
        //     .then(response => response.text())
        //     .then(result => console.log(result))
        //     .catch(error => console.log('error', error));




        // setLoading(true)
        // getData('user').then(res => {

        //     const dd = {
        //         fid_user: res.id,
        //         fid_outlet: res.fid_outlet,
        //         harga_total: total,
        //         bayar: bayar,

        //     }
        //     console.log(total)
        //     setTimeout(() => {
        //         setLoading(false);
        //         navigation.navigate('Payment', dd)
        //     }, 1200)

        //     console.log(dd);



        // });


    }

    useEffect(() => {
        if (isFocused) {
            getData('user').then(rx => {
                setUser(rx);
                __getDataBarang(rx.id);
            });

        }
        getBank();

    }, [isFocused]);
    const [total, setTotal] = useState(0);


    const __getDataBarang = (zz) => {
        axios.post(apiURL + '/v1_cart.php', {
            fid_user: zz
        }).then(x => {
            setData(x.data);
            console.log('data cart', x.data);
            let sub = 0;
            x.data.map((i, key) => {
                sub += parseFloat(i.total);

            });

            setTotal(sub);
        })

    }

    const getBank = () => {
        axios.post(apiURL + 'v1_bank.php', {
            api_token: urlToken,
        }).then(res => {
            console.warn('bank', res.data);
            setBank(res.data);
        })
    }

    const [bank, setBank] = useState([])






    const __renderItem = ({ item, index }) => {
        return (

            <View style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: colors.border_card
            }}>

                <View style={{ padding: 10, flex: 1, }}>
                    <View style={{
                        flex: 1,
                    }}>
                        <Text
                            style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 2,
                            }}>
                            {item.nama_barang}
                        </Text>
                        <Text
                            style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: myDimensi / 2.5,
                                color: colors.border_label
                            }}>
                            {item.ukuran}, {item.suhu} {item.data_topping == '' ? '' : ', ' + item.data_topping} {item.catatan !== '' ? ', ' + item.catatan : ''}
                        </Text>
                    </View>


                </View>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingRight: 10,
                }}>
                    <Text
                        style={{

                            fontFamily: fonts.primary[600],
                            color: colors.black,
                            fontSize: myDimensi / 2,
                        }}>
                        Rp. {new Intl.NumberFormat().format(item.total)}
                    </Text>
                </View>

            </View>


        );
    };





    return (
        <SafeAreaView
            style={{
                backgroundColor: colors.white
            }}>

            <ScrollView>
                <FlatList data={data} renderItem={__renderItem} />
                <View style={{
                    // flex: 1,
                    marginTop: 20,
                    flexDirection: 'row',
                    paddingRight: 20,
                }}>
                    <Text
                        style={{
                            flex: 1,
                            fontSize: myDimensi / 2,
                            fontFamily: fonts.secondary[400],
                            color: colors.border_label,
                            left: 10,
                        }}>
                        Total Pembayaran

                    </Text>
                    <Text
                        style={{
                            fontSize: myDimensi / 1.8,
                            fontFamily: fonts.secondary[600],
                            color: colors.black,
                            left: 10,
                        }}>
                        Rp. {new Intl.NumberFormat().format(total)}

                    </Text>
                </View>





                {bank.map((item, index) => {
                    return (

                        <TouchableOpacity onPress={() => {
                            setBayar(item.rekening_bank)
                            // let items = [...bank];
                            // let item = { ...items[index] };
                            // item.pilih = 1;
                            // items[index] = item;
                            // let filter = items.filter((x, i) => i !== index);
                            // filter.map(i => {
                            //     items[i.id].pilih = 0;
                            // })
                            // setBank(items);


                        }} style={bayar == item.rekening_bank ? styles.ok : styles.not}>
                            <Image style={{
                                height: 80,
                                width: 80,
                                resizeMode: 'contain'
                            }} source={{
                                uri: item.image
                            }} />
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.secondary[600],
                                fontSize: myDimensi / 2
                            }}>{item.nama_bank}</Text>
                            <View style={{
                                padding: 10,
                            }}>
                                {bayar == item.rekening_bank && <Icon name='check-circle' color={colors.primary} solid size={myDimensi / 2} />}

                            </View>
                        </TouchableOpacity>
                    )
                })
                }






                {!loading &&

                    <View style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: colors.white
                    }}>
                        <MyButton warna={colors.primary} title={`BAYAR ${bayar}`} onPress={sendBayar} />
                    </View>
                }

                {openQR && <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '20%'
                }}>

                    <Image style={{
                        width: windowWidth,
                        height: windowHeight / 2
                    }} source={{
                        uri: url
                    }} />
                    <View style={{
                        width: 100
                    }}>
                        <MyButton onPress={() => {
                            setOpenQR(false)
                        }} Icons='close' title='Close' warna={colors.black} />
                    </View>
                </View>}
            </ScrollView>




            {loading && <View style={{
                padding: 10,
                flex: 1,
                width: windowWidth,
                height: windowHeight,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                opacity: 0.5,
                backgroundColor: colors.primary,
            }}><ActivityIndicator size="large" color={colors.primary} /></View>}

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    ok: {
        padding: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: colors.border_form,
        borderBottomColor: colors.border_form,
        borderLeftWidth: 10,
        borderLeftColor: colors.primary,
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center'
    },
    not: {
        padding: 0,
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center'
    },
    textOk: {

        fontFamily: fonts.primary[600],
        fontSize: myDimensi / 2.5,
        color: colors.primary

    },

    textNot: {

        fontFamily: fonts.primary[600],
        fontSize: myDimensi / 2.5,
        color: colors.black

    },

})
