const base_URL = window.location.origin+'/api/v1.0/';  
// const base_URL2 = 'https://meetpro.pilportal.com:11692/';  


export const routers = {

    getmeetingtypes:'GetMeetingTypes',
    getmeetingtypebyid:'GetMeetingType?id=',
    insertmeetingtype:'InsertMeetingType',
    updatemeetingtype:'UpdateMeetingType',
    deletemeetingtype:'DeleteMeetingType?Id=',

    getdivisions:'GetDivisions',
    getdivisionbyid:'GetDivision?id=',
    insertdivision:'InsertDivision',
    updatedivision:'UpdateDivision',
    deletedivision:'DeleteDivision?Id=',

    getverticals:'GetVerticals',
    getverticalbyid:'GetVertical?id=',
    insertvertical:'InsertVertical',
    updatevertical:'UpdateVertical',
    deletevertical:'DeleteVertical?Id=',

    getmeetingtitles:'GetMeetingTitles',
    getmeetingtitlebyid:'GetMeetingTitle?id=',
    insertmeetingtitle:'InsertMeetingTitle',
    insertmeetingtitleusingformdata:'InsertMeetingTitleUsingFormData',
    // updatemeetingtitle:'UpdateMeetingTitle',
    updatemeetingtitle:'UpdateMeetingTitleUsingFormData',
    deletemeetingtitle:'DeleteMeetingTitle?Id=',

    getfileextensions:'GetFileExtensions',
    getfileextensionbyid:'GetFileExtension?id=',
    insertfileextension:'InsertFileExtension',
    updatefileextension:'UpdateFileExtension',
    deletefileextension:'DeleteFileExtension?Id=',

    getuserprofile: 'user/GetMyProfile',
    getfilteredusers: 'user/GetFilteredUsers?filter=',
    
    authenticationMetadata:'consentUrl',

    room:'room/GetAllRoom?filter=',
    roomSchedule:'room/GetRoomSchedule',

    getallmeetingdetails: 'event/GetAllMeetingDetails',
    getmeetingdetailsbyid: 'event/GetMeetingDetails?id=',
    cancelMeeting:'event/CancelMeeting',
    findMeetingTimes:'event/FindMeetingTimes',

    getAllTeams:"teams/GetAllTeams?UserADID=",
    gettimezone:'GetTimeZone',
    createmeeting:'event/CreateMeeting',
    createmeetingFile:'event/CreateMeeting1',
    updatemeeting:'event/UpdateMeeting1',
    getallmeetingparticipant:'event/GetAllMeetingParticipant?id=',
    createtask:'task/CreateTask',
    getallprevtaskdetails:'task/GetAllPrevTaskDetails',
    uploadmeetingfiles:'event/UploadMeetingFiles?MeetingId=',
    deletemeetingfile:'event/DeleteMeetingFiles?MeetingId=',
    getalltaskdetails:'task/GetAllTaskDetails',
    gettaskdetailsbyid:'task/GetTaskDetailsById?id=',
    reassigntask:'task/ReassignTask',
    updateTask:'task/UpdateTask',
    //
    // getPersonalDashboardMeetingDetails : 'Dashboard/GetPersonalDashboardMeetingDetails?UserEmail=',
    getPersonalDashboardMeetingDetails : 'Dashboard/GetPersonalDashboardMeetingDetails',
    // getDashboardPersonalTaskAssignToUser : 'Dashboard/GetDashboardPersonalTaskAssignToUser?UserEmail=',
    // getDashboardPersonalTaskAssignByUser : 'Dashboard/GetDashboardPersonalTaskAssignByUser?UserEmail=',
    getDashboardPersonalTaskAssignToUser : 'Dashboard/GetDashboardPersonalTaskAssignToUser',
    getDashboardPersonalTaskAssignByUser : 'Dashboard/GetDashboardPersonalTaskAssignByUser',

    getDashboardPersonalTaskDetailsByMeetingID: 'Dashboard/GetDashboardPersonalTaskDetailsByMeetingID?UserEmail=',
    getDashboardDivisionHeadTaskDetailsUserWise : 'Dashboard/GetDashboardDivisionHeadTaskDetailsUserWise?UserEmail=',
    // getDivisionHeadDashboardTaskDetails : 'Dashboard/GetDivisionHeadDashboardTaskDetails?DivisionName=',
    getDivisionHeadDashboardMeetingDetails : 'Dashboard/GetDivisionHeadDashboardMeetingDetails',
    getDivisionHeadDashboardTaskDetails : 'Dashboard/GetDivisionHeadDashboardTaskDetails',

    // getReportingManagerDashboardMeetingDetails:'Dashboard/GetReportingManagerDashboardMeetingDetails?UserADID=',
    // getReportingManagerDashboardTaskDetails:'Dashboard/GetReportingManagerDashboardTaskDetails?UserADID=',
    getReportingManagerDashboardMeetingDetails:'Dashboard/GetReportingManagerDashboardMeetingDetails',
    getReportingManagerDashboardTaskDetails:'Dashboard/GetReportingManagerDashboardTaskDetails',

    // getPilGlobinMDChairmaDashboardMeetingDetails : 'Dashboard/GetPilGlobinMDChairmaDashboardMeetingDetails?DivisionName=',
    // getPilGlobinMDChairmaDashboardTaskDetails : 'Dashboard/GetPilGlobinMDChairmaDashboardTaskDetails?DivisionName=',
    getPilGlobinMDChairmaDashboardMeetingDetails : 'Dashboard/GetPilGlobinMDChairmaDashboardMeetingDetails',
    getPilGlobinMDChairmaDashboardTaskDetails : 'Dashboard/GetPilGlobinMDChairmaDashboardTaskDetails',
    
    // getConferanceRoomDashboardDetails:'Dashboard/GetConferanceRoomDashboardDetails?LocationId=',
    getConferanceRoomDashboardDetails:'Dashboard/GetConferanceRoomDashboardDetails',

    // getMeetingFeedbackDashboardDetails:'Dashboard/GetMeetingFeedbackDashboardDetails?DivisionName=',
    getMeetingFeedbackDashboardDetails:'Dashboard/GetMeetingFeedbackDashboardDetails',
    //

    //////////dummy API////////////
    getMyReporteesTest:'Dashboard/GetMyReporteesTest?emailId=',
    getDivisionsTest:'Dashboard/GetDivisionsTest?emailId=',
    getProfileTest:'Dashboard/GetProfileTest?emailId=',
    // getMyReporteesTest:'api/EmployeeMaster/GetMyReportees?emailId=',
    // getDivisionsTest:'api/EmployeeMaster/GetDivisions?emailId=',
    // getProfileTest:'api/EmployeeMaster/GetProfile?emailId=',
    //////////////////////////////

    //-------priority
    updateTaskSortOrder:"task/UpdateTaskSortOrder",

    //-----------group
    getAllDistributionListGroups:"teams/GetAllDistributionListGroups?filter="
}

export const getUrl = (key: any) => {
    return base_URL + key;
}
// export const getUrl2 = (key: any) => {
//     return base_URL2 + key;
// }