import { ReactNode, useState } from 'react';
import AuthContext from './AuthContext';


type AuthProviderProps = {
    children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<any>(null);
    const name = "salis"

    return (
        <AuthContext.Provider value={{ auth, setAuth, name }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
