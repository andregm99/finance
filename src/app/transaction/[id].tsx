import { useState } from "react"
import { View } from "react-native"
import { Alert } from "react-native"

import { router, useLocalSearchParams } from "expo-router"//Hook para buscar parâmetros.

import { PageHeader } from "@/Components/PageHeader"
import { CurrencyInput } from "@/Components/CurrencyInput"
import { Input } from "@/Components/Input"
import { Button } from "@/Components/Button"
import { TransactionType } from "@/Components/TransactionType"

import { TransactionTypes } from "@/Utils/TransactionTypes"

import { useTransactionsDatabase } from "@/database/useTransactionsDatabase"

export default function Transaction (){
    const [amount, setAmount] = useState<number|null>(0)
    const [type,setType] = useState(TransactionTypes.Input)
    const [isCreating,setIsCreating] = useState(false)
    const [observation, setObservation] = useState('')


    const params = useLocalSearchParams<{id:string}>()
    const transactionsDatabase = useTransactionsDatabase()

  async function handleCreate() {
    try {

        if (!amount||amount <=0) {
            return Alert.alert('Atenção!','Preencha o valor. A transação deve ser maior que zero.',)
        }

        setIsCreating(true)

        await transactionsDatabase.create({
            target_id:Number(params.id),
            amount: type === TransactionTypes.Output? amount * -1:amount,
            observation
        })//multipliquei por -1 para o valor ficar negativo pois é uma saída.

        Alert.alert("Sucesso", "Transação salva com sucesso!",[
            {
                text:'OK',
                onPress: router.back
            }
        ])
    } catch (error) {
        Alert.alert('Erro','Não foi possível salvar a transação.')
        console.log(error)
        setIsCreating(false)
    }
  }
    
    return(
    <View style={{flex:1,padding:24}}>
            <PageHeader 
                title="Nova transação"
                subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce 
                para guardar e evite retirar."
            />

            <View style={{ marginTop: 32, gap: 24 }}>
                <TransactionType selected={type} onChange={setType} />

                <CurrencyInput label="Valor (R$)" value={amount} onChangeValue={setAmount} />

            <Input
                label="Motivo"
                placeholder="Ex: Investir em CDB de 110% no banco XPTO"
                onChangeText={setObservation}
            />

            <Button title="Salvar" onPress={handleCreate} isProcessing={isCreating} />
        </View>
        
    </View>
    )
}