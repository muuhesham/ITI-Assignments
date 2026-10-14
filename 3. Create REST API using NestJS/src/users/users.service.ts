import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './schemas/user.schema.js';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<userDocument>,
  ) {}

  findUsers() {
    return this.userModel.find().exec();
  }

  async findOneUser(id: string) {
    this.validateId(id);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async addUser(body: CreateUserDto) {
    const existingUser = await this.userModel
      .findOne({ email: body.email.toLowerCase().trim() })
      .exec();
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const password = await bcrypt.hash(body.password, 10);
    return this.userModel.create({
      name: body.name,
      email: body.email,
      password,
    });
  }

  async updateUser(id: string, body: UpdateUserDto) {
    this.validateId(id);
    if (body.email !== undefined) {
      const existingUser = await this.userModel
        .findOne({
          email: body.email.toLowerCase().trim(),
          _id: { $ne: id },
        })
        .exec();
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }
    const update: Partial<Pick<User, 'name' | 'email' | 'password'>> = {};
    if (body.name !== undefined) {
      update.name = body.name;
    }
    if (body.email !== undefined) {
      update.email = body.email;
    }
    if (body.password !== undefined) {
      update.password = await bcrypt.hash(body.password, 10);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string) {
    this.validateId(id);
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private validateId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user id');
    }
  }
}
