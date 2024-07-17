import React, { useState, FormEvent, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import { useBook } from '../../context/BookContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faBookBookmark, faRectangleList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const ECommerce: React.FC = () => {


  const navigate = useNavigate();
  const { checkBookStatus, getAnalytics } = useBook();
  const [bookName, setBookName] = useState('');
  const [error, setError] = useState('');
  const [brandData, setBrandData] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<{
    totalBooks?: number;
    totalUsers?: number;
    totalIssuedBooks?: number;
    totalTransactions?: number;
    message?: string;
  }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/signin'); // Redirect to sign-in page if no token is found
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await checkBookStatus(bookName);
      if (response.status === 'success') {
        setBrandData(response.data); // Update brandData state with fetched data
        setShowResult(true);
      } else {
        setError(response.message || 'Unknown error');
      }
    } catch (error: any) {
      setError('An unexpected error occurred');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const analyticsResponse = await getAnalytics();
      if (analyticsResponse.status === 'success') {
        setAnalyticsData({
          totalBooks: analyticsResponse.totalBooks,
          totalUsers: analyticsResponse.totalUsers,
          totalIssuedBooks: analyticsResponse.totalIssuedBooks,
          totalTransactions: analyticsResponse.totalTransactions,
          message: analyticsResponse.message,
        });
      } else {
        setError(analyticsResponse.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  useEffect(() => {
    // Fetch analytics data when component mounts
    fetchAnalytics();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Users" total={analyticsData.totalUsers || 0} rate="">
          <FontAwesomeIcon icon={faUser} />
        </CardDataStats>
        <CardDataStats title="Total Books" total={analyticsData.totalBooks || 0} rate="">
          <FontAwesomeIcon icon={faBook} />
        </CardDataStats>
        <CardDataStats title="Issued Books" total={analyticsData.totalIssuedBooks || 0} rate="">
          <FontAwesomeIcon icon={faBookBookmark} />
        </CardDataStats>
        <CardDataStats title="Total Transaction" total={analyticsData.totalTransactions || 0} rate="">
          <FontAwesomeIcon icon={faRectangleList} />
        </CardDataStats>
      </div>

      <div className="mt-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Check Book Status
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Book Name
              </label>
              <input
                type="text"
                placeholder="Enter Book Name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            {/* {error && (
              <p className="text-red-500 dark:text-red-600">Error: not found</p>
            )} */}

            <button className="mt-4 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Check
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {showResult && (
        <div className="rounded-sm border overflow-x-hidden w-full border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-4 ">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Result
          </h4>
          <div className="flex flex-col">
            <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium xsm:text-base">Image</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium xsm:text-base">Name</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium xsm:text-base">Author</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium xsm:text-base">Status</h5>
              </div>
            </div>

            {brandData.map((brand, key) => (
              <div
                className={`grid grid-cols-4  ${key ===
                  brandData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                  }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img
                      src={brand.bookImg}
                      alt="Book"
                      className="h-12 w-12 object-cover rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{brand.name}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{brand.author}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{brand.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </>
  );
};

export default ECommerce;
