import React, { useContext } from "react";
import { ChatAppContext } from "../../Context/ChatAppContext";

const FriendRequests = () => {
  const { requests, acceptRequest, rejectRequest } =
    useContext(ChatAppContext);

  return (
    <div>
      <h2>Pending Requests</h2>

      {requests.map((r, i) => (
        <div key={i}>
          <p>{r.name} ({r.from})</p>

          <button onClick={() => acceptRequest(i)}>Accept</button>
          <button onClick={() => rejectRequest(i)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;