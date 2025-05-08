import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, BookHeart, Undo2 } from 'lucide-react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getCsrfToken } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Error({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 container mx-auto">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <BookHeart className="size-6" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <AlertTriangle className="mx-auto size-6" />
                  <CardTitle className="text-2xl">
                    Грешно име или парола
                  </CardTitle>
                  <CardDescription>
                    Въведете отново името и паролата и опитайте пак
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <Link
                      href="/"
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'w-full'
                      )}
                    >
                      <Undo2 className="size-5" />
                      Вписване
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/splashscreen.jpg"
          alt="splash"
          width={900}
          height={1300}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
