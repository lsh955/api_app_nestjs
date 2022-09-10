import {IsEmail, IsString, Matches, MaxLength, MinLength,} from 'class-validator';

export class CreateUserDto {
  // 사용자 이름은 2자 이상 30자 이하인 문자열
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  // 사용자 이메일은 60자 이하의 문자열로써 이메일 주소형식
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  // 사용자 패스워드는 영문대소문자와 숫자 또는 특수문자(!, @, #, $, %, ^, &, *, (, ))로 이루어진 8자 이상 30자 이하의 문자열
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
