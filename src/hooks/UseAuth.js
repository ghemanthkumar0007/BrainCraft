import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Store } from 'react-notifications-component';
import {  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification } from "firebase/auth";
import {auth, db} from '../database/firebase'
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import {useNavigate} from 'react-router-dom'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
  let navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true'  || false)
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(false)
    const [profile, setProfile] = useState(null)
    
    const [usersList, setUsersList] = useState([])
    const [mentorList, setMentorList] = useState([])
    const [studentList, setStudentList] = useState([])
    const [sRequested, setSRequested] = useState([])
    
    const [connects, setConnects] = useState([])
    const [connectsIds, setConnectsIds] = useState([])
    const [forumsArr, setforumsArr] = useState([])
    const [usersArr, setUsersArr] = useState([])
    const [coursesArr, setCoursesArr] = useState([])
    const [studyArr, setStudyArr] = useState([])

    const [fetchCount, setFetchCount] = useState(1)


    useEffect(() => {
      const fun = onAuthStateChanged(auth, (u) => {
        setLoading(true)
        try{ 
          if (u) {
            const userId = u.uid
            setUser(u)
            setIsLoggedIn(true)
          }else {
            setUser(null)
          }
        }catch(err){
          console.log("UseAuthError: ", err)
          setUser(null)
        }finally{
          setLoading(false)
        }
        });

      return fun;
    } , [loading])

  // localStorage.setItem('user', JSON.stringify(user));
  // const user = JSON.parse(localStorage.getItem('user'));
    const showAlert = (message, type = "default", title = "") => {
      Store.addNotification({
        title: title,
        message: message,
        type: type, //success, danger, warning 
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
    }
    const LoginFun = (email, password) => {
      setLoading(true)
        // console.log("Login Fun")
        signInWithEmailAndPassword(auth, email, password)
            .then(async (res) => {
                // if(res.user.emailVerified){
                  // console.log(res.user)
                  setIsLoggedIn(true)
                  showAlert("Login Success", "success")
                  setUser(res.user)
                  // getDetails(email)
                  navigate('/')
                
            })
            .catch(error => {
                console.log("UseAuthLoginError: ",error)
                alert(error.message)
            }).finally(() => {
                setLoading(false)
            })
    }
  useEffect(() => onSnapshot( query( collection(db, 'users')),
    (snapshot) => {
      setLoading(true)
      console.log("FetchCount: ",fetchCount)
      setFetchCount(fetchCount+1)
        const uarr = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }))
        let userstr = uarr.filter(item => item.email !== auth?.currentUser?.email)
        const pl = uarr.filter(item => item.email === auth?.currentUser?.email)
        let sr = pl[0]?.requests || []
        setProfile(pl[0])
        setUsersArr(userstr)
        // getConnects()
        setLoading(false)
    })
, [db, user])
    useEffect(() => onSnapshot(query(collection(db, 'forum'), orderBy('members','desc')), 
      (snapshot) => {
        setLoading(true)
        // console.log("Forum Listner")
        let tarr = []
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setforumsArr(tarr)
        setLoading(false)
      }), [db, user])
    useEffect(() => onSnapshot(query(collection(db, 'courses'), orderBy('on','desc')), 
      (snapshot) => {
        setLoading(true)
        let tarr = []
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        // console.log("coursees: ", tarr)
        setCoursesArr(tarr)
        setLoading(false)
      }), [db, user])
    useEffect(() => onSnapshot(query(collection(db, 'study'), orderBy('on','desc')), 
      (snapshot) => {
        setLoading(true)
        let tarr = []
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        // console.log("coursees: ", tarr)
        setStudyArr(tarr)
        setLoading(false)
      }), [db, user])

    

    useEffect(() => onSnapshot(
                  query(collection(db, 'connects'),
                  orderBy('lastMessageTimestamp','desc')
                  // where('users','array-contains' , auth?.currentUser?.email || "123" ),
                  ), //orderBy('lastMessageTimestamp','desc')
      (snapshot) => {
        setLoading(true)
        console.log("GetConnects")
        let tarr = []
        let tarrId = []
        snapshot.docs.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
          let a = doc.data().users[0]
          let b = doc.data().users[1]
          // console.log(doc.data())
            tarrId.push(a)
            tarrId.push(b)
          console.log("a:b:: ",tarrId )
        });
        // console.log("tarr-length-connects: ", tarr.length, tarr, tarrId)
        let tarrIdtmp =  [...new Set(tarrId)].filter((item) => item !== auth?.currentUser?.email)
        console.log("tarrIdtmp:", tarrIdtmp)
        setConnects(tarr)
        setConnectsIds(tarrIdtmp)

        setLoading(false)
      }), [db, user])


    const getConnects = async() => {
      try{
        setLoading(true)
        const q = query(collection(db, "connects"), orderBy('lastMessageTimestamp','desc'))
        // .then(
        //   res => {
        //     let tarr = res.data()
        //     console.log("ConnectsTarr: ", tarr)
        //   }
        // )
        const querySnapshot = await getDocs(q);
        let tarr = []
        querySnapshot.forEach((doc) => {
          tarr.push({
            id: doc.id,
            ...doc.data()
          })
        });
        setConnects(tarr)
        // console.log("tarr: ", tarr)
      }catch(err){
        console.log("GetConnectsError: ", err)
      }finally{
        setLoading(false)
      }
    }

    const signOutfun = () => {
      setLoading(true)
      signOut(auth).then(() => {
        setUser(null)
        setProfile(null)
        setIsLoggedIn(false)
        navigate('/')
         showAlert("Successfully Signed out", "success")
      })
      .catch(error => {
          console.log("UseAuthSignOutError: ", error)
      }).finally(() => {
        setLoading(false)
      })
    }
    return (
        <AuthContext.Provider 
        value={
          { user,
            profile,
            loading,
            isLoggedIn,
            error,
            mentorList,
            setLoading,
            setMentorList,
            sRequested,
            studentList,
            usersList,
            connects,
            getConnects,
            setConnects,
            setSRequested,
            LoginFun,
            signOutfun,
            showAlert,

            forumsArr,
            usersArr,
            connectsIds,
            coursesArr,
            studyArr
        }
        } >
          {children}
        </AuthContext.Provider>
      )
    }
    
    export default function useAuth(){
        return useContext(AuthContext);
    }