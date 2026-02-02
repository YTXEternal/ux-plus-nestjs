import { Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { EmailService } from './email.service';

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn(),
  };
});

describe('EmailService', () => {
  const sendMail = jest.fn();

  beforeEach(() => {
    (createTransport as unknown as jest.Mock).mockReturnValue({
      sendMail,
    });
    sendMail.mockReset();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should send registry code email successfully', async () => {
    sendMail.mockResolvedValue({ messageId: '1' });
    const configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, string> = {
          SMTP_HOST: 'smtp.example.com',
          SMTP_PORT: '587',
          SMTP_SECURE: 'false',
          SMTP_EMAIL: 'noreply@example.com',
          SMTP_EMAIL_CODE: 'code',
        };
        return map[key];
      }),
    };

    const service = new EmailService(configService as any);
    const ok = await service.sendRegistryCode('a@b.com', '1234');
    expect(ok).toBe(true);

    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'noreply@example.com',
          pass: 'code',
        },
      }),
    );

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'a@b.com',
        subject: 'Registration Verification Code',
        text: expect.stringContaining('1234'),
        html: expect.stringContaining('1234'),
        from: expect.stringContaining('noreply@example.com'),
      }),
    );
  });

  it('should throw and log when sendMail fails', async () => {
    const err = new Error('smtp down');
    sendMail.mockRejectedValue(err);
    const loggerSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => void 0);

    const configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, string> = {
          SMTP_HOST: 'smtp.example.com',
          SMTP_PORT: '587',
          SMTP_SECURE: 'false',
          SMTP_EMAIL: 'noreply@example.com',
          SMTP_EMAIL_CODE: 'code',
        };
        return map[key];
      }),
    };

    const service = new EmailService(configService as any);
    await expect(service.sendRegistryCode('a@b.com', '1234')).rejects.toThrow(
      'smtp down',
    );
    expect(loggerSpy).toHaveBeenCalled();
  });
});
