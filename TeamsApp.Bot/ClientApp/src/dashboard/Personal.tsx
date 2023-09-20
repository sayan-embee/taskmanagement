import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Datepicker, Flex, Button, SearchIcon } from '@fluentui/react-northstar';
import DashboardOne from '../dashboardOne/Component/DashboardOne';
import DashboardTwo from '../dashboardTwo/Component/DashboardTwo';
import DashboardThree from '../dashboardThree/Component/DashboardThree';
import { GetDashboardPersonalTaskAssignByUser, GetDashboardPersonalTaskAssignToUser, GetPersonalDashboardMeetingDetails, getUserProfileAPI } from '../apis/APIList';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { CSVLink } from "react-csv";


const base_URL = window.location.origin;
const cancelIcon = base_URL + "/images/cancel.png";
const searchIcon = base_URL + "/images/search.png";
const exportIcon = base_URL + "/images/export.png";
const exportIconDisable = base_URL + "/images/export-disable-icon.png";


interface Props {
}

interface State {
    selectedTab: string,
    EmailId: any;
    data1: any[]
    data2: any[]
    data3: any[]
    isLoading1: boolean,
    isLoading2: boolean,
    isLoading3: boolean,
    fromDate?: any;
    toDate?: any;
    defaultfromDate?: any;
    defaulttoDate?: any;
    exportData1: any[];
    exportData2: any[];
    exportData3: any[];
}

export default class Personal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTab: "DashboardOne",
            EmailId: "",
            data1: [],
            data2: [],
            data3: [],
            isLoading1: true,
            isLoading2: true,
            isLoading3: true,
            defaultfromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            defaulttoDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            exportData1: [],
            exportData2: [],
            exportData3: [],
            // fromDate: '',
            // toDate: '',
        };
    }

    componentDidMount = () => {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.dateCreate("defaultfromDate", firstDay)
        this.dateCreate("defaulttoDate", lastDay)
        this.getUserProfile();
        // this.getDashData(this.state.selectedTab);

    }

    getUserProfile = () => {
        getUserProfileAPI().then((res: any) => {
            console.log("email from res data-------------------", res.data.mail);
            this.setState({
                EmailId: res.data.mail,
                // isLoading: false
            }, () => {

                const data = {
                    "UserEmail": this.state.EmailId,
                    "FromDate": this.state.defaultfromDate,
                    "ToDate": this.state.defaulttoDate
                }
                // this.getDashData(this.state.defaultfromDate, this.state.defaulttoDate)
                this.getDashData(data);
            })
        })
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        if (this.state.selectedTab !== prevState.selectedTab) {
            // this.getDashData(this.state.defaultfromDate,this.state.defaulttoDate);
        }
    }



    tabClick = (tabType: string) => {
        this.setState({
            selectedTab: tabType
        })
        //this.getDashData(tabType,this.state.defaultfromDate,this.state.defaulttoDate);
    }


    exportCsvD1 = (data:any) => {
        let exportData1: any = [];
        data.forEach((el: any) => {
            if (el && el.titleWiseData && el.titleWiseData.length > 0) {
                el.titleWiseData.forEach((title: any) => {
                    let payload = {
                        "Meeting Type": title.meetingType,
                        "Meeting Name": title.meetingTitle,
                        "Total Participant": title.totalParticipant,
                        "Total Document Uploaded":title.totalDocumentUploaded,
                        "Total Attented Participant": title.totalAttendedParticipant,
                        "Total Conducted Meetings As An Anchor": title.totalConductedMeetingsAnchor,
                        "Total Scheduled Meetings As An Anchor": title.totalScheduledMeetingsAnchor,
                        "Total Time Spent As An Anchor": title.totalTimeSpentAnchor,
                        "Total Time Spent As An participant": title.totalTimeSpentParticipant

                    }

                    exportData1.push(payload);
                })
            }
        })
        this.setState({
            exportData1: exportData1
        })
        console.log("Export data", this.state.exportData1)
    }

    exportCsvD2 = (data:any) => {
        let exportData2: any = [];
        data.forEach((el: any) => {
            if (el && el.titleWiseData && el.titleWiseData.length > 0) {
                el.titleWiseData.forEach((title: any) => {
                    if(title && title.titleWiseData && title.titleWiseData.length > 0){
                        let payload = {
                            "Meeting Type": title.meetingType,
                            "Meeting Name": title.meetingTitle,
                            "Total Task Assigned To Me": title.totalTask,
                            "Open And Behind Schedule": title.totalBehindSchedule,
                            "Open And In Progress": title.totalInProgress,
                            "Closed": title.totalClosed,
                            "Open And Behind Schedule Percentage": title.totalBehindSchedulePercent,
                            "Open And In Progress Percentage": title.totalInProgress,
                            "Closed Percentage": title.totalInProgressPercent
    
                        }
    
                        exportData2.push(payload);
                    }
                    
                })
            }
        })
        this.setState({
            exportData2: exportData2
        })
        console.log("Export data2", this.state.exportData2)
    }

    exportCsvD3 = (data:any) => {
        // console.log("export d3", data)
        let exportData3: any = [];
        data.forEach((el: any) => {
        // console.log("export d3 el", el)

            if (el && el.titleWiseData && el.titleWiseData.length > 0) {
                el.titleWiseData.forEach((title: any) => {
                    if(title && title.employeeWiseData && title.employeeWiseData.length > 0){
                        title.employeeWiseData.forEach((emp: any) => {
                            let payload = {
                                "Meeting type": emp.meetingType,
                                "Meeting Name": emp.meetingTitle,
                                "Assigned To": emp.assignedTo,
                                "Assigned To Email": emp.assignedToEmail,
                                "Total Task": emp.totalTask,
                                "Open And Behind Schedule": emp.totalBehindSchedule,
                                "Open And In Progress": emp.totalInProgress,
                                "Closed": emp.totalClosed,
                                "Open And Behind Schedule Percentage": emp.totalBehindSchedulePercent,
                                "Open And In Progress Percentage": emp.totalInProgress,
                                "Closed Percentage": emp.totalInProgressPercent
    
                            }
                            exportData3.push(payload);
                        })
                    }   
                })
            }
        })
        this.setState({
            exportData3: exportData3
        })
        console.log("Export data3", this.state.exportData3)
    }

    // getDashData = (FromDate?: any, ToDate?: any) => {
    getDashData = (data: any) => {

        // if(tabType==="DashboardOne"){
        GetPersonalDashboardMeetingDetails(data).then((res: any) => {
            console.log(" Response Data in personal for D1", res.data)
            if (res && res.data && res.data.length > 0) {
                let data = res.data.filter((el:any)=>el.totalScheduledMeetingsAnchor!==0 || el.totalConductedMeetingsAnchor !==0
                || el.totalParticipant !==0 || el.totalAttendedParticipant !==0 || el.totalDocumentUploaded !==0)
                console.log("filter data============================",data)
                this.setState({
                    data1: data,
                    isLoading1: false
                })
                this.exportCsvD1(res.data);
            }
            else {
                this.setState({
                    data1: [],
                    isLoading1: false
                })
            }

        })
        // }
        // else if(tabType==="DashboardTwo"){

        // GetDashboardPersonalTaskAssignToUser(this.state.EmailId,FromDate,ToDate).then((res: any) => {
        GetDashboardPersonalTaskAssignToUser(data).then((res: any) => {
            console.log(" Response Data in personal for D2", res.data)
            if (res && res.data && res.data.length > 0) {
                let data = res.data.filter((el:any)=>el.totalTask!==0)
                this.setState({
                    data2: data,
                    isLoading2: false
                })
                this.exportCsvD2(res.data);
                console.log("this.state.data2", this.state.data2)
            }
            else {
                this.setState({
                    data2: [],
                    isLoading2: false
                })
            }
        })
        // }
        // else if(tabType==="DashboardThree"){
        // GetDashboardPersonalTaskAssignByUser(this.state.EmailId,FromDate,ToDate).then((res: any) => {
        GetDashboardPersonalTaskAssignByUser(data).then((res: any) => {
            console.log("Response Data", res.data)
            if (res && res.data && res.data.length > 0) {
                let data = res.data.filter((el:any)=>el.totalTask!==0)
                this.setState({
                    data3: data,
                    isLoading3: false
                })
                this.exportCsvD3(res.data);
            }
            else {
                this.setState({
                    data3: [],
                    isLoading3: false
                })
            }
        })
        // }
    }

    searchByDate = () => {
        

        const data = {
            "UserEmail": this.state.EmailId,
            "FromDate": (this.state.fromDate === '1970-01-01' ? null : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            "ToDate": (this.state.toDate === '1970-01-01' ? null : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
        }
        this.getDashData(data
            // (this.state.fromDate ===  '1970-01-01' ? null : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            // (this.state.toDate === '1970-01-01' ? null : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
        );
        this.setState({ isLoading1: true })
        this.setState({ isLoading2: true })
        this.setState({ isLoading3: true })
    }


    fromDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("fromDate", date)
    }

    toDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("toDate", date)
    }

    dateCreate = (value: any, date: any) => {
        let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let year = date.getFullYear();
        let finaldate = year + '-' + mnth + '-' + day;
        if (value === "fromDate") {
            this.setState({
                fromDate: finaldate
            })
        }
        else if (value === "toDate") {
            this.setState({
                toDate: finaldate
            })
        }

        else if (value === "defaultfromDate") {
            this.setState({
                defaultfromDate: finaldate
            })
        }

        else if (value === "defaulttoDate") {
            this.setState({
                defaulttoDate: finaldate
            })
        }

    }

    render() {
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand>Personal Dashboard</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className='ml-auto'>
                                <Flex className="taskSearchDiv" gap="gap.medium">
                                    <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="From Date" onDateChange={(e, v) => this.fromDate(e, v)}
                                        className="datepickerBoxShadow" defaultSelectedDate={new Date(this.state.defaultfromDate)} inputOnly />
                                    <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="To Date" onDateChange={(e, v) => this.toDate(e, v)}
                                        className="datepickerBoxShadow" defaultSelectedDate={new Date(this.state.defaulttoDate)} inputOnly />
                                    <Button primary onClick={() => this.searchByDate()} className="champListButton" title="Search"><img style={{ marginTop: "3px", height: "20px" }} src={searchIcon} alt='Search' /></Button>


                                    {
                                        this.state.selectedTab === "DashboardOne" ?
                                            <Button title="Export" primary className="exportBtn champListButton"
                                                disabled={(this.state.exportData1 && this.state.exportData1.length > 0) ? false : true}>
                                                {this.state.exportData1 ? <CSVLink data={this.state.exportData1}
                                                    filename={"Personal_Meeting_Details_Reports " + new Date().toDateString() + ".csv"}>
                                                    <img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink>
                                                    : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                            </Button> : null

                                                ||
                                                this.state.selectedTab === "DashboardTwo" ?
                                                <Button title="Export" primary className="exportBtn champListButton"
                                                    disabled={(this.state.exportData2 && this.state.exportData2.length > 0) ? false : true}>
                                                    {this.state.exportData2 ? <CSVLink data={this.state.exportData2}
                                                        filename={"Task_Assigned_To_Me_Reports " + new Date().toDateString() + ".csv"}>
                                                        <img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink>
                                                        : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                                </Button> : null

                                                    ||
                                                    this.state.selectedTab === "DashboardThree" ?
                                                    <Button title="Export" primary className="exportBtn champListButton"
                                                        disabled={(this.state.exportData3 && this.state.exportData3.length > 0) ? false : true}>
                                                        {this.state.exportData3 ? <CSVLink data={this.state.exportData3}
                                                            filename={"Task_Assigned_By_Me_Reports " + new Date().toDateString() + ".csv"}>
                                                            <img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink>
                                                            : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                                    </Button> : null
                                    }



                                </Flex>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Tabs>

                    <TabList >
                        <Tab onClick={() => this.tabClick("DashboardOne")} >Meeting Details</Tab>
                        <Tab onClick={() => this.tabClick("DashboardTwo")} >Task Assigned To Me</Tab>
                        <Tab onClick={() => this.tabClick("DashboardThree")} >Task Assigned By Me</Tab>
                    </TabList>



                    <TabPanel>
                        <DashboardOne data={this.state.data1} loading={this.state.isLoading1} />
                    </TabPanel>
                    <TabPanel>
                        <DashboardTwo data={this.state.data2} Loading={this.state.isLoading2} />
                    </TabPanel>
                    <TabPanel>
                        <DashboardThree data={this.state.data3} Loading={this.state.isLoading3} EmailId={this.state.EmailId} />
                    </TabPanel>
                </Tabs>


            </>
        );
    }
}

