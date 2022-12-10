import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import { TextInput, VirtualizedList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const defaultAvatar = require('../../assets/avatar.svg')

const colors = {
    "gray": "#201f1d",
    "darkGray": "#161614",
    "lightGray": '#868686',
    "yellow": '#c4a000',
    "white": '#ffffff',
    "black": '#000000',
    "red": '#FF0000'
}

function TextOS(props) {
    const { texto, style } = props
    return(
        <Text style={{color: '#ffffff', fontFamily: 'Kanit_400Regular', ...style}}>{texto}</Text>
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

const createFormData = async (photo, body = {}) => {
    const blobfile = await (await fetch(`${photo.uri}`)).blob()

    const data = new FormData();
    
    data.append('foto', blobfile)

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

export default function SignUpScreen({navigation}) {
    const [errOn, setErrOn] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [repPassword, setRepPassword] = React.useState('')
    const [repPasswordValid, setRepPasswordValid] = React.useState(true)
    const [tooltipOn, setTooltipOn] = React.useState(false)
    const [modalOn, setModalOn] = React.useState(false)
    const [photo, setPhoto] = React.useState(null);
    const [req1, setReq1] = React.useState(false)
    const [req2, setReq2] = React.useState(false)
    const [req3, setReq3] = React.useState(false)

    React.useEffect(() => {
        if (password == repPassword) {
            setRepPasswordValid(true)
        } else {
            setRepPasswordValid(false)
        }

        setReq1(password.length >= 8)
        setReq2(password.match(/[A-Z]/g))
        setReq3(password.match(/[0-9]/g))

    }, [password, repPassword])

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setPhoto(result.assets[0])
        } else {
          alert('You did not select any image.');
        }
      };

    let [fontsLoaded] = useFonts({
        Kanit_400Regular,
        Kanit_200ExtraLight,
        Kanit_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

      const singup = async () => {
        if (username.length > 0 && password.length > 0 && photo !== null) {
            var fetchBody = await createFormData(photo, { nome: username, senha: password, mobile: true})
            fetch(`http://localhost:3000/offside/usuarios`, {
                method: 'POST',
                body: fetchBody,
              })
                .then((response) => response.json())
                .then((response) => {
                  if (response.affectedRows > 0) {
                    setModalOn(true)
                    setTimeout(() => {
                        navigation.navigate('Login')
                    }, 1000)
                  }
                })
                .catch((error) => {
                  console.log('error', error);
                });
        }
        
    }
    
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.5)', zIndex: 2, display: modalOn ? 'flex' : 'none', alignItems: 'center', justifyContent:'center', padding: 20}}>
            <View style={{padding: 20, backgroundColor: colors.darkGray, shadowColor: colors.black, shadowRadius: 50}}>
                <TextOS texto="Cadastro Concluído!" style={{fontSize: 24, textAlign: 'center'}} />
                <TextOS texto="Você será redirecionado ao Login" style={{fontSize: 20, textAlign: 'center'}} />
            </View>
        </View>
        <View style={styles.login}>
            <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom: 10}}>
                <TouchableOpacity onPress={pickImageAsync} style={{width: 100, height: 100, borderRadius: '100%'}}>
                    <Image style={{flex:1, height:null, width:null, resizeMode: 'cover', borderRadius: '100%'}} source={photo == null ? defaultAvatar : {uri: photo.uri}} />
                </TouchableOpacity>
            </View>
            
            <TextInput placeholder={"Usuário"} style={styles.input} placeholderTextColor={colors.lightGray} onChangeText={(val) => { setUsername(val)}}/>
            <View style={{position: 'relative'}}>
                <TextInput onFocus={() => setTooltipOn(true)} onBlur={() => setTooltipOn(false)} secureTextEntry={true} placeholder={"Senha"} style={styles.input} placeholderTextColor={colors.lightGray} onChangeText={(val) => {setPassword(val)}}/>
                <View style={{borderColor: colors.white, borderWidth: 1, padding: 10, backgroundColor: colors.darkGray, shadowColor: colors.black, shadowOffset: {width: 0, height: 0}, shadowRadius: 50, position: 'absolute', top: -110, display: tooltipOn ? "flex" : "none"}}>
                    <TextOS texto="A senha deve conter:" />
                    <TextOS style={{opacity: req1 ? 0.5 : 1}} texto="8 caracteres" />
                    <TextOS style={{opacity: req2 ? 0.5 : 1}} texto="1 letra maiúscula" />
                    <TextOS style={{opacity: req3 ? 0.5 : 1}} texto="1 número" />
                </View>
            </View>
            <TextInput secureTextEntry={true} placeholder={"Rep. Senha"} style={{...styles.input, borderColor: repPasswordValid ? colors.white : colors.red}} placeholderTextColor={colors.lightGray} onChangeText={(val) => {setRepPassword(val)}}/>
            <Text style={{...styles.font, ...styles.white, display: errOn ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%'}}>Credenciais Inválidas</Text>
            <TouchableOpacity onPress={singup} style={styles.cta}>
                <TextOS texto="Cadastrar" style={{textAlign: 'center'}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginTop: 20}}>
                <Text style={{...styles.font, textAlign: 'center', color: colors.yellow}}>Entrar com uma Conta Existente</Text>
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