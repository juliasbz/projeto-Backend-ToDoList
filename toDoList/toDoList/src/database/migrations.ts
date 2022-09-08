import connection from "./connection";
import { responsibles, tasks, users } from "./data";

const table_users = "Users";
const table_tasks = "Tasks";
const table_responsibles = "Responsibles";

const createTables = async () => {
    await connection.raw(`
            CREATE TABLE IF NOT EXISTS ${table_users}(
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
	            nickname VARCHAR(255) NOT NULL,
	            email VARCHAR(255) NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS ${table_tasks}(
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
	            description VARCHAR(255) NOT NULL,
	            dueDate DATE NOT NULL,
	            status ENUM ("TO_DO", "DOING", "DONE") DEFAULT "TO_DO",
	            creatorUserId VARCHAR(255) NOT NULL,
	            FOREIGN KEY (creatorUserId) REFERENCES ${table_users}(id)
            );

            CREATE TABLE IF NOT EXISTS ${table_responsibles}(
                userId VARCHAR(255) NOT NULL,
                taskId VARCHAR(255) NOT NULL,
                FOREIGN KEY (userId) REFERENCES ${table_users}(id),
                FOREIGN KEY (taskId) REFERENCES ${table_tasks}(id)
            );
        `)
        .then(() => {
            console.log("Tables created successfully!");
            insertData();
        })
        .catch((error: any) => printError(error));
};

const insertData = async () => {
    try {
        await connection(table_users)
            .insert(users)
            .then(() => console.log(`${table_users} inserted!`))
            .catch((error: any) => printError(error));

        await connection(table_tasks)
            .insert(tasks)
            .then(() => console.log(`${table_tasks} inserted!`))
            .catch((error: any) => printError(error));

        await connection(table_responsibles)
            .insert(responsibles)
            .then(() => console.log(`${table_responsibles} inserted!`))
            .catch((error: any) => printError(error));

    } catch (error: any) {
        console.log(error.sqlMessage || error.message);
    } finally {
        console.log("Ending connection!");

        return connection.destroy();
    };
};

const printError = (error: any) => {
    console.log(error.sqlMessage || error.message);
};

createTables();