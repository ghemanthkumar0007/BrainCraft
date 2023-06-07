import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoMdAttach } from "react-icons/io";
import { IoDocumentAttachSharp, IoSend } from "react-icons/io5";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import useAuth from '../../../hooks/UseAuth';
import { auth, db } from '../../../database/firebase';
import { BiVideo } from 'react-icons/bi';
import { FaChalkboard } from 'react-icons/fa';

function Messages({ msgId, selectedChat, setSelectedChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  let { id } = useParams();
  const { setLoading, profile, showAlert, connects, usersList, usersArr } = useAuth()

  const messageID = msgId ? msgId : id;
  const [messArr, setMessArr] = useState([]);
  const [currMsg, setCurrMsg] = useState("");
  const [messProfile, setMessProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [gifup, setGifup] = useState(false);
  const [fileErr, setFileErr] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  const [gifResults, setGifResults] = useState([]);
  const [showGifPopup, setShowGifPopup] = useState(false); // State to control the visibility of the GIF search pop-up

  const changeAttachHandler = event => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      let u = window.URL.createObjectURL(event.target.files[0])
      setAttachment(u)
    }
  }

  const searchGifs = async () => {
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=ezwTZzoSdgEUyTH5bdC2THoTGJtk1sYp&q=${gifSearch}&limit=25&offset=0&rating=g&lang=en`);
      const data = await response.json();
      setGifResults(data.data);
    } catch (error) {
      console.error("Error fetching GIFs: ", error);
    }
  }

  const selectGif = (gif) => {
    setCurrMsg(gif.images.fixed_height.url);
    setShowGifPopup(false); // Hide the GIF search pop-up after selecting a GIF
    setGifup(true)
  }

  useEffect(() => {
    if (connects && messageID && profile) {
      connects.filter((item) => {
        if (item.id === messageID) {
          let mail = (item?.users?.length === 2 && item?.users[0] === profile?.email) ? item?.users[1] : item?.users[0];
          return setMessProfile(getUserDetailsByMail(mail));
        }
      })
    }
  }, [connects, messageID]);

  useEffect(() => {
    onSnapshot(query(collection(db, 'connects', messageID, "messages"), orderBy('timestamp', 'asc')),
      (snapshot) => {
        setLoading(true);
        let tarr = [];
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setMessArr(tarr);
        setLoading(false);
      });
  }, [db, messageID]);

  const getUserDetailsByMail = (email) => {
    const td = usersArr?.filter((item) => item.email === email)[0];
    return td;
  }

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.size > 100000000) { //100*1000*1000 //100mb
        showAlert("File Size can't be greater than 100MB", "danger");
        setSelectedFile(null);
      }
    }
  }, [selectedFile]);

  const sendMsg = async () => {
    try {
      if (currMsg.trim() === "") {
        return showAlert("Enter Message");
      }
      if (selectedFile) {
        try {
          showAlert("File Uploading...");
          const fileExtension = selectedFile.name.split('.').pop();
          const storage = getStorage();
          const t = new Date();
          let dat = `${t.getDate().toString()}_${t.getMonth().toString()}_${t.getFullYear().toString()}_${t.getHours().toString()}_${t.getMinutes().toString()}_${t.getMilliseconds().toString()}`;
          let fileName = `${dat}.${fileExtension}`;
          const storageRef = ref(storage, `chats/${auth.currentUser.uid}/${fileName}`);
          const response = await fetch(attachment);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob).then((snapshot) => {
            getDownloadURL(storageRef).then((res) => {
              addDoc(collection(db, 'connects', messageID, "messages"), {
                timestamp: serverTimestamp(),
                email: profile.email,
                message: currMsg.trim(),
                file: res,
                fileName: selectedFile.name,
                size: selectedFile.size
              });
            });
          });
        } catch (err) {
          showAlert("Unable to send file", "danger");
        }
      } else {
        addDoc(collection(db, 'connects', messageID, "messages"), {
          timestamp: serverTimestamp(),
          email: profile.email,
          message: currMsg.trim(),
          gif: gifup,
        });
        setGifup(false)
      }
      setDoc(doc(db, 'connects', messageID), {
        lastMessage: currMsg.trim(),
        lastMessageTimestamp: serverTimestamp()
      }, { merge: true });
      setCurrMsg("");
      setSelectedFile(null);
      if (selectedChat) {
        setSelectedChat(0);
      }
    } catch (err) {
      console.log("SendMessageError: ", err);
      showAlert("Unknown Error", "danger");
    }
  }

  useEffect(() => {
    let myDiv = document.getElementById("MessageDiv");
    myDiv.scrollTop = myDiv.scrollHeight;
  }, [messArr]);

  return (
    <div className='w-full bg-primary text-white flex flex-grow flex-col items-between justify-between relative'>
      <div className='md:hidden border-b flex items-center'>
        <button className='p-2' onClick={() => navigate(-1)}>
          <IoIosArrowBack size={25} />
        </button>
        <div className='bg-primary text-white p-5 rounded w-96 flex items-center'>
          <img src={messProfile?.photo} className="h-16 w-16 rounded-full" />
          <div className='pl-4'>
            <NavLink to={`/user/${messProfile?.email}`} className='text-base font-medium hover:underline'>
              {messProfile?.name}
            </NavLink>
            <p className='opacity-50 text-sm'>
              {messProfile?.email}
            </p>
          </div>
        </div>
      </div>
      <div className='absolute -top-5 left-2 hidden md:flex items-center'>
        <div className='text-white flex items-center'>
          <div className=''>
            <NavLink to={`/user/${messProfile?.email}`} className='text-xs font-medium '>
              {messProfile?.name}
            </NavLink>
          </div>
        </div>
      </div>
      <div className='bg-primary p-5 flex h-[450px] flex-col w-full scroll-smooth overflow-y-auto' id="MessageDiv">
        {messArr?.map((item, idx) => {
          if (profile.email === item.email) {
            return (
              <div className=' w-full flex justify-end' key={idx}>
                <div className='bg-secondary text-white p-2 m-2 ml-16 rounded-t rounded-l text-base font-normal'>
                  {item?.file && (
                    <a className='bg-indigo-800 p-2 rounded flex flex-row items-center mb-1'
                      href={item.file} target="_blank" rel="noreferrer" >
                      <BsFileEarmarkArrowDown size={30} />
                      <div className='px-1'>
                        <p className=''>{item?.fileName.slice(0, 15)}</p>
                        <p className='text-xs'>{(item.size / 1000000).toString().slice(0, 5)} MB</p>
                      </div>
                    </a>
                  )}
                   {item?.gif && (
                    <img src={item?.gif} alt="gif" className='w-16 h-16 rounded' />
                    )}
                  {item?.message}
                </div>
              </div>
            )
          }
          return (
            <div className=' w-full flex justify-start' key={idx}>
              <div className='bg-secondary text-white p-2 m-2 mr-16 rounded-t rounded-r text-base font-normal'>
                {item?.file && (
                  <a className='bg-indigo-800 p-2 rounded flex flex-row items-center mb-1'
                    href={item.file} target="_blank" rel="noreferrer" >
                    <BsFileEarmarkArrowDown size={30} />
                    <div className='px-1'>
                      <p className=''>{item?.fileName.slice(0, 15)}</p>
                      <p className='text-xs'>{(item.size / 1000000).toString().slice(0, 5)} MB</p>
                    </div>
                  </a>
                )}
                {item?.gif && (
                    <img src={item?.gif} alt="gif" className='w-16 h-16 rounded' />
                )}
                {item?.message}
              </div>
            </div>
          )
        })}
      </div>
      <div className='bg-primary p-4 w-full flex relative '>
        <input
          placeholder='Enter Message Here .... '
          value={currMsg}
          className="w-full p-2 border rounded bg-secondary text-white"
          onChange={(e) => setCurrMsg(e.target.value)}
        />
        {/* GIF button */}
        <div className='bg-secondary ml-2 rounded-full p-2 text-white'>
          <button onClick={() => setShowGifPopup(!showGifPopup)}>
            GIF
          </button>
        </div>
        {/* GIF search popup */}
        {showGifPopup && (
          <div className="gif-search-popup">
            <input
              type="text"
              value={gifSearch}
              onChange={(e) => setGifSearch(e.target.value)}
              placeholder="Search for GIFs..."
              className="w-full p-2 border rounded bg-secondary text-white"
            />
            <button onClick={searchGifs}>Search</button>
            <div className="gif-results">
              {gifResults.map(gif => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_height.url}
                  onClick={() => selectGif(gif)}
                />
              ))}
            </div>
          </div>
        )}
        <a href='https://meet.google.com/' target="_blank"className='bg-secondary ml-2 rounded-full p-2 text-white'>
            <BiVideo size={18} />
        </a>
        <a href='https://webwhiteboard.com/' target="_blank"className='bg-secondary ml-2 rounded-full p-2 text-white'>
            <FaChalkboard size={18} />
        </a>
        {/* attachment */}
        <div className='bg-secondary ml-2 rounded-full p-2 text-white'>
          <input type='file' id='inputFile' className='hidden'
            onChange={changeAttachHandler} />
          <label htmlFor='inputFile'>
            {(selectedFile === null || selectedFile === undefined) ? <IoMdAttach size={25} className='cursor-pointer' />
              : <IoDocumentAttachSharp size={25} className='cursor-pointer' />}
          </label>
        </div>
        <button className='bg-secondary ml-2 p-2 rounded text-white' onClick={() => sendMsg()} >
          Send
        </button>
        
        
      </div>
    </div>
  );
}

export default Messages;
