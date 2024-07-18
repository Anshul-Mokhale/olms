import React, { FormEvent, useEffect, useState } from 'react'
import { useBook } from '../context/BookContext';
import { Link } from 'react-router-dom';
function Transactions() {

    const [allTransaction, setAllTransaction] = useState([]);
    const [perPage, setPerPage] = useState(10); // Default number of entries per page
    const [searchTerm, setSearchTerm] = useState('');
    const { getAllTransaction } = useBook();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllTransaction();
                setAllTransaction(data.trans);
                // console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllTransaction]);
    const handlePerPageChange = (e: any) => {
        setPerPage(parseInt(e.target.value, 10)); // Convert value to integer
    };

    const handleSearch = (e: any) => {
        setSearchTerm(e.target.value);
    };

    const filteredBooks = allTransaction.filter((transaction: any) =>
        transaction.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <div>
            <div>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        All Books
                    </h2>

                    <nav>

                    </nav>
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

                        {filteredBooks.slice(0, perPage).map((transaction, index) => (
                            <div
                                className={`min-w-full grid grid-cols-6 ${index === perPage - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                                    }`}
                                key={transaction._id}
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
    )
}

export default Transactions
