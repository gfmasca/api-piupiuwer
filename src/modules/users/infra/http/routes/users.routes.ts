import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controller/UsersController';

const userRouter = Router();

const usersController = new UsersController();

userRouter.post('/register', usersController.create);
userRouter.get('/users', ensureAuthenticated, usersController.index);

export default userRouter;
