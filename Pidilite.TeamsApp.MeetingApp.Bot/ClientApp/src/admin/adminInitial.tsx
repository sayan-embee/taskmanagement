import React from 'react';

// import {  Button } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

type MyState = {
};
 
const url=window.location.origin

class AdminInitial extends React.Component<MyState> {
    state: MyState = {
       
    };



    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
            microsoftTeams.settings.setSettings({
                websiteUrl: url,
                contentUrl: url+'/adminpage',
                entityId: "adminTab",
                suggestedDisplayName: "Admin"
            });
            saveEvent.notifySuccess();
        });

        microsoftTeams.settings.setValidityState(true);
    }

    

    render() {

        return (
            <div className="configContainer">
            <h3>Please click Save to get started.</h3>
        </div>
        );
    }
}



export default AdminInitial;
