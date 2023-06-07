import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/UseAuth'
import {LuExternalLink} from 'react-icons/lu'
function Courses() {
    const { coursesArr} = useAuth()
    const [carr, setCarr] = useState(coursesArr)
    
    useEffect(() =>{
        setCarr(coursesArr)
    },[coursesArr])
    // console.log("coursesArr: ", carr)
  return (
    <div>
         <div className='text-white py-4'>
            <h1 className='text-center text-3xl font-semibold'>
            Courses
            </h1>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 '>
            {carr.map((item, idx) => {
                return (
                    <div className='bg-primary text-white flex flex-col ' key={idx}>
                        
                        <div className='w-full '>
                            <img src={item?.photo} className='w-full h-[150px] object-cover ' alt={item?.name}/>
                        </div>
                        <div className='p-4 '>
                            <a href={item?.link}  target='_blank' className='hover:underline text-base font-semibold flex justify-between'>
                                {item?.name}
                                <span className='trans-gpk hover:scale-110'>
                                    <LuExternalLink size={18} />
                                </span>
                            </a>
                            <p className='line-clamp-3 text-sm font-normal opacity-50'>
                                {item?.des}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
        
    </div>
  )
}

export default Courses