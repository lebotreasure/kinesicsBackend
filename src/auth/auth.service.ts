import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './Interface/user.interface';

@Injectable()
export class AuthService {
  find(id: any, product: AuthCredentialsDto): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
   
    const { username,password,blacklisted, admin} = authCredentialsDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({ username,password: hashedPassword, blacklisted, admin });

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }


  }

  // Get all users
  async getAllUsers(){
    const users = await this.userModel.find();
    return users;
  }

  async signIn(user: User) {
    const payload = { username: user.username,password: user.password, admin: user.admin};
    return {
      accessToken: this.jwtService.sign(payload),
     username:user.username,
     password:user.password,
     admin:user.admin,
    };
  }

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(pass, user.password);

    if (valid) {
      return user;
    }

    return null;
  }

  async findById(id: string): Promise<User>{
    return await this.userModel.findOne({_id:id });
}


async findApi(id: boolean): Promise<User[]>{
  return await this.userModel.find({blacklisted:id });
}

async update(id: string, user: AuthCredentialsDto): Promise<User>{
  return await this.userModel.findByIdAndUpdate(id, user, { new: true});
}

}


