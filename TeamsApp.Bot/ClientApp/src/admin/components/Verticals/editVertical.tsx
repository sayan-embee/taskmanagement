import React from 'react';
import { Text, FormInput, FormDropdown, Loader, Flex, Button } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import { getVerticalsByIdAPI, updateVerticalAPI, getDivisionsAPI } from '../../../apis/APIList'

import Toggle from 'react-toggle'

interface MyState {
    verticalId?: any;
    verticalList?: any;
    editActiveStatusValue?: any;
    editNameValue?: string;
    editActiveStatus?: any;
    loading?: any;
    buttonDisabled?: any;
    errorMessage?: any;
    updatedByName?: string;
    updatedByEmail?: string;
    divisionName?: string;
    divisionId?: any;
    divisionList?: any;
    divisionInput?: any;
}

interface IVerticalEditProps {
    history?: any;
    location?: any
}

class EditVertical extends React.Component<IVerticalEditProps, MyState> {
    constructor(props: IVerticalEditProps) {
        super(props);
        this.state = {
            loading: true,
            editActiveStatus: false,
            buttonDisabled: false,
            verticalList:[]
        };
    }



    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            verticalId: params.get('id'),
        }, () => {
            microsoftTeams.initialize();
            microsoftTeams.getContext((context) => {
                console.log("context", context)
                this.setState({
                    updatedByEmail: context.userPrincipalName && context.userPrincipalName,
                })
            });
            this.getVertical(this.state.verticalId)
            this.getDivision()
        })
    }

    getDivision(){
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

    getVertical(id: any) {
        getVerticalsByIdAPI(id).then((res) => {
           console.log('vertical',res.data)
            this.setState({
                verticalList: [...this.state.verticalList,res.data],
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


    editVertical(data: any) {
        console.log("data",data)
        updateVerticalAPI(data).then((res) => {
            console.log("edit vertical", res.data);
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
            "VerticalId": data.verticalId,
            "DivisionName": this.state.divisionName?this.state.divisionName:data.divisionName,
            "DivisionId":this.state.divisionId?this.state.divisionId:data.divisionId,
            "UpdatedBy": this.state.updatedByName,
            "UpdatedByEmail": this.state.updatedByEmail,
            "VerticalName": this.state.editNameValue ? this.state.editNameValue : data.verticalName,
            "Active": this.state.editActiveStatus ? this.state.editActiveStatusValue : data.active
        }
        this.editVertical(Value)
    }

    selectDivision(data:any){
        this.state.divisionList.filter((e: any) => e.divisionName === data).map((e: any) => {
            this.setState({
                divisionId: e.divisionId,
              divisionName: data
            },()=>{
                console.log("")
            })
          })
    }

    render() {
        return (
            <div style={{ margin: "25px", height: "200px" }}>
                {!this.state.loading ? <div>
                    {this.state.verticalList && <div>
                        {this.state.verticalList.map((e: any) => {
                            return <div style={{ paddingTop: '20px', marginTop: "10px" }}>
                                <FormInput
                                    label="Vertical name"
                                    name="Vertical name"
                                    id="Name"
                                    defaultValue={e.verticalName}
                                    required fluid
                                    onChange={(e) => this.editName(e)}
                                    showSuccessIndicator={false}
                                />
                                {this.state.errorMessage && <Text className="warning">{this.state.errorMessage}</Text>}
                                {this.state.divisionInput  && <FormDropdown fluid
                                label="Division"
                                items={this.state.divisionInput}
                                styles={{ marginTop: "10px" }}
                                className="detalisViswasDropdown DropdownFontStyle font15 addInput"
                                onChange={(event, { value }) => this.selectDivision(value)}
                                placeholder="Select Division"
                                value={e.divisionName}
                              />
                            }
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



export default EditVertical;
