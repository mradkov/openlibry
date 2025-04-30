import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { publicNavItems } from './navigationItems';

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center space-x-6 font-medium">
        {publicNavItems.map(({ title, slug }) => (
          <Link
            key={slug}
            href={slug}
            className={buttonVariants({ variant: 'link' })}
          >
            {title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
