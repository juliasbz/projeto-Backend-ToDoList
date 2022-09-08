export enum STATUS_LIST {
    TO_DO = "TO_DO",
    DOING = "DOING",
    DONE = "DONE"
};

export type User = {
    id: string,
    name: string,
    nickname: string,
    email: string
};

export type Task = {
    id: string,
    title: string,
    description: string,
    dueDate: string,
    status: STATUS_LIST,
    creatorUserId: string
};