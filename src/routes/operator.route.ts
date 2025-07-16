import { Router } from "express";
import { authOperation } from "../middleware/auth.middleware.js";
import { getNewTasksForOperator, getTodayDailyTasksForOperator, updateDailyTask, updateNewTask } from "../controller/operator.controller.js";

const operatorRouter = Router();

operatorRouter.get('/getdailyTasks', authOperation, getTodayDailyTasksForOperator);
operatorRouter.get('/getnewTasks', authOperation, getNewTasksForOperator);
operatorRouter.patch('/updateDailyTask/:id', authOperation, updateDailyTask);
operatorRouter.patch('/updateNewTask/:id', authOperation, updateNewTask);


export default operatorRouter;
