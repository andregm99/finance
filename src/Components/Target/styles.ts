import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/fontFamily";

export const styles = StyleSheet.create({
    container:{
        paddingVertical:16,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        gap:12,
        paddingBottom:16
    },
    content:{
        flex:1,
        gap:7
    },
    name: {
        fontSize:14,
        color:colors.black,
        fontFamily:fontFamily.regular
    },
    status:{
        fontSize:10,
        color:colors.gray[500],
        fontFamily:fontFamily.regular
    }
})