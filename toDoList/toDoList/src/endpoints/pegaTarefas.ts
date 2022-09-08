import { Request, Response } from "express"
import connection from "../database/connection"

/* ## Endpoint 2) Pegar Tarefas
Este endpoint permite que ao consumir a requisição seja possível recebermos a lista completa de tarefas ou fazer uma busca por parte do título ou descrição da tarefa.
Método: GET
Rota de requisição: “/tasks”
Entradas → Variável de busca “search” opcional (query params).
Validação de Input → Nenhuma.
Regras de Negócio → Nenhuma.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de recebimento, mensagem de sucesso e a lista de tarefas selecionadas.
*/

const table_tasks = "Tasks";

const pegaTarefas = async ( req: Request, res: Response ) => {
    let errorCode: number = 400;
    try {
        const { search } = req.query;

        if (!search) {
            const allTasks = await connection(table_tasks)
                .select("*");

            return res.status(200).send({
                message: "Sucess!",
                tasks: allTasks
            });
        };

        const selectedTasks = await connection(table_tasks)
            .select("*")
            .where("title", "LIKE", `%${search}%`)
            .orWhere("description", "LIKE", `%${search}%`)

        res.status(200).send({
            message: "Success!",
            tasks: selectedTasks
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default pegaTarefas;