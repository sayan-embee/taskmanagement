import React from 'react';
import { Flex, Button, Card, CardBody, FormInput, Form, FlexItem, Text, FormDropdown } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import Toggle from 'react-toggle'
import { insertVerticalAPI, getDivisionsAPI } from '../../../apis/APIList'



interface MyState {
    addNewInputName?: any;
    createdByName?: string;
    createdByEmail?: string;
    divisionName?: string;
    divisionId?: any;
    divisionList?: any;
    divisionInput?: any;
    loading?: any;
    errorMessage?: any;
}

interface IVerticalAddProps {
}

class AddVertical extends React.Component<IVerticalAddProps, MyState> {
    constructor(props: IVerticalAddProps) {
        super(props);
        this.state = {
        };
    }



    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
            this.setState({
                createdByEmail:context.userPrincipalName && context.userPrincipalName
            })
        });
        this.getDivision()
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

    addNewInput(event: any) {
        this.setState({
            addNewInputName: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1),
            errorMessage: false
        })
    }

    addNew() {
        const data = {
            "VerticalName": this.state.addNewInputName,
            "Active": true,
            "DivisionName": this.state.divisionName,
            "DivisionId":this.state.divisionId,
            "CreatedBy": this.state.createdByName,
            "CreatedByEmail": this.state.createdByEmail,
        }
        this.addVertical(data)
    }

    addVertical(data: any) {
        insertVerticalAPI(data).then((res) => {
            console.log("add vertical", res.data);
            if (res.data.status === 1) {
                this.setState({
                    errorMessage: false
                })
                microsoftTeams.tasks.submitTask()
            }
            else {
                this.setState({
                    errorMessage: res.data.message
                })

            }
        })
    }

    selectDivision(data:any){
        this.state.divisionList.filter((e: any) => e.divisionName === data).map((e: any) => {
            this.setState({
                divisionId: e.divisionId,
              divisionName: data
            })
          })
    }

    render() {

        return (
            <div style={{ margin: "25px", height: "150px" }}>
                <Card fluid styles={{
                    display: 'block',
                    backgroundColor: 'transparent',
                    padding: '0',
                    marginTop: "10px",
                    ':hover': {
                        backgroundColor: 'transparent',
                    },
                }}>
                    <CardBody>

                        <Form styles={{
                            paddingTop: '20px'
                        }}>
                            <FormInput
                                label="Vertical name"
                                name="Vertical name"
                                id="Name"
                                fluid
                                className="addInput"
                                onChange={(e) => this.addNewInput(e)}
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
                                value={this.state.divisionName}
                              />
                            }
                            <div style={{ marginTop: "10px" }}>
                                <Text> Active</Text>
                                <div className="outerDivToggleRadioGroup editOuterDivToggleRadioGroup">
                                    <Toggle disabled={true} checked={true} icons={false} ></Toggle>
                                    <Text styles={{ marginLeft: "5px" }}>Yes</Text>
                                </div>
                            </div>
                            
                        </Form>
                    </CardBody>
                    
                </Card>
                <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                    <Flex space="between">
                        <Flex gap="gap.small">
                            <Button className="font15" onClick={() => microsoftTeams.tasks.submitTask()}>Cancel</Button>
                            <Button disabled={(this.state.addNewInputName && this.state.divisionName) ? false : true} primary onClick={() => this.addNew()}>
                                Save
                            </Button>
                        </Flex>
                    </Flex>
                </div>

            </div>
        );
    }
}



export default AddVertical;
