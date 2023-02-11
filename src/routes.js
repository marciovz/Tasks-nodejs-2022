import { randomUUID } from 'node:crypto';

import { Database } from './database/index.js';
import { buildRoutePath } from './utils/buildRoutePath.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const searchOptions = search ? { title: search, description: search } : null

      const tasks = database.select('tasks', searchOptions);

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.selectById('tasks', id);

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      console.log(req.body);
      if (!req.body) return res.writeHead(400).end();
      
      const { title, description } = req.body;

      if (!title  || title === '') return res.writeHead(400).end();
      if (!description || description === '') return res.writeHead(400).end();

      const task = database.insert('tasks', {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      return res.end(JSON.stringify(task));
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      
      if (!req.body) return res.writeHead(400).end('params not found!');
      const { title, description } = req.body;
      if( title === '') return res.writeHead(400).end(JSON.stringify('title cannot be empty!'));
      
      const oldTask = database.selectById('tasks', id);
      if (oldTask.length <= 0) return res.writeHead(400).end('task id not found!');
      
      database.update('tasks', id, {
        title: title ?? oldTask.title,
        description: description ?? oldTask.description,
        completed_at: oldTask.completed_at,
        updated_at: new Date(),
        created_at: oldTask.created_at
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete('tasks', id);
      return res.writeHead(204).end();
    }
  }
]