import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import AppRouter from './routes';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App
