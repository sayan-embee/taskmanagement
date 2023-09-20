import React from 'react'
import { Datepicker, Flex, Button, Loader } from '@fluentui/react-northstar';
import "../../meeting/styles.scss"
import './../style.css'
import { GetDashboardPersonalTaskAssignToUser, getUserProfileAPI } from '../../apis/APIList';
import Nodata from '../../conferenceRoomUtil/Nodata.svg'



interface State {
  isOpen: boolean[];
  // data: any[];
  // EmailId: any;
  // isLoading: boolean;  
}

interface Props {
  history?: any;
  location?: any;
  data: any[];
  Loading: boolean;
}
class DashboardTwo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: [],
      // data: [],
      // EmailId: "",
      // isLoading: true,
    };
  }

  componentDidMount = () => {
    this.initializeIsOpenArray();
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
    var max = 45;
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
                      <th style={{ width: "14%", fontSize: "12px" }}>Meeting Type</th>
                      <th style={{ width: "30%", fontSize: "12px" }}>Meeting Name</th>
                      <th style={{ width: "8%", fontSize: "12px", textAlign: "center" }}>Total Task</th>
                      <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Open and Behind<br/> Schedule</th>
                      <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Open and<br/> in progress</th>
                      <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Closed</th>
                      <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Behind Schedule<br/>(&#37;)</th>
                      <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>In Progress<br/>(&#37;)</th>
                      <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Closed<br/>(&#37;)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.props.data.map((load: any, i: any) => {
                      return (
                        <>
                          <tr className='nestedTableRow' onClick={() => { this.toggleExpand(i) }} style={{ cursor: "pointer" }} >
                            <td style={{ width: "1%" }}>{this.state.isOpen[i] ?  <span style={{color:"red"}}>-</span> : <span style={{color:"green"}}>+</span>}</td>
                            <td style={{ width: "14%" }} className="tableAccordion">{load.meetingType}</td>
                            <td style={{ width: "30%" }}></td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalTask}</td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalBehindSchedule}</td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalInProgress}</td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalClosed}</td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalBehindSchedulePercent}</td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalInProgressPercent}</td>
                            <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{load.totalClosedPercent}</td>
                          </tr>

                          {/*  child */}
                          {this.state.isOpen[i] && load.titleWiseData && load.titleWiseData.length > 0 ?
                            <tr>
                              <td colSpan={10} style={{ padding: "0" }}>
                                <table width={'100%'}>
                                  {load.titleWiseData.map((title: any) => {
                                    return (
                                      <>
                                        <tr className='nestedTableRow'>
                                          <td style={{ width: "1%" }}></td>
                                          <td style={{ width: "14%" }}></td>
                                          <td style={{ width: "30%" }} className="tableAccordion" title={title.meetingTitle}>{this.elip(title.meetingTitle)}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalTask}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalBehindSchedule}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalInProgress}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalClosed}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalBehindSchedulePercent}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalInProgressPercent}</td>
                                          <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{title.totalClosedPercent}</td>
                                        </tr>
                                      </>
                                    )
                                  }
                                  )
                                  }
                                </table>
                              </td>
                            </tr> : null
                          }

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
                                            <b>There aren&rsquo;t any task records to show. Try with different date range.</b>
                                            </div>}
              <br />
            </div>
          </>
          : <Loader styles={{ margin: "50px" }} label="Loading..." />}

      </div>
    );
  }
}

export default DashboardTwo;