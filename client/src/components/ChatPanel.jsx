import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { getSocket } from '../services/socket';
import {
  Send,
  Hash,
  MessageSquare,
  ShieldCheck,
  User,
  Image as ImageIcon,
  X,
  Maximize2,
} from 'lucide-react';

export default function ChatPanel() {
  const { user } = useAuth();
  const { activeTeam, activeDmUser } = useTeam();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Base64 data URL
  const [previewImageModal, setPreviewImageModal] = useState(null); // Full size image lightbox
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Client-side image canvas compressor
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    try {
      const compressedDataUrl = await compressImage(file);
      setSelectedImage(compressedDataUrl);
    } catch (err) {
      console.error('Image compression error:', err);
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if ((!text && !selectedImage) || !activeTeam || isSending) return;

    const socket = getSocket();
    if (!socket) {
      alert('Socket connection lost. Please refresh the page.');
      return;
    }

    setIsSending(true);

    const payload = {
      teamId: activeTeam._id,
      content: text,
      image: selectedImage,
    };

    const imageToSend = selectedImage;

    // Reset input fields right away
    setInputText('');
    setSelectedImage(null);

    if (activeDmUser) {
      // Send 1-on-1 Direct Message
      socket.emit(
        'send_direct_message',
        {
          ...payload,
          recipientId: activeDmUser._id,
        },
        (res) => {
          setIsSending(false);
          if (!res?.success) {
            console.error('Failed to send direct message:', res?.error);
            alert('Failed to send message: ' + (res?.error || 'Unknown error'));
            setSelectedImage(imageToSend); // Restore if error
          }
        }
      );
    } else {
      // Send Channel Message
      socket.emit('send_channel_message', payload, (res) => {
        setIsSending(false);
        if (!res?.success) {
          console.error('Failed to send channel message:', res?.error);
          alert('Failed to send message: ' + (res?.error || 'Unknown error'));
          setSelectedImage(imageToSend); // Restore if error
        }
      });
    }
  };

  if (!activeTeam) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm bg-[#050505]">
        Select or create a team workspace to start messaging.
      </div>
    );
  }

  const canSend = Boolean(inputText.trim() || selectedImage);

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
            <p>No messages yet. Send a text or image to start the conversation!</p>
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
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-md shadow-md space-y-2 ${
                      isSelf
                        ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-tr-none'
                        : 'bg-[#121212] text-slate-200 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {/* Image Attachment Rendering */}
                    {msg.image && (
                      <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        <img
                          src={msg.image}
                          alt="Message attachment"
                          className="max-h-60 w-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setPreviewImageModal(msg.image)}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImageModal(msg.image)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="View Full Size"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Text Content */}
                    {msg.content && <p>{msg.content}</p>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Image Thumbnail Preview Banner */}
      {selectedImage && (
        <div className="px-6 py-2 bg-[#0A0A0A] border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage}
              alt="Attachment preview"
              className="w-12 h-12 object-cover rounded-lg border border-white/20"
            />
            <div>
              <p className="text-xs font-medium text-slate-200">Image attached</p>
              <p className="text-[10px] text-emerald-400">Ready to send — click send arrow</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md"
      >
        <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-emerald-500/50 transition-colors">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

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
            type="button"
            onClick={handleSendMessage}
            disabled={!canSend || isSending}
            className={`p-2.5 rounded-lg text-white transition-all shadow-md flex items-center justify-center ${
              canSend && !isSending
                ? 'bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-emerald-600/30 scale-105'
                : 'bg-emerald-600/40 opacity-50 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Full-Size Image Lightbox Modal */}
      {previewImageModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="absolute -top-10 right-0 text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImageModal}
              alt="Full size attachment"
              className="max-h-[85vh] max-w-full rounded-2xl border border-white/10 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
