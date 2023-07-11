
import React from 'react';

import { Button, Loader, Datepicker, Text, Input, Flex, Dropdown, MenuButton } from "@fluentui/react-northstar";
import { CSVLink } from "react-csv";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import { getMeetingTypesAPI, getUserProfileAPI, getAllTaskDetailsAPI } from './../../apis/APIList'
import Pagination from "react-js-pagination";
import moment from 'moment';

import "./../styles.scss"
import "./../../App.scss"

import * as microsoftTeams from "@microsoft/teams-js";

const base_URL = window.location.origin;

const searchIcon = base_URL + "/images/search.png";
const exportIcon = base_URL + "/images/export.png";
const cancelIcon = base_URL + "/images/cancel.png";
const exportIconDisable = base_URL + "/images/export-disable-icon.png";
const menuBtn = base_URL + "/images/menuBtn.png"

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
}


type MyState = {
    fromDate?: any;
    toDate?: any;
    findContact?: any;
    loading?: boolean;
    downloadData?: any;
    CreatedBy?: string;
    CreatedByEmail?: string;
    CreatedByADID?: any;
    taskStatus?: string;
    taskStatusInput?: any;
    activePage?: any;
    meetingTypeList?: any;
    meetingTypeInputList?: any;
    meetingTypeId?: any;
    meetingType?: any;
    priority?: string;
    priorityInputList?: any;
    taskTitle?: string;
    meetingTitle?: string;
    assignTo?: string;
    allTask?: any;
};



class AssignByMeTask extends React.Component<MyState> {
    state: MyState = {
        loading: true,
        taskStatus: "",
        taskStatusInput: ["Pending", "In Progress", "Completed"],
        activePage: 1,
        priorityInputList: ["High", "Medium", "Low", "KI", "Minutes"],
        taskTitle: "",
        meetingTitle: "",
        assignTo: ""
    }

    componentDidMount() {
        microsoftTeams.initialize();
        this.getUserProfile()
        this.getMeetingTypes();
    }

    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            // console.log("user", res);
            this.setState({
                CreatedBy: res.data.displayName,
                CreatedByEmail: res.data.mail,
                CreatedByADID: res.data.id
            }, () => {
                this.search()
            })
        })
    }

    ///////////////////////////// Get Meeting Type ////////////////////////////
    getMeetingTypes() {
        getMeetingTypesAPI().then((res: any) => {
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.typeName)
            this.setState({
                meetingTypeInputList: result,
                meetingTypeList: list
            })
        })
    }

    ////////////////////// Cancel all the filters ///////////////////////////

    cancel() {
        this.setState({
            fromDate: "",
            toDate: "",
            priority: "",
            taskTitle: "",
            taskStatus: "",
            meetingTitle: "",
            assignTo: "",
            meetingType: ""
        })
    }

    search = () => {
        this.setState({
            loading: true
        })
        const data = {
            "TaskDetailsType": "AssignedByMe",
            "TaskContext": this.state.taskTitle ? this.state.taskTitle : null,
            "TaskStatus": this.state.taskStatus ? this.state.taskStatus : null,
            "FromDate": (this.state.fromDate && (this.state.fromDate !== '1970-01-01')) ? this.state.fromDate : null,
            "ToDate": (this.state.toDate && (this.state.toDate !== '1970-01-01')) ? this.state.toDate : null,
            "TaskPriority": this.state.priority ? this.state.priority : null,
            "MeetingTitle": this.state.meetingTitle ? this.state.meetingTitle : null,
            "MeetingType": this.state.meetingType ? this.state.meetingType : null,
            "CreatedBy": null,
            "AssignedToEmail": this.state.assignTo ? this.state.assignTo : null,
            "ActionTakenByEmail": this.state.CreatedByEmail
        }
        getAllTaskDetailsAPI(data).then((res: any) => {
            // console.log("res", res)
            if (res.data) {
                const downloadDataList = res.data.map((e: any) => {
                    let b = {
                        "Task Title": e.taskContext,
                        "Task Action Plan": e.taskActionPlan,
                        "Closure Date": e.taskClosureDate ? moment(e.taskClosureDate).format('LL') : "--",
                        "Priority": e.taskPriority,
                        "Status": e.taskStatus,
                        "Meeting Title": e.meetingTitle,
                        "Meeting Type": e.meetingType,
                        "Division": e.divisionName ,
                        "Vertical":e.verticalName,
                        "Assigned To": e.assignedTo ? e.assignedTo : "--",
                        "Assigned By": e.actionTakenBy + ' ( ' + e.actionTakenByEmail + ' )'
                    }
                    return b
                })
                this.setState({
                    allTask: res.data,
                    downloadData: downloadDataList,
                    loading: false
                })

            }
        })
    }

    ////////////////////////// Select Meeting Type //////////////////////////
    selectTypeName(data: any) {
        this.state.meetingTypeList.filter((e: any) => e.typeName === data).map((e: any) => {
            this.setState({
                meetingTypeId: e.typeId,
                meetingType: data
            })
        })
    }

    selectPriority(data: any) {
        this.setState({
            priority: data
        })
    }

    fromDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("fromDate", date)
    }

    toDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("toDate", date)
    }

    dateCreate = (value: any, date: any) => {
        let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let year = date.getFullYear();
        let finaldate = year + '-' + mnth + '-' + day;
        if (value === "fromDate") {
            this.setState({
                fromDate: finaldate
            })
        }
        else {
            this.setState({
                toDate: finaldate
            })
        }

    }

    taskTitle = (e: any) => {
        this.setState({
            taskTitle: e.target.value
        })
    }

    meetingTitle = (e: any) => {
        this.setState({
            meetingTitle: e.target.value
        })
    }

    assignTo = (e: any) => {
        this.setState({
            assignTo: e.target.value
        })
    }


    selectStatusFunction = (value: any) => {
        this.setState({
            taskStatus: value
        })
    }



    handlePageChange(pageNumber: any) {
        // console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber });
    }

    ////////////////////// View Meeting Details Task Module /////////////////////////////////
    viewDetails = (e: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/viewparticulartask?id=${e.taskId}`,
            title: "View details",
            height: 450,
            width: 830,
            fallbackUrl: `${base_URL}/viewparticulartask?id=${e.taskId}`
        }
        let submitHandler = (err: any, result: any) => {
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    ////////////////////// View Meeting Details Task Module /////////////////////////////////
    reassign = (e: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/reassigntask?id=${e.taskId}`,
            title: "Reassign task",
            height: 350,
            width: 550,
            fallbackUrl: `${base_URL}/reassigntask?id=${e.taskId}`
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.search()
            })
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    ////////////////////// View Meeting Details Task Module /////////////////////////////////
    updateTask = (e: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/editassigntask?id=${e.taskId}`,
            title: "Edit task",
            height: 650,
            width: 550,
            fallbackUrl: `${base_URL}/editassigntask?id=${e.taskId}`
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.search()
            })
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }


    ///////////////////////// Reassign Task ///////////////////////////////////

    reAssignAll() {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/reassigntask?type=reassignAll`,
            title: "Reassign task",
            height: 350,
            width: 550,
            fallbackUrl: `${base_URL}/reassigntask?type=reassignAll`
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.search()
            })
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    render() {

        return (
            <div>


                <Flex className="mt-3 taskSearchDiv" vAlign="end" gap="gap.smaller">
                    <div className="d-flex flex-column w-100">
                        <div className="searchFieldDiv">
                            <Input placeholder="Task Title" value={this.state.taskTitle} onChange={(e) => this.taskTitle(e)} className="taskTitleInput serchDivInput datepickerBoxShadow" />
                            <Dropdown fluid
                                items={this.state.taskStatusInput}
                                placeholder="Status"
                                className='flex-fill ms-2 datepickerBoxShadow'
                                value={this.state.taskStatus}
                                onChange={(event, { value }) => this.selectStatusFunction(value)}
                            />
                            <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="From Date" onDateChange={(e, v) => this.fromDate(e, v)} className="datepickerBoxShadow" inputOnly />
                            <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="To Date" onDateChange={(e, v) => this.toDate(e, v)} className="datepickerBoxShadow" inputOnly />

                            <Dropdown fluid
                                placeholder="Priority"
                                className='flex-fill ms-2 datepickerBoxShadow'
                                items={this.state.priorityInputList}
                                onChange={(event, { value }) => this.selectPriority(value)}
                            />
                        </div>
                        <div className="searchFieldDiv mt-3" >
                            <Input placeholder="Meeting Title" value={this.state.meetingTitle} onChange={(e) => this.meetingTitle(e)} className='flex-fill ms-2 serchDivInput datepickerBoxShadow' />
                            <Dropdown
                                fluid
                                className='flex-fill ms-2 datepickerBoxShadow'
                                items={this.state.meetingTypeInputList}
                                placeholder="Meeting Type"
                                checkable
                                value={this.state.meetingType}
                                onChange={(event, { value }) => this.selectTypeName(value)}
                            />
                            <Input placeholder="Assign To" value={this.state.assignTo} onChange={(e) => this.assignTo(e)} className='flex-fill ms-2 serchDivInput datepickerBoxShadow' />
                            <div className="rewardsRecognitionSearchBtnDiv">
                                <Button primary onClick={() => this.search()} className="champListButton" title="Search"><img style={{ marginTop: "3px", height: "20px" }} src={searchIcon} alt='Search' /></Button>
                                <Button title="Export" primary className="exportBtn champListButton" disabled={(this.state.downloadData && this.state.downloadData.length > 0) ? false : true}>
                                    {this.state.downloadData ? <CSVLink data={this.state.downloadData} filename={"reports-file" + new Date().toDateString() + ".csv"}><img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink> : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                </Button>
                                <Button title="Clear" className="champListButton" primary onClick={() => this.cancel()}><img style={{ height: "20px" }} src={cancelIcon} alt='Cancel' /></Button>
                            </div>


                        </div>
                    </div>

                </Flex>

                {!this.state.loading ? <div>

                    {this.state.allTask && (this.state.allTask.length > 0) ? <div>
                        <Flex className="mb-4 mt-3" vAlign="end" hAlign="end">
                            <Button content="Reassign" id="saveBtn" onClick={() => this.reAssignAll()} primary />
                        </Flex>
                        <div className="tableBody">
                        <table className="ViswasTable">
                            <thead>
                                <tr>
                                    <th className='text-nowrap'>
                                        <Text className='mb-1 p-0' color="grey" content="Task title" size="small" timestamp />
                                    </th>
                                    <th><Text className='mb-1 p-0 text-nowrap' color="grey" content="Closure date" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0 text-nowrap' color="grey" content="Meeting title" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0 text-nowrap' color="grey" content="Meeting type" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0' color="grey" content="Division" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0' color="grey" content="Vertical" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0' color="grey" content="Assigned to" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0' color="grey" content="Priority" size="small" timestamp /></th>
                                    <th><Text className='mb-1 p-0' color="grey" content="Status" size="small" timestamp /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            {this.state.allTask.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any) => {
                                return <tr className="ViswasTableRow">
                                    <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.taskContext} /></td>
                                    <td><Text className='mb-1 p-0' color="grey" content={e.taskClosureDate ? moment(e.taskClosureDate).format('LL') : "--"} /></td>
                                    <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.meetingTitle} /></td>
                                    <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.meetingType} /></td>
                                    <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.divisionName} /></td>
                                    <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.verticalName} /></td>
                                    <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.assignedTo ? e.assignedTo : "--"} /></td>
                                    <td><Text className='mb-1 p-0' color="grey" content={e.taskPriority} /></td>
                                    <td><Text className='mb-1 p-0' color="grey" content={e.taskStatus} /></td>
                                    <td>
                                        <MenuButton className="taskdashboardMenuButton"
                                            trigger={<div className='pointer' ><img style={{ height: "25px", width: "25px" }} src={menuBtn} alt='' /></div>}
                                            menu={[
                                                <div className='d-flex align-items-center' onClick={() => this.updateTask(e)}> 
                                                <Text className='ms-2' weight="regular" content="Update" />
                                                </div>,
                                                (e.taskPriority !== "KI") && (e.taskPriority !== "Minutes") && <div className='d-flex align-items-center' onClick={() => this.reassign(e)}> 
                                                <Text className='ms-2' weight="regular" content="Reassign" />
                                                </div> ,
                                                <div className='d-flex align-items-center' onClick={() => this.viewDetails(e)}>
                                                    <Text className='ms-2' weight="regular" content="View details" /></div>,
                                            ]}
                                            on="click"
                                        />
                                    </td>
                                </tr>
                            })}


                        </table>
                        <div className="pagination-style">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.allTask.length}
                                pageRangeDisplayed={6}
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
                        </div>
                    </div> : <div className="noDataText"> No Data Available</div>}

                </div> : <Loader styles={{ margin: "50px" }} />}



            </div>
        );
    }
}



export default AssignByMeTask;
