import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { PositionList } from './views/positions';
import { TraderList } from './views/traders';
import { TraderDetail } from './views/traders/TraderDetail';
import { Leaderboard } from './views/leaderboard';
import { Live } from './views/live';
import { Footer } from './components/Footer';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queries';
import { utils } from 'ethers';

const Container = () => {
  return (
    <>
      <Header />
      <div className="relative z-2">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    children: [
      {
        path: '/',
        element: <Leaderboard />,
      },
      {
        path: '/live',
        element: <Live />,
      },
      {
        path: '/traders',
        element: <TraderList />,
      },
      {
        path: '/traders/:wallet',
        element: <TraderDetail />,
        loader: ({ params }) => {
          const { wallet } = params;
          if (!wallet) {
            return redirect('/');
          }
          if (!utils.isAddress(wallet.toLowerCase())) {
            return redirect('/traders');
          }
          return null;
        },
      },
      {
        path: '/positions',
        element: <PositionList />,
      },
      {
        path: '*',
        element: <Navigate to={'/'} replace />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
