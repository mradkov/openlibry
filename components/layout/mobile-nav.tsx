'use client';

import { SidebarOpen } from 'lucide-react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { publicNavItems } from './navigationItems';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <SidebarOpen className="size-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="text-primary">
        <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
        <ScrollArea className="h-[calc(100vh-8rem)] py-10 px-4">
          <div className="flex flex-col space-y-3 items-end">
            {publicNavItems.map(({ title, slug }) => (
              <MobileLink
                key={slug}
                href={slug}
                onOpenChange={setOpen}
                className={buttonVariants({ variant: 'link' })}
              >
                {title}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
