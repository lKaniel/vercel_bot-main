"use client";

import { useState } from "react";
import { ClientMessage } from "./action";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className={"flex flex-col items-center min-w-[50rem]"}>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <form
          className={"flex gap-5 w-full"}
        onSubmit={async (e) => {
          e.preventDefault();
          setInput("");
          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            { id: nanoid(), role: "user", display: input },
          ]);

          const message = await continueConversation(input);

          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            message,
          ]);
        }}
      >
        <Input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <Button>Send Message</Button>
      </form>
    </div>
  );
}
