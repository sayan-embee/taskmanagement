import React from 'react'
import { Datepicker, Flex, Button, Loader, SearchIcon } from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import { Dropdown } from '@fluentui/react-northstar';
import { getDivisionsAPI, GetMeetingFeedbackDashboardDetails } from '../apis/APIList';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Nodata from './Nodata.svg'
import { CSVLink } from "react-csv";



const base_URL = window.location.origin;
const cancelIcon = base_URL + "/images/cancel.png";
const searchIcon = base_URL + "/images/search.png";
const exportIcon = base_URL + "/images/export.png";
const exportIconDisable = base_URL + "/images/export-disable-icon.png";

interface Props {

}

interface State {
    // dropdownitems?:any;
    // dropStatus: string;
    fromDate?: any;
    toDate?: any;
    data:any[];
    loading?:boolean;
    dropStatus: any;
    defaultfromDate?: any;
    defaulttoDate?: any;
    divisionList?:any;
    exportData1: any[];

}

export default class FeedbackDash extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
    
      this.state = {
        // dropdownitems:['Room1', 'Room2', 'Room3', 'Room4'],
        // dropStatus: "",
        data:[],
        loading: true,
        dropStatus: null,
        // fromDate: '',
        // toDate: '',
        defaultfromDate : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        defaulttoDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        exportData1: [],

      }
      
    }

    componentDidMount=()=>{
      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      this.dateCreate("defaultfromDate", firstDay)
      this.dateCreate("defaulttoDate", lastDay)
      this.getDivision();
        
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        // if(this.state.selectedTab !== prevState.selectedTab) {
        //     // this.getDashData(this.state.selectedTab,this.state.defaultfromDate,this.state.defaulttoDate);
        // }
      }

    getDivision() {
        getDivisionsAPI().then((res: any) => {
            if(res && res.data && res.data.length > 0){
                let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.divisionName)
                this.setState({
                    divisionList: result,
                }, () => {
                    const data = {
                        "DivisionName" :  this.state.dropStatus,
                        "FromDate": this.state.defaultfromDate,
                        "ToDate": this.state.defaulttoDate
                    }
                    this.getDashData(data);
                })
            }
          })
    }

    getDashData = (data: any) => {
        let division = this.state.dropStatus;
        GetMeetingFeedbackDashboardDetails(data).then((res: any) => {
            console.log("res", res)
            if (res && res.data && res.data.length > 0) {
                this.setState({
                    data: res.data,
                    loading: false
                })
                this.exportCsvD1(res.data);
            }
            else{
                this.setState({
                    data: [],
                    loading: false
                })
            }
        })
    }

    exportCsvD1 = (load:any) => {
        let exportData1: any = [];
        load.forEach((load: any) => {
                    let payload = {
                        "Division": load.divisionName,
                        "Meeting Name":load.meetingTitle,
                        "Anchor Name":load.anchorName,
                        "Participant Name":load.participantName,
                        "Participant Type":load.participantType,
                        "Question":load.question,
                        "Answer":load.answer,
                    }

                    exportData1.push(payload); 
        })
        this.setState({
            exportData1: exportData1
        }, () => { console.log("Export data", this.state.exportData1) })
    }

    searchByDate=()=>{
        const data = {
            "DivisionName" :  this.state.dropStatus,
            "FromDate": (this.state.fromDate ===  '1970-01-01' ? null : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            "ToDate": (this.state.toDate === '1970-01-01' ? null : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
        }
        this.getDashData(data
            // (this.state.fromDate ===  '1970-01-01' ? this.state.defaultfromDate : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            // (this.state.toDate === '1970-01-01' ? this.state.defaulttoDate : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
        );
        this.setState({loading : true})
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
        else if (value === "toDate"){
            this.setState({
                toDate: finaldate
            })
        }
        else if(value === "defaultfromDate") {
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
            loading: true,
            fromDate: undefined,
            toDate: undefined,
            dropStatus: null,
            // defaultfromDate : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            // defaulttoDate : this.state.defaulttoDate,
        })
        setTimeout(() => {
            const data = {
                "DivisionName" :  this.state.dropStatus,
                "FromDate": this.state.defaultfromDate,
                "ToDate": this.state.defaulttoDate
            }
            this.getDashData(data);
        }, 100);

    }

    elip=(text:string)=>{
        var max = 40;
        return text.length > max ? text.substring(0, max) + '...' : text
      }

    render(){
        return(
            <>
                <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>Feedback Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='ml-auto'>
                            <Flex className="taskSearchDiv"  gap="gap.medium">
                            <Dropdown
                                className="datepickerBoxShadow custom-dd-width"
                                // fluid
                                items={this.state.divisionList}
                                // value={this.state.dropStatus}
                                placeholder="Select Division"
                                onChange={(event, { value }) => this.dropStatusFunction(value)}
                                clearable
                            />
                                <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="From Date" onDateChange={(e, v) => this.fromDate(e, v)}
                                    className="datepickerBoxShadow" defaultSelectedDate={new Date(this.state.defaultfromDate)} inputOnly/>
                                <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="To Date" onDateChange={(e, v) => this.toDate(e, v)}
                                    className="datepickerBoxShadow" defaultSelectedDate={new Date(this.state.defaulttoDate)} inputOnly/>
                                <Button primary onClick={() => this.searchByDate()} className="champListButton" title="Search"><img style={{ marginTop: "3px", height: "20px" }} src={searchIcon} alt='Search' /></Button>
                           
                                <Button title="Export" primary className="exportBtn champListButton"
                                                disabled={(this.state.exportData1 && this.state.exportData1.length > 0) ? false : true}>
                                                {this.state.exportData1 ? <CSVLink data={this.state.exportData1}
                                                    filename={"Feedback_Reports " + new Date().toDateString() + ".csv"}>
                                                    <img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink>
                                                    : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                </Button>
                            </Flex>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
                <div>
                    {!this.state.loading ? 
                        <>

                            <div className='mainPadding'>
                            {this.state.data && (this.state.data.length > 0) ?
                                <table className="tableDesign" width={'100%'}>  
                                    <thead className='tableDesHead'>
                                        <tr>
                                            <th style={{fontSize:"12px",width:""}}>Division</th>
                                            {/* <th style={{fontSize:"12px"}}>Vertical</th> */}
                                            <th style={{fontSize:"12px",width:"30%"}}>Meeting Name</th>
                                            <th style={{fontSize:"12px"}}>Anchor Name</th>
                                            <th style={{fontSize:"12px" }}>Participant Name</th>
                                            <th style={{fontSize:"12px" }}>P/KP</th>
                                            <th style={{fontSize:"12px"}}>Question</th>
                                            <th style={{fontSize:"12px"}}>Answer</th>
                                        </tr>
                                    </thead>

                                    
                                    <tbody>
                                        {this.state.data.map((load:any)=>{
                                            return(
                                                <>
                                                    <tr className='nestedTableRow'>
                                                        <td style={{fontSize:"12px"}}>{load.divisionName}</td>
                                                        {/* <td style={{fontSize:"12px"}}>{load.verticalName}</td> */}
                                                        <td style={{fontSize:"12px",width:"30%"}} title={load.meetingTitle}>{this.elip(load.meetingTitle)}</td>
                                                        <td style={{fontSize:"12px"}}>{load.anchorName}</td>
                                                        <td style={{fontSize:"12px"}}>{load.participantName}</td>
                                                        <td style={{fontSize:"12px"}}>{load.participantType}</td>
                                                        <td style={{fontSize:"12px"}}>{load.question}</td>
                                                        <td style={{fontSize:"12px"}}>{load.answer}</td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody> 

                                </table> :  <div className='imgMainDiv'>
                                            <img className='noDataImg' src={Nodata} alt="No data img"/>
                                            <br/>
                                            <b>There aren&rsquo;t any records to show. Try with different date range.</b>
                                            </div>
                                }
                            </div>
                        </>
                    : <Loader styles={{ margin: "50px" }} label="Loading..." />
                    }
                </div>
            </>
        )
    }
}