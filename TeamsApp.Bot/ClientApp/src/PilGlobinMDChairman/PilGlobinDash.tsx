import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Datepicker, Flex, Button, SearchIcon } from '@fluentui/react-northstar';
import { getDivisionsAPI, GetPilGlobinMDChairmaDashboardMeetingDetails, GetPilGlobinMDChairmaDashboardTaskDetails, getUserProfileAPI } from '../apis/APIList';
import PilGlobinMeeting from './PilGlobinMeeting';
import PilGlobinTask from './PilGlobinTask';
import { Dropdown } from '@fluentui/react-northstar';
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
    isLoading1: boolean,
    isLoading2: boolean,
    fromDate?: any;
    toDate?: any;
    divisionList?: any;
    dropStatus: any;
    defaultfromDate?: any;
    defaulttoDate?: any;
    exportData1: any[];
    exportData2: any[];
}

export default class PilGlobinDash extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTab: "DashboardOne",
            EmailId: "",
            data1: [],
            data2: [],
            isLoading1: true,
            isLoading2: true,
            // divisionList:['Division1', 'Division2', 'Division3', 'Division4'],
            dropStatus: null,
            // fromDate: '',
            // toDate: '',
            defaultfromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            defaulttoDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            exportData1: [],
            exportData2: [],
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
        this.getDivision();

    }

    getDivision() {
        getDivisionsAPI().then((res: any) => {
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.divisionName)
            this.setState({
                divisionList: result,
            })
        })
    }

    getUserProfile = () => {
        getUserProfileAPI().then((res: any) => {
            console.log("email from res data-------------------", res.data.mail);
            this.setState({
                EmailId: res.data.mail,
                // isLoading: false
            }, () => {
                const data = {
                    "DivisionName": this.state.dropStatus,
                    "FromDate": this.state.defaultfromDate,
                    "ToDate": this.state.defaulttoDate
                }
                this.getDashData(data)
            })
        })
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        if (this.state.data2 !== prevState.data2) {
            // this.getDashData(this.state.selectedTab,this.state.defaultfromDate,this.state.defaulttoDate);
        }
    }



    tabClick = (tabType: string) => {
        this.setState({
            selectedTab: tabType
        })
    }



    getDashData = (data: any) => {
        let selectedValue = this.state.dropStatus;
        // if(tabType==="DashboardOne"){
        GetPilGlobinMDChairmaDashboardMeetingDetails(data).then((res: any) => {
            if (res && res.data && res.data.length > 0) {
                console.log(" Response Data in personal for D1", res.data)
                let data = res.data.filter((el:any)=>el.totalMeeting!==0)
                this.setState({
                    data1: data,
                    isLoading1: false
                })
                this.exportCsvD1(res.data);

                // setTimeout(()=>{
                //     this.exportCsvD1()
                // },1500)
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

        GetPilGlobinMDChairmaDashboardTaskDetails(data).then((res: any) => {
            if (res && res.data && res.data.length > 0) {
                console.log(" Response Data in personal for D2", res.data)
                let data = res.data.filter((el:any)=>el.totalTask!==0)
                this.setState({
                    data2: data,
                    isLoading2: false
                })
                this.exportCsvD2(res.data);
                // setTimeout(()=>{
                //     this.exportCsvD2()
                // },9000)

            }
            else {
                this.setState({
                    data2: [],
                    isLoading2: false
                })
            }

        })
        // }
    }

    searchByDate = () => {
        const data = {
            "DivisionName": this.state.dropStatus,
            "FromDate": (this.state.fromDate === '1970-01-01' ? null : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            "ToDate": (this.state.toDate === '1970-01-01' ? null : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
        }
        this.getDashData(data);
        this.setState({ isLoading1: true });
        this.setState({ isLoading2: true });


        // setTimeout(()=>{
        //     this.exportCsvD2()
        // },100)
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

    dropStatusFunction = (value: any) => {
        this.setState({
            dropStatus: value
        })
    }

    cancel() {
        this.setState({
            isLoading1: true,
            isLoading2: true,
            fromDate: undefined,
            toDate: undefined,
            dropStatus: null,
            defaultfromDate: this.state.defaultfromDate,
            defaulttoDate: this.state.defaulttoDate,
        })
        setTimeout(() => {
            const data = {
                "DivisionName": this.state.dropStatus,
                "FromDate": this.state.defaultfromDate,
                "ToDate": this.state.defaulttoDate
            }
            this.getDashData(data)
        }, 100);

    }

    exportCsvD1 = (data:any) => {
        let exportData1: any = [];
        data.forEach((el: any) => {
            if (el && el.verticalWiseData && el.verticalWiseData.length > 0) {
                el.verticalWiseData.forEach((vertical: any) => {
                    if(vertical.typeWiseData && vertical.typeWiseData.length > 0){
                        vertical.typeWiseData.forEach((type: any) => {
                            if(type.titleWiseData && type.titleWiseData.length > 0){
                                type.titleWiseData.forEach((title: any) => {
                                    let payload = {
                                        "Division Name": el.divisionName,
                                        "Meeting Type": type.typeName,
                                        "Meeting Name": title.meetingTitle,
                                        "Total Meetings": title.totalMeeting,
                                        "Scheduled No. Of Meetings": title.totalScheduledMeeting,
                                        "Conducted No. Of Meetings": title.totalConductedMeetings,
                                        "Uploaded No. Of Documents": title.totalDocumentUploaded,
                                        "Cancelled Meetings": title.totalCancelledMeeting,
                                    }
                                    exportData1.push(payload);
                                })
                            }
                            
    
                        })
                    }
                    
                })
            }
        })
        this.setState({
            exportData1: exportData1
        }, () => { console.log("Export data1", this.state.exportData1) })
    }

    exportCsvD2 = (data: any) => {
        let exportData2: any = [];
        data.forEach((el: any) => {
            if (el && el.verticalWiseData && el.verticalWiseData.length > 0) {
                el.verticalWiseData.forEach((vertical: any) => {
                    if(vertical.typeWiseData && vertical.typeWiseData.length > 0){
                        vertical.typeWiseData.forEach((type: any) => {
                            if(type.titleWiseData && type.titleWiseData.length > 0){
                                type.titleWiseData.forEach((title: any) => {
                                    if(title.employeeWiseData && title.employeeWiseData.length > 0){
                                        title.employeeWiseData.forEach((emp: any) => {
                                            
                                                let payload = {
                                                    "Division Name": el.divisionName,
                                                    "Meeting Type": emp.typeName,
                                                    "Meeting Name": title.meetingTitle,
                                                    "Employee Name": emp.assignedTo,
                                                    "Total Task": emp.totalTask,
                                                    "Open And Behind Schedule": emp.totalBehindSchedule,
                                                    "Open And In Progress": emp.totalInProgress,
                                                    "Closed": emp.totalClosed,
                                                    "Open And Behind Schedule (%)": emp.totalBehindSchedulePercent,
                                                    "Open And In Progress (%)": emp.totalInProgress,
                                                    "Closed (%)": emp.totalInProgressPercent
                                                }
                                                exportData2.push(payload)
                                        })
                                    }
                                    
        
                                })
                            }
                            
                        })
                    }
                   
                })
            }
        })
        this.setState({
            exportData2: exportData2
        }, () => { console.log("Export data2", this.state.exportData2) })
    }

    render() {
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand>PilGlobin_MD_Chairman Dashboard</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className='ml-auto'>
                                <Flex className="taskSearchDiv" gap="gap.medium">
                                    <Dropdown
                                        className="datepickerBoxShadow custom-dd-width"
                                        // fluid
                                        clearable
                                        items={this.state.divisionList}
                                        // value={this.state.dropStatus}
                                        placeholder="Select Division"
                                        onChange={(event, { value }) => this.dropStatusFunction(value)}

                                    />
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
                                                    filename={"PilGlobin_Meeting_Details_Reports " + new Date().toDateString() + ".csv"}>
                                                    <img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink>
                                                    : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                            </Button> : null

                                                ||
                                                this.state.selectedTab === "DashboardTwo" ?
                                                <Button title="Export" primary className="exportBtn champListButton"
                                                    disabled={(this.state.exportData2 && this.state.exportData2.length > 0) ? false : true}>
                                                    {this.state.exportData2 ? <CSVLink data={this.state.exportData2}
                                                        filename={"PilGlobin_Task_Reports " + new Date().toDateString() + ".csv"}>
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
                    <div>
                        <TabList >
                            <Tab onClick={() => this.tabClick("DashboardOne")}>Meeting Details</Tab>
                            <Tab onClick={() => this.tabClick("DashboardTwo")}>Task Details</Tab>
                        </TabList>
                    </div>


                    <TabPanel>
                        <PilGlobinMeeting
                            data={this.state.data1} Loading={this.state.isLoading1}
                        />
                    </TabPanel>
                    <TabPanel>
                        <PilGlobinTask
                            data={this.state.data2} Loading={this.state.isLoading2} EmailId={this.state.EmailId}
                        />
                    </TabPanel>
                </Tabs>


            </>
        );
    }
}

