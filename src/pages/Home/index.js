import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../utils/colors'
import { apiURL, getData, urlToken } from '../../utils/localStorage';
import { fonts, myDimensi, windowHeight, windowWidth } from '../../utils/fonts';
import { Icon } from 'react-native-elements'
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';
import Modal from 'react-native-modal'
import { MyButton, MyGap, MyInput } from '../../components';

import { useIsFocused } from '@react-navigation/native';
import { TextInput } from 'react-native';


export default function Home({ navigation, route }) {
  const [modalProduct, setModalProduct] = useState(false)
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [kategori, setKategori] = useState([]);
  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState([]);
  const [add, setAdd] = useState({
    topping: {
      pilih: '',
      data: [
        {
          label: 'Aren',
          harga: 3000
        },
        {
          label: 'Cendol',
          harga: 3000
        },
        {
          label: 'Cingcau',
          harga: 3000
        }
      ]
    },
    sugar: {
      pilih: '',
      data: [
        {
          label: 'Extra Sugar',
          harga: 0
        },
        {
          label: 'Less Sugar',
          harga: 0
        },
        {
          label: 'No Sugar',
          harga: 0
        }
      ]
    }
  });
  const [showProduct, setShowProduct] = useState({
    qty: 1,
    topping_data: '',
    topping: 0,
    sugar: 0,
    sugar_data: '',
    catatan: ''
  });
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const isFocused = useIsFocused();
  const toggleProduct = () => {
    setModalProduct(!modalProduct);
  };

  useEffect(() => {

    if (isFocused) {
      getData('user').then(u => {
        setUser(u)
        __getDataBarang(u.id);
      });
    }

    getProduk();
    getKategori();
  }, [isFocused]);


  const getKategori = () => {
    axios.post(apiURL + 'v1_kategori.php', {
      api_token: urlToken,
    }).then(res => {
      setKategori(res.data);
    })
  }


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

  const hanldeHapus = (x) => {
    axios.post(apiURL + '/v1_cart_delete.php', {
      id_cart: x,
      api_token: urlToken
    }).then(xx => {

      console.log(xx.data);
      getData('user').then(tkn => {
        __getDataBarang(tkn.id);
        setLoading(false);
      });

    })
  };

  const [openKategori, setOpenKategori] = useState(true);

  var totalBiaya = 0;

  const getProduk = (x = 2, key) => {
    setLoading(true);
    axios.post(apiURL + 'v1_produk.php', {
      api_token: urlToken,
      fid_kategori: x,
      key: key
    }).then(res => {
      setLoading(false);
      setProduk(res.data);
    })
  }

  const __renderKategori = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        setOpenKategori(false);
        getProduk(item.id)
        console.log(item.id)
      }} style={{
        height: windowHeight / 4.5,
        borderWidth: 1,
        flex: 1,
        margin: 5,
        borderColor: colors.border_card,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        <Image style={{
          width: 70,
          height: 70,
          resizeMode: 'contain'
        }} source={{
          uri: item.image
        }} />
        <Text style={{
          marginTop: 10,
          fontFamily: fonts.primary.normal,
          fontSize: myDimensi / 5
        }}>{item.nama_kategori}</Text>
      </TouchableOpacity>
    )
  }

  const __renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        // setModalProduct(true);
        // setShowProduct({
        //   qty: 1,
        //   topping: 0,
        //   topping_data: '',
        //   sugar_data: '',
        //   sugar: 0,
        //   nama_barang: item.nama_barang,
        //   harga_barang: item.harga_barang,
        //   diskon: item.diskon,
        //   fid_barang: item.id,
        //   catatan: ''
        // })
        navigation.navigate('Product', item)
      }} style={{
        flex: 0.3,
        marginVertical: 5,
        borderWidth: 1,
        marginHorizontal: 5,
        borderRadius: 5,
        padding: 10,
        borderColor: colors.border_card,
      }}>
        <Image style={{
          width: '100%',
          height: 80,
          resizeMode: 'contain'
        }} source={{
          uri: item.image
        }} />

        <View style={{
          width: '100%',
          alignItems: 'flex-end',
          height: 25,
        }}>
          {item.diskon > 0 && <Text
            style={{
              fontSize: myDimensi / 8,
              padding: 5,
              margin: 2,
              borderRadius: 5,
              textAlign: 'center',
              color: colors.white,
              backgroundColor: colors.primary,
              fontFamily: fonts.primary.normal,
            }}>
            Disc {new Intl.NumberFormat().format(item.diskon)}%
          </Text>}


        </View>


        <View style={{
          height: 50,
        }}>
          <Text style={{
            fontFamily: fonts.primary[600],
            fontSize: myDimensi / 5,
            marginBottom: 5,
            color: colors.black
          }}>{item.nama_barang}</Text>

          <Text style={{
            fontFamily: fonts.primary[400],
            fontSize: myDimensi / 5.5,
            marginBottom: 5,
            color: colors.border_label
          }}>{item.keterangan_barang}</Text>
        </View>




        <View style={{
          flexDirection: 'row',
          height: 20,
          alignItems: 'center'
        }}>
          {item.diskon > 0 &&
            <Text
              style={{
                fontSize: myDimensi / 7,
                color: colors.black,
                marginRight: 10,
                marginBottom: 10,
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                fontFamily: fonts.primary.normal,
              }}>
              Rp. {new Intl.NumberFormat().format(item.harga_dasar)}
            </Text>
          }
          <View style={{
            flex: 1,
          }}>

            <Text style={{
              fontFamily: fonts.primary[600],
              fontSize: myDimensi / 5,
              marginBottom: 5,
              color: colors.black
            }}>Rp. {new Intl.NumberFormat().format(item.harga_barang)}</Text>
          </View>
          <View style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Icon type='ionicon' name='arrow-forward-outline' color={colors.primary} size={myDimensi / 3} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const __renderItemCart = ({ item, index }) => {

    let jumlah = item.qty;
    return (

      <View style={{
        flexDirection: 'row',
        paddingRight: 10,
      }}>

        <View style={{ padding: 10, flex: 1, borderBottomWidth: 1, borderBottomColor: colors.border_form }}>
          <View style={{
            flex: 1,
          }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: myDimensi / 5,
              }}>
              {item.nama_barang} x {item.qty}
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
                fontSize: myDimensi / 5.5,
                color: colors.border_label
              }}>
              {item.ukuran}, {item.suhu} {item.data_topping == '' ? '' : ', ' + item.data_topping} {item.catatan !== '' ? ', ' + item.catatan : ''}
            </Text>
          </View>

          <Text
            style={{

              fontFamily: fonts.primary[600],
              color: colors.black,
              fontSize: myDimensi / 4,
            }}>
            Rp. {new Intl.NumberFormat().format(item.total)}
          </Text>
        </View>
        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: colors.border_form }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CartEdit', item)
              console.warn(item)
            }}
            style={{
              width: 25,
              alignSelf: 'flex-end',
              marginVertical: 5,
            }}>
            <Icon type='ionicon' name='create-outline' color={colors.secondary_base} size={myDimensi / 3} solid />
          </TouchableOpacity>
          <View style={{
            flexDirection: 'row',
            paddingRight: 0,
            justifyContent: 'flex-end'
          }}>
            <TouchableOpacity onPress={() => {

              if (item.qty == 1) {
                setLoading(true);
                hanldeHapus(item.id);
              } else {
                setLoading(true);
                console.warn('barang', item.id + item.qty)
                axios.post(apiURL + 'v1_cart_update.php', {
                  api_token: urlToken,
                  id: item.id,
                  qty: parseFloat(item.qty) - 1
                }).then(res => {
                  console.log(res.data);
                  __getDataBarang(user.id);
                  setLoading(false);
                })
              }

            }} style={{


              backgroundColor: colors.primary,
              // borderRadius: 5,
              width: 25,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Icon type='ionicon' name='remove' color={colors.white} />
            </TouchableOpacity>
            <View style={{
              height: 25,
              paddingHorizontal: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderTopColor: colors.primary,
              borderBottomColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TextInput onChangeText={x => {
                let items = [...data];
                let item = { ...items[index] };
                item.qty = x;
                items[index] = item;
                console.log(items);
                setData(items);

                if (x > 0) {

                  axios.post(apiURL + 'v1_cart_update.php', {
                    api_token: urlToken,
                    id: item.id,
                    qty: parseFloat(item.qty)
                  }).then(res => {
                    console.log(res.data);
                    __getDataBarang(user.id);
                    setLoading(false);
                  })


                }



              }} keyboardType='number-pad' value={item.qty} style={{
                padding: 0,
                fontSize: myDimensi / 5,
                textAlign: 'center',
                fontFamily: fonts.secondary[600]
              }} />
            </View>
            <TouchableOpacity onPress={() => {
              setLoading(true);
              console.warn('barang', item.id + item.qty)
              axios.post(apiURL + 'v1_cart_update.php', {
                api_token: urlToken,
                id: item.id,
                qty: parseFloat(item.qty) + 1
              }).then(res => {
                console.log(res.data);
                __getDataBarang(user.id);
                setLoading(false);
              })
            }} style={{
              backgroundColor: colors.primary,
              // borderRadius: 5,
              width: 25,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Icon type='ionicon' name='add' color={colors.white} />
            </TouchableOpacity>
          </View>

        </View>
      </View>


    );
  };

  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white,
      flexDirection: 'row'
    }}>

      {/* list Produk */}
      <View style={{
        flex: 1.10,
        paddingHorizontal: 10,
      }}>
        <MyInput onSubmitEditing={x => {
          console.warn(x.nativeEvent.text);
          setOpenKategori(false);
          getProduk(0, x.nativeEvent.text);
        }} nolabel placeholder="Pencarian" paddingLeft={20} iconLeft={false} iconname='search' />

        {/* menu */}
        {openKategori && <View style={{
          flex: 1,
          marginTop: 10,
          borderRadius: 10,
        }}>
          <FlatList data={kategori} renderItem={__renderKategori} numColumns={2} />
        </View>}


        {/* product */}

        {!openKategori && <View style={{
          flex: 1,
          marginTop: 10,
          borderRadius: 10,
        }}>
          <TouchableOpacity onPress={() => {
            setOpenKategori(true);
          }} style={{
            marginLeft: 10,
            paddingVertical: 2,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Icon type='ionicon' name='arrow-back-outline' color={colors.primary} size={myDimensi / 3} />
            <Text style={{
              fontFamily: fonts.primary[600],
              fontSize: myDimensi / 5,
              marginBottom: 5,
              marginTop: 3,
              marginLeft: 5,
              color: colors.primary
            }}>Kembali</Text>
          </TouchableOpacity>
          {loading && <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}><ActivityIndicator size="large" color={colors.primary} /></View>}
          {!loading && <FlatList data={produk} renderItem={__renderItem} numColumns={3} />}
        </View>}

      </View>



      {/* list Transaksi */}
      <View style={{
        flex: 0.90,
        backgroundColor: colors.border_card,
        borderTopLeftRadius: 50,
      }}>
        {/* header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
        }}>
          <TouchableOpacity style={{
            marginLeft: 10,
            paddingVertical: 2,
            padding: 10,
            borderRadius: 5,

            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Icon type='ionicon' name='restaurant' color={colors.primary} size={myDimensi / 4} />
            <Text style={{
              fontFamily: fonts.primary.normal,
              fontSize: myDimensi / 4,
              marginBottom: 5,
              marginTop: 3,
              marginLeft: 5,
              color: colors.primary
            }}>Dine in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            marginLeft: 10,
            paddingVertical: 2,
            padding: 10,
            borderRadius: 5,
            backgroundColor: colors.white,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Icon type='ionicon' name='person-add' color={colors.primary} size={myDimensi / 4} />
            <Text style={{
              fontFamily: fonts.primary.normal,
              fontSize: myDimensi / 4,
              marginBottom: 5,
              marginTop: 3,
              marginLeft: 5,
              color: colors.primary
            }}>Tambah Pelanggan</Text>
          </TouchableOpacity>
        </View>
        {/* list transaksi produk cart */}
        <ScrollView style={{
          flex: 1,
          backgroundColor: colors.white,
        }} showsVerticalScrollIndicator={false}>

          <FlatList data={data} renderItem={__renderItemCart} />
        </ScrollView>

        {/* ditail */}
        <View style={{
          flex: 0.5,
          backgroundColor: colors.border_card
        }}>
          <View style={{
            flexDirection: 'row',
          }}>
            <TouchableOpacity style={{
              flex: 1,
              paddingVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Icon size={myDimensi / 3} name='bookmark' type='ionicon' color={colors.primary} />
              <Text style={{
                left: 10,
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 3,
                color: colors.primary
              }}>Simpan Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              borderLeftWidth: 1,
              flex: 1,
              paddingVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Icon size={myDimensi / 3} name='print' type='ionicon' color={colors.primary} />
              <Text style={{
                left: 10,
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 3,
                color: colors.primary
              }}>Catak Bill</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: 'row',
            // borderBottomWidth: 1,
          }}>
            <TouchableOpacity style={{
              flex: 0,
              backgroundColor: '#C59262',
              paddingVertical: 20,
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Icon size={myDimensi / 3} name='documents' type='ionicon' color={colors.white} />
              <Text style={{
                left: 5,
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 3,
                color: colors.white
              }}>Pisah Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const dd = {
                  fid_user: user.id,
                  fid_outlet: user.fid_outlet,
                  harga_total: total,
                  diskon_voucher: 0,
                  persen_voucher: 0,
                  diskon_member: 0,
                  persen_member: 0,


                }
                console.warn(dd)

                setTimeout(() => {
                  setLoading(false);
                  navigation.navigate('Payment', dd)
                }, 1200)
              }}

              style={{

                borderLeftWidth: 1,
                backgroundColor: colors.primary,
                flex: 1,
                paddingVertical: 20,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}>
              <Icon size={myDimensi / 3} name='wallet' type='ionicon' color={colors.white} />
              <Text style={{
                left: 10,
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 3,
                color: colors.white
              }}>Bayar Rp. {new Intl.NumberFormat().format(total)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})