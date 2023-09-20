import React from 'react';
import Personal from './Personal';
import DivisionHeadDash from '../dashboardDivision/DivisionHeadDash';
import ReportingDash from '../reportingManager/ReportingDash';
import PilGlobinDash from '../PilGlobinMDChairman/PilGlobinDash';
import ConferenceRoomUtilDash from '../conferenceRoomUtil/ConferenceRoomUtilDash';
import FeedbackDash from '../conferenceRoomUtil/FeedbackDash';
import SideBar from '../dashMenu/SideBar'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GetDivisionsTest, GetMyReporteesTest, GetProfileTest, getUserProfileAPI } from '../apis/APIList';

interface Props {
  history?: any;
  location?: any;
}

interface State {
    // dropdownitems?: any
    // EmailId?: string;
    // isReportingManager?: boolean;
    // isDepartmentHead?: boolean;
    // isPilglobinMDChairman?: boolean;
    // divisions: string;
    // userdivisionName: string;
    // userverticalName: string;
    // userdesignation: string;
    // userpwl: string;
}

export default class Dashboards extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // this.state = {
    //     dropdownitems: ['Personal', 'Division Head', 'Reporting Manager',
    //         'Pil Globin', 'Conference Room', 'Feedback'],
    //     isReportingManager: false,
    //     isDepartmentHead: false,
    //     isPilglobinMDChairman: false,
    //     divisions: '',
    //     userdivisionName: '',
    //     userverticalName: '',
    //     userdesignation: '',
    //     userpwl: '',
    // };
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
            <Route exact path="/FeedbackDash"><FeedbackDash /></Route>
          </Switch>
        </SideBar>
      </Router>
    </>
  )
}

}

