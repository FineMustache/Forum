import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native-web"

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

  const arrow = require('../../assets/votearrow.png')

export default function Post(props){
    const {info} = props
    info.fotos.forEach(f => {
        f = montaImg(f)
    })

    return(
        <View style={{display: 'flex', backgroundColor: colors.darkGray, padding: 15, marginTop: 10, paddingLeft: 50, position: 'relative'}}>
            <View style={{position: 'absolute', left: 14, display: 'flex', alignItems: 'center'}}>
                <TouchableOpacity>
                    <Image style={{width: 20, height: 20, rotate: '180deg'}} source={arrow}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={{width: 20, height: 20}} source={arrow}/>
                </TouchableOpacity>
                <Text style={{...styles.white, ...styles.font}}>{info.votos}</Text>
            </View>
            <Text style={{...styles.font, ...styles.white, fontSize: 17}}>{info.titulo}</Text>
            <Text style={{...styles.font, color: colors.lightGray, marginBottom: 8}}>{info.nome_usuario}</Text>
            <Text style={{...styles.font, ...styles.white, marginBottom: 8}}>{info.corpo}</Text>
            <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
            {
                info.fotos.map((f, index) => {
                    return(
                        <View key={index} style={{width: 80, height: 80, marginRight: 5}}>
                            <Image style={{flex:1, height:null, width:null, resizeMode: 'cover', opacity: 1}} source={image} />
                        </View>
                    )
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
        </View>
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