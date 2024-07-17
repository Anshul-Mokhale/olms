import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';
import Stroage from './pages/Stroage';
import AddBook from './pages/AddBook';
import Users from './pages/Users';
import Transactions from './pages/Transactions';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route path='/signin' element={<SignIn />} />
      <Route
        path="/*"
        element={
          <DefaultLayout>
            <Routes>
              <Route
                index
                element={
                  <>
                    <PageTitle title="Dashboard | OLMS - Online Library Management System" />
                    <ECommerce />
                  </>
                }
              />
              <Route
                path="profile"
                element={
                  <>
                    <PageTitle title="Profile | OLMS - Online Library Management System" />
                    <Profile />
                  </>
                }
              />
              <Route
                path="storage"
                element={
                  <>
                    <PageTitle title="Storage | OLMS - Online Library Management System" />
                    <Stroage />
                  </>
                }
              />

              <Route
                path="add-books"
                element={
                  <>
                    <PageTitle title="Add Books | OLMS - Online Library Management System" />
                    <AddBook />
                  </>
                }
              />

              <Route
                path="users"
                element={
                  <>
                    <PageTitle title="All Users | OLMS - Online Library Management System" />
                    <Users />
                  </>
                }
              />

              <Route
                path="transactions"
                element={
                  <>
                    <PageTitle title="All Transactions | OLMS - Online Library Management System" />
                    <Transactions />
                  </>
                }
              />

            </Routes>
          </DefaultLayout>
        }
      />
    </Routes>
  );
}

export default App;
