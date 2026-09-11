import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '실시간 CCTV',
  description: '공개된 실시간 CCTV를 한 화면에서 봅니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}