import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/UseAuth'

function Dashboard() {

  const {forumsArr, connects, profile, usersArr, studyArr } = useAuth()

  const [filteredArr, setFilteredArr] = useState(forumsArr)
  const [chatArr, setChatArr] = useState([])
  const [sarr, setSarr] = useState(studyArr)

  useEffect(() => {
    setFilteredArr(forumsArr)
  }, [forumsArr])

  useEffect(() =>{
    setSarr(studyArr)
},[studyArr])

  useEffect(() => {
    if(connects && profile){
      const tmparr = connects.filter((item) => item.users.includes(profile.email) )
      setChatArr(tmparr)
    }
  }, [connects, profile])

  const getUserDetailsByMail = (email) => {
    // console.log("email: ", email)
    const td =  usersArr?.filter((item) => item.email === email)[0]
    // console.log("td: ",usrArr,td)
    return td
  }

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 '>
          <div className='flex flex-col gap-4 md:col-span-4'>
            <div className='p-4 flex  bg-primary text-whit flex-col gap-2'>
            <div className='pb-2'>
              <h1 className='text-base font-medium '>Recent Messages</h1>
            </div>
            {chatArr.slice(0,3)?.map((item,idx) => {
              let mail = (item?.users?.length === 2 && item?.users[0] === profile?.email ) ? item?.users[1] : item?.users[0]
              let details = getUserDetailsByMail(mail)
              return (
                <div key={idx} className="">
                <NavLink to={`/messages/${item.id}`} className="block ">
                  <div className='bg-primary text-white hover:bg-secondary p-5 rounded w-full flex items-center'>
                    <img src={details?.photo} className="h-16 w-16 rounded-full" alt="photo" />
                    <div className='pl-4 w-full'>
                      <div className='text-base text-start font-medium flex justify-between items-center gap-2'>
                        <span>
                          {details?.name}
                        </span>
                        <span className='text-xs font-normal opacity-50'>
                          {item?.lastMessageTimestamp?.toDate()?.toDateString()}
                        </span>
                      </div>
                      {item?.lastMessage && (
                        <p className='text-start opacity-50 '>
                          {item?.lastMessage?.slice(0,25)}...
                        </p>
                      )}
                    </div>
                  </div>
                </NavLink>
                </div>
            )})}

            </div>

            {/* study material  */}
            {studyArr.length > 0 && (
              <NavLink to={`study-materials/${studyArr[0]?.id}`} className='bg-primary p-4 text-white' >
                <img src={studyArr[0]?.photo} alt={studyArr[0]?.name}
                  className='w-full h-64 object-cover rounded-none'/>
                <h1 className='text-base font-medium hover:underline'>
                  Study Material
                </h1>
                <p className='opacity-50'>
                {studyArr[0]?.name} -  {studyArr[0]?.des}
                </p>
              </NavLink>
            )}
          </div>
          {/* right  */}
          <div className='p-4 md:col-span-8 bg-primary text-white'>
            <div className='pb-2'>
              <h1 className='text-base font-medium '>Recent Forums</h1>
            </div>
            <div className='flex flex-col gap-2'>
                {forumsArr.slice(0,4).map((fr, idx) => {
                return (
                  <NavLink to={`forum/${fr?.id}`} key={idx} className={`flex flex-col bg-primary text-white p-5  border-b border-white/25`}>
                      <div className='flex justify-between items-center opacity-50'>
                        {/* <p className='text-sm font-normal bg-black rounded-lg px-2 text-white '>
                          Members {fr?.members}
                        </p> */}
                        <p className='text-sm font-normal '>
                          Created on: {fr?.createdOn?.toDate().toDateString()}
                        </p>
                      </div>
                      <h1 className={` text-xl font-semibold hover:underline `}>
                        {fr?.name}
                      </h1>
                      <p className=' text-xs font-normal opacity-50'>
                        by -  {fr?.byName}
                      </p>
                      <p className=' text-base font-normal opacity-50 line-clamp-4'>
                        {fr?.description}
                      </p>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Dashboard
