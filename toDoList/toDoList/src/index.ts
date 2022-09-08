import express from "express";
import cors from "cors";
import { ping } from "./endpoints/ping";
import pegaLista from "./endpoints/pegaLista";
import pegaTarefas from "./endpoints/pegaTarefas";
import pegaUsuarioDaTarefa from "./endpoints/pegaUsuarioDaTarefa";
import adicionarUsuarioATarefa from "./endpoints/adicionaUsuarioATarefa";
import editaApelido from "./endpoints/editaApelido";
import editaStatus from "./endpoints/editaStatus";
import deletaUsuario from "./endpoints/deletaUsuario";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3003, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3003}`)
});

app.get("/ping", ping)

// Endpoint com o callback vindo por import da pasta endpoints
app.get("/users", pegaLista)

// Endpoint com o callback vindo por import da pasta endpoints
app.get("/tasks", pegaTarefas)

// Endpoint com o callback vindo por import da pasta endpoints
app.get("/tasks/:taskId/users", pegaUsuarioDaTarefa)

// Endpoint com o callback vindo por import da pasta endpoints
app.post("/tasks/:taskId/users", adicionarUsuarioATarefa)

// Endpoint com o callback vindo por import da pasta endpoints
app.put("/users/:userId", editaApelido)

// Endpoint com o callback vindo por import da pasta endpoints
app.put("/tasks/:taskId", editaStatus)

// Endpoint com o callback vindo por import da pasta endpoints
app.delete("/tasks/:taskId", deletaUsuario)