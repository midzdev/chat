import "../styles/globals.css";
import Head from "next/head";

export default function App({ Component }) {
  return (
    <>
      <Head>
        <title>MidzChat | MidzDev</title> 
      </Head>
      <Component />
    </>
  );
}
