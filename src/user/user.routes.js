import {Router} from 'express';
import { registerClient, registerAdmin, login,createAdminDefault } from './user.controller.js';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router()

api.post('/addUserClient', registerClient);
api.post('/addUserAdmin', validateJwt, isAdmin ,registerAdmin)
api.post('/login', login,createAdminDefault);

export default api;