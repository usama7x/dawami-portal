const dashboardData =
{
    "checkedInCount": 10,
    "unCheckedInCount": 20,
    "checkedInUsers": [
        {
            "userId": 1,
            "userName": "Shradha Kapoor",
            "image": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Shraddha_Kapoor_at_Badlapur_success_bash.jpg",
            "checkInTime": "2020-12-29T03:35:55.771Z"
        },
        {
            "userId": 2,
            "userName": "James Bond",
            "image": "https://upload.wikimedia.org/wikipedia/en/c/c5/Fleming007impression.jpg",
            "checkInTime": "2020-12-29T03:35:55.771Z"
        }
    ],
    "unCheckedInUsers": [
        {
            "userId": 2,
            "userName": "Ranbir Kapoor",
            "image": "https://upload.wikimedia.org/wikipedia/commons/9/94/Ranbir_Kapoor_promoting_Barfi%21_at_Cafe_Coffee_Day.jpg",
            "checkInTime": "2020-12-29T03:35:55.771Z"
        },
        {
            "userId": 2,
            "userName": "Emma",
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Emma_Watson_interview_in_2017.jpg",
            "checkInTime": "2020-12-29T03:35:55.771Z"
        }
    ]
};

const loginData = {
    "adminUserId": 0,
    "userName": "Bhasker",
    "orgId": 0
};

const companyProfileData = {
    "orgId": 1,
    "name": "google",
    "logoImage": "http://t2.gstatic.com/images?q=tbn:ANd9GcRoKow6mE2XwJNhWSICMz9DIa6ZoIRKnChmSsZuIL2RhKLKx0AD1_kH5OzGCxztQpH9A-UkyLUDoIPO139HwcU",
    "qrCode": "1234",
    "locationData": {
        "latitude": "28.613072098128775",
        "longitude": "77.22944532413078",
        "range": 10
    },
    "timeZoneId": 0,
    "adminUserId": 0,
    "userName": "abc",
    "passWord": "1234",
    "webSiteUrl": "https://www.w3schools.com/graphics/google_maps_intro.asp",
    "email": "abc@yopmail.com",
    "contactNumber": "9988332422",
    "defaultShiftId": 0,
    "languageId": 0
}
const shiftDataArr = {
    shiftData:[
        {
          "shiftId": 0,
          "shiftName": "0",
          "shiftStartTime": "2021-01-03T10:16:44.622Z",
          "shiftEndTime": "2021-01-03T10:16:44.622Z"
        },
        {
            "shiftId": 1,
            "shiftName": "1",
            "shiftStartTime": "2021-01-03T10:16:44.622Z",
            "shiftEndTime": "2021-01-03T10:16:44.622Z"
          }
      ]
}

const languageDataArr = {
    languageData: [
        {
          "languageId": 0,
          "languageName": "english",
          "languageCode": "11"
        },
        {
            "languageId": 1,
            "languageName": "japan",
            "languageCode": "22"
        }
      ]
}
const timezoneDataArr = {
    timezoneData: [
        {
          "timezoneId": 0,
          "timezoneName": "india timezone"
        },
        {
            "timezoneId": 1,
            "timezoneName": "uk timezone"
        }
      ]
}

const empReportData = [
    {
        "fullName": "aaaaa",
        "contactNumber": "9999999999",
        "code":"1234"
    },
    {
        "fullName": "bbbb",
        "contactNumber": "9999999999",
        "code":"1234"
    },
    {
        "fullName": "ccccc",
        "contactNumber": "9999999999",
        "code":"1234"
    }
]

module.exports = {
    dashboardData,
    loginData,
    companyProfileData,
    shiftDataArr,
    languageDataArr,
    timezoneDataArr,
    empReportData
}