import React, { createContext, useContext, ReactNode } from 'react';

interface LogContextType {
    login: (username: string, password: string) => Promise<{ status?: string, auth: string, message?: string }>;
    logout: () => void;

}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const login = async (username: string, password: string): Promise<{ status?: string, auth: string, message?: string }> => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { status: 'error', auth: '', message: errorData.message || 'Login failed' };
            }

            const data = await response.json();
            const token = data.data.accessToken;

            // Set token in localStorage with expiration time of 1 day
            const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiration', expirationTime.toString());

            return { status: 'success', auth: token, message: data.message || 'Login successful' };

        } catch (error) {
            return { status: 'error', auth: '', message: 'An unexpected error occurred' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
    };

    return (
        <LogContext.Provider value={{ login, logout }}>
            {children}
        </LogContext.Provider>
    );
};

export const useLog = (): LogContextType => {
    const context = useContext(LogContext);
    if (context === undefined) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;
};

// Helper function to get token from localStorage and check its validity
export const getToken = (): string | null => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('tokenExpiration');

    if (token && expirationTime) {
        const now = new Date().getTime();
        if (now < parseInt(expirationTime)) {
            return token;
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
        }
    }

    return null;
};
