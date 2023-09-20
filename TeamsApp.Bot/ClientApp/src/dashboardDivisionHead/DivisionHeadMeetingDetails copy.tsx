import React from 'react'
import { Datepicker, Flex, Button, Loader } from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import _ from "lodash"
import Nodata from '../conferenceRoomUtil/Nodata.svg'


// const data = [
//     {
//         "divisionId": 1,
//         "divisionName": "Corporate",
//         "totalMeeting": 5,
//         "totalScheduledMeeting": 0,
//         "totalConductedMeetings": 4,
//         "totalCancelledMeeting": 1,
//         "totalDocumentUploaded": 3,
//         "verticalWiseData": [
//             {
//                 "divisionId": 1,
//                 "verticalId": 1,
//                 "verticalName": "Operation",
//                 "totalMeeting": 5,
//                 "totalScheduledMeeting": 0,
//                 "totalConductedMeetings": 4,
//                 "totalCancelledMeeting": 1,
//                 "totalDocumentUploaded": 3,
//                 "typeWiseData": [
//                     {
//                         "verticalId": 1,
//                         "meetingTypeId": 1,
//                         "typeName": "IRM",
//                         "totalMeeting": 3,
//                         "totalScheduledMeeting": 0,
//                         "totalConductedMeetings": 3,
//                         "totalCancelledMeeting": 0,
//                         "totalDocumentUploaded": 1,
//                         "titleWiseData": [
//                             {
//                                 "meetingTypeId": 1,
//                                 "MeetingTitleId": 4,
//                                 "meetingTitle": "IRM Test Meeting",
//                                 "totalMeeting": 1,
//                                 "totalScheduledMeeting": 0,
//                                 "totalConductedMeetings": 1,
//                                 "totalCancelledMeeting": 0,
//                                 "totalDocumentUploaded": 1
//                             },
//                             {
//                                 "meetingTypeId": 1,
//                                 "MeetingTitleId": 5,
//                                 "meetingTitle": "IRM Test Meeting2",
//                                 "totalMeeting": 2,
//                                 "totalScheduledMeeting": 0,
//                                 "totalConductedMeetings": 2,
//                                 "totalCancelledMeeting": 0,
//                                 "totalDocumentUploaded": 0
//                             }
//                         ]
//                     },
//                     {
//                         "verticalId": 1,
//                         "meetingTypeId": 2,
//                         "typeName": "DRM",
//                         "totalMeeting": 2,
//                         "totalScheduledMeeting": 0,
//                         "totalConductedMeetings": 1,
//                         "totalCancelledMeeting": 1,
//                         "totalDocumentUploaded": 2,
//                         "titleWiseData": [
//                             {
//                                 "meetingTypeId": 2,
//                                 "MeetingTitleId": 1002,
//                                 "meetingTitle": "DRM test meeting1",
//                                 "totalMeeting": 2,
//                                 "totalScheduledMeeting": 0,
//                                 "totalConductedMeetings": 1,
//                                 "totalCancelledMeeting": 1,
//                                 "totalDocumentUploaded": 2
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "divisionId": 1,
//                 "verticalId": 3,
//                 "verticalName": "Finance",
//                 "totalMeeting": 0,
//                 "totalScheduledMeeting": 0,
//                 "totalConductedMeetings": 0,
//                 "totalCancelledMeeting": 0,
//                 "totalDocumentUploaded": 0,
//                 "typeWiseData": []
//             }
//         ]
//     }
// ]


interface Props {
    Loading:boolean;
    // history?: any;
    // location?: any;
    data : any;
}

interface State {
    isOpenOne: boolean[];
    isOpenTwo: boolean[][];
    isOpenThree: boolean[][][];

}

export default class DivisionHeadMeetingDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpenOne: [],
            isOpenTwo: [],
            isOpenThree:[],

        };
    }

    componentDidMount = () => {
        microsoftTeams.initialize();
        if(this.props.data.length > 0) 
        {
          this.intialiizeIsOpenArray()
        }
        
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
        const arr3: boolean[][][] = [];
        this.props.data.forEach((item: any) => {
          arr1.push(false)

          const arr4: boolean[] = []
          const arr5:boolean[][] = []

          item.verticalWiseData.forEach((next: any) => {
            arr4.push(false);

            const arr6: boolean[] = [];

            next.typeWiseData.forEach(()=>{
                arr6.push(false)
            })
            arr5.push(arr6)
          })
          arr2.push(arr4)
          arr3.push(arr5)
        })

        this.setState({
          isOpenOne: arr1,
          isOpenTwo: arr2,
          isOpenThree: arr3,
        })
    }

    toggleTop = (i: any) => {
        console.log("isopennn", this.state.isOpenOne)
        const tempArr = _.cloneDeep(this.state.isOpenOne);
        tempArr[i] = !tempArr[i];
        this.setState({
          isOpenOne: tempArr
        })
      }
    
      toggleInner = (i: number, j: number) => {
        console.log("isopennn", this.state.isOpenTwo)
        const tempArr= _.cloneDeep(this.state.isOpenTwo)
        tempArr[i][j] = !tempArr[i][j];
        this.setState({
          isOpenTwo: tempArr
        })
      }

      toggleInnerChild=(i: number, j: number, k:number)=>{
        const tempArr = _.cloneDeep(this.state.isOpenThree)
        tempArr[i][j][k] = !tempArr[i][j][k];
        this.setState({
            isOpenThree: tempArr
          })
      }

      elip=(text:string)=>{
        var max = 30;
        return text.length > max ? text.substring(0, max) + '...' : text
      }
    render() {
        return (
            <div>
          {!this.props.Loading ? 
            <>
                <div className='mainPadding'>
                {this.props.data && (this.props.data.length > 0) ?
                    <table className="tableDesign" width={'100%'}>
                        <thead className='tableDesHead'>
                            <tr>
                                <th style={{ width: "2%" }}></th>
                                <th style={{ width: "10%", fontSize:"12px" }}>Division</th>
                                <th style={{ width: "10%", fontSize:"12px" }}>Verticals</th>
                                <th style={{ width: "10%", fontSize:"12px" }}>Type of Meetings</th>
                                <th style={{ width: "20%", fontSize:"12px" }}>Meeting Name</th>
                                <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Total No.<br/> of Meetings</th>
                                <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Schedule No.<br/> of Meetings</th>
                                <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Conducted No.<br/> of Meetings </th>
                                <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Uploaded No.<br/>of Documents</th>
                                <th style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>Cancelled</th>
                            </tr>
                        </thead>

                        
                        <tbody>

                            {/* ------------------Parent map---------------------- */}

                            {this.props.data.map((load: any, i: number) => {
                                return (
                                    <>
                                        <tr className='nestedTableRow' onClick={() => {this.toggleTop(i)}} style={{ cursor: "pointer" }}>
                                        <td style={{ width: "2%" }}>{this.state.isOpenOne[i] ? <span style={{color:"red"}}>-</span> : <span style={{color:"green"}}>+</span>}</td>
                                            <td style={{ width: "10%"}} className="tableAccordion">{load.divisionName}</td>
                                            <td style={{ width: "10%" }}></td>
                                            <td style={{ width: "10%" }}></td>
                                            <td style={{ width: "20%" }}></td>
                                            <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalMeeting}</td>
                                            <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalScheduledMeeting}</td>
                                            <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalConductedMeetings}</td>
                                            <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalDocumentUploaded}</td>
                                            <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{load.totalCancelledMeeting}</td>
                                        </tr>

                                        {/* ------------------child-1 map---------------------- */}

                                        {/* {this.state.isOpen[i] && */}
                                        {this.state.isOpenOne[i] && load.verticalWiseData && load.verticalWiseData.length > 0 ?
                                            <tr>
                                                <td colSpan={10} style={{ padding: "0" }}>
                                                    <table width={'100%'}>
                                                        {load.verticalWiseData.map((vertical: any, j:number) => {
                                                            return (
                                                                <>
                                                                    <tr className='nestedTableRow' onClick={() => {this.toggleInner(i, j)}} style={{ cursor: "pointer" }}>
                                                                        <td style={{ width: "10%" }}></td>
                                                                        <td style={{width:"2%"}}>{this.state.isOpenTwo[i][j] ? <span style={{color:"red"}}>-</span> : <span style={{color:"green"}}>+</span>}</td>
                                                                        <td style={{ width: "10%"}}  className="tableAccordion">{vertical.verticalName}</td>
                                                                        <td style={{ width: "10%" }}></td>
                                                                        <td style={{ width: "20%" }}></td>
                                                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{vertical.totalMeeting}</td>
                                                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{vertical.totalScheduledMeeting}</td>
                                                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{vertical.totalConductedMeetings}</td>
                                                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{vertical.totalDocumentUploaded}</td>
                                                                        <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{vertical.totalCancelledMeeting}</td>
                                                                    </tr>

                                                                    {/* ------------------child-2 map---------------------- */}

                                                                    {this.state.isOpenTwo[i][j] && vertical.typeWiseData && vertical.typeWiseData.length > 0 ?
                                                                        <tr>
                                                                            <td colSpan={10} style={{ padding: "0" }}>
                                                                                <table style={{ width: "100%" }}>
                                                                                    {vertical.typeWiseData.map((typewise: any, k:number) => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr className='nestedTableRow' onClick={() => {this.toggleInnerChild(i, j, k)}} style={{ cursor: "pointer" }}>
                                                                                                    <td style={{ width: "10%" }}></td>
                                                                                                    <td style={{ width: "10%" }}></td>
                                                                                                    <td style={{width:"2%"}}>{this.state.isOpenThree[i][j][k] ? <span style={{color:"red"}}>-</span> : <span style={{color:"green"}}>+</span>}</td>
                                                                                                    <td style={{ width: "10%" }} className="tableAccordion">{typewise.typeName}</td>
                                                                                                    <td style={{ width: "20%" }}></td>
                                                                                                    <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{typewise.totalMeeting}</td>
                                                                                                    <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{typewise.totalScheduledMeeting}</td>
                                                                                                    <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{typewise.totalConductedMeetings}</td>
                                                                                                    <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{typewise.totalDocumentUploaded}</td>
                                                                                                    <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{typewise.totalCancelledMeeting}</td>
                                                                                                </tr>

                                                                                                {/* ------------------child-3 map---------------------- */}

                                                                                                {this.state.isOpenThree[i][j][k] && typewise.titleWiseData && typewise.titleWiseData.length > 0 ?
                                                                                                    <tr>
                                                                                                        <td colSpan={10} style={{ padding: "0" }}>
                                                                                                            <table style={{ width: "100%" }}>
                                                                                                                {typewise.titleWiseData.map((titlewise: any) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <tr className='nestedTableRow'>
                                                                                                                                <td style={{ width: "2%" }}></td>
                                                                                                                                <td style={{ width: "10%" }}></td>
                                                                                                                                <td style={{ width: "10%" }}></td>
                                                                                                                                <td style={{ width: "10%" }}></td>
                                                                                                                                <td style={{ width: "20%" }} className="tableAccordion" title={titlewise.meetingTitle}>{this.elip(titlewise.meetingTitle)}</td>
                                                                                                                                <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{titlewise.totalMeeting}</td>
                                                                                                                                <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{titlewise.totalScheduledMeeting}</td>
                                                                                                                                <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{titlewise.totalConductedMeetings}</td>
                                                                                                                                <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{titlewise.totalDocumentUploaded}</td>
                                                                                                                                <td style={{ width: "8%", textAlign: "center" }} className="tableAccordion">{titlewise.totalCancelledMeeting}</td>
                                                                                                                            </tr>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                })}
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr> : null
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </table>

                                                                            </td>
                                                                        </tr> : null
                                                                    }
                                                                </>
                                                              
                                                            )
                                                        }
                                                        )
                                                        }
                                                    </table>
                                                </td>
                                            </tr> : null
                                        }
                                    </>
                                )

                            }
                            )
                            }
                        </tbody> 
                    </table> :  <div className='imgMainDiv'>
                                            <img className='noDataImg' src={Nodata} alt="No data img"/>
                                            <br/>
                                            <b>There aren&rsquo;t any meeting records to show. Try changing different date range.</b>
                                            </div>}
                </div>
            </>
             : <Loader styles={{ margin: "50px" }} label="Loading..."/>} 
              </div>
        );
    }
}

