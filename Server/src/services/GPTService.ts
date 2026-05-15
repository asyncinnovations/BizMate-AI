import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { gtp_config } from "src/config/gpt_config";

@Injectable()
export class GPTService {
  async GPTChat(user_prompt: string, system_prompt: string) {
    const response = await gtp_config.chat.completions.create({
        model: "openai/gpt-oss-120b:cerebras",
      //   model: "Qwen/Qwen2.5-72B-Instruct",
      // model: "Qwen/Qwen2.5-7B-Instruct",
      max_completion_tokens: 1000,
      messages: [
        {
          role: "system",
          content: system_prompt,
        },
        {
          role: "user",
          content: user_prompt,
        },
      ],
    });
    return {
      message: "welcome to GPT-OSS",
      data: response.choices[0].message,
    };
  }
}
