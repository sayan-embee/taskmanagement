import React from 'react';
import { Text, FlexItem, Loader, Flex, Button, Header } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";
import { Container, Row, Col } from 'react-bootstrap';
import "./../styles.scss"
import { getMeetingDetailsByIdAPI, getTaskDetailsByIdAPI } from './../../apis/APIList'
import { Persona, PersonaSize } from '@fluentui/react';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Editor } from "react-draft-wysiwyg";
import "./../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

interface MyState {
    loading?: any;
    meetingData?: any;
    pages?: string;
    taskId?: any;
    keyParticipantsList?: any;
    participantsList?: any;
    editorState?: any;
    taskData?: any;

}

interface IViewParticularTaskProps {
    history?: any;
    location?: any
}

class ViewParticularTask extends React.Component<IViewParticularTaskProps, MyState> {
    constructor(props: IViewParticularTaskProps) {
        super(props);
        this.state = {
            loading: true,
            taskId: ""
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            taskId: params.get('id'),
        }, () => {
            console.log("id", this.state.taskId)
            this.getTaskDetails(this.state.taskId)
        })
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
        });
    }

    getTaskDetails = (id: any) => {
        getTaskDetailsByIdAPI(id).then((res: any) => {
            console.log("res", res)
            if (res.data) {
                this.setState({
                    taskData: res.data
                }, () => {
                    this.getMeetingData(this.state.taskData.meetingId);
                })
            }
        })

    }


    getMeetingData(id: any) {
        getMeetingDetailsByIdAPI(id).then((res) => {

            console.log("view meeting", res.data)

            if (res.data.meetingDescription !== '') {
                const contentBlock = htmlToDraft(res.data.meetingDescription.slice(0, res.data.meetingDescription.length - 1));
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);
                    this.setState({
                        editorState,
                    })
                }
            }
            this.setState({
                meetingData: res.data,
                loading: false,
            })
        })
    }

    render() {
        return (
            <div>
                {!this.state.loading ? <div className="p-3">
                    <Tabs>
                        <div className="reportTab">
                            <TabList >
                                <Tab>Task Details</Tab>
                                <Tab>Meeting Summary</Tab>
                                <Tab>Self Action History</Tab>
                                <Tab>Task Log</Tab>
                            </TabList>
                        </div>


                        <TabPanel>
                            <Container fluid>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Edit20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Issue discussed(Task context)" size="small" timestamp />
                                                <Text className='d-block' content={this.state.taskData.taskContext} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <TagMultiple20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Decision taken(Action plan agreed)" size="small" timestamp />
                                                <Text className='d-block' content={this.state.taskData.taskActionPlan} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <CalendarLtr20Regular color="grey" />
                                    </div> */}
                                            {((this.state.taskData.taskPriority !== "KI") || (this.state.taskData.taskPriority !== "Minutes")) && <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Closing Date" size="small" timestamp />
                                                <div className='d-flex'>
                                                    <Text className='d-block' content={moment(this.state.taskData.taskClosureDate).format('LL')} size="medium" weight="regular" />
                                                </div>

                                            </div>}
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <ArrowRepeatAll20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Priority" size="small" timestamp />
                                                <Text className='d-block' content={this.state.taskData.taskPriority} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Channel20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Status" size="small" timestamp />
                                                <Text className='d-block' content={this.state.taskData.taskStatus} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Location20Regular color="grey" />
                                    </div> */}
                                            {((this.state.taskData.taskPriority !== "KI") || (this.state.taskData.taskPriority !== "Minutes")) && <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Assigned  to" size="small" timestamp />
                                                <Text className='d-block' content={this.state.taskData.assignedTo} size="medium" weight="regular" />
                                                <Text className='d-block' content={this.state.taskData.assignedToEmail} size="small" weight="regular" />
                                            </div>}
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <List20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2 w-100 meetingDetailsView'>
                                                <Text className='d-block' color="grey" content="Created On" size="small" timestamp />
                                                <Text className='d-block' content={moment(this.state.taskData.startDateTime).format('LL')} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>

                                </Row>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Attach20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block mb-3' color="grey" content="Attachment" size="small" timestamp />
                                                {(this.state.taskData.taskFileUpload && (this.state.taskData.taskFileUpload.length > 0)) &&
                                                    this.state.taskData.taskFileUpload.map((e: any) => {
                                                        return <div className="pointer" onClick={() => { window.open(e.fileUrl) }}><Text className='d-block' color="brand" content={e.fileName} size="medium" weight="regular" /></div>

                                                    })

                                                }
                                                {/* <Text className='d-block' color="brand" content="Sample-example-document.pdf" size="medium" weight="regular" />
                                                <Text className='d-block' color="brand" content="Another-sample-example-document.doc" size="medium" weight="regular" /> */}
                                            </div>
                                        </div>
                                    </div>
                                </Row>

                            </Container>
                        </TabPanel>
                        <TabPanel>
                            <Container fluid>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Edit20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Title" size="small" timestamp />
                                                <Text className='d-block' content={this.state.meetingData.meetingTitle} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <TagMultiple20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Type" size="small" timestamp />
                                                <Text className='d-block' content={this.state.meetingData.meetingType} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <CalendarLtr20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Date & time" size="small" timestamp />
                                                {!this.state.meetingData.allDayEvent ? <div className='d-flex' style={{ "gap": "10px" }}>
                                                    <Text className='d-block' content={moment(this.state.meetingData.startDateTime).format('LL')} size="medium" weight="regular" />
                                                    <Text className='d-block' content={moment(this.state.meetingData.startDateTime).format('h:mm a') + ' - ' + moment(this.state.meetingData.endDateTime).format('h:mm a')} size="medium" weight="regular" />
                                                </div> : <div className='d-flex'>
                                                    <Text className='d-block' content={moment(this.state.meetingData.startDateTime).format('LL')} size="medium" weight="regular" />
                                                </div>}

                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <ArrowRepeatAll20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Repeat" size="small" timestamp />
                                                <Text className='d-block' content={this.state.meetingData.repeatOption} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Channel20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Channel" size="small" timestamp />
                                                {this.state.meetingData.channelName && <Text className='d-block' content={this.state.meetingData.channelName} size="medium" weight="regular" />}
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Location20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block' color="grey" content="Location" size="small" timestamp />
                                                {this.state.meetingData.locationName && <Text className='d-block' content={this.state.meetingData.locationName} size="medium" weight="regular" />}
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <List20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2 w-100 meetingDetailsView'>
                                                <Text className='d-block' color="grey" content="Details" size="small" timestamp />
                                                {this.state.meetingData.meetingDescription && <Editor
                                                    // wrapperClassName="wrapper-class flex-fill ms-2"
                                                    // editorClassName="editor-class"
                                                    // toolbarClassName="toolbar-class"
                                                    editorState={this.state.editorState}
                                                    readOnly
                                                    toolbarHidden
                                                />}
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col-12'>
                                        <div className='d-flex mb-3'>
                                            {/* <div>
                                        <Attach20Regular color="grey" />
                                    </div> */}
                                            <div className='ms-2'>
                                                <Text className='d-block mb-3' color="grey" content="Attachment" size="small" timestamp />
                                                {(this.state.meetingData.meetingFileUpload && (this.state.meetingData.meetingFileUpload.length > 0)) &&
                                                    this.state.meetingData.meetingFileUpload.map((e: any) => {
                                                        return <div className="pointer" onClick={() => { window.open(e.fileUrl) }}><Text className='d-block' color="brand" content={e.fileName} size="medium" weight="regular" /></div>

                                                    })

                                                }
                                                {/* <Text className='d-block' color="brand" content="Sample-example-document.pdf" size="medium" weight="regular" />
                                                <Text className='d-block' color="brand" content="Another-sample-example-document.doc" size="medium" weight="regular" /> */}
                                            </div>
                                        </div>
                                    </div>
                                </Row>

                            </Container>
                        </TabPanel>
                        <TabPanel>
                        {this.state.taskData && (this.state.taskData.taskSelfActionHistory.length > 0) ? <table className="ViswasTable">
                                <thead>
                                    <tr>
                                        <th className='text-nowrap'>
                                            <Text className='mb-1 p-0' color="grey" content="Date" size="small" timestamp />
                                        </th>
                                        <th className='text-nowrap'>
                                            <Text className='mb-1 p-0' color="grey" content="Clouser Date" size="small" timestamp />
                                        </th>
                                        <th><Text className='mb-1 p-0 text-nowrap' color="grey" content="Remarks" size="small" timestamp /></th>
                                        <th><Text className='mb-1 p-0' color="grey" content="Status" size="small" timestamp /></th>
                                        <th><Text className='mb-1 p-0' color="grey" content="Action taken by" size="small" timestamp /></th>
                                    </tr>
                                </thead>
                                {this.state.taskData.taskSelfActionHistory.map((e: any) => {
                                    return <tr className="ViswasTableRow">
                                        <td><Text className='mb-1 p-0' color="grey" content={moment(e.createdOn).format('LL')} /></td>
                                        <td><Text className='mb-1 p-0' color="grey" content={moment(e.taskClosureDate).format('LL')} /></td>

                                        <td><Text className='mb-1 p-0' color="grey" content={e.taskRemarks?e.taskRemarks:"--"} /></td>
                                        <td><Text className='mb-1 p-0' color="grey" content={e.taskStatus} /></td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <Text className='mb-1 p-0' color="grey" content={e.createdBy ? e.createdBy : "--"} />
                                                <Text className='mb-1 p-0' color="grey" content={e.createdByEmail ? e.createdByEmail : "--"}  size="small"/>
                                            </div>
                                        </td>


                                    </tr>
                                })
                                }

                            </table>: <div className="noDataText"> No Data Available</div>}
                        </TabPanel>

                        <TabPanel>
                        {this.state.taskData && (this.state.taskData.taskLog.length > 0) ?  <table className="ViswasTable">
                                <thead>
                                    <tr>
                                        <th className='text-nowrap'>
                                            <Text className='mb-1 p-0' color="grey" content="Date" size="small" timestamp />
                                        </th>
                                        <th className='text-nowrap'>
                                            <Text className='mb-1 p-0' color="grey" content="Task Context" size="small" timestamp />
                                        </th>
                                        <th><Text className='mb-1 p-0 text-nowrap' color="grey" content="Decision taken" size="small" timestamp /></th>
                                        <th><Text className='mb-1 p-0' color="grey" content="Priority" size="small" timestamp /></th>
                                        <th><Text className='mb-1 p-0' color="grey" content="Assign to" size="small" timestamp /></th>
                                        <th><Text className='mb-1 p-0' color="grey" content="Closing date" size="small" timestamp /></th>
                                        <th><Text className='mb-1 p-0' color="grey" content="Action taken by" size="small" timestamp /></th>
                                    </tr>
                                </thead>

                                 {this.state.taskData.taskLog.map((e: any) => {
                                    return <tr className="ViswasTableRow">
                                        <td><Text className='mb-1 p-0' color="grey" content={moment(e.taskCreatedOn).format('LL')} /></td>
                                        <td><Text className='mb-1 p-0' color="grey" content={e.taskContext} /></td>

                                        <td><Text className='mb-1 p-0' color="grey" content={e.taskActionPlan} /></td>
                                        <td><Text className='mb-1 p-0' color="grey" content={e.taskPriority} /></td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <Text className='mb-1 p-0' color="grey" content={e.assignedTo ? e.assignedTo : "--"} />
                                                <Text className='mb-1 p-0' color="grey" content={e.assignedToEmail ? e.assignedToEmail : "--"}  size="small"/>
                                            </div>
                                        </td>

                                        <td><Text className='mb-1 p-0' color="grey" content={e.taskClosureDate ? moment(e.taskClosureDate).format('LL') : "--"} /></td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <Text className='mb-1 p-0' color="grey" content={e.actionTakenBy} />
                                                <Text className='mb-1 p-0' color="grey" content={e.actionTakenByEmail} size="small"/>
                                            </div>
                                        </td>

                                    </tr>
                                })
                                }

                                

                            </table> : <div className="noDataText"> No Data Available</div>}
                        </TabPanel>


                    </Tabs>


                </div> : <Loader styles={{ margin: "50px" }} />
                }
            </div>
        );
    }
}



export default ViewParticularTask;
