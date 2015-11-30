import express from 'express';
import createCRUD from './createCRUD';

let router = express.Router();
router.use('/todos', createCRUD('todo', 'todos'));

export default router;
