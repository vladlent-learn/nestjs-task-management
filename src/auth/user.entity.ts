import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { TaskEntity } from '../tasks/task.entity';

@Entity({ name: 'users' })
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(type => TaskEntity, task => task.user, { eager: true })
  tasks: TaskEntity[];

  constructor(authCredentialsDto?: AuthCredentialsDto) {
    super();
    this._init(authCredentialsDto);
  }

  private _init(authCredentialsDto?: AuthCredentialsDto) {
    if (authCredentialsDto) {
      const { password, username } = authCredentialsDto;
      this.username = username;
      this.password = password;
    }
  }

  async hashPassword(salt?: string) {
    if (salt) {
      this.salt = salt;
    } else if (!salt && !this.salt) {
      this.salt = await bcrypt.genSalt();
    }

    this.password = await bcrypt.hash(this.password, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
