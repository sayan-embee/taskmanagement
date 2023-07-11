import React from 'react';
import { Text, FormInput, Loader, Flex, Button } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import { getDivisionByIdAPI, updateDivisionAPI } from '../../../apis/APIList'

import Toggle from 'react-toggle'

interface MyState {
    divisionId?: any;
    divisionList?: any;
    editActiveStatusValue?: any;
    editNameValue?: any;
    editActiveStatus?: any;
    loading?: any;
    buttonDisabled?: any;
    errorMessage?: any;
    updatedByName?: string;
    updatedByEmail?: string;
}

interface IDivisionEditProps {
    history?: any;
    location?: any
}

class EditDivision extends React.Component<IDivisionEditProps, MyState> {
    constructor(props: IDivisionEditProps) {
        super(props);
        this.state = {
            loading: true,
            editActiveStatus: false,
            buttonDisabled: false,
            divisionList:[]
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            divisionId: params.get('id'),
        }, () => {
            microsoftTeams.initialize();
            microsoftTeams.getContext((context) => {
                console.log("context", context)
                this.setState({
                    updatedByEmail: context.userPrincipalName && context.userPrincipalName,
                })
            });
            this.getDivision(this.state.divisionId)
        })
    }

    getDivision(id: any) {
        getDivisionByIdAPI(id).then((res) => {
            this.setState({
                divisionList: [...this.state.divisionList,res.data],
                loading: false
            },()=>{
                console.log("check", this.state.divisionList)
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


    editDivision(data: any) {
        updateDivisionAPI(data).then((res) => {
            console.log("edit division", res.data);
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
            "DivisionId": data.divisionId,
            "UpdatedBy": this.state.updatedByName,
            "UpdatedByEmail": this.state.updatedByEmail,
            "DivisionName": this.state.editNameValue ? this.state.editNameValue : data.divisionName,
            "Active": this.state.editActiveStatus ? this.state.editActiveStatusValue : data.active
        }
        this.editDivision(Value)
    }


    render() {
        return (
            <div style={{ margin: "25px", height: "200px" }}>
                {!this.state.loading ? <div>
                    {this.state.divisionList && <div>
                        {this.state.divisionList.map((e: any) => {
                            return <div style={{ paddingTop: '20px', marginTop: "10px" }}>
                                <FormInput
                                    label="Division name"
                                    name="Division name"
                                    id="Name"
                                    defaultValue={e.divisionName}
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



export default EditDivision;
