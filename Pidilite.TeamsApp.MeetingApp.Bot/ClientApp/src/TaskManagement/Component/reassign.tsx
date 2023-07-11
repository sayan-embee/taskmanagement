import React from 'react';
import { Text, Loader, Flex, Button, Card, CardBody, Form, FormInput,Alert } from "@fluentui/react-northstar";
//import {CheckmarkCircle32Regular} from "@fluentui/react-icons";
import * as microsoftTeams from "@microsoft/teams-js";
import { Persona, PersonaSize } from '@fluentui/react';
import { debounce } from "lodash";

import "./../styles.scss"
import { getTaskDetailsByIdAPI, getFilteredUsersAPI, reassignTaskAPI, getUserProfileAPI } from './../../apis/APIList'



interface MyState {
    loading?: any;
    taskId?: any;
    taskData?: any;
    reassigneePrticipantName?: any;
    selectedReassignParticipantsData?: any;
    reassignTo?: any;
    reassignToEmail?: any;
    reassignToAdid?: any;
    CreatedBy?: string;
    CreatedByEmail?: string;
    CreatedByADID?: any;
    assignType?: any;
    assigneePrticipantName?: any;
    selectedAssignParticipantsData?: any;
    assignTo?: any;
    assignToEmail?: any;
    assignToAdid?: any;
    participantLoading?: boolean;
    buttonLoading?: boolean;
    successMessage?:any;
    errorMessage?:any;
    alertDiv?:boolean
}

interface IViewParticularTaskProps {
    history?: any;
    location?: any
}

class ReassignTask extends React.Component<IViewParticularTaskProps, MyState> {
    constructor(props: IViewParticularTaskProps) {
        super(props);
        this.state = {
            loading: true,
            taskId: "",
            selectedReassignParticipantsData: [],
            assignTo: '',
            assignType: '',
            selectedAssignParticipantsData: [],
            alertDiv:false,
            errorMessage:""
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            taskId: params.get('id'),
            assignType: params.get('type')
        }, () => {
            console.log("id", this.state.taskId, this.state.assignType)
            if (this.state.taskId) {
                this.getTaskDetails(this.state.taskId)
            }
            else {
                this.setState({
                    loading: false,
                })
            }

        })
        this.getUserProfile();
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
        });
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
    getTaskDetails = (id: any) => {
        getTaskDetailsByIdAPI(id).then((res: any) => {
            console.log("res", res)
            if (res.data) {
                this.setState({
                    taskData: res.data,
                    loading: false,
                    assignTo: res.data.assignedTo,
                    assignToAdid: res.data.assignedToADID
                })
            }
        })

    }

    reassignToParticipantsSearch(event: any) {
        this.setState({
            reassignTo: event.target.value,
            reassigneePrticipantName: 1,
            participantLoading: true
        }, () => {
            if (event.target.value) {
                this.debouncedreassignToParticipantsSearch(this.state.reassignTo)
            }
            else {
                this.setState({
                    reassigneePrticipantName: null,
                    selectedReassignParticipantsData: []
                })
            }

        })
    }

    debouncedreassignToParticipantsSearch = debounce(async (name) => {
        if (this.state.reassignTo) {
            getFilteredUsersAPI(this.state.reassignTo).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        selectedReassignParticipantsData: res.data,
                        participantLoading: false
                    })
                }

            })
        }

    }, 600);

    selectReassigneFunction(ele: any) {
        this.setState({
            reassigneePrticipantName: null,
            reassignTo: ele.displayName,
            reassignToEmail: ele.mail,
            reassignToAdid: ele.id,
            selectedReassignParticipantsData: []
        })
    }

    assignToParticipantsSearch(event: any) {
        this.setState({
            assignTo: event.target.value,
            assigneePrticipantName: 1,
            participantLoading: true
        }, () => {
            if (event.target.value) {
                this.debouncedAssignToParticipantsSearch(this.state.assignTo)
            }
            else {
                this.setState({
                    assigneePrticipantName: null,
                    selectedAssignParticipantsData: []
                })
            }
        })
    }

    debouncedAssignToParticipantsSearch = debounce(async (name) => {
        if (this.state.assignTo) {
            getFilteredUsersAPI(this.state.assignTo).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        selectedAssignParticipantsData: res.data,
                        participantLoading: false
                    })
                }
            })
        }
    }, 600);


    selectAssigneFunction(ele: any) {
        this.setState({
            assigneePrticipantName: null,
            assignTo: ele.displayName,
            assignToEmail: ele.mail,
            assignToAdid: ele.id,
            selectedAssignParticipantsData: []
        })
    }



    save() {
        this.setState({ buttonLoading: true })
        const data = {
            "TaskDetailsType": this.state.assignType === "reassignAll"?"ReassignAll":"Reassign",
            "TaskId": this.state.assignType !== "reassignAll" ? this.state.taskData.taskId : null,
            "MeetingId": this.state.assignType !== "reassignAll" ? this.state.taskData.meetingId : null,
            "AssignedTo": this.state.reassignTo,
            "AssignedToEmail": this.state.reassignToEmail,
            "AssignedToADID": this.state.reassignToAdid,
            "OldAssignedToADID": this.state.assignToAdid,
            "UpdatedBy": this.state.CreatedBy,
            "UpdatedByEmail": this.state.CreatedByEmail,
            "UpdatedByADID": this.state.CreatedByADID
        }
        reassignTaskAPI(data).then((res: any) => {
            console.log("reassign", res.data)
            if (res.data.message==="Task reassigned successfully") {
                this.setState({
                    buttonLoading: false,
                    alertDiv:true
                },()=>{
                    this.debouncedTaskModuleClose();
                })
            }
            else{
                this.setState({
                    buttonLoading: false,
                    alertDiv:true,
                    errorMessage:res.data.errorMessage
                },()=>{
                    this.debouncedTaskModuleClose();
                })
            }
        })
    }


    debouncedTaskModuleClose = debounce(async () => {
        microsoftTeams.tasks.submitTask()
      }, 30000);
    

    render() {
        return (
            <div>
           {!this.state.alertDiv? <div style={{ margin: "25px" }}>
                {!this.state.loading ? <Card fluid styles={{
                    display: 'block',
                    backgroundColor: 'transparent',
                    padding: '0',
                    ':hover': {
                        backgroundColor: 'transparent',
                    },
                }}>
                    <CardBody>

                        <Form >
                            <FormInput
                                label="Assign To"
                                name="Assign To"
                                required
                                id="Name"
                                fluid
                                autoComplete="off"
                                className="addInput"
                                value={this.state.assignTo}
                                showSuccessIndicator={false}
                                disabled={this.state.assignType === "reassignAll" ? false : true}
                                onChange={(e) => this.assignToParticipantsSearch(e)}
                            />
                            {(this.state.assigneePrticipantName) && <div className='searchList'>{!this.state.participantLoading ? <div>
                                {this.state.selectedAssignParticipantsData && (this.state.selectedAssignParticipantsData.length > 0) ? this.state.selectedAssignParticipantsData.map((ele: any, i: any) =>
                                    <div key={i} className="displayFlex searchBox mt-2" onClick={() => this.selectAssigneFunction(ele)}>
                                        <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                    </div>
                                ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}
                            </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                            </div>
                            }


                            <FormInput
                                label="Reassign To"
                                required
                                fluid
                                className="mt-3 addInput"
                                autoComplete="off"
                                value={this.state.reassignTo}
                                showSuccessIndicator={false}
                                onChange={(e) => this.reassignToParticipantsSearch(e)}
                            />
                            {(this.state.reassigneePrticipantName) && <div className='searchList mt-0'>{!this.state.participantLoading ? <div>
                                {this.state.selectedReassignParticipantsData && (this.state.selectedReassignParticipantsData.length > 0) ? this.state.selectedReassignParticipantsData.map((ele: any, i: any) =>
                                    <div key={i} className="displayFlex searchBox mt-2" onClick={() => this.selectReassigneFunction(ele)}>
                                        <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                    </div>
                                ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}
                            </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                            </div>
                            }
                        </Form>
                    </CardBody>

                </Card> : <Loader styles={{ margin: "50px" }} />}
                <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                    <Flex space="between">
                        <Flex gap="gap.small">
                            <Button className="font15" onClick={() => microsoftTeams.tasks.submitTask()}>Cancel</Button>
                            <Button content={!this.state.buttonLoading ? "Save" : <Loader size="smaller" />} primary disabled={(this.state.assignTo && this.state.reassignTo) ? false : true}
                                onClick={() => this.save()} />
                        </Flex>
                    </Flex>
                </div>

            </div>:<div className='p-5 d-flex flex-column justify-content-center align-items-center cnf_sec'>
                    <Alert
                        className='p-4 text-center'
                        content={this.state.errorMessage?this.state.errorMessage:(this.state.assignType === "reassignAll")?`All the open tasks of ${this.state.assignTo} is successfully reassigned to ${this.state.reassignTo}`:`This task is successfully reassigned to ${this.state.reassignTo}`}
                        success
                        visible
                    />
                </div>}
            </div>
        );
    }
}



export default ReassignTask;
