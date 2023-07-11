import React from 'react';

import { Header, Text, Button, Datepicker, MenuButton, Dropdown, Loader, Flex, Input } from '@fluentui/react-northstar';

import { Persona, PersonaSize } from '@fluentui/react';

import { getAllMeetingDetailsAPI, getMeetingTypesAPI, getUserProfileAPI } from './../../apis/APIList'

import moment from 'moment';

import "./../styles.scss"
import "./../../App.scss"

import Pagination from "react-js-pagination";
import * as microsoftTeams from "@microsoft/teams-js";

const base_URL = window.location.origin
const menuBtn = base_URL + "/images/menuBtn.png"

type MyState = {
    loading?: boolean;
    fromDate?: any;
    toDate?: any;
    meetingTypeList?: any;
    meetingTypeInputList?: any;
    meetingTypeId?: any;
    meetingDetailsList?: any;
    systemDate?: any;
    userEmail?: any;
    activePage?: any;
    meetingTitle?: any;
    meetingOrganiserName?: any
};

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
}

class PastConnects extends React.Component<MyState> {
    state: MyState = {
        loading: true,
        activePage: 1,
        meetingTitle: "",
        meetingOrganiserName: ""
    };



    componentDidMount() {
        this.getMeetingTypes();
        this.getUserProfile();
        microsoftTeams.initialize();
    }

    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            // console.log("user", res);
            this.setState({
                userEmail: res.data.mail,
            }, () => {
                this.systemDate();
            })
        })
    }

    ///////////////////////////// Get Meeting type list function ////////////////////////////
    getMeetingTypes() {
        getMeetingTypesAPI().then((res: any) => {
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.typeName)
            this.setState({
                meetingTypeInputList: result,
                meetingTypeList: list
            })
        })
    }

    ////////////////////////// select type name //////////////////////////

    selectTypeName(data: any) {
        this.state.meetingTypeList.filter((e: any) => e.typeName === data).map((e: any) => {
            this.setState({
                meetingTypeId: e.typeId,
            })
        })
    }

    //////////////////////////// date select //////////////////////////

    fromDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("fromDate", date)
    }

    toDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("toDate", date)
    }

    systemDate = () => {
        var date = new Date();
        this.dateCreate("systemDate", date)
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
        else {
            this.setState({
                systemDate: finaldate
            }, () => {
                this.search();
            })
        }

    }

    selectMeetingTitle(e: any) {
        this.setState({
            meetingTitle: e.target.value
        })
    }

    selectMeetingOrganiserName(e: any) {
        this.setState({
            meetingOrganiserName: e.target.value
        })
    }

    //////////////////// search////////////////////////////////////////
    search = () => {
        const data = {
            "StartDateTime": (this.state.fromDate && (this.state.fromDate !== '1970-01-01')) ? this.state.fromDate : null,
            "EndDateTime": (this.state.toDate && (this.state.toDate !== '1970-01-01')) ? this.state.toDate : null,
            "MeetingTypeId": this.state.meetingTypeId ? this.state.meetingTypeId : null,
            "OrganiserEmail": this.state.userEmail,
            "MeetingTitle": this.state.meetingTitle? this.state.meetingTitle : null,
            "OrganiserName": this.state.meetingOrganiserName ? this.state.meetingOrganiserName : null,
            "SysToDateTime":moment().format('YYYY-MM-DD')+" "+moment().format('HH:mm:ss')
        }
        // console.log(data)
        this.getMeetingDetails(data)
    }

    getMeetingDetails = (data: any) => {
        getAllMeetingDetailsAPI(data).then((res: any) => {
            // console.log("api meeting details get", res.data);
            this.setState({
                meetingDetailsList: res.data.reverse((a: any, b: any) => (a.startDateTime > b.startDateTime) ? 1 : ((b.startDateTime > a.startDateTime) ? -1 : 0)),
                loading: false
            })
        })
    }

    ////////////////////// View Meeting Details Task Module /////////////////////////////////
    viewMeetingDetails = (e: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/viewmeetingdetails?id=${e.meetingId}`,
            title: "View meeting details",
            height: 450,
            width: 700,
            fallbackUrl: `${base_URL}/viewmeetingdetails?id=${e.meetingId}`,
        }
        let submitHandler = (err: any, result: any) => {
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);

    }

    //////////////////////  view all task Task Module /////////////////////////////////
    viewAllTask = (e: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/viewalltask?id=${e.meetingId}`,
            title: "View tasks",
            height: 500,
            width: 950,
            fallbackUrl: `${base_URL}/viewalltask?id=${e.meetingId}`,
        }
        let submitHandler = (err: any, result: any) => {
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    //////////////////////  assign task Task Module /////////////////////////////////
    assignTask = (e: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/createtask?from=pastMeeting&id=${e.meetingId}`,
            title: "Create task",
            height: 500,
            width: 500,
            fallbackUrl: `${base_URL}/createtask?from=pastMeeting&id=${e.meetingId}`,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.search()
            })
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    handlePageChange(pageNumber: any) {
        // console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber });
    }


    render() {

        return (
            <div className='pb-4 mt-3'>
                <Flex className="pt-1 pb-2 meetingSearchDiv" vAlign="end" gap="gap.medium">
                    <Datepicker input={{ clearable: true }} allowManualInput={false} inputPlaceholder="From Date" onDateChange={(e, v) => this.fromDate(e, v)} className="datepickerBoxShadow meetingDashboardDatepicker" />
                    <Datepicker input={{ clearable: true }}
                        allowManualInput={false} inputPlaceholder="To Date"
                        onDateChange={(e, v) => this.toDate(e, v)}
                        maxDate={new Date()}
                        className="datepickerBoxShadow meetingDashboardDatepicker" />

                    <Dropdown fluid
                        items={this.state.meetingTypeInputList}
                        search={false}
                        placeholder="Meeting Type"
                        className="meetingDashboardDropDown DropdownFontStyle"
                        onChange={(event, { value }) => this.selectTypeName(value)}
                    />
                    <Input placeholder="Meeting Title" value={this.state.meetingTitle} onChange={(e) => this.selectMeetingTitle(e)} className="datepickerBoxShadow meetingDashboardSearchInput" />
                    <Input placeholder="Organiser" value={this.state.meetingOrganiserName} onChange={(e) => this.selectMeetingOrganiserName(e)} className="datepickerBoxShadow meetingDashboardSearchInput" />
                    <Button primary content="Search" onClick={() => this.search()} className="meetingDashboardSearchBtn" />
                </Flex >


                {!this.state.loading ? <div className='mt-3'>
                    {this.state.meetingDetailsList && (this.state.meetingDetailsList.length > 0) ? <div> <div className="meetingDetailsDiv">
                        {this.state.meetingDetailsList.slice((this.state.activePage - 1) * 8, (this.state.activePage - 1) * 8 + 8).map((e: any) => {
                            return <div className='meeting-card'>
                                <div className='meeting-card-header'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            {!e.allDayEvent ? <div className='d-flex'>
                                                <Text className='d-block colorBlack' content={moment(e.startDateTime).format('LL')} size="medium"  style={{ 'marginRight': '10px' }} weight="bold" />
                                                <Text className='d-block colorBlack' content={moment(e.startDateTime).format('h:mm a') + ' - ' + moment(e.endDateTime).format('h:mm a')} size="medium" weight="regular" />
                                            </div> : <div className='d-flex' >
                                                <Text  className='d-block colorBlack' content={moment(e.startDateTime).format('LL')} size="medium" weight="bold" style={{ 'marginRight': '10px' }} />
                                            </div>}
                                        </div>
                                        <div className='d-flex'>
                                            <MenuButton trigger={<div className='pointer' ><img style={{ height: "25px", width: "25px" }} src={menuBtn} alt='' /></div>} aria-label="Click button"
                                                menu={[
                                                    <div className='d-flex align-items-center' onClick={() => this.viewMeetingDetails(e)}>
                                                        {/* <List16Regular />  */}
                                                        <Text className='ms-2' weight="regular" content="View details" /></div>,
                                                     <div className='d-flex align-items-center' onClick={() => this.viewAllTask(e)}>
                                                        {/* <Dismiss16Regular /> */}
                                                        <Text className='ms-2' weight="regular" content="View tasks" /></div>,
                                                    ((e.anchorEmail && (this.state.userEmail.toLocaleLowerCase() === e.anchorEmail.toLocaleLowerCase())) || (this.state.userEmail.toLocaleLowerCase() === e.createdByEmail.toLocaleLowerCase()) || (e.userRole==="CoAnchors") || (e.userRole==="Key Participants")) && <div className='d-flex align-items-center' onClick={() => this.assignTask(e)}>
                                                        {/* <Dismiss16Regular /> */}
                                                        <Text className='ms-2' weight="regular" content="Assign task" /></div>,
                                                ]}
                                                on="click"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='meeting-card-body'>
                                    <div className='mb-2'>
                                        <Header  as="h3" content={e.meetingTitle} className="textEllipsis colorBlack"/>
                                        <Text content={e.meetingType} size="small" weight="regular" className="textEllipsis colorBlack"/>
                                    </div>
                                    <div className='mb-3'>
                                        <Persona text={e.anchorName?e.anchorName:e.createdByEmail} secondaryText="Organizer" size={PersonaSize.size40} />
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                        <div className="pagination-style">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={8}
                                totalItemsCount={this.state.meetingDetailsList.length}
                                pageRangeDisplayed={6}
                                onChange={this.handlePageChange.bind(this)}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                firstPageText=""
                                lastPageText=""
                                linkClassFirst="displayNone"
                                linkClassLast="displayNone"

                            />
                        </div>
                    </div> : <div className="noDataText"> No Data Available</div>}
                </div> : <Loader styles={{ margin: "50px" }} />}
            </div>
        );
    }
}



export default PastConnects;
