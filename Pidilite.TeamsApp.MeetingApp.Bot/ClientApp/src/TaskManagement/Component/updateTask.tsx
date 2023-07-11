import React from 'react';
import { getTaskDetailsByIdAPI, getUserProfileAPI, updateTaskAPI } from './../../apis/APIList'
import "./../styles.scss"
import "./../../App.scss"
import { Text, FormTextArea, Loader, FormDropdown, FormDatepicker, Button, Divider, Flex, Input } from "@fluentui/react-northstar";
import moment from 'moment';
import * as microsoftTeams from "@microsoft/teams-js";
import { Col } from 'react-bootstrap';
import { AnyMxRecord } from 'dns';

const baseUrl = window.location.origin;

const cancelImage = baseUrl + "/images/cancel.svg";

interface MyState {
    active?: boolean;
    loading?: boolean;
    meetingData?: any;
    pages?: string;
    taskId?: any;
    taskData?: any;
    CreatedBy?: string;
    CreatedByEmail?: string;
    CreatedByADID?: any;
    statusInputItems?: any;
    status?: any;
    closingDate?: any;
    remarks?: any;
    taskCreateLoading?: boolean;
    taskClosingDate?: any;
    meetingId?: any;
    files?: any;
    taskReferenceNo?: AnyMxRecord
};

interface IUpdateParticularTaskProps {
    history?: any;
    location?: any
}

class UpdateTask extends React.Component<IUpdateParticularTaskProps, MyState> {
    constructor(props: IUpdateParticularTaskProps) {
        super(props);
        this.state = {
            loading: true,
            statusInputItems: ["In Progress", "Pending", "Closed"],
            files: []
        };
    }


    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            taskId: params.get('id'),
        }, () => {
            console.log("id", this.state.taskId)
            this.getTaskDetails(this.state.taskId)
        })
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
        });
        this.getUserProfile()
    }

    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                CreatedBy: res.data.displayName,
                CreatedByEmail: res.data.mail,
                CreatedByADID: res.data.id,
            })
        })
    }
    
    getTaskDetails = (id: any) => {
        getTaskDetailsByIdAPI(id).then((res: any) => {
            console.log("res", res)
            if (res.data) {
                const end_date = res.data.taskClosureDate.split('T')
                this.setState({
                    meetingId: res.data.meetingId,
                    taskData: res.data,
                    taskReferenceNo: res.data.taskReferenceNo,
                    taskClosingDate: end_date[0],
                    loading: false
                })
            }
        })

    }

    remarks(event: any) {
        this.setState({
            remarks: event.target.value,
        })
    }

    endDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate(date)
    }

    dateCreate = (date: any) => {
        let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let year = date.getFullYear();
        let finaldate = year + '-' + mnth + '-' + day;
        this.setState({
            taskClosingDate: finaldate,
        })

    }

    selectStatus(data: any) {
        this.setState({
            status: data
        })
    }

    ////////////////////////////////// File Upload ////////////////////////////////////////
    fileUpload() {
        (document.getElementById('upload') as HTMLInputElement).click()
    };

    onFileChoose(event: any) {

        this.setState({
            files: [...this.state.files, event.target.files[0]]
        })
    }

    ////////////////////////// File Remove /////////////////////////////////////////
    filesRemoveOne(index: any) {
        var array = [...this.state.files];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ files: array });
        }
    }

    updateTask() {
        const data = {
            "TaskDetailsType": "assignedtome",
            "TaskId": this.state.taskId,
            "TaskReferenceNo": this.state.taskData.taskReferenceNo,
            "MeetingId": this.state.meetingId,
            "TaskClosureDate": this.state.taskClosingDate + "T00:00:00",
            "TaskStatus": this.state.status,
            "TaskRemarks": this.state.remarks,
            "UpdatedBy": this.state.CreatedBy,
            "UpdatedByEmail": this.state.CreatedByEmail,
            "UpdatedByADID": this.state.CreatedByADID
        }
        var taskUpdateFormData = new FormData()
        taskUpdateFormData.append("taskData", JSON.stringify(data));

        if (this.state.files.length > 0) {
            console.log(" Meeting data if")
            Promise.all(this.state.files.map((file: any) => {
                taskUpdateFormData.append("Files", file);
                return taskUpdateFormData
            })).then(() => {
                updateTaskAPI(taskUpdateFormData).then((res: any) => {
                    if (res.data.message === "Task details updated successfully") {
                        microsoftTeams.tasks.submitTask()
                    }
                    console.log("update", res)
                })
            })

        }
        else {
            updateTaskAPI(taskUpdateFormData).then((res: any) => {
                if (res.data.message === "Task details updated successfully") {
                    microsoftTeams.tasks.submitTask()
                }
                console.log("update", res)
            })
        }

    }


    render() {

        return (
            <div> {!this.state.loading ? <div className=" ml-4 mr-4 " >
                <div>
                    <div className='col-12'>
                        <div className='d-flex mb-2 mt-2'>
                            {/* <div>
                                        <Edit20Regular color="grey" />
                                    </div> */}
                            <div className='ms-2'>
                                <Text className='d-block' color="grey" content="Issue discussed (Task context)" size="small" timestamp />
                                <Text className='d-block' content={this.state.taskData.taskContext} size="medium" weight="regular" />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='d-flex mb-2'>
                            {/* <div>
                                        <TagMultiple20Regular color="grey" />
                                    </div> */}
                            <div className='ms-2'>
                                <Text className='d-block' color="grey" content="Decision taken (Action plan agreed)" size="small" timestamp />
                                <Text className='d-block' content={this.state.taskData.taskActionPlan} size="medium" weight="regular" />
                            </div>
                        </div>
                    </div>
                    <div className='d-flex mb-2'>
                        <div className='col-sm-6'>
                            <div className='d-flex'>
                                {/* <div>
                                        <ArrowRepeatAll20Regular color="grey" />
                                    </div> */}
                                <div className='ms-2'>
                                    <Text className='d-block' color="grey" content="Priority" size="small" timestamp />
                                    <Text className='d-block' content={this.state.taskData.taskPriority} size="medium" weight="regular" />
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='d-flex'>
                                {/* <div>
                                        <Channel20Regular color="grey" />
                                    </div> */}
                                <div className='ms-2'>
                                    <Text className='d-block' color="grey" content="Status" size="small" timestamp />
                                    <Text className='d-block' content={this.state.taskData.taskStatus} size="medium" weight="regular" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className="d-flex m-2">
                    <FormDatepicker
                        onDateChange={(e, v) => this.endDate(e, v)}
                        inputOnly
                        minDate={new Date()}
                        inputPlaceholder={moment(this.state.taskClosingDate).format('LL')}
                        className="w-100"
                        label="Task closing date"

                    />
                    <FormDropdown
                        label="Status"
                        items={this.state.statusInputItems}
                        onChange={(event, { value }) => this.selectStatus(value)}
                        placeholder="Select Task Status"
                    />
                </div>
                <FormTextArea
                    label="Remarks"
                    onChange={(event) => this.remarks(event)}
                    className="taskRemarks m-2"
                />
                <div className='mt-2'>
                    <div className='m-2'>
                            <Input type="file" id="upload" style={{ display: 'none' }} onChange={(value: any) => this.onFileChoose(value)} ></Input>
                            <div onClick={() => this.fileUpload()} className='taskFileUploadBtn pointer '>Upload file</div>
                    </div>
                    {(this.state.files.length > 0) && <div>
                        {this.state.files.map((file: any, i: any) => {
                            return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                    <Text size="medium">{file.name}</Text>
                                    <div className="pointer backButtonMessagingExtention" onClick={() => this.filesRemoveOne(i)}>
                                        <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                    </div>

                                </Flex>

                            </Flex>
                        })}

                    </div>

                    }
                </div>
                <Flex className="m-4 mt-2 bottomButton" vAlign="end" hAlign="end">
                    <Button content="Cancel" onClick={() => microsoftTeams.tasks.submitTask()} secondary />
                    <Flex className="buttonContainer ml-3">
                        <Button content={!this.state.taskCreateLoading ? "Update" : <Loader size="smaller" />} id="saveBtn" onClick={() => this.updateTask()} primary
                        />
                    </Flex>
                </Flex>
            </div> : <Loader styles={{ margin: "50px" }} />}
            </div>
        );
    }
}



export default UpdateTask;
