import React from 'react'
import { Datepicker, Flex, Button, Loader } from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import _ from "lodash"
import Nodata from '../conferenceRoomUtil/Nodata.svg'
import TableRow from '../dashboardOne/Component/TableRow';

const base_URL = window.location.origin


interface Props {
    Loading: boolean;
    data: any;
    history?: any;
    location?: any;
    EmailId: any
    FromDate?: any;
    ToDate?: any;
}

interface State {
    isOpenOne: boolean[];
    isOpenTwo: boolean[][];
    isOpenThree: boolean[][][];
    isOpenFour: boolean[][][][];
    popup: any;

}

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    fallbackUrl?: string;
}
export default class DivisionHeadTask extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpenOne: [],
            isOpenTwo: [],
            isOpenThree: [],
            isOpenFour: [],
            popup: base_URL + '/popup',
            // EmailId: "",


        };
    }

    componentDidMount = () => {
        microsoftTeams.initialize();
        if (this.props.data.length > 0) {
            this.intialiizeIsOpenArray()
        }

    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        if (prevProps.Loading && !this.props.Loading) {
            console.log("Called")
            this.intialiizeIsOpenArray();
        }
        else if (prevProps.data !== this.props.data) {
            this.intialiizeIsOpenArray();
        }
    }

    intialiizeIsOpenArray = () => {
        const arr1: boolean[] = [];
        const arr2: boolean[][] = [];
        const arr3: boolean[][][] = [];
        const arr4: boolean[][][][] = [];
        this.props.data.forEach((item: any) => {
            arr1.push(false)

            const arr5: boolean[] = []
            const arr6: boolean[][] = []

            const arr8: boolean[][][] = []

            item.verticalWiseData.forEach((next: any) => {
                arr5.push(false);

                const arr7: boolean[] = [];
                const arr10: boolean[][] = [];

                next.typeWiseData.forEach((tri: any) => {
                    arr7.push(false)

                    const arr9: boolean[] = []
                    tri.titleWiseData.forEach(() => {
                        arr9.push(false)
                    })
                    arr10.push(arr9)
                })
                arr6.push(arr7)
                arr8.push(arr10)
            })
            arr2.push(arr5)
            arr3.push(arr6)
            arr4.push(arr8);
        })

        this.setState({
            isOpenOne: arr1,
            isOpenTwo: arr2,
            isOpenThree: arr3,
            isOpenFour: arr4
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
        const tempArr = _.cloneDeep(this.state.isOpenTwo);
        tempArr[i][j] = !tempArr[i][j];
        this.setState({
            isOpenTwo: tempArr
        })
    }

    toggleInnerChild = (i: number, j: number, k: number) => {
        const tempArr = _.cloneDeep(this.state.isOpenThree);
        tempArr[i][j][k] = !tempArr[i][j][k];
        this.setState({
            isOpenThree: tempArr
        })
    }

    toggleMostInnerChild = (i: number, j: number, k: number, l: number) => {
        const tempArr = _.cloneDeep(this.state.isOpenFour);
        tempArr[i][j][k][l] = !tempArr[i][j][k][l];
        this.setState({
            isOpenFour: tempArr
        })
    }

    popupModule = (assignedToEmail: any, divisionName: any, MeetingTitle: any, meetingTypeId: number, taskType: string) => {
        console.log("clicked", this.state.popup)
        let taskInfo: ITaskInfo = {
            url: `${this.state.popup}?login=${assignedToEmail}&division=${divisionName}&meeting=${MeetingTitle}&meetid=${meetingTypeId}&tsktyp=${taskType}&fromdate=${this.props.FromDate}&todate=${this.props.ToDate}`,
            title: "Assigned Task",
            height: 350,
            width: 600,
            fallbackUrl: this.state.popup,
        }
        microsoftTeams.tasks.startTask(taskInfo);
    }
    elip = (text: string) => {
        var max = 12;
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
                                            <th style={{ width: "1%" }}></th>
                                            <th style={{ width: "8%", fontSize: "12px" }}>Division</th>
                                            {/* <th style={{ width: "8%", fontSize:"12px"}}>Verticals</th> */}
                                            <th style={{ width: "8%", fontSize: "12px" }}>Meeting Type</th>
                                            <th style={{ width: "8%", fontSize: "12px" }}>Meeting Name</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Employee Name</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Total Task</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Open and Behind<br /> Schedule</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Open and <br />In progress</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Closed</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Behind Schedule<br />(&#37;)</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>In Progress<br />(&#37;)</th>
                                            <th style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>Closed<br />(&#37;)</th>
                                        </tr>
                                    </thead>


                                    <tbody>

                                        {/* ------------------Parent map---------------------- */}

                                        {this.props.data.map((load: any) => {
                                            console.log(load.totalMeeting)
                                            return (
                                                <>
                                                    <TableRow load={load} cells={
                                                        <>
                                                            <td style={{ width: "8%", fontSize: "12px" }} className="tableAccordion">{load.divisionName}</td>
                                                            {/* <td style={{ width: "8%", fontSize:"12px" }}></td> */}
                                                            <td style={{ width: "8%", fontSize: "12px" }}></td>
                                                            <td style={{ width: "8%", fontSize: "12px" }}></td>
                                                            <td style={{ width: "8%", fontSize: "12px" }}></td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalTask}</td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalBehindSchedule}</td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalInProgress}</td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalClosed}</td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalBehindSchedulePercent}</td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalInProgressPercent}</td>
                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{load.totalClosedPercent}</td>
                                                        </>
                                                    }>
                                                        <tr>
                                                            <td colSpan={13} style={{ padding: "0" }}>
                                                                <table style={{ width: "100%" }}>
                                                                    {load.typeWiseData.map((typewise: any) => {
                                                                        return (
                                                                            <>
                                                                                <TableRow load={typewise} cellsBefore={<> <td style={{ width: "8%" }}></td></>} cells={
                                                                                    <>
                                                                                        <td style={{ width: "8%", fontSize: "12px" }} className="tableAccordion">{typewise.typeName}</td>
                                                                                        <td style={{ width: "8%" }}></td>
                                                                                        <td style={{ width: "8%" }}></td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalTask}</td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalBehindSchedule}</td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalInProgress}</td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalClosed}</td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalBehindSchedulePercent}</td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalInProgressPercent}</td>
                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{typewise.totalClosedPercent}</td>
                                                                                    </>
                                                                                }>


                                                                                    <tr>
                                                                                        <td colSpan={13} style={{ padding: "0" }}>
                                                                                            <table style={{ width: "100%" }}>
                                                                                                {typewise.titleWiseData.map((titlewise: any) => {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <TableRow load={titlewise}
                                                                                                                cellsBefore={<>
                                                                                                                    <td style={{ width: "8%" }}></td>
                                                                                                                    <td style={{ width: "8%" }}></td>
                                                                                                                </>
                                                                                                                }
                                                                                                                cells={
                                                                                                                    <>
                                                                                                                        <td style={{ width: "8%", fontSize: "12px" }} className="tableAccordion" title={titlewise.meetingTitle}>{this.elip(titlewise.meetingTitle)}</td>
                                                                                                                        <td style={{ width: "8%" }}></td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalTask}</td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalBehindSchedule}</td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalInProgress}</td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalClosed}</td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalBehindSchedulePercent}</td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalInProgressPercent}</td>
                                                                                                                        <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalClosedPercent}</td>
                                                                                                                    </>
                                                                                                                }>
                                                                                                                <tr>
                                                                                                                    <td colSpan={13} style={{ padding: "0" }}>
                                                                                                                        <table style={{ width: "100%" }}>
                                                                                                                            {titlewise.employeeWiseData.map((emp: any) => {
                                                                                                                                return (
                                                                                                                                    <>
                                                                                                                                        <tr className='nestedTableRow'>
                                                                                                                                            <td style={{ width: "8%" }}></td>
                                                                                                                                            <td style={{ width: "8%" }}></td>
                                                                                                                                            <td style={{ width: "8%" }}></td>
                                                                                                                                            <td style={{ width: "1%" }}></td>
                                                                                                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }} className="tableAccordion">{emp.assignedTo}</td>
                                                                                                                                            {/* <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{emp.totalTask}</td> */}
                                                                                                                                            {emp.totalTask !== 0 ?
                                                                                                                                                <td className='textColorD3' title='View Task' onClick={() => this.popupModule(emp.assignedToEmail, load.divisionName, emp.meetingTitle, emp.meetingTypeId, 'TOTAL')} style={{ width: "8%", textAlign: "center", cursor: "pointer" }}>{emp.totalTask}</td> :
                                                                                                                                                <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalTask}</td>}
                                                                                                                                            {/* <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{emp.totalBehindSchedule}</td> */}
                                                                                                                                            {emp.totalBehindSchedule !== 0 ?
                                                                                                                                                <td className='textColorD3' title='View Task' onClick={() => this.popupModule(emp.assignedToEmail, load.divisionName, emp.meetingTitle, emp.meetingTypeId, 'BEHINDSCHEDULE')} style={{ width: "8%", textAlign: "center", cursor: "pointer" }}>{emp.totalBehindSchedule}</td> :
                                                                                                                                                <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalBehindSchedule}</td>}

                                                                                                                                            {emp.totalInProgress !== 0 ?
                                                                                                                                                <td className='textColorD3' title='View Task' onClick={() => this.popupModule(emp.assignedToEmail, load.divisionName, emp.meetingTitle, emp.meetingTypeId, 'INPROGRESS')} style={{ width: "8%", textAlign: "center", cursor: "pointer" }}>{emp.totalInProgress}</td> :
                                                                                                                                                <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalInProgress}</td>
                                                                                                                                            }

                                                                                                                                            {/* <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{emp.totalInProgress}</td> */}
                                                                                                                                            {emp.totalClosed !== 0 ?
                                                                                                                                                <td className='textColorD3' title='View Task' onClick={() => this.popupModule(emp.assignedToEmail, load.divisionName, emp.meetingTitle, emp.meetingTypeId, 'CLOSED')} style={{ width: "8%", textAlign: "center", cursor: "pointer" }}>{emp.totalClosed}</td> :
                                                                                                                                                <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalClosed}</td>
                                                                                                                                            }


                                                                                                                                            {/* <td style={{ width: "8%", textAlign: "center", fontSize:"12px" }}>{emp.totalClosed}</td> */}
                                                                                                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalBehindSchedulePercent}</td>
                                                                                                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalInProgressPercent}</td>
                                                                                                                                            <td style={{ width: "8%", textAlign: "center", fontSize: "12px" }}>{emp.totalClosedPercent}</td>
                                                                                                                                        </tr>
                                                                                                                                    </>
                                                                                                                                )
                                                                                                                            })}
                                                                                                                        </table>

                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </TableRow>
                                                                                                        </>
                                                                                                    )
                                                                                                })}
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>


                                                                                </TableRow>
                                                                            </>
                                                                        )
                                                                    })}
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
                                </table> : <div className='imgMainDiv'>
                                    <img className='noDataImg' src={Nodata} alt="No data img" />
                                    <br />
                                    {/* <b>There aren&rsquo;t any meeting records to show. Try changing different date range.</b> */}
                                    <b>There aren&rsquo;t any task details record to show. Try with different date range.</b>
                                </div>}
                        </div>
                    </>
                    : <Loader styles={{ margin: "50px" }} label="Loading..." />}
            </div>
        );
    }
}

