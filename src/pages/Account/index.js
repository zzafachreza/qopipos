import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { windowWidth, fonts } from '../../utils/fonts';
import { apiURL, getData, storeData, urlAPI, urlApp, urlAvatar, webURL } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import RNPrint from 'react-native-print';
export default function Account({ navigation, route }) {
    const [user, setUser] = useState({});
    const [com, setCom] = useState({});
    const isFocused = useIsFocused();
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState('');



    useEffect(() => {


        if (isFocused) {
            getData('user').then(res => {

                setOpen(true);
                setUser(res);
                axios.post(webURL + 'api_outlet_cek', {
                    fid_user: res.id
                }).then(x => {
                    console.log(x.data);
                    setStatus(x.data);
                })

            });

            getData('token').then(x => {
                console.log(x.token);
                setToken(x.token);
            })
        }




    }, [isFocused]);

    const btnKeluar = () => {
        Alert.alert('Qopi untuk semua', 'Apakah kamu yakin akan keluar ?', [
            {
                text: 'Batal',
                style: "cancel"
            },
            {
                text: 'Keluar',
                onPress: () => {
                    storeData('user', null);

                    navigation.replace('Login');
                }
            }
        ])
    };

    const MyList = ({ label, value }) => {
        return (
            <View
                style={{
                    marginVertical: 3,
                    padding: 5,
                    backgroundColor: colors.white,
                    borderRadius: 5,
                }}>
                <Text
                    style={{
                        fontFamily: fonts.secondary[600],
                        color: colors.black,
                    }}>
                    {label}
                </Text>
                <Text
                    style={{
                        fontFamily: fonts.secondary[400],
                        color: colors.primary,
                    }}>
                    {value}
                </Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10
        }}>

            {!open && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>}

            {open && <>


                {/* data detail */}
                <View style={{ padding: 10, flex: 1 }}>
                    <MyList label="Nama Outlet" value={user.nama_outlet} />
                    <MyList label="Alamat Outlet" value={user.alamat_outlet} />
                    <MyList label="Nama Lengkap" value={user.nama_lengkap} />
                    <MyList label="Email" value={user.email} />
                    <MyList label="Telepon / Whatsapp" value={user.telepon} />

                </View>
                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-around' }}>

                    <View style={{
                        flex: 1,
                    }}>
                        <MyButton
                            onPress={btnKeluar}
                            title="Keluar"
                            colorText={colors.white}
                            iconColor={colors.white}
                            warna={colors.black}
                            Icons="log-out-outline"
                        />
                    </View>

                </View>
            </>}

            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 10,
                }}>
                    <MyButton Icons="bluetooth" title="Atur printer Bluetooth" warna={colors.primary} onPress={() => {
                        navigation.navigate('PrinterBluetooth')
                    }} />
                </View>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 10,
                }}>
                    <MyButton Icons="wifi" title="Atur printer Jaringan" warna={colors.danger} onPress={() => {
                        navigation.navigate('PrinterNetwork')
                    }} />
                </View>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 10,
                }}>
                    {status == 'MATI' && <MyButton Icons="notifications" title="Atur Notifikasi" warna={colors.secondary} onPress={() => {
                        Alert.alert('Qopi POS', 'Akfifkan Notifikasi ?', [
                            {
                                text: "TIDAK",
                            },
                            {
                                text: "AKTIFKAN NOTIFIKASI",
                                onPress: () => {
                                    // console.log(token);
                                    axios.post(webURL + 'api_outlet', {
                                        fid_user: user.id,
                                        fid_outlet: user.fid_outlet,
                                        token: token
                                    }).then(res => {
                                        console.log(res.data);
                                        setStatus('AKTIF')
                                    })
                                }
                            }
                        ])
                    }} />}

                    {status == 'AKTIF' && <MyButton Icons="notifications" title="Matikan Notifikasi" warna={colors.border} onPress={() => {
                        Alert.alert('Qopi POS', 'Matikan Notifikasi ?', [
                            {
                                text: "TIDAK",
                            },
                            {
                                text: "MATIKAN NOTIFIKASI",
                                onPress: () => {
                                    // console.log(token);
                                    axios.post(webURL + 'api_outlet_delete', {
                                        fid_user: user.id,
                                    }).then(res => {
                                        console.log(res.data);
                                        setStatus('MATI')
                                    })
                                }
                            }
                        ])
                    }} />}
                </View>
            </View>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({});
