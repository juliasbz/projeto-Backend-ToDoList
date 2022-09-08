import { Request, Response } from "express"
import connection from "../database/connection"

/* ## Endpoint 5) Editar Apelido do Usuário
Este endpoint permite que editemos o apelido de um usuário buscado pelo seu id.
Método: PUT
Rota de requisição: “/users/:userId”
Entradas → Id do usuário selecionado.
Validação de Input:
- nickname (apelido) deve existir e ser do tipo string.
- nickname (apelido) deve ter ao menos 3 caracteres.
Regras de Negócio:
- Id do usuário deve existir no banco de dados.
Saídas possíveis:
- Cada erro deve retornar o seu respectivo status code e uma mensagem descrevendo a situação.
- Para sucesso, deve retornar o status de alteração e mensagem de sucesso da operação.
*/

const table_users = "Users";

const editaApelido = async ( req: Request, res: Response ) => {
    let errorCode: number = 400;
    try {
        const { userId } = req.params;
        const { nickname } = req.body;

        if (!nickname) {
            errorCode = 422;
            throw new Error("Missing data in order to update user.");
        };

        if (typeof nickname !== "string") {
            errorCode = 422;
            throw new Error("Invalid nickname");
        };

        if (nickname.length < 4) {
            errorCode = 422;
            throw new Error("New nickname should have at least 3 characters.");
        };

        const userById = await connection(table_users)
            .select("*")
            .where({ id: userId });

        if (!userById[0]) {
            errorCode = 409;
            throw new Error("Id doesn't match a valid user.");
        };

        await connection(table_users)
            .update({ nickname })
            .where({ id: userId });

        res.status(200).send({
            message: "User updated successfully!"
        });
    } catch (err: any) {
        if (err.statusCode === 200) {
            res.status(500).end();
        } else {
            res.status(errorCode).send(err.message);
        };
    };
};

export default editaApelido;