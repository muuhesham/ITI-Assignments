import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, userDocument } from '../users/schemas/user.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(body: CreateUserDto) {
    const user = await this.userService.addUser(body);
    const token = this.jwtService.sign({ _id: user._id });
    return {
      message: 'registered successfully',
      token,
      user,
    };
  }

  async login(body: LoginDto) {
    const user = await this.userModel
      .findOne({ email: body.email.toLowerCase().trim() })
      .select('+password');
    if (!user) {
      throw new UnauthorizedException('email or password not correct');
    }

    const isMatched = await bcrypt.compare(body.password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('email or password not correct');
    }
    const token = this.jwtService.sign({ _id: user._id });
    return {
      message: 'logged in',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
