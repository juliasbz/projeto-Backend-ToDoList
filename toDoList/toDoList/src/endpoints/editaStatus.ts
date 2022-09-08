import { Request, Response } from "express"
import connection from "../database/connection"
import { STATUS_LIST } from '../types';

/* ## Endpoint 6) Editar Status de uma Tarefa
Este endpoint edita o status de uma tarefa, que só assume os valores: “A FAZER”, “FAZENDO” e “FEITO” conforme a query do arquivo migrations na criação da tabela de tarefas “Tasks”.
Método: PUT
Rota de requisição: “/tasks/:taskId”
Entradas → Id da tarefa selecionada.
Validação de Input:
- Status deve existir e assumir um dos seguintes valores: “A FAZER”, “FAZENDO” ou “FEITO”.
Regras de Negócio:
- Id da tarefa deve existir no banco de dados.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de alteração e mensagem de sucesso da operação.
*/

const table_tasks = "Tasks";

const editaStatus = async ( req: Request, res: Response ) => {
    let errorCode: number = 400;
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        if (!status) {
            errorCode = 422;
            throw new Error("Missing data in order to update task.");
        };

        if (!(status in STATUS_LIST)) {
            errorCode = 422;
            throw new Error("Invalid status.");
        };

        const taskById = await connection(table_tasks)
            .select("*")
            .where({ id: taskId });

        if (!taskById[0]) {
            errorCode = 409;
            throw new Error("Id doesn't match a valid task.");
        };

        await connection(table_tasks)
            .update({ status })
            .where({ id: taskId });

        res.status(200).send({
            message: "Task status updated successfully!"
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default editaStatus;