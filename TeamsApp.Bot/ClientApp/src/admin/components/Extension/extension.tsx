import React from 'react';

import { Header, Flex, Button, Text, Loader } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Pagination from "react-js-pagination";

import "./../../styles.scss"

import { getFileExtensionsAPI, deleteFileExtensionAPI } from '../../../apis/APIList'

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

interface IFileExtensionsProps {
    history?: any;
    location?: any;
    name?: string;
}


interface MyState {
    fileExtensionsList?: any;
    loading?: any;
    addNewTaskModuleURL?: any;
    nameFieldSort?: any;
    nameFieldSortIcon?: any;
    activeFieldSort?: any;
    activeFieldSortIcon?: any;
    activePage?: any;
}


class FileExtension extends React.Component<IFileExtensionsProps, MyState> {
    constructor(props: IFileExtensionsProps) { 
        super(props);
        this.state = {
            loading: true,
            addNewTaskModuleURL: base_URL + '/addextension',
            nameFieldSort: true,
            nameFieldSortIcon: true,
            activePage: 1
        };
    }


    componentDidMount() {
        this.getFileExtensions()
    }

    ///////////////////////////// Get file extension list function ////////////////////////////
    getFileExtensions() {   
        getFileExtensionsAPI().then((res:any) => {
            console.log("api extension get", res.data);
            this.setState({
                fileExtensionsList: res.data.sort((a: any, b: any) => (a.extName > b.extName) ? 1 : ((b.extName > a.extName) ? -1 : 0)),
                loading: false,
                activePage: 1
            })
        })
    }


    /////////////////////// Call Add New Task module //////////////////////////
    addNewTaskModule = () => {
        let taskInfo: ITaskInfo = {
            url: this.state.addNewTaskModuleURL,
            title: "Add new extension",
            height: 350,
            width: 600,
            fallbackUrl: this.state.addNewTaskModuleURL,
        }
        let submitHandler = (err: any, result: any) => {
            this.getFileExtensions()
        };
        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    /////////////////////// Call Edit Task module //////////////////////////
    editTaskModule = (data: any) => {
        let taskInfo: ITaskInfo = {
            url: `${base_URL}/editextension?id=${data.extId}`,
            title: "Edit extension",
            height: 350,
            width: 600,
            fallbackUrl: `${base_URL}/editextension?id=${data.extId}`,
        }
        let submitHandler = (err: any, result: any) => {
            this.setState({
                loading: true
            }, () => {
                this.getFileExtensions()
            })
        };

        microsoftTeams.tasks.startTask(taskInfo, submitHandler);
    }

    
    ////////////////////// extension field sort ///////////////////////
    nameSort() {
        this.setState({
            activeFieldSort: false,
            nameFieldSortIcon: true,
            activeFieldSortIcon: false
        }, () => {
            if (this.state.nameFieldSort) {
                this.setState({
                    fileExtensionsList: this.state.fileExtensionsList.reverse((a: any, b: any) => (a.extName > b.extName) ? 1 : ((b.extName > a.extName) ? -1 : 0)),
                    nameFieldSort: false,
                })
            }
            else {
                this.setState({
                    fileExtensionsList: this.state.fileExtensionsList.sort((a: any, b: any) => (a.extName > b.extName) ? 1 : ((b.extName > a.extName) ? -1 : 0)),
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
                    fileExtensionsList: this.state.fileExtensionsList.reverse((a: any, b: any) => b.active - a.active),
                    activeFieldSort: false,
                })
            }
            else {
                this.setState({
                    fileExtensionsList: this.state.fileExtensionsList.sort((a: any, b: any) => b.active - a.active),
                    activeFieldSort: true,
                })
            }
        })
    }


    ///// page change/////
    handlePageChange(pageNumber: any) {
        this.setState({ activePage: pageNumber });
    }

    ////////// delete extension ////////
    deleteFileExtension(data:any) {
        deleteFileExtensionAPI(data.extId).then((res:any) => {
            if(res.data){
                this.getFileExtensions()
            }
            console.log("delete", res)
        })
    }

    render() {

        return (
            <div className="containterBox">
                <div>

                    <div className="displayFlex " style={{ alignItems: "center" }}>
                        <Header as="h6" content="Allowed Extension for Attachments" className="headingText"></Header>
                        <div className="addNewDiv">
                            <Button primary content="+Add New" className="addNewButton" onClick={() => this.addNewTaskModule()} />
                        </div>

                    </div>



                </div>
                {!this.state.loading ? <div>
                    {this.state.fileExtensionsList && (this.state.fileExtensionsList.length > 0) ?<div> <table className="ViswasTable">
                        <tr>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.nameSort()}  >
                                    <div style={{ marginRight: "5px" }} className="fontBold">Extension</div>
                                    {this.state.nameFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.nameFieldSort) ? downArrow : upArrow} alt=''/>}
                                </div>
                            </th>
                            <th>
                                <div className="displayFlex pointer" onClick={() => this.activeSort()} >
                                    <div style={{ marginRight: "5px" }} className="fontBold"> Status </div>
                                    {this.state.activeFieldSortIcon && <img style={{ marginTop: "3px" }} src={(this.state.activeFieldSort) ? downArrow : upArrow} alt=''/>}
                                </div>
                            </th>
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">Edit</th>
                            <th style={{ textAlign: "end", paddingRight: '28px' }} className="fontBold">Delete</th>
                        </tr>
                        {this.state.fileExtensionsList.slice((this.state.activePage - 1) * 10, (this.state.activePage - 1) * 10 + 10).map((e: any) => {
                            return <tr className="ViswasTableRow">
                                <td>{e.extName}</td>
                                <td>
                                    <Flex styles={{ alignItems: "center" }}>
                                        <Toggle disabled={true} checked={e.active} icons={false} />
                                        <Text styles={{ marginLeft: "5px" }}>{e.active ? "Yes" : "No"}</Text>
                                    </Flex>

                                </td>
                                <td >
                                    <div className="tableEditDiv">
                                        {/* <div style={{ marginRight: "10px" }}> Edit </div> */}
                                        <div className="editButton pointer" onClick={() => this.editTaskModule(e)}  ><img src={editImage} alt=''/></div>
                                    </div>
                                </td>
                                <td style={{ textAlign: "end" }}>
                                    <div className="tableEditDiv">
                                        {/* <div style={{ marginRight: "10px" }}> Edit </div> */}
                                        <div className="editButton pointer" onClick={() => this.deleteFileExtension(e)}  ><img src={deleteIcon} alt='Delete'style={{ height: "22px", width: "22px" }} /></div>
                                    </div>
                                </td>
                            </tr>
                        })}


                    </table>
                    <div className="pagination-style">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.fileExtensionsList.length}
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



export default FileExtension;
