
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { googleAuthRouter } from './routes/auth';
import { driveRouter } from './routes/drive';

// 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS 설정 - AI 스튜디오 및 일반적인 출처 허용
app.use(cors({
  origin: '*', // 프로덕션에서는 https://aistudio.google.com 등 특정 출처로 제한 권장
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우팅
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'OAuth 브릿지 서버가 정상 작동 중입니다!', version: '1.0.0' });
});

app.use('/auth', googleAuthRouter);
app.use('/drive', driveRouter);

// 글로벌 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('서버 에러 발생:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || '내부 서버 오류가 발생했습니다.',
      status: err.status || 500
    }
  });
});

app.listen(port, () => {
  console.log(`[서버] 브릿지 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

export default app;
