import React from 'react';
import { Button, Text } from "@fluentui/react-northstar";
// import { AddRegular } from "@fluentui/react-icons";
import * as microsoftTeams from "@microsoft/teams-js";
import UpcomingConnects from './../Components/upcomingConnects'
import PastConnects from './../Components/pastConnect'
import "./../styles.scss"
import "./../../App.scss"

const base_URL = window.location.origin

type MyState = {
    active?: boolean;
    taskModuleUrl?: string
    loadingMeetings?:boolean
};

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
}

class MeetingDashboardPage extends React.Component<MyState> {
    state: MyState = {
        active: true,
        taskModuleUrl: base_URL + '/createmeeting'
    };



    componentDidMount() {
    }

    /////////////////////// Call Create Meeting Task module //////////////////////////
    createMeetingTaskModule = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.taskModuleUrl,
            title: "Create a new meeting",
            height: 650,
            width: 1050,
            fallbackUrl: this.state.taskModuleUrl,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({loadingMeetings:true})
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }



    render() {

        return (
            <div style={{ padding: '0px 10px',}} className=" ml-4 mr-4 " >
                    <div className="d-flex mt-4 meetingDashboardPageHeader" 
                    // style={{ alignItems: "center" }}
                    >
                        <div className='d-flex tabButton'>
                            <div onClick={() => this.setState({ active: true })}
                                className={`flex-grow-1  tabButtonFont ${this.state.active ? ' activeTab ' : 'text inActiveTab'}`}><Text content="Upcoming Meetings"/></div>

                            <div onClick={() => this.setState({ active: false })}
                                className={`flex-grow-1 tabButtonFont ${!this.state.active ? ' activeTab ' : 'text inActiveTab'}`}><Text content="Past Meetings"/></div>
                        </div>
                        <div className="createMeetingDiv">
                        <Button  content="Create meeting" iconPosition="before" primary className="float-right" onClick={() => this.createMeetingTaskModule()} />
                        </div>
                    </div>
                {this.state.active ? <UpcomingConnects /> : <div><PastConnects /></div>}
            </div>
        );
    }
}



export default MeetingDashboardPage;
