import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, User } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GitHubAuthGuard } from './github-auth.guard';

interface RequestWithSession extends Request {
  session: Session & {
    returnTo?: string;
  };
  user?: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request & { user: User }) {
    return req.user;
  }

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  async githubAuth(@Query('returnTo') returnTo: string) {
    // NOTE(hackerwins): Redirect to GitHub for authentication.
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubAuthCallback(
    @Req() req: RequestWithSession & { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.createToken(req.user);

    res.cookie('syncup_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });

    const returnTo = `${this.configService.get('FRONTEND_URL')}${req.session.returnTo}`;
    delete req.session.returnTo;

    return res.redirect(returnTo!);
  }
}
