import React from 'react';
import { getTaskDetailsByIdAPI, getUserProfileAPI, updateTaskAPI } from './../../apis/APIList'
import "./../styles.scss"
import "./../../App.scss"
import { Text, Button, FormDatepicker, Flex, FormInput, Form, FormTextArea, FormDropdown, Loader } from "@fluentui/react-northstar";
import moment from 'moment';
import * as microsoftTeams from "@microsoft/teams-js";
import { Container, Row, Col } from 'react-bootstrap';

interface MyState {
    meetingID?: any;
    taskContext?: string;
    taskDecision?: string;
    priority?: string;
    priorityInputList?: any;
    taskClosingDate?: string;
    CreatedBy?: string;
    CreatedByEmail?: string;
    CreatedByADID?: any;
    taskCreateLoading?: boolean;
    openFrom?: any;
    taskId?: any;
    loading?: any;
    taskReferenceNo?: any;
    meetingId?: any;
};

interface IUpdateParticularTaskProps {
    history?: any;
    location?: any
}

class EditAssignTask extends React.Component<IUpdateParticularTaskProps, MyState> {
    constructor(props: IUpdateParticularTaskProps) {
        super(props);
        this.state = {
            loading: true,
            priorityInputList: ["High", "Medium", "Low", "KI", "Minutes"],
            taskContext: "",
            taskDecision: ""
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
            console.log("result task details", res)
            if (res.data) {
                const end_date = res.data.taskClosureDate.split('T')
                this.setState({
                    taskContext: res.data.taskContext,
                    taskDecision: res.data.taskActionPlan,
                    priority: res.data.taskPriority,
                    meetingId: res.data.meetingId,
                    taskReferenceNo: res.data.taskReferenceNo,
                    taskClosingDate: end_date[0],
                    loading: false
                })
            }
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

    isBtnDisable() {
        if (this.state.priority !== "KI") {
            if (this.state.priority === "Minutes") {
                return !(this.state.taskContext && this.state.priority)
            }
            else {
                return !(this.state.taskContext && this.state.priority && this.state.taskClosingDate)
            }
        }
        else {
            return !(this.state.taskContext && this.state.priority)
        }
    }

    updateTask() {
        this.setState({
            taskCreateLoading: true
        })
        const data = {
            "TaskDetailsType": "assignedbyme",
            "TaskContext": this.state.taskContext,
            "TaskActionPlan": this.state.taskDecision,
            "TaskPriority": this.state.priority,
            "TaskId": this.state.taskId,
            "TaskReferenceNo": this.state.taskReferenceNo,
            "MeetingId": this.state.meetingId,
            "TaskClosureDate": (this.state.priority !== "KI") ? (this.state.priority !== "Minutes") ? this.state.taskClosingDate + "T00:00:00" : null : null,
            "TaskStatus": null,
            "TaskRemarks": null,
            "UpdatedBy": this.state.CreatedBy,
            "UpdatedByEmail": this.state.CreatedByEmail,
            "UpdatedByADID": this.state.CreatedByADID
        }
        var taskUpdateFormData = new FormData()
        taskUpdateFormData.append("taskData", JSON.stringify(data));
        updateTaskAPI(taskUpdateFormData).then((res: any) => {
            if (res.data.message === "Task details updated successfully") {
                microsoftTeams.tasks.submitTask()
            }
            console.log("update", res)
        })
    }


    render() {

        return (
            <div>
                {!this.state.loading ? <div className='pl-3 pr-3 h-100 mt-3 '>
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
                            value={this.state.taskContext}
                            onChange={(e) => { this.taskContext(e) }}
                        />
                        <FormTextArea
                            label="Decision taken(Action plan agreed)"
                            name="lastName"
                            id="last-name"
                            fluid
                            required
                            value={this.state.taskDecision}
                            onChange={(e) => this.taskDecision(e)}
                        />



                        <div>
                            <FormDropdown fluid
                                label="Priority*"
                                items={this.state.priorityInputList}
                                value={this.state.priority}
                                onChange={(event, { value }) => this.selectPriority(value)}
                                placeholder="Select Task Priority"
                            />
                            {(this.state.priority !== "KI") ? (this.state.priority !== "Minutes") ? <FormDatepicker
                                onDateChange={(e, v) => this.endDate(e, v)}
                                inputOnly
                                minDate={new Date()}
                                inputPlaceholder={moment(this.state.taskClosingDate).format('LL')}
                                className="w-100"
                                label="Task closing date*"

                            /> : null : null}
                        </div>

                    </Form>
                    <div className="mt-3">
                        <Text size="medium" content="* marks are required field" ></Text>
                    </div>

                    <Flex className="m-4 mt-2 bottomButton" vAlign="end" hAlign="end">
                        <Button content="Cancel" onClick={() => microsoftTeams.tasks.submitTask()} secondary />
                        <Flex className="buttonContainer ml-3">
                            <Button content={!this.state.taskCreateLoading ? "Update" : <Loader size="smaller" />} id="saveBtn" onClick={() => this.updateTask()} primary
                                disabled={this.isBtnDisable()} />
                        </Flex>
                    </Flex>
                </div> : <Loader styles={{ margin: "50px" }} />}
            </div>
        );
    }
}



export default EditAssignTask;
