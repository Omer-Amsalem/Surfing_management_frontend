import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface AuthContextType {
	change: number;
    setChange: (change: number) => void;
}

// Create the context with a default value (will be overridden by the provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider props
interface AuthProviderProps {
	children: ReactNode;
}

// Create the provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [change, setChange] = useState<number>(0);

	return (
		<AuthContext.Provider
			value={{ change, setChange }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Create a custom hook for consuming the context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};