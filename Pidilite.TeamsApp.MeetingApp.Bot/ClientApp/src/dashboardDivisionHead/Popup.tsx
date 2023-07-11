import React from 'react'
import {GetDashboardDivisionHeadTaskDetailsUserWise} from '../apis/APIList';
import * as microsoftTeams from "@microsoft/teams-js";
import moment from 'moment';
 
interface State {
//   EmailId: any;
  data:any[];
    
}
interface Props {  
    history?: any;
    location?: any;
  }
 
export default class Popup extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {  
            // EmailId: '',
            data:[],
         };
    }

    componentDidMount=()=>{
        console.log("location by props------------",this.props.location.search)
        const query = new URLSearchParams(this.props.location.search)
        const login = query.get('login')
        const division = query.get('division')
        const vertical = query.get('vertical')
        const meeting = query.get('meeting')
        const meetid = query.get('meetid')
        const tsktyp = query.get('tsktyp')
        const fromdate = query.get('fromdate')
        const todate = query.get('todate')
        this.getData(login, division, meeting, meetid, tsktyp, fromdate, todate  )
        microsoftTeams.initialize();
    }

  getData=(assignedToEmail:any,DivisionName:any,MeetingTitle?:any,MeetingTypeId?:any,TaskType?:any, Fromdate?:any, Todate?:any)=>{
    GetDashboardDivisionHeadTaskDetailsUserWise(assignedToEmail, DivisionName, MeetingTitle, MeetingTypeId, TaskType, Fromdate, Todate)
    .then((res: any) => {
        console.log("Response Data in popup", res.data)
        this.setState({
          data: res.data,
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
            <>
            
            <table className="tableDesign" width={"100%"}>
                <thead className='tableDesHead'>
                    <tr>
                        <th style={{fontSize: '12px', textAlign:"center", width:"15%"}}>Sl. No.</th>
                        <th style={{fontSize: '12px', width:"25%"}}>Name of Task</th>
                        <th style={{fontSize: '12px', textAlign:"center", width:"20%"}}>Remarks</th>
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
                                <td style={{fontSize: '12px', textAlign:"center", width:"20%"}} className="tableAccordion" title={load.TaskRemarks}>{this.elip(load.TaskRemarks)}</td>
                                <td style={{fontSize: '12px', textAlign:"center", width:"20%"}} className="tableAccordion">{load.TaskStatus}</td>
                                <td style={{fontSize: '12px', textAlign:"center", width:"20%"}} className="tableAccordion">{moment(load.TaskClosureDate).format('LL')}</td>
                            </tr>
                            </>
                            
                        )
                    })}
                </tbody>
            </table>
            </>
         );
    }
}
 
