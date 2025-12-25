
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  UploadCloud, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Github
} from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleTestAuth = () => {
    // 실제 배포 환경에서는 브릿지 서버 URL로 연결됩니다.
    window.open('http://localhost:5000/auth/google', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">su-video-oauth-bridge</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              서버 정상 작동 중
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 왼쪽 컬럼: 서버 상태 및 주요 액션 */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <Database className="mr-3 text-blue-500" />
                브릿지 설정 정보
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1 font-medium">Firebase 프로젝트</p>
                  <p className="text-lg font-mono text-gray-700">su-video-edit-tool</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1 font-medium">서버 포트</p>
                  <p className="text-lg font-mono text-gray-700">5000</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">사용 가능한 엔드포인트</h3>
                <ul className="space-y-3">
                  {[
                    { method: 'GET', path: '/auth/google', desc: 'Google OAuth 인증 프로세스 시작' },
                    { method: 'GET', path: '/auth/callback', desc: 'OAuth 리다이렉트 콜백 처리기' },
                    { method: 'POST', path: '/drive/upload', desc: 'Google Drive 파일 업로드 (Multipart)' },
                  ].map((route, i) => (
                    <li key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <div className="flex items-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded mr-3 ${route.method === 'POST' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {route.method}
                        </span>
                        <code className="text-sm font-semibold text-gray-600">{route.path}</code>
                      </div>
                      <span className="text-sm text-gray-400">{route.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <LinkIcon className="mr-3" />
                    인증 연결 테스트
                  </h2>
                  <p className="text-blue-100 max-w-md">
                    Google OAuth 세션을 초기화하여 브릿지 연결을 테스트합니다. 인증 성공 시 액세스 토큰이 Firestore에 안전하게 저장됩니다.
                  </p>
                </div>
                <button 
                  onClick={handleTestAuth}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all transform hover:scale-105 shadow-md active:scale-95"
                >
                  Google Drive 연결하기
                  <ExternalLink className="ml-2 w-4 h-4" />
                </button>
              </div>
            </section>
          </div>

          {/* 오른쪽 컬럼: 도구 및 운영 정보 */}
          <div className="space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800">
                <UploadCloud className="mr-2 text-green-500 w-5 h-5" />
                업로드 테스터
              </h3>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">파일을 선택하여 `/drive/upload` 엔드포인트를 테스트하세요</p>
                <input type="file" className="hidden" id="test-upload" />
                <label 
                  htmlFor="test-upload" 
                  className="inline-block cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  파일 선택
                </label>
              </div>
            </section>

            <section className="bg-gray-900 rounded-2xl shadow-sm p-6 text-gray-300">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <AlertCircle className="mr-2 text-yellow-400 w-5 h-5" />
                운영 참고 사항
              </h3>
              <ul className="text-sm space-y-4">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  `server/index.ts`의 CORS 설정이 클라이언트 도메인과 일치하는지 확인하세요.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Google Redirect URI는 Google Cloud 콘솔 설정과 정확히 일치해야 합니다.
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Firebase의 `oauth_tokens` 컬렉션은 첫 인증 성공 시 자동으로 생성됩니다.
                </li>
              </ul>
            </section>

            <div className="flex justify-center pt-4">
              <a href="https://github.com" target="_blank" className="flex items-center text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
                <Github className="w-4 h-4 mr-2" />
                저장소 보기
              </a>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2024 su-video-oauth-bridge • Node.js, Express, Firebase로 구축됨
        </div>
      </footer>
    </div>
  );
};

export default App;
