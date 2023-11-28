
import React from "react";

export type AuthContextType = {
    auth: any;
    setAuth: any;
    name: string;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export default AuthContext;
