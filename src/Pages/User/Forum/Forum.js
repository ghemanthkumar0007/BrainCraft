import React, { useEffect } from 'react'
import useAuth from '../../../hooks/UseAuth'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Forum() {
  const {forumsArr } = useAuth()

  const [filteredArr, setFilteredArr] = useState(forumsArr)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setFilteredArr(forumsArr)
  }, [forumsArr])

  useEffect(() => {
    if(forumsArr?.length && searchText){

      let searchTerms = searchText.toLowerCase().split(" ")
      console.log("searchTerms: ", searchTerms)
      let tarr = forumsArr.filter((item) => {
          for(let sterm of searchTerms){
              if( sterm && ( item.name.toLowerCase().includes(sterm) || item.tags.includes(sterm))){
                  return item;
              }
          }
      })
      setFilteredArr(tarr)
    }else{
      setFilteredArr(forumsArr)
    }

  },[searchText])


  let forumItemStyle = `flex flex-col bg-primary text-white p-5 rounded-lg `
  return (
    <div className=''>
        <div className='text-white'>
          <h1 className='text-center text-3xl font-semibold'>
              Forum
          </h1>
        </div>
        <div className='p-5 flex flex-col md:flex-row items-center justify-center'>
          <div className='flex items-center justify-center p-2'>
            <input className='input-gpk' placeholder='Search Forum...'
              onChange={(e) => setSearchText(e.target.value)}
              />
            <button className='btn2-gpk'>
              Search
            </button>
          </div>
          <NavLink to={'/create-forum'} className='btn2-gpk m-1'>
            Create New Forum
          </NavLink>
          <NavLink to={'/myforums'} className='btn2-gpk m-1'>
            My Forums
          </NavLink>
        </div>
        <div className='flex flex-col gap-2 '>
          {filteredArr.map((fr, idx) => {
            return (
              <NavLink to={`${fr?.id}`} key={idx} className={forumItemStyle}>
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
  )
}

export default Forum