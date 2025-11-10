import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Box, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { useRouter } from "next/router";
import ScrollableFeed from "react-scrollable-feed";
import { RippleBadge } from "../../scss/MaterialTheme/styled";
import { useReactiveVar } from "@apollo/client";
import { socketVar, userVar } from "../../apollo/store";
import { Member } from "../types/member/member";
import { sweetErrorAlert } from "../sweetAlert";
import { Messages } from "../config";

const NewMessage = (type: any) => {
  if (type === "right") {
    return (
      <Box
        component={"div"}
        flexDirection={"row"}
        style={{ display: "flex" }}
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        sx={{ m: "10px 0px" }}
      >
        <div className={"msg_right"}></div>
      </Box>
    );
  } else {
    return (
      <Box
        flexDirection={"row"}
        style={{ display: "flex" }}
        sx={{ m: "10px 0px" }}
        component={"div"}
      >
        <Avatar alt={"jonik"} src={"/img/profile/defaultUser.svg"} />
        <div className={"msg_left"}></div>
      </Box>
    );
  }
};

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

const Chat = () => {
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const textInput = useRef(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);

  /* LIFECYCLES */
  useEffect(() => {
    if (!socket) return;
    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      console.log("WebSocket message:", data);
      switch (data.event) {
        case "info": {
          const newInfo: InfoPayload = data;
          setOnlineUsers(newInfo.totalClients);
          break;
        }
        case "getMessages": {
          const list: MessagePayload[] = data.list;
          setMessagesList(list);
          break;
        }
        case "message": {
          const newMessage: MessagePayload = data;
          setMessagesList((prevMessages) => [
            ...(prevMessages || []),
            newMessage,
          ]);
          break;
        }
      }
    };
    socket.onmessage = handler;
    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOpenButton(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setOpenButton(false);
  }, [router.pathname]);

  /** HANDLERS **/
  const handleOpenChat = () => {
    setOpen((prevState) => !prevState);
  };

  const getInputMessageHandler = useCallback(
    (e: any) => {
      const text = e.target.value;
      setMessageInput(text);
    },
    [messageInput]
  );

  const getKeyHandler = (e: any) => {
    try {
      if (e.key === "Enter") {
        onClickHandler();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onClickHandler = () => {
    if (!messageInput) sweetErrorAlert(Messages.error4);
    else {
      socket.send(JSON.stringify({ event: "message", data: messageInput }));
      setMessageInput("");
    }
  };

  return (
    <Stack className="chatting">
      {openButton ? (
        <button
          className={`chat-button ${open ? "open" : ""}`}
          onClick={handleOpenChat}
        >
          {open ? (
            <CloseFullscreenIcon style={{ color: "white" }} />
          ) : (
            <>
              <svg
                height="1.6em"
                fill="white"
                xmlSpace="preserve"
                viewBox="0 0 1000 1000"
                y="0px"
                x="0px"
                version="1.1"
              >
                <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
              </svg>
              <span className="tooltip">Chat</span>
            </>
          )}
        </button>
      ) : null}
      <Stack className={`chat-frame ${open ? "open" : ""}`}>
        <Box className={"chat-top"} component={"div"}>
          <div style={{ fontFamily: "Nunito" }}>Online Chat</div>
          <RippleBadge
            style={{ margin: "-18px 0 0 21px" }}
            badgeContent={onlineUsers}
          />
        </Box>
        <Box
          className={"chat-content"}
          id="chat-content"
          ref={chatContentRef}
          component={"div"}
        >
          <ScrollableFeed>
            <Stack className={"chat-main"}>
              <Box
                flexDirection={"row"}
                style={{ display: "flex" }}
                sx={{ m: "10px 0px" }}
                component={"div"}
              >
                <div className={"welcome"}>Welcome to Live chat!</div>
              </Box>
              {messagesList?.map((ele: MessagePayload, index: number) => {
                const { text, memberData } = ele;
                const memberImage = memberData?.memberImage
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${memberData.memberImage}`
                  : "/img/profile/defaultUser.svg";

                return memberData?._id === user?._id ? (
                  <Box
                    key={index}
                    component={"div"}
                    flexDirection={"row"}
                    style={{ display: "flex" }}
                    alignItems={"flex-end"}
                    justifyContent={"flex-end"}
                    sx={{ m: "10px 0px" }}
                  >
                    <div className={"msg-right"}>{text}</div>
                  </Box>
                ) : (
                  <Box
                    key={index}
                    flexDirection={"row"}
                    style={{ display: "flex" }}
                    sx={{ m: "10px 0px" }}
                    component={"div"}
                  >
                    <Avatar alt={"join"} src={memberImage} />
                    <div className={"msg-left"}>{text}</div>
                  </Box>
                );
              })}
            </Stack>
          </ScrollableFeed>
        </Box>
        <Box className={"chat-bott"} component={"div"}>
          <input
            ref={textInput}
            type={"text"}
            name={"message"}
            className={"msg-input"}
            placeholder={"Type message"}
            value={messageInput}
            onChange={getInputMessageHandler}
            onKeyDown={getKeyHandler}
          />
          <button className={"send-msg-btn"} onClick={onClickHandler}>
            <SendIcon style={{ color: "#fff" }} />
          </button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Chat;
