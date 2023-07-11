import React from 'react';
import { Button, Text } from "@fluentui/react-northstar";
import "./../styles.scss"
import "./../../App.scss"

import AssignToMeTask from './../Component/assignToMeTask'
import AssignByMeTask from './../Component/assignByMeTask'

type MyState = {
    active?: boolean;
    loadingMeetings?: boolean
};

const base_URL = window.location.origin

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
}




class TaskManagementDashboard extends React.Component<MyState> {
    state: MyState = {
        active: true,
    };



    componentDidMount() {
    }


   

    render() {

        return (
            <div style={{ padding: '0px 10px', }} className=" ml-4 mr-4 " >
                <div className="d-flex mt-4"
                // style={{ alignItems: "center" }}
                >
                    <div className='d-flex tabButton'>
                        <div onClick={() => this.setState({ active: true })}
                            className={`flex-grow-1  tabButtonFont ${this.state.active ? ' activeTab ' : 'text inActiveTab'}`}><Text content="Assigned To Me" /></div>

                        <div onClick={() => this.setState({ active: false })}
                            className={`flex-grow-1 tabButtonFont ${!this.state.active ? ' activeTab ' : 'text inActiveTab'}`}><Text content="Assigned By Me" /></div>
                    </div>
                   
                </div>
                {this.state.active ? <AssignToMeTask /> : <AssignByMeTask />}
            </div>
        );
    }
}



export default TaskManagementDashboard;
