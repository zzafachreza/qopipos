import { Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import { apiURL, getData } from '../../utils/localStorage';
import { colors } from '../../utils/colors';



export default function Payment({ navigation, route }) {

    const [user, setUser] = useState({});

    useEffect(() => {
        getData('user').then(u => {
            console.log(u);
            setUser(u)
        })


    }, [])
    const onMessage = ({ nativeEvent }) => {
        const data = nativeEvent.data;
        console.log('getdata', data);
        // if (data !== undefined && data !== null) {
        //     Linking.openURL(data);
        // }
    }

    const injectScript = `
  (function () {
    window.onclick = function(e) {
      e.preventDefault();
      window.postMessage(e.target.href);
      e.stopPropagation()
    }
  }());
`;
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white
        }}>
            <WebView
                onShouldStartLoadWithRequest={request => {
                    console.log(request.url);
                    Linking.openURL(request.url);
                    setTimeout(() => {
                        navigation.goBack();
                    }, 500)
                    return false
                }}
                injectedJavaScript={injectScript}
                onMessage={onMessage} source={{ uri: apiURL + 'v1_payment.php?fid_user=' + user.id + '&fid_outlet=' + user.fid_outlet + '&diskon_voucher=' + route.params.diskon_voucher + '&persen_voucher=' + route.params.persen_voucher + '&diskon_member=' + route.params.diskon_member + '&persen_member=' + route.params.persen_member + '&tanggal_pickup=' + route.params.tanggal_pickup + '&jam_pickup=' + route.params.jam_pickup + '&jenis=' + route.params.jenis + '&fid_pelanggan=' + route.params.fid_pelanggan }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})