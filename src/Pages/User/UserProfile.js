import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../hooks/UseAuth'

function UserProfile() {
    const {profile, usersArr} = useAuth()
    const navigate = useNavigate();
    let { userId } = useParams();

    const [mDetails, setMDetails] = useState({})
    useEffect(()=>{
        if(userId){
            let tm = usersArr?.filter((it) => it.email === userId)
            if(tm.length> 0 ){
                setMDetails(tm[0])
            }
        }
    }, [usersArr])
    return (
        <div className='w-full flex justify-center relative text-white'>
            <div className='w-full mt-5 sm:p-5 sm:px-16 md:px-32 flex flex-col items-center'>
                <div className='w-full p-5 flex flex-col md:flex-row items-center md:justify-between'>
                    <div className='flex flex-col md:flex-row items-center justify-center py-2 '>
                        <img src={mDetails?.photo} className="h-32 w-32  rounded-full border-2 border-secondary" alt="profile" />
                        <div className='text-center md:text-start p-5'>
                            <h1 className='font-medium text-xl'>{mDetails?.name}</h1>
                            <h2 className='font-normal text-base opacity-70 '>Email: {mDetails?.email}</h2>
                        </div>
                    </div>
                </div>
                <div className=' w-full py-5 px-8 md:px-12 '>
                    <div className='py-2 flex '>
                        <div className='pr-8'>
                            <h1 className='text-lg font-medium'>
                                Gender
                            </h1>
                            <p className='text-base font-normal opacity-70'>
                                {mDetails?.gender}
                            </p>
                        </div>
                        <div className='pr-8'>
                            <h1 className='text-lg font-medium'>
                                Contact No
                            </h1>
                            <p className='text-base font-normal opacity-70'>
                                {mDetails?.pno}
                            </p>
                        </div>
                    </div>
                    <div className='py-2'>
                        <h1 className='text-xl font-medium'>
                            Bio
                        </h1>
                        <p className='text-base font-normal opacity-70'>
                            {mDetails?.bio}
                        </p>
                    </div>                    
                </div>
            </div>
        </div>
      )
}

export default UserProfile