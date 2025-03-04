import { Router } from "express";
import { buyProduct, updatebill, viewBills} from './bill.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';

const bill = Router();


bill.post('/complete', validateJwt, buyProduct);
bill.put('/update/:id', validateJwt, updatebill);
bill.get('/bill',validateJwt , viewBills);


export default bill;