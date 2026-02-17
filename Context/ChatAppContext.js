import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import {
  CHeckIfWalletConnected,
  ConnectWallet,
  checkIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME ON PAGE LOAD
  const fetchData = async () => {
    try {
      //GET CONTRACT
      const contract = await connectingWithContract();
      //GET ACCOUNT
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      //GET USER NAME
      const userName = await contract.getUserName(connectedAccount);
      setUserName(userName);
      //GET MY FRIEND LIST
      const FriendLists = await contract.getMyFriendList();
      setFriendLists(FriendLists);
      //GET ALL USER LIST
      const UserList = await contract.getAllAppUser();
      setUserLists(UserList);
    } catch (error) {
      //   setError("Please Install And Connect Your Wallet");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      setLoading(true);

      const contract = await connectingWithContract();
      const messages = await contract.readMessage(friendAddress);

      setFriendMsg(messages);
      setError("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //CREATE ACCOUNT
  const createAccount = async ({ name, accountAddress }) => {
    try {
      // if (name || accountAddress)
      //     return setError("Please Provide Name And Account Address");

      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      // fetchData();
      window.location.reload();
    } catch (error) {
      setError("Error While Creating Your Account Please reload your Browser");
    }
  };

  //ADD YOUR FRIEND
  const addFriends = async ({ name, accountAddress }) => {
    try {
      if (!name || !accountAddress)
        return setError("Please Provide Your Friend Name And Address");

      const contract = await connectingWithContract();

      const tx = await contract.addFriend(accountAddress, name);

      setLoading(true);
      await tx.wait();
      setLoading(false);

      await fetchData();
    } catch (error) {
      console.log(error);
      setError("Error While Adding Your Friend Please Try Again");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const sendMessage = async ({ msg, Address }) => {
    try {
      //   if (msg || Address) return setError("Please Provide Message");
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(Address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error While Sending Message Please Try Again");
    }
  };

  //READ USER INFO
  const readUser = async (userAddress) => {
    try {
      if (!userAddress) return;

      const contract = await connectingWithContract();
      const userName = await contract.getUserName(userAddress);

      setCurrentUserName(userName);
      setCurrentUserAddress(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ChatAppContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        checkIfWalletConnected,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
