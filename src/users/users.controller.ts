import {Body, Controller, Get, Headers, Param, Post, Query, UseFilters, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {VerifyEmailDto} from './dto/verify.email.dto';
import {UserLoginDto} from './dto/user.login.dto';
import {UserInfo} from './userInfo';
import {AuthGuard} from '../auth.guard';
import {HttpExceptionFilter} from '../exception/http-exception.filter';

/**
 * 유저 컨트롤러
 */
// @UseFilters(HttpExceptionFilter) 특정 컨트롤러 전체에 적용할 때
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * 회원가입
   *
   * @param createUserDto 회원가입 Dto
   */
  @UseFilters(HttpExceptionFilter) // 특정 엔드포인트에 적용할 때
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto;
    return this.usersService.createUser(name, email, password);
  }

  /**
   * 이메일 인증
   *
   * @param verifyEmailDto  이메일인증 Dto
   */
  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    const {signupVerifyToken} = verifyEmailDto;

    return await this.usersService.verifyEmail(signupVerifyToken);
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

  /**
   * 유저정보 조회
   *
   * @param headers
   * @param userId  아이디
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId); // 3. UserService 를 통해 유저 정보를 가져와서 응답
  }
}
