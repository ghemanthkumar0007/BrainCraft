import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/UseAuth'
import { useSortBy, useTable, usePagination } from "react-table";
import {Link} from 'react-router-dom'
import { async } from '@firebase/util';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../database/firebase';

function Connects() {
  const { connects, mentorList, studentList, profile, loading, getConnects} = useAuth()
  console.log("connectsPage: ", connects)

  const [listArr, setlistArr] = useState([])
  
  const getMentorDetailsByMail = (email) => {
    const td =  mentorList?.filter((item) => item.email === email)[0]
    // console.log("td: ",td)
    return td
  }
  const getStudentDetailsByMail = (email) => {
    const td =  studentList?.filter((item) => item.email === email)[0]
    // console.log("td: ",td)
    return td
  }
  // console.log("studentList: ", studentList)
  // console.log("de: ", getStudentDetailsByMail(connects[0].sEmail))

  const StudentFun = () => {

    const data = React.useMemo(() => [...connects], [connects]);
    const cols = [
        {
            Header: "Photo",
            accessor: "photo",
            Cell: props => {
                const { value, cell, row } = props;
                return (
                    <div className='w-16 h-16 md:w-32 md:h-32 m-2 '>
                        <img loading={"lazy"} src={getMentorDetailsByMail(row.original.mEmail).photo} className="w-16 h-16  md:h-32 md:w-32  object-cover rounded-full" alt="profile" />
                    </div>
                );
              }
          },
        {
          Header: "Name",
          accessor: "name",
          Cell: props => {
              const { value, cell, row } = props;
            //   console.log(" domain 1 value: ",value)
              // {...cell.getCellProps()} className={`is-${cell.column.id}`}
              return (
                <Link to={`/details/${row.original.mEmail}`} state={row.original}>
                  <h1 className="md:w-64 text-neutral-600 text-secondary font-md text-base hover:underline capitalize">{getMentorDetailsByMail(row.original.mEmail).name} </h1>
                </Link>
              );
            }
        },
        {
          Header: "Domain 1",
          accessor: "domain1",
          Cell: props => {
            const { value, cell, row } = props;
          //   console.log(" domain 1 value: ",value)
            // {...cell.getCellProps()} className={`is-${cell.column.id}`}
            return (
              <p className='capitalize '> {getMentorDetailsByMail(row.original.mEmail).domain1.title}</p>
            );
          }
        },
        {
          Header: "Domain 2",
          accessor: "domain2",
          Cell: props => {
            const { value, cell, row } = props;
            // {...cell.getCellProps()} className={`is-${cell.column.id}`}
            return (
              <p className='capitalize '> {getMentorDetailsByMail(row.original.mEmail).domain2.title}</p>
            );
          }
        },
        {
            Header: "Message",
            accessor: "message",
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: props => {
              const { value, cell, row } = props;
             if(value === "approved"){
                return (
                  <p className='text-green-500 p-2 '>{value}</p>
                )
              }else if(value === "rejected"){
                return (
                  <p className='text-red-500 p-2 '>{value}</p>
                )
              }else{
                return (
                  <p className='p-2 '>{value}</p>
                )
              }
            }
        },
      ]
    const columns = React.useMemo(
        () => cols,[]
      );

      const tablehook = hooks => {
        hooks.visibleColumns.push(cols => [
          ...cols,
        ]);
      };
      const tableInstance = useTable({ columns, data }, tablehook, useSortBy, usePagination);
      const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, 
          canNextPage, canPreviousPage, pageOptions, state, prepareRow, setPageSize } = tableInstance;
    
      const { pageIndex, pageSize } = state;
    
      const isEven = idx => {
        return !(idx & 1);
      };
    return (
      <div className=''>
        <div className="w-full p-5">
            <div className="w-full mt-5 sm:p-5 sm:px-16 md:px-32">
              <div className="p-2 text-start">
                  Show {"  "}
                  <select value={pageSize} className="border p-1"
                    onChange={(e) => setPageSize(Number(e.target.value))} >
                      {[10, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                </div>
              {/* table Start */}
              <div className="overflow-x-auto">
                <table {...getTableProps()} className="shadow  rounded-lg w-full">
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, idx) => (
                          <th {...column.getHeaderProps(column.getHeaderProps(column.getSortByToggleProps()))} className={`bg-secondary p-2 text-base text-white ${idx === 0 ? "rounded-tl": ""} ${idx === cols.length-1? "rounded-tr": ""}`}>
                            {column.render("Header")}
                            {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row, ridx) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} className={`mb-2 border-b-2 border-neutral-100 font-md text-base ${ridx === (page.length - 1) ? "border-b-primary rounded-b": ""}`}>
                          {row.cells.map((cell, idx) => {
                            return (
                              <td {...cell.getCellProps()} className={isEven(idx) ? "text-neutral-600 p-3 bg-neutral-50 text-center capitalize" : " capitalize text-center text-neutral-600 p-3 "}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end p-3">
                <span className="p-1">
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </span>
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="bg-neutral-100 p-2 m-1 disabled:opacity-50">
                  Previous
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage} className="bg-neutral-100 p-2 m-1 disabled:opacity-50">
                  Next
                </button>
              </div>
              {/* table end  */}
              </div>
            </div>
      </div>
    )
  }
  const connArr = connects.filter((item) => item.mEmail === profile.email)
  // console.log("connArr: ",connArr)

  const MentorFun = () => {

    const approve = async(connectId, mail, msg) => {
      try{
          //console.log("Approve: ",connectId, mail, msg)
          setDoc(doc(db, 'connects', connectId), { 
            status: "approved",
            lastMessageTimestamp: serverTimestamp(),
            lastMessage: msg
          }, { merge: true });

          addDoc(collection(db, 'connects', connectId, "messages"), {
              timestamp: serverTimestamp(),
              email: mail,
              message: msg,
            });
      }catch(err){
        console.log("ApproveBtnError: ", err)
      }
    }
    const reject = async(connectId) => {
      // console.log("Reject: ",connectId)
      try{
        setDoc(doc(db, 'connects', connectId), { 
          status: "rejected"
        }, { merge: true });
      }catch(err){
        console.log("RejectBtnError: ", err)
      }
    }
    const data = React.useMemo(() => [...connArr], [connArr]);
    const cols = [
        {
            Header: "Photo",
            accessor: "photo",
            Cell: props => {
                const { value, cell, row } = props;
                return (
                    <div className='w-16 h-16 md:w-32 md:h-32 m-2 '>
                        <img loading={"lazy"} src={getStudentDetailsByMail(row.original.sEmail).photo} className="w-16 h-16  md:h-32 md:w-32  object-cover rounded-full" alt="profile" />
                    </div>
                );
              }
          },
        {
          Header: "Name",
          accessor: "name",
          Cell: props => {
              const { value, cell, row } = props;
            //   console.log(" domain 1 value: ",value)
              // {...cell.getCellProps()} className={`is-${cell.column.id}`}
              return (
                <Link to={`/details/${row.original.sEmail}`} state={row.original}>
                  <h1 className="md:w-64 text-neutral-600 text-secondary font-md text-base hover:underline capitalize">{getStudentDetailsByMail(row.original.sEmail).name} </h1>
                </Link>
              );
            }
        },
        {
          Header: "Domain 1",
          accessor: "domain1",
          Cell: props => {
            const { value, cell, row } = props;
          //   console.log(" domain 1 value: ",value)
            // {...cell.getCellProps()} className={`is-${cell.column.id}`}
            return (
              <p className='capitalize '> {getStudentDetailsByMail(row.original.sEmail).domain1.title}</p>
            );
          }
        },
        {
          Header: "Domain 2",
          accessor: "domain2",
          Cell: props => {
            const { value, cell, row } = props;
            // {...cell.getCellProps()} className={`is-${cell.column.id}`}
            return (
              <p className='capitalize '> {getStudentDetailsByMail(row.original.sEmail).domain2.title}</p>
            );
          }
        },
        {
            Header: "Message",
            accessor: "message",
        },
        {
            Header: "Action",
            accessor: "status",
            Cell: props => {
              const { value, cell, row } = props;
              // {...cell.getCellProps()} className={`is-${cell.column.id}`}
              // console.log("value:", value)
              if(value === "requested"){
                return (
                  <div className='flex flex-col items-center justify-center'>
                    <button className='p-2 m-1 bg-green-500 text-white rounded' onClick={() => approve(row.original.id, row.original.sEmail, row.original.message)}>
                      Approve
                    </button>
                    <button className='p-2 m-1 bg-red-500 text-white rounded' onClick={() => reject(row.original.id)}>
                      Reject
                    </button>
                  </div>
                )
              }else if(value === "approved"){
                return (
                  <p className='text-green-500 p-2 '>{value}</p>
                )
              }else if(value === "rejected"){
                return (
                  <p className='text-red-500 p-2 '>{value}</p>
                )
              }else{
                return (
                  <p className='p-2 '>{value}</p>
                )
              }
            }
        },
      ]
    const columns = React.useMemo(
        () => cols,[]
      );

      const tablehook = hooks => {
        hooks.visibleColumns.push(cols => [
          ...cols,
        ]);
      };
      const tableInstance = useTable({ columns, data }, tablehook, useSortBy, usePagination);
      const { getTableProps, getTableBodyProps, headerGroups, page, nextPage, previousPage, 
          canNextPage, canPreviousPage, pageOptions, state, prepareRow, setPageSize } = tableInstance;
    
      const { pageIndex, pageSize } = state;
    
      const isEven = idx => {
        return !(idx & 1);
      };
    return (
      <div className=''>
        <div className="w-full p-5">
            <div className="w-full mt-5 sm:p-5 sm:px-16 md:px-32">
              <div className="p-2 text-start">
                  Show {"  "}
                  <select value={pageSize} className="border p-1"
                    onChange={(e) => setPageSize(Number(e.target.value))} >
                      {[10, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                </div>
              {/* table Start */}
              <div className="overflow-x-auto">
                <table {...getTableProps()} className="shadow  rounded-lg w-full">
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column, idx) => (
                          <th {...column.getHeaderProps(column.getHeaderProps(column.getSortByToggleProps()))} className={`bg-secondary p-2 text-base text-white ${idx === 0 ? "rounded-tl": ""} ${idx === cols.length-1? "rounded-tr": ""}`}>
                            {column.render("Header")}
                            {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row, ridx) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} className={`mb-2 border-b-2 border-neutral-100 font-md text-base ${ridx === (page.length - 1) ? "border-b-primary rounded-b": ""}`}>
                          {row.cells.map((cell, idx) => {
                            return (
                              <td {...cell.getCellProps()} className={isEven(idx) ? "text-neutral-600 p-3 bg-neutral-50 text-center capitalize" : " capitalize text-center text-neutral-600 p-3 "}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end p-3">
                <span className="p-1">
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </span>
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="bg-neutral-100 p-2 m-1 disabled:opacity-50">
                  Previous
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage} className="bg-neutral-100 p-2 m-1 disabled:opacity-50">
                  Next
                </button>
              </div>
              {/* table end  */}
              </div>
            </div>
      </div>
    )
  }

  const dis = () => {

    // console.log("disProfile: ",profile)
    // console.log("mentorList: ",mentorList)
    // console.log("connects: ",connects)

    if( (loading === false) && (profile?.iam === 'student') && (mentorList.length>0) && (connects.length>0) ){
      return (<StudentFun />)
    }else if( (loading === false) && (profile?.iam === 'mentor') && (studentList.length>0) && (connects.length>0 ) ){
      return (<MentorFun />)
    }else if(loading === true){
      return <h1 className='text-center'>Loading</h1>
    }else if(profile?.iam === 'mentor'){
      return <h1 className='text-center'>No Requests</h1>
    }else if(profile?.iam === 'student'){
      return <h1 className='text-center'>No Mentors </h1>
    }else{
      return <h1 className='text-center'>Empty</h1>
    }
  }
  return (
    <div>
      {/* Connects */}
      {dis()}
      
      
    </div>
  )
}

export default Connects