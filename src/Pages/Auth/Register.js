import React, { useState } from 'react'
import data from '../../Constants/Data'
import { Link } from "react-router-dom";
import useAuth from '../../hooks/UseAuth';
import { useNavigate } from "react-router-dom";
import user from '../../assets/img/user.png'
import { BiEdit, BiTrash,BiCheckCircle } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification } from "firebase/auth";
import {auth, db} from '../../database/firebase'
import { getDownloadURL, getMetadata, getStorage, ref, updateMetadata, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';

function Register() {
  const { setLoading } = useAuth()
  let navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState()
  const [showPass, setShowPass] = useState(false)


  const [details, setDetails] = useState({
    photo: "",
    name: "",
    email: "",
    pno: "",
    gender: "",
    password: "",
    passwordConfirmation: "",
    bio: ""
  })

  // console.log("Email: ", details.email)
  // console.log("Password: ", details.password)
  const {RegisterFun, showAlert} = useAuth()

  function validateEmail(email) {
    var re = /^\S+@gmail\.com$/;
    return re.test(email);
  }

  function validatePassword(password) {
    var re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    return re.test(password);
  }


  // console.log("Photot: ", selectedFile?.name.split('.').pop())
  const submitBtn = async() => {
    setLoading(true)
    if(details.photo === ""){
      showAlert("Upload Photo")
    }else if(!validateEmail(details.email)){
      showAlert("Enter a valid VIT Student Email Id")
    }else if(details.password.length < 8){
      showAlert("Password must be atleast 8 characters")
    }else if(details.pno.length < 10){
      showAlert("Enter Valid Phone Number")
    }else if(!validatePassword(details.password)){
      showAlert("Password must be at least 8 characters and include at least one uppercase letter, one number and one special character")
    }else if(details.name === "" || details.bio === "" || details.gender === ""){
      showAlert("Fill all fields")
    }else{
      // RegisterFun(details.email, details.password)
      try{
        await createUserWithEmailAndPassword(auth,details.email,details.password)
            .then( async(res) => {
              const usr = res.user
              const fileExtension = selectedFile.name.split('.').pop() //details.photo.split('.').pop();
              const storage = getStorage();
              let fileName = `${res.user.uid}_1.${fileExtension}`
              const storageRef = ref(storage, `photos/${res.user.uid}/${fileName}`);
              const response = await fetch(details.photo);
              const blob = await response.blob();
              await uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded file!');
                getDownloadURL(storageRef).then((res) => {
                  // setPhotoUrl(res)
                  console.log("PhotoUrl: ", res)
                  updateProfile(usr ,{
                    displayName: details.name, photoURL: res //, phoneNumber: pno
                  }).then(async() => {
                    console.log("Register Profile Updated")
                    await setDoc(doc(db, 'users', details.email.toLowerCase()), {
                      photo: res? res: details.photo ,
                      name: details.name,
                      email: details.email.toLowerCase(),
                      pno: details.pno,
                      gender: details.gender,
                      password: details.password,
                      bio: details.bio,
                      iam: 'user'
                    }).then(res => {
                      showAlert("Successfully created")
                      navigate('/')
                    })
                  }).catch( err => {
                    console.log("Register Profile Update error: ", err)
                })
                })
              })
            });

      }catch(err){
        console.log("RegisterErr:", err)
      }finally{
      }
    }
    setLoading(false)
  }
  const changeHandler = event => {
    if(event.target.files.length > 0){
      setSelectedFile(event.target.files[0]);
      // setIsSelected(true);
      let u = window.URL.createObjectURL(event.target.files[0])
      setDetails({
        ...details,
        "photo": u
      })
    }else{
      // setIsSelected(false)
    }
  };
  // console.log("selectedFile: ",selectedFile)
  const changeD = (name, text) => {
    setDetails({
      ...details,
      [name]: text
    })
  }
  

  return (
    <div className='relative min-h-screen text-white w-full  flex flex-col'>
      <div className='p-2 bg-primary '>
        <h1 className='text-3xl text-center font-semibold'>
          {data.title}
        </h1>
      </div>
      <div className='bg-secondary flex-grow w-full flex items-center justify-center'>
          <div className='p-5 h-full w-full flex flex-col items-center justify-center'>
            <div className='p-5 pb-8 text-3xl font-semibold '>
              Register
            </div>
            <div className='w-full  grid grid-cols-1 md:w-fit md:grid-cols-2 gap-4 items-center place-items-center place-content-center'>
            {/* flex flex-col items-center */}
                <div className={`md:col-span-2 my-2 rounded flex justify-center transition ease-in-out duration-300 hover:-translate-y-2 hover:scale-105`} >
                  <input type="file"accept="image/*"  name="file" id="upload" className="hidden" onChange={changeHandler} />
                  <label htmlFor="upload" className='cursor-pointer bg-secondary/75 p-1 rounded-full'>
                  {details.photo !== ""? (<img src={ details.photo} className="w-32 h-32 object-cover rounded-full "/> ) : (
                    <h3 className='p-2 text-white'>Upload Photo</h3>
                  )}
                  </label>
                </div>
              
                

                <div className='input-div-gpk'>
                  <h3 className='label-gpk req'>Name</h3>
                  <input type="text" value={details.Name} className='input-gpk' placeholder='Enter Name' onChange={(e) => changeD('name', e.target.value)}/>
                </div>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk req'>Email</h3>
                  <input type="text" value={details.email} className='input-gpk' placeholder='Enter Email' onChange={(e) => changeD('email', e.target.value)}/>
                </div>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk req'>Phone Number </h3>
                  <textarea type="number" maxLength={10} rows={1}  value={details.pno} className='input-gpk' placeholder='Enter Phone Number' onChange={(e) => changeD('pno', e.target.value)}></textarea>
                </div>
                <div className='w-64 md:w-80 py-2  '>
                  <h3 className='label-gpk req'>Gender</h3>
                  <div className=''>
                    <button onClick={()=> changeD('gender', 'Male')} className={`${details.gender!== 'Male'? "tab-opt-gpk ": "tab-opt-active-gpk" }`}>Male</button>
                    <button onClick={()=> changeD('gender', 'Female')} className={`${details.gender!== 'Female'? "tab-opt-gpk ": "tab-opt-active-gpk" }`}>Female</button>
                  </div>
                </div>
                <div className='input-div-gpk'>
                    <h3 className='label-gpk req flex '>Password 
                    <button onClick={() => setShowPass(!showPass)}>
                      {showPass ?<AiOutlineEyeInvisible size={25}/> : <AiOutlineEye size={25} /> }
                    </button>
                    </h3>
                  <input type={showPass? "text" :"password"} value={details.password} className='input-gpk' placeholder='Enter Password' onChange={(e) => changeD('password', e.target.value)}/>
                </div>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk flex req'>Confirm Password
                  <button onClick={() => setShowPass(!showPass)}>
                      {showPass ?<AiOutlineEyeInvisible size={25}/> : <AiOutlineEye size={25} /> }
                    </button>
                  </h3>
                  <input type={showPass? "text" :"password"} value={details.passwordConfirmation} className='input-gpk' placeholder='Enter Confirm Password' onChange={(e) => changeD('passwordConfirmation', e.target.value)}/>
                </div>
                
                <div className='md:col-span-2  input-div-gpk w-full'>
                  <h3 className='label-gpk req'>Bio</h3>
                  <textarea value={details.bio} rows={5} className={'w-full p-2 rounded border bg-secondary border-white/25'} placeholder='Enter Bio' onChange={(e) => changeD('bio', e.target.value)}>
                    
                  </textarea>
                </div>
                <div className='md:col-span-2'>
                  <button className='btnn-gpk ' onClick={() => submitBtn()}>
                    Submit
                  </button>
                </div>
                <div className='md:col-span-2'>
                  <p className='text-base text-center font-normal'>
                   Already have an account ?{" "}
                    <button className='underline font-medium' onClick={() => navigate('/login')}>
                    Login Here
                    </button> 
                  </p>
                </div>
            </div>
          </div>
      </div>
      {/* experience  */}
      {/* <div className='fixed top-1/2 left-0 right-0 mx-auto bg-white p-5 border shadow'>
        hello
      </div> */}
      <div className='p-5 text-center bg-primary text-white'>
        <p>@{new Date().getFullYear()} {data.title}. All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Register
