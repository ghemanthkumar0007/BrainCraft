import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/UseAuth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../database/firebase';

function StudyMaterialsDetails() {
    let { sid } = useParams();
    const { studyArr, setLoading} = useAuth()
    const [carr, setCarr] = useState(studyArr)
    const [posts, setPosts] = useState([])
    
    useEffect(() =>{
        setCarr(studyArr)
    },[studyArr])

    useEffect(() => onSnapshot(query(collection(db, 'study', sid, "posts" )), 
      (snapshot) => {
        setLoading(true)
        let tarr = []
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setPosts(tarr)
        setLoading(false)
      }), [db, sid])

  return (
    <div>
        <div className='text-white py-4'>
        <h1 className='text-center text-3xl font-semibold'>
            Study Materials 
        </h1>
        </div>
        <div className='flex flex-col gap-4'>
            {posts?.map((item, idx) => {
                return (
                    <a href={item?.link} target='_blank' className='p-4 flex flex-col bg-primary text-white' key={idx}>
                        <h1 className='text-base font-medium hover:underline '>{item?.name}</h1>
                        <span className='opacity-50' >{item?.link}</span>
                    </a>
                )
            })}
        </div>
   </div>
  )
}

export default StudyMaterialsDetails