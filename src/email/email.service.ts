import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import {Injectable} from '@nestjs/common';

interface EmailOptions {
  to: string; // 수신자
  subject: string;  // 메일제목
  html: string; // 메일본문
}

@Injectable()
export class EmailService {}
