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
   * @param createUserDto
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  /**
   * 이메일 인증
   * @param verifyEmailDto
   */
  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    console.log(verifyEmailDto);
    return;
  }

  /**
   * 로그인
   * @param userLoginDto
   */
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    console.log(userLoginDto);
    return;
  }
}
