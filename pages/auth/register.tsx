import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getCsrfToken } from 'next-auth/react';

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
import { BookHeart, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function Register({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEMail] = useState('');
  const [passwordValidate, setPasswordValidate] = useState('');

  const [passwordInPutError, setPasswordInputError] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  useEffect(() => {
    if (!user || !email || !password || !passwordValidate) {
      setSubmitEnabled(false);
      return;
    }
    setSubmitEnabled(true);
  }, [user, email, password, passwordValidate]);

  const router = useRouter();

  async function handleSubmit() {
    setPasswordInputError(false);
    if (password != passwordValidate || password.length < 3) {
      setPasswordInputError(true);
      return;
    }
    const userData = {
      user: user,
      password: password,
      email: email,
      role: 'admin',
      active: true,
    };
    fetch('/api/login/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then((res) => {
      if (!res.ok) {
        console.log('ERROR while creating user', res.statusText);
      }
      console.log('Created user', userData.user);

      router.push('/');
    });
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
                  <CardTitle className="text-2xl">Регистрация</CardTitle>
                  <CardDescription>Създаване на нов потребител</CardDescription>
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
                      <Label htmlFor="email">Имейл</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        onChange={(e) => setEMail(e.target.value)}
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
                    <div className="grid gap-2">
                      <Label htmlFor="repassword">Повтори Парола</Label>

                      <Input
                        id="repassword"
                        type="password"
                        required
                        onChange={(e) => setPasswordValidate(e.target.value)}
                      />
                    </div>
                    {passwordInPutError && (
                      <p className="text-red-500 text-sm">
                        Паролата трябва да е поне 3 символа и да е една и съща в
                        двете полета
                      </p>
                    )}
                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      disabled={!submitEnabled}
                    >
                      <UserPlus className="size-5" />
                      Създаване
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
