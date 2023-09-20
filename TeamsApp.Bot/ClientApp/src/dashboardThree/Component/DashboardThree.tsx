import React from 'react'
import { Datepicker, Flex, Button, Loader } from '@fluentui/react-northstar';
import { getUserProfileAPI, GetDashboardPersonalTaskAssignByUser } from '../../apis/APIList';
import * as microsoftTeams from "@microsoft/teams-js";
import Nodata from '../../conferenceRoomUtil/Nodata.svg'
import TableRow from '../../dashboardOne/Component/TableRow';

const base_URL = window.location.origin


type State = {
  isOpenOne: boolean[];
  isOpenTwo: boolean[][];
  // data: any[];
  EmailId: any;
  OpenAndBehindPop: any;   
}
interface Props {
  history?: any;
  location?: any;
  data:any[];
  Loading:boolean;
  EmailId:string
}

interface ITaskInfo {
  title?: string;
  height?: number;
  width?: number;
  url?: string;
  fallbackUrl?: string;
}
class DashboardThree extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenOne: [],
      isOpenTwo: [],
      EmailId: "",
      OpenAndBehindPop: base_URL + '/openandbehindpopuppersonal',
    };
  }

  componentDidMount = () => {
    microsoftTeams.initialize();
    // if(this.props.data.length > 0) {
    //   this.intialiizeIsOpenArray()
    // }
    
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if(prevProps.Loading && !this.props.Loading) {
      console.log("Called")
      this.intialiizeIsOpenArray();
    }
    else if(prevProps.data !== this.props.data){
      this.intialiizeIsOpenArray();
    }
  }

  intialiizeIsOpenArray = () => {
    const arr1: boolean[] = [];
    const arr2: boolean[][] = [];
    this.props.data.forEach((item: any) => {
      arr1.push(false)
      const arr4: boolean[] = []
      item.titleWiseData.forEach(() => {
        arr4.push(false)
      })
      arr2.push(arr4)
    })
    this.setState({
      isOpenOne: arr1,
      isOpenTwo: arr2,
    })
  }


  toggleTop = (i: any) => {
    console.log("isopennn", this.state.isOpenOne)
    const tempArr = [...this.state.isOpenOne];
    tempArr[i] = !tempArr[i];
    this.setState({
      isOpenOne: tempArr
    })
  }

  toggleInner = (i: number, j: number) => {
    console.log("isopennn", this.state.isOpenTwo)
    const tempArr: boolean[][] = [];
    this.state.isOpenTwo.forEach((arr) => {
      const temp2: boolean[] = [];
      arr.forEach((value) => {
        temp2.push(value)
      })
      tempArr.push(temp2)
    })
    tempArr[i][j] = !tempArr[i][j];
    this.setState({
      isOpenTwo: tempArr
    })
  }

  popupModule = ( AssignedToEmail : string, MeetingTitleId : number, meetingTypeId : number, taskType : string) => {
    console.log("clicked",this.state.OpenAndBehindPop)
    let taskInfo: ITaskInfo = {
        url: `${this.state.OpenAndBehindPop}?assigned=${AssignedToEmail}&login=${this.props.EmailId}&meeting=${MeetingTitleId}&meetid=${meetingTypeId}&tsktyp=${taskType}`,
        title: "Assigned Task",
        height: 350,
        width: 600,
        fallbackUrl: this.state.OpenAndBehindPop,
    }
    microsoftTeams.tasks.startTask(taskInfo);
}

elip=(text:string)=>{
  var max = 35;
  return text.length > max ? text.substring(0, max) + '...' : text
}

  render() {
    return (
      <div>
        {!this.props.Loading ?
          <>
            <div className='mainPadding'>
              
              {this.props.data && (this.props.data.length > 0)?
              <table className="tableDesign" width={'100%'}>
                <thead className='tableDesHead'>
                  <tr>
                    <th style={{ width: "1%" }}></th>
                    <th style={{ width: "10%", fontSize:"12px"}}>Meeting Type</th>
                    <th style={{ width: "22%", fontSize:"12px"}}>Meeting Name</th>
                    <th style={{ width: "10%", textAlign: "center", fontSize:"12px" }}>Employee Name</th>
                    <th style={{ width: "8%",  textAlign: "center", fontSize:"12px"}}>Total Task</th>
                    <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Open and <br/>Behind Schedule</th>
                    <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Open and<br/>in Progress</th>
                    <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Closed</th>
                    <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Behind Schedule<br/>(&#37;)</th>
                    <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>In Progress<br/>(&#37;)</th>
                    <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Closed<br/>(&#37;)</th>
                  </tr>
                </thead>

                
                <tbody>
                  {this.props.data.map((load: any) => {
                    console.log("props data inside map for D3",this.props.data)
                    console.log(this.state.isOpenTwo)
                    return (
                      <>
                        <TableRow load={load} cells={
                          <>
                           <td style={{ width: "10%" }} className="tableAccordion">{load.meetingType}</td>
                          <td style={{ width: "22%" }}></td>
                          <td style={{ width: "10%" }}></td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalTask}</td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalBehindSchedule}</td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalInProgress}</td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalClosed}</td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalBehindSchedulePercent}</td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalInProgressPercent}</td>
                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalClosedPercent}</td>
                          </>
                        }>
                          <tr>
                            <td colSpan={12} style={{ padding: "0" }}>
                              <table width={'100%'}>
                                {load.titleWiseData.map((title: any) => {

                                  return (
                                    <>
                                      <TableRow load={title} cellsBefore={<> <td style={{ width: "10%" }}></td></>} cells={
                                        <>
                                        
                                        <td style={{ width: "22%" }} className="tableAccordion" title={title.meetingTitle}>{this.elip(title.meetingTitle)}</td>
                                        <td style={{ width: "10%" }}></td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalTask}</td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalBehindSchedule}</td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalInProgress}</td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalClosed}</td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalBehindSchedulePercent}</td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalInProgressPercent}</td>
                                        <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalClosedPercent}</td>
                                        </>
                                      }>
                                        
                                        <tr>
                                        <td colSpan={12} style={{ padding: "0" }}>
                                          <table width={'100%'}>

                                            {title.employeeWiseData && title.employeeWiseData.length > 0 ? 

                                              title.employeeWiseData.map((data3: any) => {
                                                return (
                                                  <>
                                                    <tr className='nestedTableRow'>
                                                      <td style={{ width: "1%" }}></td>
                                                      <td style={{ width: "10%" }}></td>
                                                      <td style={{ width: "22%" }}></td>
                                                      <td style={{ width: "10%", textAlign: "center", fontSize:"12px"}}>{data3.assignedTo}</td>
                                                      <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{data3.totalTask}</td>
                                                      {data3.totalBehindSchedule !==0 ? 
                                                      <td className='textColorD3' title='View Task' onClick={() => this.popupModule(data3.assignedToEmail,data3.meetingTitleId,data3.meetingTypeId,'BEHINDSCHEDULE')} style={{ width: "8%", textAlign: "center", cursor:"pointer" }}>{data3.totalBehindSchedule}</td> :
                                                      <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{data3.totalBehindSchedule}</td>}
                                                      {data3.totalInProgress !==0 ? 
                                                      <td className='textColorD3'  title='View Task' onClick={() => this.popupModule(data3.assignedToEmail,data3.meetingTitleId,data3.meetingTypeId,'INPROGRESS')} style={{ width: "8%", textAlign: "center", cursor:"pointer"}}>{data3.totalInProgress}</td> :
                                                      <td style={{ width: "8%", textAlign: "center", fontSize:"12px"}}>{data3.totalInProgress}</td>
                                                      }
                                                      {data3.totalClosed !== 0  ? 
                                                      <td className='textColorD3'  title='View Task' onClick={() => this.popupModule(data3.assignedToEmail,data3.meetingTitleId,data3.meetingTypeId,'CLOSED')} style={{ width: "8%", textAlign: "center", cursor:"pointer"}}>{data3.totalClosed}</td> :
                                                      <td style={{ width: "8%", textAlign: "center", fontSize:"12px"}}>{data3.totalClosed}</td>
                                                      }
                                                      <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{data3.totalBehindSchedulePercent}</td>
                                                      <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{data3.totalInProgressPercent}</td>
                                                      <td style={{ width: "8%", textAlign: "center" , fontSize:"12px"}}>{data3.totalClosedPercent}</td>
                                                    </tr>
                                                  </>
                                                )
                                              }
                                              )

                                            :null
                                          }
                                            
                                          </table>
                                        </td>
                                      </tr>
                                        
                                      </TableRow>
                                      
                                    </>
                                  )

                                }
                                )
                                }
                              </table>
                            </td>

                          </tr>
                        </TableRow>
                      </>
                    )

                  }
                  )
                  }
                </tbody> 

              </table> :  <div className='imgMainDiv'>
                                            <img className='noDataImg' src={Nodata} alt="No data img"/>
                                            <br/>
                                            <b>There aren&rsquo;t any task records to show. Try with different date range.</b>
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

export default DashboardThree;