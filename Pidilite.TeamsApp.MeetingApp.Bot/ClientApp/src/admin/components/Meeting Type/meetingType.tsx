import React from 'react';

import { Header, Flex, Button, Text, Loader } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Pagination from "react-js-pagination";

import "./../../styles.scss"

import { getMeetingTypesAPI, deleteMeetingTypesAPI } from '../../../apis/APIList'

import Toggle from 'react-toggle'

const base_URL = window.location.origin
const editImage = base_URL + "/images/edit.svg"
const upArrow = base_URL + "/images/upArrow.png"
const downArrow = base_URL + "/images/downArrow.png"
const deleteIcon = base_URL + "/images/deleteIcon.png"

interface ITaskInfo {
    title?: string;
    height?: number;
    width?: number;
    url?: string;
    card?: string;
    fallbackUrl?: string;
    completionBotId?: string;
    deleteMessage?:string;
}

interface IMeetingTypesProps {
    history?: any;
    location?: any;
    name?: string;
}


interface MyState {
    meetingTypeList?: any;
    loading?: any;
    addNewTaskModuleURL?: any;
    nameFieldSort?: any;
    nameFieldSortIcon?: any;
    activeFieldSort?: any;
    activeFieldSortIcon?: any;
    activePage?: any;
    clssificationFieldSort?: boolean;
    clssificationFieldSortIcon?: boolean;

}


class MeetingType extends React.Component<IMeetingTypesProps, MyState> {
    constructor(props: IMeetingTypesProps) {
        super(props);
        this.state = {
            loading: true,
            addNewTaskModuleURL: base_URL + '/addmeetingtype',
            nameFieldSort: true,
            nameFieldSortIcon: true,
            activePage: 1
        };
    }


    componentDidMount() {
        this.getMeetingTypes()
    }

    ///////////////////////////// Get Meeting type list function ////////////////////////////
    getMeetingTypes() {


        getMeetingTypesAPI().then((res: any) => {
            console.log("api meetingtype get", res.data);
            this.setState({
                meetingTypeList: res.data.sort((a: any, b: any) => (a.typeName > b.typeName) ? 1 : ((b.typeName > a.typeName) ? -1 : 0)),
                loading: false,
                activePage: 1
            })
        })
    }


    /////////////////////// Call Add New Task module //////////////////////////
    addNewTaskModule = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.addNewTaskModuleURL,
            title: "Add new type",
            height: 350,
            width: 600,
            fallbackUrl: this.state.addNewTaskModuleURL,
        }
        let submitHandler = (err: any, result: any) => {
            this.getMeetingTypes()
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    /////////////////////// Call Edit Task module //////////////////////////
    editTaskModule = (data: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/editmeetingtype?id=${data.typeId}`,
            title: "Edit meeting type",
            height: 350,
            width: 600,
            fallbackUrl: `${base_URL}/editmeetingtype?id=${data.typeId}`,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.getMeetingTypes()
            })
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }


    ////////////////////// Type field sort ///////////////////////
    nameSort() {
        this.setState({
            activeFieldSort: false,
            nameFieldSortIcon: true,
            activeFieldSortIcon: false,
            clssificationFieldSort: false,
            clssificationFieldSortIcon: false
        }, () => {
            if (this.state.nameFieldSort) {
                this.setState({
                    meetingTypeList: this.state.meetingTypeList.reverse((a: any, b: any) => (a.typeName > b.typeName) ? 1 : ((b.typeName > a.typeName) ? -1 : 0)),
                    nameFieldSort: false,
                })
            }
            else {
                this.setState({
                    meetingTypeList: this.state.meetingTypeList.sort((a: any, b: any) => (a.typeName > b.typeName) ? 1 : ((b.typeName > a.typeName) ? -1 : 0)),
                    nameFieldSort: true,
                })
            }
        })
    }

    ////////////////////// Type field sort ///////////////////////
    classificationSort() {
        this.setState({
            activeFieldSort: false,
            nameFieldSortIcon: false,
            activeFieldSortIcon: false,
            nameFieldSort: false,
            clssificationFieldSortIcon: true
        }, () => {
            if (this.state.clssificationFieldSort) {
                this.setState({
                    meetingTypeList: this.state.meetingTypeList.reverse((a: any, b: any) => (a.classification > b.classification) ? 1 : ((b.classification > a.classification) ? -1 : 0)),
                    clssificationFieldSort: false,
                })
            }
            else {
                this.setState({
                    meetingTypeList: this.state.meetingTypeList.sort((a: any, b: any) => (a.classification > b.classification) ? 1 : ((b.classification > a.classification) ? -1 : 0)),
                    clssificationFieldSort: true,
                })
            }
        })
    }

    ///////////////////////// Status field sort /////////////////////////////
    activeSort() {
        this.setState({
            nameFieldSort: false,
            nameFieldSortIcon: false,
            activeFieldSortIcon: true,
            clssificationFieldSort: false,
            clssificationFieldSortIcon: false
        }, () => {
            if (this.state.activeFieldSort) {
                this.setState({
                    meetingTypeList: this.state.meetingTypeList.reverse((a: any, b: any) => b.active - a.active),
                    activeFieldSort: false,
                })
            }
            else {
                this.setState({
                    meetingTypeList: this.state.meetingTypeList.sort((a: any, b: any) => b.active - a.active),
                    activeFieldSort: true,
                })
            }
        })
    }


    ///// page change/////
    handlePageChange(pageNumber: any) {
        this.setState({ activePage: pageNumber });
    }

    ////////// delete meeting type ////////
    deleteMeetingType(data:any) {
        deleteMeetingTypesAPI(data.typeId).then((res:any) => {
            if(res.data.message==='Meeting type deleted successfully'){
                this.getMeetingTypes()
            }
            console.log("delete meeting type", res)
        })
    }


    render() {

        return (
            <div className="containterBox">
                <div className="displayFlex " style={{ alignItems: "center" }}>
                    <Header as="h6" content="Meeting Type Master" className="headingText"></Header>
                    <div className="addNewDiv">
                        <Button primary content="+Add New" className="addNewButton" onClick={() => this.addNewTaskModule()} />
                    </div>

                </div>
                {!this.state.loading ? <div>
                    {this.state.meetingTypeList && (this.state.meetingTypeList.length > 0) ? <div> <table className="ViswasTable">
                        <tr>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.nameSort()}  >
                                    <div style={{ marginRight: "5px" }} className="fontBold">Meeting Type Name </div>
                                    {this.state.nameFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.nameFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.classificationSort()}  >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Classification </div>
                                    {this.state.clssificationFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.clssificationFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.activeSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Status </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">Edit</th>
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">Delete</th>
                        </tr>
                        {this.state.meetingTypeList.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any) => {
                            return <tr className="ViswasTableRow">
                                <td>{e.typeName}</td>
                                <td>{e.classification}</td>
                                <td>
                                    <Flex styles={{ alignItems: "center" }}>
                                        <Toggle disabled={true} checked={e.active} icons={false} />
                                        <Text styles={{ marginLeft: "5px" }}>{e.active ? "Yes" : "No"}</Text>
                                    </Flex>

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
                                        <div className="editButton pointer" onClick={() => this.deleteMeetingType(e)}  ><img src={deleteIcon} alt='Delete' style={{ height: "22px", width: "22px" }} /></div>
                                    </div>
                                </td>
                            </tr>
                        })}


                    </table>
                        <div className="pagination-style">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.meetingTypeList.length}
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



export default MeetingType;
