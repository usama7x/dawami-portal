/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import ProfilePage from "views/Profile/Profile.js";
import EmployeesPage from "views/Employees/Employees.js";
import AdjustPage from "views/Adjust/Adjust.js";
import ReportsPage from "views/Reports/Reports.js";
import LogoutPage from "views/Logout/Logout.js"
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssessmentIcon from '@material-ui/icons/Assessment';
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: ProfilePage,
    layout: "/admin"
  },
  {
    path: "/employees",
    name: "Employees",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: EmployeesPage,
    layout: "/admin"
  },
  {
    path: "/adjust",
    name: "Adjust",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: AdjustPage,
    layout: "/admin"
  },
  {
    path: "/reports",
    name: "Reports",
    rtlName: "الرموز",
    icon: AssessmentIcon,
    component: ReportsPage,
    layout: "/admin"
  },
  {
    path: "/logout",
    name: "Logout",
    rtlName: "خرائط",
    icon: ExitToAppIcon,
    component: LogoutPage,
    layout: "/admin"
  },
];

export default dashboardRoutes;
