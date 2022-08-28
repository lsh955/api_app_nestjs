import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import {Injectable} from '@nestjs/common';

interface EmailOptions {
  to: string;       // 수신자
  subject: string;  // 메일제목
  html: string;     // 메일본문
}

/**
 * 이메일 서비스
 */
@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '', // TODO: 이메일계정 아이디 입력
        pass: '', // TODO: 이메일계정 비밀번호 입력
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';

    // 유저가 누를 버튼이 가질 링크를 구성, 이 링크로 다시 우리 서비스로 이메일 인증 요청이 들어온다.
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    // 메일본문 구성, form 태그를 이용하여 POST 요청
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입인증 메일 안내',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    // transporter 객체를 이용하여 메일을 전송
    return await this.transporter.sendMail(mailOptions);
  }
}
