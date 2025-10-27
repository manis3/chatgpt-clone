'use client'

import React from 'react'

interface  ChatPropsBase {
    messages: Array<any>
}

export default function Chat({messages}:ChatPropsBase) {
    const lastMessage = messages.at(-1)
    const isEmpty = messages.length === 0;
    const isTyping = lastMessage?.role === "user"

  return (
    <div>chat</div>
  )
}
