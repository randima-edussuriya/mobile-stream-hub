import { createContext, useEffect, useState } from "react";
import axios from 'axios'

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null)

    const login = async formData => {
        const res = await axios.post('http://localhost:5000/api/auth/admin/login', formData)
        if (res.data.success) {
            setCurrentUser(res.data.data)
        }
        return res;
    }

    const logout = async () => {
        await axios.post('http://localhost:5000/api/auth/admin/logout')
        setCurrentUser(null);
    }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
