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
   * @param dto
   */
  @Post()
  create(@Body() dto: CreateUserDto) {
    console.log(dto);
    return this.usersService.create(dto);
  }

  /**
   * 이메일 인증
   * @param dto
   */
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  /**
   * 로그인
   * @param dto
   */
  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    console.log(dto);
    return;
  }
}
