import React from 'react';

import { Text, Button, FormDatepicker, Flex, FormInput, Form, FormTextArea, FormDropdown, Loader } from '@fluentui/react-northstar';

import { createTaskAPI, getUserProfileAPI, getFilteredUsersAPI } from './../apis/APIList'

import * as microsoftTeams from "@microsoft/teams-js";
import moment from 'moment';
import { debounce } from "lodash";

import "./../App.scss"
import './styles.scss';

const baseUrl = window.location.origin;

const cancelImage = baseUrl + "/images/darkThemeCancel.png";



type MyState = {
    meetingID?: any;
    taskContext?: string;
    taskDecision?: string;
    priority?: string;
    priorityInputList?: any;
    taskAssigneeList?: any;
    participantsList?: any;
    taskClosingDate?: string;
    CreatedBy?: string;
    CreatedByEmail?: string;
    CreatedByADID?: any;
    assigneePrticipantName?: any;
    selectedParticipantsData?: any;
    participantLoading?: boolean;
    taskCreateLoading?: boolean;
    openFrom?: any;
};

interface ICreateTaskProps {
    history?: any;
    location?: any
}

class CreateTask extends React.Component<ICreateTaskProps, MyState> {
    constructor(props: ICreateTaskProps) {
        super(props)
        this.state = {
            priorityInputList: ["High", "Medium","Low", "KI", "Minutes"],
            taskAssigneeList: [],
            taskContext: "",
            taskDecision: "",
            participantsList: []
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            meetingID: params.get('id'),
            openFrom: params.get('from')
        })
        this.getUserProfile()
    }

    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                CreatedBy: res.data.displayName,
                CreatedByEmail: res.data.mail,
                CreatedByADID: res.data.id
            })
        })
    }

    taskContext = (event: any) => {
        this.setState({
            taskContext: event.target.value
        })
    }

    taskDecision = (event: any) => {
        this.setState({
            taskDecision: event.target.value
        })
    }

    selectPriority(data: any) {
        this.setState({
            priority: data
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

    taskCreate() {
        this.setState({
            taskCreateLoading: true
        })
        const data = {
            "MeetingId": this.state.meetingID,
            "TaskContext": this.state.taskContext,
            "TaskActionPlan": this.state.taskDecision,
            "TaskPriority": this.state.priority,
            "TaskClosureDate": (this.state.priority !== "KI") ? (this.state.priority !== "Minutes") ? this.state.taskClosingDate + "T00:00:00" : null : null,
            "ActionTakenBy": this.state.CreatedBy,
            "ActionTakenByEmail": this.state.CreatedByEmail,
            "ActionTakenByADID": this.state.CreatedByADID,
            "CreatedBy": this.state.CreatedBy,
            "CreatedByEmail": this.state.CreatedByEmail,
            "CreatedByADID": this.state.CreatedByADID,
            "TaskParticipant": (this.state.priority !== "KI") ? (this.state.priority !== "Minutes") ? this.state.taskAssigneeList : null : null
        }
        console.log("payload create task", data)
        var createTaskFormData = new FormData()
        createTaskFormData.append("taskData", JSON.stringify(data));
        createTaskAPI(createTaskFormData).then((res: any) => {
            console.log("user", res);
            if (res.data.message === "Task details inserted successfully") {
                if (this.state.openFrom === "inMeeting") {
                    this.props.history.push("/taskdashboard")
                }
                else {
                    microsoftTeams.tasks.submitTask()
                }
            }
        })

    }

    participantsSearch(event: any) {
        this.setState({
            assigneePrticipantName: event.target.value,
            participantLoading: true

        }, () => {
            if (event.target.value) {
                this.debouncedSearchParticipants(event.target.value);
            }
            else {
                this.setState({
                    assigneePrticipantName: null,
                    selectedParticipantsData: []
                })
            }
        })
    }

    debouncedSearchParticipants = debounce(async (criteria) => {
        if(this.state.assigneePrticipantName){
            getFilteredUsersAPI(criteria).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        selectedParticipantsData: res.data,
                        participantLoading: false
                    })
                }

            })
        }
       
      }, 600);

    selectAssigneFunction(ele: any) {
        console.log("sayan", ele)
        const employeeMail = ele.mail;
        if (this.state.taskAssigneeList.length > 0) {
            const found = this.state.taskAssigneeList.some((e: any) => e.assignedToEmail === employeeMail);
            if (!found) {
                this.setState({
                    taskAssigneeList: [...this.state.taskAssigneeList, { "AssignedTo": ele.displayName, "AssignedToEmail": ele.mail, "AssignedToADID": ele.id }],
                    assigneePrticipantName: null
                })

            }
            else {
                this.setState({
                    assigneePrticipantName: null
                })

            }

        }
        else {
            this.setState({
                taskAssigneeList: [...this.state.taskAssigneeList, { "AssignedTo": ele.displayName, "AssignedToEmail": ele.mail, "AssignedToADID": ele.id }],
                assigneePrticipantName: null

            })
        }
    }

    cancelEmployee(ele: any) {
        var index = this.state.taskAssigneeList.findIndex((x: any) => x.ParticipantEmail === ele.ParticipantEmail)
        var array = [...this.state.taskAssigneeList];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ taskAssigneeList: array });
        }
    }

    isBtnDisable() {
        if (this.state.priority !== "KI") {
            if (this.state.priority === "Minutes") {
                return !(this.state.taskContext && this.state.priority)
            }
            else {
                return !(this.state.taskContext && this.state.priority && this.state.taskClosingDate && this.state.taskAssigneeList.length > 0)
            }
        }
        else {
            return !(this.state.taskContext && this.state.priority)
        }
    }

    handleSelectionChanged = (e:any) => {
        console.log("sayan",e.target.selectedPeople);
      };

    render() {
        return (
            <div>
                {this.state.meetingID ? <div className='pl-3 pr-3 h-100 mt-3 '>
                    <div className="displayFlex mb-2" style={{ alignItems: "center" }}>
                        {/* <Header as="h6" content="Assign new task" className="headingText"></Header> */}
                    </div>
                    <Form>
                        <FormInput
                            label="Issue discussed(Task context)"
                            name="firstName"
                            id="first-name"
                            required
                            autoComplete="off"
                            fluid
                            onChange={(e) => { this.taskContext(e) }}
                        />
                        <FormTextArea
                            label="Decision taken(Action plan agreed)"
                            name="lastName"
                            id="last-name"
                            fluid
                            required
                            onChange={(e) => this.taskDecision(e)}
                        />

                        <FormDropdown fluid
                            label="Priority*"
                            items={this.state.priorityInputList}
                            onChange={(event, { value }) => this.selectPriority(value)}
                            placeholder="Select Task Priority"
                        />
                        {(this.state.priority !== "KI") ? (this.state.priority !== "Minutes") ? <div><FormInput
                            label="Action to be taken by"
                            required
                            fluid
                            autoComplete="off"
                            showSuccessIndicator={false}
                            value={this.state.assigneePrticipantName}
                            onChange={(e) => this.participantsSearch(e)}
                        />
                            {(this.state.assigneePrticipantName) && <div className='searchList'>{!this.state.participantLoading ? <div>
                                {this.state.selectedParticipantsData && (this.state.selectedParticipantsData.length > 0) ? this.state.selectedParticipantsData.map((ele: any, i: any) =>
                                    <div key={i} className="p-2 d-flex flex-column pointer" onClick={() => this.selectAssigneFunction(ele)}>
                                        <Text size="medium" content={ele.displayName}></Text>
                                        <Text size="small" content={ele.mail}></Text>
                                    </div>
                                ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}

                            </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                            </div>
                            }
                            {/* {(this.state.selectedParticipantsData && (this.state.assigneePrticipantName)) && <div className='searchList'>
                            {(this.state.selectedParticipantsData.length > 0) ? this.state.selectedParticipantsData.map((ele: any, i: any) =>
                                <div key={i} className="p-2 d-flex flex-column pointer" onClick={() => this.selectAssigneFunction(ele)}>
                                    <Text size="medium" content={ele.displayName}></Text>
                                    <Text size="small" content={ele.mail}></Text>
                                </div>
                            ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}

                        </div>} */}
                            {this.state.taskAssigneeList.length > 0 && <div>
                                {this.state.taskAssigneeList.map((e: any, i: any) => {
                                    return <Flex column styles={{ marginBottom: "10px", marginTop: "5px" }} key={i}>
                                        <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                            <Text size="medium">{e.AssignedTo}</Text>
                                            <div className="pointer backButtonMessagingExtention" onClick={() => this.cancelEmployee(e)}>
                                                <img src={cancelImage} style={{ height: "20px" }} alt='Cancel' />
                                            </div>

                                        </Flex>

                                    </Flex>
                                })}
                            </div>}

                        </div> : null : null}
                      
                        {(this.state.priority !== "KI") ? (this.state.priority !== "Minutes") ? <FormDatepicker
                            onDateChange={(e, v) => this.endDate(e, v)}
                            inputOnly
                            minDate={new Date()}
                            inputPlaceholder={moment(this.state.taskClosingDate).format('LL')}
                            className="w-100"
                            label="Task closing date*"

                        /> : null : null}
                    </Form>
                    <div className="mt-3">
                        <Text size="medium" content="* marks are required field" ></Text>
                    </div>

                    <Flex className="m-2 mt-2 bottomButton" vAlign="end" hAlign="end">
                        <Button content="Cancel" onClick={() => this.props.history.push("/taskdashboard")} secondary />
                        <Flex className="buttonContainer ml-3">
                            <Button content={!this.state.taskCreateLoading ? "Save" : <Loader size="smaller" />} id="saveBtn" onClick={() => this.taskCreate()} primary
                                disabled={this.isBtnDisable()} />
                        </Flex>
                    </Flex>
                </div> : <Loader styles={{ margin: "50px" }} />}
            </div>
        );
    }
}

export default CreateTask;