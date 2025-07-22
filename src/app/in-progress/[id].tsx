import { View } from "react-native"
import { useLocalSearchParams,router } from "expo-router"

import { PageHeader } from "@/Components/PageHeader"
import { Progress } from "@/Components/Progress"
import { List } from "@/Components/List"
import { Transaction,TransactionProps } from "@/Components/Transaction"

import { TransactionTypes } from "@/Utils/TransactionTypes"
import { Button } from "@/Components/Button"


const details = {
  current: 'R$ 580,00',
  target: 'R$ 1.780,00',
  percentage: 50,
}

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
    const params = useLocalSearchParams<{id:string}>()

    return(
       <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <PageHeader
        title="Apple Watch"
        rightButton={{
          icon: 'edit',
          onPress: () => {},
        }}
      />

      <Progress data={details} />

      <List
        title="Transações"
        data={[]}
        renderItem={({item})=>(<Transaction data={item} onRemove={()=>{}}/>)}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />

      <Button title="Nova transação." onPress={()=>router.navigate(`/transaction/${params.id}`)}/>
    </View>
    )
}