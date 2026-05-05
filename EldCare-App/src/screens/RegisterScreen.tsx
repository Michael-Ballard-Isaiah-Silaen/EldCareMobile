/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    medBoxID: "",
    medBoxPassword: "",
    role: "caretaker",
  });

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/sign-in', formData);
      const { token } = response.data;
      login(token);
    } catch (error) {
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/eldcarelogo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>Helping elderly manage medication</Text>
      <Text style={styles.subtitle}>easily and safely</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={formData.email} 
          onChangeText={(text) => setFormData({...formData, email: text})} 
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={formData.password} 
          onChangeText={(text) => setFormData({...formData, password: text})} 
        />

        <Text style={styles.label}>MedBox ID</Text>
        <TextInput 
          style={styles.input} 
          placeholder="MedBox ID" 
          value={formData.medBoxID} 
          onChangeText={(text) => setFormData({...formData, medBoxID: text})} 
        />

        <Text style={styles.label}>MedBox Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="MedBox Password" 
          secureTextEntry 
          value={formData.medBoxPassword} 
          onChangeText={(text) => setFormData({...formData, medBoxPassword: text})} 
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text>Dont have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Sign Up!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#B3CEFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  subtitle: {
    color: '#1e3a8a',
    fontWeight: '300',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#000', 
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  registerText: {
    color: '#15803d',
    fontWeight: 'bold',
  }
});

export default LoginScreen;