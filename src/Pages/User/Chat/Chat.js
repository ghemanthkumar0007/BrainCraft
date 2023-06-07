import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import data from '../../../Constants/Data'
import useAuth from '../../../hooks/UseAuth'
import Messages from './Messages'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../database/firebase'

function Chat() {
  const {connects, usersArr,profile, connectsIds} = useAuth()
  const [usrArr, setUsrArr] = useState(usersArr)
  const [ searchText ,setSearchText] = useState('')
  const [usersArrFil, setUsersArrFil] = useState([])

  const [selectedChat, setSelectedChat] = useState(0)
  const [chatArr, setChatArr] = useState([])
  const [msgId, setMsgId] = useState(null)



  useEffect(() => {
    if(connectsIds?.length > 0){

      let tr = usersArr.filter((it) => !connectsIds.includes(it.email))
      setUsrArr(tr)
    }else{
      setUsrArr(usersArr)

    }
  }, [usersArr, connectsIds])

  useEffect(() => {
    let st = searchText?.trim()?.toLowerCase()

    if(st?.length > 0){
      let tarr = usrArr.filter((it) => (it.name.includes(st) || it.email.includes(st))  )
      setUsersArrFil(tarr)
    }else{
      setUsersArrFil(usersArr)
    }
  }, [usrArr,searchText])

  const getUserDetailsByMail = (email) => {
    // console.log("email: ", email)
    const td =  usersArr?.filter((item) => item.email === email)[0]
    // console.log("td: ",usrArr,td)
    return td
  }

  const selFun = (idx) => {
    setSelectedChat(idx)
  }

  useEffect(() => {
    if(connects && profile){
      const tmparr = connects.filter((item) => item.users.includes(profile.email) )
      setChatArr(tmparr)
    }
  }, [connects, profile])

  console.log(usersArr, usrArr.length, usersArrFil.length, connects.length, chatArr.length)
  console.log("connectsIds: ", connectsIds)

  const addConnectFun = (ur) => {
    try {
      console.log(connectsIds.includes(ur.email), connectsIds, ur.email)
      if(connectsIds.length > 0 && !connectsIds.includes(ur.email)){
        console.log("addConnectFun")
        addDoc(collection(db, 'connects'), {
          createdOn: serverTimestamp(),
          users: [ur.email, profile.email],
          lastMessage: "Hi",
          lastMessageTimestamp: serverTimestamp(),
        }).then((res) => {
          console.log(res)
          setSearchText("")
        }
        );
      }
    } catch (err) {
      console.log("addConnectFun: ", err)
    }
  }
  return (
    <div className='w-full flex-grow flex flex-col'>
      <h1 className='w-full  p-5 bg-primary text-white text-3xl font-medium text-center'>Chat</h1>
        <div className='w-full flex flex-grow justify-center  pt-8 px-5'>
          <div className='relative h-full  bg-primary flex w-96 flex-col items-center '>
          { (
              <div className="pb-1 h-full bg-primary">
                <div className=''>
                  <input className=' w-96 border-2 border-primary p-2  text-base font-normal rounded bg-secondary text-white' placeholder='Search user'
                    onChange={(e) => setSearchText(e.target.value)} />
                </div>
                {searchText &&( <div className={`absolute z-40 overflow-x-hidden overflow-y-scroll  top-12 w-96 bg-primary text-white h-96  border left-0`}>
                {usersArrFil.length > 0  && (
                <p className='text-center p-2 opacity-50 text-sm font-normal'>
                    select user to send message
                  </p>)}
                  {usersArrFil?.map((user, idx) => {
                    return (
                        <button className=' bg-secondary text-white p-5 rounded w-96 flex items-center' key={idx} 
                          onClick={() => addConnectFun(user)}> 
                          <img src={user?.photo} className="h-16 w-16 rounded-full" alt="photo" />
                          <div className='pl-4'>
                            <h1 className='text-base  text-start font-medium'>
                              {user.name}
                            </h1>
                            <h1 className='text-base  text-start font-normal opacity-50'>
                              {user.email}
                            </h1>
                          </div>
                        </button>
                    )
                  })}
                  { usersArrFil.length === 0 && (
                    <p className='text-center p-2 bg-primary text-white'>
                      No users with Search Term
                    </p>
                  )}
                </div>)}
              </div>
            )}
          {chatArr?.map((item,idx) => {
              let mail = (item?.users?.length === 2 && item?.users[0] === profile?.email ) ? item?.users[1] : item?.users[0]
              let details = getUserDetailsByMail(mail)
              // console.log("chatArr",mail)
              // console.log("IMG: ",details,item)
              return (
                <div key={idx} className="pb-1">
                <Link to={`/messages/${item.id}`} className="block md:hidden">
                  <div className='bg-primary text-white p-5 rounded w-96 flex items-center'>
                    <img src={details?.photo} className="h-16 w-16 rounded-full" alt="photo" />
                    <div className='pl-4'>
                      <h1 className='text-base  text-start font-medium'>
                        {details?.name}
                      </h1>
                      {item?.lastMessage && (
                        <p className='text-start opacity-50 '>
                          {item?.lastMessage?.slice(0,25)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <button onClick={() => selFun(idx)} className={`hidden md:block `}>
                  <div className={` p-5 rounded w-96 flex items-center text-white ${selectedChat === idx? "bg-secondary border-2 border-primary ":" bg-primary  "}`}>
                    <img src={details?.photo} className="h-16 w-16 rounded-full" alt="photo" />
                    <div className='pl-4'>
                      
                      <NavLink to={`/user/${details?.email}`} className='text-base text-start font-medium hover:underline'>
                        {details?.name}
                      </NavLink>
                      {item?.lastMessage && (
                      <p className='text-start opacity-50 '>
                        {item?.lastMessage.slice(0,25)}...
                      </p>
                      )}
                    </div>
                  </div>
                </button>
                </div>
              )
            })}

            
          </div>
          <div className='bg-primary hidden w-full md:flex md:flex-grow ml-1 border rounded border-white/25 h-full'>
            {chatArr?.length > 0 && (
            <Messages msgId={msgId? msgId: chatArr[selectedChat]?.id} selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
            )} 
          </div>
        </div>
      {/* ): (
        <div className='text-center w-full pt-8 text-xl font-medium text-secondary'>
          chat Empty
        </div>
      ) } */}
    </div>
  )
}

export default Chat