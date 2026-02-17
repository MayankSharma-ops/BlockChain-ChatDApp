import React, { useEffect, useState, useContext } from 'react';

//INTERNAL IMPORT
import { ChatAppContext } from '../Context/ChatAppContext';
import { Filter, Friend } from '../Components/index';

const ChatApp = () => {
  return (
    <div>
      <Filter />
      <Friend />
    </div>
  )
}

export default ChatApp
