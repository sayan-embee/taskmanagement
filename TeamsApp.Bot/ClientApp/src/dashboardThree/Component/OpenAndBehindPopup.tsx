import React from 'react'
import { GetDashboardPersonalTaskAssignByUser, GetDashboardPersonalTaskDetailsByMeetingID, getUserProfileAPI } from '../../apis/APIList';
import * as microsoftTeams from "@microsoft/teams-js";
import moment from 'moment';
import { Loader } from '@fluentui/react-northstar';
 
interface State {
  EmailId: any;
  data:any[];
  loading?:boolean;
    
}
interface Props {  
    history?: any;
    location?: any;
  }
 
export default class OpenAndBehindPopup extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {  
            EmailId: '',
            data:[],
            loading:true,
         };
    }

    componentDidMount=()=>{
        console.log("location------------",this.props.location.search)
        const query = new URLSearchParams(this.props.location.search)
        const login = query.get('login')
        const assigned = query.get('assigned')
        const meeting = query.get('meeting')
        const meetid = query.get('meetid')
        const tsktyp = query.get('tsktyp')
        this.getData(login, assigned, meeting, meetid, tsktyp)
        microsoftTeams.initialize();
    }

getUserProfile = () => {
    getUserProfileAPI().then((res: any) => {
      console.log("email from res data-------------------", res.data.mail);
    })
  }

  getData=(UserEmail:any,AssignedToEmail?:any,MeetingTitleId?:any,MeetingTypeId?:any,TaskType?:any)=>{
    GetDashboardPersonalTaskDetailsByMeetingID(UserEmail, AssignedToEmail, MeetingTitleId, MeetingTypeId, TaskType)
    .then((res: any) => {
        console.log("Response Data in popup", res.data)
        this.setState({
          data: res.data,
          loading:false
        })
      })
  }

  elip=(text:string)=>{
    var max = 25;
    if(text){
        return text.length > max ? text.substring(0, max) + '...' : text;
    }
    else{
        return "";
    }
   
  }
  
    render() { 
        return ( 
            <div>
            {!this.state.loading ? 
            <>
            <table className="tableDesign" width={'100%'}>
                <thead className='tableDesHead'>
                    <tr>
                        <th style={{fontSize: '12px', textAlign:"center", width:"15%"}}>Sl. No.</th>
                        <th style={{fontSize: '12px', width:"25%"}}>Name of Task</th>
                        <th style={{fontSize: '12px', width:"20%"}}>Remarks</th>
                        <th style={{fontSize: '12px', textAlign:"center", width:"20%"}}>Status</th>
                        <th style={{fontSize: '12px', textAlign:"center", width:"20%"}}>Closure Date</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.data.map((load:any, i:number)=>{
                        return(
                            <>
                            <tr className='nestedTableRow'>
                                <td style={{fontSize: '12px', textAlign:"center", width:"15%"}} className="tableAccordion">{i+1}</td>
                                <td style={{fontSize: '12px', width:"25%"}} className="tableAccordion">{load.TaskContext}</td>
                                <td style={{fontSize: '12px', width:"20%"}} className="tableAccordion" title={load.TaskRemarks}>{this.elip(load.TaskRemarks)}</td>
                                <td style={{fontSize: '12px', textAlign:"center", width:"20%"}} className="tableAccordion">{load.TaskStatus}</td>
                                <td style={{fontSize: '12px', textAlign:"center", width:"20%"}} className="tableAccordion">{moment(load.TaskClosureDate).format('LL')}</td>
                            </tr>
                            </>
                            
                        )
                    })}
                </tbody>
            </table>
            </> : <Loader styles={{ margin: "50px" }} label="Loading..." />
        }
            
            </div>
         );
    }
}
 
