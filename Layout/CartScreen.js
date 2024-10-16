import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { congItem, removeItem, truItem } from '../Redux/action';
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'


const CartScreen = ({ navigation }) => {

    const [date, setdate] = useState(new Date());
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        console.log("Cart items: ", cartItems);
        calculateTotalPrice();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        let total = 0;
        cartItems.forEach(item => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity, 10);
            if (!isNaN(price) && !isNaN(quantity)) {
                total += price * quantity * 1000000;
            } else {
                console.warn(`Invalid price or quantity for item: ${item.name}`);
            }
        });
        setTotalPrice(total);
    };

    const formatPrice = (price) => {
        // Sử dụng phương thức toLocaleString để định dạng giá theo định dạng tiền tệ của Việt Nam (VND)
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const TaoMaHoaDon = async () => {
        const url = `${URL}/hoadons`
        const NewHoaDon = {
            ngayMua: date
        };

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(NewHoaDon),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            const id = data.id;
            navigation.navigate('Payment', { total: totalPrice, id_bill: id })
            console.log("id_bill : " + id)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 20, height: 20 }}
                        source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Giỏ hàng</Text>
                <TouchableOpacity style={{ width: 50 }}>
                    <Image style={{ width: 26, height: 26 }}
                        source={require('../Image/delete.png')} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {cartItems.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <View style={{ padding: 10, justifyContent: 'space-between', gap: 10 }}>
                            <Text style={{ marginBottom: 5 , fontWeight: 'bold'}}>{item.name} <Text style={{ color: 'gray' }}>{'\n'}{item.id}</Text>
                                {'\n'}{item.price} </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => { dispatch(truItem(item)) }}
                                    style={styles.btn}>
                                    <Image source={require('../Image/subtract.png')} style={styles.icon} />
                                </TouchableOpacity>
                                <Text>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => { dispatch(congItem(item)) }}
                                    style={styles.btn}>
                                    <Image source={require('../Image/add.png')} style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { dispatch(removeItem(item)) }}>
                                    <Text style={{ textDecorationLine: 'underline', marginLeft: 5 }}>Xóa</Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <Text style={{ color: 'red' }}>
                                    {formatPrice(parseFloat(item.price) * parseInt(item.quantity, 10) * 1000000)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}


            </ScrollView>

            {cartItems.length > 0
                ? <View style={{ width: '90%', marginVertical: 20, marginHorizontal: '5%', gap: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Tạm tính :</Text>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{formatPrice(totalPrice)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { TaoMaHoaDon() }}
                        style={{
                            borderRadius: 9, padding: 12, alignItems: 'center', backgroundColor: '#825640',
                        }}>
                        <Text style={{ color: 'white' }}>Tiến hành thanh toán</Text>
                    </TouchableOpacity>
                </View>
                : <TouchableOpacity onPress={() => { navigation.navigate('SearchScreen') }}
                    style={{ position: 'absolute', top: '50%', width: '100%' }}>
                    <Text style={{ textAlign: 'center' }}>Giỏ hàng rỗng
                        {'\n'}Thêm sản phẩm vào giỏ hàng</Text>
                </TouchableOpacity>}
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
        gap: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20
    },
    item: {
        height: 160,
        flexDirection: 'row',
        alignItems: 'center', borderBottomWidth: 1, width: '100%',
        gap: 20
    },
    image: {
        width: 120,
        height: 120,
    },
    icon: {
        width: 10,
        height: 10
    },
    btn: {
        padding: 7,
        borderRadius: 4,
        borderWidth: 1,
        marginHorizontal: 4,
    }
};

export default CartScreen;