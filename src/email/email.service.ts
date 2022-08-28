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
}
