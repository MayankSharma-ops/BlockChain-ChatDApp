import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import { UserCard } from "../Components/index";
import Style from "../styles/alluser.module.css";
import { ChatAppContext } from "../Context/ChatAppContext";

const AllUser = () => {
  const { userLists, addFriends, account, friendLists } =
    useContext(ChatAppContext);

  return (
    <div>
      <div className={Style.alluser_info}>
        <h1>Find Your Friends</h1>
      </div>

      <div className={Style.alluser}>
        {userLists
          ?.filter((user) => {
            if (user.accountAddress.toLowerCase() === account.toLowerCase())
              return false;
            const alreadyFriend = friendLists?.some(
              (f) =>
                f.pubkey.toLowerCase() === user.accountAddress.toLowerCase(),
            );

            return !alreadyFriend;
          })
          .map((el, i) => (
            <UserCard key={i} user={el} i={i} addFriends={addFriends} />
          ))}
      </div>
    </div>
  );
};

export default AllUser;
