import {React, createContext, useState} from 'react'

const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('access_token')
    )
    
  return (
    <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
        {children}
    </AuthContext.Provider>
  )
}

export {AuthContext};