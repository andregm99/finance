import { Alert, View ,StatusBar} from "react-native"
import { useCallback,useState } from "react"

import dayjs from "dayjs"

import { useFocusEffect } from "expo-router"
import { useLocalSearchParams,router } from "expo-router"

import { PageHeader } from "@/Components/PageHeader"
import { Progress } from "@/Components/Progress"
import { List } from "@/Components/List"
import { Transaction,TransactionProps } from "@/Components/Transaction"
import { Button } from "@/Components/Button"
import Loading from "@/Components/Loading"

import { useTargetDataBase } from "@/database/useTargetDatabase"
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase"

import { TransactionTypes } from "@/Utils/TransactionTypes"
import { numberToCurrency } from "@/Utils/numberToCurrency"






export default function InProgress(){
   const [transactions,setTransactions] = useState<TransactionProps[]>([])  
   const [isFetching,setIsFetching] = useState(true)
   const [details, setDetails] = useState({
    name: '',
    current: 'R$ 0,00',
    target: 'R$ 0,00',
    percentage: 0,
  })


    const params = useLocalSearchParams<{id:string}>()

    const targetDatabase = useTargetDataBase()
    const transactionsDatabase = useTransactionsDatabase()

    async function fetchDetails() {//carregando detalhes
      try {
        const response = await targetDatabase.show(Number(params.id))

        if (!response) {
      throw new Error('Meta não encontrada')
    }
        setDetails({
        name: response.name,
        current: numberToCurrency(response.current),
        target: numberToCurrency(response.amount),
        percentage: response.percentage,
      })
      } catch (error) {
        Alert.alert('Erro','Não foi possível carregar os detalhes da meta.')
        console.log(error)
      }
    }

    async function fetchTransactions() {
      try {
        const response = await transactionsDatabase.listByTargetId(
          Number(params.id)
        )
         setTransactions(
        response.map((item) => ({
          id: String(item.id),
          value: numberToCurrency(item.amount),
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
          description: item.observation,
          type:
            item.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
        })),
      )
      } catch (error) {
        Alert.alert('Erro','Não foi possível carregar as transações')
        console.log(error)
      }
    }

    async function fetchData() {
      const fetchDetailsPromise = fetchDetails()
      const fetchTransactionsPromise = fetchTransactions()
      await Promise.all([fetchDetailsPromise,fetchTransactionsPromise])
      setIsFetching(false)
    }

    async function handleTransactionRemove(id:string) {
        Alert.alert('Remover','Deseja realmente remover?',[
          {text:'Não', style: 'cancel'},
          {text:'Sim', onPress: () => transactionRemove(id)}
        ])
    }

    async function transactionRemove(id:string) {
      try {
        await transactionsDatabase.remove(Number(id))
        fetchData()//atualizando transações, após a remoção.
        Alert.alert('Transação','Transação removida com sucesso!')
      } catch (error) {
        Alert.alert('Erro','Não foi possível remover a transação.')
        console.log(error)
      }
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
       <View style={{ flex: 1, padding: 24, gap: 32 }}>
        <StatusBar barStyle='dark-content'/>
      <PageHeader
        title={details.name}
        rightButton={{
          icon: 'edit',
          onPress: () => router.navigate(`/target?id=${params.id}`)//Indo para outra página.
        }}
      />

      <Progress data={details} />

      <List
        title="Transações"
        data={transactions}
        renderItem={({item})=>(<Transaction data={item} onRemove={()=>handleTransactionRemove(item.id)}/>)}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button title="Nova transação." onPress={()=>router.navigate(`/transaction/${params.id}`)}/>
    </View>
    )
}