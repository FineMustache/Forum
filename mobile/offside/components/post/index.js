import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native-web"
import AsyncStorage from '@react-native-async-storage/async-storage';
const dayjs = require('dayjs')

require('dayjs/locale/pt-br')
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.locale("pt-br")

const colors = {
    "gray": "#201f1d",
    "darkGray": "#161614",
    "lightGray": '#868686',
    "yellow": '#c4a000',
    "white": '#ffffff'
}

function montaImg(img) {
    if (img != null) {
        return `data:image/png;base64,${img}`;
    } else
        return `./default.png`;
}

const image = require('../../assets/avatar.svg')

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

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@uinfo')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
    }
  }

  const arrow = require('../../assets/votearrow.png')
  const varrow = require('../../assets/votearrowH.png')

export default function Post(props){
    const [votedUp, setVotedUp] = React.useState(false)
    const [votedDown, setVotedDown] = React.useState(false)

    const {info, onPress} = props

    const [voteCount, setVoteCount] = React.useState(info.votos)

    const voteHandler = (val) => {
        switch (val){
            case 1:
                if (votedDown) {
                    getData().then((uinfo) => {
                        const options = {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json', Authorization: uinfo.token},
                            body: `{"id_post":${info.id},"id_usuario":${uinfo.uid},"tipo":true}`
                          };
                          
                          fetch('http://localhost:3000/offside/votos', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response);
                                if (response.affectedRows == 0) {
                                    console.log("Incorretos")
                                    
                                } else {
                                    setVoteCount(voteCount + 2)
                                }
                            })
                            .catch(err => console.error(err));
                    })
                    setVotedDown(!votedDown)
                } else if(votedUp){
                    getData().then((uinfo) => {
                        const options = {
                            method: 'DELETE',
                            headers: {'Content-Type': 'application/json', Authorization: uinfo.token},
                            body: `{"id_post":${info.id},"id_usuario":${uinfo.uid}}`
                          };
                          
                          fetch('http://localhost:3000/offside/votos', options)
                            .then(response => response.json())
                            .then(response => {
                              console.log(response)
                              if (response.affectedRows == 0) {
                                console.log("Incorretos")
                              } else {
                                setVoteCount(voteCount - 1)
                              }
                            })
                            .catch(err => console.error(err));
                    })
                    
                } else {
                    getData().then((uinfo) => {
                        const options = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', Authorization: uinfo.token},
                            body: `{"id_post":${info.id},"id_usuario":${uinfo.uid},"tipo":true}`
                          };
                          
                          fetch('http://localhost:3000/offside/votos', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response)
                                if (response.affectedRows == 0) {
                                  console.log("Incorretos")
                                } else {
                                    setVoteCount(voteCount + 1)
                                }
                            })
                            .catch(err => console.error(err));
                    })
                }
                setVotedUp(!votedUp)
                break;

            case -1:
                if (votedUp) {
                    getData().then((uinfo) => {
                        const options = {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json', Authorization: uinfo.token},
                            body: `{"id_post":${info.id},"id_usuario":${uinfo.uid},"tipo":false}`
                          };
                          
                          fetch('http://localhost:3000/offside/votos', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response);
                                if (response.affectedRows == 0) {
                                    console.log("Incorretos")
                                } else {
                                    setVoteCount(voteCount - 2)
                                }
                            })
                            .catch(err => console.error(err));
                    })
                    setVotedUp(!votedUp)
                } else if (votedDown){
                    getData().then((uinfo) => {
                        const options = {
                            method: 'DELETE',
                            headers: {'Content-Type': 'application/json', Authorization: uinfo.token},
                            body: `{"id_post":${info.id},"id_usuario":${uinfo.uid}}`
                          };
                          
                          fetch('http://localhost:3000/offside/votos', options)
                            .then(response => response.json())
                            .then(response => {
                              console.log(response)
                              if (response.affectedRows == 0) {
                                console.log("Incorretos")
                              } else {
                                setVoteCount(voteCount + 1)
                              }
                            })
                            .catch(err => console.error(err));
                    })
                    
                } else {
                    getData().then((uinfo) => {
                        const options = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', Authorization: uinfo.token},
                            body: `{"id_post":${info.id},"id_usuario":${uinfo.uid},"tipo":false}`
                          };
                          
                          fetch('http://localhost:3000/offside/votos', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response)
                                if (response.affectedRows == 0) {
                                  console.log("Incorretos")
                                } else {
                                    setVoteCount(voteCount - 1)
                                }
                            })
                            .catch(err => console.error(err));
                    })
                }
                setVotedDown(!votedDown)
                break;

            default:
                break;
        }
    }

    React.useEffect(() => {
        if (info.voted !== undefined) {
            switch (info.voted) {
                case 1:
                    setVotedUp(true)
                    break;
                
                case 0:
                    setVotedDown(true)
                    break;
    
                default:
                    break;
            }
        }
    }, [])
    

    return(
        <TouchableOpacity onPress={onPress} style={{display: 'flex', backgroundColor: colors.darkGray, padding: 15, marginTop: 10, paddingLeft: 50, position: 'relative'}}>
            <View style={{position: 'absolute', left: 14, display: 'flex', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => voteHandler(1)}>
                    <Image style={{width: 20, height: 20, rotate: '180deg'}} source={votedUp ? varrow : arrow}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => voteHandler(-1)}>
                    <Image style={{width: 20, height: 20}} source={votedDown ? varrow : arrow}/>
                </TouchableOpacity>
                <Text style={{...styles.white, ...styles.font}}>{voteCount}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{...styles.font, ...styles.white, fontSize: 17}}>{info.titulo}</Text>
                <Text style={{...styles.font, ...styles.white}}>{dayjs(info.data).fromNow()}</Text>
            </View>
            <Text style={{...styles.font, color: colors.lightGray, marginBottom: 8}}>{info.nome_usuario}</Text>
            <Text style={{...styles.font, ...styles.white, marginBottom: 8}}>{info.corpo}</Text>
            <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
            {
                info.fotos.map((f, index) => {
                    if (f !== null) {
                        return(
                            <View key={index} style={{width: 80, height: 80, marginRight: 5}}>
                                <Image style={{flex:1, height:null, width:null, resizeMode: 'cover', opacity: 1}} source={{uri: montaImg(f)}} />
                            </View>
                        )
                    }
                })
            }
            </View>
            <View style={{display:"flex", flexDirection: "row", marginTop: 10, flexWrap: 'wrap'}}>
            {
                info.tags.map((t, index) => {
                    return(
                        <View style={{marginRight: 10, backgroundColor: getTagColor(t), paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}} key={index}>
                            <Text style={{...styles.white, ...styles.font}}>{t}</Text>
                        </View>
                    )
                })
            }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    'white':{
        color: '#ffffff'
    },
    'font': {
        fontFamily: 'Kanit_400Regular'
    }
})