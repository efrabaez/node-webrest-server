import { Request, Response } from "express";
import { read } from "fs";
import { json } from "stream/consumers";

const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
];

export class TodosController {

    //* Dependency Injection
    constructor(){}

    public getTodos = (req:Request, res:Response) => {
        res.json(todos); 
        return; 
        /** must return void | Promise<void> (not Response) to be compatible with @types/express@5.0.0
         *  https://github.com/expressjs/express/issues/5987#issuecomment-2428333462
         */
    }

    public getTodoById = (req:Request, res:Response) => {
        const id = +req.params.id;
        const todo = todos.find(todo => todo.id === id);

        if ( isNaN(id) ) return void res.status(400).json({error: 'ID argument is not a number'});

        if (todo) {
            res.json(todo);
            return;
        } 
            res.status(404).json({error: `TODO with id ${id} not found`});
            return;
    }

    public createTodo = (req:Request, res:Response) => {
        const { text } =  req.body;
        if (!text) return void res.status(400).json({ error: 'Text property is required' });

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: new Date(),
        };

        todos.push(newTodo);
        
        const response = {
            message: 'New element was inserted',
            todo: newTodo,
        }

        res.json(response);
    }

    public updateTodo = (req:Request, res:Response) => {
        const id =  +req.params.id;
        if ( isNaN(id) ) return void res.status(400).json({error: 'ID argument is not a number'});

        const todo = todos.find(todo => todo.id === id);
        if ( !todo ) return void res.status(400).json({error: `Todo with id ${id} not found`});

        const { text, completedAt } = req.body;
        //if ( !text ) return void res.status(400).json({error: `Todo with id ${id} has no text property`});

        todo.text = text || todo.text;
        if ( completedAt === 'null') {
            todo.completedAt = null;
        } else {
            todo.completedAt =  new Date(completedAt || todo.completedAt);
        }
        //! This is passed via reference (js objects are passed with reference)
        const response = {
            id: id,
            message: 'Todo was updated',
            todo: todo,
        }

        res.json(response);
    }

    public deleteTodo = (req:Request, res:Response) => {
        const id =  +req.params.id;
        if ( isNaN(id) ) return void res.status(400).json({error: 'ID argument is not a number'});

        const todo = todos.find(todo => todo.id === id);
        if ( !todo ) return void res.status(400).json({error: `Todo with id ${id} not found`});
 
        todos.splice(todos.indexOf(todo), 1);

        const response = {
            id: id,
            message: 'Todo was deleted',
            todo: todo,
        }

        res.json(response);
    }
}