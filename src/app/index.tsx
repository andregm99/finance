import { View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/Components/Button";
import HomeHeader from "@/Components/HomeHeader";
import {Target} from "@/Components/Target";
import { List } from "@/Components/List";
import { StatusBar } from "react-native";
//Aqui vai a rota inicial com o nome de Index dentro da pasta App

const summary ={
  total: "R$ 2.680,00",
  input:{label:"Entradas" ,value:"R$ 6.184,90"},
  output:{label:"Saídas" ,value:"- R$ 800"}
}

const targets = [
  
  {
    id:'1',
    name:"Comprar uma cadeira ergonômica",
    percentage:"75%",
    current:"R$ 900.00",
    target:"R$ 1.200,00"
  },
  {
    id:'2',
    name:"Comprar moto",
    percentage:"75%",
    current:"R$ 100.00",
    target:"R$ 20.200,00"
  }
  
]

export default function Index (){
    return(
        <View  style={{flex:1}}>
          <StatusBar barStyle='light-content'/>
          <HomeHeader data={summary}/>

          <List 
            title="Metas"
            data={targets}
            keyExtractor={(item)=>item.id}
            renderItem={({item})=> <Target data={item} onPress={()=>router.navigate(`/in-progress/${item.id}`)}/>}
            emptyMessage="Nenhuma meta. Toque em nova meta para criar"
            containerStyle={{paddingHorizontal:24}}
          />

          <View style={{padding:24, paddingBottom: 32}}>
            <Button title="Nova meta" onPress={()=>router.navigate('/target')}/>
          </View>
        </View>
    )
}