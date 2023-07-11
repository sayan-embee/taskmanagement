import axios from './axiosJWTDecorator';
import {getUrl, routers} from './Endpoint'



////////////////////// Meeting Type ////////////////////////////////

export const getMeetingTypesAPI = async () => {
    //console.log('In api',  getUrl(routers.getmeetingtypes))
    return await axios.get(getUrl(routers.getmeetingtypes));
}

export const getMeetingTypesByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getmeetingtypebyid)+id)
    return await axios.get(getUrl(routers.getmeetingtypebyid)+id);
}

export const insertMeetingTypeAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.insertmeetingtype),data)
    return await axios.post(getUrl(routers.insertmeetingtype),data);
}

export const updateMeetingTypeAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updatemeetingtype),data)
    return await axios.put(getUrl(routers.updatemeetingtype),data);
}

export const deleteMeetingTypesAPI = async (id:any) => {
    //console.log('In api',  getUrl(routers.deletemeetingtype)+id)
    return await axios.post(getUrl(routers.deletemeetingtype)+id);
}


///////////////////////// Division ////////////////////////////////////

export const getDivisionsAPI = async () => {
    //console.log('In api',  getUrl(routers.getdivisions))
    return await axios.get(getUrl(routers.getdivisions));
}

export const getDivisionByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getdivisionbyid)+id)
    return await axios.get(getUrl(routers.getdivisionbyid)+id);
}

export const insertDivisionAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.insertdivision),data)
    return await axios.post(getUrl(routers.insertdivision),data);
}

export const updateDivisionAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updatedivision),data)
    return await axios.put(getUrl(routers.updatedivision),data);
}

export const deleteDivisionAPI = async (id:any) => {
    //console.log('In api',  getUrl(routers.deletedivision)+id)
    return await axios.post(getUrl(routers.deletedivision)+id);
}

////////////////// Verticals /////////////////////////

export const getVerticalsAPI = async () => {
    //console.log('In api',  getUrl(routers.getverticals))
    return await axios.get(getUrl(routers.getverticals));
}

export const getVerticalsByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getverticalbyid)+id)
    return await axios.get(getUrl(routers.getverticalbyid)+id);
}

export const insertVerticalAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.insertvertical),data)
    return await axios.post(getUrl(routers.insertvertical),data);
}

export const updateVerticalAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updatevertical),data)
    return await axios.put(getUrl(routers.updatevertical),data);
}

export const deleteVerticalAPI = async (id:any) => {
    //console.log('In api',  getUrl(routers.deletevertical)+id)
    return await axios.post(getUrl(routers.deletevertical)+id);
}

///////////////////////////////// Meeting Titles //////////////////////////////

export const getmeetingtitlesAPI = async (data:any) => {
    //console.log('In api check',  getUrl(routers.getmeetingtitles),data)
    return await axios.post(getUrl(routers.getmeetingtitles),data);
}

export const getMeetingTitleByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getmeetingtitlebyid)+id)
    return await axios.get(getUrl(routers.getmeetingtitlebyid)+id);
}

export const insertMeetingTitleAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.insertmeetingtitle),data)
    return await axios.post(getUrl(routers.insertmeetingtitle),data);
}

export const InsertMeetingTitleUsingFormData = async (data?:any) => {
    //console.log('In api',  getUrl(routers.insertmeetingtitleusingformdata),data)
    return await axios.post(getUrl(routers.insertmeetingtitleusingformdata),data);
}

export const updateMeetingTitleAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updatemeetingtitle),data)
    return await axios.put(getUrl(routers.updatemeetingtitle),data);
}

export const deleteMeetingTitleAPI = async (id:any) => {
    //console.log('In api',  getUrl(routers.deletemeetingtitle)+id)
    return await axios.post(getUrl(routers.deletemeetingtitle)+id);
}

export const InsertMeetingTitleOAAPFile = async (data?:any) => {
    console.log('In api',  getUrl(routers.insertmeetingtitleoaap),data)
    return await axios.post(getUrl(routers.insertmeetingtitleoaap),data);
}

export const UpdateMeetingTitleOAAPFile = async (data?:any) => {
    console.log('In api',  getUrl(routers.updatemeetingtitleoaap),data)
    return await axios.put(getUrl(routers.updatemeetingtitleoaap),data);
}

///////////////////////////////// File extension /////////////////////////////////////////

export const getFileExtensionsAPI = async () => {
    //console.log('In api',  getUrl(routers.getfileextensions))
    return await axios.get(getUrl(routers.getfileextensions));
}

export const getFileExtensionsByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getfileextensionbyid)+id)
    return await axios.get(getUrl(routers.getfileextensionbyid)+id);
}

export const insertFileExtensionAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.insertfileextension),data)
    return await axios.post(getUrl(routers.insertfileextension),data);
}

export const updateFileExtensionAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updatefileextension),data)
    return await axios.put(getUrl(routers.updatefileextension),data);
}

export const deleteFileExtensionAPI = async (id:any) => {
    ///console.log('In api',  getUrl(routers.deletefileextension)+id)
    return await axios.post(getUrl(routers.deletefileextension)+id);
}

///////////////////////  SSO ///////////////////

export const getAuthenticationConsentMetadata = async (windowLocationOriginDomain: string, login_hint: string): Promise<any> => {
    //console.log('In api',  getUrl(routers.authenticationMetadata)+`?windowLocationOriginDomain=${windowLocationOriginDomain}&loginhint=${login_hint}`)
    return await axios.get(getUrl(routers.authenticationMetadata)+`?windowLocationOriginDomain=${windowLocationOriginDomain}&loginhint=${login_hint}`, undefined, false);
}


////////////////////// User Profile ////////////////////

export const getUserProfileAPI = async () => {
    //console.log('In api',  getUrl(routers.getuserprofile))
    return await axios.get(getUrl(routers.getuserprofile));
}

export const getFilteredUsersAPI = async (name?:any) => {
    //console.log('In api',  getUrl(routers.getfilteredusers)+name)
    return await axios.get(getUrl(routers.getfilteredusers)+name);
}


/////////////////////////////////////// Meeting Details /////////////////////////////////////////////

export const getMeetingDetailsByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getmeetingdetailsbyid)+id)
    return await axios.get(getUrl(routers.getmeetingdetailsbyid)+id);
}

export const getMeetingDetailsByParentIdAPI = async (id?:any, parentId?:any) => {
    //console.log('In api',  getUrl(routers.getmeetingdetailsbyid)+id+"&parentMeetingId="+parentId)
    return await axios.get(getUrl(routers.getmeetingdetailsbyid)+id+"&parentMeetingId="+parentId);
}

export const getAllMeetingDetailsAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.getallmeetingdetails),data)
    return await axios.post(getUrl(routers.getallmeetingdetails),data);
}

export const getTimeZoneAPI = async () => {
    //console.log('In api',  getUrl(routers.gettimezone))
    return await axios.get(getUrl(routers.gettimezone));
}

export const getAllTeamsAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.getAllTeams)+data)
    return await axios.get(getUrl(routers.getAllTeams)+data);
}

export const createMeetingAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.createmeeting),data)
    return await axios.post(getUrl(routers.createmeeting),data);
}

export const createMeetingFileAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.createmeetingFile),data)
    return await axios.post(getUrl(routers.createmeetingFile),data);
}

export const updateMeetingeAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updatemeeting),data)
    return await axios.patch(getUrl(routers.updatemeeting),data);
}

export const cancelMeetingAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.cancelMeeting),data)
    return await axios.post(getUrl(routers.cancelMeeting),data);
}

export const findMeetingTimesAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.findMeetingTimes),data)
    return await axios.post(getUrl(routers.findMeetingTimes),data);
}

export const getRoomsAPI = async (name?:any) => {
    //console.log('In api',  getUrl(routers.room)+name)
    return await axios.get(getUrl(routers.room)+name);
}

export const getAllRoomsAPI = async () => {
    //console.log('In api',  getUrl(routers.room))
    return await axios.get(getUrl(routers.room));
}

////////////////////////////////////////////////////////////////////

export const uploadMeetingFilesAPI = async (data?:any,id?:any) => {
    //console.log('In api',  getUrl(routers.uploadmeetingfiles)+id,data)
    return await axios.post(getUrl(routers.uploadmeetingfiles)+id,data);
}

export const deleteMeetingFilesAPI = async (id?:any, fileid?:any) => {
    //console.log('In api',  getUrl(routers.deletemeetingfile)+id+"&FileId="+fileid)
    return await axios.post(getUrl(routers.deletemeetingfile)+id+"&FileId="+fileid);
}



//////////////////////// Meeting Task ///////////////////////////////

export const getTaskMeetingDetailsAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.getmeetingdetailsbyid)+data.id+"&chatId="+data.chatId+"&startDate="+data.startDate)
    return await axios.get(getUrl(routers.getmeetingdetailsbyid)+data.id+"&chatId="+data.chatId+"&startDate="+data.startDate);
}

export const getAllMeetingParticipantAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.getallmeetingparticipant)+id)
    return await axios.get(getUrl(routers.getallmeetingparticipant)+id);
}

export const createTaskAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.createtask),data)
    return await axios.post(getUrl(routers.createtask),data);
}

export const getAllTaskDetailsAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.getalltaskdetails),data)
    return await axios.post(getUrl(routers.getalltaskdetails),data);
}

export const getAllPrevTaskDetailsAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.getallprevtaskdetails),data)
    return await axios.post(getUrl(routers.getallprevtaskdetails),data);
}

export const getTaskDetailsByIdAPI = async (id?:any) => {
    //console.log('In api',  getUrl(routers.gettaskdetailsbyid)+id)
    return await axios.get(getUrl(routers.gettaskdetailsbyid)+id);
}

export const reassignTaskAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.reassigntask),data)
    return await axios.post(getUrl(routers.reassigntask),data);
}

export const updateTaskAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.updateTask),data)
    return await axios.post(getUrl(routers.updateTask),data);
}

export const roomScheduleAPI = async (data?:any) => {
    //console.log('In api',  getUrl(routers.roomSchedule),data)
    return await axios.post(getUrl(routers.roomSchedule),data);
}



////////////////DashBoard //////////////////////////////

export const GetPersonalDashboardMeetingDetails = async (data?:any) => {
    return await axios.post(getUrl(routers.getPersonalDashboardMeetingDetails),data);
}

export const GetDashboardPersonalTaskAssignToUser = async (data?:any) => {
    return await axios.post(getUrl(routers.getDashboardPersonalTaskAssignToUser),data);
}

export const GetDashboardPersonalTaskAssignByUser = async (data?:any) => {
    return await axios.post(getUrl(routers.getDashboardPersonalTaskAssignByUser),data);
}


export const GetDashboardPersonalTaskDetailsByMeetingID = async (UserEmail:any,AssignedToEmail:any,MeetingTitleId:any,MeetingTypeId:any,TaskType:any,Fromdate:any,Todate:any) => {
    return await axios.get(getUrl(routers.getDashboardPersonalTaskDetailsByMeetingID)+UserEmail+"&AssignedToEmail="+AssignedToEmail+"&MeetingTitleId="+MeetingTitleId+"&MeetingTypeId="+MeetingTypeId+"&TaskType="+TaskType+"&FromDate="+Fromdate+"&ToDate="+Todate);
}


export const GetDashboardDivisionHeadTaskDetailsUserWise = async (UserEmail:any,DivisionName:any,MeetingTitle:any,MeetingTypeId:any,TaskType:any,Fromdate:any,Todate:any) => {
    return await axios.get(getUrl(routers.getDashboardDivisionHeadTaskDetailsUserWise)+UserEmail+"&DivisionName="+DivisionName+"&MeetingTitle="+MeetingTitle+"&MeetingTypeId="+MeetingTypeId+"&TaskType="+TaskType+"&FromDate="+Fromdate+"&ToDate="+Todate);
}

export const GetDivisionHeadDashboardMeetingDetails = async (data?:any) => {
    return await axios.post(getUrl(routers.getDivisionHeadDashboardMeetingDetails),data);
}

export const GetDivisionHeadDashboardTaskDetails = async (data?:any) => {
    return await axios.post(getUrl(routers.getDivisionHeadDashboardTaskDetails),data);
}

export const GetReportingManagerDashboardMeetingDetails = async (data: any) => {
    return await axios.post(getUrl(routers.getReportingManagerDashboardMeetingDetails),data);
}
export const GetReportingManagerDashboardTaskDetails = async (data: any) => {
    return await axios.post(getUrl(routers.getReportingManagerDashboardTaskDetails),data);
}


export const GetPilGlobinMDChairmaDashboardMeetingDetails = async (data: any) => {
    return await axios.post(getUrl(routers.getPilGlobinMDChairmaDashboardMeetingDetails),data);
}
export const GetPilGlobinMDChairmaDashboardTaskDetails = async (data: any) => {
    return await axios.post(getUrl(routers.getPilGlobinMDChairmaDashboardTaskDetails),data);
}

export const GetConferanceRoomDashboardDetails = async (data: any) => {
    return await axios.post(getUrl(routers.getConferanceRoomDashboardDetails),data);
}

export const GetMeetingFeedbackDashboardDetails = async (data: any) => {
    return await axios.post(getUrl(routers.getMeetingFeedbackDashboardDetails),data);
}


//---------------------priority
export const updateTaskSortOrder = async (data:any) => {
    // console.log("api", getUrl(routers.updateTaskSortOrder), data)
    return await axios.post(getUrl(routers.updateTaskSortOrder),data);
}

//---------------------group
export const getAllDistributionListGroups = async (filter?:any) => {
    return await axios.get(getUrl(routers.getAllDistributionListGroups)+filter);
}

//-------------------Employee master
export const GetMyReporteesTest = async (emailId:any) => {
    return await axios.get(getUrl(routers.getAllReportees)+emailId);
}

export const GetDivisionsTest = async (emailId:any) => {
    return await axios.get(getUrl(routers.getAllDivision)+emailId);
}

export const GetProfileTest = async (emailId:any) => {
    return await axios.get(getUrl(routers.getEmployeeDetails)+emailId);
}