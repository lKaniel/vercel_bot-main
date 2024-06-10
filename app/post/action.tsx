"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { PostComponent } from "./post-component";
import {DeepPartial, generateObject} from "ai";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}
const postSchema = z.object({
  post: z.object({
    tittle: z.string().describe("tittle of instagram post"),
    content: z.string().describe("content part of instagram post"),
    callToAction: z.string().describe("text that encourages user to take action and by content"),
    tags: z.array(z.string()).describe("tags for instagram post"),
  })
});

export type Post = DeepPartial<typeof postSchema>;

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-4o"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      tellAJoke: {
        description: "create a Post for Instagram",
        parameters: z.object({
          product: z.string().describe("the product to create a post for"),
          price: z.number().describe("the price of the product"),
        }),
        generate: async function* ({ product, price }) {
          yield <div>loading...</div>;
          const joke = await generateObject({
            model: openai("gpt-4o"),
            schema: postSchema,
            prompt:
              `Create a post for Instagram with belowed structure for this product: ${product} with price: ${price}`,
          });
          return <PostComponent post={joke.object} />;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
