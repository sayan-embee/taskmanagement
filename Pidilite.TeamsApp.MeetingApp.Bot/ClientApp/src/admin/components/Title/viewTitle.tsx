import React, { Component } from 'react';
import { Flex, Button, Card, CardBody, FormInput, Form, FlexItem, Text, FormDropdown, Header, Input, Loader, OpenOutsideIcon } from '@fluentui/react-northstar';
import { getMeetingTitleByIdAPI } from '../../../apis/APIList'

import * as microsoftTeams from "@microsoft/teams-js";
import moment from 'moment';
const baseUrl = window.location.origin;

const backImage = baseUrl + "/images/left-arrow.svg";



type MyState = {
    titleId?: any
    loading?: boolean;
    titleData?: any;
    page?: string;
    keyParticipantsFeedbackQuestionAnswer?: any;
    participantsFeedbackQuestionAnswer?: any;
};

interface ITitleViewProps {
    history?: any;
    location?: any
}

class TitleView extends React.Component<ITitleViewProps, MyState> {
    constructor(props: ITitleViewProps) {
        super(props)
        this.state = {
            loading: true,
            page: 'TitleCreate',
            keyParticipantsFeedbackQuestionAnswer: [],
            participantsFeedbackQuestionAnswer: [],
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();
        const params = new URLSearchParams(this.props.location.search);
        this.setState({
            titleId: params.get('id')
        }, () => {
            this.getmeetingTitleData()
        })
    }

    getmeetingTitleData() {
        getMeetingTitleByIdAPI(this.state.titleId).then((res: any) => {
            let keyParticipantsQuestionAnswer = res.data.feedbackQuestions ? res.data.feedbackQuestions.filter((e: any) => e.questionFor === "Key Participant") : [];
            let participantsQuestionAnswer = res.data.feedbackQuestions ? res.data.feedbackQuestions.filter((e: any) => e.questionFor === "Participant") : [];
            console.log("QA=key---------------------------", keyParticipantsQuestionAnswer)
            console.log("QA=participant---------------------------", participantsQuestionAnswer)
            if (res.data) {
                this.setState({
                    titleData: res.data,
                    loading: false,
                    keyParticipantsFeedbackQuestionAnswer: keyParticipantsQuestionAnswer,
                    participantsFeedbackQuestionAnswer: participantsQuestionAnswer,
                })
            }
        })
    }


    render() {
        return (
            <div className='p-3 h-100'>

                {!this.state.loading ?
                    <div>
                        {this.state.page === "TitleCreate" && this.state.titleData.meetingTitle 
                        && this.state.titleData.meetingTitle.length > 0 ?
                            <div>
                                <div className='mt-3'>
                                    <div className='d-flex flex-column'>
                                        <Text content="Title"></Text>
                                        <Text content={this.state.titleData.meetingTitle} weight="semibold" size="medium" />
                                    </div>
                                    <div className='d-flex flex-column mt-3'>
                                        <Text content="Meeting Type"></Text>
                                        <Text content={this.state.titleData.meetingType} weight="semibold" size="medium" />
                                    </div>
                                    <div className='d-flex flex-column mt-3'>
                                        <Text content="Division"></Text>
                                        <Text content={this.state.titleData.divisionName} weight="semibold" size="medium" />
                                    </div>
                                    <div className='d-flex flex-column mt-3'>
                                        <Text content="Verticals"></Text>
                                        <div className='d-flex flex-column'>
                                            <Text content={this.state.titleData.verticalName} size="medium" weight="semibold" />
                                        </div>

                                    </div>
                                    {this.state.titleData.meetingTitleFileUpload? 
                                    <div className='d-flex flex-column mt-3'>
                                    <Text content="Meeting Title File"></Text>
                                    <div>
                                        <Text content={this.state.titleData.meetingTitleFileUpload.meetingTitleFileName} size="medium" weight="semibold"/>
                                         <OpenOutsideIcon style={{ cursor: "pointer",marginLeft:"3px" }}  onClick={() => window.open(this.state.titleData.meetingTitleFileUpload.sPOWebUrl, "_blank")}/>
                                        
                                    </div>

                                </div>
                                    :
                                    <div className='d-flex flex-column mt-3'>
                                    <Text content="Meeting Title File"></Text>
                                    </div>
                                    }
                                    

                                </div>
                                <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                                    <Flex space="between">
                                        <Flex gap="gap.small">
                                            <Button primary onClick={() => {
                                                this.setState({
                                                    page: 'KeyParticipantsFeedback'
                                                })
                                            }}>
                                                Next
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </div>

                            </div>

                            :

                            this.state.page === "KeyParticipantsFeedback" 
                            && this.state.keyParticipantsFeedbackQuestionAnswer 
                            && this.state.keyParticipantsFeedbackQuestionAnswer.length > 0 ?
                            
                                <div className='mt-3'>
                                    <Header as="h6" content="Key Participants Feedback" className="headingText"></Header>
                                    <br />
                                    <div className='d-flex flex-column'>
                                        {this.state.keyParticipantsFeedbackQuestionAnswer.map((el: any, i: any)=>{
                                            console.log("el value",el);
                                            return (<div className="feedbackDiv mt-3">
                                                <Flex gap="gap.smaller" vAlign="center" styles={{ marginTop: "5px" }}>
                                                    <div style={{ width: "100%" }}>
                                                        <Text className="inputField" size="medium" key={el.questionId}>{el.question}</Text>
                                                        <br/>
                                                        {el.feedbackQuestionAnswers.map((ele:any)=>(
                                                            <Text key={ele.answerId} size="medium" weight="semibold">{ele.answer}<br/></Text>
                                                        ))}

                                                    </div>
                                                </Flex>
                                            </div>)
                                        })}
                                    </div>
                                        <br/>
                                    <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv2">
                                        <Flex space="between">
                                            <Flex gap="gap.small">
                                            <Button className="font15" onClick={() => this.setState({ page: "TitleCreate" })}>Back</Button>
                                                <Button primary onClick={() => {
                                                    this.setState({
                                                        page: 'ParticipantsFeedback'
                                                    })
                                                }}>
                                                    Next
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </div>

                                </div>



                                : 
                                this.state.page === "KeyParticipantsFeedback"  ?
                                
                                <div className='mt-3'>
                                    <Header as="h6" content="key participants Feedback" className="headingText"></Header>
                                    <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                                        <Flex space="between">
                                            <Flex gap="gap.small">
                                            <Button className="font15" onClick={() => this.setState({ page: "TitleCreate" })}>Back</Button>
                                                <Button primary onClick={() => {
                                                    this.setState({
                                                        page: 'ParticipantsFeedback'
                                                    })
                                                }}>
                                                    Next
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </div>
                                    </div> 
                                    
                                    :

                                    this.state.page === "ParticipantsFeedback" 
                                    && this.state.participantsFeedbackQuestionAnswer 
                                    && this.state.participantsFeedbackQuestionAnswer.length > 0 ?
                                    <div className='mt-3'>
                                        <Header as="h6" content="Participants Feedback" className="headingText"></Header>
                                        <br />
                                        <div className='d-flex flex-column'>
                                        {this.state.participantsFeedbackQuestionAnswer.map((el: any, i: any)=>{
                                            console.log("el value",el);
                                            return (<div className="feedbackDiv mt-3">
                                                <Flex gap="gap.smaller" vAlign="center" styles={{ marginTop: "5px" }}>
                                                    <div style={{ width: "100%" }}>
                                                        <Text className="inputField" size="medium" key={el.questionId}>{el.question}</Text>
                                                        <br/>
                                                        {el.feedbackQuestionAnswers.map((ele:any)=>(
                                                            <Text  size="medium" weight="semibold">{ele.answer}<br/></Text>
                                                        ))}

                                                    </div>
                                                </Flex>
                                            </div>)
                                        })}
                                    </div>
                                        {/* <div className='d-flex flex-column'>
                                            <Text content={this.state.participantsFeedbackQuestionAnswer[0].question}></Text>
                                        </div>
                                        <br />
                                        {this.state.participantsFeedbackQuestionAnswer[0].feedbackQuestionAnswers.map((data: any, i: number) => {
                                            return (
                                                <li style={{ listStyle: "none" }}>{i + 1}-&nbsp;<Text size="medium" weight="semibold" key={i} content={data.answer}></Text></li>
                                            )
                                        })} */}
                                        <br/>
                                        <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv2">
                                            <Flex space="between">
                                                <Flex gap="gap.small">
                                                <Button className="font15" onClick={() => this.setState({ page: "KeyParticipantsFeedback" })}>Back</Button>
                                                    <Button content="Close" primary onClick={() => microsoftTeams.tasks.submitTask()} />
                                                </Flex>
                                            </Flex>
                                        </div>

                                    </div>


                                    : 
                                    this.state.page === "ParticipantsFeedback"?
                                    <div className='mt-3'>
                                    <Header as="h6" content="Participants Feedback" className="headingText"></Header>
                                    <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                                            <Flex space="between">
                                                <Flex gap="gap.small">
                                                <Button className="font15" onClick={() => this.setState({ page: "KeyParticipantsFeedback" })}>Back</Button>
                                                    <Button content="Close" primary onClick={() => microsoftTeams.tasks.submitTask()} />
                                                </Flex>
                                            </Flex>
                                        </div>
                                    </div> 
                        :null
                                    
                                }
                                

                                {/* {this.state.page === "ParticipantsFeedback" && this.state.participantsFeedbackQuestionAnswer[0] ?
                                    <div className='mt-3'>
                                        <Header as="h6" content="participants Feedback" className="headingText"></Header>
                                        <br />
                                        <div className='d-flex flex-column'>
                                            <Text content={this.state.participantsFeedbackQuestionAnswer[0].question}></Text>
                                        </div>
                                        <br />
                                        {this.state.participantsFeedbackQuestionAnswer[0].feedbackQuestionAnswers.map((data: any, i: number) => {
                                            return (
                                                <li style={{ listStyle: "none" }}>{i + 1}-&nbsp;<Text size="medium" weight="semibold" key={i} content={data.answer}></Text></li>
                                            )
                                        })}

                                        <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                                            <Flex space="between">
                                                <Flex gap="gap.small">
                                                <Button className="font15" onClick={() => this.setState({ page: "KeyParticipantsFeedback" })}>Back</Button>
                                                    <Button content="Close" primary onClick={() => microsoftTeams.tasks.submitTask()} />
                                                </Flex>
                                            </Flex>
                                        </div>

                                    </div>


                                    : 
                                    null
                                        
                        } */}




                    </div> //parent

                    : <Loader styles={{ margin: "50px" }} />}


            </div>
        );
    }
}

export default TitleView;