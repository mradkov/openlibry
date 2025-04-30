import { Toaster } from '../ui/sonner';
import { Footer } from './footer';
import { Navigation } from './navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col container mx-auto">
      <Navigation />
      <main className="grow p-7 flex flex-col">{children}</main>
      <Footer />
      <Toaster closeButton richColors />
    </div>
  );
}
