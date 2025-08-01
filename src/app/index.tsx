import {  View } from "react-native";
import { useCallback,useState } from "react";
import { Alert } from "react-native";
import { StatusBar } from "react-native";

import { router,useFocusEffect } from "expo-router";

import { Button } from "@/Components/Button";
import HomeHeader, { HomeHeaderProps } from "@/Components/HomeHeader";
import {Target,TargetProps} from "@/Components/Target";
import { List } from "@/Components/List";
import Loading from "@/Components/Loading";

import { numberToCurrency } from "@/Utils/numberToCurrency";//formatando moeda.

import { useTargetDataBase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

//Aqui vai a rota inicial com o nome de Index dentro da pasta App




export default function Index (){
    const [summary, setSummary] = useState<HomeHeaderProps>()
    const [isFetching,setIsFetching]= useState(true)
    const [targets,setTargets] = useState<TargetProps[]>([])


    const targetDatabase = useTargetDataBase()
    const transactionDatabase = useTransactionsDatabase()


     async function fetchTargets(): Promise<TargetProps[]> {//buscando metas no banco de dados.
    try {
      const response = await targetDatabase.listByClosestTarget()
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

  async function fetchSummary(): Promise<HomeHeaderProps> {
    try {
      const response = await transactionDatabase.summary()

      return {
        total: numberToCurrency(response.input + response.output),
        input: {
          label: 'Entradas',
          value: numberToCurrency(response.input),
        },
        output: {
          label: 'Saídas',
          value: numberToCurrency(response.output),
        },
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o resumo.')
      console.log(error)
    }
  }

  async function fetchData() {

   const targetDataPromise = fetchTargets()//chamando funções do banco
    const dataSummaryPromise = fetchSummary()

   const [targetData,dataSummary]= await Promise.all([targetDataPromise,dataSummaryPromise])//Aguardando resolução de uma lista de promessas.
   setTargets(targetData)//Exibindo metas na tela.
   setSummary(dataSummary)//exibindo valor total que tenho guardado.
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