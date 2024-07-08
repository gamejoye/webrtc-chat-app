import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from 'simple-peer';

const SocketContext = createContext();
const socket = io("http://localhost:8000");

export default function SocketProvider({ children }) {
  const [me, setMe] = useState(null);
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => {
      setMe(id);
    })

    socket.on('calluser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false,  stream });

    peer.on('signal', (data) => {
      console.log('answerCall, signal');
      console.log('********signal: ', data);
      socket.emit('answercall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log('answerCall, stream');
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data) => {
      console.log('callUser, signal', data);
      socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      console.log('callUser, stream');
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callaccepted', (signal) => {
      console.log('callaccepted', signal);
      setAccepted(true);
      peer.signal(signal);
    });
  }

  return (
    <SocketContext.Provider value={{ stream, call, myVideo, me, userVideo, callUser, answerCall, accepted, name, setName }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext);
}