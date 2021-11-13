import 'semantic-ui-css/semantic.min.css'
import '../styles/global.css'
import '../styles/sweater.css'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}