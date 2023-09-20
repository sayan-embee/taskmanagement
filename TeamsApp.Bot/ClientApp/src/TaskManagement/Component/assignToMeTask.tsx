
import React from 'react';

import { Button, Loader, Datepicker, Text, Input, Flex, Dropdown, MenuButton, Alert } from "@fluentui/react-northstar";
import { CSVLink } from "react-csv";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import { getMeetingTypesAPI, getUserProfileAPI, getAllTaskDetailsAPI, updateTaskSortOrder } from './../../apis/APIList'
import Pagination from "react-js-pagination";

import moment from 'moment';
import "./../styles.scss"
import "./../../App.scss"

import * as microsoftTeams from "@microsoft/teams-js";
import { debounce } from 'lodash';

const base_URL = window.location.origin;
const upArrow = base_URL + "/images/upArrow.png";
const downArrow = base_URL + "/images/downArrow.png";
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
    assignBy?: string;
    allTask?:any;
    showBtn?:boolean;
    sortOrder?:null;
    updateMsg?:string;
    isUpdate?:boolean;
    openTask?:any
};


class AssignToMeTask extends React.Component<MyState> {
    state: MyState = {
        loading: true,
        taskStatus: "",
        taskStatusInput: ["Pending","In Progress", "Completed"],
        activePage: 1,
        priorityInputList: ["High", "Medium","Low", "KI", "Minutes"],
        taskTitle: "",
        meetingTitle: "",
        assignBy: "",
        showBtn:false,
        isUpdate:false,
        openTask:""
    }

    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
        });
        this.getUserProfile()
        this.getMeetingTypes();
    }

    // componentDidUpdate=(prevState: MyState)=>{
    //     if(this.state.allTask !== prevState.allTask){
    //         this.setState({
    //             showBtn:true
    //         })
    //     }
    // }

    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                CreatedBy: res.data.displayName,
                CreatedByEmail: res.data.mail,
                CreatedByADID: res.data.id
            },()=>{
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
            assignBy: "",
            meetingType: ""
        })
    }

    search = () => {
        this.setState({
            loading: true
        })
        const data = {
            "TaskDetailsType": "AssignedToMe",
            "TaskContext": this.state.taskTitle ? this.state.taskTitle : null,
            "TaskStatus": this.state.taskStatus ? this.state.taskStatus : null,
            "FromDate": (this.state.fromDate && (this.state.fromDate !== '1970-01-01')) ? this.state.fromDate : null,
            "ToDate": (this.state.toDate && (this.state.toDate !== '1970-01-01')) ? this.state.toDate : null,
            "TaskPriority": this.state.priority ? this.state.priority : null,
            "MeetingTitle": this.state.meetingTitle ? this.state.meetingTitle : null,
            "MeetingType": this.state.meetingType ?  this.state.meetingType : null,
            "CreatedBy": this.state.assignBy ? this.state.assignBy : null,
            "AssignedToEmail": this.state.CreatedByEmail,
            "ActionTakenByEmail": null
        }
        getAllTaskDetailsAPI(data).then((res: any) => {
            console.log("res", res)
            if (res.data) {
                const downloadDataList = res.data.map((e: any) => {
                    let b = {
                        "Task Title": e.taskContext ,
                        "Task Action Plan": e.taskActionPlan,
                        "Closure Date": e.taskClosureDate ? moment(e.taskClosureDate).format('LL') : "--",
                        "Priority":e.taskPriority,
                        "Status":e.taskStatus,
                        "Meeting Title": e.meetingTitle,
                        "Meeting Type": e.meetingType,
                        "Division": e.divisionName ,
                        "Vertical":e.verticalName,
                        "Assigned To": e.assignedTo ? e.assignedTo : "--",
                        "Assigned By": e.actionTakenBy + ' ( ' + e.actionTakenByEmail + ' )'
                    }
                    return b
                })
                console.log("openTask -----------------",[...res.data.filter((ta:any)=>ta.taskStatus !== "Closed")])
                console.log("All dataaaaaaaaaa",[...res.data.filter((el:any)=>el.sortOrder !==0),...res.data.filter((el:any)=>el.sortOrder ===0)])
                this.setState({
                    allTask: [...res.data.filter((el:any)=>el.sortOrder !==0),...res.data.filter((el:any)=>el.sortOrder ===0)],
                    downloadData: downloadDataList,
                    loading: false,
                    openTask:[...res.data.filter((ta:any)=>ta.taskStatus !== "Closed")]
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

    assignBy = (e: any) => {
        this.setState({
            assignBy: e.target.value
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
       viewDetails = (e : any) =>{
        console.log("sayan",e)
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/viewparticulartask?id=${e.taskId}`,
            title: "View details",
            height: 450,
            width: 830,
            fallbackUrl:`${base_URL}/viewparticulartask?id=${e.taskId}`
        }
        let submitHandler = (err: any, result: any) => {
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

     ////////////////////// update Meeting Details Task Module /////////////////////////////////
     updateTask = (e : any) =>{
        console.log("sayan",e)
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/updatetask?id=${e.taskId}`,
            title: "Update task",
            height: 650,
            width: 850,
            fallbackUrl:`${base_URL}/updatetask?id=${e.taskId}`
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

    //---------------------------------------------set priority-------------------

    onChangeSrHandl = (e:any, oldind:number) => {
        let cArr = [];
        let newind = parseInt(e.target.value, 10) - 1;
        if (newind === oldind) return;
        if (newind < oldind) {
          let firstSlice = this.state.allTask.slice(0, newind);
          let secondSlice = this.state.allTask.slice(newind, oldind);
          let numberSlice = this.state.allTask.slice(oldind, oldind + 1);
          let lastSlice = this.state.allTask.slice(oldind + 1);
    
          cArr = [...firstSlice, ...numberSlice, ...secondSlice, ...lastSlice];
        } else {
          let firstSlice = this.state.allTask.slice(0, oldind);
          let numberSlice = this.state.allTask.slice(oldind, oldind + 1);
          let secondSlice = this.state.allTask.slice(oldind + 1, newind + 1);
          let lastSlice = this.state.allTask.slice(newind + 1);
    
          cArr = [...firstSlice, ...secondSlice, ...numberSlice, ...lastSlice];
        }
    
        e.target.value = oldind + 1;
    
        this.setState({
          allTask: cArr,
          isUpdate:false
        },
        );
      };
 
      setPriority=()=>{
       
       let data = this.state.allTask.filter((fl:any)=>fl.taskStatus !=="Closed").map((el:any,index:number)=>{
                let obj = {
                    // taskContext: el.taskContext,
                    // taskClosureDate: el.taskClosureDate,
                    // meetingTitle: el.meetingTitle,
                    // meetingType: el.meetingType,
                    // divisionName: el.divisionName,
                    // verticalName: el.verticalName,
                    // actionTakenBy: el.actionTakenBy,
                    taskPriority: el.taskPriority,
                    sortOrder: index + 1,
                    taskId:el.taskId,
                    // taskStatus: el.taskStatus
                }
                return obj
            })
        console.log("data under Set priority",data)
        updateTaskSortOrder(data).then((res: any) => {
            this.setState({
                updateMsg:"Task Priority Updated",
                isUpdate:true,
            },()=>{
                this.setState({
                    loading: true,
                }, () => {
                    this.search()
                })
                this.debouncedClose()
            })
        })
      }
      debouncedClose = debounce(async () => {
        this.setState({
            isUpdate: false
        })
      }, 1500);


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
                            <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="From Date" onDateChange={(e, v) => this.fromDate(e, v)} className="datepickerBoxShadow"  inputOnly />
                            <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="To Date" onDateChange={(e, v) => this.toDate(e, v)} className="datepickerBoxShadow" inputOnly />

                            <Dropdown fluid
                                placeholder="Priority"
                                className='flex-fill ms-2 datepickerBoxShadow'
                                items={this.state.priorityInputList}
                                onChange={(event, { value }) => this.selectPriority(value)}
                            />
                        </div>
                        <div className="searchFieldDiv mt-3">
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
                            <Input placeholder="Assign By" value={this.state.assignBy} onChange={(e) => this.assignBy(e)} className='flex-fill ms-2 serchDivInput datepickerBoxShadow' />
                            <div className="rewardsRecognitionSearchBtnDiv">
                                
                                <Button primary onClick={() => this.search()} className="champListButton" title="Search"><img style={{ marginTop: "3px", height: "20px" }} src={searchIcon} alt='Search' /></Button>
                                <Button title="Export" primary className="exportBtn champListButton" disabled={(this.state.downloadData && this.state.downloadData.length > 0) ? false : true}>
                                    {this.state.downloadData ? <CSVLink data={this.state.downloadData} filename={"reports-file" + new Date().toDateString() + ".csv"}><img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink> : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                </Button>
                                <Button title="Clear" className="champListButton" primary onClick={() => this.cancel()}><img style={{ height: "20px" }} src={cancelIcon} alt='Cancel' /></Button>
                                {/* {this.state.showBtn ? <Button primary>Set Priority</Button> : <Button primary disabled>Set Priority</Button>} */}
                                <Button primary onClick={this.setPriority}>Set Priority</Button>
                            </div>


                        </div>
                    </div>

                </Flex>

                {this.state.isUpdate ? 
                <div className='d-flex flex-column justify-content-center align-items-end mt-3'>
                <Alert
                success
                header="Successful"
                content={this.state.updateMsg}
                // dismissAction={{
                // 'aria-label': 'close',
                // }}
                // dismissible
                />
                </div>
                : null
                }
                {!this.state.loading ? <div>
                    {this.state.allTask && (this.state.allTask.length > 0) ? <div className="tableBody"><table className="ViswasTable">
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
                                <th><Text className='mb-1 p-0' color="grey" content="Assigned by" size="small" timestamp /></th>
                                <th><Text className='mb-1 p-0' color="grey" content="Priority" size="small" timestamp /></th>
                                <th><Text className='mb-1 p-0' color="grey" content="Priority SLNo" size="small" timestamp /></th>
                                <th><Text className='mb-1 p-0' color="grey" content="Status" size="small" timestamp /></th>
                                <th></th>
                            </tr>
                        </thead>
                        {this.state.allTask.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any,index:number) => {
                            return <tr className="ViswasTableRow">
                                <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.taskContext} /></td>
                                <td><Text className='mb-1 p-0' color="grey" content={e.taskClosureDate ? moment(e.taskClosureDate).format('LL') : "--"} /></td>
                                <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.meetingTitle}/></td>
                                <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.meetingType} /></td>
                                <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.divisionName} /></td>
                                <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.verticalName} /></td>
                                <td><Text className='mb-1 p-0 textEllipsis taskDashboardTableWidth' color="grey" content={e.createdBy ? e.createdBy : "--"} /></td>
                                <td><Text className='mb-1 p-0' color="grey" content={e.taskPriority} /></td>

                                {e.taskStatus === "Closed" ? 

                                <td style={{textAlign:"center"}} color="grey">
                                
                                </td>

                                :
                                
                                <td style={{textAlign:"center"}} color="grey">
                                <select style={{cursor:"pointer"}} onChange={(e) => this.onChangeSrHandl(e, index)}>
                                    
                                    {this.state.openTask.map((e:any, idx:number) => (
                                    <option selected={idx === index}>{idx + 1}</option>
                                    ))}
                                </select>
                                </td>

                        }
                                <td><Text className='mb-1 p-0' color="grey" content={e.taskStatus} /></td>
                                
                                <td>
                                {e.taskStatus !== "Closed" ? 
                                <MenuButton className="taskdashboardMenuButton"
                                trigger={<div className='pointer' ><img style={{ height: "25px", width: "25px" }} src={menuBtn} alt='' /></div>}
                                menu={[
                                    <div className='d-flex align-items-center' onClick={()=>this.updateTask(e)}> 
                                    <Text className='ms-2' weight="regular" content="Update" />
                                    </div>,
                                    <div className='d-flex align-items-center' onClick={()=>this.viewDetails(e)}>
                                        <Text className='ms-2' weight="regular" content="View details" />
                                        </div>,
                                ]}
                                on="click"
                            /> :
                            <MenuButton className="taskdashboardMenuButton"
                                        trigger={<div className='pointer' ><img style={{ height: "25px", width: "25px" }} src={menuBtn} alt='' /></div>}
                                        menu={[
                                            // <div className='d-flex align-items-center' onClick={()=>this.updateTask(e)}> 
                                            // <Text className='ms-2' weight="regular" content="Update" />
                                            // </div>,
                                            <div className='d-flex align-items-center' onClick={()=>this.viewDetails(e)}>
                                                <Text className='ms-2' weight="regular" content="View details" />
                                                </div>,
                                        ]}
                                        on="click"
                                    />
                            }
                                    
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
                    </div> : <div className="noDataText"> No Data Available</div>}

                </div> : <Loader styles={{ margin: "50px" }} />}


            </div>
        );
    }
}



export default AssignToMeTask;
