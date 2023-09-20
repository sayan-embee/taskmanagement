import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Segment } from "@fluentui/react-northstar";
import MeetingType from '../components/Meeting Type/meetingType'
import Division from '../components/Division/division'
import FileExtension from '../components/Extension/extension'
import Vertical from '../components/Verticals/vertical'
import MeetingTitle from '../components/Title/meetingTitle'

import "./../styles.scss"

type MyState = {
};

class AdminPage extends React.Component<MyState> {
    state: MyState = {
       
    };



    componentDidMount() {
    }



    render() {

        return (
            <Segment className="m-3">
                <Tabs>
                    <div className="reportTab">
                    <TabList >
                        <Tab>Meeting Type</Tab>
                        <Tab>Division</Tab>
                        <Tab>Vertical</Tab>
                        <Tab>Meeting Title</Tab>
                        <Tab>Extension</Tab>
                    </TabList>
                    </div>

                 
                    <TabPanel>
                       <MeetingType />
                    </TabPanel>
                    <TabPanel>
                        <Division />
                    </TabPanel>
                    <TabPanel>
                        <Vertical />
                    </TabPanel>
                    <TabPanel>
                        <MeetingTitle />
                    </TabPanel>
                    <TabPanel>
                        <FileExtension />
                    </TabPanel>
                    
                </Tabs>
                </Segment>
        );
    }
}



export default AdminPage;
