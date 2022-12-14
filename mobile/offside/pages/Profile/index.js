import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import { TextInput, TouchableHighlight } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons';
import Post from '../../components/post';
import * as ImagePicker from 'expo-image-picker';

const img = require('../../assets/avatar.svg')

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

const clearData = async () => {
    try {
      let response = await AsyncStorage.removeItem('@uinfo')
      return response
    } catch(e) {
      console.log(e);
    }
  }

  function getTagColor(tagname) {
    switch (tagname) {
      case "Copa do Mundo":
        return '#56042C'
      
      case "Champions League":
        return '#06113a'
  
      case "Premier League":
        return '#38003C'
  
      case "Discussão":
        return '#000'
  
      case "Brasil":
        return '#009739'
  
      case "Imagens":
        return '#960000'
  
      default:
        break;
    }
  }

  function montaImg(img) {
    if (img != null) {
        return `data:image/png;base64,${img}`;
    } else
        return `./default.png`;
}
export default function ProfileScreen({navigation}) {
    const [image, setImage] = React.useState(null)
    const [user, setUser] = React.useState({})
    const [tag1, setTag1] = React.useState(false)
    const [tag2, setTag2] = React.useState(false)
    const [tag3, setTag3] = React.useState(false)
    const [tag4, setTag4] = React.useState(false)
    const [tag5, setTag5] = React.useState(false)
    const [tag6, setTag6] = React.useState(false)
    const [req1, setReq1] = React.useState(false)
    const [req2, setReq2] = React.useState(false)
    const [req3, setReq3] = React.useState(false)
    const [erroRed, setErroRed] = React.useState(false)
    const [succRed, setSuccRed] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [repPassword, setRepPassword] = React.useState('')
    const [repPasswordValid, setRepPasswordValid] = React.useState(true)
    const [tooltipOn, setTooltipOn] = React.useState(false)

    React.useEffect(() => {
        getData().then((uinfo) => {
            const options = {method: 'GET'};

            fetch('http://localhost:3000/offside/usuarios/' + uinfo.uname, options)
            .then(response => response.json())
            .then(response => {
                response.forEach(r => {
                    setUser(r)
                    setImage(r.foto)
                    r.favoritos.forEach(f => {
                        if(f == "Copa do Mundo") setTag1(true)
                        if(f == "Champions League") setTag2(true)
                        if(f == "Premier League") setTag3(true)
                        if(f == "Discussão") setTag4(true)
                        if(f == "Brasil") setTag5(true)
                        if(f == "Imagens") setTag6(true)
                    })
                })
            })
            .catch(err => console.error(err));
        })
    }, [])

    React.useEffect(() => {
        if (newPassword == repPassword) {
            setRepPasswordValid(true)
        } else {
            setRepPasswordValid(false)
        }

        setReq1(newPassword.length >= 8)
        setReq2(newPassword.match(/[A-Z]/g))
        setReq3(newPassword.match(/[0-9]/g))

    }, [newPassword, repPassword])

    let [fontsLoaded] = useFonts({
        Kanit_400Regular,
        Kanit_200ExtraLight,
        Kanit_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }

      const redSenha = () => {
        if (req1 && req2 && req3 && repPasswordValid) {
            getData().then((uinfo) =>{
                const options = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: uinfo.token
                    },
                    body: `{"id":${uinfo.uid},"nome":"${uinfo.uname}","senha":"${password}","novaSenha":"${newPassword}","update":true}`
                  };
                  
                  fetch('http://localhost:3000/offside/usuarios/redsenha', options)
                    .then(response => response.json())
                    .then(response => {
                      console.log(response)
                      if (response.success) {
                        setErroRed(false)
                        setSuccRed(true)
                      } else {
                        setSuccRed(false)
                        setErroRed(true)
                      }
                    })
                    .catch(err => console.error(err));
            })
            
        }
      }

      const sair = () => {
        clearData().then(navigation.reset({
            index: 0,
            routes: [{name: 'Home'}]
        }))
      }

    return (
      <View style={styles.container}>
        <View style={{display: 'flex', width: '100%', alignItems: 'center', marginTop: 10}}>
            <Image style={{width: 150, height: 150, borderRadius: '100%'}} source={image == null ? img : {uri: montaImg(user.foto)}} />
            <Text style={{color: colors.white, ...styles.font, fontSize: 25}}>{user.nome}</Text>
        </View>
        <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: '10%', justifyContent: 'space-evenly', marginTop: 10}}>
            <TouchableOpacity onPress={() => setTag1(!tag1)} style={{backgroundColor: tag1 ? getTagColor("Copa do Mundo") : colors.darkGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderColor: getTagColor('Copa do Mundo'), marginBottom: 10}}>
                <TextOS texto="Copa do Mundo" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTag2(!tag2)} style={{backgroundColor: tag2 ? getTagColor("Champions League") : colors.darkGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderColor: getTagColor('Champions League'), marginBottom: 10}}>
                <TextOS texto="Champions League" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTag3(!tag3)} style={{backgroundColor: tag3 ? getTagColor("Premier League") : colors.darkGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderColor: getTagColor('Premier League'), marginBottom: 10}}>
                <TextOS texto="Premier League" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTag4(!tag4)} style={{backgroundColor: tag4 ? getTagColor("Discussão") : colors.darkGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderColor: getTagColor('Discussão'), marginBottom: 10}}>
                <TextOS texto="Discussão" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTag5(!tag5)} style={{backgroundColor: tag5 ? getTagColor("Brasil") : colors.darkGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderColor: getTagColor('Brasil'), marginBottom: 10}}>
                <TextOS texto="Brasil" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTag6(!tag6)} style={{backgroundColor: tag6 ? getTagColor("Imagens") : colors.darkGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderColor: getTagColor('Imagens')}}>
                <TextOS texto="Imagens" />
            </TouchableOpacity>
        </View>
        <View>
        <View style={{position: 'relative', marginTop: 50}}>
                <TextOS texto={"Redefinir Senha"} style={{fontSize: 20, marginBottom: 10}} />
                <TextInput secureTextEntry={true} placeholder={"Senha Atual"} style={{...styles.input, borderColor: colors.white}} placeholderTextColor={colors.lightGray} onChangeText={(val) => {setPassword(val)}}/>
                <TextInput onFocus={() => setTooltipOn(true)} onBlur={() => setTooltipOn(false)} secureTextEntry={true} placeholder={"Senha"} style={styles.input} placeholderTextColor={colors.lightGray} onChangeText={(val) => {setNewPassword(val)}}/>
                <View style={{borderColor: colors.white, borderWidth: 1, padding: 10, backgroundColor: colors.darkGray, shadowColor: colors.black, shadowOffset: {width: 0, height: 0}, shadowRadius: 50, position: 'absolute', top: -20, display: tooltipOn ? "flex" : "none"}}>
                    <TextOS texto="A senha deve conter:" />
                    <TextOS style={{opacity: req1 ? 0.5 : 1}} texto="8 caracteres" />
                    <TextOS style={{opacity: req2 ? 0.5 : 1}} texto="1 letra maiúscula" />
                    <TextOS style={{opacity: req3 ? 0.5 : 1}} texto="1 número" />
                </View>
                <TextInput secureTextEntry={true} placeholder={"Rep. Senha"} style={{...styles.input, borderColor: repPasswordValid ? colors.white : "#ff0000"}} placeholderTextColor={colors.lightGray} onChangeText={(val) => {setRepPassword(val)}}/>
            </View>
            <Text style={{...styles.font, color: "#ff0000", fontSize: 16 ,display: erroRed ? 'flex' : 'none'}}>Credenciais Inválidas</Text>
            <Text style={{...styles.font, color: "#00FF00", fontSize: 16 ,display: succRed ? 'flex' : 'none'}}>Senha Alterada com Sucesso!</Text>
            <TouchableOpacity onPress={redSenha} style={styles.cta}>
                <TextOS texto="Salvar" style={{textAlign: 'center'}} />
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={sair} style={{position: 'absolute', bottom: 50}}>
            <TextOS texto="Sair" style={{textDecoration: 'underline', fontSize: 20}} />
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    'container': {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.gray,
        padding: 25,
        paddingTop: 0,
        position: 'relative'
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