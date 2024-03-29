import helper from './helper.js';


window.addEventListener('load', () => {
    var room = ''
    if (location.href != " " && (decodeURIComponent(location.href).split('=', 2)[1]).length) {
        console.log('location.href is not an empty string')
        console.log(location.href);
        room = decodeURIComponent(location.href).split('=', 2)[1]
        room = room.split('&', 1)[0];
        console.log("Final room:" + room);
        const username = sessionStorage.getItem('username');
        let commElem = document.getElementsByClassName('room-comm');
        for (let i = 0; i < commElem.length; i++) {
            commElem[i].attributes.removeNamedItem('hidden');
        }
        var fileInput = document.querySelector('input#fileInput');

        var downloadAnchor = document.querySelector('a#download');

        var socketId = '';
        var myStream = '';
        var screen = '';
        var recordedStream = [];
        var mediaRecorder = '';
        var roomPc = [];
        let socket = io('/stream');
        console.log(socket);
        const BYTES_PER_CHUNK = 1200;
        var file;
        var currentChunk;
        var fileInput = document.querySelector('input#fileInput');
        var fileReader = new FileReader();



        var incomingFileInfo;
        var incomingFileData;
        var bytesReceived;
        var downloadInProgress = false;

        function startDownload(data) {
            console.log("Indownload: ");
            console.log(data);
            incomingFileInfo = data;
            incomingFileData = [];
            bytesReceived = 0;
            downloadInProgress = true;
            console.log('incoming file <b>' + incomingFileInfo.fileName + '</b> of ' + incomingFileInfo.fileSize + ' bytes');
        }

        function progressDownload(data) {
            console.log("progress");
            console.log(data)
            bytesReceived += data.byteLength;
            incomingFileData.push(data);
            document.getElementById('filetemp').value = ((bytesReceived / incomingFileInfo.fileSize) * 100).toFixed(2);

            console.log('progress: ' + ((bytesReceived / incomingFileInfo.fileSize) * 100).toFixed(2) + '%');
            if (bytesReceived === incomingFileInfo.fileSize) {
                endDownload();
            }
        }

        function endDownload() {
            downloadInProgress = false;
            var blob = new Blob(incomingFileData);

            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var blob = new Blob(incomingFileData);
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = incomingFileInfo.fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }

        getSetStream();

        socket.on('connect', () => {
            console.log("Logged into the socket stage");

            socketId = socket.io.engine.id;
            socket.emit('subscribe', {
                room: room,
                socketId: socketId
            });
            socket.on('new user', (data) => {
                socket.emit('newUserStart', { to: data.socketId, sender: socketId });
                roomPc.push(data.socketId);
                init(true, data.socketId);
            });
            socket.on('newUserStart', (data) => {
                roomPc.push(data.sender);
                init(false, data.sender);
            });
            socket.on('ice candidates', async(data) => {
                data.candidate ? await roomPc[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate)) : '';
            });
            socket.on('sdp', async(data) => {
                if (data.description.type === 'offer') {
                    data.description ? await roomPc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description)) : '';

                    helper.getUserResources().then(async(stream) => {
                        if (!document.getElementById('local').srcObject) {
                            helper.setLocalStream(stream);
                        }
                        myStream = stream;
                        stream.getTracks().forEach((track) => {
                            roomPc[data.sender].addTrack(track, stream);
                        });
                        let answer = await roomPc[data.sender].createAnswer();
                        await roomPc[data.sender].setLocalDescription(answer);
                        socket.emit('sdp', { description: roomPc[data.sender].localDescription, to: data.sender, sender: socketId });
                    }).catch((e) => {
                        console.error(e);
                    });
                } else if (data.description.type === 'answer') {
                    await roomPc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description));
                }
            });


            socket.on('chat', (data) => {
                console.log("chat-----------------");
                console.log(data);
                helper.addChat(data, 'remote');
            });
            socket.on('file-out-room', (data) => {

                console.log('file-out-room');
                console.log(data);
                startDownload(data);
            });
            socket.on('file-out-room-result', (data) => {
                console.log('file-out-room');
                console.log(data);
                progressDownload(data);

            });


        });

        function getSetStream() {
            helper.getUserResources().then((stream) => {
                myStream = stream;

                helper.setLocalStream(stream);
            }).catch((e) => {
                console.error(`stream error: ${ e }`);
            });
        }

        function init(createOffer, participant) {
            roomPc[participant] = new RTCPeerConnection(helper.getIceServer());

            if (screen && screen.getTracks().length) {
                screen.getTracks().forEach((track) => {
                    roomPc[participant].addTrack(track, screen);
                });
            } else if (myStream) {
                myStream.getTracks().forEach((track) => {
                    roomPc[participant].addTrack(track, myStream);
                });
            } else {
                helper.getUserResources().then((stream) => {
                    myStream = stream;
                    stream.getTracks().forEach((track) => {
                        roomPc[participant].addTrack(track, stream);
                    });
                    helper.setLocalStream(stream);
                }).catch((e) => {
                    console.error(`stream error: ${ e }`);
                });
            }

            if (createOffer) {
                roomPc[participant].onnegotiationneeded = async() => {
                    let offer = await roomPc[participant].createOffer();

                    await roomPc[participant].setLocalDescription(offer);

                    socket.emit('sdp', { description: roomPc[participant].localDescription, to: participant, sender: socketId });
                };
            }

            roomPc[participant].onicecandidate = ({ candidate }) => {
                socket.emit('ice candidates', { candidate: candidate, to: participant, sender: socketId });
            };

            roomPc[participant].ontrack = (e) => {
                let str = e.streams[0];
                if (document.getElementById(`${ participant }-video`)) {
                    document.getElementById(`${ participant }-video`).srcObject = str;
                } else {
                    let videospace = document.getElementById('videos');
                    let video = document.createElement('video');

                    video.id = `${ participant }-video`;
                    video.srcObject = str;
                    video.autoplay = true;
                    video.className = 'remote-video';
                    let usersCount = videospace.children.length;
                    let columns = Math.sqrt(usersCount);


                    if (usersCount != 0) {
                        if (usersCount == 1) {
                            videospace.style.gridTemplateColumns = "repeat( 2, 1fr)";
                            videospace.style.gridTemplateRows = "repeat(1, 1fr)";
                        } else if (!Number.isInteger(columns)) {
                            videospace.style.gridTemplateColumns = "repeat(" + (Math.ceil(columns)).toString() + ", 1fr)";
                            videospace.style.gridTemplateRows = "repeat(" + Math.ceil(columns).toString() + ", 1fr)";
                        } else {
                            videospace.style.gridTemplateColumns = "repeat(" + Math.ceil(columns).toString() + ", 1fr)";
                            videospace.style.gridTemplateRows = "repeat(" + (Math.ceil(columns) + 1).toString() + ", 1fr)";
                        }
                    }


                    console.log(videospace);
                    videospace.appendChild(video);
                }
            };

            roomPc[participant].onconnectionstatechange = (d) => {
                switch (roomPc[participant].iceConnectionState) {
                    case 'disconnected':
                        console.log("Element Removed: ");
                        console.log(`${participant}-video`);
                        if (document.getElementById(`${participant}-video`)) {
                            document.getElementById(`${participant}-video`).remove();
                        }
                        helper.videoGridSizing();
                        break;
                    case 'failed':
                        console.log("Disconnected 2")
                        if (document.getElementById(`${participant}-video`)) {
                            document.getElementById(`${participant}-video`).remove();
                        }
                        this.videoGridSizing();
                        break;

                    case 'closed':
                        console.log("Disconnected 1")
                        if (document.getElementById(`${participant}-video`)) {
                            document.getElementById(`${participant}-video`).remove();
                        }
                        this.videoGridSizing();
                        break;
                }
            };

            roomPc[participant].onsignalingstatechange = (d) => {
                switch (roomPc[participant].signalingState) {
                    case 'closed':
                        console.log("Signalling state is 'closed'");
                        if (document.getElementById(`${participant}-video`)) {
                            document.getElementById(`${participant}-video`).remove();
                        }
                        this.videoGridSizing();
                        break;
                }
            };
        }

        function shareScreen() {
            helper.shareScreen().then((stream) => {
                helper.toggleShareIcons(true);
                helper.toggleVideoBtnDisabled(true);
                screen = stream;
                broadcastTracks(stream, 'video', false);
                screen.getVideoTracks()[0].addEventListener('ended', () => {
                    stopSharingScreen();
                });
            }).catch((e) => {
                console.error(e);
            });
        }

        function stopSharingScreen() {
            helper.toggleVideoBtnDisabled(false);

            return new Promise((res, rej) => {
                screen.getTracks().length ? screen.getTracks().forEach(track => track.stop()) : '';

                res();
            }).then(() => {
                helper.toggleShareIcons(false);
                broadcastTracks(myStream, 'video');
            }).catch((e) => {
                console.error(e);
            });
        }

        function broadcastTracks(stream, type, mirrorMode = true) {
            helper.setLocalStream(stream, mirrorMode);

            let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            for (let p in roomPc) {
                let pName = roomPc[p];

                if (typeof roomPc[pName] == 'object') {
                    helper.replaceTrack(track, roomPc[pName]);
                }
            }
        }

        function toggleRecordingIcons(isRecording) {
            let e = document.getElementById('record');

            if (isRecording) {
                e.setAttribute('title', 'Stop recording');
                e.children[0].classList.add('text-danger');
                e.children[0].classList.remove('text-white');
            } else {
                e.setAttribute('title', 'Record');
                e.children[0].classList.add('text-white');
                e.children[0].classList.remove('text-danger');
            }
        }


        function startRecording(stream) {
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorder.start(1000);
            toggleRecordingIcons(true);

            mediaRecorder.ondataavailable = function(e) {
                recordedStream.push(e.data);
            };
            mediaRecorder.onstop = function() {
                toggleRecordingIcons(false);
                helper.saveRecordedStream(recordedStream, username);
                setTimeout(() => {
                    recordedStream = [];
                }, 3000);
            };
            mediaRecorder.onerror = function(e) {
                console.error(e);
            };
        }

        document.getElementById('toggle-video').addEventListener('click', (e) => {
            e.preventDefault();

            let elem = document.getElementById('toggle-video');

            if (myStream.getVideoTracks()[0].enabled) {
                e.target.classList.remove('fa-video');
                e.target.classList.add('fa-video-slash');
                elem.setAttribute('title', 'Show Video');
                // myStream.getTracks().forEach(t => t.kind == "video" && t.stop());
                // myStream.getTracks().forEach(t => t.kind == "audio" && t.stop());
                myStream.getVideoTracks()[0].enabled = false;
            } else {
                console.log("hello")
                e.target.classList.remove('fa-video-slash');
                e.target.classList.add('fa-video');
                elem.setAttribute('title', 'Hide Video');
                myStream.getVideoTracks()[0].enabled = true;
            }

            broadcastTracks(myStream, 'video');
        });

        document.getElementById('toggle-mute').addEventListener('click', (e) => {
            e.preventDefault();

            let elem = document.getElementById('toggle-mute');

            if (myStream.getAudioTracks()[0].enabled) {
                e.target.classList.remove('fa-microphone-alt');
                e.target.classList.add('fa-microphone-alt-slash');
                elem.setAttribute('title', 'Unmute');
                myStream.getAudioTracks()[0].enabled = false;
            } else {
                e.target.classList.remove('fa-microphone-alt-slash');
                e.target.classList.add('fa-microphone-alt');
                elem.setAttribute('title', 'Mute');

                myStream.getAudioTracks()[0].enabled = true;
            }

            broadcastTracks(myStream, 'audio');
        });

        document.getElementById('share-screen').addEventListener('click', (e) => {
            e.preventDefault();

            if (screen && screen.getVideoTracks().length && screen.getVideoTracks()[0].readyState != 'ended') {
                stopSharingScreen();
            } else {
                shareScreen();
            }
        });


        // document.getElementById('record').addEventListener('click', (e) => {

        //     if (!mediaRecorder || mediaRecorder.state == 'inactive') {
        //         helper.toggleModal('recording-options-modal', true);
        //     } else if (mediaRecorder.state == 'paused') {
        //         mediaRecorder.resume();
        //     } else if (mediaRecorder.state == 'recording') {
        //         mediaRecorder.stop();
        //     }
        // });


        // document.getElementById('record-screen').addEventListener('click', () => {
        //     helper.toggleModal('recording-options-modal', false);

        //     if (screen && screen.getVideoTracks().length) {
        //         startRecording(screen);
        //     } else {
        //         helper.shareScreen().then((screenStream) => {
        //             startRecording(screenStream);
        //         }).catch(() => {});
        //     }
        // });

        // document.getElementById('record-video').addEventListener('click', () => {
        //     helper.toggleModal('recording-options-modal', false);

        //     if (myStream && myStream.getTracks().length) {
        //         startRecording(myStream);
        //     } else {
        //         helper.getUserResources().then((videoStream) => {
        //             startRecording(videoStream);
        //         }).catch(() => {});
        //     }
        // });

        function sendMsg(msg) {
            let data = {
                room: room,
                msg: msg,
                sender: username
            };
            console.log("In Send Msg");
            console.log(data);
            //emit chat message
            socket.emit('chat', data);

            //add localchat
            helper.addChat(data, 'local');
        }

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.which === 13 && (e.target.value.trim())) {
                e.preventDefault();

                sendMsg(e.target.value);

                setTimeout(() => {
                    e.target.value = '';
                }, 50);
            }
        });

        function readNextChunk() {
            var start = BYTES_PER_CHUNK * currentChunk;
            var end = Math.min(file.size, start + BYTES_PER_CHUNK);
            fileReader.readAsArrayBuffer(file.slice(start, end));
        }

        fileReader.onload = function() {
            let data = {
                room: room,
                result: fileReader.result
            }
            socket.emit('file-send-room-result', data);
            currentChunk++;
            if (BYTES_PER_CHUNK * currentChunk < file.size) {
                readNextChunk();
            }
        };
        document.getElementById('fileInput').addEventListener('change', function(e) {
            console.log(e);
            file = e.files[0];
            currentChunk = 0;
            console.log("Reached in fileInput");
            let data = {
                room: room,
                fileName: file.name,
                fileSize: file.size
            }
            socket.emit('file-send-room', data);
            readNextChunk();
        });

    }
});