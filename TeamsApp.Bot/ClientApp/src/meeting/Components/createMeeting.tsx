import React from 'react';
import { getmeetingtitlesAPI, getMeetingTypesAPI, getTimeZoneAPI, getAllTeamsAPI, getUserProfileAPI, getFileExtensionsAPI, createMeetingFileAPI, deleteMeetingFilesAPI, updateMeetingeAPI, getDivisionsAPI, getVerticalsAPI, getFilteredUsersAPI, getMeetingDetailsByParentIdAPI, getRoomsAPI, findMeetingTimesAPI, roomScheduleAPI, getAllDistributionListGroups } from './../../apis/APIList'
import { Text, Button, Flex, FlexItem, FormInput, FormDropdown, Loader, Datepicker, Dropdown, Input, Alert, OpenOutsideIcon } from '@fluentui/react-northstar';
import { Persona, PersonaSize } from '@fluentui/react';
import * as microsoftTeams from "@microsoft/teams-js";
// import {  TagMultiple20Regular,  Channel20Regular,  Location20Regular,  Attach20Regular,  Edit20Regular, List20Regular,  Dismiss20Regular } from "@fluentui/react-icons";
//import { CallVideoIcon } from '@fluentui/react-icons-northstar';
import { Editor } from "react-draft-wysiwyg";
import "./../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Toggle from 'react-toggle'
import moment from 'moment';
import { debounce } from "lodash";


//hours to be chosen when scheduling meetings
const hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

//minutes to be chosen when scheduling meetings
const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const monthlyRepeatType = ["On Date", "On Day"]

const weekType = ["First", "Second", "Third", "Fourth", "Last"]

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const baseUrl = window.location.origin;

const cancelImage = baseUrl + "/images/cancel.svg";


type MyState = {
    files?: any;
    pages?: string;
    meetingTypeList?: any;
    meetingTypeInputList?: any;
    meetingTypeId?: any;
    meetingType?: String;
    divisionId?: any;
    verticalId?: any;
    meetingTitlesList?: any;
    meetingTitlesInputList?: any;
    meetingTitleId?: any;
    meetingTitle?: any
    loading?: boolean;
    loggedInUser?: string;
    loggedInUserEmail?: string;
    loggedInUserADID?: any;
    timeZone?: any;
    timeZoneList?: any;
    timeZoneInputList?: any;
    timeZoneValue?: string;
    divisionName?: string;
    verticalName?: string;
    editorState?: any;
    meetingDescription?: any;
    location?: any;
    channel?: any;
    startDate?: any;
    startTimeHour?: any;
    startTimeMin?: any;
    endDate?: any;
    endTimeHour?: any;
    endTimeMin?: any;
    AllDayEvent?: boolean;
    anchor?: any;
    anchorName?: any;
    anchorEmail?: any;
    anchorADID?: any;
    anchorData?: any;
    anchorSearch?: any;
    keyParticipants?: any;
    participants?: any;
    participantsList?: any;
    participantsData?: any;
    keyParticipantsData?: any;
    MeetingRepeatDetailsInput?: any;
    MeetingRepeatDetails?: string;
    dailyEventStartDate?: any;
    dailyEventEndDate?: any;
    meetingRepeat?: any;
    externalParticipantsList?: any;
    invalidExternalParticipants?: boolean;
    externalParticipants?: any;
    fileExtensionList?: any;
    meetingId?: any;
    edit?: boolean;
    eventId?: any;
    OrganiserName?: string;
    OrganiserEmail?: string;
    OrganiserADID?: string;
    selectedWeek?: any;
    EditType?: string;
    EditTypeDropdown?: any;
    participantLoading?: boolean;
    parentMeetingId?: any;
    createMeetingLoading?: boolean;
    monthlyRepeatTypeValue?: any;
    onADay?: any;
    onTheWeekDay?: any;
    onTheWeek?: any;
    onTheMonth?: any;
    uploadedFile?: any;
    roomName?: any;
    room?: any;
    roomData?: any;
    roomId?: any;
    roomLoading?: boolean;
    monthName?: any;
    availability?: boolean;
    channelName?: any;
    channelId?: any;
    teamsId?: any;
    channelData?: any;
    channelInputList?: any;
    schedulingStartDate?: any;
    schedulingEndDate?: any;
    suggestedTimeParticipantsList?: any;
    suggestedTimeSlot?: any;
    timeDiffHour?: any;
    timeDiffMin?: any;
    roomEmail?: any;
    roomAvailability?: any;
    roomError?: any;
    seriesMasterId?: any;
    IsMeetingUpdate?: boolean;
    createdBy?: any;
    createdByEmail?: any;
    createdByAdid?: any;
    createdOn?: any;
    seriesStartDate?: any;
    meetingRepeatId?: any;
    // seriesMasterId?:any;
    dropOption?:any;
    dropStatus?:any;
    template?:any;
    uploadedtemplate?:any;
    errorUploadMsg?:string;
    error:boolean;
    meetingTitleFileName?:string;
    spoDriveId?:string;
    spoItemId?:string;
    spoWebUrl?:string;
    noOaapTemplateMsg?:string;
    coAnchors?:any;
    coAnchorsData?:any[];
    anchorDivisionName?:any;
    anchorVerticalName?:any;
    groups?:any;
    groupsData?:any[];
    groupName?:string;
    groupMail?:string;
    groupId?:string;
    groupType?:string;
    selectedGroupsData:any[];



};

interface ICreateMeetingProps {
    history?: any;
    location?: any
}

class CreateMeeting extends React.Component<ICreateMeetingProps, MyState> {
    constructor(props: ICreateMeetingProps) {
        super(props)
        this.state = {
            files: [],
            pages: "General Info",
            meetingTitlesInputList: [],
            loading: true,
            divisionName: "",
            verticalName: "",
            editorState: EditorState.createEmpty(),
            meetingDescription: "",
            location: "",
            channel: "",
            AllDayEvent: false,
            participantsList: [],
            MeetingRepeatDetailsInput: ["Does Not Repeat", "Daily", "Weekly", "Monthly", "Yearly"],
            MeetingRepeatDetails: "Does Not Repeat",
            meetingRepeat: 1,
            externalParticipantsList: [],
            invalidExternalParticipants: false,
            meetingType: "",
            meetingTitle: "",
            edit: false,
            meetingId: 0,
            OrganiserName: "",
            OrganiserEmail: "",
            OrganiserADID: "",
            selectedWeek: [],
            EditTypeDropdown: ["Edit Occurrence", "Edit Series"],
            monthlyRepeatTypeValue: "On Date",
            uploadedFile: [],
            availability: false,
            channelInputList: [],
            suggestedTimeParticipantsList: [],
            startTimeMin: "00",
            endTimeMin: "00",
            IsMeetingUpdate: false,
            // endTimeMin: "00",
            dropOption:["Existing OAAP Template","Upload OAAP Template"],
            dropStatus:"",
            template:"",
            uploadedtemplate:[],
            error:false,
            meetingTitleFileName:"",
            spoDriveId:"",
            spoItemId:"",
            spoWebUrl:"",
            noOaapTemplateMsg:"No OAAP Existing Template",
            coAnchors:"",
            coAnchorsData:[],
            groups:"",
            groupsData:[],
            groupName:"",
            groupMail:"",
            groupId:"",
            groupType:"",
    selectedGroupsData:[]


        }
    }

    ////////////////////////////////// File Upload ////////////////////////////////////////
    fileUpload() {
        (document.getElementById('upload') as HTMLInputElement).click()
    };

    onFileChoose(event: any) {
        console.log("file", event.target.files)
        if (event.target.files.length > 0) {
            this.setState({
                files: [...this.state.files, event.target.files[0]]
            })
        }
    }

    ////////////////////////// File Remove /////////////////////////////////////////
    filesRemoveOne(index: any) {
        var array = [...this.state.files];
        console.log("removed",array)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ files: array });
        }
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        if (params.get('id')) {
            this.setState({
                meetingId: params.get('id'),
                parentMeetingId: params.get('parentMeetingId'),
                edit: true,
                EditType: this.state.EditTypeDropdown[0]
            }, () => {
                this.getMeetingData(this.state.meetingId, this.state.parentMeetingId)
            })
        }
        else {
            this.systemDate();
        }
        microsoftTeams.initialize();
        this.getUserProfile();
        this.getMeetingTypes();
        this.getTimeZone();
        this.getFileExtensions();
    }


    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                loggedInUser: res.data.displayName,
                loggedInUserEmail: res.data.mail,
                loggedInUserADID: res.data.id,
                divisionName: res.data.division,
                verticalName: res.data.vertical,
            }, () => {
                this.getDivision()
                this.getVerticals()
                this.getAllTeams()
            })
        })
    }

    ///////////////////////////// Get division list function ////////////////////////////
    getDivision() {
        getDivisionsAPI().then((res: any) => {
            res.data.filter((e: any) => e.divisionName === this.state.divisionName).map((e: any) => {
                this.setState({
                    divisionId: e.divisionId
                })
            })
        })
    }

    ///////////////////////////// Get verticals list function ////////////////////////////
    getVerticals() {
        getVerticalsAPI().then((res: any) => {
            res.data.filter((e: any) => e.verticalName === this.state.verticalName).map((e: any) => {
                this.setState({
                    verticalId: e.verticalId
                })
            })

        })
    }

    ///////////////////////////// Get file extension list function ////////////////////////////
    getFileExtensions() {
        getFileExtensionsAPI().then((res: any) => {
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.extName)
            console.log("api extension get", result);
            this.setState({
                fileExtensionList: result.toString()
            })
        })
    }

    ///////////////////////////// Get Meeting Type ////////////////////////////
    getMeetingTypes() {
        getMeetingTypesAPI().then((res: any) => {
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.typeName)
            this.setState({
                meetingTypeInputList: result,
                meetingTypeList: list,
                loading: false
            })
        })
    }

    ////////////////// Get All Teams ///////////////
    getAllTeams() {
        getAllTeamsAPI(this.state.loggedInUserADID).then((res: any) => {
            console.log("sayan Teams", res)
            let result = res.data.map((a: any) => {
                let b = {
                    header: a.teamsName + " -> " + a.channelName,
                    id: a.channelId
                }
                return b
            })
            this.setState({
                channelData: res.data,
                channelInputList: result
            })
        })
    }

    selectChannel(data: any) {

        this.state.channelData.filter((e: any) => e.channelId === data.id).map((e: any) => {
            console.log("sayan Teams 2", e)
            this.setState({
                channelName: e.channelName,
                channelId: e.channelId,
                teamsId: e.teamsId,
                IsMeetingUpdate: this.state.edit ? true : false
            })
        })
    }

    ///////////////////////////// Get Time-zone list ////////////////////////////
    getTimeZone() {
        getTimeZoneAPI().then((res: any) => {
            console.log("get time zone", res.data)
            let list = res.data
            let result = res.data.map((a: any) => a.description)
            this.setState({
                timeZoneInputList: result,
                timeZoneList: list
            }, () => {
                this.systemTimeZone();
            })
        })
    }

    ///// System Time Zone /////
    systemTimeZone() {
        const today = new Date();
        const short = today.toLocaleDateString(undefined);
        const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
        const shortIndex = full.indexOf(short);
        if (shortIndex >= 0) {
            const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
            this.setState({
                timeZone: trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '')
            }, () => {
                this.timeZoneValueSet()
            })
        } else {
            this.setState({
                timeZone: full
            }, () => {
                this.timeZoneValueSet()
            })
        }
    }

    timeZoneValueSet() {
        this.state.timeZoneList.filter((e: any) => e.name === this.state.timeZone).map((e: any) => {
            this.setState({
                timeZoneValue: e.description,
            })
        })
    }

    selectTimeZone(data: any) {
        this.state.timeZoneList.filter((e: any) => e.description === data).map((e: any) => {
            this.setState({
                timeZone: e.name,
                IsMeetingUpdate: this.state.edit ? true : false
            })
        })
    }

    ////////////////////////// Select Meeting Type //////////////////////////
    selectTypeName(data: any) {
        this.state.meetingTypeList.filter((e: any) => e.typeName === data).map((e: any) => {
            this.setState({
                meetingTypeId: e.typeId,
                meetingType: data
            }, () => {
                if (this.state.meetingType !== "Other") {
                    this.getMeetingtitles();
                }

            })
        })
    }

    ///////////////////////////// Get Meeting Titles ////////////////////////////
    getMeetingtitles() {
        const data = {
            "MeetingTitle": '',
            "MeetingTypeId": this.state.meetingTypeId ? this.state.meetingTypeId : "",
            "DivisionId": this.state.divisionId ? this.state.divisionId : -1,
            "VerticalId": this.state.verticalId ? this.state.verticalId : -1
        }
        getmeetingtitlesAPI(data).then((res: any) => {
            console.log("api title get", res.data);
            let list = res.data
            let result = res.data.sort((a: any, b: any) => (a.meetingTitle > b.meetingTitle) ? 1 : ((b.meetingTitle > a.meetingTitle) ? -1 : 0)).filter((e: any) => e.active === true).map((a: any) => a.meetingTitle)
            this.setState({
                meetingTitlesList: list,
                meetingTitlesInputList: result
                
            })
        })
    }

    ////////////////////////// Select Meeting Title //////////////////////////
    selectMeetingTitle(data: any) {
        this.state.meetingTitlesList.filter((e: any) => e.meetingTitle === data).map((e: any) => {
            console.log("meeting title", e.meetingTitleFileName)
            this.setState({
                meetingTitleId: e.meetingTitleId,
                meetingTitle: data,
                meetingTitleFileName:e.meetingTitleFileName,
                spoDriveId:e.spoDriveId,
                spoItemId:e.spoItemId,
                spoWebUrl:e.spoWebUrl,
            })
        })
    }

    /////////////////////////// Location Rooms ////////////////////////////////

    locationSearch(event: any) {
        this.setState({
            roomName: event.target.value,
            roomLoading: true,
            room: 1,
            roomError: null
        }, () => {
            if (this.state.roomName) {
                this.debouncedSearcRoom(this.state.roomName)
            }
            else {
                this.setState({
                    roomData: [],
                    room: null
                })
            }
        })
    }

    debouncedSearcRoom = debounce(async (name) => {
        if (this.state.roomName) {
            getRoomsAPI(this.state.roomName).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        roomData: res.data,
                        roomLoading: false
                    })
                }
            })
        }

    }, 600);

    selectRoomFunction(ele: any) {
        console.log("room", ele)
        this.setState({
            roomName: ele.displayName,
            roomId: ele.id,
            room: null,
            roomEmail: ele.email,
            IsMeetingUpdate: this.state.edit ? true : false
        }, () => {
            if (this.state.startDate && this.state.startTimeHour && this.state.startTimeMin && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin) {
                const timeDiff = moment.utc(moment(this.state.endTimeHour + ":" + this.state.endTimeMin + ":00", "HH:mm:ss").diff(moment(this.state.startTimeHour + ":" + this.state.startTimeMin + ":00", "HH:mm:ss"))).format("HH:mm:ss")
                const data = {
                    "roomEmail": this.state.roomEmail,
                    "startDateTime": this.state.startDate + "T" + this.state.startTimeHour + ":" + this.state.startTimeMin + ":00",
                    "endDateTime": this.state.endDate + "T" + this.state.endTimeHour + ":" + this.state.endTimeMin + ":00",
                    "timeZone": this.state.timeZone,
                    "timeInterval": timeDiff.substr(3, 2)
                }
                this.roomSearch(data)
            }
            else {
                this.setState({
                    roomError: "Please select proper date and time first"
                })
            }
        })
    }

    roomSearch(data: any) {
        roomScheduleAPI(data).then((res: any) => {
            console.log("room schedule", res)
            if (res.data) {
                this.setState({
                    roomAvailability: res.data.status
                })
            }
        })
    }


    ///////////////////////// Get Meeting Data by ID ///////////////////////
    getMeetingData(id: any, parentId: any) {
        getMeetingDetailsByParentIdAPI(id, parentId).then((res) => {
            console.log("view meeting", res.data)
            if (res.data.meetingDescription !== '') {
                const contentBlock = htmlToDraft(res.data.meetingDescription.slice(0, res.data.meetingDescription.length - 1));
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);
                    this.setState({
                        editorState,
                    })
                }
            }
            const start_date = res.data.startDateTime.split('T')
            const end_date = res.data.endDateTime.split('T')
            const repeatType = (res.data.repeatOption.replace(/([A-Z])/g, ' $1').trim().split(" ")[0] === "Relative" || res.data.repeatOption.replace(/([A-Z])/g, ' $1').trim().split(" ")[0] === "Absolute") ? res.data.repeatOption.replace(/([A-Z])/g, ' $1').trim().split(" ")[1] : res.data.repeatOption.replace(/([A-Z])/g, ' $1').trim()
            this.setState({
                edit: true,
                loading: false,
                meetingId: res.data.meetingId,
                eventId: res.data.eventId,
                meetingDescription: res.data.meetingDescription,
                meetingTypeId: res.data.meetingTypeId,
                meetingType: res.data.meetingType,
                meetingTitleId: res.data.meetingTitleId,
                meetingTitle: res.data.meetingTitle,
                timeZone: res.data.timeZone,
                AllDayEvent: res.data.allDayEvent,
                divisionName: res.data.divisionName,
                verticalName: res.data.verticalName,
                roomName: res.data.locationName,
                roomId: res.data.locationId,
                channelName: res.data.channelName,
                channelId: res.data.channelId,
                teamsId: res.data.teamsId,
                seriesMasterId: res.data.seriesMasterId,
                anchorName: res.data.anchorName,
                anchorEmail: res.data.anchorEmail,
                anchorADID: res.data.anchorADID,
                anchorDivisionName:res.data.anchorDivisionName,
                anchorVerticalName:res.data.anchorVerticalName,
                uploadedFile: res.data.meetingFileUpload,
                MeetingRepeatDetails: repeatType,
                participantsList: res.data.meetingParticipants,
                startDate: start_date[0],
                endDate: end_date[0],
                startTimeHour: start_date[1].substr(0, 2),
                startTimeMin: start_date[1].substr(3, 2),
                endTimeHour: end_date[1].substr(0, 2),
                endTimeMin: end_date[1].substr(3, 2),
                OrganiserName: res.data.organiserName,
                OrganiserEmail: res.data.organiserEmail,
                OrganiserADID: res.data.organiserADID,
                parentMeetingId: res.data.parentMeetingId,
                createdBy: res.data.createdBy,
                createdByEmail: res.data.createdByEmail,
                createdByAdid: res.data.createdByADID,
                createdOn: res.data.createdOn,
                seriesStartDate: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.StartDate.split('T')[0],
                dailyEventEndDate: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.endDate?res.data.meetingRepeatDetails.endDate.split('T')[0]:start_date[0],
                selectedWeek: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.onTheWeekDay && res.data.meetingRepeatDetails.onTheWeekDay.split(','),
                meetingRepeat: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.repeatEvery?res.data.meetingRepeatDetails.repeatEvery:this.state.meetingRepeat,
                onADay: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.onADay,
                onTheWeekDay: res.data.meetingRepeatDetails && (repeatType !== "Weekly") ? res.data.meetingRepeatDetails.onTheWeekDay : null,
                onTheWeek: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.onTheWeek,
                onTheMonth: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.onTheMonth,
                monthlyRepeatTypeValue: (res.data.repeatOption.replace(/([A-Z])/g, ' $1').trim().split(" ")[0] === "Relative") ? "On Day" : "On Date",
                monthName: res.data.meetingRepeatDetails && month[parseInt(res.data.meetingRepeatDetails.onTheMonth) - 1],
                meetingRepeatId: res.data.meetingRepeatDetails && res.data.meetingRepeatDetails.repeatId?res.data.meetingRepeatDetails.repeatId:0
            })

        })
        
    }

    ////////////////////////////////////// Meeting Create //////////////////////////////////
    meetingCreate() {
        this.setState({
            createMeetingLoading: true
        })
        if (!this.state.edit) {
            const data = {
                "MeetingTypeId": this.state.meetingTypeId,
                "MeetingTitleId": this.state.meetingTitleId,
                "MeetingTitle": this.state.meetingTitle,
                "MeetingDescription": this.state.meetingDescription,
                "CreatedBy": this.state.loggedInUser,
                "CreatedByEmail": this.state.loggedInUserEmail,
                "CreatedByADID": this.state.loggedInUserADID,
                "DivisionName": this.state.divisionName,
                "VerticalName": this.state.verticalName,
                "LocationId": this.state.roomId,
                "LocationName": this.state.roomName,
                "TeamsId": this.state.teamsId,
                "ChannelId": this.state.channelId,
                "ChannelName": this.state.channelName,
                "TimeZone": this.state.timeZone,
                "AllDayEvent": this.state.AllDayEvent ? 1 : 0,
                "StartDateTime": this.state.startDate + "T" + this.state.startTimeHour + ":" + this.state.startTimeMin + ":00",
                "EndDateTime": this.state.endDate + "T" + this.state.endTimeHour + ":" + this.state.endTimeMin + ":00",
                "AnchorName": this.state.anchorName,
                "AnchorEmail": this.state.anchorEmail,
                "AnchorADID": this.state.anchorADID,
                "AnchorDivisionName":this.state.anchorDivisionName,
                "AnchorVerticalName":this.state.anchorVerticalName,
                "OrganiserName": this.state.anchorName ? this.state.anchorName : this.state.loggedInUser,
                "OrganiserEmail": this.state.anchorEmail ? this.state.anchorEmail : this.state.loggedInUserEmail,
                "OrganiserADID": this.state.anchorADID ? this.state.anchorADID : this.state.loggedInUserADID,
                "RepeatOption": (this.state.MeetingRepeatDetails !== "Does Not Repeat") ? this.state.MeetingRepeatDetails : "DoesNotRepeat",
                "MeetingRepeatDetails": (this.state.MeetingRepeatDetails === "Does Not Repeat") ? {
                    "Frequency": "DoesNotRepeat",
                    "FrequencyType": "DoesNotRepeat",
                    "StartDate": !this.state.AllDayEvent ? this.state.startDate + "T" + this.state.startTimeHour + ":" + this.state.startTimeMin + ":00" : this.state.startDate,
                    "EndDate": !this.state.AllDayEvent ? this.state.endDate + "T" + this.state.endTimeHour + ":" + this.state.endTimeMin + ":00" : this.state.endDate,
                    "RepeatEvery": 1,
                    "RepeatRangeType": "EndDate"
                } : (this.state.MeetingRepeatDetails === "Daily") ? {
                    "Frequency": this.state.MeetingRepeatDetails,
                    "FrequencyType": this.state.MeetingRepeatDetails,
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "RepeatRangeType": "EndDate"
                } : (this.state.MeetingRepeatDetails === "Weekly") ? {
                    "Frequency": this.state.MeetingRepeatDetails,
                    "FrequencyType": this.state.MeetingRepeatDetails,
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "OnTheWeekDay": this.state.selectedWeek.toString(),
                    "RepeatRangeType": "EndDate"
                } : (this.state.MeetingRepeatDetails === "Monthly") ? {
                    "Frequency": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteMonthly" : "RelativeMonthly",
                    "FrequencyType": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteMonthly" : "RelativeMonthly",
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "OnTheWeekDay": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeekDay : null,
                    "OnTheWeek": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeek : null,
                    "OnADay": (this.state.monthlyRepeatTypeValue === "On Date") ? this.state.onADay : null,
                    "RepeatRangeType": "EndDate"
                } : {
                    "Frequency": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteYearly" : "RelativeYearly",
                    "FrequencyType": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteYearly" : "RelativeYearly",
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "OnTheWeekDay": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeekDay : null,
                    "OnTheWeek": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeek : null,
                    "OnADay": (this.state.monthlyRepeatTypeValue === "On Date") ? this.state.onADay : null,
                    "OnTheMonth": this.state.onTheMonth,
                    "RepeatRangeType": "EndDate"
                },
                "MeetingParticipants": this.state.participantsList,
                "SharePointDefaultUpload":(this.state.dropStatus === "Existing OAAP Template" ? 1 : this.state.template === ""? 0 : 0),
                "SharePointMannualUpload":(this.state.dropStatus === "Existing OAAP Template" ? 0 : this.state.template === ""? 0 : 1 ),
                "SPOFileUpload":{
                    "SPOItemId":this.state.dropStatus === "Existing OAAP Template" ? this.state.spoItemId: null
                },
            
                "MeetingGroups": this.state.selectedGroupsData
            }
            this.createUpdateMeeting(data)
        }
        else {
            const data = {
                "IsMeetingUpdate": this.state.IsMeetingUpdate ? 1 : 0,
                "MeetingId": (this.state.EditType === 'Edit Series') ? this.state.parentMeetingId : this.state.meetingId,
                "EventId": (this.state.EditType !== 'Edit Series') ? this.state.eventId : null,
                "SeriesMasterId": (this.state.EditType === 'Edit Series') ? this.state.seriesMasterId : null,
                "IsSeriesUpdate": (this.state.EditType !== 'Edit Series') ? 0 : 1,
                "UpdateMeetingId": this.state.meetingId,
                "MeetingTypeId": this.state.meetingTypeId,
                "MeetingTitleId": this.state.meetingTitleId,
                "MeetingTitle": this.state.meetingTitle,
                "MeetingDescription": this.state.meetingDescription,
                "CreatedBy": this.state.createdBy,
                "CreatedOn": this.state.createdOn,
                "CreatedByEmail": this.state.createdByEmail,
                "CreatedByADID": this.state.createdByAdid,
                "UpdatedBy": this.state.loggedInUser,
                "UpdatedByEmail": this.state.loggedInUserEmail,
                "UpdatedByADID": this.state.loggedInUserADID,
                "DivisionName": this.state.divisionName,
                "VerticalName": this.state.verticalName,
                "LocationId": this.state.roomId,
                "LocationName": this.state.roomName,
                "TeamsId": this.state.teamsId,
                "ChannelId": this.state.channelId,
                "ChannelName": this.state.channelName,
                "TimeZone": this.state.timeZone,
                "AllDayEvent": this.state.AllDayEvent ? 1 : 0,
                "StartDateTime": this.state.startDate + "T" + this.state.startTimeHour + ":" + this.state.startTimeMin + ":00",
                "EndDateTime": this.state.endDate + "T" + this.state.endTimeHour + ":" + this.state.endTimeMin + ":00",
                "AnchorName": this.state.anchorName,
                "AnchorEmail": this.state.anchorEmail,
                "AnchorADID": this.state.anchorADID,
                "AnchorDivisionName":this.state.anchorDivisionName,
                "AnchorVerticalName":this.state.anchorVerticalName,
                "OrganiserName": this.state.anchorName ? this.state.anchorName : this.state.OrganiserName,
                "OrganiserEmail": this.state.anchorEmail ? this.state.anchorEmail : this.state.OrganiserEmail,
                "OrganiserADID": this.state.anchorADID ? this.state.anchorADID : this.state.OrganiserADID,
                "RepeatOption": (this.state.MeetingRepeatDetails !== "Does Not Repeat") ? this.state.MeetingRepeatDetails : "DoesNotRepeat",
                "MeetingRepeatDetails": (this.state.MeetingRepeatDetails === "Does Not Repeat") ? {
                    "Frequency": "DoesNotRepeat",
                    "FrequencyType": "DoesNotRepeat",
                    "StartDate": !this.state.AllDayEvent ? this.state.startDate + "T" + this.state.startTimeHour + ":" + this.state.startTimeMin + ":00" : this.state.startDate,
                    "EndDate": !this.state.AllDayEvent ? this.state.endDate + "T" + this.state.endTimeHour + ":" + this.state.endTimeMin + ":00" : this.state.endDate,
                    "RepeatEvery": 1,
                    "RepeatRangeType": "EndDate"
                } : (this.state.MeetingRepeatDetails === "Daily") ? {
                    "Frequency": this.state.MeetingRepeatDetails,
                    "FrequencyType": this.state.MeetingRepeatDetails,
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "RepeatRangeType": "EndDate",
                    "RepeatId": this.state.meetingRepeatId
                } : (this.state.MeetingRepeatDetails === "Weekly") ? {
                    "Frequency": this.state.MeetingRepeatDetails,
                    "FrequencyType": this.state.MeetingRepeatDetails,
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "OnTheWeekDay": this.state.selectedWeek.toString(),
                    "RepeatRangeType": "EndDate",
                    "RepeatId": this.state.meetingRepeatId
                } : (this.state.MeetingRepeatDetails === "Monthly") ? {
                    "Frequency": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteMonthly" : "RelativeMonthly",
                    "FrequencyType": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteMonthly" : "RelativeMonthly",
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "OnTheWeekDay": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeekDay : null,
                    "OnTheWeek": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeek : null,
                    "OnADay": (this.state.monthlyRepeatTypeValue === "On Date") ? this.state.onADay : null,
                    "RepeatRangeType": "EndDate",
                    "RepeatId": this.state.meetingRepeatId
                } : {
                    "Frequency": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteYearly" : "RelativeYearly",
                    "FrequencyType": (this.state.monthlyRepeatTypeValue === "On Date") ? "AbsoluteYearly" : "RelativeYearly",
                    "StartDate": this.state.startDate,
                    "EndDate": this.state.dailyEventEndDate,
                    "RepeatEvery": this.state.meetingRepeat,
                    "OnTheWeekDay": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeekDay : null,
                    "OnTheWeek": (this.state.monthlyRepeatTypeValue !== "On Date") ? this.state.onTheWeek : null,
                    "OnADay": (this.state.monthlyRepeatTypeValue === "On Date") ? this.state.onADay : null,
                    "OnTheMonth": this.state.onTheMonth,
                    "RepeatRangeType": "EndDate",
                    "RepeatId": this.state.meetingRepeatId
                },
                "MeetingParticipants": this.state.participantsList,
                "SharePointDefaultUpload":(this.state.dropStatus === "Existing OAAP Template" ? 1 : this.state.template === ""? 0 : 0),
                "SharePointMannualUpload":(this.state.dropStatus === "Existing OAAP Template" ? 0 : this.state.template === ""? 0 : 1 ),
                "SPOFileUpload":{
                    "SPOItemId":this.state.dropStatus === "Existing OAAP Template" ? this.state.spoItemId: null
                },
                "MeetingGroups": this.state.selectedGroupsData
            }

            this.createUpdateMeeting(data)
        }

    }

    createUpdateMeeting = (data: any) => {
        console.log("Meeting data", data)
        var createMeetingFormData = new FormData()
        createMeetingFormData.append("eventData", JSON.stringify(data));

        // uploading OAAP template
        if(this.state.template){
            createMeetingFormData.append("SPOFile", this.state.template);
            console.log("createMeetingFormData file", createMeetingFormData.get('SPOFile'))
    };
        

        if (this.state.files.length > 0) {
            console.log(" Meeting data if")
            Promise.all(this.state.files.map((file: any) => {
                createMeetingFormData.append("file", file);
                console.log("createMeetingFormData file", createMeetingFormData.get('file'))
                return createMeetingFormData 
            })).then(() => {
                console.log(" Meeting data then")

            
                if (!this.state.edit) {
                    console.log(" Meeting data then if")

                    createMeetingFileAPI(createMeetingFormData).then((res: any) => {
                        console.log("create Meeting res with file", res)
                        if (res.status === 200) {
                            microsoftTeams.tasks.submitTask()
                        }
                    })
                }
                else {
                    updateMeetingeAPI(createMeetingFormData).then((res: any) => {
                        console.log("update Meeting res with file", res)
                        if (res.status === 200) {
                            microsoftTeams.tasks.submitTask()
                        }
                    })
                }

            })

        }
        else {
            if (!this.state.edit) {
                createMeetingFileAPI(createMeetingFormData).then((res: any) => {
                    console.log("create Meeting res", res)
                    if (res.status === 200) {
                        microsoftTeams.tasks.submitTask()
                    }
                })
            }
            else {
                console.log("update Meeting data", data)
                updateMeetingeAPI(createMeetingFormData).then((res: any) => {
                    console.log("update Meeting res", res)
                    if (res.status === 200) {
                        microsoftTeams.tasks.submitTask()
                    }
                })
            }
        }
    }


    //////////////////////// Rich Text Editor - Meeting Description/////////////////////////
    onEditorStateChange: Function = (editorState: any) => {
        this.setState({
            editorState,
            IsMeetingUpdate: this.state.edit ? true : false,
            meetingDescription: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        });
    };

    //////////////////////////// Repeat Occurence //////////////////////////
    repeatEvery = (e: any) => {
        this.setState({
            meetingRepeat: Math.abs(e.target.value),
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    //////////////////////////// Date Select //////////////////////////
    startDate = (e: any, v: any) => {
        var date = new Date(v.value);
        console.log("sayan", date);
        this.dateCreate("startDate", date)
    }

    endDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("endDate", date)
    }

    eventEndDate = (e: any, v: any) => {
        var date = new Date(v.value);
        this.dateCreate("eventEndDate", date)
    }

    systemDate = () => {
        var date = new Date();
        this.dateCreate("systemDate", date)
    }
    suggestedSelectDate = (e: any, v: any) => {
        var selectedDate = new Date(v.value);
        this.dateCreate("suggestedStartDate", selectedDate)
        const calculatedDate = new Date(selectedDate.setDate(selectedDate.getDate() + 9))
        this.dateCreate("suggestedEndDate", calculatedDate)
    }

    dateCreate = (value: any, date: any) => {
        console.log("end date 1", ("0" + date.getDate() + 1).slice(-2))
        let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let year = date.getFullYear();
        let finaldate = year + '-' + mnth + '-' + day;
        if (value === "startDate") {
            this.setState({
                startDate: finaldate,
                endDate: finaldate,
                dailyEventEndDate: finaldate,
                IsMeetingUpdate: this.state.edit ? true : false
            })
        }
        else if (value === "endDate") {
            this.setState({
                endDate: finaldate,
                IsMeetingUpdate: this.state.edit ? true : false
            })
        }
        else if (value === "eventEndDate") {
            this.setState({
                dailyEventEndDate: finaldate,
                IsMeetingUpdate: this.state.edit ? true : false
            })
        }
        else if (value === "suggestedStartDate") {
            this.setState({
                schedulingStartDate: finaldate
            })
        }
        else if (value === "suggestedEndDate") {
            this.setState({
                schedulingEndDate: finaldate
            })
        }
        else {
            this.setState({
                startDate: finaldate,
                endDate: finaldate,
                dailyEventEndDate: finaldate,
            })
        }

    }

    selectStartTimeHour = (time: any) => {
        this.setState({
            startTimeHour: time,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    selectStartTimeMin = (time: any) => {
        this.setState({
            startTimeMin: time,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    selectEndTimeHour = (time: any) => {
        this.setState({
            endTimeHour: time,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    selectEndTimeMin = (time: any) => {
        this.setState({
            endTimeMin: time,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    ///////////////////// All Day Select ///////////////////
    allDaySelect = (e: any) => {
        this.setState({
            AllDayEvent: e.target.checked
        }, () => {
            if (e.target.checked) {
                this.dateCreate("endDate", new Date(moment(this.state.startDate).add(1, 'days').format()))
                this.setState({
                    startTimeHour: "00",
                    startTimeMin: "00",
                    endTimeHour: "00",
                    endTimeMin: "00",
                    IsMeetingUpdate: this.state.edit ? true : false
                })
            }
        })
    }

    selectMeetingRepeatDetails = (value: any) => {
        this.setState({ MeetingRepeatDetails: value })
    }

    anchorSearch(event: any) {
        this.setState({
            anchorName: event.target.value,
            participantLoading: true,
            anchor: 1,
            anchorEmail: null,
            anchorADID: null,
        }, () => {
            if (event.target.value) {
                this.debouncedSearchAnchor(event.target.value);
            }
            else {
                this.setState({
                    anchor: null,
                    anchorData: [],
                })

            }
        })
    }

    debouncedSearchAnchor = debounce(async (criteria) => {
        if (this.state.anchorName) {
            getFilteredUsersAPI(this.state.anchorName).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        anchorData: res.data,
                        participantLoading: false
                    })
                }

            })
        }

    }, 600);



    selectAnchorFunction(ele: any) {
        console.log("ele", ele)
        this.setState({
            anchorName: ele.displayName,
            anchorDivisionName:ele.division,
            anchorVerticalName:ele.vertical,
            anchorEmail: ele.mail,
            anchorADID: ele.id,
            anchor: null,
            IsMeetingUpdate: this.state.edit ? true : false,
            suggestedTimeParticipantsList: [...this.state.suggestedTimeParticipantsList, { ParticipantName: ele.displayName, ParticipantEmail: ele.mail }],
        })
    }

           //-------------Groups------------------
        
           groupSearch(event: any) {
            this.setState({
                groups:event.target.value,
                groupsData:[],
                participantLoading: true,
            }
            , 
            () => {
                if (event.target.value) {
                    this.debouncedSearchGroup(this.state.groups)
                }
                else {
                    this.setState({
                        groups: null,
                        groupsData: []
                    })
                }
            })
        }
    
        debouncedSearchGroup = debounce(async (data) => {
            if (this.state.groups) {
                getAllDistributionListGroups(data).then((res: any) => {
                    console.log("group list", res.data)
                    if (res.data) {
                        this.setState({
                            groupsData: res.data,
                            participantLoading: false
                        })
                    }
    
                })
            }
        }, 600);

        selectGroups(ele: any){
            console.log("console ele--------", ele)
                        this.setState({
                            groupsData: [],
                            // selectedGroupsData:[...this.state.selectedGroupsData,{"groupName":ele.displayName, "groupMail":ele.mail, "groupId":ele.id, "groupType":ele.groupTypes}],
                            selectedGroupsData:this.state.selectedGroupsData.findIndex((fi:any)=>fi.groupId===ele.id) !== -1 ? this.state.selectedGroupsData : [...this.state.selectedGroupsData,{"groupName":ele.displayName, "groupMail":ele.mail, "groupId":ele.id, "groupType":"DL Group"}] ,
                            groups:null,
                            participantLoading: false

                        })
        }

        cancelGroup(ele: any) {
            var index = this.state.selectedGroupsData.findIndex((x: any) => x.groupMail === ele.groupMail)
            var array = [...this.state.selectedGroupsData];
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({ 
                    selectedGroupsData: array,
                 });
            }
        }


    keyParticipantsSearch(event: any) {
        this.setState({
            keyParticipants: event.target.value,
            participantLoading: true,
            keyParticipantsData: []

        }, () => {
            if (event.target.value) {
                this.debouncedSearchKeyParticipants(this.state.keyParticipants)
            }
            else {
                this.setState({
                    keyParticipants: null,
                    keyParticipantsData: []
                })
            }
        })
    }

    debouncedSearchKeyParticipants = debounce(async (name) => {
        if (this.state.keyParticipants) {
            getFilteredUsersAPI(name).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        keyParticipantsData: res.data.filter((e: any) => e.mail !== this.state.anchorEmail),
                        participantLoading: false
                    })
                }

            })
        }

    }, 600);


    //-------------co anchor------------------
    coAnchorSearch(event: any) {
        this.setState({
            coAnchors:event.target.value,
            coAnchorsData:[],
            participantLoading: true,
            

        }, () => {
            if (event.target.value) {
                this.debouncedSearchCoAnchor(this.state.coAnchors)
            }
            else {
                this.setState({
                    keyParticipants: null,
                    keyParticipantsData: []
                })
            }
        })
    }

    debouncedSearchCoAnchor = debounce(async (name) => {
        if (this.state.coAnchors) {
            getFilteredUsersAPI(name).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        coAnchorsData: res.data.filter((e: any) => e.mail !== this.state.anchorEmail),
                        participantLoading: false
                    })
                }

            })
        }
    }, 600);

    participantsSearch(event: any) {
        this.setState({
            participants: event.target.value,
            participantLoading: true,
            participantsData: []

        }, () => {
            if (event.target.value) {
                this.debouncedSearchParticipants(this.state.participants)
            }
            else {
                this.setState({
                    participants: null,
                    participantsData: []
                })

            }
        })
    }

    debouncedSearchParticipants = debounce(async (name) => {
        if (this.state.participants) {
            getFilteredUsersAPI(name).then((res: any) => {
                console.log("user list", res)
                if (res.data) {
                    this.setState({
                        participantsData: res.data.filter((e: any) => e.mail !== this.state.anchorEmail),
                        participantLoading: false
                    })
                }

            })
        }

    }, 600);


    externalParticipants(event: any) {
        var emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
        this.setState({
            externalParticipants: event.target.value
        })
        if (emailReg.test(event.target.value)) {
            this.setState({
                externalParticipantsList: [...this.state.externalParticipantsList, { "displayName": event.target.value, "mail": event.target.value, "id": null }],
                invalidExternalParticipants: false
            })
        }
        else {
            this.setState({
                invalidExternalParticipants: true
            })
        }

    }




    selectParticipantsFunction(ele: any, type: any) {
        console.log("sayan", ele, type)
        const employeeMail = ele.mail;
        if (this.state.participantsList.length > 0) {
            const found = this.state.participantsList.some((e: any) => e.participantEmail === employeeMail);
            if (!found) {
                this.setState({
                    participantsList: [...this.state.participantsList, { "participantName": ele.displayName, "participantEmail": ele.mail, "participantADID": ele.id, "participantType": type, "participantId": 0 }],
                    IsMeetingUpdate: this.state.edit ? true : false
                }, () => {
                    if (type === 'Key Participants') {
                        this.setState({
                            keyParticipants: null,
                            participantsData: [],
                            suggestedTimeParticipantsList: (this.state.meetingType !== "Other") && [...this.state.suggestedTimeParticipantsList, { ParticipantName: ele.displayName, ParticipantEmail: ele.mail }]
                        })
                    } else if (type === 'Participants') {
                        this.setState({
                            participantsData: [],
                            participants: null
                        })
                    }
                    else if (type === 'CoAnchors') {
                        this.setState({
                            coAnchorsData: [],
                            coAnchors: null
                        })
                    }
                    else {
                        var array = [...this.state.externalParticipantsList];
                        array.splice(0, array.length);
                        this.setState({
                            externalParticipantsList: array,
                            externalParticipants: null
                        })
                    }
                })

            }
            else {
                if (type === 'Key Participants') {
                    this.setState({
                        participantsData: [],
                        keyParticipants: null
                    })
                } else if (type === 'Participants') {
                    this.setState({
                        participantsData: [],
                        participants: null
                    })
                }
                else if (type === 'CoAnchors') {
                    this.setState({
                        coAnchorsData: [],
                        coAnchors: null
                    })
                }
                else {
                    var array = [...this.state.externalParticipantsList];
                    array.splice(0, array.length);
                    this.setState({
                        externalParticipantsList: array,
                        externalParticipants: null
                    })
                }
            }

        }
        else {
            this.setState({
                IsMeetingUpdate: this.state.edit ? true : false,
                participantsList: [...this.state.participantsList, { "participantName": ele.displayName, "participantEmail": ele.mail, "participantADID": ele.id, "participantType": type, "participantId": 0 }]
            }, () => {
                if (type === 'Key Participants') {
                    this.setState({
                        keyParticipants: null,
                        participantsData: [],
                        suggestedTimeParticipantsList: (this.state.meetingType !== "Other") && [...this.state.suggestedTimeParticipantsList, { ParticipantName: ele.displayName, ParticipantEmail: ele.mail }]
                    })
                } else if (type === 'Participants') {
                    this.setState({
                        participantsData: [],
                        participants: null
                    })
                }
                else if (type === 'CoAnchors') {
                    this.setState({
                        coAnchorsData: [],
                        coAnchors: null
                    })
                }
                else {
                    var array = [...this.state.externalParticipantsList];
                    array.splice(0, array.length);
                    this.setState({
                        externalParticipantsList: array,
                        externalParticipants: null
                    })
                }
            })
        }
    }

    cancelEmployee(ele: any) {
        var index = this.state.participantsList.findIndex((x: any) => x.participantEmail === ele.participantEmail)
        var array = [...this.state.participantsList];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ 
                participantsList: array,
                IsMeetingUpdate: this.state.edit ? true : false
             });
        }

        if (this.state.suggestedTimeParticipantsList.length > 0) {
            var index = this.state.suggestedTimeParticipantsList.findIndex((x: any) => x.ParticipantEmail === ele.participantEmail)
            var array = [...this.state.suggestedTimeParticipantsList];
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({
                    suggestedTimeParticipantsList: array,
                    IsMeetingUpdate: this.state.edit ? true : false
                });
            }
        }
    }

    selectWeek(data: any) {
        this.setState({
            selectedWeek: data,
            IsMeetingUpdate: this.state.edit ? true : false
        }, () => {
            console.log("week data", this.state.selectedWeek.toString())
        })

    }

    selectMonthlyRepeatType(data: any) {
        this.setState({
            monthlyRepeatTypeValue: data,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    selectOnTheWeek(data: any) {
        this.setState({
            onTheWeek: data,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    selectOnTheMonth(data: any) {
        this.setState({
            monthName: data,
            onTheMonth: month.indexOf(data) + 1,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    selectOnTheWeekDay(data: any) {
        this.setState({
            onTheWeekDay: data,
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }

    buttonDisable() {
        const timeDiffHour = moment.utc(moment(this.state.endTimeHour + ":" + this.state.endTimeMin + ":00", "HH:mm:ss").diff(moment(this.state.startTimeHour + ":" + this.state.startTimeMin + ":00", "HH:mm:ss"))).format("HH:mm:ss").substr(0, 2)
        if (this.state.MeetingRepeatDetails === "Does Not Repeat") {
            if (this.state.meetingType !== "Other") {
                return (this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").length > 0 && this.state.anchorEmail && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && (timeDiffHour !== "23" ? true : false)) ? false : true
            }
            else {
                return (this.state.participantsList.filter((e: any) => e.participantType === "Participants").length > 0 && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && (timeDiffHour !== "23" ? true : false)) ? false : true
            }
        } else if (this.state.MeetingRepeatDetails === "Daily") {
            if (this.state.meetingType !== "Other") {
                return (this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").length > 0 && this.state.anchorEmail && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.meetingRepeat && (timeDiffHour !== "23" ? true : false)) ? false : true
            }
            else {
                return (this.state.participantsList.filter((e: any) => e.participantType === "Participants").length > 0 && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.meetingRepeat && (timeDiffHour !== "23" ? true : false)) ? false : true
            }
        }
        else if (this.state.MeetingRepeatDetails === "Monthly") {
            if (this.state.monthlyRepeatTypeValue !== "On Date") {
                if (this.state.meetingType !== "Other") {
                    return (this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").length > 0 && this.state.anchorEmail && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.onTheWeekDay && this.state.onTheWeek && this.state.meetingRepeat && (timeDiffHour !== "23" ? true : false)) ? false : true
                }
                else {
                    return (this.state.participantsList.filter((e: any) => e.participantType === "Participants").length > 0 && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.onTheWeekDay && this.state.onTheWeek && this.state.meetingRepeat && (timeDiffHour !== "23" ? true : false)) ? false : true
                }

            }
            else {
                if (this.state.meetingType !== "Other") {
                    return (this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").length > 0 && this.state.anchorEmail && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.onADay && this.state.meetingRepeat && (timeDiffHour !== "23" ? true : false)) ? false : true
                }
                else {
                    return (this.state.participantsList.filter((e: any) => e.participantType === "Participants").length > 0 && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.onADay && this.state.meetingRepeat && (timeDiffHour !== "23" ? true : false)) ? false : true
                }
            }

        }
        else if (this.state.MeetingRepeatDetails === "Weekly") {
            
           
                if (this.state.meetingType !== "Other") {
                    return (this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").length > 0 && this.state.anchorEmail && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.meetingRepeat && this.state.selectedWeek.length > 0 && (timeDiffHour !== "23" ? true : false)) ? false : true
                }
                else {
                    return (this.state.participantsList.filter((e: any) => e.participantType === "Participants").length > 0 && this.state.startDate && this.state.endDate && this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && this.state.dailyEventEndDate && this.state.meetingRepeat && this.state.selectedWeek.length > 0 && (timeDiffHour !== "23" ? true : false)) ? false : true
                }
        

        }


    }

    selectEditType(value: any) {
        this.setState({
            EditType: value,
            startDate: this.state.seriesStartDate,
            endDate: this.state.seriesStartDate,
        })
    }

    onDate(e: any) {
        this.setState({
            onADay: Math.abs(e.target.value),
            IsMeetingUpdate: this.state.edit ? true : false
        })
    }


    deleteMeetingFiles(e: any) {
        deleteMeetingFilesAPI(e.meetingId, e.fileId).then((res: any) => {
            console.log("file delete", res)
            if (res.data) {
                this.setState({
                    uploadedFile: res.data
                })
            }
        })
    }


    suggestedTime() {
        console.log("sayan time diff", moment.utc(moment(this.state.endTimeHour + ":" + this.state.endTimeMin + ":00", "HH:mm:ss").diff(moment(this.state.startTimeHour + ":" + this.state.startTimeMin + ":00", "HH:mm:ss"))).format("HH:mm:ss"))
        const timeDiff = moment.utc(moment(this.state.endTimeHour + ":" + this.state.endTimeMin + ":00", "HH:mm:ss").diff(moment(this.state.startTimeHour + ":" + this.state.startTimeMin + ":00", "HH:mm:ss"))).format("HH:mm:ss")

        this.setState({
            availability: true,
            timeDiffHour: timeDiff.substr(0, 2),
            timeDiffMin: timeDiff.substr(3, 2)
        })
    }
    suggestedTimeFunction() {
        const data = {
            participants: this.state.suggestedTimeParticipantsList,
            startDateTime: this.state.schedulingStartDate,
            endDateTime: this.state.schedulingEndDate,
            isOrganizerOptional: "false",
            timeDuration: "PT" + this.state.timeDiffHour + "H" + this.state.timeDiffMin + "M",
            minimumAttendancePercentage: "100",
            timeZone: this.state.timeZone,
            userAdId: this.state.loggedInUserADID,
            noOfSuggestion: 10,
        };
        console.log("suggested time payload", data);
        findMeetingTimesAPI(data).then((res: any) => {
            if (res.data) {
                this.setState({
                    suggestedTimeSlot: res.data
                }, () => {
                    console.log("suggested time res", this.state.suggestedTimeSlot);
                })

            }
        });
    }

    selectSuggestedTime(e: any) {
        console.log("sayan", e)
        const start_date = e.startDateTime.split('T')
        const end_date = e.endDateTime.split('T')
        this.setState({
            startDate: start_date[0],
            endDate: end_date[0],
            startTimeHour: start_date[1].substr(0, 2),
            startTimeMin: start_date[1].substr(3, 2),
            endTimeHour: end_date[1].substr(0, 2),
            endTimeMin: end_date[1].substr(3, 2),
            IsMeetingUpdate: this.state.edit ? true : false

        })
    }


    meetingTitleFunction(e: any) {
        this.setState({
            meetingTitle: e.target.value
        })
    }

    timeValidation() {
        const timeDiffHour = moment.utc(moment(this.state.endTimeHour + ":" + this.state.endTimeMin + ":00", "HH:mm:ss").diff(moment(this.state.startTimeHour + ":" + this.state.startTimeMin + ":00", "HH:mm:ss"))).format("HH:mm:ss").substr(0, 2)
        if (this.state.endTimeHour && this.state.endTimeMin && this.state.startTimeHour && this.state.startTimeMin && timeDiffHour === "23") {
            return <Text content="End time is less than start time" error size="small" className='mt-2' />
        }
        else {
            return <Text content="" size="small" className='mt-0 p-0' />
        }
    }

    dropStatusFunction = (value: any) => {
        console.log("value====",value)
        this.setState({
            dropStatus: value,
            error:false
        },()=>{console.log(this.state.dropStatus)})
    }

     ////////////////////////////////// Tempalte Upload //////////////////////////////////////// templates:[],
            // uploadedtemplate:[],
     templatesUpload() {
        (document.getElementById('template') as HTMLInputElement).click()
        this.setState({
            error:false
        })
    };

    isValidFileUploaded=(file:any)=>{
        console.log("is valid fileeeeeeeeeeeeee",file.type)
        const validExtensions = ['doc','docx','application/msword']
        const fileExtension = file.name.split('.')[1]
        console.log("fileExtension",fileExtension)
        console.log("file extension validation.........",fileExtension)
        return validExtensions.includes(fileExtension)
      }

    ontemplatesChoose(event: any) {
        const file = event.target.files[0];
        if(this.isValidFileUploaded(file)){
            this.setState({
                template: event.target.files[0],
                error:false,
            },()=>console.log("templates selected",this.state.template))
        }
        else{
            // alert("Please choose .doc/.docx file type only")
            this.setState({
                errorUploadMsg:"Please choose doc/docx file type only",
                error:true,
            },()=>console.log("upload error msg",this.state.errorUploadMsg))
           
        }
         
    }

    ////////////////////////// Template Remove /////////////////////////////////////////
    // templatesRemoveOne(index: any) {
    //     var array = [...this.state.templates];
    //     console.log("removed",array)
    //     if (index !== -1) {
    //         array.splice(index, 1);
    //         this.setState({ 
    //             templates: array,
    //         });
    //     }
    // }

    elip=(text:any)=>{
        var max = 25;
        return text.length > max ? text.substring(0, max) + '...' : text
      }

    render() {
        return (
            <div>
                
                
                {(this.state.loading) ? <div><Loader styles={{ margin: "50px" }} /></div> : <div>
                    {(this.state.pages === 'General Info') ? <div className="taskModule">
                        {this.state.edit && <div className='pl-5'>{(this.state.MeetingRepeatDetails !== "Does Not Repeat") &&
                            <Dropdown
                                fluid
                                className='m-3'
                                items={this.state.EditTypeDropdown}
                                placeholder="Edit types"
                                value={this.state.EditType}
                                onChange={(event, { value }) => this.selectEditType(value)}
                            />}</div>}
                        <Text content="Enter General Information and click on Next to enter Date / Time and Participants" size="medium" weight="bold" className='meeetingCreationHeader mt-3' />
                        <Flex column className="formContainer createMeetingDiv mt-3" vAlign="stretch" gap="gap.small" styles={{ background: "white" }}>
                            <Flex className="scrollableContent">
                                <FlexItem size="size.half">
                                    <div className='leftSidePart'>
                                        <div className='d-flex justify-content-start align-items-center mb-3'>
                                            {/* <Tooltip trigger={<TagMultiple20Regular />} content="Type" /> */}
                                            <FormDropdown
                                                fluid
                                                className='flex-fill ms-2 leftSidePartDropDown'
                                                items={this.state.meetingTypeInputList}
                                                placeholder="Type*"
                                                disabled={this.state.edit}
                                                checkable
                                                value={this.state.meetingType}
                                                onChange={(event, { value }) => this.selectTypeName(value)}
                                            />
                                        </div>

                                        <div className='d-flex justify-content-start align-items-center mb-3'>
                                            {/* <Tooltip trigger={<Edit20Regular />} content="Title" /> */}
                                            {(this.state.meetingType !== "Other") ? <FormDropdown
                                                fluid
                                                className='flex-fill ms-2 leftSidePartDropDown'
                                                items={this.state.meetingTitlesInputList}
                                                placeholder="Title*"
                                                disabled={this.state.edit || (this.state.meetingTitlesInputList.length > 0 ? false : true)}
                                                checkable
                                                value={this.state.meetingTitle}
                                                onChange={(event, { value }) => this.selectMeetingTitle(value)}
                                            /> : <Input fluid value={this.state.meetingTitle} autoComplete="off" disabled={this.state.edit}
                                                placeholder="Title*" onChange={(e) => this.meetingTitleFunction(e)} />}
                                        </div>

                                        {/*-------------------------------------- 2nd phase implementation Start------------------------- */}
                                        
                                        <div className='d-flex justify-content-start align-items-center mb-3'>
                                            <FormDropdown
                                                fluid
                                                className='flex-fill ms-2 leftSidePartDropDown'
                                                items={this.state.dropOption}
                                                placeholder="Upload OAAP Templete"
                                                // value={this.state.dropStatus}
                                                onChange={(event, { value }) => this.dropStatusFunction(value)}
                                                clearable
                                            />
                                        </div>

                                        {/*-------------------------------------- 2nd phase implementation End------------------------- */}
                                        
                                        <div className='d-flex justify-content-start align-items-center mb-3'>
                                            {/* <Tooltip trigger={<Channel20Regular />} content="Add channel" /> */}
                                            <FormDropdown
                                                fluid
                                                className='flex-fill ms-2'
                                                disabled={this.state.channelInputList.length > 0 ? false : true}
                                                items={this.state.channelInputList}
                                                placeholder="Channel"
                                                value={this.state.channelName}
                                                onChange={(event, { value }) => this.selectChannel(value)}
                                            />
                                        </div>

                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                            {/* <div><Tooltip trigger={<List20Regular />} content="Description" /></div> */}
                                            <Editor
                                                wrapperClassName="wrapper-class flex-fill ms-2"
                                                editorClassName="editor-class"
                                                toolbarClassName="toolbar-class"
                                                editorState={this.state.editorState}
                                                onEditorStateChange={(e) => this.onEditorStateChange(e)}
                                            />
                                        </div>

                                    </div>
                                </FlexItem>
                                <FlexItem size="size.half">
                                    <div>
                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                            {/* <div style={{ 'lineHeight': '44px' }}><Attach20Regular /></div> */}
                                            <div className='flex-fill pr-3 pl-3'>
                                                <Input type="file" id="upload" style={{ display: 'none' }} onChange={value => this.onFileChoose(value)} accept={this.state.fileExtensionList}></Input>
                                                <div onClick={() => this.fileUpload()} className='createMeetingFileUpload pointer'>Upload file</div>
                                            </div>
                                        </div>
                                        <div className='pl-5 pr-2 t-2'>
                                            {(this.state.uploadedFile.length > 0) && <div>
                                                {this.state.uploadedFile.map((file: any, i: any) => {
                                                    return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                        <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                                            <Text size="medium">{file.fileName}</Text>
                                                            <div className="pointer backButtonMessagingExtention" onClick={() => this.deleteMeetingFiles(file)}>
                                                                <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                            </div>

                                                        </Flex>

                                                    </Flex>
                                                })}

                                            </div>

                                            }

                                            {(this.state.files.length > 0) && <div>
                                                {this.state.files.map((file: any, i: any) => {
                                                    return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                        <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                                            <Text size="medium">{file.name}</Text>
                                                            <div className="pointer backButtonMessagingExtention" onClick={() => this.filesRemoveOne(i)}>
                                                                <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                            </div>

                                                        </Flex>

                                                    </Flex>
                                                })}

                                            </div>

                                            }
                                        </div>


                                        {/*-------------------------------------- 2nd phase implementation start------------------------- */}
                                        {/* 
                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                            <div className='flex-fill'>
                                                <Input type="file" id="upload" style={{ display: 'none' }} onChange={value => this.onFileChoose(value)} accept={this.state.fileExtensionList}></Input>
                                                <div onClick={() => this.fileUpload()} className='createMeetingFileUpload pointer'>Upload file</div>
                                            </div>
                                        </div>
                                         */}

                                        {!this.state.edit && this.state.dropStatus === "Upload OAAP Template" ? 
                                        <>
                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                        <div className='flex-fill  pr-3 pl-3'>
                                            <Input type="file" id="template" style={{ display: 'none' }} onChange={value => this.ontemplatesChoose(value)}
                                             accept={".doc,.docx,application/msword"}
                                             ></Input>
                                            <div onClick={() => this.templatesUpload()} className='createMeetingFileUpload pointer'>Upload OAAP Template</div>
                                        </div>
                                        </div>
                                        <Text size="medium" className='mx-5'>{this.state.template.name}</Text>
                                        
                                        </>

                                        
                                        
                                        :
                                        this.state.edit && this.state.dropStatus === "Upload OAAP Template" ?
                                        <>
                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                        <div className='flex-fill  pr-3 pl-3'>
                                            <Input type="file" id="template" style={{ display: 'none' }} onChange={value => this.ontemplatesChoose(value)}
                                             accept={".doc,.docx,application/msword"}
                                             ></Input>
                                            <div onClick={() => this.templatesUpload()} className='createMeetingFileUpload pointer'>Upload OAAP Template</div>
                                        </div>
                                        </div>
                                        <Text size="medium" className='mx-5'>{this.state.template.name}</Text>
                                        
                                        </>
                                        :
                                        !this.state.edit && this.state.dropStatus === "Existing OAAP Template"  && this.state.spoWebUrl !== null? 
                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                        <div className='flex-fill pr-3 pl-3'>

                                        
                                        <Text onClick={()=>window.open(this.state.spoWebUrl,"_blank")} title={this.state.meetingTitleFileName}>{this.elip(this.state.meetingTitleFileName)}</Text>
                                        
                                        
                                            
                                        </div>
                                        </div>
                                        : 
                                        this.state.edit && this.state.dropStatus === "Existing OAAP Template"  && this.state.spoWebUrl !== null? 
                                        <div className='d-flex justify-content-start align-items-start mb-3'>
                                        <div className='flex-fill pr-3 pl-3'>

                                        
                                        <Text onClick={()=>window.open(this.state.spoWebUrl,"_blank")} title={this.state.meetingTitleFileName}>{this.elip(this.state.meetingTitleFileName)}</Text>
                                        
                                        
                                        
                                            
                                        </div>
                                        </div>
                                        
                                        :
                                        null
                                        
                                        }
                                       {/*-------------------------------------- 2nd phase implementation end-------------------------- */}
                                    
                                    </div>
                                </FlexItem>
                            </Flex>

                            <Flex className="m-3 mt-0" vAlign="end" hAlign="end">
                                <Button content="Cancel" onClick={() => microsoftTeams.tasks.submitTask()} secondary />
                                <Flex className="buttonContainer ml-3">
                                    <Button content="Next" id="saveBtn" onClick={() => this.setState({ pages: "Date/Time" })} disabled={(this.state.meetingTypeId && this.state.meetingTitle) ? false : true} primary />
                                </Flex>
                            </Flex>


                        </Flex>

                    </div> :
                        <div className="taskModule">
                            <Text content="Enter Date / Time and Participants" size="medium" weight="bold" className='meeetingCreationHeader mt-3' />
                            <Flex column className="formContainer mt-2" vAlign="stretch" gap="gap.small" styles={{ background: "white" }}>
                                <Flex className="scrollableContent">
                                    <FlexItem size="size.half">
                                        <div className='leftSidePart'>
                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                {/* <Tooltip trigger={<TagMultiple20Regular />} content="Type" /> */}
                                                <Dropdown
                                                    fluid
                                                    className='flex-fill ms-2 leftSidePartDropDown'
                                                    items={this.state.timeZoneInputList}
                                                    placeholder={this.state.timeZoneValue}
                                                    search
                                                    checkable
                                                    value={this.state.timeZoneValue}
                                                    onChange={(event, { value }) => this.selectTimeZone(value)}
                                                />
                                            </div>
                                            <div className='d-flex justify-content-start mb-3 divgap' >
                                                {/* <div className='me-2' style={{ 'lineHeight': '30px' }}>
                                                    <Tooltip trigger={<CalendarLtr20Regular />} content="Date time" />
                                                </div> */}

                                                {/* <div> */}
                                                <div className="d-flex">
                                                    <Datepicker
                                                        onDateChange={(e, v) => this.startDate(e, v)}
                                                        inputOnly
                                                        inputPlaceholder={moment(this.state.startDate).format('LL')}
                                                        className="createMeetingDate"
                                                        minDate={new Date()}

                                                    />

                                                    {!this.state.AllDayEvent && <div className="d-flex">
                                                        <FormDropdown
                                                            items={hours}
                                                            placeholder="Hour*"
                                                            checkable
                                                            value={this.state.startTimeHour}
                                                            className="createMeetingTimePicker"
                                                            onChange={(event, { value }) => this.selectStartTimeHour(value)}
                                                        />
                                                        <FormDropdown
                                                            items={minutes}
                                                            placeholder="Minute*"
                                                            checkable
                                                            value={this.state.startTimeMin}
                                                            className="createMeetingTimePicker"
                                                            onChange={(event, { value }) => this.selectStartTimeMin(value)}
                                                        />
                                                    </div>}
                                                </div>


                                            </div>
                                            <div className='d-flex justify-content-start mb-3 divgap' >
                                                {/* <div className='me-2' style={{ 'lineHeight': '30px' }}>
                                                    <Tooltip trigger={<CalendarLtr20Regular />} content="Date time" />
                                                </div> */}

                                                {/* <div> */}
                                                <div className="d-flex">
                                                    <Datepicker
                                                        inputOnly
                                                        className="createMeetingDate"
                                                        onDateChange={(e, v) => this.endDate(e, v)}
                                                        inputPlaceholder={moment(this.state.endDate).format('LL')}
                                                        minDate={new Date(this.state.startDate)}
                                                    />
                                                    {!this.state.AllDayEvent && <div className="d-flex">
                                                        <FormDropdown
                                                            items={hours}
                                                            placeholder="Hour*"
                                                            checkable
                                                            value={this.state.endTimeHour}
                                                            className="createMeetingTimePicker"
                                                            onChange={(event, { value }) => this.selectEndTimeHour(value)}
                                                        />
                                                        <FormDropdown
                                                            items={minutes}
                                                            placeholder="Minute*"
                                                            checkable
                                                            value={this.state.endTimeMin}
                                                            className="createMeetingTimePicker"
                                                            onChange={(event, { value }) => this.selectEndTimeMin(value)}
                                                        />
                                                    </div>}
                                                </div>


                                            </div>
                                            {this.timeValidation()}
                                            <div className='mb-2' >
                                                <Text content="All Day" size="small" className='mr-3' />
                                                <Toggle defaultChecked={this.state.AllDayEvent} icons={false} onChange={(e) => this.allDaySelect(e)} className='mr-3'></Toggle>
                                                {/* <Checkbox label="All day" toggle /> */}
                                                {this.state.AllDayEvent && <Text content="1 day" size="small" />}
                                            </div>
                                            <div className='d-flex justify-content-start mb-3 divgap' >
                                                {/* <div className='me-2' style={{ 'lineHeight': '30px' }}>
                                                    <Tooltip trigger={<CalendarLtr20Regular />} content="Date time" />
                                                </div> */}
                                                <FormDropdown
                                                    items={this.state.MeetingRepeatDetailsInput}
                                                    placeholder="Meeting Repeat"
                                                    checkable
                                                    className='flex-fill ms-2 leftSidePartDropDown'
                                                    value={this.state.MeetingRepeatDetails}
                                                    onChange={(event, { value }) => this.selectMeetingRepeatDetails(value)}
                                                />

                                            </div>
                                            {(this.state.MeetingRepeatDetails === "Daily") ? <div className='d-flex justify-content-start mb-3 divgap'>
                                                <Flex gap="gap.small">
                                                    <Flex.Item >
                                                        <Datepicker
                                                            inputOnly
                                                            className="createMeetingDate"
                                                            disabled
                                                            inputPlaceholder={moment(this.state.startDate).format('LL')}
                                                        />
                                                    </Flex.Item>

                                                    <Flex.Item >
                                                        <Datepicker
                                                            inputOnly
                                                            className="createMeetingDate"
                                                            onDateChange={(e, v) => this.eventEndDate(e, v)}
                                                            minDate={new Date(this.state.startDate)}
                                                            inputPlaceholder={moment(this.state.dailyEventEndDate).format('LL')}
                                                        />
                                                    </Flex.Item>
                                                    <Flex.Item >
                                                        <Input placeholder='Repeat every' type="number" onChange={(e) => this.repeatEvery(e)} value={this.state.meetingRepeat} min="1" />
                                                    </Flex.Item>
                                                </Flex>
                                            </div> : (this.state.MeetingRepeatDetails === "Weekly") ? <div>
                                                <FormDropdown
                                                    items={week}
                                                    placeholder="Day"
                                                    checkable
                                                    multiple
                                                    value={this.state.selectedWeek}
                                                    onChange={(event, { value }) => this.selectWeek(value)}
                                                />
                                                <div className='d-flex justify-content-start mb-3 divgap mt-3'>
                                                    <Flex gap="gap.small">
                                                        <Flex.Item >
                                                            <Datepicker
                                                                inputOnly
                                                                className="createMeetingDate"
                                                                disabled
                                                                inputPlaceholder={moment(this.state.startDate).format('LL')}
                                                            />
                                                        </Flex.Item>

                                                        <Flex.Item >
                                                            <Datepicker
                                                                inputOnly
                                                                className="createMeetingDate"
                                                                onDateChange={(e, v) => this.eventEndDate(e, v)}
                                                                minDate={new Date(this.state.startDate)}
                                                                inputPlaceholder={moment(this.state.dailyEventEndDate).format('LL')}
                                                            />
                                                        </Flex.Item>
                                                        <Flex.Item >
                                                            <Input placeholder='Repeat every' type="number" onChange={(e) => this.repeatEvery(e)} value={this.state.meetingRepeat} min="1" />
                                                        </Flex.Item>
                                                    </Flex>
                                                </div>
                                            </div> : (this.state.MeetingRepeatDetails === "Monthly") ? <div>
                                                <div className='d-flex justify-content-start mb-3 divgap mt-3'>
                                                    <Flex gap="gap.small">
                                                        <Flex.Item >
                                                            <Datepicker
                                                                inputOnly
                                                                className="createMeetingDate"
                                                                disabled
                                                                inputPlaceholder={moment(this.state.startDate).format('LL')}
                                                            />
                                                        </Flex.Item>

                                                        <Flex.Item >
                                                            <Datepicker
                                                                inputOnly
                                                                className="createMeetingDate"
                                                                onDateChange={(e, v) => this.eventEndDate(e, v)}
                                                                minDate={new Date(this.state.startDate)}
                                                                inputPlaceholder={moment(this.state.dailyEventEndDate).format('LL')}
                                                            />
                                                        </Flex.Item>
                                                        <Flex.Item >
                                                            <Input placeholder='Repeat every' type="number" onChange={(e) => this.repeatEvery(e)} value={this.state.meetingRepeat} min="1" />
                                                        </Flex.Item>
                                                    </Flex>
                                                </div>
                                                <FormDropdown
                                                    items={monthlyRepeatType}
                                                    value={this.state.monthlyRepeatTypeValue}
                                                    onChange={(event, { value }) => this.selectMonthlyRepeatType(value)}
                                                />
                                                {(this.state.monthlyRepeatTypeValue === "On Date") ? <div className="d-flex mt-3 mb-3 onDateDiv">
                                                    <Text content="On Date" className="mr-3 d-flex align-items-center" />
                                                    <Input placeholder='Date' type="number" onChange={(e) => this.onDate(e)} autoComplete="off" value={this.state.onADay} min="1" max="31" />
                                                </div> :
                                                    <Flex gap="gap.small" className='mb-3 mt-3'>
                                                        <Flex.Item >
                                                            <FormDropdown
                                                                items={weekType}
                                                                value={this.state.onTheWeek}
                                                                placeholder="Week"
                                                                className="createMeetingTimePicker"
                                                                onChange={(event, { value }) => this.selectOnTheWeek(value)}
                                                            />
                                                        </Flex.Item>

                                                        <Flex.Item >
                                                            <FormDropdown
                                                                items={week}
                                                                placeholder="Day of the week"
                                                                value={this.state.onTheWeekDay}
                                                                className="createMeetingTimePicker"
                                                                onChange={(event, { value }) => this.selectOnTheWeekDay(value)}
                                                            />
                                                        </Flex.Item>
                                                    </Flex>}
                                            </div> : (this.state.MeetingRepeatDetails === "Yearly") && <div>
                                                <div className='d-flex justify-content-start mb-3 divgap mt-3'>
                                                    <Flex gap="gap.small">
                                                        <Flex.Item >
                                                            <Datepicker
                                                                inputOnly
                                                                className="createMeetingDate"
                                                                disabled
                                                                inputPlaceholder={moment(this.state.startDate).format('LL')}
                                                            />
                                                        </Flex.Item>

                                                        <Flex.Item >
                                                            <Datepicker
                                                                inputOnly
                                                                className="createMeetingDate"
                                                                onDateChange={(e, v) => this.eventEndDate(e, v)}
                                                                minDate={new Date(this.state.startDate)}
                                                                inputPlaceholder={moment(this.state.dailyEventEndDate).format('LL')}
                                                            />
                                                        </Flex.Item>
                                                        <Flex.Item >
                                                            <Input placeholder='Repeat every' type="number" onChange={(e) => this.repeatEvery(e)} value={this.state.meetingRepeat} min="1" />
                                                        </Flex.Item>
                                                    </Flex>
                                                </div>
                                                <FormDropdown
                                                    items={monthlyRepeatType}
                                                    value={this.state.monthlyRepeatTypeValue}
                                                    onChange={(event, { value }) => this.selectMonthlyRepeatType(value)}
                                                />
                                                {(this.state.monthlyRepeatTypeValue === "On Date") ? <div className="d-flex mt-3 mb-3">
                                                    <Text content="On Date" className="mr-3 d-flex align-items-center" />
                                                    <FormDropdown
                                                        items={month}
                                                        value={this.state.monthName}
                                                        placeholder="Month"
                                                        className="createMeetingTimePicker mr-3"
                                                        onChange={(event, { value }) => this.selectOnTheMonth(value)}
                                                    />
                                                    <Input placeholder='On Date' type="number" onChange={(e) => this.onDate(e)} autoComplete="off" value={this.state.onADay} min="1" max="31" />
                                                </div> :
                                                    <Flex gap="gap.small" className='mb-3 mt-3'>
                                                        <Flex.Item >
                                                            <FormDropdown
                                                                items={weekType}
                                                                value={this.state.onTheWeek}
                                                                placeholder="Week"
                                                                className="createMeetingTimePicker"
                                                                onChange={(event, { value }) => this.selectOnTheWeek(value)}
                                                            />
                                                        </Flex.Item>

                                                        <Flex.Item >
                                                            <FormDropdown
                                                                items={week}
                                                                placeholder="Day of the week"
                                                                value={this.state.onTheWeekDay}
                                                                className="createMeetingTimePicker"
                                                                onChange={(event, { value }) => this.selectOnTheWeekDay(value)}
                                                            />
                                                        </Flex.Item>
                                                        <Flex.Item >
                                                            <FormDropdown
                                                                items={month}
                                                                value={this.state.monthName}
                                                                placeholder="Month"
                                                                className="createMeetingTimePicker"
                                                                onChange={(event, { value }) => this.selectOnTheMonth(value)}
                                                            />
                                                        </Flex.Item>
                                                    </Flex>}
                                            </div>}
                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                {/* <Tooltip trigger={<Channel20Regular />} content="Add channel" /> */}
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid value={this.state.roomName} autoComplete="off"
                                                        placeholder="Add Location" onChange={(e) => this.locationSearch(e)} />
                                                    {(this.state.room) && <div className='searchList'>{!this.state.roomLoading ? <div>
                                                        {this.state.roomData && (this.state.roomData.length > 0) ? this.state.roomData.map((ele: any, i: any) =>
                                                            <div key={i} className="displayFlex searchBox mt-2" onClick={() => this.selectRoomFunction(ele)}>
                                                                <Text className="searchResultListEmployeeName"> {ele.displayName} </Text>
                                                            </div>
                                                        ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}
                                                    </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                                                    </div>
                                                    }
                                                </div>

                                            </div>
                                            {this.state.roomError && <Text content={this.state.roomError} error size="small" className='mt-1' />}
                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                {/* <Tooltip trigger={<Channel20Regular />} content="Add channel" /> */}
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid value={this.state.anchorName} autoComplete="off"
                                                        placeholder={(this.state.meetingType !== "Other") ? "Anchor*" : "Anchor"} onChange={(e) => this.anchorSearch(e)} />
                                                    {(this.state.anchor) && <div className='searchList'>{!this.state.participantLoading ? <div>
                                                        {this.state.anchorData && (this.state.anchorData.length > 0) ? this.state.anchorData.map((ele: any, i: any) =>
                                                            <div key={i} className="displayFlex searchBox mt-2" onClick={() => this.selectAnchorFunction(ele)}>
                                                                <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                                                {/* <div className='searchResultList'>
                                                                    <Text className="searchResultListEmployeeName"> {ele.name} </Text>
                                                                    <Text size="small"> {ele.email} </Text>
                                                                </div> */}
                                                            </div>
                                                        ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}
                                                    </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                                                    </div>
                                                    }
                                                </div>
                                            </div>

                     {/* ---------------------------------co anchor input start------------------------- */}

                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid autoComplete="off" 
                                                    value={this.state.coAnchors} 
                                                    required
                                                        placeholder="Co Anchors"
                                                         onChange={(e) => this.coAnchorSearch(e)} />
                                                    {(this.state.coAnchors) 
                                                    && 
                                                    <div className='searchList'>
                                                        {!this.state.participantLoading ? 
                                                        <div>
                                                        {this.state.coAnchorsData && 
                                                        (this.state.coAnchorsData.length > 0) ? this.state.coAnchorsData.map((ele: any, i: any) =>
                                                            <div key={i} className="displayFlex searchBox mt-2" 
                                                            onClick={() => this.selectParticipantsFunction(ele, "CoAnchors")}
                                                            >
                                                                <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                                                
                                                            </div>
                                                        ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}

                                                    </div> 
                                                    : <div className='searchResultList'>< Loader size="smaller" /></div>}
                                                    </div>
                                                    }
                                                </div>
                                            </div>

                    {/* ---------------------------------co anchor input end------------------------- */}


                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                {/* <Tooltip trigger={<Location20Regular />} content="Add location" /> */}
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid autoComplete="off" value={this.state.keyParticipants} required
                                                        placeholder={(this.state.meetingType !== "Other") ? "Key Participants*" : "Key Participants"} onChange={(e) => this.keyParticipantsSearch(e)} />
                                                    {(this.state.keyParticipants) && <div className='searchList'>{!this.state.participantLoading ? <div>
                                                        {this.state.keyParticipantsData && (this.state.keyParticipantsData.length > 0) ? this.state.keyParticipantsData.map((ele: any, i: any) =>
                                                            <div key={i} className="displayFlex searchBox mt-2" onClick={() => this.selectParticipantsFunction(ele, "Key Participants")}>
                                                                <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                                                {/* <div className='searchResultList'>
                                                                    <Text className="searchResultListEmployeeName"> {ele.name} </Text>
                                                                    <Text size="small"> {ele.email} </Text>
                                                                </div> */}
                                                            </div>
                                                        ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}

                                                    </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                {/* <Tooltip trigger={<Location20Regular />} content="Add location" /> */}
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid autoComplete="off" value={this.state.participants} required
                                                        placeholder={(this.state.meetingType !== "Other") ? "Participants" : "Participants*"} onChange={(e) => this.participantsSearch(e)} />
                                                    {(this.state.participants) && <div className='searchList'>{!this.state.participantLoading ? <div>
                                                        {this.state.participantsData && (this.state.participantsData.length > 0) ? this.state.participantsData.map((ele: any, i: any) =>
                                                            <div key={i} className="displayFlex searchBox mt-2" onClick={() => this.selectParticipantsFunction(ele, "Participants")}>
                                                                <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                                                {/* <div className='searchResultList'>
                                                                    <Text className="searchResultListEmployeeName"> {ele.name} </Text>
                                                                    <Text size="small"> {ele.email} </Text>
                                                                </div> */}
                                                            </div>
                                                        ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}

                                                    </div> : <div className='searchResultList'>< Loader size="smaller" /></div>}
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                {/* <Tooltip trigger={<Location20Regular />} content="Add location" /> */}
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid autoComplete="off" required error={this.state.invalidExternalParticipants} value={this.state.externalParticipants}
                                                        placeholder="External" onChange={(e) => this.externalParticipants(e)} />
                                                    {(this.state.externalParticipantsList.length > 0) && <div className='searchList'>
                                                        {this.state.externalParticipantsList.map((ele: any, i: any) => {
                                                            if (i + 1 === this.state.externalParticipantsList.length) {
                                                                return <div key={i} className="displayFlex searchBox" onClick={() => this.selectParticipantsFunction(ele, "External")}>
                                                                    <Text size="medium">Invite {ele.mail} </Text>
                                                                </div>
                                                            }
                                                        }

                                                        )}

                                                    </div>
                                                    }
                                                </div>
                                            </div>

                                            {/*------------------------ group input-------------------------------- */}
                                            
                                            <div className='d-flex justify-content-start align-items-center mb-3'>
                                                <div style={{ marginTop: "2px", width: '100%' }}>
                                                    <Input fluid autoComplete="off" 
                                                    value={this.state.groups} 
                                                    required
                                                        placeholder="Group"
                                                         onChange={(e) => this.groupSearch(e)} 
                                                        />
                                                    {(this.state.groups) 
                                                    && 
                                                    <div className='searchList'>
                                                        {!this.state.participantLoading ? 
                                                         <div>
                                                        {this.state.groupsData && 
                                                        (this.state.groupsData.length > 0) ? this.state.groupsData.map((ele: any, i: any) =>
                                                            <div key={i} className="displayFlex searchBox mt-2" 
                                                            onClick={() => this.selectGroups(ele)}
                                                            >
                                                                <Persona text={ele.displayName} secondaryText={ele.mail} size={PersonaSize.size40} />
                                                                
                                                            </div>
                                                        ) : <div className='searchResultList'><Text className="searchResultListEmployeeName">No Data Found</Text></div>}

                                                    </div>  
                                                     : <div className='searchResultList'>< Loader size="smaller" /></div>}
                                                    </div>
                                                    } 
                                                </div>
                                            </div>

                                            {/*------------------------- group input end------------------------------- */}

                                            <div onClick={() => { this.suggestedTime() }} className="pointer">
                                                <Text className='ms-2' content="Check availability" size="small" color="orange" />
                                                {(this.state.availability) && <div className="mb-3"><Flex gap="gap.small" className='mt-3'>
                                                    <Flex.Item >
                                                        <Datepicker
                                                            inputOnly
                                                            className="createMeetingDate"
                                                            onDateChange={(e, v) => this.suggestedSelectDate(e, v)}
                                                            minDate={new Date(this.state.startDate)}
                                                            inputPlaceholder={moment(this.state.schedulingStartDate).format('LL')}
                                                        />
                                                    </Flex.Item>

                                                    <Flex.Item >
                                                        <Button content={"Search"} id="saveBtn" onClick={() => this.suggestedTimeFunction()} primary />
                                                    </Flex.Item>
                                                </Flex>
                                                    <Text content="Displaying available suggested slots for the selected date and next 9 days" size="small" />
                                                </div>
                                                }
                                                {this.state.suggestedTimeSlot && this.state.suggestedTimeSlot.map((e: any) => {
                                                    return <div className="d-flex pointer" onClick={() => this.selectSuggestedTime(e)}>
                                                        <Text className='mb-1 p-0 mr-3' color="blue" content={moment(e.startDateTime).format('LL')} />
                                                        <Text className='mb-1 p-0' color="blue" content={moment(e.startDateTime).format('LT')} />-<Text className='mb-1 p-0' color="blue" content={moment(e.endDateTime).format('LT')} />
                                                    </div>
                                                })

                                                }
                                            </div>
                                        </div>

                                    </FlexItem>
                                    <FlexItem size="size.half">
                                        <div className="pl-5 pr-5 pt-0">
                                            <div className="d-flex justify-content-center mb-3"> {this.state.roomId && <div style={{ marginTop: "0px" }} className="showSelectedEmployeeDiv">
                                                <Text content="Location" size="large" weight="bold" className="mb-3" />
                                                <div className="d-flex flex-column">
                                                    <Text content={this.state.roomName} size="medium" />
                                                    <Text content={this.state.roomAvailability} size="small" />
                                                </div>
                                            </div>
                                            }
                                            </div>
                                            {this.state.participantsList && <div className='d-flex justify-content-center'>
                                                {this.state.participantsList.length > 0 && <div style={{ marginTop: "0px" }} className="showSelectedEmployeeDiv">

                                                    {/* co anchor */}
                                                    {this.state.participantsList.filter((e: any) => e.participantType === "CoAnchors").length > 0 && <div>
                                                        <Text content="Co Anchors" size="large" weight="bold" className="mb-3" />
                                                        {this.state.participantsList.filter((e: any) => e.participantType === "CoAnchors").map((e: any, i: any) => {
                                                            return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                                            
                                                                    <Persona text={e.participantName} secondaryText={e.participantEmail} size={PersonaSize.size40} />
                                                                    <div className="pointer backButtonMessagingExtention" onClick={() => this.cancelEmployee(e)}>
                                                                        <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                                    </div>

                                                                </Flex>

                                                            </Flex>
                                                        })}

                                                    </div>}
                                                    {/* co anchor */}

                                                    {this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").length > 0 && <div>
                                                        <Text content="Key Participants" size="large" weight="bold" className="mb-3" />
                                                        {this.state.participantsList.filter((e: any) => e.participantType === "Key Participants").map((e: any, i: any) => {
                                                            return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                                                    <Persona text={e.participantName} secondaryText={e.participantEmail} size={PersonaSize.size40} />
                                                                    <div className="pointer backButtonMessagingExtention" onClick={() => this.cancelEmployee(e)}>
                                                                        <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                                    </div>

                                                                </Flex>

                                                            </Flex>
                                                        })}

                                                    </div>}
                                                    {this.state.participantsList.filter((e: any) => e.participantType === "Participants").length > 0 && <div>
                                                        <Text content="Participants" size="large" weight="bold" className="mb-3" />
                                                        {this.state.participantsList.filter((e: any) => e.participantType === "Participants").map((e: any, i: any) => {
                                                            return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                                                    <Persona text={e.participantName} secondaryText={e.participantEmail} size={PersonaSize.size40} />
                                                                    <div className="pointer backButtonMessagingExtention" onClick={() => this.cancelEmployee(e)}>
                                                                        <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                                    </div>

                                                                </Flex>

                                                            </Flex>
                                                        })}

                                                    </div>}
                                                    {this.state.participantsList.filter((e: any) => e.participantType === "External").length > 0 && <div>
                                                        <Text content="External Participants" size="large" weight="bold" className="mb-3" />
                                                        {this.state.participantsList.filter((e: any) => e.participantType === "External").map((e: any, i: any) => {
                                                            return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                                                    <Text size="medium">{e.participantEmail}</Text>
                                                                    <div className="pointer backButtonMessagingExtention" onClick={() => this.cancelEmployee(e)}>
                                                                        <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                                    </div>

                                                                </Flex>

                                                            </Flex>
                                                        })}

                                                    </div>}



                                                </div>}
                                            </div>}

                                            {/* groups----------------------------- */}
                                            

                                            {
                                                this.state.selectedGroupsData && <div className='d-flex justify-content-center'>
                                                {this.state.selectedGroupsData.length > 0 && <div style={{ marginTop: "0px" }} className="showSelectedEmployeeDiv">
                                                    
                                                {this.state.selectedGroupsData && <div>
                                                        <Text content="Groups" size="large" weight="bold" className="mb-3" />
                                                        {this.state.selectedGroupsData && this.state.selectedGroupsData.map((e: any, i: any) => {
                                                            return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                                                <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >
                                                                    <Persona text={e.groupName} secondaryText={e.groupMail} size={PersonaSize.size40} />
                                                                    <div className="pointer backButtonMessagingExtention" onClick={() => this.cancelGroup(e)}>
                                                                        <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                                                    </div>

                                                                </Flex>

                                                            </Flex>
                                                        })}

                                                    </div>}
                                                </div>}
                                                </div>
                                            }
                                            {/* group---------------- */}
                                        </div>
                                    </FlexItem>

                                </Flex>
                                <Text content="All the * fields are mandatory" size="small" className='ml-5' />
                                <Flex className="m-3 mt-0" vAlign="end" hAlign="end">

                                    <Button content="Back" onClick={() => this.setState({ pages: "General Info" })} secondary />
                                    <Flex className="buttonContainer ml-3">
                                        <Button content={!this.state.createMeetingLoading ? (!this.state.edit ? "Create Meeting" : "Update Meeting") : <Loader size="smaller" />} id="saveBtn" onClick={() => this.meetingCreate()} disabled={this.buttonDisable()} primary />
                                    </Flex>
                                </Flex>


                            </Flex>

                        </div>}
                </div>
                }

            </div>


        );
    }
}


export default CreateMeeting;