import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const URL = 'http://192.168.1.3:3000';
const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ListDog, setListDog] = useState([]);
  const [ListCat, setListCat] = useState([]);
  const [ListPhuKien, setListPhuKien] = useState([]);

  const [imageList, setimageList] = useState([]);
  const [currentImage, setcurrentImage] = useState(0);

  const getListDog = async () => {
    await fetch(`${URL}/dogs`)
      .then(res => res.json())
      .then(data => {
        setListDog(data);
      })
      .catch(err => console.log(err));
  };

  const getListCat = async () => {
    await fetch(`${URL}/cats`)
      .then(res => res.json())
      .then(data => {
        setListCat(data);
      })
      .catch(err => console.log(err));
  };

  const getListPhuKien = async () => {
    await fetch(`${URL}/phukien`)
      .then(res => res.json())
      .then(data => {
        setListPhuKien(data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const data = [
      {
        image: <Image key={"0"} style={{ width: screenWidth, height: 230, }} source={require('../Image/banner_pet01.png')} resizeMode='stretch'></Image>,
      },
      {
        image: <Image style={{ width: screenWidth, height: 230, }} source={require('../Image/banner_pet03.png')} resizeMode='stretch'></Image>,
      },
      {
        image: <Image style={{ width: screenWidth, height: 230, }} source={require('../Image/banner_pet05.png')} resizeMode='stretch'></Image>,
      },
      {
        image: <Image style={{ width: screenWidth, height: 230, }} source={require('../Image/banner_pet02.png')} resizeMode='stretch'></Image>,
      },
    ];
    setimageList(data);

    getListDog();
    getListCat();
    getListPhuKien();
    checkUserRole();

    const unsubscribe = navigation.addListener('focus', () => {
      getListDog();
      getListCat();
      getListPhuKien();
    });

    return unsubscribe;
  }, [navigation]);

  const handleScroll = (e) => {
    if (!e) {
      return;
    }
    const { nativeEvent } = e;
    if (nativeEvent && nativeEvent.contenOffset) {
      const currentOffset = nativeEvent.contenOffset.x;
      let imageIndex = 0;
      if (nativeEvent.contenOffset.x > 0) {
        imageIndex = Math.floor((nativeEvent.contenOffset.x + screenWidth / 2) / screenWidth);
      }
      setcurrentImage(imageIndex);
    }
  }

  const checkUserRole = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('User');
      if (userInfo) {
        const { role } = JSON.parse(userInfo);
        if (role === 'admin') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải vai trò người dùng.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{ width: screenWidth, height: 320 }}>
          <View>
            <Text style={{ color: '#F79515', fontSize: 23, marginTop: 30, fontWeight: '400', }}>
              Pet Shop
            </Text>
            <Text style={{ color: '#F79515', fontSize: 23, fontWeight: '400', marginBottom: 10 }}>
              Mua gì cũng có !!
            </Text>
          </View>

          <ScrollView
            horizontal
            //  pagingEnabled
            contentContainerStyle={{ width: screenWidth * imageList.length, height: 230 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {imageList.map((e, index) =>
              <View key={index.toString()}>
                {e.image}
              </View>
            )}
          </ScrollView>

          {/* <Image style={{ width: '100%', height: 230, justifyContent: 'center' }} source={require('../Image/banner_1.jpg')} /> */}
          <TouchableOpacity onPress={() => navigation.navigate('DogScreen', { data: ListDog })} style={styles.newSP}>
            <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold', textDecorationLine: 'underline' }}>Xem hàng mới về ➭</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Dogs</Text>

        <FlatList
          numColumns={2}
          scrollEnabled={false}
          data={ListDog.filter((item, index) => index < 4)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetailProduct', { item: item })} style={styles.itemDog}>
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.name}
                  {item.status === 'New' && (
                    <Text style={styles.itemStatus}>   {item.status}</Text>
                  )}
                </Text>
              </View>
              <Text style={styles.itemStyle}>Mã SP: {item.id}</Text>
              <Text style={styles.price}>{item.price} </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity onPress={() => navigation.navigate('DogScreen', { data: ListDog })} style={styles.Xemthem}>
          <View />
          <Text style={{ fontSize: 14, color: 'green', fontWeight: 'bold', textDecorationLine: 'underline' }}>Xem thêm</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 10 }}>Cats</Text>

        <FlatList
          numColumns={2}
          extraData={4}
          scrollEnabled={false}
          data={ListCat.filter((item, index) => index < 4)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetailProduct', { item: item })} style={styles.itemDog}>
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.name}
                  {item.status === 'New' && (
                    <Text style={styles.itemStatus}>   {item.status}</Text>
                  )}
                </Text>
              </View>
              <Text style={styles.itemStyle}>Mã SP: {item.id}</Text>
              <Text style={styles.price}>{item.price} </Text>
            </TouchableOpacity>

          )}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CatScreen', { data: ListCat })} style={styles.Xemthem}>
          <View />
          <Text style={{ fontSize: 14, color: 'green', fontWeight: 'bold', textDecorationLine: 'underline' }}>Xem thêm</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Phụ kiện</Text>

        <FlatList
          numColumns={2}
          scrollEnabled={false}
          data={ListPhuKien.filter((item, index) => index < 4)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetailProduct', { item: item })} style={styles.itemDog}>
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.name}
                  {item.status === 'New' && (
                    <Text style={styles.itemStatus}>   {item.status}</Text>
                  )}
                </Text>
              </View>
              <Text style={styles.itemStyle}>Mã SP: {item.id}</Text>
              <Text style={styles.price}>{item.price} </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity onPress={() => navigation.navigate('PhuKienScreen', { data: ListPhuKien })} style={styles.Xemthem}>
          <View />
          <Text style={{ fontSize: 14, color: 'green', fontWeight: 'bold', textDecorationLine: 'underline' }}>Xem thêm</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.cart} onPress={() => navigation.navigate('CartScreen')}>
        <Image source={require('../Image/cart.png')} style={{ height: 30, width: 30 }} />
      </TouchableOpacity>
      {isAdmin && (
        <TouchableOpacity style={styles.adminAdd} onPress={() => navigation.navigate('AddScreen')}>
          <Image source={require('../Image/add.png')} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  container: {
    height: '100%',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 12,
  },
  image: {
    width: 180,
    height: 150,
    borderRadius: 10,
  },
  itemDog: {
    backgroundColor: 'white',
    width: '45%',
    borderRadius: 12,
    padding: 12,
    margin: 10,
    gap: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
  },
  itemImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',

  },
  itemStatus: {
    fontSize: 18,
    fontStyle: 'italic',
    color: 'green'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemStyle: {
    fontSize: 13,
    fontWeight: '300',
  },
  Xemthem: {
    width: '100%',
    padding: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  price: {
    fontSize: 17,
    fontWeight: '600',
    color: 'red',
  },
  cart: {
    width: 40,
    height: 40,
    padding: 26,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 40,
    bottom: 550,
  },
  adminAdd: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 40,
    bottom: 90,
  },
  newSP: {
    bottom: 0,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
});