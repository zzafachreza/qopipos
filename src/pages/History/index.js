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
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export default function History({ navigation }) {
    const isFocused = useIsFocused();
    const [user, setUser] = useState({});

    useEffect(() => {



        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const json = JSON.stringify(remoteMessage);
            const obj = JSON.parse(json);
            console.log(obj);
            PushNotification.localNotification({
                channelId: 'qopipos', // (required) channelId, if the channel doesn't exist, notification will not trigger.
                title: obj.notification.title, // (optional)
                message: obj.notification.body, // (required)
            });
            getData('user').then(rx => {
                console.log('user', rx)
                setUser(rx);
                __getTransaction(rx.fid_outlet);
            });
        });
        if (isFocused) {
            getData('user').then(rx => {
                console.log('user', rx)
                setUser(rx);
                __getTransaction(rx.fid_outlet);
            });

        }

        return unsubscribe
    }, [isFocused]);


    const [data, setData] = useState([]);
    const [tmp, setTmp] = useState([])
    const [noData, setNodata] = useState(false);

    const __getTransaction = (x) => {
        axios.post(apiURL + 'v1_history_pos.php', {
            fid_outlet: x,
            api_token: urlToken
        }).then(res => {
            console.warn(res.data);
            setData(res.data);
            setTmp(res.data);
        })
    }

    const __renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('TransactionDetail', {
                inv: item.inv
            })} style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.border_form,
                margin: 5,
                borderRadius: 5,
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 14
                    }}>{item.inv}</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: 12
                    }}>{item.tanggal}</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 14,
                        color: colors.primary,
                    }}>{item.status}</Text>
                </View>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 14,
                        color: colors.primary,
                    }}>Nama Outlet</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        color: colors.black,
                    }}>{item.nama_outlet}</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 10,
                        backgroundColor: item.tipe == "POS" ? colors.secondary : colors.primary,
                        color: colors.white,
                        paddingHorizontal: 10,
                        width: 120,
                        borderRadius: 30,
                        textAlign: 'center',
                    }}>{item.tipe}</Text>
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 10,
                        backgroundColor: colors.primary,
                        color: colors.white,
                        paddingHorizontal: 10,
                        width: 80,
                        borderRadius: 30,
                        textAlign: 'center',
                    }}>{item.pembayaran}</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 14,
                        color: colors.black,
                    }}> Rp. {new Intl.NumberFormat().format(item.total_bayar)}</Text>

                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{}}>
            <View style={{
                padding: 10,
                backgroundColor: colors.white,
            }}>
                <MyInput borderColor={noData ? colors.danger : colors.border_form} keyboardType="number-pad" nolabel placeholder="Cari kode transaksi" onChangeText={x => {
                    const filtered = data.filter(i => i.inv.toLowerCase().indexOf(x.toLowerCase()) > -1);
                    console.log('filter', filtered);
                    if (filtered.length > 0 && x.toString().length > 0) {
                        setData(filtered);
                        setNodata(false);
                    } else if (filtered.length == 0 && x.toString().length > 0) {
                        setData(tmp);
                        setNodata(true);
                    } else if (filtered.length == 0 && x.toString().length == 0) {
                        setData(tmp);
                        setNodata(false);
                    } else {
                        setData(tmp);
                        setNodata(false);
                    }
                }} />
            </View>
            <FlatList data={data} renderItem={__renderItem} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})