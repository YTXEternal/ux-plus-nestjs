import { Injectable, Logger } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { toBoolean, toNumber } from '../../tools';

/**
 * 邮件服务
 *
 * 基于 `nodemailer` 发送业务邮件（当前主要用于发送注册验证码）。
 *
 * @export
 * @class EmailService
 * @typedef {EmailService}
 */
@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  /**
   * 构造函数
   *
   * 初始化 SMTP 发送器配置。
   *
   * @param {ConfigService} configService 配置服务
   */
  constructor(private configService: ConfigService) {
    // 创建 SMTP 配置
    this.transporter = createTransport({
      host: configService.get('SMTP_HOST'), // 替换为您的 SMTP 服务器地址 (例如 smtp.gmail.com)
      port: toNumber(configService.get('SMTP_PORT')!), // SMTP 端口 (通常为 465 或 587)
      secure: toBoolean(configService.get('SMTP_SECURE')!), // 如果使用 465 端口，设置为 true，否则为 false
      auth: {
        user: configService.get('SMTP_EMAIL'), // 您的邮箱地址
        pass: configService.get('SMTP_EMAIL_CODE'), // 您的邮箱密码或应用专用密码
      },
      tls: {
        rejectUnauthorized: false, // 避免某些环境下的 SSL 证书错误 (生产环境中请移除)
      },
    });
  }

  /**
   * 发送注册验证码邮件
   *
   * @async
   * @param {string} email 收件人邮箱
   * @param {string} code 验证码
   * @returns {Promise<boolean>} 发送成功返回 true
   */
  async sendRegistryCode(email: string, code: string) {
    const subject = 'Registration Verification Code';
    const text = `Your verification code is:${code}`;
    const html = `<p>Hello:</p><p>Your verification code is: <strong>${code}</strong></p>`;
    const mailOptions = {
      from: `"NestJs" <${this.configService.get('SMTP_EMAIL')}`,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send verification email to ${email}`, err);
      throw err;
    }
  }
}
