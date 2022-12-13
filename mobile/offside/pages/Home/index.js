import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Kanit_200ExtraLight, Kanit_400Regular, Kanit_700Bold} from '@expo-google-fonts/kanit';
import { TextInput, TouchableHighlight } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons';
import Post from '../../components/post';
import * as ImagePicker from 'expo-image-picker';

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

  const createFormData = async (photo, body = {}) => {
    const blobfile = await (await fetch(`${photo.uri}`)).blob()

    const data = new FormData();
    
    data.append('foto', blobfile)

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

export default function HomeScreen({navigation}) {
    const [posts, setPosts] = React.useState([])
    const [modalOn, setModalOn] = React.useState(false)
    const [modalPostOn, setModalPostOn] = React.useState(false)
    const [titulo, setTitulo] = React.useState("")
    const [corpo, setCorpo] = React.useState("")
    const [imagens, setImagens] = React.useState([])
    const [npTags, setNpTags] = React.useState([])
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

    const load = () => {
      fetch('http://localhost:3000/offside/posts/', {method: 'GET'})
        .then(response => response.json())
        .then(responseP => {
          getData().then((info) => {
            if (info !== null) {
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

                                      fetch('http://localhost:3000/offside/usuarios/' + info.uname, {method: "GET"})
                                            .then(response => response.json())
                                            .then(response => {
                                                response.forEach(u => {
                                                  let aux = []
                                                responseP.forEach(p => {
                                                  p.tags.forEach(t => {
                                                    if (u.favoritos.includes(t) && !aux.includes(p)) {
                                                      aux.push(p)
                                                    }
                                                  })
                                                })
                                                setFavs(u.favoritos)
                                                setPosts(aux)
                      
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
            } else {
              clearData().then(() => navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }))
            }
              
            })
            .catch(err => console.error(err))
          })
    }

    React.useEffect(() => {
          load()

          const willFocusSubscription = navigation.addListener('focus', () => {
            load();
          });
          return willFocusSubscription;
    }, [])

    React.useEffect(() => {
      console.log(imagens)
}, [imagens]) 

    let [fontsLoaded] = useFonts({
        Kanit_400Regular,
        Kanit_200ExtraLight,
        Kanit_700Bold
      });
    
      if (!fontsLoaded) {
        return null;
      }
      
      const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: true,
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setImagens(result.assets)
        } else {
          alert('You did not select any image.');
        }
      };

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
        <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.5)', zIndex: 2, display: modalPostOn ? 'flex' : 'none', alignItems: 'center', justifyContent:'center', padding: 20}}>
            <View style={{padding: 20, backgroundColor: colors.darkGray, shadowColor: colors.black, shadowRadius: 50, width: '100%'}}>
                <TextOS texto="Novo Post" style={{fontSize: 24, textAlign: 'center', marginBottom: 10}} />
                <TextInput placeholder={"Título"} style={styles.input} placeholderTextColor={colors.lightGray} onChangeText={(val) => { setTitulo(val)}}/>
                <TextInput placeholder={"Digite o Conteúdo do Post..."} style={styles.input} multiline={true} numberOfLines={5} placeholderTextColor={colors.lightGray} onChangeText={(val) => { setCorpo(val)}}/>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity onPress={pickImageAsync}>
                    <Text style={{color: colors.yellow, ...styles.font, display: 'flex', alignItems: 'center'}}>
                      Adicionar Imagens
                      <Ionicons name="attach" size={20} color={colors.yellow} style={{marginLeft: 5}} />
                      ({imagens.length})
                    </Text>
                  </TouchableOpacity>
                  <Text style={{color: colors.yellow, ...styles.font, display: 'flex', alignItems: 'center'}}>
                    Adicionar Categorias
                    <FontAwesome5 name="tag" size={20} color={colors.yellow} style={{marginLeft: 5}} />
                  </Text>
                </View>
                <View>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <TouchableOpacity onPress={favsHandler} style={{...styles.cta, display: 'flex', alignItems: 'center', flex: 1, marginRight: 5}}>
                    <TextOS texto="Cancelar" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={favsHandler} style={{...styles.cta, display: 'flex', alignItems: 'center', flex: 1}}>
                    <TextOS texto="Confirmar" />
                  </TouchableOpacity>
                </View>
            </View>
        </View>
        <ScrollView style={{width: '100%', marginTop: 25, marginBottom: 25}}>
            <TouchableOpacity onPress={() => setModalOn(true)} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.yellow, width: 120, justifyContent: 'center', padding: 5}}>
                <Ionicons name="funnel" size={28} color={colors.darkGray} />
                <Text style={{...styles.font, color: colors.darkGray, fontSize: 20, marginLeft: 5}}>Filtrar</Text>
            </TouchableOpacity>
                {   
                  posts.map((p, index) => {
                    return(
                      <Post info={p} onPress={() => {navigation.navigate('Post', {'info': p})}} key={index} />
                    )
                  })
                }
            
        </ScrollView>
        <TouchableOpacity onPress={() => setModalPostOn(true)} style={{backgroundColor: colors.yellow, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 50}}>
          <FontAwesome5 name="plus" size={25} color={colors.white} />
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