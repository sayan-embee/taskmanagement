import React from 'react';
import { Text, FormInput, Loader, Flex, Button } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import { getFileExtensionsByIdAPI, updateFileExtensionAPI } from '../../../apis/APIList'

import Toggle from 'react-toggle'

interface MyState {
    extId?: any;
    fileExtensionList?: any;
    editActiveStatusValue?: any;
    editNameValue?: any;
    editActiveStatus?: any;
    loading?: any;
    buttonDisabled?: any;
    errorMessage?: any;
    updatedByName?: string;
    updatedByEmail?: string;
}

interface IFileExtensionEditProps {
    history?: any;
    location?: any
}

class EditFileExtension extends React.Component<IFileExtensionEditProps, MyState> {
    constructor(props: IFileExtensionEditProps) {
        super(props);
        this.state = {
            loading: true,
            editActiveStatus: false,
            buttonDisabled: false,
            fileExtensionList:[]
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            extId: params.get('id'),
        }, () => {
            microsoftTeams.initialize();
            microsoftTeams.getContext((context) => {
                console.log("context", context)
                this.setState({
                    updatedByEmail: context.userPrincipalName && context.userPrincipalName,
                })
            });
            this.getFileExtension(this.state.extId)
        })
    }

    getFileExtension(id: any) {
        getFileExtensionsByIdAPI(id).then((res) => {
            this.setState({
                fileExtensionList: [...this.state.fileExtensionList,res.data],
                loading: false
            },()=>{
                console.log(res.data, this.state.fileExtensionList)
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


    editFileExtension(data: any) {
        updateFileExtensionAPI(data).then((res) => {
            console.log("edit extension", res.data);
            if (res.data.status === 1) {
                microsoftTeams.tasks.submitTask()
            }
            else{
                this.setState({
                    errorMessage:res.data.message
                })
            }
        })
    }

    editFunction(data: any) {
        const Value = {
            "ExtId": data.extId,
            "UpdatedBy": this.state.updatedByName,
            "UpdatedByEmail": this.state.updatedByEmail,
            "ExtName": this.state.editNameValue ? this.state.editNameValue : data.extName,
            "Active": this.state.editActiveStatus ? this.state.editActiveStatusValue : data.active
        }
        this.editFileExtension(Value)
    }


    render() {
        return (
            <div style={{ margin: "25px", height: "200px" }}>
                {!this.state.loading ? <div>
                    {this.state.fileExtensionList && <div>
                        {this.state.fileExtensionList.map((e: any) => {
                            return <div style={{ paddingTop: '20px', marginTop: "10px" }}>
                                <FormInput
                                    label="Extension"
                                    name="Extension"
                                    id="Name"
                                    defaultValue={e.extName}
                                    required fluid
                                    onChange={(e) => this.editName(e)}
                                    showSuccessIndicator={false}
                                />
                                {this.state.errorMessage && <Text className="warning">{this.state.errorMessage}</Text>}
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



export default EditFileExtension;
