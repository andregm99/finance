
import { Alert, View } from "react-native"
import { useCallback,useState } from "react"

import { useFocusEffect } from "expo-router"
import { useLocalSearchParams,router } from "expo-router"

import { PageHeader } from "@/Components/PageHeader"
import { Progress } from "@/Components/Progress"
import { List } from "@/Components/List"
import { Transaction,TransactionProps } from "@/Components/Transaction"
import { Button } from "@/Components/Button"
import { useTargetDataBase } from "@/database/useTargetDatabase"

import { TransactionTypes } from "@/Utils/TransactionTypes"
import { numberToCurrency } from "@/Utils/NumberToCurrency"
import Loading from "@/Components/Loading"


const transactions: TransactionProps[] = [
  {
    id: '1',
    value: 'R$ 20,00',
    date: '12/04/25',
    type: TransactionTypes.Output,
  },
  {
    id: '2',
    value: 'R$ 300,00',
    date: '12/04/25',
    description: 'CDB de 110% no banco XPTO',
    type: TransactionTypes.Input,
  },
]



export default function InProgress(){
   const [isFetching,setIsFetching] = useState(true)
   const [details, setDetails] = useState({
    name: '',
    current: 'R$ 0,00',
    target: 'R$ 0,00',
    percentage: 0,
  })


    const params = useLocalSearchParams<{id:string}>()

    const targetDatabase = useTargetDataBase()

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

    async function fetchData() {
      const fetchDetailsPromise = fetchDetails()
      await Promise.all([fetchDetailsPromise])
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
       <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <PageHeader
        title={details.name}
        rightButton={{
          icon: 'edit',
          onPress: () => {},
        }}
      />

      <Progress data={details} />

      <List
        title="Transações"
        data={transactions}
        renderItem={({item})=>(<Transaction data={item} onRemove={()=>{}}/>)}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button title="Nova transação." onPress={()=>router.navigate(`/transaction/${params.id}`)}/>
    </View>
    )
}