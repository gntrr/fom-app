// pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/theme';
import type { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Favicon from "../pages/favicon.ico"
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" href={Favicon.src} sizes="16x16" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FOM-App</title>
        <meta name="description" content="The official Next.js App for Managing Freelance Orders built with the Pages Router." />
        </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
        <SpeedInsights />
      </ChakraProvider>
    </>
  );
}

export default MyApp;