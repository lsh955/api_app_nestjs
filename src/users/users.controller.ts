import {Body, Controller, Get, Headers, Param, Post, Query} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {VerifyEmailDto} from './dto/verify.email.dto';
import {UserLoginDto} from './dto/user.login.dto';
import {UserInfo} from './userInfo';
import {AuthService} from '../auth/auth.service';

/**
 * 유저 컨트롤러
 */
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * 회원가입
   *
   * @param createUserDto 회원가입 Dto
   */
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
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1]; // 1. 헤더에서 JWT 파싱

    this.authService.verify(jwtString); // 2. JWT 가 서버에서 발급한 것인지를 검증

    return this.usersService.getUserInfo(userId); // 3. UserService 를 통해 유저 정보를 가져와서 응답
  }
}
