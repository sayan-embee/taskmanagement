import React from 'react';

import { Header, Flex, Button, Text, Loader, Input, Dropdown, OpenOutsideIcon } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Pagination from "react-js-pagination";
import "./../admin/styles.scss"

import { getmeetingtitlesAPI, getDivisionsAPI, getMeetingTypesAPI, getVerticalsAPI, getUserProfileAPI } from './../apis/APIList'

import Toggle from 'react-toggle'

import Nodata from '../conferenceRoomUtil/Nodata.svg'

const base_URL = window.location.origin
const editImage = base_URL + "/images/edit.svg"
const upArrow = base_URL + "/images/upArrow.png"
const downArrow = base_URL + "/images/downArrow.png"
const searchIcon = base_URL + "/images/search.png";
const cancelIcon = base_URL + "/images/cancel.png";
const viewIcon = base_URL + "/images/view.png";
const deleteIcon = base_URL + "/images/deleteIcon.png"

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
}

interface IMeetingTitleProps {
    history?: any;
    location?: any;
    name?: string;
}


interface MyState {
    meetingtitlesList?: any;
    loading?: any;
    addNewTaskModuleURL?: any;
    nameFieldSort?: any;
    nameFieldSortIcon?: any;
    activeFieldSort?: any;
    activeFieldSortIcon?: any;
    activePage?: any;
    divisionName?: string;
    divisionId?: any;
    divisionList?: any;
    divisionInput?: any;
    typeName?: string;
    typeId?: any;
    typeList?: any;
    typeInput?: any;
    verticalName?: string;
    verticalId?: any;
    verticalList?: any;
    verticalInput?: any;
    meetingTitleName?:string;
    loggedInUser?: string;
    loggedInUserEmail?: string;
    loggedInUserADID?: any;
}


class IndexMeetingTitle extends React.Component<IMeetingTitleProps, MyState> {
    constructor(props: IMeetingTitleProps) {
        super(props);
        this.state = {
            loading: true,
            nameFieldSort: true,
            nameFieldSortIcon: true,
            activePage: 1
        };
    }


    componentDidMount() {
        this.getUserProfile();
        this.getMeetingTypes(); 
    }

    
    //////////////////////////// Get User Profile ////////////////////////////////
    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            // console.log("user", res);
            this.setState({
                loggedInUser: res.data.displayName,
                loggedInUserEmail: res.data.mail,
                loggedInUserADID: res.data.id,
                divisionName: res.data.division,
                verticalName: res.data.vertical,
            },()=>{
               this.getDivision()
            })
        })
    }

    ///////////////////////////// Get division list function ////////////////////////////
    getDivision() {
        getDivisionsAPI().then((res: any) => {
            res.data.filter((e: any) => e.divisionName === this.state.divisionName).map((e: any) => {
                this.setState({
                    divisionId: e.divisionId
                },()=>{
                    this.getVerticals(this.state.divisionName);
                })
            })
        })
    }

    Search() {
        const data = {
            "MeetingTitle": this.state.meetingTitleName ? this.state.meetingTitleName:'',
            "MeetingTypeId": this.state.typeId ? this.state.typeId : "",
            "DivisionId": this.state.divisionId,
            "VerticalId": this.state.verticalId ? this.state.verticalId : ""
        }
        this.getMeetingtitles(data)
    }

     ///////////////////////////// Get Meeting type list function ////////////////////////////
     getMeetingTypes() { 
        getMeetingTypesAPI().then((res:any) => {
            // console.log("api meetingtype get", res.data);
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.typeName)
            this.setState({
                typeInput: result,
                typeList: list
            })
          })
    }

     ///////////////////////////// Get verticals list function ////////////////////////////
     getVerticals(divisionName?:string) {
        getVerticalsAPI().then((res: any) => {
            let list = res.data 
            if (divisionName){
                let result = res.data.filter((e: any) => e.active === true && e.divisionName === divisionName).map((a: any) => a.verticalName);
                console.log("api verticals get 1", result);
                this.setState({
                    verticalInput: result,
                    verticalList: list
                },()=>{
                    this.Search();
                })
            }
            
          })
    }

    ///////////////////////////// Get titles list function ////////////////////////////
    getMeetingtitles(data:any) {
        getmeetingtitlesAPI(data).then((res: any) => {
            console.log("api title get", res.data);
            this.setState({
                meetingtitlesList: res.data.sort((a: any, b: any) => (a.meetingTitle > b.meetingTitle) ? 1 : ((b.meetingTitle > a.meetingTitle) ? -1 : 0)),
                loading: false,
                activePage: 1
            })
        })
    }

    ////////////////////// title field sort ///////////////////////
    nameSort() {
        this.setState({
            activeFieldSort: false,
            nameFieldSortIcon: true,
            activeFieldSortIcon: false
        }, () => {
            if (this.state.nameFieldSort) {
                this.setState({
                    meetingtitlesList: this.state.meetingtitlesList.reverse((a: any, b: any) => (a.meetingTitle > b.meetingTitle) ? 1 : ((b.meetingTitle > a.meetingTitle) ? -1 : 0)),
                    nameFieldSort: false,
                })
            }
            else {
                this.setState({
                    meetingtitlesList: this.state.meetingtitlesList.sort((a: any, b: any) => (a.meetingTitle > b.meetingTitle) ? 1 : ((b.meetingTitle > a.meetingTitle) ? -1 : 0)),
                    nameFieldSort: true,
                })
            }
        })
    }

    ///////////////////////// Status field sort /////////////////////////////
    activeSort() {
        this.setState({
            nameFieldSort: false,
            nameFieldSortIcon: false,
            activeFieldSortIcon: true
        }, () => {
            if (this.state.activeFieldSort) {
                this.setState({
                    meetingtitlesList: this.state.meetingtitlesList.reverse((a: any, b: any) => b.active - a.active),
                    activeFieldSort: false,
                })
            }
            else {
                this.setState({
                    meetingtitlesList: this.state.meetingtitlesList.sort((a: any, b: any) => b.active - a.active),
                    activeFieldSort: true,
                })
            }
        })
    }


    ///// page change/////
    handlePageChange(pageNumber: any) {
        this.setState({ activePage: pageNumber });
    }

    /////////////////// cancel search ///////////////////
    cancel() {
        this.setState({
            typeId: "",
            verticalId: "",
            meetingTitleName: "",
        })
    }

    ////////////////// select meeting title ///////////////////
    selectMeetingTitle(e:any){
        this.setState({
            meetingTitleName: e.target.value
        })
    } 

    ////////////////////////// select type name //////////////////////////

    selectTypeName(data:any){
        this.state.typeList.filter((e: any) => e.typeName === data).map((e: any) => {
            this.setState({
                typeId: e.typeId,
                typeName: data
            })
          })
    }

    

    selectVertical(data:any){
        this.state.verticalList.filter((e: any) => e.verticalName === data && e.divisionName === this.state.divisionName).map((e: any) => {
            this.setState({
                verticalId: e.verticalId,
                verticalName: data
            })
          })
    }

     

    render() {

        return (
            <div className="containterBox">
              
                <div style={{float:'right', margin:'20px 0px'}}>
                <div className="rewardsRecognitionSearchFieldDiv" style={{ marginRight: "10px" }}>
                <Input placeholder="Meeting title" value={this.state.meetingTitleName} onChange={(e) => this.selectMeetingTitle(e)} className="bottomShadow"/> 
                        <Dropdown fluid
                            items={this.state.typeInput}
                            placeholder="Type"
                            className="champListDropdown DropdownFontStyle meetingTitleDropDown bottomShadow"
                            value={this.state.typeName}
                            onChange={(event, { value }) => this.selectTypeName(value)}
                        />
                       
                        <Dropdown fluid items={this.state.verticalInput} placeholder="Verticals"
                            className="DropdownFontStyle meetingTitleDropDown bottomShadow"
                            value={this.state.verticalName}
                            onChange={(event, { value }) => this.selectVertical(value)}
                        />
                        <div className="rewardsRecognitionSearchBtnDiv">
                            <Button primary onClick={() => this.Search()} className="champListButton" title="Search"><img style={{ marginTop: "3px", height: "20px" }} src={searchIcon} alt='Search'/></Button>
                            <Button title="Clear" className="champListButton" primary onClick={() => this.cancel()}><img style={{ height: "20px" }} src={cancelIcon} alt='Cancel'/></Button>
                        </div>


                    </div> 
                </div>

                {!this.state.loading ? <div>
                    {this.state.meetingtitlesList && (this.state.meetingtitlesList.length > 0) ? <div> <table className="ViswasTable">
                        <tr>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.nameSort()}  >
                                    <div style={{ marginRight: "5px" }} className="fontBold">Meeting title</div>
                                    {this.state.nameFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.nameFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.activeSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Type </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.activeSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Vertical </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            
                            
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">File</th>
                        </tr>
                        {this.state.meetingtitlesList.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any) => {
                            return <tr className="ViswasTableRow">
                                <td>{e.meetingTitle}</td>
                                <td>{e.meetingType}</td>
                                
                                <td>{e.verticalName}</td>
                                
                               <td>    <Text content={e.meetingTitleFileName} size="medium" weight="semibold"/>
                                         <OpenOutsideIcon style={{ cursor: "pointer",marginLeft:"3px" }}  onClick={() => window.open(e.spoWebUrl, "_blank")}/>
                                        </td>
                               
                            </tr>
                        })}


                    </table>
                        <div className="pagination-style">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.meetingtitlesList.length}
                                pageRangeDisplayed={6}
                                onChange={this.handlePageChange.bind(this)}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                firstPageText=""
                                lastPageText=""
                                linkClassFirst="displayNone"
                                linkClassLast="displayNone"

                            />
                        </div>
                    </div> : <div className='imgMainDiv'>
                                            <img className='noDataImg' src={Nodata} alt="No data img"/>
                                            <br/>
                                            <b>There aren&rsquo;t any task records to show. Try with different date range.</b>
                                            </div>}

                </div> : <Loader styles={{ margin: "50px" }} />}

            </div>
        );
    }
}



export default IndexMeetingTitle;
