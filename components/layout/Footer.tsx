import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

export function Footer() {
  return (
    <footer className="flex items-center justify-center">
      <a
        href="https://openlibry.de"
        target="_blank"
        className={cn(buttonVariants({ variant: 'link' }), 'text-sm')}
      >
        Open Libry
      </a>
    </footer>
  );
}
