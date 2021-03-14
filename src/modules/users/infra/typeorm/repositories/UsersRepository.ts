import { Repository, getRepository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id, {
      relations: ['followers', 'following', 'favorites'],
    });

    return user;
  }

  public async findByUsernameWithRelations(username: string | undefined): Promise<User[]> {
    let query = '';

    if (username) query = `user.username = '${username}'`;

    const users = await this.ormRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.likes', 'likes')
      .leftJoinAndSelect('user.pius', 'pius')
      .leftJoinAndSelect('pius.likes', 'userPiusLikes')
      .leftJoinAndSelect('user.following', 'followed')
      .leftJoinAndSelect('user.followers', 'follower')
      .leftJoinAndSelect('user.favorites', 'favorites')
      .where(query)
      .getMany();

    return users;
  }

  public async findByEmailWithRelations(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
      relations: ['likes', 'pius', 'following', 'followers', 'favorites'],
    });

    return user;
  }

  public async findByEmailOrUsername(email: string, username: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: [{ email }, { username }],
    });

    return user;
  }

  public create(data: ICreateUserDTO): User {
    const user = this.ormRepository.create(data);

    return user;
  }

  public async save(data: User): Promise<User> {
    const user = await this.ormRepository.save(data);

    return user;
  }
}
