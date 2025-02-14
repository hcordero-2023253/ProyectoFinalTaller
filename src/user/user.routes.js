import {Router} from 'express';
import { register } from './user.controller.js';

const api = Router()

api.post('/addUser', register)

export default api;