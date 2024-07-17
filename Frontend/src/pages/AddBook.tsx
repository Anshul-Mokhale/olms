import React, { useState } from 'react';
import { useBook } from '../context/BookContext';
import { useNavigate } from 'react-router-dom';

function AddBook() {
    const { addBooks } = useBook();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
    const [bookImg, setBookImg] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const changeTextColor = () => {
        setIsOptionSelected(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBookImg(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        if (!bookImg) {
            setMessage('Please select a book image.');
            return;
        }

        const response = await addBooks(bookImg, name, author, status);
        setLoading(false);
        if (response.status == 'success') {
            // console.log(response);
            localStorage.setItem('stat', "success");
            navigate('/storage');
        }
        setMessage(response.message || 'Something went wrong.');
    };

    return (
        <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Add Books
                </h2>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <form onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-3 block text-black dark:text-white">
                                Attach file
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Book Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Author
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Author Name"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="flex flex-col gap-5.5 mb-4.5">
                            <label className="block text-black dark:text-white">
                                Select Status
                            </label>

                            <div className="relative z-20 bg-white dark:bg-form-input">
                                <select
                                    value={selectedOption}
                                    onChange={(e) => {
                                        setSelectedOption(e.target.value);
                                        setStatus(e.target.value);
                                        changeTextColor();
                                    }}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
                                        }`}
                                >
                                    <option value="" disabled className="text-body dark:text-bodydark">
                                        Select Status
                                    </option>
                                    <option value="available" className="text-body dark:text-bodydark">
                                        available
                                    </option>
                                    <option value="notavailable" className="text-body dark:text-bodydark">
                                        notavailable
                                    </option>
                                </select>
                            </div>
                        </div>

                        <input
                            type="submit"
                            value={loading ? "Please wait..." : "Create Account"}
                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        />

                        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBook;
