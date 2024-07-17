import React, { createContext, useContext, ReactNode } from 'react';

interface User {
    _id: string,
    username: string,
    name: string,
    email: string,
    contact: string,
    createdAt: Date
}

interface UserContextType {
    getAllUsers: () => Promise<{ status?: string, data?: User[], message?: string }>;
    // login: (username, password) => Promise<{ status?: string, message?: string }>;
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
    }

    return (
        <UserContext.Provider value={{ getAllUsers }}>
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
