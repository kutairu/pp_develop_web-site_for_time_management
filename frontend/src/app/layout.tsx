import './globals.css';

export const metadata = {
  title: 'ProjectHub | Управление проектами',
  description: 'Платформа для управления проектами и задачами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      {/*сюда будут подгружаться все наши страницы*/}
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}