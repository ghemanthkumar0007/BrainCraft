import React, { useEffect, useState } from 'react'
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

function Profile() {
  const { setLoading, profile} = useAuth()
  let navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null)
  const [details, setDetails] = useState(profile)
  const { showAlert} = useAuth()

  useEffect(() => {
    setDetails(profile)
  }, [profile])

  function validateEmail(email) {
    var re = /^\S+@\S+\.\S+/;
    return re.test(email);
  }
  const submitBtn = async() => {
    setLoading(true)
    if(details.photo === ""){
      showAlert("Upload Photo")
    }else if(details.name === "" || details.bio === "" || details.gender === "" ){
      showAlert("Fill all fields")
    }
    else{
      try{
              const updateProfile = async(purl) => {
                  await setDoc(doc(db, 'users', details.email.toLowerCase()), {
                    photo: purl === 'no'? details.photo : purl,
                    name: details.name,
                    pno: details.pno,
                    gender: details.gender,
                    bio: details.bio,
                  }, {merge: true}).then(res => {                    
                    showAlert("Updated Successfully", "success")
                    navigate('/profile')
                  })
              }
              if(selectedFile){
                const usr = auth.currentUser
                const fileExtension = selectedFile.name.split('.').pop() //details.photo.split('.').pop();
                const storage = getStorage();
                let fileName = `${usr.uid}_1.${fileExtension}`
                const storageRef = ref(storage, `photos/${usr.uid}/${fileName}`);
                const response = await fetch(details.photo);
                const blob = await response.blob();
                const tcms = await uploadBytes(storageRef, blob).then((snapshot) => {
                  console.log('Uploaded file!');
                  getDownloadURL(storageRef).then((res) => {
                    console.log("PhotoUrl: ", res)
                    updateProfile(res)
                  })
                })
              }else{
                updateProfile("no")
              }
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
      console.log("ProfilePhoto: ", u)
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
 

  // console.log(details)
  return (
    <div className='relative min-h-screen w-full  flex flex-col text-white'>
      <div className=' flex-grow w-full flex items-center justify-center'>
          <div className='p-5 h-full w-full flex flex-col items-center justify-center'>
            <div className='p-5 pb-8 text-3xl font-semibold '>
              Profile
            </div>
            <div className='w-full  grid grid-cols-1 md:w-fit md:grid-cols-2 gap-4 items-center place-items-center place-content-center'>
            {/* flex flex-col items-center */}
                <div className={`md:col-span-2 my-2 rounded flex justify-center transition ease-in-out duration-300 hover:-translate-y-2 hover:scale-105`} >
                  <input type="file"accept="image/*"  name="file" id="upload" className="hidden" onChange={changeHandler} />
                  <label htmlFor="upload" className='cursor-pointer bg-secondary/75 p-1 rounded-full'>
                  {details?.photo !== ""? (<img src={ details?.photo} className="w-32 h-32 object-cover rounded-full "/> ) : (
                    <h3 className='p-2 text-white'>Upload Photo</h3>
                  )}
                  </label>
                </div>

                <div className='input-div-gpk'>
                  <h3 className='label-gpk req'>Name</h3>
                  <input type="text" value={details?.name} className='input1-gpk' placeholder='Enter Name' onChange={(e) => changeD('name', e.target.value)}/>
                </div>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk req'>Email</h3>
                  <input disabled type="text" value={details?.email} className='input1-gpk' placeholder='Enter Email' onChange={(e) => changeD('email', e.target.value)}/>
                </div>
                <div className='input-div-gpk'>
                  <h3 className='label-gpk req'>Phone Number </h3>
                  <textarea type="number" maxLength={10} rows={1}  value={details?.pno} className='input1-gpk' placeholder='Enter Phone Number' onChange={(e) => changeD('pno', e.target.value)}></textarea>
                </div>
                <div className='w-64 md:w-80 py-2  '>
                  <h3 className='label-gpk req'>Gender</h3>
                  <div className=''>
                    <button onClick={()=> changeD('gender', 'Male')} className={`${details?.gender!== 'Male'? "tab-opt-gpk ": "tab-opt-active-gpk" }`}>Male</button>
                    <button onClick={()=> changeD('gender', 'Female')} className={`${details?.gender!== 'Female'? "tab-opt-gpk ": "tab-opt-active-gpk" }`}>Female</button>
                  </div>
                </div>
                <div className='md:col-span-2  input-div-gpk w-full'>
                  <h3 className='label-gpk req'>Bio</h3>
                  <textarea value={details?.bio} rows={5} className={'w-full p-2 bg-primary rounded border '} placeholder='Enter Bio' onChange={(e) => changeD('bio', e.target.value)}>
                    
                  </textarea>
                </div>
                <div className='md:col-span-2'>
                  <button className='btn2-gpk' onClick={() => submitBtn()}>
                    Update
                  </button>
                </div>
            </div>
          </div>
      </div>
      <div className='p-5 text-center'>
        <p>{new Date().getFullYear()} {data.title}. All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Profile