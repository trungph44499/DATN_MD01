import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from './HomeScreen';
import { useFocusEffect } from '@react-navigation/native';

const CatScreen = ({ navigation, route }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [data, setData] = useState(route.params?.data || []);

    const getListCat = async () => {
        try {
            const res = await fetch(`${URL}/cats`);
            const data = await res.json();
            setData(data);
        } catch (err) {
            console.log(err);
        }
    };

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

    useEffect(() => {
        checkUserRole();
        getListCat();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getListCat();
        }, [])
    );

    const handleDelete = async (id, type) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa sản phẩm này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        // Gọi hàm xóa ở đây
                        await deleteProduct(id, type);
                    }
                }
            ]
        );
    };

    const deleteProduct = async (id, type) => {
        console.log("Giá trị type: ", type);

        // Xác định URL dựa trên loại sản phẩm
        let url =
            type === 'Dog' ? `${URL}/dogs/${id}` :
                type === 'Cat' ? `${URL}/cats/${id}` :
                    type === 'Phụ kiện' ? `${URL}/phukien/${id}` :
                        `${URL}/default/${id}`; // Giá trị mặc định nếu không khớp

        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (response.ok) {
                Alert.alert('Xóa sản phẩm thành công');
                setData(prevData => prevData.filter(item => item.id !== id));
            } else {
                Alert.alert('Xóa sản phẩm thất bại');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
        }
    };

    const handleEdit = (item) => {
        navigation.navigate('EditScreen', { product: item });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>CATS</Text>
                <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.navigate('CartScreen')}>
                    <Image style={{ width: 26, height: 26 }} source={require('../Image/cart.png')} />
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 30, marginHorizontal: 20 }}>
                <Text style={{ color: 'red' }}>Tất cả</Text>
                <Text>Hàng mới về</Text>
            
            </View>

            <FlatList
                numColumns={2}
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("DetailProduct", { item: item })}
                        style={styles.itemDog}>
                        <Image source={{ uri: item.img }} style={styles.itemImage} />
                        <View style={styles.itemRow}>
                            <Text style={styles.itemName}>
                                {item.name}
                                {item.status === 'New' && (
                                    <Text style={styles.itemStatus}>   {item.status}</Text>
                                )}
                            </Text>
                        </View>
                        <Text style={styles.itemType}>Mã SP: {item.id}</Text>
                        <Text style={styles.price}>{item.price}</Text>
                        {isAdmin && (
                            <View style={styles.adminActions}>
                                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                                    <Text style={styles.buttonText}>Sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id, item.type)}>
                                    <Text style={styles.buttonText}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default CatScreen;

const styles = StyleSheet.create({
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
            height: 6
        },
        shadowRadius: 5,
        shadowOpacity: 0.35,
        elevation: 10
    },
    itemImage: {
        width: '100%',
        height: 130,
        borderRadius: 12,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold'
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
    itemType: {
        fontSize: 13,
        fontWeight: '300',
    },
    price: {
        fontSize: 17,
        fontWeight: '600',
        color: 'red'
    },
    adminActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    deleteButton: {
        backgroundColor: '#FF6347', // Màu đỏ tomato
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 2, // Hiệu ứng bóng
    },
    editButton: {
        backgroundColor: '#539AF7', // Màu đỏ tomato
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 2, // Hiệu ứng bóng
    },
    buttonText: {
        color: '#FFFFFF', // Màu chữ trắng
        fontSize: 16,
        fontWeight: 'bold'
    }
});
