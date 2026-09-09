import { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiSend,
  FiMessageCircle,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";

import Navbar from "../../components/Navbar/Navbar";

import "./Chat.css";


import {
  searchUsers,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead,
} from "../../services/chatApi";


function Chat() {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingConversations, setLoadingConversations] =
    useState(true);
  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // ==========================================
  // LOAD CONVERSATIONS
  // ==========================================
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const data = await getConversations();

      setConversations(data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load conversations"
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    loadConversations();
  }, []);

  // ==========================================
  // SEARCH USERS
  // ==========================================
  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        setLoadingUsers(true);

        const data = await searchUsers(search);

        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // ==========================================
  // LOAD MESSAGES
  // ==========================================
  const loadMessages = async (conversation) => {
    try {
      setLoadingMessages(true);
      setError("");

      setSelectedConversation(conversation);

      const participant = getOtherParticipant(
        conversation
      );

      setSelectedUser(participant);

      const data = await getMessages(conversation._id);

      setMessages(data || []);

      await markAsRead(conversation._id);

      // Update unread count locally
      setConversations((prev) =>
        prev.map((item) =>
          item._id === conversation._id
            ? {
                ...item,
                unreadCount: 0,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load messages"
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  // ==========================================
  // GET OTHER PARTICIPANT
  // ==========================================
  const getOtherParticipant = (conversation) => {
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!currentUser) return null;

    return (
      conversation.participants?.find(
        (participant) =>
          participant._id !== currentUser.id &&
          participant._id !== currentUser._id
      ) || null
    );
  };

  // ==========================================
  // START CHAT WITH USER
  // ==========================================
  const startChat = async (user) => {
    try {
      setError("");

      const conversation =
        await createConversation(user._id);

      setSelectedConversation(conversation);
      setSelectedUser(user);

      const data = await getMessages(conversation._id);

      setMessages(data || []);

      await markAsRead(conversation._id);

      await loadConversations();

      setSearch("");
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to start conversation"
      );
    }
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!selectedConversation) return;

    if (!messageText.trim()) return;

    try {
      setSending(true);
      setError("");

      const newMessage = await sendMessage(
        selectedConversation._id,
        messageText
      );

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setMessageText("");

      await loadConversations();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // CHECK CURRENT USER
  // ==========================================
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==========================================
  // SCROLL TO LAST MESSAGE
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
  <div>
    <Navbar />

    <div className="chat-page">

      {/* ======================================
          HEADER
      ======================================= */}
      <div className="chat-header">
        <div>
          <h1>Personal Chat</h1>
          <p>Connect and chat with other users</p>
        </div>

        <button
          className="refresh-button"
          onClick={loadConversations}
          title="Refresh conversations"
        >
          <FiRefreshCw />
        </button>
      </div>

      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}

      {/* ======================================
          CHAT CONTAINER
      ======================================= */}
      <div className="chat-container">

        {/* ====================================
            LEFT SIDEBAR
        ===================================== */}
        <aside className="chat-sidebar">

          {/* Search */}
          <div className="chat-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {/* Search Results */}
          {search.trim() && (
            <div className="search-results">

              <div className="section-title">
                Search Results
              </div>

              {loadingUsers ? (
                <div className="empty-state">
                  Searching...
                </div>
              ) : users.length === 0 ? (
                <div className="empty-state">
                  No users found
                </div>
              ) : (
                users.map((user) => (
                  <button
                    key={user._id}
                    className="user-item"
                    onClick={() =>
                      startChat(user)
                    }
                  >
                    <div className="user-avatar">
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="user-info">
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Conversations */}
          <div className="conversation-section">

            <div className="section-title">
              Conversations
            </div>

            {loadingConversations ? (
              <div className="empty-state">
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <FiMessageCircle />

                <p>
                  No conversations yet
                </p>

                <span>
                  Search for a user to start chatting.
                </span>
              </div>
            ) : (
              conversations.map(
                (conversation) => {
                  const participant =
                    getOtherParticipant(
                      conversation
                    );

                  if (!participant) return null;

                  return (
                    <button
                      key={conversation._id}
                      className={`conversation-item ${
                        selectedConversation?._id ===
                        conversation._id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        loadMessages(
                          conversation
                        )
                      }
                    >
                      <div className="user-avatar">
                        {participant.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div className="conversation-info">
                        <strong>
                          {participant.name}
                        </strong>

                        <span>
                          {conversation
                            .latestMessage
                            ?.content ||
                            "Start chatting"}
                        </span>
                      </div>

                      {conversation.unreadCount >
                        0 && (
                        <span className="unread-badge">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                }
              )
            )}
          </div>
        </aside>

        {/* ====================================
            RIGHT CHAT WINDOW
        ===================================== */}
        <main className="chat-window">

          {!selectedConversation ? (
            <div className="chat-empty">

              <div className="chat-empty-icon">
                <FiMessageCircle />
              </div>

              <h2>
                Select a conversation
              </h2>

              <p>
                Search for a user or select an
                existing conversation.
              </p>

            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="conversation-header">

                <div className="user-avatar">
                  {selectedUser?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div>
                  <h2>
                    {selectedUser?.name ||
                      "User"}
                  </h2>

                  <span>
                    {selectedUser?.email || ""}
                  </span>
                </div>

              </div>

              {/* Messages */}
              <div className="messages-area">

                {loadingMessages ? (
                  <div className="empty-state">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty">

                    <FiMessageCircle />

                    <p>
                      No messages yet.
                    </p>

                    <span>
                      Send a message to start the
                      conversation.
                    </span>

                  </div>
                ) : (
                  messages.map((message) => {

                    const senderId =
                      message.sender?._id;

                    const isMine =
                      senderId ===
                      currentUser?.id;

                    return (
                      <div
                        key={message._id}
                        className={`message-row ${
                          isMine
                            ? "mine"
                            : "theirs"
                        }`}
                      >
                        <div className="message-bubble">

                          <p>
                            {message.content}
                          </p>

                          <span>
                            {new Date(
                              message.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>

                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />

              </div>

              {/* Message Input */}
              <form
                className="message-form"
                onSubmit={handleSendMessage}
              >

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(event) =>
                    setMessageText(
                      event.target.value
                    )
                  }
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !messageText.trim()
                  }
                >
                  <FiSend />

                  <span>
                    {sending
                      ? "Sending..."
                      : "Send"}
                  </span>
                </button>

              </form>
            </>
          )}

        </main>
      </div>
        </div>
  </div>
  );
}

export default Chat;