
import { Router, Request, Response } from 'express';
import { google } from 'googleapis';
import multer from 'multer';
import { getTokens } from '../firebase';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  const { userId } = req.body; 
  const file = req.file;

  if (!userId) {
    return res.status(400).json({ error: 'userId 파라미터가 누락되었습니다.' });
  }

  if (!file) {
    return res.status(400).json({ error: '업로드할 파일이 없습니다.' });
  }

  try {
    const tokens = await getTokens(userId);
    if (!tokens) {
      return res.status(401).json({ error: '사용자 인증 정보가 없습니다. 먼저 /auth/google 을 통해 인증하세요.' });
    }

    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      fields: 'id, webViewLink',
    });

    res.json({
      success: true,
      fileId: response.data.id,
      viewLink: response.data.webViewLink,
    });
  } catch (err: any) {
    console.error('드라이브 업로드 오류:', err);
    res.status(500).json({ error: err.message || 'Google Drive로 파일 업로드에 실패했습니다.' });
  }
});

export { router as driveRouter };
