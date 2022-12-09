import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
const PlaceholderImage = require('./assets/offside.svg');

export default function Login({ navigation }) {

  const [user, setUser] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/offside/usuarios/sanzappa")
      .then(res => { return res.json() })
      .then(data => {
        setUser(data.results);
        return  console.log("a" + data.results)
      })
  });

  const data = {
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.logo}>
          <Image style={styles.logoImg} source={PlaceholderImage}></Image>
          <Text style={styles.logoText}>OFFSIDE</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.loginForm}>
            <Text style={styles.userText}>USUARIO  <TextInput style={styles.input}/></Text>
            
            <Text style={styles.pswdText}>SENHA  <TextInput style={styles.input} secureTextEntry={true}/></Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => {
            data.forEach(user => {
              if (user.nome === nome && user.senha === senha) {
                navigation.navigate("Home");
              }
            })
          }}>
            <Text style={styles.textButton}>Conectar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#505050',
    height: '100%',

  },
  body: {
    gap: "200px",
    justifyContent: 'space-around',
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
    color: '#FFFFFF',
    justifyContent: 'self',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: '412px',
    height: '50px',
  },
  logoImg: {
    height: '30px',
    width: '30px',
  },
  logoText: {
    fontFamily: "Kanit",
    color: '#FFFFFF',
    fontSize: '20px'
  },
  main: {
    width: '350px',
    height: '250px',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#161614',
  },
  loginForm: {
    gap: '10px',
  },
  userText: {
    fontSize: '20px',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
  },
  pswdText: {
    fontSize: '20px',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    alignItems: 'center',
  },
  input: {
    width: '75%',
    paddingHorizontal: '12px',
    paddingVertical: '12px',
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: '2px',
    width: '220px',
  },
  button: {
    width: '75%',
    backgroundColor: '#161614',
    paddingHorizontal: '12px',
    paddingVertical: '12px',
    borderColor: '#FFFFFF',
    borderWidth: '2px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#EFEFEF',
  }
});
