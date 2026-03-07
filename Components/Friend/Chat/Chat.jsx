import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from "../../../assets";
import { convertTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";
const Chat = ({
  functionName,
  readMessage,
  friendMsg,
  account,
  userName,
  messageLoading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  //USE STATE
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isClearChatMode, setIsClearChatMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [hiddenMessages, setHiddenMessages] = useState(new Set());
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  });
  const router = useRouter();
  const emojiPickerRef = useRef(null);
  const emojiList = ["😀", "😂", "😍", "😎", "🔥", "👍", "🙏", "🎉", "❤️", "😢"];

  useEffect(() => {
    if (!router.isReady) return;
    setChatData(router.query);
  }, [router.isReady]);

  const readMessageRef = useRef(readMessage);
  const readUserRef = useRef(readUser);

  useEffect(() => {
    readMessageRef.current = readMessage;
    readUserRef.current = readUser;
  }, [readMessage, readUser]);

  useEffect(() => {
    if (chatData.address) {
      readMessageRef.current(chatData.address);
      readUserRef.current(chatData.address);
    }
  }, [chatData.address]);
  useEffect(() => {
    if (!chatData.address) return;

    const interval = setInterval(() => {
      readMessageRef.current(chatData.address);
    }, 6000);

    return () => clearInterval(interval);
  }, [chatData.address]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showEmojiPicker]);

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !currentUserAddress) return;

    await functionName({
      msg: trimmedMessage,
      Address: currentUserAddress,
    });

    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => `${prevMessage}${emoji}`);
  };

const buildMessageKey = (el, index) =>
    `${el.sender.toLowerCase()}-${el.timestamp?.toString?.() || ""}-${index}`;

  const handleToggleClearMode = () => {
    setIsClearChatMode((prevState) => !prevState);
    setSelectedMessages([]);
  };

  const handleSelectMessage = (messageKey) => {
    setSelectedMessages((prevSelected) => {
      if (prevSelected.includes(messageKey)) {
        return prevSelected.filter((key) => key !== messageKey);
      }

      return [...prevSelected, messageKey];
    });
  };

  const handleDeleteSelectedMessages = () => {
    if (!selectedMessages.length) return;

    setHiddenMessages((prevHidden) => {
      const updatedHidden = new Set(prevHidden);
      selectedMessages.forEach((key) => updatedHidden.add(key));
      return updatedHidden;
    });

    setSelectedMessages([]);
    setIsClearChatMode(false);
  };

  const visibleMessages = friendMsg
    .map((el, index) => ({ el, originalIndex: index }))
    .filter(({ el, originalIndex }) =>
      !hiddenMessages.has(buildMessageKey(el, originalIndex)),
    );


  const buildCallRoom = () => {
    if (!account || !currentUserAddress) return "";

    const participants = [account.toLowerCase(), currentUserAddress.toLowerCase()]
      .sort()
      .join("-")
      .replace(/[^a-z0-9-]/g, "");

    return `blockchain-chatdapp-${participants}`;
  };

  const videoCallRoom = buildCallRoom();
  const videoCallUrl = videoCallRoom
    ? `https://meet.jit.si/${videoCallRoom}`
    : "";

    const clearChatStorageKey =
    account && currentUserAddress
      ? `hidden-chat-messages-${account.toLowerCase()}-${currentUserAddress.toLowerCase()}`
      : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!clearChatStorageKey) {
      setHiddenMessages(new Set());
      setSelectedMessages([]);
      setIsClearChatMode(false);
      return;
    }
    const savedHiddenMessages = window.localStorage.getItem(clearChatStorageKey);

    if (!savedHiddenMessages) {
      setHiddenMessages(new Set());
      setSelectedMessages([]);
      setIsClearChatMode(false);
      return;
    }

    try {
      const parsedMessages = JSON.parse(savedHiddenMessages);
      setHiddenMessages(new Set(parsedMessages));
    } catch (error) {
      console.log("Unable to parse saved clear chat data", error);
      setHiddenMessages(new Set());
    }

    setSelectedMessages([]);
    setIsClearChatMode(false);
  }, [clearChatStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !clearChatStorageKey) return;

    window.localStorage.setItem(
      clearChatStorageKey,
      JSON.stringify(Array.from(hiddenMessages)),
    );
  }, [clearChatStorageKey, hiddenMessages]);


  return (
    <div className={Style.Chat}>
      {currentUserName && currentUserAddress ? (
        <div className={Style.Chat_user_info}>
          <Image src={images.accountName} alt="image" width={70} height={70} />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className={Style.Chat_box_box}>
        <div className={Style.chatActionHeader}>
          <button
            type="button"
            className={Style.clearChatButton}
            onClick={handleToggleClearMode}
          >
            {isClearChatMode ? "Cancel" : "Clear Chat"}
          </button>

          {isClearChatMode ? (
            <button
              type="button"
              className={Style.deleteSelectedButton}
              onClick={handleDeleteSelectedMessages}
              disabled={!selectedMessages.length}
            >
              Delete
            </button>
          ) : null}
        </div>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {visibleMessages.map(({ el, originalIndex }) => {
              const isMe = el.sender.toLowerCase() === account.toLowerCase();
              const messageKey = buildMessageKey(el, originalIndex);
              const isSelected = selectedMessages.includes(messageKey);

              return (
                <div
                  key={messageKey}
                  className={isMe ? Style.myWrapper : Style.friendWrapper}
                >
                  <div className={Style.messageRow}>
                    {isClearChatMode ? (
                      <input
                        type="checkbox"
                        className={Style.messageCheckbox}
                        checked={isSelected}
                        onChange={() => handleSelectMessage(messageKey)}
                      />
                    ) : null}

                    {/* Message Bubble */}
                    <p className={isMe ? Style.myMessage : Style.friendMessage}>
                      {el.msg}
                    </p>
                  </div>

                  {/* Time bubble */}
                  <small className={isMe ? Style.myTime : Style.friendTime}>
                    {convertTime(el.timestamp)}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
        {currentUserName && currentUserAddress ? (
          <div className={Style.videoCallActionRow}>
            <button
              type="button"
              className={Style.videoCallButton}
              onClick={() => setShowVideoCall(true)}
            >
              Start Video Call
            </button>
          </div>
        ) : null}
        {currentUserName && currentUserAddress ? (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              {/* <Image src={images.smile} alt="smile" width={50} height={50} /> */}
              <div className={Style.emojiPickerWrapper} ref={emojiPickerRef}>
                <Image
                  src={images.smile}
                  alt="smile"
                  width={50}
                  height={50}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowEmojiPicker((prevState) => !prevState)}
                />

                {showEmojiPicker ? (
                  <div className={Style.emojiPicker}>
                    {emojiList.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        className={Style.emojiButton}
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {/* Hidden File Input */}
              <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />

              {/* File Icon */}
              <Image
                src={images.file}
                width={50}
                height={50}
                style={{ cursor: "pointer" }}
                onClick={() => document.getElementById("fileUpload").click()}
              />

              {/* {loading ? ( */}
              {messageLoading ? (
                <Loader />
              ) : (
                <Image
                  src={images.send}
                  width={50}
                  height={50}
                  style={{ cursor: "pointer" }}
                  onClick={handleSendMessage}
                />
              )}
            </div>

            {/* Show selected file */}
            {file && <small>Selected: {file.name}</small>}
          </div>
        ) : (
          ""
        )}
        {showVideoCall && videoCallUrl ? (
          <div className={Style.videoModalOverlay}>
            <div className={Style.videoModal}>
              <div className={Style.videoModalHeader}>
                <h4>Video call with {currentUserName}</h4>
                <button
                  type="button"
                  className={Style.closeVideoButton}
                  onClick={() => setShowVideoCall(false)}
                >
                  Close
                </button>
              </div>

              <iframe
                src={videoCallUrl}
                title="Video call"
                allow="camera; microphone; fullscreen; display-capture"
                className={Style.videoFrame}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Chat;
