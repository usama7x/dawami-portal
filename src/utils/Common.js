import { getAllTimeZoneData, getShiftData, getLanguageData } from "../utils/api";

// return the user data from the session storage
export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return localStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userData', JSON.stringify(userData));
}

//app Cache
export const setAppCache = (key, val) => {
  localStorage.setItem(key, val);
}

export const appCache = (key) => {
  const data = localStorage.getItem(key);
  if (data) return data;
  else return null;
}

export const shiftDataCommon = async (refresh = false) => {
  let shiftData = [];
  if (appCache("shiftData") && !refresh ) {
    shiftData = JSON.parse(appCache("shiftData"));
  } else {
    await getShiftData().then(res => {
      localStorage.setItem('shiftData', JSON.stringify(res.data));
      shiftData = res.data;
      // console.log(list); 
    }).catch((err) => { }).then(res => {
      // show error message
    });
  }
  return shiftData;
}

export const timeZoneList = async () => {
  let timeZoneList = [];
  if (appCache("timeZoneList")) {
    timeZoneList = JSON.parse(appCache("timeZoneList"));
  } else {
    await getAllTimeZoneData().then(res => {
      localStorage.setItem('timeZoneList', JSON.stringify(res.data));
      timeZoneList = res.data;
      // console.log(list); 
    }).catch((err) => { }).then(res => {
      // show error message
    });
  }
  return timeZoneList;
}

export const languageList = async () => {
  let languageList = [];
  if (appCache("languageList")) {
    languageList = JSON.parse(appCache("languageList"));
  } else {
    await getLanguageData().then(res => {
      localStorage.setItem('languageList', JSON.stringify(res.data));
      languageList = res.data;
      // console.log(list); 
    }).catch((err) => { }).then(res => {
      // show error message
    });
  }
  return languageList;
}