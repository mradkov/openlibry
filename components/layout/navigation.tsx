import { BookHeart } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm px-4">
      <div className="flex h-16 items-center justify-between space-x-4">
        <Link href="/" className={buttonVariants({ variant: 'link' })}>
          <BookHeart className="size-7" />
        </Link>
        <div className="flex flex-1 items-center space-x-2 sm:space-x-4 justify-end md:justify-start">
          <MainNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
