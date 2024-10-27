import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
          <meta charSet="UTF-8" />
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <title>FOM-App</title>
          <meta name="description" content="The official Next.js App for Managing Freelance Orders built with the Pages Router." />
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