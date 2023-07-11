 import React from 'react';
import { Flex, Button, Card, CardBody, FormInput, Form, FlexItem, Text, FormDropdown } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import Toggle from 'react-toggle'
import { insertMeetingTypeAPI } from '../../../apis/APIList'



interface MyState {
    addNewInputName?: any;
    createdByName?: string;
    createdByEmail?: string;
    classification?: string;
    loading?: any;
    errorMessage?: any;
    classificationTypeInput?:any;
}

interface IMeetingTypeAddProps {
}

class AddMeetingType extends React.Component<IMeetingTypeAddProps, MyState> {
    constructor(props: IMeetingTypeAddProps) {
        super(props);
        this.state = {
            classificationTypeInput:['Review Meeting','General Meeting']
        };
    }



    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            console.log("context", context)
            this.setState({
                createdByEmail:context.userPrincipalName && context.userPrincipalName,
            })
        });
    }


    addNewInput(event: any) {
        this.setState({
            addNewInputName: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1),
            errorMessage: false
        })
    }

    addNew() {
        const data = {
            "TypeName": this.state.addNewInputName,
            "Active": true,
            "Classification": this.state.classification,
            "CreatedBy": this.state.createdByName,
            "CreatedByEmail": this.state.createdByEmail,
        }
        this.addMeetingType(data)
    }

    addMeetingType(data: any) {
        insertMeetingTypeAPI(data).then((res) => {
            console.log("add type", res.data);
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

    classificationType = (data: any) => {
        this.setState({
            classification: data
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
                            paddingTop: '10px'
                        }}>
                            <FormInput
                                label="Type name"
                                name="Type name"
                                id="Name"
                                fluid
                                className="addInput"
                                onChange={(e) => this.addNewInput(e)}
                                showSuccessIndicator={false}
                            />
                            {this.state.errorMessage && <Text className="warning">{this.state.errorMessage}</Text>}
                            <FormDropdown fluid
                                label={{ content: "Meeting Classification" }}
                                styles={{ marginTop: "10px" }}
                                items={this.state.classificationTypeInput}
                                className="detalisViswasDropdown DropdownFontStyle font15 addInput"
                                onChange={(event, { value }) => this.classificationType(value)}
                                value={this.state.classification}
                                placeholder="Select Meeting Classification"
                            />

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
                            <Button disabled={(this.state.addNewInputName && this.state.classification) ? false : true} primary onClick={() => this.addNew()}>
                                Save
                            </Button>
                        </Flex>
                    </Flex>
                </div>

            </div>
        );
    }
}



export default AddMeetingType;
