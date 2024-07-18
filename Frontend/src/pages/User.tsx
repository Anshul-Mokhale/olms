import React, { useState, useEffect } from 'react';
import LogoIcon from '../images/logo/logo-icon.svg';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function User() {
    const name = localStorage.getItem('name');
    const { getUserTrans } = useUser();

    const id = localStorage.getItem('tokenId');
    const [allTransactions, setAllTransactions] = useState([]);
    const [perPage, setPerPage] = useState(10); // Default number of entries per page
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserTrans(id);
                setAllTransactions(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, getUserTrans]);

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value, 10)); // Convert value to integer
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTransactions = allTransactions.filter((transaction) =>
        transaction.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className='bg-slate-50 shadow-default dark:border-strokedark dark:bg-boxdark h-screen max-h-full w-full'>
            <nav className='flex items-center justify-between px-8 py-4 bg-white dark:bg-boxdark'>
                <div className='flex gap-2 items-center justify-center'>
                    <img src={LogoIcon} alt="Logo" />
                    <h1>OLMS</h1>
                </div>
                <div className="flex">
                    <Link
                        to="/user/profile"
                        className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        {name}
                    </Link>
                </div>
            </nav>

            <div className="home2 px-8">
                <div>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                            All Transactions
                        </h2>
                        <nav></nav>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <label htmlFor="entriesPerPage" className="font-medium">
                            Show entries:
                        </label>
                        <select
                            id="entriesPerPage"
                            className="border px-2 py-1 bg-transparent"
                            value={perPage}
                            onChange={handlePerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="border px-2 py-1 bg-transparent"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="rounded-sm border overflow-x-auto w-full border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-4">
                        <div className="flex flex-col">
                            <div className="min-w-full grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
                                <div className="p-2.5 xl:p-5">
                                    <h5 className="text-sm font-medium xsm:text-base">User Name</h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium xsm:text-base">Book Name</h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium xsm:text-base">Status</h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium xsm:text-base">Due Date</h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium xsm:text-base">Issue Date</h5>
                                </div>
                                <div className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium xsm:text-base">Return Date</h5>
                                </div>
                            </div>

                            {filteredTransactions.slice(0, perPage).map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className="min-w-full grid grid-cols-6 border-b border-stroke dark:border-strokedark"
                                >
                                    <div className="flex items-start justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{transaction.userName}</p>
                                    </div>
                                    <div className="flex items-start justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{transaction.bookName}</p>
                                    </div>
                                    <div className="flex items-start justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{transaction.status}</p>
                                    </div>
                                    <div className="flex items-start justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{formatDate(transaction.dueDate)}</p>
                                    </div>
                                    <div className="flex items-start justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{formatDate(transaction.issueDate)}</p>
                                    </div>
                                    <div className="flex items-start justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{transaction.returnDate ? formatDate(transaction.returnDate) : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;
