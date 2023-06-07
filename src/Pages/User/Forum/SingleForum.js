import React, { useEffect, useState } from 'react'
import useAuth from '../../../hooks/UseAuth';
import { NavLink, useParams } from 'react-router-dom';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { IoIosArrowBack, IoMdAttach } from "react-icons/io";
import { IoDocumentAttachSharp, IoSend } from "react-icons/io5";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../../database/firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { BsFileEarmarkArrowDown } from 'react-icons/bs';
function SingleForum() {
    let { forumId } = useParams();
    const {forumsArr, profile, showAlert } = useAuth()

    const [forumDetails, setForumDetails] = useState(null)
    const [showDes, setShowDes] = useState(true)
    const [currMsg, setCurrMsg] = useState('')
    const [selectedFile, setSelectedFile] = useState(null);
    const [attachment, setAttachment] = useState(null)
    const [postsArr, setPostsArr] = useState([])



    useEffect(() => {
        if(!forumDetails){
            let td = forumsArr?.filter((it) => it?.id === forumId)
            if(td.length > 0){
                setForumDetails(td[0])
            }
        }
    }, [forumId, forumsArr ])

    const changeAttachHandler = event => {
        console.log(event.target.files)
        if(event.target.files.length > 0){
          setSelectedFile(event.target.files[0]);
          let u = window.URL.createObjectURL(event.target.files[0])
          setAttachment(u)
        }else{
            setSelectedFile(null)
            setAttachment(null)
        }
    }

    useEffect(() => onSnapshot(query(collection(db, 'posts'), where('forumId', 'in', [forumId] || "")), //orderBy('on','desc')
      (snapshot) => {
        let tarr = []
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setPostsArr(tarr)
      }), [db, forumId])
      console.log("PostsArr: ", postsArr)

      const submitPost = async() => {
        try {
            if(currMsg.trim() === ""){
                return showAlert("Enter Comment")
            }else{
                if(selectedFile){
                    try{
                        // showAlert("File Uploading...")
                        const fileExtension = selectedFile.name.split('.').pop() //details.photo.split('.').pop();
                      const storage = getStorage();
                      const t = new Date()
                    let  dat = t.getDate().toString() + "_"+ t.getMonth().toString() + "_"+ t.getFullYear().toString() + "_"+ t.getHours().toString() + "_"+ t.getMinutes().toString() + "_"+ t.getMilliseconds().toString()
                      let fileName = `${dat}.${fileExtension}`
                      const storageRef = ref(storage, `posts/${forumId}/${fileName}`);
                      const response = await fetch(attachment);
                      const blob = await response.blob();
                      await uploadBytes(storageRef, blob).then((snapshot) => {
                        console.log('Uploaded file!');
                        getDownloadURL(storageRef).then((res) => {
                          // setPhotoUrl(res)
                          console.log("PhotoUrl: ", res)
                          addDoc(collection(db, 'posts'), {
                            on: serverTimestamp(),
                            byEmail: profile?.email,
                            byName: profile?.name,
                            byPhoto: profile?.photo,
                            comment: currMsg.trim(),
                            attachment: res,
                            fileName: selectedFile.name,
                            size: selectedFile.size,
                            forumId: forumId,
                          });
        
                        })
                        })
                    }catch(err){
                        showAlert("Unable to send file", "danger")
                        console.log("Unable to upload File: ", err)
                    }
                }else{
                      addDoc(collection(db, 'posts'), {
                        on: serverTimestamp(),
                        byEmail: profile?.email,
                        byName: profile?.name,
                        byPhoto: profile?.photo,
                        comment: currMsg.trim(),
                        forumId: forumId
                      });
                }
                setCurrMsg("")
                setSelectedFile(null)
                setAttachment(null)
            }
        } catch (err) {
            console.log("submitPostError: ", err)
        }
      }

  return (
    <div className=''>
        <div className='pb-4 flex flex-col items-center justify-center text-white'>
          <button className='text-center text-3xl font-semibold flex items-center'
            onClick={() => setShowDes((prev) => !prev)}>
              {forumDetails?.name} <span className='p-2 block lg:hidden'>
                {showDes? <SlArrowUp size={18} /> : <SlArrowDown size={18}/>}
              </span>
          </button>
            <div className={`flex flex-col items-center justify-center `}>
                <span className='text-base text-center font-normal'>
                Created by {" "} 
                <NavLink to={`/user/${forumDetails?.byEmail}`} className='underline' >
                    {forumDetails?.byName}
                </NavLink>
                {" on "}{forumDetails?.createdOn?.toDate().toDateString()}
                </span>
                <div className={` ${showDes? 'flex flex-col items-center text-center': 'hidden'} lg:hidden bg-primary text-white p-2 rounded`}>
                    <div className='flex gap-2'>
                        <p className='text-sm font-medium'>
                            Members: 
                        </p>
                        <p className='text-sm font-normal'>
                            {forumDetails?.members}
                        </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-medium'>
                            Tags: 
                        </p>
                        <p className='text-sm font-normal flex flex-wrap gap-2'>
                            {forumDetails?.tags?.map((item, idx) => {
                                return (
                                    <span key={idx} className='px-2 rounded bg-secondary text-white border border-1 border-white'>
                                        {item}
                                    </span>
                                )
                            })}
                        </p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p className='pt-2 text-sm font-medium'>
                            Description: 
                        </p>
                        <p className='text-sm font-normal'>
                            {forumDetails?.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className='flex gap-4'>
            {/* middle flex-grow */}
            <div className='w-full lg:w-8/12 flex flex-col gap-4  rounded-lg p-4'>
                <div className='p-4 flex flex-col bg-primary text-white'>
                    <h1 className='text-base font-medium'>
                       Comment:
                    </h1>
                    <textarea className='p-2 text-base font-normal w-full border bg-secondary rounded border-primary'
                        rows={3}
                        placeholder='Enter comment...'
                        onChange={(e) => setCurrMsg(e.target.value)} value={currMsg}>
                            
                    </textarea>
                    <div className='py-4 flex justify-end'>
                        {/* attachment */}
                        <div className='bg-secondary ml-2 rounded-full p-2 text-white'>
                            <input type='file' id='inputFile' className='hidden'
                                onChange={changeAttachHandler}/>
                                <label htmlFor='inputFile'>
                                    { (selectedFile === null  || selectedFile === undefined)? <IoMdAttach size={25} className='cursor-pointer'/>
                                        :<IoDocumentAttachSharp size={25} className='cursor-pointer'/> }
                                </label>
                        </div>
                        <button className='btn1-gpk' onClick={() => submitPost()}>
                            Submit
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-4 '>

                    {postsArr?.map((post) => {
                        return (
                            <div className='p-4 bg-primary text-white rounded  '>
                                <div className='flex items-center gap-2 pb-2 '>
                                    <img className="w-8 h-8 rounded-full" src={post?.byPhoto} alt="user photo"/>
                                    <div className=''>
                                        <NavLink to={`/user/${post?.byEmail}`} className='text-base font-semibold hover:underline '>
                                            {post?.byName}
                                        </NavLink>
                                        <p className='text-xs font-normal opacity-50 '>
                                            Posted on {post?.on?.toDate()?.toDateString()}
                                        </p>
                                    </div>
                                </div>

                                <p className='py-2 text-base font-normal'>
                                    {post?.comment}
                                </p>
                                {post?.attachment && (
                                    <div className='flex '>

                                    <a className='bg-secondary p-2 rounded flex flex-row items-center mb-1'
                                        href={post?.attachment} target="_blank" rel="noreferrer" >
                                        <BsFileEarmarkArrowDown size={30} />
                                        {(post?.fileName && post?.size ) ? (
                                            <div className='px-1'>
                                                <p className=''>{post?.fileName?.slice(0,15)}</p>
                                                <p className='text-xs'>{(post?.size/1000000)?.toString()?.slice(0,5)} MB</p>
                                            </div>
                                        ) : (
                                            <a href={post?.attachment} className='underline text-blue-600 text-base font-normal'
                                                target='_blank' >
                                                Download Attachment
                                            </a>
                                        )}
                                    </a>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                </div>
            </div>
            {/* right w-[500px] */}
            <div className=' w-4/12 hidden lg:block'>
                <div className='bg-primary text-white p-2 rounded'>
                    <div className='flex gap-2'>
                        <p className='text-sm font-medium'>
                            Members: 
                        </p>
                        <p className='text-sm font-normal'>
                            {forumDetails?.members}
                        </p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-medium'>
                            Tags: 
                        </p>
                        <p className='text-sm font-normal flex flex-wrap gap-2'>
                            {forumDetails?.tags?.map((item, idx) => {
                                return (
                                    <span key={idx} className='px-2 rounded bg-secondary text-white border border-1 border-white'>
                                        {item}
                                    </span>
                                )
                            })}
                        </p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p className='pt-2 text-sm font-medium'>
                            Description: 
                        </p>
                        <p className='text-sm font-normal'>
                            {forumDetails?.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SingleForum