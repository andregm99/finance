import {  View } from "react-native";
import { useCallback,useState } from "react";
import { Alert } from "react-native";
import { StatusBar } from "react-native";

import { router,useFocusEffect } from "expo-router";

import { Button } from "@/Components/Button";
import HomeHeader from "@/Components/HomeHeader";
import {Target,TargetProps} from "@/Components/Target";
import { List } from "@/Components/List";
import Loading from "@/Components/Loading";

import { numberToCurrency } from "@/Utils/numberToCurrency";//formatando moeda.

import { useTargetDataBase } from "@/database/useTargetDatabase";

//Aqui vai a rota inicial com o nome de Index dentro da pasta App

const summary ={
  total: "R$ 2.680,00",
  input:{label:"Entradas" ,value:"R$ 6.184,90"},
  output:{label:"Saídas" ,value:"- R$ 800"}
}



export default function Index (){
    const[isFetching,setIsFetching]= useState(true)
    const [targets,setTargets] = useState<TargetProps[]>([])
    const targetDatabase = useTargetDataBase()


     async function fetchTargets(): Promise<TargetProps[]> {//buscando metas no banco de dados.
    try {
      const response = await targetDatabase.listBySavedValue()
      return response.map((item)=>({
        id:String(item.id),
        name:item.name,
        current: numberToCurrency(item.current),
        percentage:item.percentage.toFixed(0) + "%",
        target:numberToCurrency(item.amount)
      }))
     
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as metas.')
      console.log(error)
      return []
    }
  }

  async function fetchData() {
    const targetDataPromise = fetchTargets()//chamando funções do banco

   const [targetData]= await Promise.all([targetDataPromise])//Aguardando resolução de uma lista de promessas.
   setTargets(targetData)//Exibindo metas na tela.
   setIsFetching(false)
  }

    useFocusEffect(
      useCallback(()=>{
        fetchData()
      },[])
    )

    if (isFetching) {
      return <Loading/>
    }

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