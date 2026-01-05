import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, email, password: hashed });
    return this.repo.save(user);
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    // remove password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safe } = user;
    return { accessToken, user: safe };
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
