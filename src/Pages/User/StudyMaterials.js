import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/UseAuth'
import {LuExternalLink} from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
function StudyMaterials() {
    const { studyArr} = useAuth()
    const [carr, setCarr] = useState(studyArr)
    
    useEffect(() =>{
        setCarr(studyArr)
    },[studyArr])
    // console.log("studyArr: ", carr)
  return (
    <div>
         <div className='text-white py-4'>
            <h1 className='text-center text-3xl font-semibold'>
                Study Materials
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
                            <NavLink to={`${item?.id}`}  className='hover:underline text-base font-semibold flex justify-between'>
                                {item?.name}
                                <span className='trans-gpk hover:scale-110'>
                                    <LuExternalLink size={18} />
                                </span>
                            </NavLink>
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

export default StudyMaterials