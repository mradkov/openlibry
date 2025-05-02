import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>OpenLibry Библиотека</title>
        <meta property="og:title" content="OpenLibry" key="OpenLibry" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
