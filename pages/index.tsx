import Layout from '@/components/layout/Layout';
import { publicNavItems } from '@/components/layout/navigationItems';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className="grid place-content-center grow">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">
          {publicNavItems.map(({ slug, title, subtitle }) => (
            <Link
              key={slug}
              href={slug}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'flex-col size-56'
              )}
            >
              <span className="text-lg">{title}</span>
              <span className="text-sm">{subtitle}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
