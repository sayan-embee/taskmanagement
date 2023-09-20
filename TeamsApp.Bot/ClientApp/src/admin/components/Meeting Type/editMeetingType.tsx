import React from 'react';
import { Text, FormInput, FormDropdown, Loader, Flex, Button } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import { getMeetingTypesByIdAPI, updateMeetingTypeAPI } from '../../../apis/APIList'

import Toggle from 'react-toggle'

interface MyState {
    typeId?: any;
    meetingTypeList?: any;
    editActiveStatusValue?: any;
    editNameValue?: any;
    editActiveStatus?: any;
    loading?: any;
    buttonDisabled?: any;
    errorMessage?: any;
    updatedByName?: string;
    updatedByEmail?: string;
    classification?: string;
    classificationTypeInput?: any;
}

interface IMeetingTypeEditProps {
    history?: any;
    location?: any
}

class EditMeetingType extends React.Component<IMeetingTypeEditProps, MyState> {
    constructor(props: IMeetingTypeEditProps) {
        super(props);
        this.state = {
            loading: true,
            editActiveStatus: false,
            buttonDisabled: false,
            classificationTypeInput: ['Review Meeting', 'General Meeting'],
            meetingTypeList:[]
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            typeId: params.get('id'),
        }, () => {
            microsoftTeams.initialize();
            microsoftTeams.getContext((context) => {
                console.log("context", context)
                this.setState({
                    updatedByEmail: context.userPrincipalName && context.userPrincipalName,
                })
            });
            this.getMeetingType(this.state.typeId)
        })
    }

    getMeetingType(id: any) {
        getMeetingTypesByIdAPI(id).then((res) => { 
            this.setState({
                meetingTypeList: [...this.state.meetingTypeList,res.data],
                loading: false
            })

        })
    }

    editActiveStatus = (e: any) => {
        this.setState({
            editActiveStatusValue: e.target.checked ? true : false,
            editActiveStatus: true
        })
    }

    editName(e: any) {
        if (e.target.value.length === 0) {
            this.setState({
                buttonDisabled: true
            })
        }
        else {
            this.setState({
                buttonDisabled: false
            })
        }
        this.setState({
            editNameValue: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
            errorMessage: false
        })
    }


    editMeetingType(data: any) {
        updateMeetingTypeAPI(data).then((res) => {
            console.log("edit type", res.data);
            if (res.data.status === 1) {
                microsoftTeams.tasks.submitTask()
            }
            else {
                this.setState({
                    errorMessage: res.data.message
                })
            }
        })
    }

    editFunction(data: any) {
        const Value = {
            "TypeId": data.typeId,
            "Classification": this.state.classification?this.state.classification:data.classification,
            "UpdatedBy": this.state.updatedByName,
            "UpdatedByEmail": this.state.updatedByEmail,
            "TypeName": this.state.editNameValue ? this.state.editNameValue : data.typeName,
            "Active": this.state.editActiveStatus ? this.state.editActiveStatusValue : data.active
        }
        this.editMeetingType(Value)
    }

    classificationType = (data: any) => {
        this.setState({
            classification: data
        })
      }

    render() {
        return (
            <div style={{ margin: "25px", height: "200px" }}>
                {!this.state.loading ? <div>
                    {this.state.meetingTypeList && <div>
                        {this.state.meetingTypeList.map((e: any) => {
                            return <div style={{ paddingTop: '20px', marginTop: "10px" }}>
                                <FormInput
                                    label="Meeting Type"
                                    name="Meeting Type"
                                    id="Name"
                                    defaultValue={e.typeName}
                                    required fluid
                                    onChange={(e) => this.editName(e)}
                                    showSuccessIndicator={false}
                                />
                                {this.state.errorMessage && <Text className="warning">{this.state.errorMessage}</Text>}
                                <FormDropdown fluid
                                    label={{ content: "Meeting Classification" }}
                                    styles={{ marginTop: "10px" }}
                                    items={this.state.classificationTypeInput}
                                    className="detalisViswasDropdown DropdownFontStyle font15 addInput"
                                    onChange={(event, { value }) => this.classificationType(value)}
                                    value={e.classification}
                                />
                                <div style={{ marginTop: "10px" }}>
                                    <Text> Active</Text>
                                    <div className="outerDivToggleRadioGroup editOuterDivToggleRadioGroup">
                                        <Toggle defaultChecked={e.active} icons={false} onChange={(e) => this.editActiveStatus(e)} ></Toggle>
                                        <Text styles={{ marginLeft: "5px" }}>Yes</Text>
                                    </div>

                                </div>



                                <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                                    <Flex space="between">
                                        <Flex gap="gap.small">
                                            <Button className="font15" onClick={() => microsoftTeams.tasks.submitTask()}>Cancel</Button>
                                            <Button disabled={this.state.buttonDisabled ? true : false} primary onClick={() => this.editFunction(e)}>
                                                Update
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </div>

                            </div>
                        })}
                    </div>}
                </div> : <Loader styles={{ margin: "50px" }} />}

            </div>
        );
    }
}



export default EditMeetingType;
