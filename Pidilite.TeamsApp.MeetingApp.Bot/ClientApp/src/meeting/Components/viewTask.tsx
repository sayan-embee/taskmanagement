import React from 'react';
import { Loader, Text } from "@fluentui/react-northstar";

import moment from 'moment';
import "./../styles.scss"
import { getAllPrevTaskDetailsAPI, getMeetingDetailsByIdAPI, getUserProfileAPI } from './../../apis/APIList'

import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Pagination from "react-js-pagination";

import "./../../App.scss"



interface MyState {
    loading?: any;
    meetingData?: any;
    meetingId?: any;
    meetingType?: any;
    remarks?: any;
    UpdatedBy?: any;
    UpdatedByEmail?: any;
    UpdatedByADID?: any;
    cancelType?: string;
    cancelTypeDropdown?: any;
    meetingTask?: any;
    activePage?: any;
}

interface IViewMeetingProps {
    history?: any;
    location?: any
}

class ViewTask extends React.Component<IViewMeetingProps, MyState> {
    constructor(props: IViewMeetingProps) {
        super(props);
        this.state = {
            loading: true,
            activePage: 1
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            meetingId: params.get('id'),
        }, () => {
            this.getMeetingData(this.state.meetingId);
            this.getUserProfile();
        })

    }


    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                UpdatedBy: res.data.displayName,
                UpdatedByEmail: res.data.mail,
                UpdatedByADID: res.data.id
            })
        })
    }


    getMeetingData(id: any) {
        getMeetingDetailsByIdAPI(id).then((res) => {
            console.log("view meeting", res.data)
            this.setState({
                meetingData: res.data,
            }, () => {
                this.getAllTask()
            })
        })
    }

    getAllTask() {
        const data = {
            "MeetingId": this.state.meetingId,
            "SeriesMasterId": (this.state.meetingData.repeatOption !== "DoesNotRepeat") ? this.state.meetingData.seriesMasterId : null,
            "TaskContext": null,
            "AssignedTo": null
        }

        getAllPrevTaskDetailsAPI(data).then((res: any) => {
            this.setState({
                loading: false,
                meetingTask: res.data,
            })
            console.log("res task details", res.data)
        })

    }

    ///// page change/////
    handlePageChange(pageNumber: any) {
        this.setState({ activePage: pageNumber });
    }

    render() {
        return (
            <div>
                {!this.state.loading ? <div className='p-3'>
                    {this.state.meetingTask && (this.state.meetingTask.length > 0) ? <div> <table className="ViswasTable">
                        <tr>
                            <th>
                                <Text content="Task Context" size="medium" weight="semibold" />
                            </th>
                            <th>
                                <Text content="Action plan" size="medium" weight="semibold" />
                            </th>
                            <th><Text content="Priority" size="medium" weight="semibold" /></th>
                            <th><Text content="Closing Date" size="medium" weight="semibold" /></th>
                            <th><Text content="Assign to" size="medium" weight="semibold" /></th>
                        </tr>
                        {this.state.meetingTask.slice((this.state.activePage - 1) * 6, (this.state.activePage - 1) * 6 + 6).map((e: any) => {
                            return <tr className="ViswasTableRow">
                                <td>{e.taskContext}</td>
                                <td>
                                    {e.taskActionPlan}

                                </td>
                                <td >
                                    {e.taskPriority}
                                </td>
                                <td><Text content={e.taskClosureDate ? moment(e.taskClosureDate).format('LL') : "--"} /></td>
                                <td><div className='d-flex flex-column'>
                                    <Text content={e.assignedTo} size="medium" />
                                    <Text content={e.assignedToEmail} size="small" />
                                </div></td>
                            </tr>
                        })}


                    </table>
                    <div className="pagination-style m-3">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={6}
                                totalItemsCount={this.state.meetingTask.length}
                                pageRangeDisplayed={4}
                                onChange={this.handlePageChange.bind(this)}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                firstPageText=""
                                lastPageText=""
                                linkClassFirst="displayNone"
                                linkClassLast="displayNone"

                            />
                        </div>

                    </div> : <div className="noDataText"> No Data Available</div>}

                </div> : <Loader styles={{ margin: "50px" }} />}

            </div>
        );
    }
}



export default ViewTask;
