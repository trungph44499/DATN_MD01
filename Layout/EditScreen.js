import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from './HomeScreen';

const EditScreen = ({ navigation, route }) => {
    const product = route.params?.product || {};
  
    const [type, setType] = useState(product.type || '');
    const [img, setImg] = useState(product.img || '');
    const [name, setName] = useState(product.name || '');
    const [category, setCategory] = useState(product.category || '');
    const [price, setPrice] = useState(product.price || '');
    const [origin, setOrigin] = useState(product.origin || '');
    const [size, setSize] = useState(product.size || '');
    const [quantity, setQuantity] = useState(product.quantity || '');
    const [description, setDescription] = useState(product.description || '');

    const types = [
        { key: '1', value: 'ADIDAS' },
        { key: '2', value: 'Nike' }
    ];

    const sizes = [
        { key: '1', value: 'Big' },
        { key: '2', value: 'Medium' },
        { key: '3', value: 'Small' }
    ];

  const formatCurrency = (value) => {
    return Number(value.replace(/[^0-9.-]+/g, "")).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleEditProduct = async () => {
    const formattedPrice = formatCurrency(price);

    const updatedProduct = {
      img,
      name,
      type,
      price: formattedPrice,
      origin,
      size,
      quantity,
      description
    };

    let url = '';
    if (category === 'Nike') {
      url = `${URL}/dogs/${product.id}`;
    } else if (category === 'ADIDAS') {
      url = `${URL}/cats/${product.id}`;
    } else {
      alert('Vui lòng chọn loại sản phẩm hợp lệ');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        await AsyncStorage.setItem(`@${type}_${savedProduct.id}`, JSON.stringify(savedProduct));
        alert('Product edited successfully!');
        navigation.goBack();
      } else {
        alert('Failed to edit product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error editing product');
    }
  };

  return (
    <ScrollView style={{ flex: 1, gap: 10 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={{ width: 20, height: 20 }} source={require('../Image/back.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ width: '100%', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', justifyContent: 'center', fontSize: 30 }}>Sửa sản phẩm</Text>
          <SelectList 
            setSelected={(val) => setCategory(val)} 
            data={types} 
            save="value"
            inputStyles={{ width: 310 }}
            dropdownStyles={{ width: 370 }}
            search={false}
            placeholder='Loại sản phẩm'
            defaultOption={{ key: product.category === 'Nike' ? '1' : '2', value: product.category }}
          />
          <TextInput
            style={styles.input}
            placeholder='Ảnh URL'
            onChangeText={setImg}
            value={img}
          />
          <TextInput style={styles.input} placeholder='Tên sản phẩm' onChangeText={setName} value={name} />
          <TextInput style={styles.input} placeholder='Mã sản phẩm' onChangeText={setType} value={type} />
          <TextInput style={styles.input} placeholder='Giá' onChangeText={setPrice} value={price} keyboardType='numeric' />
          <TextInput style={styles.input} placeholder='Xuất xứ' onChangeText={setOrigin} value={origin} />
          <SelectList 
            setSelected={(val) => setSize(val)} 
            data={sizes} 
            save="value"
            inputStyles={{ width: 310 }}
            dropdownStyles={{ width: 370 }}
            search={false}
            placeholder='Kích cỡ'
            defaultOption={{ key: sizes.find(size => size.value === product.size)?.key, value: product.size }}
          />
          <TextInput style={styles.input} placeholder='Số lượng' onChangeText={setQuantity} value={quantity} keyboardType='numeric' />
          <TextInput style={styles.inputDes} placeholder='Nhận xét' onChangeText={setDescription} value={description} multiline={true} numberOfLines={4} />
          <TouchableOpacity style={styles.btn} onPress={handleEditProduct}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>Sửa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20
  },
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputDes: {
    textAlignVertical: 'top',
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    width: '90%',
    height: 200,
  },
  btn: {
    width: 300,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#1976D2',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffff', 
    shadowOffset: {
        width: -10, 
        height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50, 
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'center',
  }
});
