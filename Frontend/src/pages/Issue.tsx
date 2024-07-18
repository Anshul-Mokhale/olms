import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useUser } from '../context/UserContext';
import { useBook } from '../context/BookContext';
import DatePickerOne from '../components/Forms/DatePicker/DatePickerOne';

function Issue() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { getAllUsers } = useUser();
    const { getBook, issueBook } = useBook();
    const [bookDeta, setBookDeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(null);

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
        console.log('Selected date:', selectedDate);
    };

    useEffect(() => {
        fetchUsers();
        fetchBookDetails();
    }, [id]); // Fetch users and book details whenever id changes

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            if (response && response.data) {
                setUsers(response.data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        }
    };

    const fetchBookDetails = async () => {
        try {
            if (id) {
                setLoading(true);
                const response = await getBook(id);
                setBookDeta(response.book);
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            setError('Failed to fetch book details');
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const bookId = id;
        const selectedDate = date ? date.toISOString().split('T')[0] : null; // Convert date to ISO 8601 format and extract date part

        try {
            const response = await issueBook(bookId, selectedUser, selectedDate);
            if (response.message === 'Book issued successfully') {
                navigate('/');

            } else {
                console.log('Error issuing book:', response.message);
                setError(response.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error issuing book:', error);
            setError('Failed to issue book.');
        } finally {
            setLoading(false);
        }
    };

    const filteredOptions = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(user => ({
        value: user._id,
        label: user.name
    }));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                            {bookDeta && <img src={bookDeta.bookImg} alt="Book Image" />}
                        </div>
                        <div className="mb-4.5 flex items-center justify-center">
                            {bookDeta && <h4 className='text-xl text-black dark:text-white'>{bookDeta.name}</h4>}
                        </div>
                        <div className="mb-4.5">
                            <label className="mb-3 block text-black dark:text-white">
                                Select User
                            </label>
                            <Select
                                value={filteredOptions.find(option => option.value === selectedUser)}
                                onChange={handleUserChange}
                                options={filteredOptions}
                                onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                placeholder="Search or select a user..."
                                className="react-select-container bg-transparent"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div className="mb-4.5">
                            <DatePickerOne onDateChange={handleDateChange} />
                        </div>
                        <input
                            type="submit"
                            value="Issue Book"
                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
}

export default Issue;
