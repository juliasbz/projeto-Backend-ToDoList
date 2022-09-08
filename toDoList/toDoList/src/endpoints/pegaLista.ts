import { Request, Response } from "express"
import connection from "../database/connection"

/* ## Endpoint 1) Pegar Lista de Usuários
Este endpoint permite que ao consumir a requisição seja possível recebermos a lista completa de usuários ou fazermos uma busca por parte do nome ou apelido do usuário.
Método: GET
Rota de requisição: “/users”
Entradas → Variável de busca “search” opcional (query params).
Validação de Input → Nenhuma.
Regras de Negócio → Nenhuma.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de recebimento, mensagem de sucesso e a lista de usuários selecionados.
*/

const table_users = "Users";

const pegaLista = async ( req: Request, res: Response ) => {
    let errorCode: number = 400;
    try {
        const { search } = req.query;

        if (!search) {
            const allUsers = await connection(table_users)
                .select("*");

            return res.status(200).send({
                message: "Sucess!",
                users: allUsers
            });
        };

        const selectedUsers = await connection(table_users)
            .select("*")
            .where("name", "LIKE", `%${search}%`)
            .orWhere("nickname", "LIKE", `%${search}%`)

        res.status(200).send({
            message: "Success!",
            users: selectedUsers
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default pegaLista;