import React, { createContext, useContext, ReactNode } from 'react';

// Define the data structure for Data
interface Book {
    _id: string;
    bookImg: string;
    name: string;
    author: string;
    status: string;
}

interface History {
    _id: string,
    user: string,
    bookname: string,
    status: string,
    dueDate: Date
}

interface BookContextType {
    checkBookStatus: (bookName: string) => Promise<{ status?: string, data?: Book[], message?: string }>;
    getAnalytics: () => Promise<{ status?: string, totalBooks?: number, totalUsers?: number, totalIssuedBooks?: number, totalTransactions?: number, message?: string }>;
    getAllBooks: () => Promise<{ status?: string, allBooks?: Book[], message?: string }>;
    addBooks: (bookImg: File, name?: string, author?: string, status?: string) => Promise<{ status?: string, message?: string }>;
    deleteBook: (bookId?: string) => Promise<{ status?: string, message?: string }>;
    getAllTransaction: () => Promise<{ status?: string, trans?: History[], message?: string }>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const checkBookStatus = async (bookName: string): Promise<{ status?: string, data?: Book[], message?: string }> => {
        const token = localStorage.getItem('token');
        // console.log(token)

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/search-book?name=${bookName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse JSON response
            const result = await response.json();

            return {
                status: 'success',
                data: result.data,
                message: result.message || 'Books fetched successfully',
            };
        } catch (error: any) {
            console.error('Error fetching book status:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    };

    const getAnalytics = async (): Promise<{ status?: string, totalBooks?: number, totalUsers?: number, totalIssuedBooks?: number, totalTransactions?: number, message?: string }> => {
        const token = localStorage.getItem('token');
        // console.log(token)
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/fetch-data`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse JSON response
            const result = await response.json();

            return {
                status: 'success',
                totalBooks: result.data.totalBooks,
                totalUsers: result.data.totalUsers,
                totalIssuedBooks: result.data.totalIssuedBooks,
                totalTransactions: result.data.totalTransactions,
                message: result.message || 'Data fetched successfully',
            };
        } catch (error: any) {
            console.error('Error fetching book status:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    }

    const getAllBooks = async (): Promise<{ status?: string, allBooks?: Book[], message?: string }> => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/fetch-all-books`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check if response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse JSON response
            const result = await response.json();

            return {
                status: 'success',
                allBooks: result.data,
                message: result.message || 'Books fetched successfully',
            };
        } catch (error: any) {
            console.error('Error fetching book status:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    }

    const addBooks = async (
        bookImg: File,
        name?: string,
        author?: string,
        status?: string
    ): Promise<{ status?: string; message?: string }> => {
        const token = localStorage.getItem('token');
        try {
            const formData = new FormData();
            formData.append('bookImg', bookImg);
            if (name) formData.append('name', name);
            if (author) formData.append('author', author);
            if (status) formData.append('status', status);

            const response = await fetch('http://localhost:8000/api/v1/admin/add-book', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add book');
            }

            const data = await response.json();
            return { status: 'success', message: data.message };
        } catch (error: any) {
            console.error('Error adding book:', error);
            return { status: 'error', message: error.message };
        }
    };

    const deleteBook = async (bookId?: string): Promise<{ status?: string, message?: string }> => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/remove-book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookId })
            });
            if (!response.ok) {
                throw new Error('Failed to delete Book');
            }

            const data = await response.json();
            return { status: 'success', message: data.message };
        } catch (error: any) {
            console.error('Error adding book:', error);
            return { status: 'error', message: error.message };
        }
    }

    const getAllTransaction = async (): Promise<{ status?: string, trans?: History[], message?: string }> => {
        const token = localStorage.getItem('token');
        try {


            const response = await fetch('http://localhost:8000/api/v1/admin/fetch-all-transaction', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to add book');
            }

            const data = await response.json();

            const user = await fetch()

            return { status: 'success', message: data.message };
        } catch (error: any) {
            console.error('Error adding book:', error);
            return { status: 'error', message: error.message };
        }
    }
    return (
        <BookContext.Provider value={{ checkBookStatus, getAnalytics, getAllBooks, addBooks, deleteBook }}>
            {children}
        </BookContext.Provider>
    );
};

// Custom hook to use the BookContext
export const useBook = (): BookContextType => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBook must be used within a BookProvider');
    }
    return context;
};
