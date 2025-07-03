import React from "react";
import "../styles/globals.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Made in India</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
