import './styles/tokens.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Agentic Monorepo Web',
  description: 'Next.js + Tailwind + Ant Design Enterprise Starter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
