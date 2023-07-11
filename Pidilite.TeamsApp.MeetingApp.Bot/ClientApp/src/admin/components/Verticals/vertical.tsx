import React from 'react';

import { Header, Flex, Button, Text, Loader } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Pagination from "react-js-pagination";

import "./../../styles.scss"

import { getVerticalsAPI, deleteVerticalAPI } from '../../../apis/APIList'

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
}

interface IVerticalsProps {
    history?: any;
    location?: any;
    name?: string;
}


interface MyState {
    verticalsList?: any;
    loading?: any;
    addNewTaskModuleURL?: any;
    nameFieldSort?: any;
    nameFieldSortIcon?: any;
    activeFieldSort?: any;
    activeFieldSortIcon?: any;
    activePage?: any;
    divisionFieldSort?: boolean;
    divisionFieldSortIcon?: boolean;
}


class Vertical extends React.Component<IVerticalsProps, MyState> {
    constructor(props: IVerticalsProps) {
        super(props);
        this.state = {
            loading: true,
            addNewTaskModuleURL: base_URL + '/addvertical',
            nameFieldSort: true,
            nameFieldSortIcon: true,
            activePage: 1
        };
    }


    componentDidMount() {
        this.getVerticals()
    }

    ///////////////////////////// Get verticals list function ////////////////////////////
    getVerticals() {
        getVerticalsAPI().then((res: any) => {
            console.log("api verticals get", res.data);
            this.setState({
                verticalsList: res.data.sort((a: any, b: any) => (a.verticalName > b.verticalName) ? 1 : ((b.verticalName > a.verticalName) ? -1 : 0)),
                loading: false,
                activePage: 1
            })
        })
    }


    /////////////////////// Call Add New Task module //////////////////////////
    addNewTaskModule = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.addNewTaskModuleURL,
            title: "Add new vertical",
            height: 350,
            width: 600,
            fallbackUrl: this.state.addNewTaskModuleURL,
        }
        let submitHandler = (err: any, result: any) => {
            this.getVerticals()
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    /////////////////////// Call Edit Task module //////////////////////////
    editTaskModule = (data: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/editvertical?id=${data.verticalId}`,
            title: "Edit vertical",
            height: 350,
            width: 600,
            fallbackUrl: `${base_URL}/editvertical?id=${data.verticalId}`,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.getVerticals()
            })
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }


    ////////////////////// Vertical field sort ///////////////////////
    verticalSort() {
        this.setState({
            activeFieldSort: false,
            nameFieldSortIcon: true,
            activeFieldSortIcon: false,
            divisionFieldSort: false,
            divisionFieldSortIcon: false
        }, () => {
            if (this.state.nameFieldSort) {
                this.setState({
                    verticalsList: this.state.verticalsList.reverse((a: any, b: any) => (a.verticalName > b.verticalName) ? 1 : ((b.verticalName > a.verticalName) ? -1 : 0)),
                    nameFieldSort: false,
                })
            }
            else {
                this.setState({
                    verticalsList: this.state.verticalsList.sort((a: any, b: any) => (a.verticalName > b.verticalName) ? 1 : ((b.verticalName > a.verticalName) ? -1 : 0)),
                    nameFieldSort: true,
                })
            }
        })
    }

    ////////////////////// Division field sort ///////////////////////
    divisionSort() {
        this.setState({
            activeFieldSort: false,
            nameFieldSortIcon: false,
            activeFieldSortIcon: false,
            nameFieldSort: false,
            divisionFieldSortIcon: true
        }, () => {
            if (this.state.divisionFieldSort) {
                this.setState({
                    verticalsList: this.state.verticalsList.reverse((a: any, b: any) => (a.divisionName > b.divisionName) ? 1 : ((b.divisionName > a.divisionName) ? -1 : 0)),
                    divisionFieldSort: false,
                })
            }
            else {
                this.setState({
                    verticalsList: this.state.verticalsList.sort((a: any, b: any) => (a.divisionName > b.divisionName) ? 1 : ((b.divisionName > a.divisionName) ? -1 : 0)),
                    divisionFieldSort: true,
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
            divisionFieldSort: false,
            divisionFieldSortIcon: false
        }, () => {
            if (this.state.activeFieldSort) {
                this.setState({
                    verticalsList: this.state.verticalsList.reverse((a: any, b: any) => b.active - a.active),
                    activeFieldSort: false,
                })
            }
            else {
                this.setState({
                    verticalsList: this.state.verticalsList.sort((a: any, b: any) => b.active - a.active),
                    activeFieldSort: true,
                })
            }
        })
    }


    ///// page change/////
    handlePageChange(pageNumber: any) {
        this.setState({ activePage: pageNumber });
    }

    ////////// delete vertical ////////
    deleteVertical(data:any) {
        deleteVerticalAPI(data.verticalId).then((res:any) => {
            if(res.data){
                this.getVerticals()
            }
            console.log("delete", res)
        })
    }


    render() {

        return (
            <div className="containterBox">
                <div>

                    <div className="displayFlex " style={{ alignItems: "center" }}>
                        <Header as="h6" content="Vertical Master" className="headingText"></Header>
                        <div className="addNewDiv">
                            <Button primary content="+Add New" className="addNewButton" onClick={() => this.addNewTaskModule()} />
                        </div>

                    </div>



                </div>
                {!this.state.loading ? <div>
                    {this.state.verticalsList && (this.state.verticalsList.length > 0) ? <div> <table className="ViswasTable">
                        <tr>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.verticalSort()}  >
                                    <div style={{ marginRight: "5px" }} className="fontBold">Vertical</div>
                                    {this.state.nameFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.nameFieldSort) ? downArrow : upArrow} alt='' />}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.divisionSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Division </div>
                                    {this.state.divisionFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.divisionFieldSort) ? downArrow : upArrow} alt='' />}
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
                        {this.state.verticalsList.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any) => {
                            return <tr className="ViswasTableRow">
                                <td>{e.verticalName}</td>
                                <td>{e.divisionName}</td>
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
                                        <div className="editButton pointer" onClick={() => this.deleteVertical(e)}  ><img src={deleteIcon} alt='Delete' style={{ height: "22px", width: "22px" }} /></div>
                                    </div>
                                </td>
                            </tr>
                        })}


                    </table>
                        <div className="pagination-style">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.verticalsList.length}
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



export default Vertical;
