import React, { useState, useEffect } from 'react';
import {
    FaUserFriends,
    FaBars,
    FaUserAlt,
    FaUserTie,
    FaUserShield,
    FaUsers,
    FaThList
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { GetDivisionsTest, GetMyReporteesTest, GetProfileTest, getUserProfileAPI } from '../apis/APIList';
import axios from 'axios';
import Nodata from '../conferenceRoomUtil/Nodata.svg'
const menuItem = [
    {
        path:"/Personal",
        name:"Personal",
        icon:<FaUserFriends title='Personal'/>
    },
    {
        path:"/DivisionHeadDash",
        name:"Division Head",
        icon:<FaUserAlt title='Division Head'/>
    },
    {
        path:"/ReportingDash",
        name:"Reporting Manager",
        icon:<FaUserTie title='Reporting Manager'/>
    },
    {
        path:"/PilGlobinDash",
        name:"PilGlobin_MD_Chairman",
        icon:<FaUserShield title='PilGlobin_MD_Chairman'/>
    },
    {
        path:"/ConferenceRoomUtilDash",
        name:"Conference Room",
        icon:<FaUsers title='Conference Room'/>
    },
    {
        path:"/FeedbackDash",
        name:"Feedback",
        icon:<FaThList title='Feedback'/>
    }
]
const SideBar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(true);
    const[dropdownitems, setdropdownitems] = useState(menuItem);
    const[divisions ,setdivisions] = useState('');
    const[EmailId , setEmailId] = useState('');


    useEffect(()=>{
        getUserProfile();
        console.log("menuuuuuuuuu useEffect",menuItem);
        // getToken();
    },[])

    //auth token--------------
    // const getToken=()=>{
    //     console.log("authentication calling")
    //     var body = {
    //         'Content-Type': "application/x-www-form-urlencoded",
    //         grant_type: "password",
    //         username:"Prod_meetpro",
    //         password:"m#+wlxi-wu3EsTecrIgahacr",  
    //     }
    //       axios.get('https://meetpro.pilportal.com:11692/token', body
    //       )
    //         .then((response) => {
    //         console.log("token dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",response.data);
    //       })
    //       .catch((error)=>{
    //         console.log(error)
    //       })
    // }

    const getUserProfile = () => {
     getUserProfileAPI().then((res) => {
      if (res && res.data && res.data.mail) {
        setEmailId(res.data.mail);
        getMyDivisions(res.data.mail);
        getMyReportees(res.data.mail);
        getMyProfile(res.data.mail);
        // getMyDivisions('PCPATEL@PIDILITE.COM');
        // getMyReportees('PCPATEL@PIDILITE.COM');
        // getMyProfile('PCPATEL@PIDILITE.COM');
        
      }
  })
}
const getMyReportees = (email) => {
    GetMyReporteesTest(email).then((res) => {
        if(res && res.data && res.data.length > 0){
        }
        else{
            setdropdownitems(dropdownitems.filter((data)=>data.name !== "Reporting Manager"))
            //let RMindex  = this.state.dropdownitems.indexOf('Reporting Manager');
            //this.state.dropdownitems.splice(RMindex,1);
        }
    })
  }
  const getMyDivisions = (email) => {
    console.log("email under get division",email)
    GetDivisionsTest(email).then((res) => {

    console.log("getMyDivisions----------->",res.data.filter((el)=>el.divisionName).map((m)=>m.divisionName).toString())
    
        if (res && res.data && res.data.length > 0) {
            let divisions = res.data.filter((el)=>el.divisionName).map((m)=>m.divisionName).toString()
            // let division = "";
            // res.data.forEach((d) => {
            //     if (d && d.divisionName) {
            //         division += (division != "" ? "," : "") + d.divisionName;
            //     }
            // });
            setdivisions(divisions)
            
        }
        
        else {
            setdropdownitems(dropdownitems.filter((data)=>data.name !== "Division Head"))
        }
  
    }) 
  }
  
  const getMyProfile = (email) => {
    GetProfileTest(email).then((res) => {
        if (res && res.data && res.data.length > 0) {
            // Checking for PilGlobin_MD_Chairman Start
            if (res?.data[0]?.divisionName && res?.data[0]?.verticalName && 
                res?.data[0]?.pwl && res?.data[0]?.designation &&
                res?.data[0]?.divisionName?.trim() === "Directors Department" &&
                res?.data[0]?.verticalName?.trim() === "Directors Department" &&
                ((res?.data[0]?.pwl?.trim() === 1500 || res?.data[0]?.pwl?.trim() === "1500") ||
                    (res?.data[0]?.designation?.trim() === "Executive Assistant" || res?.data[0]?.designation?.trim() === "Secretary" || res?.data[0]?.designation?.trim() === "Executive Assistant - Chairman")
                )) {
            }
            else {
            setdropdownitems(dropdownitems.filter((data)=>data.name !== "PilGlobin_MD_Chairman"))
                // let pilglobinindex = dropdownitems.indexOf('Pil Globin');
                //this.state.dropdownitems.splice(pilglobinindex,1);
            }
            // Checking for PilGlobin_MD_Chairman End 
            // Checking for Admin Team- conf room utilizati Start
            if (res.data[0].divisionName && res.data[0].verticalName && res.data[0].pwl &&
                res.data[0].divisionName.trim() === "Human Resource" &&
                res.data[0].verticalName.trim() === "Administration" &&
                (
                    (
                        res.data[0].pwl.trim() === "PWL - 4B" || res.data[0].pwl.trim() === "PWL - 4A" || res.data[0].pwl.trim() === "PWL - 5B" ||
                        res.data[0].pwl.trim() === "PWL - 5A" || res.data[0].pwl.trim() === "PWL - 6B" || res.data[0].pwl.trim() === "PWL - 6A" ||
                        res.data[0].pwl.trim() === "PWL - 7B" || res.data[0].pwl.trim() === "PWL - 7A" || res.data[0].pwl.trim() === "PWL - 8"
                    ) //  (PWL - 4B, PWL - 4A, PWL - 5B, PWL - 5A, PWL - 6B, PWL - 6A, PWL - 7B, PWL - 7A, PWL - 8)
                )
            ) { }
            else {
            setdropdownitems(dropdownitems.filter((data)=>data.name !== "Conference Room"))
                // let confRoominindex = dropdownitems.indexOf('Conference Room');
                //this.state.dropdownitems.splice(confRoominindex,1);
            }
            // Checking for Admin Team- conf room utilizati End 
            // Checking for Feedback Start
            if (res.data[0].verticalName.trim() === "pilglobinteam") {
            }
            else {
            setdropdownitems(dropdownitems.filter((data)=>data.name !== "Feedback"))
                // let Feedbackinindex = this.state.dropdownitems.indexOf('Feedback');
                //this.state.dropdownitems.splice(Feedbackinindex,1);
            }
            // Checking for Feedback Start
        }
    })
  }

// const getMyProfile = (email) => {
//     console.log("getMyProfile===========",email)
//     GetProfileTest(email).then((res) => {
        
//         if (res && res.data) {
//             // Checking for PilGlobin_MD_Chairman Start
//             if (res?.data?.DivisionDesc 
//                 // && res.data.verticalName 
//                 && res?.data?.pwl 
//                 && res?.data?.Designation 
//                 && res?.data?.DivisionDesc.trim() === "Directors Department" 
//                 // && res.data.verticalName.trim() === "Directors Department" &&
                
//                 ((res?.data?.pwl?.trim() === 1500 || res?.data?.pwl?.trim() === "1500") ||
//                     (res?.data?.Designation?.trim() === "Executive Assistant" ||
//                      res?.data?.Designation?.trim() === "Secretary" || 
//                      res?.data?.designation?.trim() === "Executive Assistant - Chairman")
//                 )) {
  
//             }
//             else {
//             setdropdownitems(dropdownitems.filter((data)=>data.name !== "PilGlobin_MD_Chairman"))
//                 // let pilglobinindex = dropdownitems.indexOf('Pil Globin');
//                 //this.state.dropdownitems.splice(pilglobinindex,1);
//             }
//             // Checking for PilGlobin_MD_Chairman End 
  
//             // Checking for Admin Team- conf room utilizati Start
//             if (res.data.DivisionDesc 
//                 // && res.d.verticalName 
//                 // && res.d.pwl 
//                 && res.d.DivisionDesc.trim() === "Human Resource" 
//                 // && res.data.verticalName.trim() === "Administration" 
//                 &&
//                 (
//                     (
//                         res.data.pwl.trim() === "PWL - 4B" || res.data.pwl.trim() === "PWL - 4A" || res.data.pwl.trim() === "PWL - 5B" ||
//                         res.data.pwl.trim() === "PWL - 5A" || res.data.pwl.trim() === "PWL - 6B" || res.data.pwl.trim() === "PWL - 6A" ||
//                         res.data.pwl.trim() === "PWL - 7B" || res.data.pwl.trim() === "PWL - 7A" || res.data.pwl.trim() === "PWL - 8"
//                     ) //  (PWL - 4B, PWL - 4A, PWL - 5B, PWL - 5A, PWL - 6B, PWL - 6A, PWL - 7B, PWL - 7A, PWL - 8)
//                 )
//             ) { }
//             else {
//             setdropdownitems(dropdownitems.filter((data)=>data.name !== "Conference Room"))

//                 // let confRoominindex = dropdownitems.indexOf('Conference Room');
//                 //this.state.dropdownitems.splice(confRoominindex,1);
//             }
//             // Checking for Admin Team- conf room utilizati End 
  
//             // Checking for Feedback Start
//             if (res.data[0].verticalName.trim() === "pilglobinteam") {
  
//             }
//             else {
//             setdropdownitems(dropdownitems.filter((data)=>data.name !== "Feedback"))

//                 // let Feedbackinindex = this.state.dropdownitems.indexOf('Feedback');
//                 //this.state.dropdownitems.splice(Feedbackinindex,1);
//             }
//             // Checking for Feedback Start
  
//         }
  
  
//     })
//   }
    //sidenave open and close toggle
    
    const toggle = () => setIsOpen (!isOpen);

    return (
        
        <div className=""style={{display:"flex"}}>
           <div style={{width: isOpen ? "240px" : "50px"}} className="sidebar">
            <div className='sidebar-wrap2 datepickerBoxShadow'>
               <div className="top_section">
                   <div style={{marginLeft: isOpen ? "0px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   dropdownitems.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   )) 
                }
            </div>
           </div>
           <main>{children}</main>
        </div>
    );
};
export default SideBar;