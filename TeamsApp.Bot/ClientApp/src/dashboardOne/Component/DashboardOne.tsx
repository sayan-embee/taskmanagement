import React from 'react'
import { Loader } from '@fluentui/react-northstar';
import "../../meeting/styles.scss"
import "../../dashboardTwo/style.css"
import { GetPersonalDashboardMeetingDetails, getUserProfileAPI } from '../../apis/APIList';
import Nodata from '../../conferenceRoomUtil/Nodata.svg'
import TableRow from './TableRow';




type MyState = {
  // data: any[];
  // EmailId: any;
  expanded: any;
  isOpen: boolean[];
}
interface MyProps {
  history?: any;
  location?: any;
  data: any[];
  loading: boolean;
}



class DashboardOne extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      // data: [],
      // EmailId: "",
      expanded: "",
      isOpen: []
    };
  }


  componentDidMount() {
    this.initializeIsOpenArray()
  }

  initializeIsOpenArray = () => {
    const flexarr = [];
    for (let i = 0; i < this.props.data.length; i++) {
      flexarr.push(false)
    }
    this.setState({
      isOpen: flexarr
    })
  }

  toggleExpand = (i: any) => {
    const tempArr = [...this.state.isOpen];
    tempArr[i] = !tempArr[i];
    this.setState({
      isOpen: tempArr
    })
  }

  elip=(text:string)=>{
    var max = 35;
    return text.length > max ? text.substring(0, max) + '...' : text
  }

  render() {
    return (
      <div>
      {!this.props.loading ? 
        <>
        <div className='mainPadding'>
        {this.props.data && (this.props.data.length > 0) ?
          <table className="tableDesign" width={'100%'}>
            <thead className='tableDesHead'>
              
              <tr>
              <th style={{width:"1%"}}></th>
                <th style={{ width: "15%", fontSize:"12px"  }}>Meeting Type</th>
                <th style={{ width: "28%" , fontSize:"12px" }}>Meeting Name</th>
                <th style={{ width: "8%", textAlign: "center" , fontSize:"12px" }}>Scheduled No.<br/> of Meetings<br/>(Anchor)</th>
                <th style={{ width: "8%", textAlign: "center" , fontSize:"12px" }}>Conducted No.<br/> of Meetings<br/>(Anchor)</th>
                <th style={{ width: "8%", textAlign: "center", fontSize:"12px"  }}>Uploaded No.<br/> of Document </th>
                <th style={{ width: "8%", textAlign: "center" , fontSize:"12px" }}>Invited No.<br/> of Meetings<br/>(KP/P)</th>
                <th style={{ width: "8%", textAlign: "center" , fontSize:"12px" }}>Total Time<br/> Spent (Hrs)<br/>(Anchor)</th>
                <th style={{ width: "8%", textAlign: "center" , fontSize:"12px" }}>Attended No. of Meetings<br/>(KP/P)</th>
                <th style={{ width: "8%", textAlign: "center" , fontSize:"12px" }}>Total Time<br/> Spent (Hrs)<br/>(KP/P)</th>
              </tr>
            </thead>
                <tbody>
                  {this.props.data.map((load: any, i: any) => {
                    return (
                      <>
                        {/* <tr className='nestedTableRow' onClick={() => { this.toggleExpand(i) }} style={{ cursor: "pointer" }}>
                          <td style={{ width: "1%" }}>{this.state.isOpen[i] ?  <span style={{color:"red"}}>-</span> : <span style={{color:"green"}}>+</span>}</td>
                          <td style={{ width: "15%" }} className="tableAccordion">{load.meetingType}</td>
                          <td style={{ width: "28%" }}></td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalScheduledMeetingsAnchor}</td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalConductedMeetingsAnchor}</td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalDocumentUploaded}</td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalParticipant}</td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalTimeSpentAnchor}</td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalAttendedParticipant}</td>
                          <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalTimeSpentParticipant}</td>
                        </tr> */}
                        <TableRow load={load} cells={
                          <>
                             <td style={{ width: "15%" }} className="tableAccordion">{load.meetingType}</td>
                          <td style={{ width: "28%" }}></td>
                          <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalScheduledMeetingsAnchor}</td>
                          <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalConductedMeetingsAnchor}</td>
                          <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalDocumentUploaded}</td>
                          <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalParticipant}</td>
                          {load.totalTimeSpentAnchor ? <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalTimeSpentAnchor}</td>
                          :<td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>0</td>}
                          {/* <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalTimeSpentAnchor}</td> */}

                          <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalAttendedParticipant}</td>

                          {load.totalTimeSpentParticipant ? <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{load.totalTimeSpentParticipant}</td> 
                          : <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>0</td>}
                          </>
                        }>
                        <tr>
                            <td colSpan={10} style={{ padding: "0" }}>
                              <table width={'100%'}>
                                {load.titleWiseData.map((title: any) => {
                                  return (
                                    <>
                                      <tr className='nestedTableRow'>
                                        <td style={{ width: "1%" }}></td>
                                        <td style={{ width: "15%" }}></td>
                                        <td style={{ width: "28%" }} className="tableAccordion" title={title.meetingTitle}>{this.elip(title.meetingTitle)}</td>  
                                        {/* {title.meetingTitle} */}
                                        <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalScheduledMeetingsAnchor}</td>
                                        <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalConductedMeetingsAnchor}</td>
                                        <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalDocumentUploaded}</td>
                                        <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalParticipant}</td>
                                        {title.totalTimeSpentAnchor ? <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalTimeSpentAnchor}</td>
                                        :<td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>0</td>}
                                        {/* <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalTimeSpentAnchor}</td> */}

                                        <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalAttendedParticipant}</td>

                                        {title.totalTimeSpentParticipant ? <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalTimeSpentParticipant}</td>
                                        :<td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>0</td>}
                                        {/* <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{title.totalTimeSpentParticipant}</td> */}
                                      </tr>
                                      
                                    </>
                                  )
                                }
                                )
                                }
                              </table>
                            </td>
                          </tr>
                        </TableRow>

                        {/*  child */}
                        {/* {this.state.isOpen[i] && load.titleWiseData && load.titleWiseData.length > 0 ?
                          <tr>
                            <td colSpan={10} style={{ padding: "0" }}>
                              <table width={'100%'}>
                                {load.titleWiseData.map((title: any) => {
                                  return (
                                    <>
                                      <tr className='nestedTableRow'>
                                        <td style={{ width: "1%" }}></td>
                                        <td style={{ width: "15%" }}></td>
                                        <td style={{ width: "28%" }} className="tableAccordion" title={title.meetingTitle}>{this.elip(title.meetingTitle)}</td>  
                                        
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalScheduledMeetingsAnchor}</td>
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalConductedMeetingsAnchor}</td>
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalDocumentUploaded}</td>
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalParticipant}</td>
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalTimeSpentAnchor}</td>
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalAttendedParticipant}</td>
                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{title.totalTimeSpentParticipant}</td>
                                      </tr>
                                    </>
                                  )
                                }
                                )
                                }
                              </table>
                            </td>
                          </tr> : null
                        } */}

                        {/*  child */}


                      </>
                    )

              }
              )
              }
            </tbody> 
          </table> : <div className='imgMainDiv'>
                                            <img className='noDataImg' src={Nodata} alt="No data img"/>
                                            <br/>
                                            <b>There aren&rsquo;t any meeting records to show. Try with different date range.</b>
                                            </div>}


              <br />
            </div>
          </>
          : <Loader styles={{ margin: "50px" }} label="Loading..." />
        }
      </div>

    );
  }
}

export default DashboardOne;
