import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  username: string | undefined;
}

@injectable()
export default class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ username }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findByUsernameWithRelations(username);

    if (!users.length) {
      throw new AppError('User not found', 404);
    }

    return users;
  }
}
