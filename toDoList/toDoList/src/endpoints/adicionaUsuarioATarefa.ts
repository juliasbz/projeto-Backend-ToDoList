import { Request, Response } from "express"
import connection from "../database/connection"

/* ## Endpoint 4) Adicionar Usuário Responsável a um Tarefa
Este endpoint adiciona um responsável por uma tarefa. Um usuário pode ser atribuído a realizar múltiplas tarefas, mas não deve ser possível atribuir a mesma tarefa a mais de um usuário ao mesmo tempo. Esta relação é estabelecida pela tabela “Responsibles” do template.
Método: POST
Rota de requisição: “/tasks/:taskId/users”
Entradas → Id da tarefa e do usuário selecionado.
Validação de Input → Nenhuma.
Regras de Negócio:
- Id da tarefa e do usuário devem ser compatíveis com registros existentes em seus respectivos bancos de dados.
- O usuário só poderá ser registrado uma única vez para cada tarefa selecionada.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de criação e mensagem de sucesso da operação.
*/

const table_users = "Users";
const table_tasks = "Tasks";
const table_responsibles = "Responsibles";

const adicionarUsuarioATarefa = async ( req: Request, res: Response ) => {
    let errorCode: number = 400;
    try {
        const { taskId } = req.params;
        const { userId } = req.body;

        const taskById = await connection(table_tasks)
            .select("*")
            .where({ id: taskId });

        if (!taskById[0]) {
            errorCode = 409;
            throw new Error("Id doesn't match a valid task.");
        };

        const userById = await connection(table_users)
            .select("*")
            .where({ id: userId });

        if (!userById[0]) {
            errorCode = 409;
            throw new Error("Id doesn´t match a valid user.");
        };

        const responsibility = await connection(table_responsibles)
            .select("*")
            .where({ userId })
            .andWhere({ taskId })

        if (responsibility[0]) {
            errorCode = 409;
            throw new Error("User has already been added to task.");
        };

        await connection(table_responsibles)
            .insert({ userId, taskId });

        res.status(201).send({
            message: "User added to task successfully!"
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default adicionarUsuarioATarefa;