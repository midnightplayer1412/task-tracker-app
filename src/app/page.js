"use client"
import { useState } from "react"
import { TextField, Divider } from "@mui/material"
import { auth, db } from "@/firebase/firebase-config"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"

const LoginComponent = ({switchToRegister}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = async(e) => {
    e.preventDefault()
    try{
      setError('')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
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

  const handleGoogleSignIn = async() => {
    try{
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
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

const RegisterComponent = ({switchToLogin}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUserRegister = async(e) =>{
    e.preventDefault()
    try{
      console.warn(email, password)
      setError('')
      if(confirmpassword !== password){
        setError("Password do not match")
        return
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      try{
        setDoc(doc(db, "Users", userCredential.user.uid), {
          username: username,
          email: email
        })
        console.warn("Register DB successful")
      }catch(error){
        // setError("Error creating Firestore DB: ", error)
        console.error("Error creating Firestore DB: ", error)
      }

    }catch(error){
      if(error.code === 'auth/invalid-credential'){
        setError("Wrong email or password")
      }else if(error.code === 'auth/user-not-found'){
          setError("No user found with this email address")
      }else if(error.code === 'auth/invalid-email'){
          setError("Please enter a valid email address")
      }else{
          // setError("An error occurred. Please try again.")
          setError(error.message)
      }
    }
  }

  return(
    <>
    <form onSubmit={handleUserRegister} className="register-content-form flex flex-col gap-4 w-full">
      <div className="register-content-heading text-5xl font-bold">Sign Up</div>
      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>)}
      <div className="register-content-username">
        <TextField label="Username" variant="outlined" type="text" fullWidth name="username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div className="register-content-email">
        <TextField label="Email" variant="outlined" type="email" fullWidth name="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="register-content-password">
        <TextField label="Password" variant="outlined" type="password" fullWidth name="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="register-content-confirm-password">
        <TextField label="Confirm Password" variant="outlined" type="password" fullWidth name="confirm-password" required value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>
      <button type="submit" className="register-content-register text-lg text-center p-2 bg-amber-400 hover:bg-amber-300 rounded-lg font-bold cursor-pointer">Sign Up</button>
      <div className="register-content-divider text-lg text-slate-400">
        <Divider textAlign="center">or</Divider>
      </div>
      <button type="button" className="register-content-signin text-lg text-center p-2 bg-slate-200 rounded-lg font-bold cursor-pointer" onClick={switchToLogin}>Already have an account? Sign in</button>
    </form>
    </>
  )
}

const WelcomeComponent = ({handleGetStartedClick, handleSigninClick}) => {
  return(
    <>
    <div className="login-form-heading text-5xl font-bold">Productive Mind</div>
    <div className="login-from-desc text-lg text-justify">Helping you achieve your tasks and goals by keeping everything organized, clear, and actionable.</div>
    <div className="login-form-signup text-lg text-center p-2 bg-amber-400 hover:bg-amber-300 rounded-lg font-bold cursor-pointer" onClick={handleGetStartedClick}>Get Started</div>
    <div className="login-form-signin text-lg text-center p-2 hover:bg-slate-50 rounded-lg font-bold cursor-pointer" onClick={handleSigninClick}>Already have an account? Sign in</div>
    </>
  )
}

export default function Home() {

  const [isRegister, setRegister] = useState(false)
  const [isLogin, setLogin] = useState(false)

  const handleGetStartedClick = () =>{
    setLogin(false)
    setRegister(true)
  }
  const handleSigninClick = () => {
    setRegister(false)
    setLogin(true)
  }

  return (
    <>
    <div className="main-context h-full w-full flex items-center justify-center">
      <div className="main-content h-5/6 w-3/4 flex gap-4 item-center justify-center">
        <div className="landing-img rounded-3xl h-full w-1/2 relative">
          <div className="text-4xl font-bold absolute top-10 left-10">Achieva</div>
        </div>
        <div className="login-form rounded-3xl border h-full w-1/2 flex items-center justify-center p-4">
          <div className="login-form-details flex flex-col gap-4 w-3/4">
            {!isRegister && !isLogin && (<WelcomeComponent handleGetStartedClick={handleGetStartedClick} handleSigninClick={handleSigninClick}/>)}
            {isRegister && (<RegisterComponent switchToLogin={handleSigninClick} />)}
            {isLogin && (<LoginComponent switchToRegister={handleGetStartedClick}/>)}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
