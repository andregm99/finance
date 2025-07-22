import { View } from "react-native";

import { PageHeader } from "@/Components/PageHeader";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";
import { CurrencyInput } from "@/Components/CurrencyInput";

export default function Target (){
    return(
        <View style={{flex:1,padding:24}}>
            <PageHeader 
            title="Meta" 
            subtitle="Economize para alcançar a sua meta financeira." 
            />

            <View style={{ marginTop: 32, gap: 24}}>
                <Input label="Nome da meta"
                    placeholder="Ex: Viagem para a praia, apple watch"
                />
                <CurrencyInput label="Valor alvo" value={0}/>
                <Button title="Salvar" />
            </View>

             
        </View>
    )
}