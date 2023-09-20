import React from 'react';
import { Flex, Button, Card, CardBody, FormInput, Form, FlexItem, Text, FormDropdown, Header, Input, Alert } from "@fluentui/react-northstar";

import * as microsoftTeams from "@microsoft/teams-js";

import "./../../styles.scss"
import Toggle from 'react-toggle'
import { insertMeetingTitleAPI, getDivisionsAPI, getMeetingTypesAPI, getVerticalsAPI, getUserProfileAPI, InsertMeetingTitleUsingFormData } from '../../../apis/APIList'

const base_URL = window.location.origin
const deleteIcon = base_URL + "/images/deleteIcon.png"
const cancelImage = base_URL + "/images/cancel.svg";

interface MyState {
    addNewInputName?: any;
    createdByName?: string;
    createdByEmail?: string;
    errorMessage?: any;
    divisionName?: string;
    divisionId?: any;
    divisionList?: any;
    divisionInput?: any;
    meetingType?: string;
    meetingTypeId?: any;
    typeList?: any;
    typeInput?: any;
    verticalName?: string;
    verticalId?: any;
    verticalList?: any;
    verticalInput?: any;
    page?: string;
    keyParticipantsFeedbackQuestionAnswer?: any;
    participantsFeedbackQuestionAnswer?: any;
    questionAnswer?: any;
    file?: any;
    uploadedFile?: any;
    errorUploadMsg?:string;
    error:boolean


}

interface IMeetingTitleAddProps {
}

class AddMeetingTitle extends React.Component<IMeetingTitleAddProps, MyState> {
    constructor(props: IMeetingTitleAddProps) {
        super(props);
        this.state = {
            page: 'TitleCreate',
            typeInput: [],
            verticalInput: [],
            divisionInput: [],
            keyParticipantsFeedbackQuestionAnswer: [],
            participantsFeedbackQuestionAnswer: [],
            questionAnswer: [],
            file: "",
            uploadedFile: [],
            error:false,

        };
    }



    componentDidMount() {
        microsoftTeams.initialize();
        this.getUserProfile();
        this.getDivision();
        this.getMeetingTypes();
    }

    getUserProfile() {
        getUserProfileAPI().then((res: any) => {
            console.log("user", res);
            this.setState({
                createdByName: res.data.displayName,
                createdByEmail: res.data.mail
            })
        })
    }

    ///////////////////////////// Get division list function ////////////////////////////
    getDivision() {
        getDivisionsAPI().then((res: any) => {
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.divisionName)
            this.setState({
                divisionInput: result,
                divisionList: list
            })
        })
    }

    selectDivision = (data: any) => {
        this.state.divisionList.filter((e: any) => e.divisionName === data).map((e: any) => {
            this.setState({
                divisionId: e.divisionId,
                divisionName: data
            }, () => {
                this.getVerticals(this.state.divisionName)
            })
        })
    }

    ///////////////////////////////////// Verticals /////////////////////////////

    getVerticals(divisionName?: string) {
        getVerticalsAPI().then((res: any) => {
            let list = res.data
            if (divisionName) {
                let result = res.data.filter((e: any) => e.active === true && e.divisionName === divisionName).map((a: any) => a.verticalName);
                console.log("api verticals get 1", result);
                this.setState({
                    verticalInput: result,
                    verticalList: list
                })
            }

        })
    }

    selectVertical(data: any) {
        this.state.verticalList.filter((e: any) => e.verticalName === data).map((e: any) => {
            this.setState({
                verticalId: e.verticalId,
                verticalName: data
            })
        })
    }

    ///////////////////////////// Get Meeting type list function ////////////////////////////
    getMeetingTypes() {
        getMeetingTypesAPI().then((res: any) => {
            // console.log("api meetingtype get", res.data);
            let list = res.data
            let result = res.data.filter((e: any) => e.active === true).map((a: any) => a.typeName)
            this.setState({
                typeInput: result,
                typeList: list
            })
        })
    }

    selectMeetingtype = (data: any) => {
        this.state.typeList.filter((e: any) => e.typeName === data).map((e: any) => {
            this.setState({
                meetingTypeId: e.typeId,
                meetingType: data
            })
        })
    }

    addNewInput(event: any) {
        this.setState({
            addNewInputName: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1),
            errorMessage: false
        })
    }


    addMeetingTitle() {
        const data = {
            "MeetingTitle": this.state.addNewInputName,
            "Active": true,
            "CreatedBy": this.state.createdByName,
            "CreatedByEmail": this.state.createdByEmail,
            "MeetingTypeId": this.state.meetingTypeId,
            "DivisionId": this.state.divisionId,
            "VerticalId": this.state.verticalId,
            "QuestionAnswerModelUTD":this.state.questionAnswer,
            "VerticalName":this.state.verticalName,
            "DivisionName":this.state.divisionName
        }
        console.log("test", data)
        this.uploadedr(data)
        // console.log("meeting title add",data)
        // insertMeetingTitleAPI(data).then((res: any) => {
        //     console.log("add type", res.data);
        //     if (res.data.status === 1) {
        //         this.setState({
        //             errorMessage: false
        //         })
        //         microsoftTeams.tasks.submitTask()
        //     }
        //     else {
        //         this.setState({
        //             errorMessage: res.data.message
        //         })

        //     }
        // })
        
    }

    uploadedr=(data:any)=>{
        console.log("file form data console 1----", data)
            var fileFormData = new FormData()
            fileFormData.append("eventData", JSON.stringify(data));
            fileFormData.append("file", this.state.file);
                console.log("file form data console----", fileFormData)
                    
            
            InsertMeetingTitleUsingFormData(fileFormData).then((res: any) => {
                console.log("uploder res", res)
                if (res.status === 200) {
                    microsoftTeams.tasks.submitTask()
                }
             })
        }
    



    onTitleCreateNext = () => {
        this.setState({
            page: 'KeyParticipantsFeedback'
        })
    }

    onKeyParticipantsFeedbackNext = () => {
        const feedback = this.state.keyParticipantsFeedbackQuestionAnswer.map((el: any, i: any) => {
            let a = el.answer.map((ele: any, j: any) => {
                let b = {
                    "Question": el.question,
                    "QuestionFor": "Key Participant",
                    "Answer": ele,
                    "QuestionActive":true,
                    "AnswerActive":true
                }
                return b
            })
            return a
        })

        const feedbackQuestionAnswer= this.simplifyArray(feedback)
      
        this.setState({
            page: 'ParticipantsFeedback',
            questionAnswer:feedbackQuestionAnswer
        })
    }
    
    onParticipantsFeedbackNext = () => {
        const feedback = this.state.participantsFeedbackQuestionAnswer.map((el: any, i: any) => {
            let a = el.answer.map((ele: any, j: any) => {
                let b = {
                    "Question": el.question,
                    "QuestionFor": "Participant",
                    "Answer": ele,
                    "QuestionActive":true,
                    "AnswerActive":true
                }
                return b
            })
            return a
        })

        const feedbackQuestionAnswer= this.simplifyArrayNext(feedback)
      
        this.setState({
            questionAnswer:feedbackQuestionAnswer
        },()=>{
            this.addMeetingTitle()
        })
    }
    
    simplifyArray = (arr = []) => {
        const res = [] as any;
        arr.forEach((element : any) => {
           element.forEach((el:any) => {
              res.push(el);
           });
        });
        return res;
     };

     simplifyArrayNext = (arr = []) => {
         const res =  [...this.state.questionAnswer]
        arr.forEach((element : any) => {
           element.forEach((el:any) => {
            res.push(el);
           });
        });
        return res;
     };
  
     ////////////////////////////////// File Upload ////////////////////////////////////////
    fileUpload() {
        (document.getElementById('upload') as HTMLInputElement).click()
        this.setState({
            error:false
        })
    };

    isValidFileUploaded=(file:any)=>{
        const validExtensions = ['doc','docx','application/msword']
        const fileExtension = file.name.split('.')[1]
        // console.log("fileExtension",fileExtension)
        // console.log("file extension validation.........",fileExtension)
        return validExtensions.includes(fileExtension)
      }

    onFileChoose(event: any) {
        console.log("file check", event.target.files)
        const file = event.target.files[0];
        if(this.isValidFileUploaded(file)){
            this.setState({
                file: event.target.files[0],
                error:false,
            },()=>console.log("templates selected",this.state.file.name))
        }
        else{
            // alert("Please choose .doc/.docx file type only")
            this.setState({
                errorUploadMsg:"Please choose doc/docx file type only",
                error:true,
            },()=>console.log("upload error msg",this.state.errorUploadMsg))
            
        }

    }

    ////////////////////////// File Remove /////////////////////////////////////////
    // filesRemoveOne(index: any) {
    //     var array = [...this.state.file];
    //     console.log("removed",array)
    //     if (index !== -1) {
    //         array.splice(index, 1);
    //         this.setState({ file: array });
    //     }
    // }

    // deleteMeetingFiles(e: any) {
    //     deleteMeetingFilesAPI(e.meetingId, e.fileId).then((res: any) => {
    //         console.log("file delete", res)
    //         if (res.data) {
    //             this.setState({
    //                 uploadedFile: res.data
    //             })
    //         }
    //     })
    // }

    render() {
        if (this.state.page === 'TitleCreate') {
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
                                    label="Meeting Title"
                                    name="Meeting Title"
                                    id="Name"
                                    fluid
                                    autoComplete="off"
                                    value={this.state.addNewInputName}
                                    className="addInput"
                                    onChange={(e) => this.addNewInput(e)}
                                    showSuccessIndicator={false}
                                />
                                {this.state.errorMessage && <Text className="warning">{this.state.errorMessage}</Text>}
                                <FormDropdown fluid
                                    label={{ content: "Meeting Type" }}
                                    styles={{ marginTop: "10px" }}
                                    items={this.state.typeInput}
                                    disabled={this.state.typeInput.length > 0 ? false : true}
                                    className="detalisViswasDropdown DropdownFontStyle font15 addInput"
                                    onChange={(event, { value }) => this.selectMeetingtype(value)}
                                    value={this.state.meetingType}
                                    placeholder="Select Meeting Type"
                                />
                                <FormDropdown fluid
                                    label={{ content: "Division" }}
                                    styles={{ marginTop: "10px" }}
                                    items={this.state.divisionInput}
                                    disabled={this.state.divisionInput.length > 0 ? false : true}
                                    className="detalisViswasDropdown DropdownFontStyle font15 addInput"
                                    onChange={(event, { value }) => this.selectDivision(value)}
                                    value={this.state.divisionName}
                                    placeholder="Select Division"
                                />
                                <FormDropdown fluid
                                    label={{ content: "Verticals" }}
                                    styles={{ marginTop: "10px" }}
                                    items={this.state.verticalInput}
                                    disabled={this.state.verticalInput.length > 0 ? false : true}
                                    className="detalisViswasDropdown DropdownFontStyle font15 addInput"
                                    onChange={(event, { value }) => this.selectVertical(value)}
                                    value={this.state.verticalName}
                                    placeholder="Select Meeting Classification"
                                />

                                <div style={{ marginTop: "10px" }}>
                                    <Text> Active</Text>
                                    <div className="outerDivToggleRadioGroup editOuterDivToggleRadioGroup">
                                        <Toggle disabled={true} checked={true} icons={false} ></Toggle>
                                        <Text styles={{ marginLeft: "5px" }}>Yes</Text>
                                    </div>

                                </div>

                                {/*--------------------------------------------file upload option phase2 start---------------------------------- */}
                                <div className='d-flex justify-content-start align-items-start mb-3'>
                                            <div className='flex-fill'>
                                                <Input type="file" id="upload" style={{ display: 'none' }} onChange={value => this.onFileChoose(value)}
                                                 accept={".doc,.docx,application/msword"}
                                                 ></Input>
                                                <div onClick={() => this.fileUpload()} className='uploadBtn pointer'>Upload OAAP Template</div>
                                            </div>
                                        </div>
                                        <Text size="medium">{this.state.file.name}</Text>
                                        {
                                        this.state.error ?   
                                        <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <Alert
                                        content={this.state.errorUploadMsg}
                                        danger
                                        header="Error"
                                        dismissAction={{
                                        'aria-label': 'close',
                                        }}
                                        dismissible
                                        />
                                        
                                        </div>
                                        
                                            : null
                                        // <div className='pr-2'>
                                        //     {(this.state.uploadedFile.length > 0) && <div>
                                        //         {this.state.uploadedFile.map((file: any, i: any) => {
                                        //             return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                        //                 <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                        //                     <Text size="medium">{file.fileName}</Text>
                                        //                     <div className="pointer backButtonMessagingExtention" 
                                        //                     >
                                        //                         <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                        //                     </div>

                                        //                 </Flex>

                                        //             </Flex>
                                        //         })}

                                        //     </div>

                                        //     }

                                        // <Text size="medium">{this.state.file.name}</Text>
                                        

                                        //    (this.state.file.length > 0) && <div>
                                        //         {this.state.file.map((file: any, i: any) => {
                                        //             return <Flex column styles={{ marginBottom: "10px" }} key={i}>
                                        //                 <Flex space="between" styles={{ marginBottom: "5px", alignItems: "center" }} >

                                        //                     <Text size="medium">{file.name}</Text>
                                        //                     <div className="pointer backButtonMessagingExtention" onClick={() => this.filesRemoveOne(i)}>
                                        //                         <img src={cancelImage} style={{ height: "12px" }} alt='Cancel' />
                                        //                     </div>

                                        //                 </Flex>

                                        //             </Flex>
                                        //         })}

                                        //     </div>

                                            }
                                        
        

                            {/*--------------------------------------------file upload option phase2 end---------------------------------- */}

                            </Form>
                        </CardBody>
                        <div  className="nextBtn ">
                        <Flex space="between">
                            <Flex gap="gap.small">
                                <Button disabled={(this.state.addNewInputName && this.state.meetingType && this.state.divisionName && this.state.verticalName) ? false : true} primary onClick={() => this.onTitleCreateNext()}>
                                    Next
                                </Button>
                            </Flex>
                        </Flex>
                    </div>
                    
                    </Card>
                    

                </div>

            );
        }
        else if (this.state.page === 'KeyParticipantsFeedback') {
            return (
                <div className="feedpackPage">

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
                            <div className="displayFlex " style={{ alignItems: "center" }}>
                                <Header as="h6" content="Feedback for key participants" className="headingText"></Header>
                                <div className="d-flex justify-content-end flex1">
                                    <Button text content="+Add Feedback" onClick={this.addQuestionKeyParticipants.bind(this)} />
                                </div>

                            </div>

                            {this.createQuestionAnswerUIKeyParticipants()}


                        </CardBody>
                    </Card>
                    <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                        <Flex space="between">
                            <Flex gap="gap.small">
                                <Button className="font15" onClick={() => this.setState({ page: 'TitleCreate' })}>Back</Button>
                                <Button primary onClick={() => this.onKeyParticipantsFeedbackNext()}>
                                    Next
                                </Button>
                            </Flex>
                        </Flex>
                    </div>

                </div>
            );
        }
        else {
            return (
                <div className="feedpackPage">

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
                            <div className="displayFlex " style={{ alignItems: "center" }}>
                                <Header as="h6" content="Feedback for participants" className="headingText"></Header>
                                <div className="d-flex justify-content-end flex1">
                                    <Button text content="+Add Feedback" onClick={this.addQuestionAnsweParticipants.bind(this)} />
                                </div>

                            </div>

                            {this.createQuestionAnswerUIParticipants()}


                        </CardBody>
                    </Card>
                    {this.state.errorMessage && <Text size="small" content={this.state.errorMessage} error/>}
                    <div className="margin20 buttonDiv mt-0 taskmoduleButtonDiv">
                        <Flex space="between">
                            <Flex gap="gap.small">
                                <Button className="font15" onClick={() => this.setState({ page: 'KeyParticipantsFeedback' })}>Back</Button>
                                <Button primary onClick={() => this.onParticipantsFeedbackNext()}>
                                    Save
                                </Button>
                            </Flex>
                        </Flex>
                    </div>

                </div>
            );
        }

    }

    private addQuestionKeyParticipants() {
        const item = {
            question: "",
            answer: []
        };
        this.setState({
            keyParticipantsFeedbackQuestionAnswer: [...this.state.keyParticipantsFeedbackQuestionAnswer, item]
        });
    }

    private createQuestionAnswerUIKeyParticipants() {
        if (this.state.keyParticipantsFeedbackQuestionAnswer.length > 0) {
            return this.state.keyParticipantsFeedbackQuestionAnswer.map((el: any, i: any) => {
                return <div className="feedbackDiv mt-3">
                    <Flex gap="gap.smaller" vAlign="center" styles={{ marginTop: "5px" }}>
                        <div style={{ width: "100%" }}>
                            <Input className="inputField"
                                fluid
                                value={el.question || ''}
                                placeholder="Question"
                                onChange={this.handleChangeKeyParticipantsQuestion.bind(this, i)}
                                autoComplete="off"
                            />

                        </div>

                        <div className="editButton pointer" onClick={this.removeQuestionsKeyParticipants.bind(this, i)}  ><img src={deleteIcon} alt='Delete' style={{ height: "22px", width: "22px" }} /></div>
                    </Flex>
                    <Button text content="+Add Answer" onClick={this.addAnswerKeyParticipants.bind(this, i)} />
                    {(this.state.keyParticipantsFeedbackQuestionAnswer[i].answer.length > 0) && <div>
                        {this.state.keyParticipantsFeedbackQuestionAnswer[i].answer.map((ele: any, index: any) => {
                            return <Flex gap="gap.smaller" vAlign="center" styles={{ marginTop: "5px" }}>
                                <div style={{ width: "100%" }}>
                                    <Input className="inputField"
                                        fluid
                                        value={(el.answer.length > 0) ? el.answer[index] : ''}
                                        placeholder="Answer"
                                        onChange={(e) => this.handleChangeKeyParticipantsanswer(i, e, index)}
                                        autoComplete="off"
                                    />

                                </div>
                                <div className="editButton pointer" onClick={() => this.removeAnswerKeyParticipants(i, index)}  ><img src={cancelImage} alt='Delete' style={{ height: "16px", width: "16px" }} /></div>
                            </Flex>
                        })}
                    </div>}
                </div>
            }
            )
        } else {
            return (
                < Flex >
                    <Text size="small" content="No Question" />
                </Flex>
            )
        }
    }

    private handleChangeKeyParticipantsQuestion(i: any, event: any) {
        let keyParticipantsFeedbackQuestionAnswer = [...this.state.keyParticipantsFeedbackQuestionAnswer];
        keyParticipantsFeedbackQuestionAnswer[i].question = event.target.value;
        this.setState({ keyParticipantsFeedbackQuestionAnswer });
    }

    private handleChangeKeyParticipantsanswer(i: any, event: any, j: any) {
        let keyParticipantsFeedbackQuestionAnswer = [...this.state.keyParticipantsFeedbackQuestionAnswer];
        keyParticipantsFeedbackQuestionAnswer[i].answer[j] = event.target.value;
        this.setState({ keyParticipantsFeedbackQuestionAnswer }, () => {
            console.log("sayan", this.state.keyParticipantsFeedbackQuestionAnswer);
        });
    }


    private removeQuestionsKeyParticipants(i: any) {
        let keyParticipantsFeedbackQuestionAnswer = [...this.state.keyParticipantsFeedbackQuestionAnswer];
        keyParticipantsFeedbackQuestionAnswer.splice(i, 1);
        this.setState({ keyParticipantsFeedbackQuestionAnswer });
    }

    private removeAnswerKeyParticipants(i: any, j: any) {
        let keyParticipantsFeedbackQuestionAnswer = [...this.state.keyParticipantsFeedbackQuestionAnswer];
        let answer = [...keyParticipantsFeedbackQuestionAnswer[i].answer];
        answer.splice(j, 1);
        console.log("sayan mondal", i, j, answer);
        keyParticipantsFeedbackQuestionAnswer[i].answer = answer
        this.setState({ keyParticipantsFeedbackQuestionAnswer }, () => {
            console.log("sayan", this.state.keyParticipantsFeedbackQuestionAnswer);
        });
    }

    private addAnswerKeyParticipants(index: any) {
        let keyParticipantsFeedbackQuestionAnswer = [...this.state.keyParticipantsFeedbackQuestionAnswer];
        let answer = [...keyParticipantsFeedbackQuestionAnswer[index].answer, ""];
        keyParticipantsFeedbackQuestionAnswer[index].answer = answer;
        this.setState({
            keyParticipantsFeedbackQuestionAnswer
        });
    }

    private addQuestionAnsweParticipants() {
        const item = {
            question: "",
            answer: []
        };
        this.setState({
            participantsFeedbackQuestionAnswer: [...this.state.participantsFeedbackQuestionAnswer, item]
        });
    }

    private createQuestionAnswerUIParticipants() {
        if (this.state.participantsFeedbackQuestionAnswer.length > 0) {
            return this.state.participantsFeedbackQuestionAnswer.map((el: any, i: any) => {
                return <div className="feedbackDiv mt-3">
                    <Flex gap="gap.smaller" vAlign="center" styles={{ marginTop: "5px" }}>
                        <div style={{ width: "100%" }}>
                            <Input className="inputField"
                                fluid
                                value={el.question || ''}
                                placeholder="Question"
                                onChange={this.handleChangeParticipantsQuestion.bind(this, i)}
                                autoComplete="off"
                            />

                        </div>

                        <div className="editButton pointer" onClick={this.removeQuestionsParticipants.bind(this, i)}  ><img src={deleteIcon} alt='Delete' style={{ height: "22px", width: "22px" }} /></div>
                    </Flex>
                    <Button text content="+Add Answer" onClick={this.addAnswerParticipants.bind(this, i)} />
                    {(this.state.participantsFeedbackQuestionAnswer[i].answer.length > 0) && <div>
                        {this.state.participantsFeedbackQuestionAnswer[i].answer.map((ele: any, index: any) => {
                            return <Flex gap="gap.smaller" vAlign="center" styles={{ marginTop: "5px" }}>
                                <div style={{ width: "100%" }}>
                                    <Input className="inputField"
                                        fluid
                                        value={(el.answer.length > 0) ? el.answer[index] : ''}
                                        placeholder="Answer"
                                        onChange={(e) => this.handleChangeParticipantsanswer(i, e, index)}
                                        autoComplete="off"
                                    />

                                </div>
                                <div className="editButton pointer" onClick={() => this.removeAnswerParticipants(i, index)}  ><img src={cancelImage} alt='Delete' style={{ height: "16px", width: "16px" }} /></div>
                            </Flex>
                        })}
                    </div>}
                </div>
            }
            )
        } else {
            return (
                < Flex >
                    <Text size="small" content="No Question" />
                </Flex>
            )
        }
    }

    private handleChangeParticipantsQuestion(i: any, event: any) {
        let participantsFeedbackQuestionAnswer = [...this.state.participantsFeedbackQuestionAnswer];
        participantsFeedbackQuestionAnswer[i].question = event.target.value;
        this.setState({ participantsFeedbackQuestionAnswer });
    }

    private handleChangeParticipantsanswer(i: any, event: any, j: any) {
        let participantsFeedbackQuestionAnswer = [...this.state.participantsFeedbackQuestionAnswer];
        participantsFeedbackQuestionAnswer[i].answer[j] = event.target.value;
        this.setState({ participantsFeedbackQuestionAnswer }, () => {
            console.log("sayan", this.state.participantsFeedbackQuestionAnswer);
        });
    }


    private removeQuestionsParticipants(i: any) {
        let participantsFeedbackQuestionAnswer = [...this.state.participantsFeedbackQuestionAnswer];
        participantsFeedbackQuestionAnswer.splice(i, 1);
        this.setState({ participantsFeedbackQuestionAnswer });
    }

    private removeAnswerParticipants(i: any, j: any) {
        let participantsFeedbackQuestionAnswer = [...this.state.participantsFeedbackQuestionAnswer];
        let answer = [...participantsFeedbackQuestionAnswer[i].answer];
        answer.splice(j, 1);
        console.log("sayan mondal", i, j, answer);
        participantsFeedbackQuestionAnswer[i].answer = answer
        this.setState({ participantsFeedbackQuestionAnswer }, () => {
            console.log("sayan", this.state.participantsFeedbackQuestionAnswer);
        });
    }

    private addAnswerParticipants(index: any) {
        let participantsFeedbackQuestionAnswer = [...this.state.participantsFeedbackQuestionAnswer];
        let answer = [...participantsFeedbackQuestionAnswer[index].answer, ""];
        participantsFeedbackQuestionAnswer[index].answer = answer;
        this.setState({
            participantsFeedbackQuestionAnswer
        });
    }

}



export default AddMeetingTitle;



