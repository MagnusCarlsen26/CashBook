import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata = {
  title: 'Cash Book',
  description: 'Track your cash flow with ease',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}