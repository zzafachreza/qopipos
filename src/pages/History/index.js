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

export default function History({ navigation }) {
    const isFocused = useIsFocused();
    const [user, setUser] = useState({});

    useEffect(() => {
        if (isFocused) {
            getData('user').then(rx => {
                setUser(rx);
                __getTransaction(rx.id);
            });

        }
    }, [isFocused]);


    const [data, setData] = useState([]);


    const __getTransaction = (x) => {
        axios.post(apiURL + 'v1_history.php', {
            fid_user: x,
            api_token: urlToken
        }).then(res => {
            console.warn(res.data);
            setData(res.data)
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
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
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
        <SafeAreaView>
            <FlatList data={data} renderItem={__renderItem} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})