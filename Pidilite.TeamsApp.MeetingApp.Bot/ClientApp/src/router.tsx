import AdminInitial from './admin/adminInitial'

import AdminPage from './admin/pages/adminPage'

import AddMeetingType from './admin/components/Meeting Type/addMeetingType'
import EditMeetingType from './admin/components/Meeting Type/editMeetingType'

import AddExtension from './admin/components/Extension/addExtension'
import EditFileExtension from './admin/components/Extension/editExtension'

import AddDivision from './admin/components/Division/addDivision'
import EditDivision from './admin/components/Division/editDivision'

import AddVertical from './admin/components/Verticals/addVertical'
import EditVertical from './admin/components/Verticals/editVertical'

import AddMeetingTitle from './admin/components/Title/addTitle'
import TitleView from './admin/components/Title/viewTitle'
import EditMeetingTitle from './admin/components/Title/editTitle'

import SignInPage from './admin/pages/SignInPage/signInPage'
import SignInSimpleStart from './admin/pages/SignInPage/signInSimpleStart'
import SignInSimpleEnd from './admin/pages/SignInPage/signInSimpleEnd'

import ErrorPage from './admin/pages/ErrorPage/errorPage'

import MeetingDashboardPage from './meeting/Pages/meetingDashboard'
import CreateMeeting from './meeting/Components/createMeeting'

import ViewMeetingDetails from './meeting/Components/viewMeetingDetails'
import CancelMeeting from './meeting/Components/cancelMeeting'
import ViewTask from './meeting/Components/viewTask'

import CreateTask from './TaskCreate/taskCreate'
import TaskConfiguration from './TaskCreate/taskConfiguration'
import TaskDashboard from './TaskCreate/taskDashBoard'
import TaskView from './TaskCreate/taskView'

import TaskManagementDashboard from './TaskManagement/Page/taskManagementDashboard'
import ViewParticularTask from './TaskManagement/Component/viewTask'
import ReassignTask from './TaskManagement/Component/reassign'
import EditAssignTask from './TaskManagement/Component/editAssignTask'
import UpdateTask from './TaskManagement/Component/updateTask'
import Dashboards from './dashboard/Dashboards'
import OpenAndBehindPopup from './dashboardThree/Component/OpenAndBehindPopup'
import Popup from './dashboardDivisionHead/Popup'
import PopupRA from './reportingManager/PopupRA'
import PopupPill from './PilGlobinMDChairman/PopupPill'


export const Routes=[ 
    
    {path:'/adminconfiguration', component:AdminInitial},
    {path:'/adminpage', component:AdminPage},
    {path:'/addmeetingtype', component:AddMeetingType},
    {path:'/editmeetingtype', component:EditMeetingType},
    {path:'/addextension', component:AddExtension},
    {path:'/editextension', component:EditFileExtension},
    {path:'/adddivision', component:AddDivision},
    {path:'/editdivision', component:EditDivision},
    {path:'/addvertical', component:AddVertical},
    {path:'/editvertical', component:EditVertical},
    {path:'/addtitle', component:AddMeetingTitle},
    {path:'/viewtitle', component:TitleView},
    {path:'/editmeetingtitle', component:EditMeetingTitle},
    {path:'/signin', component:SignInPage},
    {path:'/signin-simple-start', component:SignInSimpleStart},
    {path:'/signin-simple-end', component:SignInSimpleEnd},
    {path:'/errorpage', component:ErrorPage},
    {path:'/meetingdashboardpage', component: MeetingDashboardPage},
    {path:'/createmeeting', component: CreateMeeting},
    {path:'/viewmeetingdetails', component: ViewMeetingDetails},
    {path:'/viewalltask', component: ViewTask},
    {path:'/cancelmeeting', component: CancelMeeting},
    {path:'/createtask', component: CreateTask},
    {path:'/taskconfiguration', component: TaskConfiguration},
    {path:'/taskdashboard', component: TaskDashboard},
    {path:'/taskview', component: TaskView},
    {path:'/taskmanagementdashboardpage', component: TaskManagementDashboard},
    {path:'/viewparticulartask', component: ViewParticularTask},
    {path:'/reassigntask', component: ReassignTask},
    {path:'/editassigntask', component: EditAssignTask},
    {path:'/updatetask', component: UpdateTask},
    {path:'/dashboards', component: Dashboards},
    {path:'/openandbehindpopuppersonal', component: OpenAndBehindPopup},
    {path:'/popup', component: Popup},
    {path:'/PopupRA', component: PopupRA},
    {path:'/popupPill', component: PopupPill},



    {path:'/', exact:true, redirectTo:'/adminPage'},
]