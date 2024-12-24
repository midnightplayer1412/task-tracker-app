"use client"
import { useState } from "react"
import { auth, db } from "@/firebase/firebase-config"
import { TextField, Divider } from "@mui/material"
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

const LoginComponent = ({switchToRegister, onSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = async(e) => {
    e.preventDefault()
    try{
      setError('')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login Successful")
      onSuccess()
    }catch(error){
      console.error('Error signing in: ', error)
      if(error.code === 'auth/invalid-credential'){
        setError("Wrong email or password")
      }else if(error.code === 'auth/user-not-found'){
        setError("No user found with this email address")
      }else if(error.code === 'auth/invalid-email'){
        setError("Please enter a valid email address")
      }else{
        setError("An error occurred. Please try again.")
      }
    }
  }
  
  const createUserRecord = async (uid, username, email) => {
    const userRef = doc(db, "Users", uid);
    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: username || "Unknown User",
          email: email
        });
        console.log("User record created in Firestore")
      } else {
        console.log("User already exists in Firestore")
      }
    } catch (error) {
      console.error('Error creating user record: ', error)
    }
  }


  const handleGoogleSignIn = async() => {
    try{
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log(result)
      const user = result.user
      console.warn(user.email, user.displayName)
      if(user){
        await createUserRecord(user.uid, user.displayName, user.email)
        console.log("Login Successful")
        onSuccess()
      }else{
        setError("No user information received")
      }
    }catch(error){
      setError(error.message)
      console.error('Error signing in with Google: ', error)
    }
  }


  return(
    <>
    <form onSubmit={handleEmailSignIn} className="login-content-form flex flex-col gap-4 w-full">
      <div className="login-content-heading text-5xl font-bold ">Sign In</div>
      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>)}
      <div className="login-content-email">
        <TextField label="Email" variant="outlined" type="email" fullWidth name="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="login-content-password">
        <TextField label="Password" variant="outlined" type="password" fullWidth name="password" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
      </div>
      <button type="submit" className="login-content-signin text-lg text-center p-2 bg-amber-400 hover:bg-amber-300 rounded-lg font-bold cursor-pointer">Sign In</button>
      <div className="login-content-divider text-lg text-slate-400"><Divider textAlign="center">or</Divider></div>
      <button type="button" className="login-content-google text-lg text-center p-2 bg-slate-200 rounded-lg font-bold cursor-pointer" onClick={handleGoogleSignIn}>Google</button>
      <button type="button" className="login-content-signup text-lg text-center p-2 rounded-lg font-bold cursor-pointer" onClick={switchToRegister}>Don't have an account? Sign up</button>
    </form>
    </>
  )
}

export default LoginComponent