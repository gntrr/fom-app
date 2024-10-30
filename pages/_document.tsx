import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
          <meta charSet="UTF-8" />
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
          
          <meta property="og:site_name" content="FOM-App" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://fom-app.vercel.app" />
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}