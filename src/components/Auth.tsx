import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export const Auth: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError('');
      // ユーザーのインタラクションの直後にポップアップを開く
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Googleログインエラー:', err);
      if (err?.code === 'auth/popup-blocked') {
        setError('ポップアップがブロックされました。以下の手順で許可してください：\n1. ブラウザのアドレスバーのポップアップブロックアイコンをクリック\n2. このサイトを許可\n3. 再度ログインボタンをクリック');
      } else {
        setError('ログインに失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            PDFサマリーアプリ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Googleアカウントでログイン
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-red-700 whitespace-pre-line">
                {error}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <LogIn className="w-5 h-5" />
          {isLoading ? 'ログイン中...' : 'Googleでログイン'}
        </button>
      </div>
    </div>
  );
};