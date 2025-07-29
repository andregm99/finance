import { Suspense } from "react";
import { Stack } from "expo-router";
import { colors } from "@/theme/colors";
import { useFonts,Inter_400Regular,Inter_500Medium,Inter_700Bold } from "@expo-google-fonts/inter";

import Loading from "@/Components/Loading";

//No arquivo _layout é onde defino o tipo da navegação,estilos e estrutura externa das rotas.

import { SQLiteProvider } from "expo-sqlite";//Criando contexto de acesso ao banco de dados.

import { Migrate } from "@/database/migrate";

export default function Layout(){
   
   const [fontsLoaded]= useFonts({Inter_400Regular,Inter_500Medium,Inter_700Bold})

   if (!fontsLoaded) {
    return <Loading/>
   }
   
    return(
      <Suspense fallback={<Loading/>}>
         <SQLiteProvider databaseName="target.db" onInit={Migrate} useSuspense>
            <Stack screenOptions={{headerShown:false,
            contentStyle:{backgroundColor:colors.white}//definindo cor de todas as rotas.
            }}/>
         </SQLiteProvider>
      </Suspense>
    )
}

//Suspense garante que a aplicação só será renderizada após inicialização do banco.