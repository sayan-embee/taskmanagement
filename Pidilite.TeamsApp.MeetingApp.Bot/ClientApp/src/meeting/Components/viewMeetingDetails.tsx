import React from 'react';
import { Text, FlexItem, Loader, Flex, Button, Header } from "@fluentui/react-northstar";
import { Container, Row, Col } from 'react-bootstrap';

import * as microsoftTeams from "@microsoft/teams-js";

import "./../styles.scss"
import { getMeetingDetailsByIdAPI } from './../../apis/APIList'
import { Persona, PersonaSize } from '@fluentui/react';
import moment from 'moment';

import { Editor } from "react-draft-wysiwyg";
import "./../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';





interface MyState {
    loading?: any;
    meetingData?: any;
    pages?: string;
    meetingId?: any;
    keyParticipantsList?: any;
    participantsList?: any;
    editorState?: any;
    spoFile?:string;
    spoFileLink?:string
    coAnchorsList?:any


}

interface IViewMeetingProps {
    history?: any;
    location?: any
}

class ViewMeetingDetails extends React.Component<IViewMeetingProps, MyState> {
    constructor(props: IViewMeetingProps) {
        super(props);
        this.state = {
            loading: true,
            pages: "meeting details",
            spoFile:"",
            spoFileLink:"",
            // coAnchorsList:""
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        console.log("locationnnnnnnnnnnnnnnnnnnnn",this.props.location)
        this.setState({
            meetingId: params.get('id')
        }, () => {
            this.getMeetingData(this.state.meetingId);
        })

    }

//"CoAnchors"

    getMeetingData(id: any) {
        getMeetingDetailsByIdAPI(id).then((res) => {

            console.log("view meeting", res.data)
            let spoObjFile = res.data.sPOFileUpload? res.data.sPOFileUpload.fileName : null;
            let spoObjFileLink = res.data.sPOFileUpload? res.data.sPOFileUpload.sPOWebUrl : null;
            let KeyParticipants = res.data.meetingParticipants.filter((e: any) => e.participantType === "Key Participants");
            let Participant = res.data.meetingParticipants.filter((e: any) => ((e.participantType === "Participants") || (e.participantType === "External")));
            let coAnchors = res.data.meetingParticipants.filter((e: any) => e.participantType === "CoAnchors");
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
                keyParticipantsList: KeyParticipants,
                participantsList: Participant,
                spoFile:spoObjFile,
                spoFileLink:spoObjFileLink,
                coAnchorsList: coAnchors
            })
        })
    }




    render() {
        return (
            <div>
                {!this.state.loading ? <div>
                    {(this.state.pages === 'meeting details') ? <div>
                        <div className='meeting_view_card'>
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
                                                
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                {this.state.spoFile ? 
                                <Row>
                                <div className='col-12'>
                                    <div className='d-flex mb-3'>   
                                        <div className='ms-2'>
                                            <Text className='d-block mb-1' color="grey" content="OAAP Attachment" size="small" timestamp />
                                            <div className="pointer" onClick={() => { window.open(this.state.spoFileLink) }}>
                                                <Text className='d-block' color="brand" content={this.state.spoFile} size="medium" weight="regular" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            : null}
                                
                                <div>
                                    <Flex gap="gap.small">
                                        <FlexItem push>
                                            <Button content="View participants" primary onClick={() => this.setState({ pages: "view participants" })} />
                                        </FlexItem>
                                    </Flex>
                                </div>

                            </Container>
                        </div>
                    </div> : <div>
                        <div className='meeting_view_card'>
                            <Container fluid>

                                <div className='d-flex view_meeting_participants_view gap_10'>
                                    <div>
                                        <div className='mb-4'>
                                            <Header className='mb-3' as="h3" content="Organizer" />
                                            <Persona text={this.state.meetingData.organiserName} secondaryText={this.state.meetingData.organiserEmail} size={PersonaSize.size40} />
                                        </div>
                                        <div className='mb-4'>
                                            <Header className='mb-3' as="h3" content="Anchor" />
                                            <Persona text={this.state.meetingData.anchorName} secondaryText={this.state.meetingData.anchorEmail} size={PersonaSize.size40} />
                                        </div>


                                        <div className='mb-4'>
                                            <Header className='mb-3' as="h3" content="Co Anchor" />
                                            {(this.state.coAnchorsList.length > 0) ? <div>
                                                {this.state.coAnchorsList.map((e: any) => {
                                                    return <Persona className='mb-2' text={e.participantName} secondaryText={e.participantEmail} size={PersonaSize.size40} />
                                                })}
                                            </div> : <Text color="brand" content="No Co Anchor" size="medium" weight="regular" />}
                                        </div>


                                        <div className='mb-4'>
                                            <Header className='mb-3' as="h3" content="Key participant" />
                                            {(this.state.keyParticipantsList.length > 0) ? <div>
                                                {this.state.keyParticipantsList.map((e: any) => {
                                                    return <Persona className='mb-2' text={e.participantName} secondaryText={e.participantEmail} size={PersonaSize.size40} />
                                                })}
                                            </div> : <Text color="brand" content="No Key Participants" size="medium" weight="regular" />}
                                        </div>
                                    </div>
                                    <div>
                                        <Header className='mb-3' as="h3" content="Participant" />
                                        {this.state.participantsList.map((e: any) => {
                                            return <Persona className='mb-2' text={e.participantName} secondaryText={e.participantEmail} size={PersonaSize.size40} />
                                        })}
                                    </div>
                                </div>
                                <div className='taskmoduleButtonDiv3'>
                                    <Flex gap="gap.small">
                                        <Button content="Back" secondary onClick={() => this.setState({ pages: "meeting details" })} />
                                        <FlexItem push>
                                            <Button content="Close" primary onClick={() => microsoftTeams.tasks.submitTask()} />
                                        </FlexItem>
                                    </Flex>


                                </div>

                            </Container>
                        </div>
                    </div>}
                </div> : <Loader styles={{ margin: "50px" }} />}

            </div>
        );
    }
}



export default ViewMeetingDetails;
