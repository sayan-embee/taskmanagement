import React from 'react';
import Personal from './Personal';
import DivisionHeadDash from '../dashboardDivision/DivisionHeadDash';
import ReportingDash from '../reportingManager/ReportingDash';
import PilGlobinDash from '../PilGlobinMDChairman/PilGlobinDash';
import ConferenceRoomUtilDash from '../conferenceRoomUtil/ConferenceRoomUtilDash';
import FeedbackDash from '../conferenceRoomUtil/FeedbackDash';
import SideBar from '../dashMenu/SideBar'
import IndexMeetingTitle from './../indexDashboard/indexPage'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

interface Props {
  history?: any;
  location?: any;
}

interface State {
}

export default class Dashboards extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
}




render(){
  return(
    <>
      <Router>
        <SideBar>
          <Switch>
            <Route exact path="/Personal"><Personal /></Route>
            <Route exact path="/DivisionHeadDash"><DivisionHeadDash /></Route>
            <Route exact path="/ReportingDash"><ReportingDash /></Route>
            <Route exact path="/PilGlobinDash"><PilGlobinDash /></Route>
            <Route exact path="/ConferenceRoomUtilDash"><ConferenceRoomUtilDash /></Route>
            <Route exact path="/IndexDash"><IndexMeetingTitle /></Route>
            <Route exact path="/FeedbackDash"><FeedbackDash /></Route>
          </Switch>
        </SideBar>
      </Router>
    </>
  )
}

}

