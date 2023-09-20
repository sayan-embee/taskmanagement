import React from 'react';
import { Flex, Button, Card, CardBody, FormInput, Form, FlexItem, Text } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import Toggle from 'react-toggle'
import { insertFileExtensionAPI } from '../../../apis/APIList'



interface MyState {
    addNewInputName?: any;
    createdByName?: string;
    createdByEmail?: string;
    loading?: any;
    errorMessage?: any;
}

interface IExtensionAddProps {
}

class AddExtension extends React.Component<IExtensionAddProps, MyState> {
    constructor(props: IExtensionAddProps) {
        super(props);
        this.state = {
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
            "ExtName": this.state.addNewInputName,
            "Active": true,
            "CreatedBy": this.state.createdByName,
            "CreatedByEmail": this.state.createdByEmail,
        }
        this.addExtension(data)
    }

    addExtension(data: any) {
        insertFileExtensionAPI(data).then((res) => {
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
                                label="Extension"
                                name="Extension"
                                id="Name"
                                fluid
                                onChange={(e) => this.addNewInput(e)}
                                className="addInput"
                                showSuccessIndicator={false}
                            />
                            {this.state.errorMessage && <Text className="warning">{this.state.errorMessage}</Text>}
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
                            <Button disabled={this.state.addNewInputName ? false : true} primary onClick={() => this.addNew()}>
                                Save
                            </Button>
                        </Flex>
                    </Flex>
                </div>

            </div>
        );
    }
}



export default AddExtension;
