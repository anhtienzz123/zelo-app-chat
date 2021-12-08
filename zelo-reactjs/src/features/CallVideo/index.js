import React, { createRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import h from 'utils/callVideoHelpers';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import ActionNavbar from './components/ActionNavbar';
import MyVideo from './components/MyVideo';
import { Col, Row } from 'antd';
import './style.scss';
import peerjs from 'peerjs';
import Peer from 'peerjs';

CallVideo.propTypes = {};

let socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports: ['websocket'],
});

function CallVideo(props) {
    const match = useRouteMatch();
    const { conversationId } = match.params;
    const { user } = useSelector((state) => state.global);
    const { _id } = user;
    const myStreamRef = useRef({ srcObject: '' });
    const [myStream, setMyStream] = useState(null);
    const remoteStreamRef = useRef({ srcObject: '' });
    const [remoteStream, setRemoteStream] = useState(null);
    const remotePeerRef = useRef(null);
    const peerRef = useRef(
        new Peer(_id, {
            config: {
                iceServers: [
                    { urls: ['stun:hk-turn1.xirsys.com'] },
                    {
                        username:
                            'ik-37V-lc5O7p-LYaR8Hp39EvjiL24W8LMy_V3M9tfowcnIUKMNTaxv167eZKwxWAAAAAGFr5rFUaWVuSHV5bmg=',
                        credential: 'fbcd7a58-2f28-11ec-8078-0242ac120004',
                        urls: [
                            'turn:hk-turn1.xirsys.com:80?transport=udp',
                            'turn:hk-turn1.xirsys.com:3478?transport=udp',
                            'turn:hk-turn1.xirsys.com:80?transport=tcp',
                            'turn:hk-turn1.xirsys.com:3478?transport=tcp',
                            'turns:hk-turn1.xirsys.com:443?transport=tcp',
                            'turns:hk-turn1.xirsys.com:5349?transport=tcp',
                        ],
                    },
                ],
            },
        })
        // new Peer()
    );
    const peerIdRef = useRef('');
    const [callerVideos, setCallerVideos] = useState([]);

    const handleToggleVideo = () => {
        const isEnabled =
            myStreamRef.current.srcObject.getVideoTracks()[0].enabled;

        if (isEnabled)
            myStreamRef.current.srcObject.getVideoTracks()[0].enabled = false;
        else myStreamRef.current.srcObject.getVideoTracks()[0].enabled = true;
    };

    const handleToggleAudio = () => {
        const isEnabled =
            myStreamRef.current.srcObject.getAudioTracks()[0].enabled;

        if (isEnabled)
            myStreamRef.current.srcObject.getAudioTracks()[0].enabled = false;
        else myStreamRef.current.srcObject.getAudioTracks()[0].enabled = true;
    };

    const handleShareScreen = () => {
        navigator.mediaDevices
            .getDisplayMedia({ video: true })
            .then((stream) => {
                myStreamRef.current.srcObject = stream;
                let videoTrack =
                    myStreamRef.current.srcObject.getVideoTracks()[0];
                videoTrack.onended = () => {
                    //stopScreenSharing();
                };

                let sender = remotePeerRef.current.peerConnection
                    .getSenders()
                    .find(function (s) {
                        return s.track.kind == videoTrack.kind;
                    });
                sender.replaceTrack(videoTrack);
                //screenSharing = true;

                //console.log(screenStream);
            });
    };

    useEffect(() => {
        if (_id) {
            peerRef.current.on('open', function (id) {
                console.log('My peer ID is: ' + id);
                peerIdRef.current = id;

                socket.emit('subscribe-call-video', {
                    conversationId,
                    newUserId: _id,
                    peerId: id,
                });
            });

            peerRef.current.on('call', function (call) {
                remotePeerRef.current = call;
                console.log('nhan duoc call');

                let streamTempt = myStreamRef.current.srcObject;
                if (!streamTempt) streamTempt = h.getEmptyMedia();

                console.log('streamTempt: ', streamTempt);
                call.answer(streamTempt);
                const senderId = call.metadata.userId;
                call.on('stream', function (remoteStream) {
                    remoteStreamRef.current.srcObject = remoteStream;
                    setRemoteStream(remoteStreamRef);
                });
            });
        }

        h.getUserFullMedia().then((stream) => {
            myStreamRef.current.srcObject = stream;

            setMyStream(stream);
        });
    }, []);

    useEffect(() => {
        socket.on('new-user-call', ({ conversationId, newUserId, peerId }) => {
            console.log('new-user-call: ', newUserId, peerId);
            console.log('myStream: ', myStreamRef.current);

            let streamTempt = myStreamRef.current.srcObject;

            if (!streamTempt) streamTempt = h.getEmptyMedia();

            const call = peerRef.current.call(peerId, streamTempt, {
                metadata: {
                    userId: _id,
                },
            });

            call.on('stream', function (remoteStream) {
                remotePeerRef.current = call;
                remoteStreamRef.current.srcObject = remoteStream;
                setRemoteStream(remoteStreamRef);
            });

            call.on('close', function () {
                console.log('ben kia da close');
            });

            call.on('disconnected', function () {
                console.log('ben kia da close');
            });
        });
    }, []);

    return (
        <div id="call-video">
            <ActionNavbar
                onToggleVideo={handleToggleVideo}
                onToggleAudio={handleToggleAudio}
                onShareScreen={handleShareScreen}
            />

            <div style={{ border: '1px solid black', width: '50%' }}>
                <h1>Remote video</h1>
                {remoteStream && <video ref={remoteStreamRef} autoPlay />}
            </div>

            <div className="local-video">
                {/* {myStreamRef.current && (
                    <MyVideo stream={myStreamRef.current} userId='dsdsadsa' />
                )} */}
                <video
                    ref={myStreamRef}
                    autoPlay
                    style={{ width: '100%' }}
                    muted
                />
            </div>

            {/* <Row className='user-videos'>
                {callerVideos.map((callerVideoEle) => (
                    <Col span={6}>
                        <h1>UserId: {callerVideoEle.userId}</h1>
                    </Col>
                ))}
            </Row>{' '} */}
        </div>
    );
}

export default CallVideo;
