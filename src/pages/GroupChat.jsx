import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

// Props required: apiKey, userId, userName, groupId, groupName, memberIds
const GroupChat = ({ apiKey, userId, userName, groupId, groupName, memberIds }) => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Improved error message: show exactly which prop is missing or invalid
    if (!apiKey || !userId || !userName || !groupId || !memberIds || memberIds.length < 2) {
      let missing = [];
      if (!apiKey) missing.push('apiKey');
      if (!userId) missing.push('userId');
      if (!userName) missing.push('userName');
      if (!groupId) missing.push('groupId');
      if (!memberIds) missing.push('memberIds');
      else if (memberIds.length < 2) missing.push('at least 2 memberIds');
      setError('Missing or invalid: ' + missing.join(', '));
      setLoading(false);
      return;
    }

    let isCancelled = false;
    let activeChannel = null;
    let chatClient = null;

    const initChat = async () => {
      try {
        setLoading(true);
        setError(null);
        // For dev only: use devToken (do NOT use in prod)
        chatClient = StreamChat.getInstance(apiKey);
        await chatClient.connectUser({ id: userId, name: userName }, chatClient.devToken(userId));
        // Create or get the messaging channel for this group
        const ch = chatClient.channel('messaging', groupId, {
          name: groupName,
          members: memberIds,
        });
        await ch.watch();
        if (!isCancelled) {
          activeChannel = ch;
          setClient(chatClient);
          setChannel(ch);
        } else {
          await ch.stopWatching();
        }
      } catch (err) {
        if (!isCancelled) setError(err.message);
        console.error('StreamChat error:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    initChat();

    return () => {
      isCancelled = true;
      (async () => {
        try {
          if (activeChannel) await activeChannel.stopWatching();
          if (chatClient?.userID) await chatClient.disconnectUser();
        } catch (err) {
          console.warn('Cleanup error (ignored):', err);
        }
      })();
    };
    // eslint-disable-next-line
  }, [apiKey, userId, userName, groupId, groupName, JSON.stringify(memberIds)]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingIndicator size={30} />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-400">{error}</div>;
  }

  if (!channel) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingIndicator size={30} />
      </div>
    );
  }

  const CustomSendButton = ({ sendMessage }) => (
    <button
      onClick={sendMessage}
      className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black px-4 py-2 rounded-full ml-2"
    >
      Send
    </button>
  );

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel} SendButton={CustomSendButton} >
        <Window>
          {/* Optionally add <ChannelHeader /> here */}
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
      
    </Chat>
  );
};

export default GroupChat;
