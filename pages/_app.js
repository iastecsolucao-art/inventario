// pages/_app.js
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    // Cria o script dinamicamente
    const script = document.createElement("script");
    script.src = "http://chat.iastec.servicos.ws/packs/js/sdk.js";
    script.async = true;

    script.onload = () => {
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: "RTEom3jZD76y53TW21o51a86",
          baseUrl: "http://chat.iastec.servicos.ws",
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup quando o componente desmontar
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
