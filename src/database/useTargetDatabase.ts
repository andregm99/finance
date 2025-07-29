import { useSQLiteContext } from "expo-sqlite"

export type TargetCreate = {
    name: string,
    amount:number
}

export type TargetResponse = {
  id: number
  name: string
  amount: number
  current: number
  percentage: number
  created_at: Date
  updated_at: Date
}

export function useTargetDataBase() {
    const database = useSQLiteContext()//obtendo conexão com o sqllite.

    async function create(data:TargetCreate) {//inserindo nova meta no banco.
        const statement = await database.prepareAsync(
            'INSERT INTO targets (name, amount) values ($name, $amount)'
        )

        statement.executeAsync({//executando instrução SQL previamente preparada.
            $name: data.name,
            $amount: data.amount,
        })
    }

    function listBySavedValue (){
    return database.getAllAsync<TargetResponse>(`
            SELECT
            targets.id,
            targets.name,
            targets.amount,
            COALESCE(SUM(transactions.amount),0) AS current,
            COALESCE((SUM(transactions.amount) * 100.0) / targets.amount, 0) AS percentage,
            targets.created_at,
            targets.updated_at
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            GROUP BY targets.id, targets.name, targets.amount
            ORDER BY current DESC
        `)
}//COALESCE verifica se for nulo e coloca zero caso seja.

function show(id: number) {
    return database.getFirstAsync<TargetResponse>(`
      SELECT
        targets.id,
        targets.name,
        targets.amount,
        COALESCE (SUM(transactions.amount), 0) AS current,
        COALESCE ((SUM(transactions.amount) / targets.amount) * 100, 0) AS percentage,
        targets.created_at,
        targets.updated_at
      FROM targets
      LEFT JOIN transactions ON targets.id = transactions.target_id
      WHERE targets.id = ${id}
    `)
  }

    return{create,listBySavedValue,show}
}



/*INSERT INTO targets (name, amount) values ($name, $amount) 
--inserindo na tabela os valores. $ indica os parâmetros no sql.
*/