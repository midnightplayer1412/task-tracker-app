"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginComponent from "./login"
import RegisterComponent from "./register"
import { useAuth } from "@/firebase/AuthContext"
import { CircularProgress } from "@mui/material"

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

  const {user, loading} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!loading && user){
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const [isRegister, setRegister] = useState(false)
  const [isLogin, setLogin] = useState(false)

  const handleAuthSuccess = () => {
    router.push('/dashboard')
  }
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
    {loading ? (<div className="main-context h-full w-full flex items-center justify-center"><CircularProgress/></div>) : !user ? (
    <div className="main-context h-full w-full flex items-center justify-center">
      <div className="main-content h-5/6 w-3/4 flex gap-4 item-center justify-center">
        <div className="landing-img rounded-3xl h-full w-1/2 relative">
          <div className="text-4xl font-bold absolute top-10 left-10">Achieva</div>
        </div>
        <div className="login-form rounded-3xl border h-full w-1/2 flex items-center justify-center p-4">
          <div className="login-form-details flex flex-col gap-4 w-3/4">
            {!isRegister && !isLogin && (<WelcomeComponent handleGetStartedClick={handleGetStartedClick} handleSigninClick={handleSigninClick}/>)}
            {isRegister && (<RegisterComponent switchToLogin={handleSigninClick} onSuccess={handleAuthSuccess}/>)}
            {isLogin && (<LoginComponent switchToRegister={handleGetStartedClick} onSuccess={handleAuthSuccess}/>)}
          </div>
        </div>
      </div>
    </div>
    ) : null}
    </>
  );
}
