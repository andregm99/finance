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

export type TargetUpdate = TargetCreate & {
  id:number
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

    function listByClosestTarget (){
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
            ORDER BY percentage DESC
        `)
}//COALESCE verifica se for nulo e coloca zero caso seja.

function show(id: number) {//buscando meta pelo id
  //getFirstAsync retorna somente o primeiro (e único) resultado da consulta SQL
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

 async function update(data:TargetUpdate){
    const statement = await database.prepareAsync(`
          UPDATE targets SET
            name = $name,
            amount = $amount,
            updated_at = current_timestamp
          WHERE id = $id
      `)

      statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $amount: data.amount,
      })
  }

  async function  remove(id:number) {//runAsync permite executar sql sem esperar retorno.
      await database.runAsync("DELETE FROM targets WHERE id = ?",id)
  }

    return{create,listByClosestTarget,show,update,remove}
}



/*INSERT INTO targets (name, amount) values ($name, $amount) 
--inserindo na tabela os valores. $ indica os parâmetros no sql.
*/