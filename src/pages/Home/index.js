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


export default function Home({ route, params }) {
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


  const toggleProduct = () => {
    setModalProduct(!modalProduct);
  };

  useEffect(() => {
    getData('user').then(u => {
      setUser(u)
    });
    getProduk();
    getKategori();
  }, []);


  const getKategori = () => {
    axios.post(apiURL + 'v1_kategori.php', {
      api_token: urlToken,
    }).then(res => {
      console.log(res.data);
      setKategori(res.data);
    })
  }

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
      console.log(res.data);
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
        setModalProduct(true);
        setShowProduct({
          qty: 1,
          topping: 0,
          topping_data: '',
          sugar_data: '',
          sugar: 0,
          nama_barang: item.nama_barang,
          harga_barang: item.harga_barang,
          diskon: item.diskon,
          fid_barang: item.id,
          catatan: ''
        })
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

  const MyAdd = ({ x, y }) => {
    if (x > 0) {

      var eLL = [];
      for (let i = 0; i < x; i++) {
        eLL.push(

          <Text style={{

            fontFamily: fonts.primary[400],
            fontSize: myDimensi / 5,
            color: colors.border_label

          }}>{cart[y].additional[i].nama_tambahan} - Rp. {new Intl.NumberFormat().format((cart[y].additional[i].harga_tambahan))}</Text>
         ,
        );
      }
      return <>{eLL}</>;
    } else {
      return (<></>);
    }

    // if (x > 0) {



    // }

  }

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
        {/* list transaksi produk */}
        <ScrollView style={{
          flex: 1,
          backgroundColor: colors.white,
        }} showsVerticalScrollIndicator={false}>
          {cart.map((i, index) => {

            let topping = 0;

            totalBiaya += i.harga_barang;
            return (
              <View style={{
                marginHorizontal: 10,
                marginVertical: 5,
                padding: 10,
                flexDirection: 'row'
              }}>
                <View style={{
                  flex: 1
                }}>
                  <Text style={{
                    fontFamily: fonts.primary[600],
                    fontSize: myDimensi / 5,
                    marginBottom: 5,
                    color: colors.black
                  }}>{i.nama_barang}</Text>


                  {i.topping_data.length > 0 && <Text style={{

                    fontFamily: fonts.primary[400],
                    fontSize: myDimensi / 5,
                    color: colors.border_label

                  }}>{i.topping_data} Rp {new Intl.NumberFormat().format(i.topping)}</Text>}


                  {i.sugar_data.length > 0 && <Text style={{
                    fontFamily: fonts.primary[400],
                    fontSize: myDimensi / 5,
                    color: colors.border_label
                  }}>{i.sugar_data} Rp {new Intl.NumberFormat().format(i.sugar)}</Text>}

                  {i.catatan.length > 0 && <Text style={{

                    fontFamily: fonts.primary[400],
                    fontSize: myDimensi / 5,
                    color: colors.border_label
                  }}>{i.catatan}</Text>}

                </View>
                <View>
                  <Text style={{
                    fontFamily: fonts.primary.normal,
                    fontSize: myDimensi / 5,
                    marginBottom: 5,
                    color: colors.black
                  }}>x{i.qty}</Text>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                }}>
                  <Text style={{
                    fontFamily: fonts.primary.normal,
                    fontSize: myDimensi / 5,
                    marginBottom: 5,
                    color: colors.black
                  }}>Rp. {new Intl.NumberFormat().format((i.harga_barang * i.qty))}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  console.log(index);

                  let result = cart.filter((i, x) => x != index);
                  console.log(result);

                  setCart(result);


                }} style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginHorizontal: 3,
                }}>
                  <Icon type='ionicon' name='close' color={colors.danger} size={myDimensi / 3} />
                </TouchableOpacity>
              </View>
            )
          })}


          {/* Diskon */}

          <View style={{
            marginHorizontal: 10,
            marginTop: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.black
              }}>Diskon :</Text>
            </View>

            <View style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingRight: 25,
            }}>
              <Text style={{
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.black
              }}>( Rp. {new Intl.NumberFormat().format(0)} )</Text>
            </View>

          </View>

          {/* subtotal */}

          <View style={{
            marginHorizontal: 10,
            marginTop: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.black
              }}>Subtotal :</Text>
            </View>

            <View style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingRight: 25,
            }}>
              <Text style={{
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.black
              }}>Rp. {new Intl.NumberFormat().format(totalBiaya)}</Text>
            </View>

          </View>

          {/* PPN */}
          <View style={{
            marginHorizontal: 10,
            paddingHorizontal: 10,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1
            }}>
              <Text style={{
                fontFamily: fonts.primary[400],
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.border_label
              }}>PPN (Termasuk)</Text>
            </View>
          </View>
          {/* Total */}
          <View style={{
            marginHorizontal: 10,
            marginTop: 5,

            paddingHorizontal: 10,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1
            }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.black
              }}>Total :</Text>
            </View>

            <View style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingRight: 25,
            }}>
              <Text style={{
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.black
              }}>Rp. {new Intl.NumberFormat().format(totalBiaya)}</Text>
            </View>

          </View>

          {/* Rounding */}

          <View style={{
            marginHorizontal: 10,
            marginTop: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1
            }}>
              <Text style={{
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.border_label
              }}>Rounding :</Text>
            </View>

            <View style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingRight: 25,
            }}>
              <Text style={{
                fontFamily: fonts.primary.normal,
                fontSize: myDimensi / 5,
                marginBottom: 5,
                color: colors.border_label
              }}>( Rp. {new Intl.NumberFormat().format(0)} )</Text>
            </View>

          </View>

        </ScrollView>
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
            <TouchableOpacity style={{
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
              }}>Bayar Rp. {new Intl.NumberFormat().format(totalBiaya)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* modal product */}
      <Modal isVisible={modalProduct}>
        <View style={{ flex: 1, padding: 10, backgroundColor: colors.white }}>

          <View style={{
            marginBottom: 10,
            flexDirection: 'row',
            borderBottomWidth: 1,
            paddingBottom: 10,
            borderBottomColor: colors.border_form
          }}>
            <View style={{ flex: 1, }}>
              <MyButton Icons="close" iconColor={colors.primary} onPress={toggleProduct} title="Batal" borderSize={1} colorText={colors.primary} />
            </View>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontFamily: fonts.primary[600],
                fontSize: myDimensi / 4,
                color: colors.black
              }}>{showProduct.nama_barang}</Text>
              <Text style={{
                fontFamily: fonts.primary[400],
                fontSize: myDimensi / 3,
                color: colors.black
              }}>Rp {new Intl.NumberFormat().format((showProduct.harga_barang * showProduct.qty) + showProduct.topping + showProduct.sugar)}</Text>
            </View>
            <View style={{ flex: 1, }}>
              <MyButton onPress={() => {
                console.log(showProduct);

                let arr = cart;

                arr = [...arr, showProduct];

                console.warn('arr', arr);
                setCart(arr);
                setAdd({
                  ...add,
                  topping: {
                    data: add.topping.data,
                    pilih: ''
                  },
                  sugar: {
                    data: add.sugar.data,
                    pilih: ''
                  }
                })
                setModalProduct(false)


              }} Icons="cart" title="Simpan" warna={colors.primary} />
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* jumlah */}
            <View style={{
              flexDirection: 'row'
            }}>
              <View style={{
                flex: 1,
              }}>
                <MyInput keyboardType='number-pad' value={showProduct.qty.toString()} onChangeText={x => {
                  setQty(parseFloat(x))
                }} height={50} nolabel placeholder="Jumlah" paddingLeft={20} iconLeft={false} iconname='cube' />
              </View>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 10,
              }}>
                <View style={{ flex: 1, }}>
                  <MyButton onPress={() => {

                    setShowProduct({
                      ...showProduct, qty: parseFloat(showProduct.qty) - 1
                    })
                  }} title="-" warna={colors.white} borderSize={1} colorText={colors.primary} />
                </View>
                <View style={{ flex: 1, }}>
                  <MyButton onPress={() => {
                    setShowProduct({
                      ...showProduct, qty: parseFloat(showProduct.qty) + 1
                    })

                  }} title="+" warna={colors.primary} />
                </View>

              </View>
            </View>
            <MyGap jarak={10} />



            {/* topping */}
            <Text style={{
              fontFamily: fonts.primary[600],
              fontSize: myDimensi / 4,
              color: colors.black
            }}>TOPPING</Text>
            <View style={{
              flexDirection: 'row'
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 10,
                justifyContent: 'space-around'
              }}>

                {add.topping.data.map((i, index) => {

                  return (
                    <View style={{ flex: 1, margin: 2 }}>
                      <MyButton onPress={() => {

                        console.log(i.label);
                        setShowProduct({
                          ...showProduct,
                          topping: i.harga,
                          topping_data: i.label
                        })
                        setAdd({
                          ...add,
                          topping: {
                            data: add.topping.data,
                            pilih: i.label
                          }
                        })
                        console.log('pilih', add.topping.pilih)

                      }} title={i.label} warna={add.topping.pilih == i.label ? colors.primary : colors.white} borderSize={1} colorText={add.topping.pilih == i.label ? colors.white : colors.primary} />
                    </View>

                  )
                })}

              </View>
            </View>


            {/* sugar */}
            <Text style={{
              fontFamily: fonts.primary[600],
              fontSize: myDimensi / 4,
              color: colors.black
            }}>SUGAR LEVEL</Text>
            <View style={{
              flexDirection: 'row'
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 10,
                justifyContent: 'space-around'
              }}>

                {add.sugar.data.map((i, index) => {

                  return (
                    <View style={{ flex: 1, margin: 2 }}>
                      <MyButton onPress={() => {

                        console.log(i.label);
                        setAdd({
                          ...add,
                          sugar: {
                            data: add.sugar.data,
                            pilih: i.label
                          }
                        })

                        setShowProduct({
                          ...showProduct,
                          sugar: i.harga,
                          sugar_data: i.label
                        })
                        console.log('pilih', add.sugar.pilih)

                      }} title={i.label} warna={add.sugar.pilih == i.label ? colors.primary : colors.white} borderSize={1} colorText={add.sugar.pilih == i.label ? colors.white : colors.primary} />
                    </View>

                  )
                })}

              </View>
            </View>

            {/* Catatan */}
            <Text style={{
              fontFamily: fonts.primary[600],
              fontSize: myDimensi / 4,
              color: colors.black
            }}>CATATAN</Text>
            <MyInput onChangeText={x => {
              setShowProduct({
                ...showProduct,
                catatan: x
              })
            }} value={showProduct.catatan} iconname="create" multiline nolabel placeholder="masukan deskripsi" height={50} />


          </ScrollView>

        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})