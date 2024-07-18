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

interface BookTransaction {
    userName: string,
    bookName: string,
    bookImg: string,
    dueDate: string,
    issueDate: string,
    returnDate: string
}

interface BookContextType {
    checkBookStatus: (bookName: string) => Promise<{ status?: string, data?: Book[], message?: string }>;
    getAnalytics: () => Promise<{ status?: string, totalBooks?: number, totalUsers?: number, totalIssuedBooks?: number, totalTransactions?: number, message?: string }>;
    getAllBooks: () => Promise<{ status?: string, allBooks?: Book[], message?: string }>;
    addBooks: (bookImg: File, name?: string, author?: string, status?: string) => Promise<{ status?: string, message?: string }>;
    deleteBook: (bookId?: string) => Promise<{ status?: string, message?: string }>;
    getAllTransaction: () => Promise<{ status?: string, trans?: History[], message?: string }>;
    getBook: (bookId?: string) => Promise<{ status?: string, book?: Book[], message?: string }>;
    issueBook: (bookId?: string, userId?: string, dueDate?: Date) => Promise<{ status?: string, message?: string }>;
    getBookTrans: (bookId?: string) => Promise<{ status?: string, data?: BookTransaction[], message?: string }>;
    returnBook: (bookId?: string) => Promise<{ status?: string, message?: string }>;
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
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();

            const transactionsWithDetails = await Promise.all(data.data.map(async (transaction: any) => {
                const detailResponse = await fetch('http://localhost:8000/api/v1/admin/fetch-username-bookname', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId: transaction.userDetail,
                        bookId: transaction.bookDetail,
                    }),
                });

                if (!detailResponse.ok) {
                    throw new Error(`Failed to fetch details for user ID ${transaction.userDetail} and book ID ${transaction.bookDetail}`);
                }

                const detailData = await detailResponse.json();

                return {
                    ...transaction,
                    userName: detailData.data.userName, // Ensure this path matches the backend response structure
                    bookName: detailData.data.bookName, // Ensure this path matches the backend response structure
                };
            }));

            return { status: 'success', trans: transactionsWithDetails, message: data.message };
        } catch (error: any) {
            console.error('Error fetching transactions:', error);
            return { status: 'error', message: error.message };
        }
    }

    const getBook = async (bookId?: string): Promise<{ status?: string, book?: Book[], message?: string }> => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/get-book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success && result.data && result.data.bookDetails) {
                return {
                    status: 'success',
                    book: result.data.bookDetails,
                    message: result.message || 'Book fetched successfully',
                };
            } else {
                throw new Error('Failed to fetch book details');
            }
        } catch (error: any) {
            console.error('Error fetching book status:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    };

    const issueBook = async (bookId?: string, userId?: string, dueDate?: Date): Promise<{ status?: string, message?: string }> => {
        const token = localStorage.getItem('token');

        console.log(bookId, userId, dueDate);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/issue-book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId,
                    userId,
                    status: "issued",
                    dueDate
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success && result.data && result.data.bookDetails) {
                return {
                    status: 'success',
                    message: result.message || 'Book issued successfully',
                };
            } else {
                throw new Error(result.message || 'Failed to issue book');
            }
        } catch (error: any) {
            console.error('Error issuing book:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    };

    const getBookTrans = async (bookId?: string): Promise<{ status?: string, data?: BookTransaction[], message?: string }> => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/get-transaction-book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success && result.data) {
                return {
                    status: 'success',
                    data: result.data,
                    message: result.message || 'Book issued successfully',
                };
            } else {
                throw new Error(result.message || 'Failed to issue book');
            }
        } catch (error: any) {
            console.error('Error issuing book:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    }

    const returnBook = async (bookId?: string): Promise<{ status?: string, message?: string }> => {
        const token = localStorage.getItem('token');

        // console.log(bookId);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/return-book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId,
                    status: "issued"
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                return {
                    status: 'success',
                    message: result.message || 'Book returned successfully',
                };
            } else {
                throw new Error(result.message || 'Failed to issue book');
            }
        } catch (error: any) {
            console.error('Error issuing book:', error);
            return {
                status: 'error',
                message: error.message || 'Unknown error',
            };
        }
    };

    return (
        <BookContext.Provider value={{ checkBookStatus, getAnalytics, getAllBooks, addBooks, deleteBook, getAllTransaction, getBook, issueBook, getBookTrans, returnBook }}>
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
