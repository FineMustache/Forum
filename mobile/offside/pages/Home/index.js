import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import { TextInput } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Post from '../../components/post';

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

  var favsTemp = []

export default function HomeScreen({navigation}) {
    const [posts, setPosts] = React.useState([])
    const [modalOn, setModalOn] = React.useState(false)
    const [favs, setFavs] = React.useState([])
    const [tag1, setTag1] = React.useState(false)
    const [tag2, setTag2] = React.useState(false)
    const [tag3, setTag3] = React.useState(false)
    const [tag4, setTag4] = React.useState(false)
    const [tag5, setTag5] = React.useState(false)
    const [tag6, setTag6] = React.useState(false)
    const [votes, setVotes] = React.useState([])

    const favsHandler = () => {
      let aux = []

      if(tag1) aux.push("Copa do Mundo")
      if(tag2) aux.push("Champions League")
      if(tag3) aux.push("Premier League")
      if(tag4) aux.push("Discussão")
      if(tag5) aux.push("Brasil")
      if(tag6) aux.push("Imagens")

      setFavs(aux)
      setModalOn(false)
    }

    React.useEffect(() => {
        fetch('http://localhost:3000/offside/posts/', {method: 'GET'})
        .then(response => response.json())
        .then(responseP => {
          getData().then((info) => {
              fetch('http://localhost:3000/offside/votos/' + info.uid, {method: 'GET'})
                                  .then(response => response.json())
                                  .then(response => {
                                      response.forEach(r => {
                                        responseP.forEach(p => {
                                          if (r.id_post == p.id) {
                                            p["voted"] = r.tipo
                                          }
                                        })
                                      })
                                      setPosts([...responseP])

                                        if (info !== null) {
                                            const options = {
                                                method: 'GET',
                                                headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: info.token
                                                }
                                            }
                                            fetch("http://localhost:3000/offside/validate/" + info.uid, options)
                                            .then(response => response.json())
                                            .then(response => {
                                                if(!response.validation){
                                                    clearData().then(() => {
                                                        navigation.reset({
                                                            index: 0,
                                                            routes: [{name: 'Login'}],
                                                          });
                                                    })
                                                }
                                            })
                                            .catch(err => {
                                              console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                                            })
                                
                                            fetch('http://localhost:3000/offside/usuarios/' + info.uname, {method: "GET"})
                                            .then(response => response.json())
                                            .then(response => {
                                                response.forEach(u => {
                                                setFavs(u.favoritos)
                      
                                                u.favoritos.forEach(f => {
                                                  switch (f){
                                                    case 'Copa do Mundo':
                                                      setTag1(true)
                                                      break;
                                                    
                                                    case 'Champions League':
                                                      setTag2(true)
                                                      break;
                      
                                                    case 'Premier League':
                                                      setTag3(true)
                                                      break;
                      
                                                    case 'Discussão':
                                                      setTag4(true)
                                                      break;
                      
                                                    case 'Brasil':
                                                      setTag5(true)
                                                      break;
                      
                                                    case 'Imagens':
                                                      setTag6(true)
                                                      break;
                                                  }
                                                  
                                                })
                                                });
                                            })
                                            .catch(err => console.error(err));
                                        } else {
                                            clearData().then(() => navigation.reset({
                                                index: 0,
                                                routes: [{name: 'Login'}],
                                              }))
                                        }
                                        
                                    
                                  })
                                  .catch(err => console.error(err));
                

              setInterval(() => {
                getData().then((info) => {
                  if (info !== null) {
                      const options = {
                          method: 'GET',
                          headers: {
                          'Content-Type': 'application/json',
                          Authorization: info.token
                          }
                      }
                      fetch("http://localhost:3000/offside/validate/" + info.uid, options)
                      .then(response => response.json())
                      .then(response => {
                          if(!response.validation){
                              clearData().then(() => {
                                  navigation.reset({
                                      index: 0,
                                      routes: [{name: 'Login'}],
                                    });
                              })
                          }
                      })
                      .catch(err => {
                        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                      })
                  } else {
                      clearData().then(() => navigation.reset({
                          index: 0,
                          routes: [{name: 'Login'}],
                        }))
                  }
                  
              })
              }, 30000)
            })
            .catch(err => console.error(err))
          })
    }, [])

    React.useEffect(() => {
      console.log(posts)
    }, [posts])

    

    let [fontsLoaded] = useFonts({
        Kanit_400Regular,
        Kanit_200ExtraLight,
        Kanit_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }
      
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.5)', zIndex: 2, display: modalOn ? 'flex' : 'none', alignItems: 'center', justifyContent:'center', padding: 20}}>
            <View style={{padding: 20, backgroundColor: colors.darkGray, shadowColor: colors.black, shadowRadius: 50}}>
                <TextOS texto="Selecione as Categorias" style={{fontSize: 24, textAlign: 'center', marginBottom: 10}} />
                <View style={{display: 'flex', alignItems: 'center'}}>
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
                <TouchableOpacity onPress={favsHandler} style={{...styles.cta, display: 'flex', alignItems: 'center'}}>
                  <TextOS texto="Aplicar" />
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView style={{width: '100%', marginTop: 25}}>
            <TouchableOpacity onPress={() => setModalOn(true)} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.yellow, width: 120, justifyContent: 'center', padding: 5}}>
                <Ionicons name="funnel" size={28} color={colors.darkGray} />
                <Text style={{...styles.font, color: colors.darkGray, fontSize: 20, marginLeft: 5}}>Filtrar</Text>
            </TouchableOpacity>
                {   
                  posts.map((p, index) => {
                    return(
                      <Post info={p} key={index} />
                    )
                  })
                }
            
        </ScrollView>
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