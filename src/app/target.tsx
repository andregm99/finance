import { View,Alert } from "react-native";
import { useState,useEffect } from "react";

import { useLocalSearchParams ,router} from "expo-router";

import { PageHeader } from "@/Components/PageHeader";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";
import { CurrencyInput } from "@/Components/CurrencyInput";

import { useTargetDataBase } from "@/database/useTargetDatabase";

export default function Target (){
    const [isProcessing,setIsProcessing] = useState<boolean>(false)
    const [name,setName] = useState<string>("")//input
    const [amount,setAmount] = useState<number>(0)//input

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
            update()
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

    async function update() {
       try {
        await targetDataBase.update({ id:Number(params.id), name , amount})
        Alert.alert('Sucesso','Meta atualizada com sucesso.',[
              {
                text:'Ok',
                onPress:()=>router.back()
            }
        ])
       } catch (error) {
        Alert.alert('Erro','Não ofi possível atualizat a meta.')
        console.log(error)
        setIsProcessing(false)
       }
    }


    async function fetchDetails(id:number) {
        try {
            const response = await targetDataBase.show(id)
            if (!response) {
                throw new Error('Meta não encontrada')
            }
            setName(response.name)
            setAmount(response.amount)
        } catch (error) {
            Alert.alert('Erro','Não foi possível carregar os detalhes da meta.')
            console.log(error)
        }
    }

    useEffect(()=>{
        if (params.id) {
            fetchDetails(Number(params.id))
        }
    },[params.id])


    function handleRemove (){
        if (!params.id) {
            return
        }

        Alert.alert('Remover','Deseja realmente remover?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: remove },
    ])
    }

    async function remove() {
        try {
            setIsProcessing(true)
            await targetDataBase.remove(Number(params.id))
            Alert.alert('Meta', 'Meta removida!', [
            { text: 'Ok', onPress: () => router.replace('/') },//voltando para o início.
      ])
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível remover a meta.')
            console.log(error)
        }
    }

    return(
        <View style={{flex:1,padding:24}}>
            <PageHeader 
            title="Meta" 
            subtitle="Economize para alcançar a sua meta financeira." 
            rightButton={
                params.id ? {icon:"delete",onPress: handleRemove }:undefined
            }
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
