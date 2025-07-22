import { Text, View } from 'react-native'
import { styles } from './styles'

type SaveValue = {
  current: string
  target: string
  percentage: number
}

type Props = {
  data: SaveValue
}

export function Progress({ data }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Valor guardado</Text>

      <View style={styles.status}>
        <Text style={styles.value}>
          {data.current}

          <Text style={styles.target}> de {data.target}</Text>
        </Text>
        
        <Text style={styles.percentage}>{data.percentage.toFixed(0)}%</Text>
            {/*Coloquei o toFixed(0) para não ter casas decimais. */}
      </View>

      <View style={styles.progress}>
        <View
          style={[styles.currentProgress, { width: `${data.percentage}%` }]}
          //A barra irá crescer baseado na porcentagem.
        />
      </View>
    </View>
  )
}