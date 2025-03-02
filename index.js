import {initServer} from './configs/app.js'
import { config } from 'dotenv'
import { addDefaultCategory }  from "./src/category/categorias.controller.js"
import {  createAdminDefault } from "./src/auth/auth.controller.js"
import { connect } from './configs/mongo.js'

config()
connect()
addDefaultCategory()
createAdminDefault()
initServer()