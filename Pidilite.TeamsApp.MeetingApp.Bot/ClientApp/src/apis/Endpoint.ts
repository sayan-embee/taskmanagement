const base_URL = window.location.origin+'/api/v1.0/';  


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
    updatemeetingtitle:'UpdateMeetingTitleUsingFormData',
    deletemeetingtitle:'DeleteMeetingTitle?Id=',
    insertmeetingtitleoaap:'MeetingTitleFileUploadAPI',
    updatemeetingtitleoaap:'MeetingTitleFileUpdateAPI',

    getfileextensions:'GetFileExtensions',
    getfileextensionbyid:'GetFileExtension?id=',
    insertfileextension:'InsertFileExtension',
    updatefileextension:'UpdateFileExtension',
    deletefileextension:'DeleteFileExtension?Id=',

    getuserprofile: 'user/GetMyProfile',
    getfilteredusers: 'user/GetFilteredUsers?filter=',
    
    authenticationMetadata:'consentUrl',

    allroom:'room/GetAllRoom',
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
    updateTaskSortOrder:"task/UpdateTaskSortOrder",
    getAllDistributionListGroups:"teams/GetAllDistributionListGroups?filter=",
   
    getPersonalDashboardMeetingDetails : 'Dashboard/GetPersonalDashboardMeetingDetails',
   
    getDashboardPersonalTaskAssignToUser : 'Dashboard/GetDashboardPersonalTaskAssignToUser',
    getDashboardPersonalTaskAssignByUser : 'Dashboard/GetDashboardPersonalTaskAssignByUser',

    getDashboardPersonalTaskDetailsByMeetingID: 'Dashboard/GetDashboardPersonalTaskDetailsByMeetingID?UserEmail=',
    getDashboardDivisionHeadTaskDetailsUserWise : 'Dashboard/GetDashboardDivisionHeadTaskDetailsUserWise?UserEmail=',
    getDivisionHeadDashboardMeetingDetails : 'Dashboard/GetDivisionHeadDashboardMeetingDetails',
    getDivisionHeadDashboardTaskDetails : 'Dashboard/GetDivisionHeadDashboardTaskDetails',

    getReportingManagerDashboardMeetingDetails:'Dashboard/GetReportingManagerDashboardMeetingDetails',
    getReportingManagerDashboardTaskDetails:'Dashboard/GetReportingManagerDashboardTaskDetails',

    getPilGlobinMDChairmaDashboardMeetingDetails : 'Dashboard/GetPilGlobinMDChairmaDashboardMeetingDetails',
    getPilGlobinMDChairmaDashboardTaskDetails : 'Dashboard/GetPilGlobinMDChairmaDashboardTaskDetails',
    
    getConferanceRoomDashboardDetails:'Dashboard/GetConferanceRoomDashboardDetails',

    getMeetingFeedbackDashboardDetails:'Dashboard/GetMeetingFeedbackDashboardDetails',

    getAllReportees:'employeeMaster/GetAllReportees?userEmail=',
    getAllDivision:'employeeMaster/GetAllDivision?userEmail=',
    getEmployeeDetails:'employeeMaster/EmployeeDetails?userEmail='
    
}

export const getUrl = (key: any) => {
    return base_URL + key;
}
