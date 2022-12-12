import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import { TextInput } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
    "gray": "#201f1d",
    "darkGray": "#161614",
    "lightGray": '#868686',
    "yellow": '#c4a000',
    "white": '#ffffff'
}

function TextOS(props) {
    const { texto, style } = props
    return(
        <Text style={{...style, color: '#ffffff', fontFamily: 'Kanit_400Regular'}}>{texto}</Text>
    )
}

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@uinfo', jsonValue)
  } catch (e) {
    console.log(e);
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@uinfo')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e);
  }
}

export default function LoginScreen({navigation}) {
    const [errOn, setErrOn] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    let [fontsLoaded] = useFonts({
        Kanit_400Regular,
        Kanit_200ExtraLight,
        Kanit_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

      const logar = () => {
        if (username.length > 0 && password.length > 0) {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: `{"nome":"${username}","senha":"${password}"}`
            };
            
            fetch('http://localhost:3000/offside/usuarios/validar', options)
                .then(response => response.json())
                .then(response => {
                    if (response.validation) {
                        storeData(response).then(
                            navigation.reset({
                                index: 0,
                                routes: [{name: 'Home'}],
                              })
                        )
                    }else{
                        setErrOn(true)
                    }
                })
                .catch(err => console.error(err));
        }
        
    }
    
    return (
      <View style={styles.container}>
        <View style={styles.login}>
            <TextInput placeholder={"Usuário"} style={styles.input} placeholderTextColor={colors.lightGray} onChangeText={(val) => { setUsername(val)}}/>
            <TextInput secureTextEntry={true} placeholder={"Senha"} style={styles.input} placeholderTextColor={colors.lightGray} onChangeText={(val) => {setPassword(val)}}/>
            <Text style={{...styles.font, ...styles.white, display: errOn ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%'}}>Credenciais Inválidas</Text>
            <TouchableOpacity onPress={() => logar()} style={styles.cta}>
                <TextOS texto="Entrar" style={{textAlign: 'center'}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={{marginTop: 20}}>
                <Text style={{...styles.font, textAlign: 'center', color: colors.yellow}}>Criar uma Conta</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    'container': {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray,
        padding: 50
    },
    'login': {
        display: 'flex',
        alignContent: 'center',
        backgroundColor: colors.darkGray,
        width: '100%',
        padding: 25
    },
    'input':{
        padding: 10,
        color: '#ffffff',
        width: '100%',
        borderColor: colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        marginBottom: 10,
        fontFamily: 'Kanit_400Regular'
    },
    'cta':{
        padding: 10,
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: colors.white,
        borderWidth: 1,
        marginTop: 25
    },
    'white':{
        color: '#ffffff'
    },
    'font': {
        fontFamily: 'Kanit_400Regular'
    }
})