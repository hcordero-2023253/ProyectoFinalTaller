import { Router } from "express";
import { deleteAccount } from "../user/user.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js"

const user = Router()

user.delete('/delete/:id', validateJwt, deleteAccount)

export default user;