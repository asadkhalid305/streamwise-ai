import { run } from "@openai/agents";
import classificationAgent from "./classificationAgent";

export const executeMultiAgentSystem = async (message: string) => {
  return await run(classificationAgent, message);
};
