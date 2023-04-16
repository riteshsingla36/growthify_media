import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from 'components/Header';

import "primereact/resources/themes/vela-green/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";    
import "primeflex/primeflex.css";

import { useFavicon } from 'primereact/hooks';
export default function App({ Component, pageProps }) {
  useFavicon("https://growthifymedia.com/wp-content/uploads/2022/03/growthify-logo.png")
  return (
    <>
      <Header/>
      <Component {...pageProps} />
    </>
  );
}
