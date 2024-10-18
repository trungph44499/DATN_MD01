import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shortid from 'shortid';
import { URL } from './HomeScreen';

const AddScreen = ({ navigation }) => {
  const [type, setType] = useState('');
  const [img, setImg] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [origin, setOrigin] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const types = [
    { key: '1', value: 'Dog' },
    { key: '2', value: 'Cat' },
    { key: '3', value: 'Phụ kiện' }
  ];

  const statuss = [
    { key: '1', value: 'New' },
    { key: '2', value: 'Old' },
  ];

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const generateNumericId = () => {
    const prefix = type === 'Dog' ? 'DOG_' : type === 'Cat' ? 'CAT_' : type === 'Phụ kiện' ? 'ACC_' : '';
    let randomPart = '';

    // Tạo 6 ký tự số ngẫu nhiên
    for (let i = 0; i < 6; i++) {
      randomPart += Math.floor(Math.random() * 10); // Tạo số ngẫu nhiên từ 0 đến 9
    }

    return `${prefix}${randomPart}`; // Kết hợp tiền tố và phần ngẫu nhiên
  };

  const handleAddProduct = async () => {
    const formattedPrice = formatCurrency(price);

    const newProduct = {
      type,
      img,
      name,
      price: formattedPrice,
      origin,
      quantity,
      status,
      description
    };

    // Tạo ID
    const productId = generateNumericId();

    // Thêm ID vào sản phẩm
    newProduct.id = productId;

    let url = '';
    if (type === 'Dog') {
      url = `${URL}/dogs`;
    } else if (type === 'Cat') {
      url = `${URL}/cats`;
    } else if (type === 'Phụ kiện') {
      url = `${URL}/phukien`;
    } else {
      alert('Vui lòng chọn loại sản phẩm hợp lệ');
      return;
    }

    if (img === '') {
      alert('Ảnh sản phẩm không được bỏ trống');
      return;
    } 
    if(name === '') {
      alert('Tên sản phẩm không được bỏ trống');
      return;
    } 
    if(price === '') {
      alert('Giá sản phẩm không được bỏ trống');
      return;
    } 
    if(origin === '') {
      alert('Xuất sứ sản phẩm không được bỏ trống');
      return;
    } 
    if(quantity === '') {
      alert('Số lượng sản phẩm không được bỏ trống');
      return;
    } 
    if(status === '') {
      alert('Trạng thái sản phẩm không được bỏ trống');
      return;
    }
    if(description === '') {
      alert('Mô tả sản phẩm không được bỏ trống');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        await AsyncStorage.setItem(`@${type}_${savedProduct.id}`, JSON.stringify(savedProduct));
        alert('Thêm sản phẩm thành công!');
        navigation.goBack();
      } else {
        alert('Thêm sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi thêm sản phẩm');
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
          <Text style={{ fontWeight: 'bold', textAlign: 'center', justifyContent: 'center', fontSize: 30 }}>Thêm sản phẩm</Text>
          <SelectList
            setSelected={(val) => setType(val)}
            data={types}
            save="value"
            inputStyles={{ width: 310 }}
            dropdownStyles={{ width: 370 }}
            search={false}
            placeholder='Loại sản phẩm'
          />
          <TextInput
            style={styles.input}
            placeholder='Ảnh URL'
            onChangeText={setImg}
            value={img}
          />
          <TextInput style={styles.input} placeholder='Tên sản phẩm' onChangeText={setName} value={name} />
          {/* <TextInput style={styles.input} placeholder='Mã sản phẩm' onChangeText={setType} value={type} /> */}
          <TextInput style={styles.input} placeholder='Giá' onChangeText={setPrice} value={price} keyboardType='numeric' />
          <TextInput style={styles.input} placeholder='Xuất xứ' onChangeText={setOrigin} value={origin} />
          <TextInput style={styles.input} placeholder='Số lượng' onChangeText={setQuantity} value={quantity} keyboardType='numeric' />
          <SelectList
            setSelected={(val) => setStatus(val)}
            data={statuss}
            save="value"
            inputStyles={{ width: 310 }}
            dropdownStyles={{ width: 370 }}
            search={false}
            placeholder='Trạng thái sản phẩm'
          />
          <TextInput style={styles.inputDes} placeholder='Nhận xét' onChangeText={setDescription} value={description} multiline={true} numberOfLines={4} />
          <TouchableOpacity style={styles.btn} onPress={handleAddProduct}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddScreen;

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
