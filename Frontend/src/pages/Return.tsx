import { useParams, useNavigate } from "react-router-dom";
import { useBook } from "../context/BookContext"
import { useEffect, useState } from "react";


function Return() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getBookTrans, returnBook } = useBook();
    const [booktrans, setBooktrans] = useState([])
    const [error, setError] = useState('');
    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            if (id) {
                const response = await getBookTrans(id);
                setBooktrans(response.data);
                console.log(response)
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            setError('Failed to fetch book details');
        }
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            const val = await returnBook(id);
            if (val.status == 'success') {
                navigate('/');
            }
        }
        catch (error: any) {
            console.log(error);
            setError('Failed to return book');
        }
    }

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Issue Book
                </h2>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <form onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5 flex items-center justify-center">
                            {booktrans && <img src={booktrans.bookImg} alt="Book Image" />}
                        </div>
                        <div className="mb-4.5 flex items-start justify-start">
                            <label htmlFor="Book">Book Name: </label>
                            {booktrans && <h4 className='text-xl text-black dark:text-white'>{booktrans.bookName}</h4>}
                        </div>
                        <div className="mb-4.5 flex items-start justify-start">
                            <label htmlFor="Book">User Name: </label>
                            {booktrans && <h4 className='text-xl text-black dark:text-white'>{booktrans.userName}</h4>}
                        </div>
                        <div className="mb-4.5 flex items-start justify-start">
                            <label htmlFor="Book">Issue Date: </label>
                            {booktrans && (
                                <h4 className='text-xl text-black dark:text-white'>
                                    {new Date(booktrans.issueDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </h4>
                            )}
                        </div>
                        <div className="mb-4.5 flex items-start justify-start">
                            <label htmlFor="Book">Due Date: </label>
                            {booktrans && (
                                <h4 className='text-xl text-black dark:text-white'>
                                    {new Date(booktrans.dueDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </h4>
                            )}
                        </div>


                        <input
                            type="submit"
                            value="Return"
                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Return
