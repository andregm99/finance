import { Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { useFonts,Inter_400Regular,Inter_500Medium,Inter_700Bold } from "@expo-google-fonts/inter";

import Loading from "@/Components/Loading";

//No arquivo _layout é onde defino o tipo da navegação,estilos e estrutura externa das rotas.

export default function Layout(){
   
   const [fontsLoaded]= useFonts({Inter_400Regular,Inter_500Medium,Inter_700Bold})

   if (!fontsLoaded) {
    return <Loading/>
   }
   
    return(
       <Stack screenOptions={{headerShown:false,
        contentStyle:{backgroundColor:colors.white}//definindo cor de todas as rotas.
       }}/>
    )
}