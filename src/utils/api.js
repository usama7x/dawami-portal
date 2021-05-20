
import axios from 'axios';
import { appCache } from "../utils/Common";
const headers = {
    "X-Api-Key": "1898337cba4c4bf99f68fe9978d4ba9c",
}
const host = "http://emp-attendance-api.azurewebsites.net";
const url = {
    dashboard: "/api/Attendance/dashboard-list",
    profile: "/api/User/profile",
    companyProfile: "/api/Organization/org-profile",
    file: "/api/File/get-file",
    timeZone: "/api/Organization/all-timezones",
    shiftData: "/api/WorkShift/org-shift",
    languageList: "/api/Language/GetLanguageList",
    changePassword: "/api/User/change-password",
    fileUpload: "/api/File/upload-file",
    upadteCompanyProfile: "/api/Organization/update-org",
    addShift: "/api/WorkShift/add-shifts",
    deleteShift: "/api/WorkShift/remove-shift",
    editShift: "/api/WorkShift/update-shift",
    getEmpUrl: "/api/User/org-users",
    getEmpReport: "/api/User/get-org-employee-excel",
    getAttendanceUrl: "/api/Attendance/user-attendance",
    addAttendanceUrl: "/api/Attendance/admin/add-attendance",
    deleteAttendanceUrl: "/api/Attendance/admin/delete-attendance",
    editAttendanceUrl: "/api/Attendance/admin/edit-attendance",
    deleteEmployeeUrl: "/api/User/update-user-status",
    orgUserAttendance: "/api/Attendance/org-user-attendance",
    getReportAttendance: "/api/Attendance/org-user-attendance-excel",
    userAttendanceExcelUlr: "/api/Attendance/user-attendance-excel",
    orgUsersSalaryUrl:"/api/Attendance/org-users-salary",
    orgUsersSalaryExcelUlr:"/api/Attendance/org-users-salary-excel"
}



const getFullUrl = name => {
    return host + url[name];
}

export const getEmployees = async empId => {
    const result = await axios.get(
        getFullUrl("profile"),
        {
            params: {
                empId: empId
            },
            headers: headers
        }
    );
    return result;
}

export const getDashboardData = async orgId => {
    const result = await axios.get(
        getFullUrl("dashboard"),
        {
            params: {
                orgId: appCache('orgId')
            },
            headers: headers
        }
    );
    return result;
}
export const getCompanyData = async () => {
    const result = await axios.get(
        getFullUrl("companyProfile"),
        {
            params: {
                orgId: appCache('orgId')
            },
            headers: headers
        }
    );
    return result;
}

export const getImage = async filename => {
    const result = await axios.get(
        getFullUrl("file"),
        {
            params: {
                filename: filename
            },
            headers: headers,
            responseType: 'arraybuffer'
        }
    ).then(res => {
        var b64Response = Buffer.from(res.data, 'binary').toString('base64');
        var dataUrl = `data:${res.headers['content-type']};base64,${b64Response}`;
        return dataUrl;
    });
    return result;
}

export const getAllTimeZoneData = async () => {
    const result = await axios.get(
        getFullUrl("timeZone"),
        {
            headers: headers
        }
    );
    return result;
}

export const getShiftData = async () => {
    const result = await axios.get(
        getFullUrl('shiftData'),
        {
            params: {
                orgId: appCache('orgId')
            },
            headers: headers
        }
    );
    return result;
}

export const getLanguageData = async () => {
    const result = await axios.get(
        getFullUrl('languageList'),
        {
            headers: headers
        }
    );
    return result;
}

export const updatePassordApi = async password => {
    const result = await axios.post(
        getFullUrl("changePassword"),
        null,
        {
            headers: headers,
            params: {
                adminId: parseInt(appCache("adminUserId")),
                password: password
            }
        }
    );
    return result;
}

export const uploadFile = async file => {
    const result = await axios.post(
        getFullUrl("fileUpload"),
        file,
        {
            headers: headers,

        }
    );
    return result;
}

export const updateCompanyProfileApi = async data => {
    const result = await axios.post(
        getFullUrl("upadteCompanyProfile"),
        data,
        {
            headers: headers
        }
    );
    return result;
}

export const addNewShiftApi = async data => {
    const result = await axios.post(
        getFullUrl("addShift"),
        data,
        {
            headers: headers
        }
    );
    return result;
}

export const deleteShiftApi = async id => {
    const result = await axios.delete(
        getFullUrl("deleteShift"), {
        headers: headers,
        params: {
            shiftId: id
        }
    });
    return result;
}

export const editShiftApi = async data => {
    const result = await axios.post(
        getFullUrl("editShift"),
        data,
        {
            headers: headers
        }
    );
    return result;
}

export const getEmployeeList = async data => {
    let params = {
        orgId: appCache('orgId')
    };
    if(data) {
        params.userName = data;
    }
    const result = await axios.get(
        getFullUrl('getEmpUrl'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const getEmployeeReportApi = async () => {
    let params = {
        orgId: appCache('orgId')
    };
    const result = await axios.get(
        getFullUrl('getEmpReport'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const getFile = async filename => {
    const result = await axios.get(
        getFullUrl("file"),
        {
            params: {
                filename: filename
            },
            headers: headers,
            responseType: 'arraybuffer'
        }
    ).then(res => {
        var b64Response = Buffer.from(res.data, 'binary').toString('base64');
        var dataUrl = `data:${res.headers['content-type']};base64,${b64Response}`;
        return dataUrl;
    });
    return result;
}

export const getAttendanceApi = async (params) => {
    const result = await axios.get(
        getFullUrl('getAttendanceUrl'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const addAttendanceApi = async (data) => {
    let params = data;
    params.adminUserId = parseInt(appCache("adminUserId"));
    const result = await axios.post(
        getFullUrl('addAttendanceUrl'),
        params,
        {
            headers: headers
        }
    );
    return result;
}

export const deleteAttendanceApi = async attendanceId => {
    let params = {attendanceId};
    const result = await axios.delete(
        getFullUrl('deleteAttendanceUrl'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const editAttendanceApi = async (attendanceId, data) => {
    let params = {attendanceId};
    data.adminUserId = parseInt(appCache("adminUserId"));

    const result = await axios.post(
        getFullUrl('editAttendanceUrl'),
        data,
        {
            headers: headers,
            params
        }
    );
    return result;
}

export const deleteEmployeeApi = async id => {
    const result = await axios.post(
        getFullUrl("deleteEmployeeUrl"), null,{
        headers: headers,
        params: {
            userId: id,
            isActive: false
        }
    });
    return result;
}

export const getOrgUserAttendanceApi = async (startDate, endDate) => {
    let params = {
        startDate,
        endDate,
        orgId: appCache('orgId')
    }
    const result = await axios.get(
        getFullUrl('orgUserAttendance'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const getAttendanceReportApi = async (startDate, endDate) => {
    let params = {
        orgId: appCache('orgId'),
        startDate, 
        endDate
    };
    const result = await axios.get(
        getFullUrl('getReportAttendance'),
        {
            params,
            headers: headers
        }
    );
    return result;
}
export const getUserAttendanceExcelApi = async (userId, startDate, endDate) => {
    let params = {
        userId, 
        startDate, 
        endDate
    };
    const result = await axios.get(
        getFullUrl('userAttendanceExcelUlr'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const getOrgUsersSalaryApi = async (startDate, endDate) => {
    let params = {
        orgId: appCache('orgId'),
        startDate, 
        endDate
    };
    const result = await axios.get(
        getFullUrl('orgUsersSalaryUrl'),
        {
            params,
            headers: headers
        }
    );
    return result;
}

export const getOrgUsersSalaryExcelApi = async (startDate, endDate) => {
    let params = {
        orgId: appCache('orgId'),
        startDate, 
        endDate
    };
    const result = await axios.get(
        getFullUrl('orgUsersSalaryExcelUlr'),
        {
            params,
            headers: headers
        }
    );
    return result;
}