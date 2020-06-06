import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Entity({ name: 'users' })
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

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
}
