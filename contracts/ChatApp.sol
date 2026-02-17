// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp {

    struct User {
        string name;
        Friend[] friendList;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruct {
        string name;
        address accountAddress;
    }

    AllUserStruct[] getAllUsers;

    mapping(address => User) userList;
    mapping(bytes32 => Message[]) allMessages;

    // CHECK USER EXIST
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }

    // CREATE ACCOUNT
    function createAccount(string calldata name) external {
        require(!checkUserExists(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        userList[msg.sender].name = name;
        getAllUsers.push(AllUserStruct(name, msg.sender));
    }

    // GET USERNAME
    function getUserName(address pubkey) external view returns(string memory){
        require(checkUserExists(pubkey), "User is not registered");
        return userList[pubkey].name;
    }

    // ADD FRIEND
    function addFriend(address friendKey, string calldata name) external {  
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friendKey), "User is not registered");
        require(msg.sender != friendKey, "User cannot add themselves");
        require(!checkAlreadyFriends(msg.sender, friendKey), "Already friends");

        _addFriend(msg.sender, friendKey, name);
        _addFriend(friendKey, msg.sender, userList[msg.sender].name);
    }

    // CHECK ALREADY FRIENDS
    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool){
        for(uint256 i = 0; i < userList[pubkey1].friendList.length; i++){
            if(userList[pubkey1].friendList[i].pubkey == pubkey2){
                return true;
            }
        }
        return false;
    }

    function _addFriend(address me, address friendKey, string memory name) internal {
        Friend memory newFriend = Friend(friendKey, name);
        userList[me].friendList.push(newFriend);
    }

    // GET MY FRIEND LIST
    function getMyFriendList() external view returns(Friend[] memory){
        return userList[msg.sender].friendList;
    }

    // GET CHAT CODE
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else {
            return keccak256(abi.encodePacked(pubkey2, pubkey1));
        }
    }

    // SEND MESSAGE
    function sendMessage(address friendKey, string calldata _msg) external {
        require(checkUserExists(msg.sender), "Create account first");
        require(checkUserExists(friendKey), "User not registered");
        require(checkAlreadyFriends(msg.sender, friendKey), "Not friends");
        require(bytes(_msg).length > 0, "Message empty");

        bytes32 chatCode = _getChatCode(msg.sender, friendKey);

        Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    // READ MESSAGE
    function readMessage(address friendKey) external view returns(Message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns(AllUserStruct[] memory){
        return getAllUsers;
    }
}
