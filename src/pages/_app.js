import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from 'components/Header';

import "primereact/resources/themes/vela-green/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";    
import "primeflex/primeflex.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header/>
      <Component {...pageProps} />
    </>
  );
}
