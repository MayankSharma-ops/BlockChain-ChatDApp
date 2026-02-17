import React, { useState, useEffect } from "react";
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
  loading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  //USE STATE
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setChatData(router.query);
  }, [router.isReady]);

  useEffect(() => {
    if (chatData.address) {
      readMessage(chatData.address);
      readUser(chatData.address);
    }
  }, [chatData.address]);

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
              return (
                <div key={i}>
                  {el.sender.toLowerCase() === account.toLowerCase() ? (
                    <div className={Style.Chat_box_left_title}>
                      <Image
                        src={images.accountName}
                        alt="image"
                        width={50}
                        height={50}
                      />
                      <span>
                        {userName}
                        <small> Time: {convertTime(el.timestamp)}</small>
                      </span>
                    </div>
                  ) : (
                    <div className={Style.Chat_box_left_title}>
                      <Image
                        src={images.accountName}
                        alt="image"
                        width={50}
                        height={50}
                      />
                      <span>
                        {currentUserName}
                        <small> Time: {convertTime(el.timestamp)}</small>
                      </span>
                    </div>
                  )}

                  <p>{el.msg}</p>
                </div>
              );
            })}
          </div>
        </div>
        {currentUserName && currentUserAddress ? (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <Image src={images.smile} alt="smile" width={50} height={50} />

              <input
                type="text"
                placeholder="Type your message"
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

              {loading ? (
                <Loader />
              ) : (
                <Image
                  src={images.send}
                  width={50}
                  height={50}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    functionName({
                      msg: message,
                      Address: currentUserAddress,
                    })
                  }
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
