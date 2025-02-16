import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '~/config';

@Injectable()
export class UIAuthMiddleware implements NestMiddleware {
  private adminUser: string;
  private adminSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.adminUser = 'admin';
    this.adminSecret = configService.get('SYSTEM_SECRET');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');

    // Check credentials
    if (
      login &&
      password &&
      login === this.adminUser &&
      password === this.adminSecret
    ) {
      return next();
    }

    // If unauthorized
    res.set('WWW-Authenticate', 'Basic realm="401"'); // Prompt for login
    return res.status(401).send('Authentication required.');
  }
}
