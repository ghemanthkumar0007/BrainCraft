import React, { useEffect } from 'react'
import useAuth from '../../../hooks/UseAuth'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function MyForums() {
    const {forumsArr, profile } = useAuth()
    const [filteredArr1, setFilteredArr1] = useState(forumsArr)
    const [filteredArr, setFilteredArr] = useState([])

    const [searchText, setSearchText] = useState('')
    useEffect(() => {
        let tr = forumsArr?.filter((item) => item?.byEmail === profile?.email)
        setFilteredArr1(tr)
    }, [forumsArr, profile])

    useEffect(() => {
        if(filteredArr1?.length){
          let searchTerms = searchText.toLowerCase().split(" ")
          console.log("searchTerms: ", searchTerms)
          let tarr = filteredArr1.filter((item) => {
              for(let sterm of searchTerms){
                  if( item.name.toLowerCase().includes(sterm) || item.tags.includes(sterm)){ //item.description.toLowerCase().includes(sterm)
                      return item;
                  }
              }
          })
          setFilteredArr(tarr)
        }else{
          setFilteredArr(filteredArr1)
        }
      },[searchText,filteredArr1 ])

    let forumItemStyle = `flex flex-col bg-primary text-white p-5 rounded-lg `
  return (
    <div className=''>
        <div className=''>
          <h1 className='text-center text-white text-3xl font-semibold'>
              My Forums
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
          <NavLink to={'/create-forum'} className='btn2-gpk'>
            Create New Forum
          </NavLink>
          
        </div>
        <div className='flex flex-col gap-2 '>
          {filteredArr.map((fr, idx) => {
            return (
              <NavLink to={`/forum/${fr?.id}`} key={idx} className={forumItemStyle}>
                  <div className='flex justify-between items-center opacity-50'>
                    <div className='flex gap-2 '>
                        <p className='text-sm font-normal bg-black rounded-lg px-2 text-white '>
                        {fr?.status}
                        </p>
                        {/* <p className='text-sm font-normal bg-black rounded-lg px-2 text-white '>
                        Members {fr?.members}
                        </p> */}
                    </div>
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

export default MyForums