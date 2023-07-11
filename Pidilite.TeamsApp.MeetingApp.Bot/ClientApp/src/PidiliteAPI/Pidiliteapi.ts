import axios from 'axios';

export const GetMyReporteesTest = async (emailId:any) => {
    return await axios.get("https://meetpro.pilportal.com:11692/api/EmployeeMaster/GetMyReportees?emailId="+emailId);
}

export const GetDivisionsTest = async (emailId:any) => {
    return await axios.get("https://meetpro.pilportal.com:11692/api/EmployeeMaster/GetDivisions?emailId="+emailId);
}

export const GetProfileTest = async (emailId:any) => {
    return await axios.get("https://meetpro.pilportal.com:11692/api/EmployeeMaster/GetProfile?emailId="+emailId, {headers: {"Authorization" : null}});
}