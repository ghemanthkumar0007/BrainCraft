import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../../database/firebase';
import useAuth from '../../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

function CreateForum() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const {profile, showAlert} = useAuth()
    let navigate = useNavigate();
    const submitFun = async() => {
        try {
            if(!name.trim() || !description.trim() || !tags.trim()){
                return showAlert("Fill All Fields")
            }else{
                await addDoc(collection(db, 'forum'), {
                    createdOn: serverTimestamp(),
                    byEmail: profile?.email,
                    byName: profile?.name,
                    name: name.trim(),
                    description: description?.trim(),
                    status: 'inReview',
                    members: 1,
                    tags: tags.toLowerCase()?.split(',') || []
                  }).then((e) => {
                      showAlert("Created Successfully ")
                      navigate('/myforum')
                  })
            }
        } catch (err) {
            console.log("CreateForum: ",err)
            showAlert("Unknown Error ", "danger")
        }
    }

  return (
    <div className='flex flex-col  items-center text-white'>
        <div className='p-4'>
          <h1 className='text-center text-3xl font-semibold'>
              Create New Forum
          </h1>
        </div>
        <div className='p-5 flex flex-col w-full sm:w-64 md:w-96 bg-primary  rounded items-center justify-center'>
            <div className=''>
                <p className='label-gpk req '>
                    Name
                </p>
            <input className='input-gpk ' placeholder='Enter Name...' onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            
            <div className=''>
                <p className='label-gpk req'>
                    Tags
                </p>
                <textarea className='input-gpk'
                        rows={1}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder={`Enter tags seperated by comma (,) `}
                        value= {tags}
                        >
                           
                    </textarea>
            </div>
            <div className='pb-2'>
                <p className='label-gpk req'>
                    Description
                </p>
                <textarea className='input-gpk'
                        rows={3}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Few words about this forum'
                        value={description}
                        >
                           
                    </textarea>
            </div>
            
            <button className='btn1-gpk' onClick={() => submitFun()}>
              Submit
            </button>
        </div>
    </div>
  )
}

export default CreateForum