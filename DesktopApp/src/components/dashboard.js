import React,{ useState } from 'react'
import SideBar from "./SideBar";
import {Button,InputGroup,Form} from "react-bootstrap";
import '../assets/css/dashboard.css';
import Modal from "react-bootstrap/Modal";
import {Multiselect} from "multiselect-react-dropdown";
import $ from 'jquery';
import {useHistory} from "react-router-dom";
import { faCalendarDay, faShareSquare, faCopy} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

var roomLink="roomLink";
let data, selectMeetingPurposeRadio, selectMeetingTypeRadio,  selectedValue = []



function MyVerticallyCenteredModal(props) {
    let  options
    options = [{id: 1, name: "Dharmil", email: "Ashosh@gmail.com"},
        {id: 2, name: "Ashu", email: "Ashutosh@gmail.com"},
       ]

    function onSelect(selectedList, selectedItem) {
        selectedValue = [...selectedValue, selectedItem]
    }

    function onRemove(selectedList, removedItem) {
        selectedValue = selectedValue.filter(e => {
            return e.id !== removedItem.id
        })
    }

    $(document).ready(function() {
        $('#btn-click').click(function () {
            $('#participants').css("display", "block");
            $('#modal').attr("data-dismiss", "modal");
        });
        document.getElementById('create-room').addEventListener('click', e => {
            const script = document.createElement("script");

            script.src = "../assets/js/rtc.js";
            script.async = true;
        
            document.body.appendChild(script);  
  
            let roomName = "room-name";
            let yourName = "myname";
        
            if (roomName && yourName) {
               roomLink = `https://320032dfb596.ngrok.io/video?room=${ roomName.trim().replace( ' ', '_' ) }_${ helpers.generateRandomString() }`;
                console.log("Host: ");
                console.log(roomLink);
                // location.href = roomLink;
                console.log(document.getElementById("url1").value);
                
            
            } else {
                document.querySelector('#err-msg').innerHTML = "All fields are required";
            }
        });
        document.getElementById('join').addEventListener('click',()=>{
            console.log("url");
            console.log(roomLink);
            location.href=roomLink;
        });
        
    });

    function loadPermissions() {
        let i = 0
        console.log(selectedValue.length)
        let participants = ''
        for (i = 0; i < selectedValue.length; i++) {
            participants
                += `<div className="row">`
                        + `<div className="col-md-3">`
                            + `<label class="margin">${selectedValue[i].email}</label>`
                            // +`<div class="" onchange={handleCheckbox}>`
                                + `<label class="margin-x">`
                                    + `<input class=""  id = "readCheckbox" type="checkbox" value="read">read`
                                + `</label>`
                                + `<label class="margin-x">`
                                    + `<input class=""  id = "writeCheckbox" type="checkbox" value="write">write`
                                + `</label>`
                                + `<label class="margin-x">`
                                    + `<input class=""  id = "bothCheckbox" type="checkbox" value="both">both`
                                + `</label>`
                            // + `</div>`
                        + `</div>`;
                    +`</div>`;
        }
        document.getElementById('participants').innerHTML = participants
    }

    return (
        <Modal
            id="modal"
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Share the Link
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Multiselect
                    options={options}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    displayValue="email"
                />  
                 <div className="participants">
                    <div id="participants"></div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    id="btn-click"
                    className="btn-success"
                    onClick={loadPermissions}>
                    Give Permissions
                </Button>
            </Modal.Footer>
        </Modal>
        );
    }

function ScheduleMeetingModal(props){
    return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
            Meeting Details
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <InputGroup className="mb-3">
            <Form.Control
                placeholder="DateTimePicker"
                aria-label="Date"
                type="datetime-local"
                aria-describedby="basic-addon2"
            />  
            <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">
                <i>
                    <FontAwesomeIcon icon={faCalendarDay}/>
                </i>
                </InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
        <InputGroup className="mb-3">
            <Form.Control id="" type="text" placeholder="Readonly input here..." value={roomLink} readOnly/>
            <InputGroup.Append>
                <Button>
                    <FontAwesomeIcon icon={faShareSquare}/>
                </Button>
            </InputGroup.Append>
        </InputGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onHide}>Close</Button>
    </Modal.Footer>
  </Modal>)
}

function HostMeetingModal(props){
    function copyToClipBoard(){
        var copyTextarea = document.querySelector('#readonlytext')
        copyTextarea.focus();
        copyTextarea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    }
    return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
            Meeting Details
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>  
        <InputGroup className="mb-3">
        <Form.Control id="readonlytext" type="text" placeholder="Readonly input here..." value={roomLink} readOnly />
                        <InputGroup.Append>
                <Button onClick={copyToClipBoard}>
                    <FontAwesomeIcon icon={faCopy}/>
                </Button>
            </InputGroup.Append>
        </InputGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button >Share</Button>
      <button type="submit" id='join' className="btn">Join</button>
    </Modal.Footer>
  </Modal>)
}

export default function dashboard(props) {
    const [modalShow, setModalShow] = React.useState(false);
    const [modalShowSch, setModalShowSch] = React.useState(false);
    const [modalShowHost, setModalShowHost] = React.useState(false);
    function selectMeetingPurpose(event) {
        selectMeetingPurposeRadio = event.target.value
        console.log(selectMeetingPurposeRadio)
    }

    function selectMeetingType(event) {
        selectMeetingTypeRadio = event.target.value
        console.log(selectMeetingTypeRadio)
    }

    const history = useHistory();




    return (
        <div>
            <SideBar/>
            <h3 id="main-heading" className="d-flex justify-content-center">
                Schedule Meeting
            </h3>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-radius" id="main-div">
                            <div className="d-flex justify-content-left mt-4 mx-4">
                                <input id="meetingTitle" className="text-muted form-control" type="text"
                                    placeholder="Meeting Title"/>
                            </div>
                            <div className="d-flex justify-content-left mt-4 mx-4">
                            <textarea className="text-muted form-control" rows="5" id="meetingDesc"
                                    placeholder="Description">
                            </textarea>
                            </div>
                            <hr/>
                            <div onChange={selectMeetingPurpose} className="ml-5">
                                <label id="generalMeeting" htmlFor="general-meeting"
                                    className="px-2">
                                    <input type="radio" id="general-meeting" value="General Meeting"
                                        name="Meeting"/>
                                    General Meeting
                                </label>
                                <label id="caseHearing" htmlFor="case-hearing"
                                    className="px-2">
                                    <input type="radio" id="case-hearing" value="Case Hearing"
                                        name="Meeting"/>
                                    Case Hearing
                                </label>
                                <label id="policeConference" htmlFor="police-conference"
                                    className="px-2">
                                    <input type="radio" id="police-conference" value="Police Conference"
                                        name="Meeting"/>
                                    Police Conference
                                </label>
                            </div>
                            <hr/>
                           
                            <div onChange={selectMeetingType} className="ml-5">
                                <label id="publicMeeting" htmlFor="public-meeting"
                                    className="px-2">
                                    <input type="radio" id="public-meeting" value="Public Meeting"
                                        name="MeetingType"/>
                                    Public Meeting
                                </label>
                                <label id="privateMeeting" htmlFor="private-meeting"
                                    className="px-2">
                                    <input type="radio" id="private-meeting" value="Private Meeting"
                                        name="MeetingType"/>
                                    Private Meeting
                                </label>
                            </div>
                            <div className="d-flex justify-content-left my-3 mx-4">
                                <Button id="btnInvite" onClick={()=>setModalShow(true)}
                                        className="btnform-control">
                                    Invite People</Button>
                                <MyVerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="footerButtons mt-3">
                    <Button id="btnScheduleMeeting" onClick={()=>setModalShowSch(true)}
                            className="btn btn-meeting">
                        Schedule Meeting
                    </Button>
                    <ScheduleMeetingModal
                        show={modalShowSch}
                        onHide={() => setModalShowSch(false)}
                    />
                    <button type="submit" id='create-room' onClick={()=>setModalShowHost(true)}
                            className="btn btn-meeting">
                        Host Meeting
                    </button>
                    <HostMeetingModal
                        show={modalShowHost}
                        onHide={() => setModalShowHost(false)}
                    />
                </div>  
            </div>
        </div>
    );
}

