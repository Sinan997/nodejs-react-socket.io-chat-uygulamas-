import classes from "./Chat.module.css";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Contacts from "./Contacts";
import Welcome from "./Welcome";
import ChatContainer from "./ChatContainer";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const history = useHistory();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      history("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
      setIsLoaded(true);
    }
  }, [history]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io("http://localhost:8800");
      socket.current.emit("add-user", currentUser.userId);
    }
  }, [currentUser]);

  useEffect(() => {
    const getUsers = async () => {
      if (currentUser !== undefined) {
        const { data } = await axios.get(
          "/user/getUsers/" + currentUser.userId
        );
        setContacts(data);
      }
    };
    getUsers();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentUser={currentUser}
              currentChat={currentChat}
              socket={socket}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
