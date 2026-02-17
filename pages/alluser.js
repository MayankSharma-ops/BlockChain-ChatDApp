import React, { useEffect, useState, useContext} from 'react'

//INTERNAL IMPORT
import { UserCard } from '../components/index'
import Style from '../styles/alluser.module.css'
import { ChatAppContext } from '../Context/ChatAppContext'

const AllUser = () => {
  const { userLists, addFriends } = useContext(ChatAppContext);
  return (
    <div>
        <div className={Style.alluser_info}>
          <h1>Find Your Friends</h1>
        </div>
        <div className={Style.alluser}>
          {userLists.map((el, i) => (
            <UserCard key={i} user={el} i={i} addFriends={addFriends} />
          ))}
        </div>
    </div>
  )
}

export default AllUser
