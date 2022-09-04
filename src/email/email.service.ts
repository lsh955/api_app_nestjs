import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import emailConfig from 'src/config/emailConfig';

import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';

interface EmailOptions {
  to: string; // 수신자
  subject: string; // 메일제목
  html: string; // 메일본문
}

/**
 * 이메일 서비스
 */
@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.config.baseUrl;

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
