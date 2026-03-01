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

    struct FriendRequest {
        address requester;
        string name;
    }

    struct AllUserStruct {
        string name;
        address accountAddress;
    }

    AllUserStruct[] getAllUsers;

    mapping(address => User) userList;
    mapping(bytes32 => Message[]) allMessages;
    mapping(address => FriendRequest[]) private friendRequests;
    mapping(address => mapping(address => bool)) private pendingRequests;

    // CHECK USER EXIST
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }

    // CREATE ACCOUNT
    event UserCreated(address indexed user, string name);
    function createAccount(string calldata name) external {
        require(!checkUserExists(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        userList[msg.sender].name = name;
        getAllUsers.push(AllUserStruct(name, msg.sender));

        emit UserCreated(msg.sender, name);
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
        require(bytes(name).length > 0, "Friend name required");
        require(!pendingRequests[msg.sender][friendKey], "Request already pending");
        require(!pendingRequests[friendKey][msg.sender], "Request already pending");

        friendRequests[friendKey].push(FriendRequest(msg.sender, userList[msg.sender].name));
        pendingRequests[msg.sender][friendKey] = true;
        pendingRequests[friendKey][msg.sender] = true;
    }

        function getMyFriendRequests() external view returns(FriendRequest[] memory) {
        return friendRequests[msg.sender];
    }

    function respondToFriendRequest(address requester, bool accept) external {
        require(checkUserExists(msg.sender), "Create account first");
        require(checkUserExists(requester), "User not registered");
        require(pendingRequests[msg.sender][requester], "No pending request");

        _removeFriendRequest(msg.sender, requester);
        pendingRequests[msg.sender][requester] = false;
        pendingRequests[requester][msg.sender] = false;

        if (accept) {
            require(!checkAlreadyFriends(msg.sender, requester), "Already friends");
            _addFriend(msg.sender, requester, userList[requester].name);
            _addFriend(requester, msg.sender, userList[msg.sender].name);
        }
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
        function _removeFriendRequest(address receiver, address requester) internal {
        uint256 requestsLength = friendRequests[receiver].length;

        for (uint256 i = 0; i < requestsLength; i++) {
            if (friendRequests[receiver][i].requester == requester) {
                friendRequests[receiver][i] = friendRequests[receiver][requestsLength - 1];
                friendRequests[receiver].pop();
                return;
            }
        }

        revert("No pending request");
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
