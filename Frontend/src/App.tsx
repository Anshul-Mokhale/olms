import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import Stroage from './pages/Stroage';
import AddBook from './pages/AddBook';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import RegisterUser from './pages/RegisterUser';
import Issue from './pages/Issue';
import Return from './pages/Return';
import User from './pages/User';
import UserSigin from './pages/Authentication/UserSigin';
import UserProfile from './pages/UserProfile';

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
      <Route path='/user/signin' element={<UserSigin />} />
      <Route path='/user/dashboard' element={<User />} />
      <Route path='/user/profile' element={<UserProfile />} />
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
                path="create-user"
                element={
                  <>
                    <PageTitle title="Register User | OLMS - Online Library Management System" />
                    <RegisterUser />
                  </>
                }
              />
              <Route
                path="issue-book/:id"
                element={
                  <>
                    <PageTitle title="Issue Book | OLMS - Online Library Management System" />
                    <Issue />
                  </>
                }
              />
              <Route
                path="return-book/:id"
                element={
                  <>
                    <PageTitle title="Return Book | OLMS - Online Library Management System" />
                    <Return />
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
