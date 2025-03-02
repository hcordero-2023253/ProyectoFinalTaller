import {Router} from 'express';
import { registerClient, registerAdmin, updateRole, login,createAdminDefault } from './auth.controller.js';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router()

api.post('/addUserClient', registerClient);
api.post('/addUserAdmin', validateJwt, isAdmin ,registerAdmin)
api.post('/login', login,createAdminDefault);
api.put('/updateRole/:id', validateJwt, updateRole);

export default api;