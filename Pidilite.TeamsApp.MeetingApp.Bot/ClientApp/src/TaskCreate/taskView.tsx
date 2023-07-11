import React, { Component } from 'react';
import './styles.scss';
import { Text, Divider, Header, Loader } from '@fluentui/react-northstar';

import { getAllMeetingParticipantAPI, createTaskAPI, getUserProfileAPI } from './../apis/APIList'
import * as microsoftTeams from "@microsoft/teams-js";
import moment from 'moment';
const baseUrl = window.location.origin;

const backImage = baseUrl + "/images/left-arrow.svg";



type MyState = {
    meetingID?: any;
    chatId?: any;
    taskContext?: string;
    taskDecision?: string;
    priority?: string;
    priorityInputList?: any;
    closingDate?: any;
    taskAssigneeList?: any;
    participantsList?: any;
    taskClosingDate?: string;
    CreatedBy?: string;
    CreatedByEmail?: string;
    CreatedByADID?: any;
    assigneePrticipantName?: any;
    selectedParticipantsData?: any
    loading?: boolean
};

interface ITaskViewProps {
    history?: any;
    location?: any
}

class TaskView extends React.Component<ITaskViewProps, MyState> {
    constructor(props: ITaskViewProps) {
        super(props)
        this.state = {
            priorityInputList: ["P1", "P2", "KI"],
            taskAssigneeList: [],
            taskContext: "",
            taskDecision: "",
            loading: true
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
            this.setState({
                chatId: context.chatId
            })
        });
        if (this.props.location.state) {
            this.setState({
                meetingID: this.props.location.state.meetingData,
                loading: false
            }, () => {
                console.log("check", this.state.meetingID)
            })
        }
    }









    render() {
        return (
            <div className='p-3 h-100'>
                {!this.state.loading ? <div>
                    <div className="displayFlex " style={{ alignItems: "center" }}>
                    <div className="pointer" onClick={() => this.props.history.push('/taskdashboard')}>
                            <img src={backImage} alt='Back'/>
                        </div>
                        <Header as="h6" content="View task" className="headingText ml-2"></Header>
                    </div>
                    <Divider className="mt-2 mb-3 mr-0 ml-0 " />
                    <div className='mt-3'>
                        <div className='d-flex flex-column'>
                            <Text content="Issue discussed(Task context)"></Text>
                            <Text content={this.state.meetingID.taskContext} weight="semibold" size="medium" />
                        </div>
                        <div className='d-flex flex-column mt-3'>
                            <Text content="Decision taken(Action plan agreed)"></Text>
                            <Text content={this.state.meetingID.taskActionPlan} weight="semibold"size="medium" />
                        </div>
                        <div className='d-flex flex-column mt-3'>
                            <Text content="Priority"></Text>
                            <Text content={this.state.meetingID.taskPriority} weight="semibold" size="medium"/>
                        </div>
                        <div className='d-flex flex-column mt-3'>
                            <Text content="Action to be taken by"></Text>
                            <div className='d-flex flex-column'>
                                <Text content={this.state.meetingID.assignedTo} size="medium" weight="semibold" />
                                <Text content={this.state.meetingID.assignedToEmail} weight="semibold" size="small" />
                            </div>

                        </div>
                        <div className='d-flex flex-column mt-3'>
                            <Text content="Target closure date"></Text>
                           {this.state.meetingID.taskPriority !== "KI" && <Text content={moment(this.state.meetingID.taskClosureDate).format('LL')} weight="semibold" size="medium" /> } 
                        </div>
                        <div className='d-flex flex-column mt-3'>
                            <Text content="Status"></Text>
                            <Text content={this.state.meetingID.taskStatus} weight="semibold" size="medium" />
                        </div>
                        {/* <div className='d-flex flex-column'>
                            <Text content="Status"></Text>
                            <Text content={this.state.meetingID.taskStatus}></Text>
                        </div> */}



                    </div>
                </div> : <Loader styles={{ margin: "50px" }} />}
            </div>
        );
    }
}

export default TaskView;