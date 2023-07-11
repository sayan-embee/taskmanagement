import React from 'react';

import { Button, Input, Loader, Flex, Text, Divider } from "@fluentui/react-northstar";
import { getTaskMeetingDetailsAPI, getAllPrevTaskDetailsAPI, uploadMeetingFilesAPI, getFileExtensionsAPI, getUserProfileAPI } from './../apis/APIList'
import './styles.scss'
import * as microsoftTeams from "@microsoft/teams-js";

const baseUrl = window.location.origin;
const rightArrowImage = baseUrl + "/images/right_arrow_task.png";
const documentIcon = baseUrl + "/images/documentIcon.png";

type MyState = {
    meetingID?: any;
    chatId?: any;
    startDate?: any;
    meetingData?: any;
    files?: any;
    taskContext?: any;
    assignTo?: any;
    previousOfPreviousMeetingTask?: any;
    currentMeetingTask?: any;
    previousMeetingTask?: any;
    loading?: boolean;
    meetingFile?: any;
    documentUploadLoading?: boolean;
    fileExtensionList?: any;
    userEmail?: any
};

interface IMeetingTaskDashboardProps {
    history?: any;
    location?: any
}



class TaskDashboard extends React.Component<IMeetingTaskDashboardProps, MyState> {
    constructor(props: IMeetingTaskDashboardProps) {
        super(props)
        this.state = {
            files: [],
            previousOfPreviousMeetingTask: [],
            currentMeetingTask: [],
            previousMeetingTask: [],
            loading: true,
            meetingFile: []
        };
    }

    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
            this.setState({
                chatId: context.chatId
            }, () => {
                this.systemDate()
            })
        });
        this.getFileExtensions();
        this.getUserProfile();
    }

    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                userEmail: res.data.mail,
            })
        })
    }
    ///////////////////////////// Get file extension list function ////////////////////////////
    getFileExtensions() {
        getFileExtensionsAPI().then((res: any) => {
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.extName)
            console.log("api extension get", result);
            this.setState({
                fileExtensionList: result.toString()
            })
        })
    }

    systemDate = () => {
        var date = new Date();
        this.dateCreate(date)
    }

    search() {
        this.setState({
            loading: true
        }, () => {
            this.getAllTask()
        })
    }

    dateCreate = (date: any) => {
        let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let year = date.getFullYear();
        let finaldate = year + '-' + mnth + '-' + day;
        this.setState({
            startDate: finaldate,
        }, () => {
            this.getTaskMeetingDetails()
        })

    }

    getTaskMeetingDetails() {
        const data = {
            chatId: this.state.chatId,
            id: 0,
            startDate: this.state.startDate + "T00:00:00"
        }
        getTaskMeetingDetailsAPI(data).then((res) => {
            console.log("res", res.data)
            this.setState({
                meetingData: res.data,
                meetingID: res.data.meetingId,
                meetingFile: res.data.meetingFileUpload
            }, () => {
                this.getAllTask()
            })
        })
    }


    getAllTask() {
        const data = {
            "MeetingId": this.state.meetingID,
            "SeriesMasterId": (this.state.meetingData.repeatOption !== "DoesNotRepeat") ? this.state.meetingData.seriesMasterId : null,
            "TaskContext": this.state.taskContext,
            "AssignedTo": this.state.assignTo
        }

        getAllPrevTaskDetailsAPI(data).then((res: any) => {
            const current_Meeting_Task = res.data.filter((e: any) => e.meetingId === e.currentMeetingId)
            const pre_Meeting_Task = res.data.filter((e: any) => e.meetingId === e.prevMeetingId)
            const pre_of_pre_Meeting_Task = res.data.filter((e: any) => e.meetingId !== e.prevMeetingId && e.meetingId !== e.currentMeetingId)
            this.setState({
                loading: false,
                previousOfPreviousMeetingTask: pre_of_pre_Meeting_Task,
                currentMeetingTask: current_Meeting_Task,
                previousMeetingTask: pre_Meeting_Task
            })
            // console.log("res task details", res.data)
            // console.log("res task details pre of pre", pre_of_pre_Meeting_Task)

        })

    }

    ////////////////////////////////// File Upload ////////////////////////////////////////
    fileUpload() {
        (document.getElementById('upload') as HTMLInputElement).click()
    };

    onFileChoose(event: any) {
        this.setState({
            documentUploadLoading: true
        })
        var uploadFileFormData = new FormData()
        uploadFileFormData.append("file", event.target.files[0]);
        uploadMeetingFilesAPI(uploadFileFormData, this.state.meetingID).then((res: any) => {
            console.log("upload meeting", res)
            if (res.data) {
                this.setState({
                    documentUploadLoading: false,
                    meetingFile: res.data
                })
            }
        })

    }

    taskContext = (event: any) => {
        this.setState({
            taskContext: event.target.value
        })
    }

    assignTo = (event: any) => {
        this.setState({
            assignTo: event.target.value
        })
    }

    render() {

        return (
            <div>
                {this.state.meetingID ?
                    <div className='p-3'>

                        {((this.state.userEmail === this.state.meetingData.anchorEmail) || (this.state.userEmail === this.state.meetingData.createdByEmail)) && <Button content="+ Assign task" fluid loader="Navigate driver" onClick={() => {
                            this.props.history.push(`/createtask?from=inMeeting&id=${this.state.meetingID}`)
                        }} />}
                        <Divider className="m-3" />
                        <div>
                        <Text content="Search any task" styles={{"textAlign":"center"}}/>
                            <div className="mt-3 mb-3">
                                <Input
                                    placeholder='Task Title'
                                    name="Taskcontext"
                                    id="Taskcontext"
                                    fluid
                                    autoComplete="off"
                                    onChange={(e) => this.taskContext(e)}
                                />
                                <Input
                                    className="mt-2"
                                    placeholder='Assign To'
                                    name="firstName"
                                    id="first-name"
                                    fluid
                                    autoComplete="off"
                                    onChange={(e) => this.assignTo(e)}
                                />
                                <Button content="Search Task" fluid loader="Navigate driver" onClick={() => this.search()} primary className="mt-2" />
                            </div>
                            {!this.state.loading ? <div className='assignTaskBlock'>
                                <div className='d-flex flex-column assignTaskBlock'>
                                    <Text content="Assigned task of current meeting" />
                                    {(this.state.currentMeetingTask.length > 0) ? <div>
                                        {this.state.currentMeetingTask.map((e: any) => {
                                            return <div className='assignTaskShow pointer' onClick={() => {
                                                this.props.history.push({ pathname: "/taskview", state: { meetingData: e } })
                                            }} >
                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                                    <Text size="medium" content={e.taskContext} className="m-2" />
                                                    <div className="pointer backButtonMessagingExtention">
                                                        {/* <Text size="medium" content="->"></Text> */}
                                                        <img src={rightArrowImage} style={{ height: "36px", width: "30px" }} alt='Cancel' />
                                                    </div>

                                                </Flex>
                                            </div>
                                        })}
                                    </div> : <Text content="No task" />
                                    }</div>
                                <div className='d-flex flex-column assignTaskBlock mt-2 mb-2'>
                                    <Text content="Assigned task of previous meeting" />
                                    {(this.state.previousMeetingTask.length > 0) ? <div>
                                        {this.state.previousMeetingTask.map((e: any) => {
                                            return <div className='assignTaskShow pointer' onClick={() => {
                                                this.props.history.push({ pathname: "/taskview", state: { meetingData: e } })
                                            }} >
                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                                    <Text size="medium" content={e.taskContext} className="m-2" />
                                                    <div className="pointer backButtonMessagingExtention">
                                                        {/* <Text size="medium" content="->"></Text> */}
                                                        <img src={rightArrowImage} style={{ height: "36px", width: "30px" }} alt='Cancel' />
                                                    </div>
                                                </Flex>
                                            </div>
                                        })}
                                    </div> : <Text content="No task" />
                                    }</div>
                                <div className='d-flex flex-column assignTaskBlock mt-2 mb-2'>
                                    <Text content="Previous of previous meeting pending task" />
                                    {(this.state.previousOfPreviousMeetingTask.length > 0) ? <div>
                                        {this.state.previousOfPreviousMeetingTask.map((e: any) => {
                                            return <div className='assignTaskShow pointer' onClick={() => {
                                                this.props.history.push({ pathname: "/taskview", state: { meetingData: e } })
                                            }} >
                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                                    <Text size="medium" content={e.taskContext} className="m-2" />
                                                    <div className="pointer backButtonMessagingExtention">
                                                        {/* <Text size="medium" content="->"></Text> */}
                                                        <img src={rightArrowImage} style={{ height: "36px", width: "30px" }} alt='Cancel' />
                                                    </div>
                                                </Flex>
                                            </div>
                                        })}
                                    </div> : <Text content="No task" />
                                    }</div>
                            </div> : <Loader styles={{ margin: "50px" }} />}
                        </div>
                        <Divider className="m-3" />
                        <div>
                            <div>
                                <div>
                                    <Input type="file" id="upload" style={{ display: 'none' }} onChange={value => this.onFileChoose(value)} accept={this.state.fileExtensionList}></Input>
                                    <Button onClick={() => this.fileUpload()} fluid primary content={!this.state.documentUploadLoading ? "Upload File" : <Loader size="smaller" />} /></div>
                                <div className='w-100'>
                                    {(this.state.meetingFile.length > 0) && <div className='mt-3'>
                                        {this.state.meetingFile.map((file: any, i: any) => {
                                            return <div style={{ marginBottom: "10px" }} key={i}>
                                                <div className='d-flex align-items-center'>
                                                    <img src={documentIcon} style={{ height: "28px", width: "28px" }} alt='Document Icon' />
                                                    <Text size="medium" className="ml-2" content={file.fileName} />
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div> : <Loader styles={{ margin: "50px" }} />
                }
            </div>

        );
    }
}



export default TaskDashboard;
