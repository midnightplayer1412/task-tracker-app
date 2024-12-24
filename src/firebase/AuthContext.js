"use client"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "./firebase-config";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(currentUser){
        setUser(currentUser)
      }else{
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = async() => {
    try{
      await signOut(auth)
      setUser(null)
      setLoading(false)
    }catch(error){
      console.error('Error logging out: ', error)
    }
  }

  return(
    <AuthContext.Provider value={{user, loading, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}