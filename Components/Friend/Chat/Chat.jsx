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
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {friendMsg.map((el, i) => {
              const isMe = el.sender.toLowerCase() === account.toLowerCase();

              return (
                <div
                  key={i}
                  className={isMe ? Style.myWrapper : Style.friendWrapper}
                >
                  {/* Message Bubble */}
                  <p className={isMe ? Style.myMessage : Style.friendMessage}>
                    {el.msg}
                  </p>

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
      </div>
    </div>
  );
};

export default Chat;
