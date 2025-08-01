import { TransactionTypes } from '@/Utils/TransactionTypes'
import { View } from 'react-native'
import { styles } from './styles'
import { Option } from './option'
import { colors } from '@/theme'

type Props = {
  selected: TransactionTypes
  onChange: (type: TransactionTypes) => void //Aqui estarei alternando entre os metodos de entrada ou saída.
}


export function TransactionType({selected,onChange}:Props){
    return(
        <View style={styles.container}>
            <Option 
                icon='arrow-upward' 
                title='Guardar'
                isSelected={selected === TransactionTypes.Input}
                selectedColor={colors.blue[500]}
                onPress={()=>onChange(TransactionTypes.Input)}
            />

            <Option 
                icon='arrow-downward' 
                title='Resgatar'
                isSelected={selected === TransactionTypes.Output}
                selectedColor={colors.red[400]}
                onPress={()=>onChange(TransactionTypes.Output)}
            />
        </View>
    )
}