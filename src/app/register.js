import { useState } from "react"
import { TextField, Divider } from "@mui/material"
import { auth, db } from "@/firebase/firebase-config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"

const RegisterComponent = ({switchToLogin, onSuccess}) => {

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
        onSuccess()
        console.warn("Register DB successful")
      }catch(error){
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

export default RegisterComponent