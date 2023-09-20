import React from 'react';

import { Header, Flex, Button, Text, Loader, Input, Dropdown } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Pagination from "react-js-pagination";
import "./../../styles.scss"

import { getmeetingtitlesAPI, getDivisionsAPI, getMeetingTypesAPI, getVerticalsAPI, deleteMeetingTitleAPI } from '../../../apis/APIList'

import Toggle from 'react-toggle'

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
    meetingTitleName?:string
}


class MeetingTitle extends React.Component<IMeetingTitleProps, MyState> {
    constructor(props: IMeetingTitleProps) {
        super(props);
        this.state = {
            loading: true,
            addNewTaskModuleURL: base_URL + '/addtitle',
            nameFieldSort: true,
            nameFieldSortIcon: true,
            activePage: 1
        };
    }


    componentDidMount() {
        this.getDivision();
        this.getMeetingTypes();
        this.getVerticals();
        this.Search();
    }

    Search() {
        const data = {
            "MeetingTitle": this.state.meetingTitleName ? this.state.meetingTitleName:'',
            "MeetingTypeId": this.state.typeId ? this.state.typeId : "",
            "DivisionId": this.state.divisionId ? this.state.divisionId : "",
            "VerticalId": this.state.verticalId ? this.state.verticalId : ""
        }
        this.getMeetingtitles(data)
    }

    ///////////////////////////// Get division list function ////////////////////////////
    getDivision() {
        getDivisionsAPI().then((res: any) => {
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.divisionName)
            // console.log("behaviour input item response", result);
            this.setState({
                divisionInput: result,
                divisionList: list
            })
          })
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
                })
            }
            else{
                let result = res.data.filter((e: any) => e.active === true ).map((a: any) => a.verticalName);
                console.log("api verticals get 2", result);
                this.setState({
                    verticalInput: result,
                    verticalList: list
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


    /////////////////////// Call Add New Task module //////////////////////////
    addNewTaskModule = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.addNewTaskModuleURL,
            title: "Add new meeting title",
            height: 450,
            width: 600,
            fallbackUrl: this.state.addNewTaskModuleURL,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.Search()
            })
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    /////////////////////// Call Edit Task module //////////////////////////
    editTaskModule = (data: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/editmeetingtitle?id=${data.meetingTitleId}`,
            title: "Edit meeting title",
            height: 450,
            width: 600,
            fallbackUrl: `${base_URL}/editmeetingtitle?id=${data.meetingTitleId}`,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.Search()
            })
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    /////////////////////// view Task module //////////////////////////
    viewTaskModule = (data: any) => {
        console.log(data)
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/viewtitle?id=${data.meetingTitleId}`,
            title: "View meeting title",
            height: 350,
            width: 600,
            fallbackUrl: `${base_URL}/viewtitle?id=${data.meetingTitleId}`,
        }
        let submitHandler = (err: any, result: any) => {
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
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
            divisionId: "",
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

    selectDivision(data:any){
        this.state.divisionList.filter((e: any) => e.divisionName === data).map((e: any) => {
            this.setState({
                divisionId: e.divisionId,
              divisionName: data
            },()=>{
                this.getVerticals(this.state.divisionName)
            })
          })
    }

    selectVertical(data:any){
        this.state.verticalList.filter((e: any) => e.verticalName === data).map((e: any) => {
            this.setState({
                verticalId: e.verticalId,
                verticalName: data
            })
          })
    }

     ////////// delete title ////////
     deleteMeetingTitle(data:any) {
        deleteMeetingTitleAPI(data.meetingTitleId).then((res:any) => {
            if(res.data){
                this.Search()
            }
            console.log("delete", res)
        })
    }

    render() {

        return (
            <div className="containterBox">
                <div>
                    <div className="displayFlex " style={{ alignItems: "center" }}>
                        <Header as="h6" content="Meeting Title Master" className="headingText"></Header>
                        <div className="addNewDiv">
                            <Button primary content="+Add New" className="addNewButton" onClick={() => this.addNewTaskModule()} />
                        </div>

                    </div>
                </div>
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
                        <Dropdown fluid
                            items={this.state.divisionInput}
                            placeholder="Division"
                            className="DropdownFontStyle meetingTitleDropDown bottomShadow"
                            value={this.state.divisionName}
                            onChange={(event, { value }) => this.selectDivision(value)}
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
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Division </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.activeSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Vertical </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.activeSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Status </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th style={{ textAlign: "end", paddingRight: '35px' }} className="fontBold">View</th>
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">Edit</th>
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">Delete</th>
                        </tr>
                        {this.state.meetingtitlesList.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any) => {
                            return <tr className="ViswasTableRow">
                                <td>{e.meetingTitle}</td>
                                <td>{e.meetingType}</td>
                                <td>{e.divisionName}</td>
                                <td>{e.verticalName}</td>
                                <td>
                                    <Flex styles={{ alignItems: "center" }}>
                                        <Toggle disabled={true} checked={e.active} icons={false} />
                                        <Text styles={{ marginLeft: "5px" }}>{e.active ? "Yes" : "No"}</Text>
                                    </Flex>

                                </td>
                                <td >
                                    <div className="tableEditDiv">
                                        {/* <div style={{ marginRight: "10px" }}> Edit </div> */}
                                        <div className="editButton pointer" onClick={() => this.viewTaskModule(e)}  ><img style={{ height: "30px", width: "30px" }}src={viewIcon} alt='' /></div>
                                    </div>
                                </td>

                                <td >
                                    <div className="tableEditDiv">
                                        {/* <div style={{ marginRight: "10px" }}> Edit </div> */}
                                        <div className="editButton pointer" onClick={() => this.editTaskModule(e)}  ><img src={editImage} alt='' /></div>
                                    </div>
                                </td>
                                <td style={{ textAlign: "end" }}>
                                    <div className="tableEditDiv">
                                        {/* <div style={{ marginRight: "10px" }}> Edit </div> */}
                                        <div className="editButton pointer" onClick={() => this.deleteMeetingTitle(e)}  ><img src={deleteIcon} alt='Delete' style={{ height: "22px", width: "22px" }} /></div>
                                    </div>
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
                    </div> : <div className="noDataText"> No Data Available</div>}

                </div> : <Loader styles={{ margin: "50px" }} />}

            </div>
        );
    }
}



export default MeetingTitle;
