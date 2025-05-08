import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookHeart, LogIn } from 'lucide-react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getCsrfToken } from 'next-auth/react';

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    const res = await signIn('credentials', {
      user,
      password,
      hiddenFieldName: csrfToken,
      callbackUrl: '/',
      redirect: true,
    });

    if (res?.ok) {
      return;
    } else {
      console.log('Failed', res);
    }
    return res;
  }

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
                  <CardTitle className="text-2xl">Вписване</CardTitle>
                  <CardDescription>
                    Влизане в системата за управление
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Потребителско име</Label>
                      <Input
                        id="name"
                        placeholder="Име Фамилия"
                        required
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Парола</Label>

                      <Input
                        id="password"
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleSubmit} className="w-full">
                      <LogIn className="size-5" />
                      Вписване
                    </Button>
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
