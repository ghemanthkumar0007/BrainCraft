import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import data from '../../Constants/Data'
import { NavLink } from 'react-router-dom'
import { SlCalender } from 'react-icons/sl'
import {RxDashboard, RxLayers} from 'react-icons/rx'
import {RiChat1Line, RiPieChart2Line, RiQuestionAnswerLine} from 'react-icons/ri'
import Dashboard from '../Dashboard/Dashboard'
import Profile from '../Profile/Profile'
import ViewProfile from '../Profile/ViewProfile'
import useAuth from '../../hooks/UseAuth'
import Forum from './Forum/Forum'
import MyForums from './Forum/MyForums'
import CreateForum from './Forum/CreateForum'
import SingleForum from './Forum/SingleForum'
import Chat from './Chat/Chat'
import Askai from './askai/Askai'
import Courses from './Courses'
import Schedule from './Schedule'
import StudyMaterials from './StudyMaterials'
import UserProfile from './UserProfile'
import Messages from './Chat/Messages'
import { IoNotificationsOutline } from 'react-icons/io5'
import { ImNotification } from 'react-icons/im'
import { FaMoon } from 'react-icons/fa'
import StudyMaterialsDetails from './StudyMaterialsDetails'
import logo from '../../assets/logo.png'

function UserDash() {
    const {profile, signOutfun} = useAuth()
    const [showSidebar, setShowSidebar] = useState(false)
    const [showProfileOpt, setShowProfileOpt] = useState(false)
    const navItemStyle = ` flex items-center p-2 text-white/75 rounded-lg  hover:bg-gray-700  `
    const navItemActiveStyle = `flex items-center p-2 rounded-lg  bg-gray-700 text-white `
    const navArr = [
        {
            name: 'Dashboard',
            link: '/dashboard',
            icon: <RiPieChart2Line size={20}/>
        },
        {
            name: 'Courses',
            link: '/courses',
            icon: <RxDashboard size={20}/>
        },
        {
            name: 'Forum',
            link: '/forum',
            icon: <RiQuestionAnswerLine size={20}/>
        },
        {
            name: 'Chats',
            link: '/chats',
            icon: <RiChat1Line size={20}/>
        },
        {
            name: 'Study Materials',
            link: '/study-materials',
            icon: <RxLayers size={20}/>
        },
        {
            name: 'Schedule',
            link: '/schedule',
            icon: <SlCalender size={20}/>
        },
        {
            name: 'Ask AI',    
            link: '/ask-ai',   
            icon: <RxLayers size={20}/>, 
        },
        
        
        
    ]

    

  return (
    <div className='relative flex-grow flex flex-col bg-primary'>
        <nav className="fixed top-0 z-50 w-full bg-sidebar border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
                <button  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={() => setShowSidebar((prev) => !prev)}>
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>
                <NavLink to="/" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    {/* {data.title} */}
                    <img src={logo} className='h-16 ' alt="logo"/>
                    </span>
                </NavLink>
            </div>
            <div className="flex items-center">
                <div className="flex items-center ml-3 relative">
                    <div className='flex items-center gap-4 text-white/50 bg-secondary px-2 py-1 rounded-full'>
                        <input className='w-48 py-1 px-2 rounded-full bg-primary' placeholder='Search ... ' />
                        <IoNotificationsOutline size={18} />
                        <ImNotification size={18} />
                        <FaMoon size={18} />

                    <button className="flex text-sm bg-sidebar rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" 
                        onClick={() => setShowProfileOpt((prev) => !prev)}>
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src={profile?.photo} alt={profile?.name}/>
                    </button>
                    </div>
                    <div className={`z-50 absolute ${showProfileOpt? "block top-6 right-0": "hidden"} my-4 text-base list-none bg-primary border border-white/25 divide-y divide-secondary rounded shadow`} >
                    <div className="px-4 py-3" role="none">
                        <p className="text-sm text-white" role="none">
                            {profile?.name}
                        </p>
                        <p className="text-sm font-medium  truncate text-white/50" role="none">
                            {profile?.email}
                        </p>
                    </div>
                    <ul className="py-1" role="none">
                        <li>
                        <NavLink to="profile" className="block px-4 py-2 text-sm text-white hover:bg-secondary ">
                            Profile
                        </NavLink>
                        </li>
                        <li>
                        <button className="w-full text-start block px-4 py-2 text-sm text-white hover:bg-secondary " 
                            onClick={() =>signOutfun()}>
                            Sign out
                        </button>
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </nav>

        <aside className={`bg-sidebar fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${showSidebar? "transform-none": "-translate-x-full"} border-r border-white/25 sm:translate-x-0 `}>
        <div className=" h-full px-3 pb-4 overflow-y-auto bg-sidebar">
            <ul className=" space-y-2 font-medium">
                {navArr.map((item, idx) => {
                    return (
                        <li key={idx}>
                        <NavLink to={item.link} className={(navData) => navData.isActive ? navItemActiveStyle: navItemStyle}
                            >
                                {item.icon} 
                                <span className='ml-4'>
                                {item.name}
                                </span> 
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
        </aside>

        <div className="p-4 sm:ml-64 pt-20 bg-secondary text-white flex-grow">
            <Routes>
                <Route path="/" >
                    <Route  path="dashboard" element={<Dashboard />} />
                    <Route  path="study-materials" element={<StudyMaterials />} />
                    <Route  path="study-materials/:sid" element={<StudyMaterialsDetails />} />
                    <Route  path="schedule" element={<Schedule />} />
                    <Route  path="courses" element={<Courses />} />
                    <Route  path="forum" element={<Forum />} />
                    <Route  path="create-forum" element={<CreateForum />} />
                    <Route  path="myforums" element={<MyForums />} />
                    <Route  path="forum/:forumId" element={<SingleForum />} />
                    <Route  path="user/:userId" element={<UserProfile />} />
                    <Route  path="chats" element={<Chat />} />
                    <Route  path="messages/:id" element={<Messages />} /> 
                    <Route  path="profile" element={<ViewProfile />} />
                    <Route  path="editprofile" element={<Profile />} />
                    <Route  path="ask-ai" element={<Askai/>} />
                    <Route index element={<Dashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    
                </Route>
                </Routes>
                
        </div>
        <div className='sm:ml-64 p-5 text-center bg-primary text-white/50'>
            <p> @{new Date().getFullYear()} Hack4Impact by Wrench Team</p>
        </div>
    </div>
  )
}

export default UserDash