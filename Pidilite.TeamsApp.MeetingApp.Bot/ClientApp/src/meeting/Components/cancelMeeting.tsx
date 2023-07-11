import React from 'react';
import { Loader, FormTextArea, Button, Flex, Dropdown } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../styles.scss"
import { cancelMeetingAPI, getMeetingDetailsByIdAPI, getUserProfileAPI } from './../../apis/APIList'





interface MyState {
    loading?: any;
    meetingData?: any;
    meetingId?: any;
    meetingType?: any;
    remarks?: any;
    UpdatedBy?: any;
    UpdatedByEmail?: any;
    UpdatedByADID?: any;
    cancelType?: string;
    cancelTypeDropdown?: any;
    cancelLoading?:boolean
}

interface IViewMeetingProps {
    history?: any;
    location?: any
}

class CancelMeeting extends React.Component<IViewMeetingProps, MyState> {
    constructor(props: IViewMeetingProps) {
        super(props);
        this.state = {
            loading: true,
            remarks:'',
            cancelTypeDropdown: ["Cancel Occurrence", "Cancel Series"]
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            meetingId: params.get('id'),
            cancelType:this.state.cancelTypeDropdown[0]
        }, () => {
            this.getMeetingData(this.state.meetingId);
            this.getUserProfile();
        })
        
    }


    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                UpdatedBy: res.data.displayName,
                UpdatedByEmail: res.data.mail,
                UpdatedByADID: res.data.id
            })
        })
    }


    getMeetingData(id: any) {
        getMeetingDetailsByIdAPI(id).then((res) => {
            console.log("view meeting", res.data)
            this.setState({
                meetingData: res.data,
                loading: false,
            })
        })
    }

    selectCancelType(value: any) {
        this.setState({
            cancelType: value
        })
    }

    cancelRemarks(event: any) {
        this.setState({
            remarks: event.target.value,
        })
    }

    cancel() {
        this.setState({
            cancelLoading:true
        })
        const data = {
            "MeetingId": this.state.meetingId,
            "ParentMeetingId":  this.state.meetingData.parentMeetingId,
            "EventId": (this.state.cancelType !== 'Cancel Series') ? this.state.meetingData.eventId : null,
            "SeriesMasterId": (this.state.cancelType === 'Cancel Series') ? this.state.meetingData.seriesMasterId : null,
            "OrganiserADID": this.state.meetingData.organiserADID,
            "UpdatedBy": this.state.UpdatedBy,
            "UpdatedByEmail": this.state.UpdatedByEmail,
            "UpdatedByADID": this.state.UpdatedByADID,
            "CancelRemark":this.state.remarks
        }
        cancelMeetingAPI(data).then((res) => {
            console.log("cancel meeting", res.data)
            if (res.data.message === "Meeting cancelled successfully") {
                microsoftTeams.tasks.submitTask()
            }

        })
    }
    render() {
        return (
            <div>
                {!this.state.loading ? <div>
                    {(this.state.meetingData.repeatOption !== "DoesNotRepeat") &&
                        <Dropdown
                            fluid
                            className='m-3'
                            items={this.state.cancelTypeDropdown}
                            placeholder="Cancel types"
                            value={this.state.cancelType}
                            onChange={(event, { value }) => this.selectCancelType(value)}
                        />}
                    <FormTextArea
                        label="Cancel remarks"
                        onChange={(event) => this.cancelRemarks(event)}
                        className="cancelMeetingsRemarks m-3"
                    />
                    {/* <Flex className="footerContainer" vAlign="end" hAlign="end">

                    <Flex className="buttonContainer m-3">
                        <Button content="Cancel Meeting" id="saveBtn" onClick={() => this.cancel()} primary />
                    </Flex>
                </Flex> */}
                    <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                        <Flex space="between">
                            <Flex gap="gap.small">

                                <Button content={!this.state.cancelLoading?"Cancel Meeting":<Loader size="smaller" />} id="saveBtn" onClick={() => this.cancel()} primary />
                            </Flex>
                        </Flex>
                    </div>

                </div> : <Loader styles={{ margin: "50px" }} />}

            </div>
        );
    }
}



export default CancelMeeting;
