import React, { useState } from 'react'
import data from '../../Constants/Data'
import login from '../../assets/img/login.png'
import { Link } from "react-router-dom";
import useAuth from '../../hooks/UseAuth';
import { useNavigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // console.log("Email: ", email)
  // console.log("Password: ", password)
  const {LoginFun, showAlert} = useAuth()

  function validateEmail(email) {
    var re = /^\S+@\S+\.\S+/;
    return re.test(email);
  }
  const submitBtn = () => {
    if(!validateEmail(email)){
      showAlert("Enter Valid Email Id")
    }else if(password.length < 8){
      showAlert("Password must be atleast 8 characters")
    }else{
      LoginFun(email, password)
    }
  }
  return (
    <div className='min-h-screen w-full  flex flex-col text-white'>
      <div className='p-2 bg-primary text-white'>
        <h1 className='text-3xl text-center font-semibold'>
          {data.title}
        </h1>
      </div>
      <div className='bg-secondary flex-grow w-full flex items-center justify-center'>
          <div className='hidden md:flex min-h-1/2 w-1/2 items-center justify-center'>
            <img className='h-3/4 w-3/4 ' src={login} />
          </div>
          <div className='p-5 h-full w-full md:w-1/2 flex flex-col items-center justify-center'>
            <div className='p-5 text-3xl font-semibold '>
              Login
            </div>
            <div className='w-full flex flex-col items-center '>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk'>Email</h3>
                  <input type="text" className='input-gpk' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk'>Password</h3>
                  <input type="password" className='input-gpk' placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className=''>
                  <button className='btnn-gpk  ' onClick={() => submitBtn()}>
                    Submit
                  </button>
                </div>
                <div className=''>
                  <p className='text-base font-normal'>
                    Don't have an account ?{" "}
                    <button className='underline font-medium' onClick={() => navigate('/register')}>
                    Sign Up Here
                    </button> 
                  </p>
                </div>
            </div>
          </div>
      </div>
      <div className='p-5 text-center bg-primary text-white'>
        <p>@{new Date().getFullYear()} {data.title}. All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Login