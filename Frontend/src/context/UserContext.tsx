import React, { createContext, useContext, ReactNode } from 'react';

interface User {
    _id: string,
    username: string,
    name: string,
    email: string,
    contact: string,
    createdAt: Date
}

interface UserTrans {
    userName: string,
    bookName: string,
    status: string,
    dueDate: string,
    issueDate: string,
    returnDate: string
}

interface UserContextType {
    getAllUsers: () => Promise<{ status?: string, data?: User[], message?: string }>;
    deleteUser: (userId: string) => Promise<{ status?: string, message?: string }>;
    // login: (username, password) => Promise<{ status?: string, message?: string }>;
    createUser: (username?: string, name?: string, email?: string, password?: string, contact?: string) => Promise<{ status?: string, data?: User[], message?: string }>;
    getUserTrans: (userId: string) => Promise<{ status?: string, data?: UserTrans[], message?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const getAllUsers = async (): Promise<{ status?: string, data?: User[], message?: string }> => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/fetch-all-users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete Book');
            }

            const data = await response.json();
            return { status: 'success', data: data.data, message: data.message };
        } catch (error: any) {
            console.error('Error adding book:', error);
            return { status: 'error', message: error.message };
        }
    };

    const deleteUser = async (userId?: string): Promise<{ status?: string, message?: string }> => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/delete-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId })
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

    const createUser = async (username?: string, name?: string, email?: string, password?: string, contact?: string): Promise<{ status?: string, data?: User[], message?: string }> => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/register-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    name: name,
                    email: email,
                    password: password,
                    contact: contact
                })
            });
            if (!response.ok) {
                throw new Error('Failed to delete Book');
            }

            const data = await response.json();
            return { status: 'success', data: data.data, message: data.message };
        } catch (error: any) {
            console.error('Error adding book:', error);
            return { status: 'error', message: error.message };
        }
    }

    const getUserTrans = async (userId: string): Promise<{ status?: string, data?: UserTrans[], message?: string }> => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/user/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userDetail: userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();

            // Map the API response to the UserTrans interface
            const userTransData: UserTrans[] = data.data.map((transaction: any) => ({
                userName: transaction.userName, // Assuming userDetail contains the user name
                bookName: transaction.bookName, // Assuming bookDetail contains the book name
                status: transaction.status,
                dueDate: transaction.dueDate,
                issueDate: transaction.issueDate,
                returnDate: transaction.returnDate
            }));

            return { status: 'success', data: userTransData, message: data.message };
        } catch (error: any) {
            console.error('Error fetching transactions:', error);
            return { status: 'error', message: error.message };
        }
    }

    return (
        <UserContext.Provider value={{ getAllUsers, deleteUser, createUser, getUserTrans }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useBook must be used within a BookProvider');
    }
    return context;
};
