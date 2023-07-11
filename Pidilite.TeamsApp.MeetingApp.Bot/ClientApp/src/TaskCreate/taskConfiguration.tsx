import React from 'react';

import {  Text, Button } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

type MyState = {
};

const url = window.location.origin

class TaskConfiguration extends React.Component<MyState> {
    state: MyState = {

    };



    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.appInitialization.notifySuccess();
        // microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
        //     microsoftTeams.settings.setSettings({
        //         websiteUrl: url,
        //         contentUrl: url + '/taskdashboard',
        //         entityId: "taskManagement",
        //         suggestedDisplayName: "Task Management"
        //     });
        //     saveEvent.notifySuccess();
        // });

        // microsoftTeams.settings.setValidityState(true);
    }

    submit(){
        microsoftTeams.settings.setValidityState(true);
        this.save()
    }

     save(){
        microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
            microsoftTeams.settings.setSettings({
                websiteUrl: url,
                contentUrl: url + '/taskdashboard',
                entityId: "taskManagement",
                suggestedDisplayName: "Task Management"
            });
            saveEvent.notifySuccess();
        });
    }


    render() {

        return (
            <div >
                <Text content="Please click Save to get started."></Text>
                <div style={{
                display:"flex",
                justifyContent:"center",
                height:"100%"

            }}>
                <Button primary onClick={()=>this.submit()}>Configure</Button>

            </div>
            </div>
        );
    }
}



export default TaskConfiguration;
