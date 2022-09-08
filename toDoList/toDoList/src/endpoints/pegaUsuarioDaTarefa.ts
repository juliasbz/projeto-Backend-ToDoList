import { Request, Response } from "express"
import connection from "../database/connection"

/* ## Endpoint 3) Pegar Usuário Responsável por uma Tarefa
Este endpoint retorna o usuário (apenas id e apelido) responsável por uma determinada tarefa. Esta relação é estabelecida pela tabela “Responsibles” do template.
Método: GET
Rota de requisição: “/tasks/:taskId/users”
Entradas → Id da tarefa selecionada.
Validação de Input → Nenhuma.
Regras de Negócio → Id da tarefa deve existir no banco de dados.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de recebimento, mensagem de sucesso e o usuário responsável.
*/

const table_users = "Users";
const table_tasks = "Tasks";
const table_responsibles = "Responsibles";

const pegaUsuarioDaTarefa = async ( req: Request, res: Response ) => {
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

        const usersByTask = await connection(table_responsibles)
            .where({ taskId });

        const allUsersToTask = [];

        for (let user of usersByTask) {
            const result = await connection(table_users)
                .select("id", "nickname")
                .where({ id: user.userId });

            allUsersToTask.push(result);
        };

        res.status(200).send({
            message: "Success!",
            users: allUsersToTask
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default pegaUsuarioDaTarefa;