import { useEffect, useState } from 'react';
import { useBook } from '../context/BookContext';
import { Link } from 'react-router-dom';

function Storage() {
    const [allbooks, setAllbooks] = useState([]);
    const [perPage, setPerPage] = useState(10); // Default number of entries per page
    const [searchTerm, setSearchTerm] = useState('');
    const [showmessage, setShowmessage] = useState(false);

    const { getAllBooks, deleteBook } = useBook();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllBooks();
                setAllbooks(data.allBooks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllBooks]);

    const handleDelete = async (bookId) => {
        const deleteResult = await deleteBook(bookId);

        if (deleteResult.status === 'success') {
            setAllbooks((prevBooks) => prevBooks.filter(book => book._id !== bookId));
        }
    }

    useEffect(() => {
        if (localStorage.getItem('stat') === 'success') {
            setShowmessage(true);
            localStorage.removeItem('stat');
            const timer = setTimeout(() => {
                setShowmessage(false);
            }, 2000); // Hide after 2 seconds

            return () => clearTimeout(timer); // Cleanup the timeout if component unmounts
        }
    }, []);

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value, 10)); // Convert value to integer
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredBooks = allbooks.filter((book) =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    All Books
                </h2>

                <nav>
                    <Link
                        to="/add-books"
                        className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add Books
                    </Link>
                </nav>
            </div>
            {showmessage && (
                <div className="flex mb-6 w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-2 py-4 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                    <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
                        <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                                fill="white"
                                stroke="white"
                            ></path>
                        </svg>
                    </div>
                    <div className="w-full">
                        <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
                            Successfully Added!
                        </h5>
                    </div>
                </div>
            )}
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
            <div className="rounded-sm border overflow-x-hidden w-full border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-4">
                <div className="flex flex-col">
                    <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
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
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium xsm:text-base">Action</h5>
                        </div>
                    </div>

                    {filteredBooks.slice(0, perPage).map((book, index) => (
                        <div
                            className={`grid grid-cols-5 ${index === perPage - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                                }`}
                            key={book._id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <div className="flex-shrink-0">
                                    <img
                                        src={book.bookImg}
                                        alt="Book"
                                        className="h-12 w-12 object-cover rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{book.name}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{book.author}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-meta-3">{book.status}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <div className="flex items-center space-x-3.5">
                                    <button className="hover:text-primary">
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.52186 17.4373 8.74686C17.5217 8.91561 17.5217 9.14061 17.4373 9.30936C17.3248 9.53436 14.5686 14.8219 8.99981 14.8219ZM2.31106 9.00001C3.07981 10.2625 5.52568 13.7188 8.99981 13.7188C12.474 13.7188 14.9198 10.2625 15.6886 9.00001C14.9206 7.73751 12.474 4.28126 8.99981 4.28126C5.52568 4.28126 3.07981 7.73751 2.31106 9.00001Z"
                                                fill=""
                                            />
                                            <path
                                                d="M9 11.5312C7.59375 11.5312 6.46875 10.4062 6.46875 9C6.46875 7.59375 7.59375 6.46875 9 6.46875C9.14062 6.46875 9.28125 6.60938 9.28125 6.75C9.28125 6.89062 9.14062 7.03125 9 7.03125C7.7875 7.03125 7.03125 7.7875 7.03125 9C7.03125 10.2125 7.7875 10.9688 9 10.9688C10.2125 10.9688 10.9688 10.2125 10.9688 9C10.9688 8.85938 11.1094 8.71875 11.25 8.71875C11.3906 8.71875 11.5312 8.85938 11.5312 9C11.5312 10.4062 10.4062 11.5312 9 11.5312Z"
                                                fill=""
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        className="hover:text-danger"
                                        onClick={() => handleDelete(book._id)}
                                    >
                                        <svg
                                            className="fill-current"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.5 4.5H13.5V3.75C13.5 3.33579 13.1642 3 12.75 3H5.25C4.83579 3 4.5 3.33579 4.5 3.75V4.5H1.5C1.08579 4.5 0.75 4.83579 0.75 5.25C0.75 5.66421 1.08579 6 1.5 6H2.25V14.25C2.25 15.7688 3.48125 17 5.25 17H12.75C14.2688 17 15.5 15.7688 15.5 14.25V6H16.5C16.9142 6 17.25 5.66421 17.25 5.25C17.25 4.83579 16.9142 4.5 16.5 4.5ZM5.25 4.5H12.75V5.25H5.25V4.5ZM13.5 14.25C13.5 14.8012 13.0512 15.25 12.5 15.25H5.5C4.94875 15.25 4.5 14.8012 4.5 14.25V6H13.5V14.25Z"
                                                fill=""
                                            />
                                            <path
                                                d="M6.75 7.5C6.75 7.08579 7.08579 6.75 7.5 6.75C7.91421 6.75 8.25 7.08579 8.25 7.5V12.75C8.25 13.1642 7.91421 13.5 7.5 13.5C7.08579 13.5 6.75 13.1642 6.75 12.75V7.5ZM10.5 7.5C10.5 7.08579 10.8358 6.75 11.25 6.75C11.6642 6.75 12 7.08579 12 7.5V12.75C12 13.1642 11.6642 13.5 11.25 13.5C10.8358 13.5 10.5 13.1642 10.5 12.75V7.5Z"
                                                fill=""
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Storage;
