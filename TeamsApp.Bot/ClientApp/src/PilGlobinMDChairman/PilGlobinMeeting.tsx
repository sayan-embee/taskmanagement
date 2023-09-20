import React from 'react'
import { Datepicker, Flex, Button, Loader } from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import _ from "lodash"
import Nodata from '../conferenceRoomUtil/Nodata.svg'
import TableRow from '../dashboardOne/Component/TableRow';





interface Props {
    Loading: boolean;
    data: any
}

interface State {
    isOpenOne: boolean[];
    isOpenTwo: boolean[][];
    isOpenThree: boolean[][][];
    isOpenFour: boolean[][][][];

}

export default class PilGlobinMeeting extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpenOne: [],
            isOpenTwo: [],
            isOpenThree: [],
            isOpenFour: [],

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

    elip = (text: string) => {
        var max = 35;
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
                                            <th style={{ width: "1%", fontSize: "12px" }}></th>
                                            <th style={{ width: "8%", fontSize: "12px" }}>Division</th>
                                            <th style={{ width: "8%", fontSize: "12px" }}>Meeting Type</th>
                                            <th style={{ width: "18%", fontSize: "12px" }}>Meeting Name</th>
                                            <th style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>Total No.<br /> of Meetings</th>
                                            <th style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>Scheduled No.<br /> of Meetings</th>
                                            <th style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>Conducted No.<br />of Meetings</th>
                                            <th style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>Uploaded No.<br />of Documents</th>
                                            <th style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>Cancelled</th>
                                        </tr>
                                    </thead>


                                    <tbody>

                                        {/* ------------------Parent map---------------------- */}

                                        {this.props.data.map((load: any, i: number) => {
                                            console.log(load.totalMeeting)
                                            return (
                                                <>
                                                    <TableRow load={load} cells={
                                                        <>
                                                            <td style={{ width: "8%", fontSize: "12px" }} className="tableAccordion">{load.divisionName}</td>
                                                            <td style={{ width: "8%" }}></td>
                                                            <td style={{ width: "18%" }}></td>
                                                            <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{load.totalMeeting}</td>
                                                            <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{load.totalScheduledMeeting}</td>
                                                            <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{load.totalConductedMeetings}</td>
                                                            <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{load.totalDocumentUploaded}</td>
                                                            <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{load.totalCancelledMeeting}</td>
                                                        </>
                                                    }>
                                                        <tr>
                                                            <td colSpan={13} style={{ padding: "0" }}>
                                                                <table style={{ width: "100%" }}>
                                                                    {load.verticalWiseData && load.verticalWiseData.length > 0 ? 
                                                                    load.verticalWiseData.map((vertical: any, j: number) => {
                                                                        return (
                                                                            <>
                                                                                <tr>
                                                                                    <td colSpan={13} style={{ padding: "0" }}>
                                                                                        <table style={{ width: "100%" }}>
                                                                                            {vertical.typeWiseData && vertical.typeWiseData.length > 0 ?
                                                                                            vertical.typeWiseData.map((typewise: any, k: number) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <TableRow load={typewise}
                                                                                                            cellsBefore={
                                                                                                                <>
                                                                                                                    <td style={{ width: "8%" }}></td>
                                                                                                                </>
                                                                                                            }
                                                                                                            cells={
                                                                                                                <>
                                                                                                                    <td style={{ width: "8%", fontSize: "12px" }} className="tableAccordion">{typewise.typeName}</td>
                                                                                                                    <td style={{ width: "18%" }}></td>
                                                                                                                    <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{typewise.totalMeeting}</td>
                                                                                                                    <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{typewise.totalScheduledMeeting}</td>
                                                                                                                    <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{typewise.totalConductedMeetings}</td>
                                                                                                                    <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{typewise.totalDocumentUploaded}</td>
                                                                                                                    <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{typewise.totalCancelledMeeting}</td>
                                                                                                                </>
                                                                                                            }>
                                                                                                            <tr>
                                                                                                                <td colSpan={13} style={{ padding: "0" }}>
                                                                                                                    <table style={{ width: "100%" }}>
                                                                                                                        {typewise.titleWiseData && typewise.titleWiseData.length > 0 ? 
                                                                                                                        typewise.titleWiseData.map((titlewise: any) => {
                                                                                                                            return (
                                                                                                                                <>
                                                                                                                                    <tr className='nestedTableRow'>
                                                                                                                                        <td style={{ width: "1%" }}></td>
                                                                                                                                        <td style={{ width: "8%" }}></td>
                                                                                                                                        <td style={{ width: "8%" }}></td>
                                                                                                                                        <td style={{ width: "18%", fontSize: "12px" }} className="tableAccordion" title={titlewise.meetingTitle}>{this.elip(titlewise.meetingTitle)}</td>
                                                                                                                                        <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalMeeting}</td>
                                                                                                                                        <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalScheduledMeeting}</td>
                                                                                                                                        <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalConductedMeetings}</td>
                                                                                                                                        <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalDocumentUploaded}</td>
                                                                                                                                        <td style={{ width: "6%", textAlign: "center", fontSize: "12px" }}>{titlewise.totalCancelledMeeting}</td>
                                                                                                                                    </tr>

                                                                                                                                </>
                                                                                                                            )
                                                                                                                        })
                                                                                                                        :null}
                                                                                                                        
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>

                                                                                                        </TableRow>

                                                                                                    </>
                                                                                                )
                                                                                            })
                                                                                            : null}
                                                                                            
                                                                                        </table>

                                                                                    </td>
                                                                                </tr>
                                                                            </>

                                                                        )
                                                                    }
                                                                    )
                                                                    
                                                                    :null}
                                                                    
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
                                    <b>There aren&rsquo;t any meeting records to show. Try with different date range.</b>
                                </div>}
                        </div>
                    </>
                    : <Loader styles={{ margin: "50px" }} label="Loading..." />}
            </div>
        );
    }
}

