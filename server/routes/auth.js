
import { Router, Request, Response } from 'express';
import { google } from 'googleapis';
import { saveTokens } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID || "287636159342-26n3t9779508322k3so2pskeuof5er53d.apps.googleusercontent.com",
  process.env.GOOGLE_CLIENT_SECRET || "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",
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback"
);

router.get('/google', (req: Request, res: Response) => {
  const state = uuidv4();
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // refresh_token을 받기 위해 필수
    scope: scopes,
    state: state,
    prompt: 'consent'
  });

  res.redirect(url);
});

router.get('/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`인증 오류: ${error}`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    const userId = userInfo.data.id || 'default_user';
    await saveTokens(userId, tokens);

    res.send(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
          <meta charset="UTF-8">
          <title>인증 완료</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb; }
              .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); text-align: center; max-width: 400px; width: 90%; }
              .icon { background: #d1fae5; color: #059669; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 32px; }
              h1 { color: #111827; margin: 0 0 0.5rem; font-size: 1.5rem; }
              p { color: #6b7280; line-height: 1.5; margin-bottom: 2rem; }
              .user-email { font-weight: bold; color: #3b82f6; }
              button { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%; }
              button:hover { background: #1d4ed8; }
          </style>
      </head>
      <body>
          <div class="card">
              <div class="icon">✓</div>
              <h1>연결 성공!</h1>
              <p><span class="user-email">${userInfo.data.email}</span> 님의 Google Drive 토큰이 브릿지에 안전하게 저장되었습니다.</p>
              <button onclick="window.close()">이 창 닫기</button>
          </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('토큰 교환 오류:', err);
    res.status(500).send('인증 과정 중 토큰 교환에 실패했습니다.');
  }
});

export { router as googleAuthRouter };
