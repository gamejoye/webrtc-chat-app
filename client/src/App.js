import React, { useState } from 'react';
import { Button, Input, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useSocket } from './SocketProvider';

export default function App() {
  const { myVideo, userVideo, callUser, call, answerCall, accepted, me } = useSocket();
  const [id, setId] = useState('');
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white' }}>me: {me || "还未连接上服务器"}</div>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div>
          {accepted ? "接收了" : "没接受或者待处理"}
        </div>
        <video playsInline muted ref={myVideo} autoPlay width={300} />
        <hr />
        <video playsInline muted ref={userVideo} autoPlay width={300} />
        <Input onChange={(e) => setId(e.currentTarget.value)} placeholder="输入对方的ID" />
        <Button onClick={() => { callUser(id) }}>call</Button>
        {call.isReceivedCall === true
          ? (
            <div>
              <Button onClick={() => answerCall()}>接收</Button>
              <Button>拒绝</Button>
            </div>
          )
          : null
        }
      </Content>
    </Layout>
  );
};
