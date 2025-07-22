import { ColorValue,View } from "react-native";

import { Styles } from "./styles";


export function Separator ({color}:{color:ColorValue}){
    return <View style={[Styles.container, {backgroundColor:color}]}/>
}