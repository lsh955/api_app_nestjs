import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import {Injectable} from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {}
