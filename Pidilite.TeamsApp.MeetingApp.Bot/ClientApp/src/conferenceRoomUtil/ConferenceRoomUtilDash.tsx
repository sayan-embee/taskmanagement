import React from 'react'
import { Datepicker, Flex, Button, Loader, SearchIcon } from '@fluentui/react-northstar';
import * as microsoftTeams from "@microsoft/teams-js";
import { Dropdown } from '@fluentui/react-northstar';
import { GetConferanceRoomDashboardDetails, getRoomsAPI } from '../apis/APIList';
import moment from 'moment';
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
    dropdownitems?:any;
    dropStatus: any;
    fromDate?: any;
    toDate?: any;
    data:any[]
    isLoading:boolean
    defaultfromDate?: any;
    defaulttoDate?: any;
    exportData1: any[];

}

export default class ConferenceRoomUtilDash extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
    
      this.state = {
        dropdownitems: [], // ['Room1', 'Room2', 'Room3', 'Room4'],
        dropStatus: null,
        data:[],
        isLoading:true,
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
        this.getRooms();
        setTimeout(() => {
            const data = {
                "LocationId" : this.state.dropStatus,
                "FromDate": this.state.defaultfromDate,
                "ToDate": this.state.defaulttoDate
            }
            this.getData(data);
            
        }, 100);
        
    }


    getRooms =() => {
        getRoomsAPI('c').then((res: any) => {
            if(res && res.data && res.data.length > 0) {
                let result = res.data.map((a: any) => a.displayName)
                this.setState({
                    dropdownitems: result,
                })
            }
        })
    }

    getData = (data: any) => {
        // let LocationId:any = null,
        // FromDate:Date,
        // ToDate:Date
        GetConferanceRoomDashboardDetails(data).then((res: any) => {
            console.log("res", res)
            if (res && res.data && res.data.length > 0) {
                this.setState({
                    data: res.data,
                    isLoading: false
                })
                this.exportCsvD1(res.data);
            }
            else{
                this.setState({
                    data: [],
                    isLoading: false
                })
            }
        })
    }


    dropStatusFunction = (value: any) => {
        this.setState({
            dropStatus: value
        })
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

    searchByDate=()=>{
        const data = {
            "LocationId" : this.state.dropStatus,
            "FromDate": (this.state.fromDate === '1970-01-01' ? null : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            "ToDate": (this.state.toDate === '1970-01-01' ? null : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
        }
        this.getData(data
            // (this.state.fromDate === '1970-01-01' ? this.state.defaultfromDate : this.state.fromDate === undefined ? this.state.defaultfromDate : this.state.fromDate),
            // (this.state.toDate === '1970-01-01' ? this.state.defaulttoDate : this.state.toDate === undefined ? this.state.defaulttoDate : this.state.toDate)
            );
        this.setState({isLoading : true})
    }

    exportCsvD1 = (load:any) => {
        let exportData1: any = [];
        load.forEach((el: any) => {
                    let payload = {
                        "Conference Room": el.locationName,
                        "Date":el.startDateTime,
                        "Time":el.timeDuration,
                        "Division":el.divisionName,
                        "Meeting Title":el.meetingTitle,

                    }

                    exportData1.push(payload);
                // })
            // }
        })
        this.setState({
            exportData1: exportData1
        }, () => { console.log("Export data", this.state.exportData1) })
    }

    cancel() {
        this.setState({
            isLoading: true,
            fromDate: undefined,
            toDate: undefined,
            dropStatus: null,
            defaultfromDate : this.state.defaultfromDate,
            defaulttoDate : this.state.defaulttoDate,
        })
        setTimeout(() => {
            const data = {
                "LocationId" : this.state.dropStatus,
                "FromDate": this.state.defaultfromDate,
                "ToDate": this.state.defaulttoDate
            }
            this.getData(data);
        }, 100);

    }

    elip=(text:string)=>{
        var max = 35;
        if(text){
            return text.length > max ? text.substring(0, max) + '...' : text;
        }
        else{
            return "";
        }
       
      }

    render(){
        return(
            <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>Conference Room Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='ml-auto'>
                            <Flex className="taskSearchDiv"  gap="gap.medium">
                            <Dropdown
                                    className="datepickerBoxShadow custom-dd-width"
                                    items={this.state.dropdownitems}
                                    // value={this.state.dropStatus}
                                    placeholder="Select Conference Room"
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
                                                    filename={"Conference_Room_Reports " + new Date().toDateString() + ".csv"}>
                                                    <img style={{ height: "20px" }} src={exportIcon} alt='Export' /></CSVLink>
                                                    : <img style={{ height: "20px" }} src={exportIconDisable} alt='Export' />}
                                </Button>
                            </Flex>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            
            {!this.state.isLoading  ? 
            <div className='mainPadding'>
                {this.state.data && (this.state.data.length > 0) ?
                <table className="tableDesign" width={'100%'}>
                    <thead className='tableDesHead'>
                        <tr>
                            <th style={{fontSize:"12px", width:"15%"}}>Date</th>
                            <th style={{fontSize:"12px", width:"15%"}}>Time</th>
                            <th style={{fontSize:"12px", width:"20"}}>Conference<br/> Room Name</th>
                            <th style={{fontSize:"12px", width:"10%"}}>Division</th>
                            {/* <th style={{fontSize:"12px", width:"10%"}}>Vertical</th> */}
                            <th style={{fontSize:"12px", width:"30%"}}>Meeting Name</th>
                        </tr>
                    </thead>

                    
                    <tbody>
                        {this.state.data.map((load:any)=>{
                            return(
                                <>
                                   <tr className='nestedTableRow'>
                                    <td style={{fontSize:"12px", width:"15%"}}>{moment(load.startDateTime).format('LL')}</td>
                                    <td style={{fontSize:"12px", width:"15%"}}>{load.timeDuration}</td>
                                    <td style={{fontSize:"12px", width:"20%"}} title={load.locationName}>{this.elip(load.locationName)}</td>
                                    <td style={{fontSize:"12px", width:"10%"}}>{load.divisionName}</td>
                                    {/* <td style={{fontSize:"12px", width:"10%"}}>{load.verticalName}</td> */}
                                    <td style={{fontSize:"12px", width:"30%"}} title={load.meetingTitle}>{this.elip(load.meetingTitle)}</td>
                                </tr>
                                </>
                            )
                        })}
                    </tbody> 

                </table> : <div className='imgMainDiv'>
                     <img className='noDataImg' src={Nodata} alt="No data img"/>
                     <br/>
                     <b>There aren&rsquo;t any records to show. Try with different date range.</b>
                </div>}
            </div>
            : <Loader styles={{ margin: "50px" }} label="Loading..." /> }
            </>
        )
    }
}