import React from 'react'
import useAuth from '../hooks/UseAuth'
import {NavLink} from 'react-router-dom'
import data from '../Constants/Data'
function Header() {
    const {user, signOutfun, profile} = useAuth()
    // console.log(user)
    const activeLinkStyle = 'py-2 px-3 text-black bg-white rounded'
    const linkStyle = 'px-2'
  return (
    <div className='w-full bg-secondary text-white p-4 flex flex-col md:flex-row items-center justify-between'>
        <div className='py-2 pb-4 md:pb-2 text-xl font-medium'>
          {data.title}
        </div>
        <div className='px-8 flex flex-wrap items-center justify-center'>
          <NavLink to='/' className={ linkStyle }>Home</NavLink>
          {profile?.iam === 'student' && <NavLink to='connects' className={({ isActive }) => isActive ? activeLinkStyle : linkStyle } >Connects</NavLink> }
          <NavLink to='chat' className={({ isActive }) => isActive ? activeLinkStyle : linkStyle }>Chat</NavLink>
          <NavLink to='profile' className={({ isActive }) => isActive ? activeLinkStyle : linkStyle }>Profile</NavLink>
          <button className='bg-red-500 hover:bg-red-700 text-white px-3 py-2 my-2 md:my-0 mx-2 rounded' onClick={() => signOutfun()} >
            Log out
          </button>
        </div>
    </div>
  )
}

export default Header