// pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/theme';
import type { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
      <SpeedInsights />
    </ChakraProvider>
  );
}

export default MyApp;