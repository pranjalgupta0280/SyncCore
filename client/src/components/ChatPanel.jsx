import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { getSocket } from '../services/socket';
import { Send, Hash, MessageSquare, ShieldCheck, User } from 'lucide-react';

export default function ChatPanel() {
  const { user } = useAuth();
  const { activeTeam, activeDmUser } = useTeam();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!activeTeam) return;
    const socket = getSocket();
    if (!socket) return;

    setLoadingMessages(true);

    // Fetch initial chat history via Socket.io
    socket.emit(
      'fetch_messages',
      {
        teamId: activeTeam._id,
        recipientId: activeDmUser?._id || null,
      },
      (response) => {
        setLoadingMessages(false);
        if (response && response.success) {
          setMessages(response.data);
          setTimeout(scrollToBottom, 100);
        }
      }
    );

    // Socket Event Listeners for incoming messages
    const handleNewChannelMsg = (msg) => {
      if (!activeDmUser && msg.teamId === activeTeam._id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    };

    const handleNewDirectMsg = (msg) => {
      if (
        activeDmUser &&
        (msg.sender._id === activeDmUser._id || msg.recipient?._id === activeDmUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    };

    socket.on('new_channel_message', handleNewChannelMsg);
    socket.on('new_direct_message', handleNewDirectMsg);

    return () => {
      socket.off('new_channel_message', handleNewChannelMsg);
      socket.off('new_direct_message', handleNewDirectMsg);
    };
  }, [activeTeam, activeDmUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeTeam) return;

    const socket = getSocket();
    if (!socket) return;

    if (activeDmUser) {
      // Send 1-on-1 Direct Message
      socket.emit(
        'send_direct_message',
        {
          teamId: activeTeam._id,
          recipientId: activeDmUser._id,
          content: inputText.trim(),
        },
        (res) => {
          if (res?.success) {
            setInputText('');
          }
        }
      );
    } else {
      // Send Channel Message
      socket.emit(
        'send_channel_message',
        {
          teamId: activeTeam._id,
          content: inputText.trim(),
        },
        (res) => {
          if (res?.success) {
            setInputText('');
          }
        }
      );
    }
  };

  if (!activeTeam) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm bg-[#050505]">
        Select or create a team workspace to start messaging.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]">
      {/* Chat Header */}
      <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {activeDmUser ? (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow"
                style={{ backgroundColor: activeDmUser.avatarColor || '#10b981' }}
              >
                {activeDmUser.name?.[0]}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {activeDmUser.name}
                </h2>
                <p className="text-[11px] text-emerald-400">@{activeDmUser.username}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">general</h2>
              <span className="text-xs text-slate-500 font-normal">
                | Public Team Channel
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#141414] px-3 py-1.5 rounded-full border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SyncCore Encrypted Socket Stream</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-500">
            Loading real-time message history...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs gap-2">
            <MessageSquare className="w-8 h-8 text-slate-600" />
            <p>No messages yet. Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.sender?._id?.toString() === user?._id?.toString();
            return (
              <div
                key={msg._id}
                className={`flex gap-3 max-w-2xl ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 shadow mt-0.5"
                  style={{ backgroundColor: msg.sender?.avatarColor || '#10b981' }}
                >
                  {msg.sender?.name?.[0] || 'U'}
                </div>

                <div className={`space-y-1 ${isSelf ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-semibold text-slate-300">
                      {msg.sender?.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed max-w-md shadow-md ${
                      isSelf
                        ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-tr-none'
                        : 'bg-[#121212] text-slate-200 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md"
      >
        <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-emerald-500/50 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeDmUser
                ? `Message @${activeDmUser.username}...`
                : 'Send message to #general...'
            }
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
