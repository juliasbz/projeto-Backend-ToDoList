import { Request, Response } from "express"
import connection from "../database/connection"

/* ## Endpoint 7) Deletar uma tarefa
Este endpoint permite remover uma tarefa pelo seu id.
Método: DELETE
Rota de requisição: “/tasks/:taskId”
Entradas → Id da tarefa selecionada.
Validação de Input → Nenhuma.
Regras de Negócio:
- Id da tarefa deve ser compatível com registro existente em banco de dados.
- Deleção de tarefas necessita de remoção de usuários destacados para esta tarefa.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de deleção e mensagem de sucesso da operação.
*/

const table_tasks = "Tasks";
const table_responsibles = "Responsibles";

const deletaUsuario = async ( req: Request, res: Response ) => {
    let errorCode: number = 400;
    try {
        const { taskId } = req.params;

        const taskById = await connection(table_tasks)
            .select("*")
            .where({ id: taskId });
      
        if (!taskById[0]) {
            errorCode = 409;
            throw new Error("Id doesn't match a valid task.");
        };

        await connection(table_responsibles)
            .delete()
            .where({ taskId: taskId });

        await connection(table_tasks)
            .delete()
            .where({ id: taskId });

        res.status(200).send({
            message: "Task removed successfully!"
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default deletaUsuario;