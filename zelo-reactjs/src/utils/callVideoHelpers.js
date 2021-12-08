const callVideoHelpers = {
    // hiển thị stream bản thân
    setLocalStream(stream, mirrorMode = true) {
        // const localVidElem = document.getElementById('local');
        // localVidElem.srcObject = stream;
        // mirrorMode
        //     ? localVidElem.classList.add('mirror-mode')
        //     : localVidElem.classList.remove('mirror-mode');
    },

    userMediaAvailable() {
        return (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        );
    },

    getUserFullMedia() {
        // console.log('this.userMediaAvailable()', this.userMediaAvailable());
        // if (this.userMediaAvailable()) {
        //     return this.userMediaAvailable({
        //         video: true,
        //         audio: true,
        //     });
        // } else {
        //     throw new Error('User media not available');
        // }
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
    },

    getUserAudio() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });
        } else {
            throw new Error('User media not available');
        }
    },

    createEmptyAudioTrack() {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        const track = dst.stream.getAudioTracks()[0];
        return Object.assign(track, { enabled: false });
    },

    createEmptyVideoTrack({ width, height }) {
        const canvas = Object.assign(document.createElement('canvas'), {
            width,
            height,
        });
        canvas.getContext('2d').fillRect(0, 0, width, height);

        const stream = canvas.captureStream();
        const track = stream.getVideoTracks()[0];

        return Object.assign(track, { enabled: false });
    },

    getEmptyMedia() {
        const audioTrack = this.createEmptyAudioTrack();
        const videoTrack = this.createEmptyVideoTrack({
            width: 640,
            height: 480,
        });
        return new MediaStream([audioTrack, videoTrack]);
    },

    shareScreen() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always',
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });
        } else {
            throw new Error('User media not available');
        }
    },

    getIceServer() {
        return {
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
        };
    },

    replaceTrack(stream, recipientPeer) {
        let sender = recipientPeer.getSenders
            ? recipientPeer
                  .getSenders()
                  .find((s) => s.track && s.track.kind === stream.kind)
            : false;

        if (sender) sender.replaceTrack(stream);
    },
};

module.exports = callVideoHelpers;
