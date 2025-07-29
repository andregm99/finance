import { View,Alert } from "react-native";
import { useState } from "react";

import { useLocalSearchParams ,router} from "expo-router";

import { PageHeader } from "@/Components/PageHeader";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";
import { CurrencyInput } from "@/Components/CurrencyInput";

import { useTargetDataBase } from "@/database/useTargetDatabase";

export default function Target (){
    const [isProcessing,setIsProcessing] = useState<boolean>(false)
    const [name,setName] = useState<string>("")
    const [amount,setAmount] = useState<number>(0)

    const params = useLocalSearchParams<{id?:string}>()
    const targetDataBase = useTargetDataBase()

    function handleSave(){
        if (!name.trim() || amount===null || amount <= 0) {
            return Alert.alert(
                'Atenção',
                'Preencha o nome e o valor precisa ser maior que zero.',
      )

        }

        setIsProcessing(true)

        if (params.id) {
            //update
        }
        else{
            create()
        }
    }

    async function create() {
        try {
           await targetDataBase.create({name,amount})
            Alert.alert('Nova Meta', 'Meta criada com sucesso!', [
        {
            text: 'Ok',
            onPress: router.back,
        },
      ])

        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar a meta.')
            console.log(error)
            setIsProcessing(false)
        }
    }

    return(
        <View style={{flex:1,padding:24}}>
            <PageHeader 
            title="Meta" 
            subtitle="Economize para alcançar a sua meta financeira." 
            />

            <View style={{ marginTop: 32, gap: 24}}>

                <Input label="Nome da meta"
                    placeholder="Ex: Viagem para a praia, apple watch"
                    value={name}
                    onChangeText={setName}
                />

                <CurrencyInput label="Valor alvo (R$)" value={amount} onChangeValue={(value)=>setAmount(value?? 0)}/>

                <Button title="Salvar" onPress={handleSave} isProcessing={isProcessing} />

            </View>

             
        </View>
    )
}
