import { ColorValue,Pressable,PressableProps,Text } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme";
import {MaterialIcons} from '@expo/vector-icons'

type Props = PressableProps &{
    isSelected:boolean,
    title:string,
    icon: keyof typeof MaterialIcons.glyphMap,
    selectedColor:ColorValue
}

export function Option ({isSelected,title,icon,selectedColor,...rest}:Props){
    return(
        <Pressable style={[styles.option, isSelected && {backgroundColor:selectedColor}]} {...rest}>
            <MaterialIcons 
                name={icon}
                size={18}
                color={isSelected? colors.white : colors.gray[500]}
                />

            <Text style={[styles.title, isSelected && {color:colors.white}]}>{title}</Text>
        </Pressable>
    )
}

