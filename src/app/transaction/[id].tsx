import { useState } from "react"
import { View } from "react-native"
import { useLocalSearchParams } from "expo-router"//Hook para buscar parâmetros.

import { PageHeader } from "@/Components/PageHeader"
import { CurrencyInput } from "@/Components/CurrencyInput"
import { Input } from "@/Components/Input"
import { Button } from "@/Components/Button"
import { TransactionType } from "@/Components/TransactionType"
import { TransactionTypes } from "@/Utils/TransactionTypes"

export default function Transaction (){
    const [type,setType] = useState(TransactionTypes.Input)
    const params= useLocalSearchParams<{id:string}>()
    
    return(
    <View style={{flex:1,padding:24}}>
            <PageHeader 
                title="Nova transação"
                subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce 
                para guardar e evite retirar."
            />

            <View style={{ marginTop: 32, gap: 24 }}>
                <TransactionType selected={type} onChange={setType} />
                <CurrencyInput label="Valor (R$)" value={1234} />

            <Input
                label="Motivo"
                placeholder="Ex: Investir em CDB de 110% no banco XPTO"
            />

            <Button title="Salvar" />
        </View>
        
    </View>
    )
}