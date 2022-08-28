import {Body, Controller, Post, Query} from '@nestjs/common';

import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {VerifyEmailDto} from './dto/verify.email.dto';
import {UserLoginDto} from './dto/user.login.dto';

/**
 * 유저 컨트롤러
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 회원가입
   * @param createUserDto 회원가입 Dto
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto;
    return this.usersService.createUser(name, email, password);
  }

  /**
   * 이메일 인증
   * @param verifyEmailDto  이메일인증 Dto
   */
  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    console.log(verifyEmailDto);
    return;
  }

  /**
   * 로그인
   *
   * @param userLoginDto 유저로그인 Dto
   */
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    const {email, password} = userLoginDto;

    return await this.usersService.login(email, password);
  }
}
