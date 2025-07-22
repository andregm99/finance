import { View,Text,ColorValue } from "react-native";
import {MaterialIcons} from '@expo/vector-icons'
import { Styles } from "./styles";

export type SummaryProps = {
    label: string,
    value: string
}

type Props = {
    data:SummaryProps,
    icon: {
        name: keyof typeof MaterialIcons.glyphMap
        color: ColorValue
    },
    isLeft?:boolean
}

export function Summary ({data,icon,isLeft=false}:Props){
    return(
        <View style={Styles.container}>

            <View style={[Styles.header, isLeft && {justifyContent:'flex-end'}]}>
                <MaterialIcons name={icon.name} size={16} color={icon.color}/>
                <Text style={Styles.label}>{data.label}</Text>
            </View>

            <Text style={Styles.value}>{data.value}</Text>
            
        </View>
    )
}