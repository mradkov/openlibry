import Layout from '@/components/layout/Layout';
import { TriangleAlert } from 'lucide-react';
import { Inter } from 'next/font/google';

import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-2 grow">
        <TriangleAlert className="size-8" />
        <p className="font-semibold">Страницата не може да бъде намерена</p>
      </div>
    </Layout>
  );
}
