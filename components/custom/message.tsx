"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
// Removed DisplayBoardingPass import
import { ListFlights } from "../flights/list-flights";
import { ListMeditations } from "../meditations/list-meditations";
import { MeditationConfirmation } from "../meditations/meditation-confirmation";
import { MeditationDisplay } from "../meditations/meditation-display";
import { MeditationLanguageSelector } from "../meditations/meditation-language-selector";
import { MeditationPromptSelector } from "../meditations/meditation-prompt-selector";
import { MeditationTypesSelector } from "../meditations/meditation-types-selector";
import { ListMemories } from "../memories/list-memories";
import { MemoryConfirmation } from "../memories/memory-confirmation";
import { ListTasks } from "../tasks/list-tasks";
import { TaskConfirmation } from "../tasks/task-confirmation";

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                if (result?.error) {
                  return (
                    <div key={toolCallId} className="text-red-500 text-sm">
                      Error: {result.error}
                    </div>
                  );
                }

                return (
                  <div key={toolCallId}>
                    {toolName === "addTask" ? (
                      <TaskConfirmation {...result} />
                    ) : toolName === "listTasks" ? (
                      <ListTasks
                        tasks={result.tasks}
                        onToggleTask={() => {}}
                        onRemoveTask={() => {}}
                        chatId={chatId}
                      />
                    ) : toolName === "markTaskComplete" ? (
                      <TaskConfirmation status={result.status} taskId={result.taskId} />
                    ) : toolName === "saveMemory" ? (
                      <MemoryConfirmation {...result} />
                    ) : toolName === "recallMemories" ? (
                      <ListMemories memories={result.memories} />                    ) : toolName === "forgetMemory" ? (
                      <MemoryConfirmation {...result} />
                    ) : toolName === "showMeditationTypeSelector" ? (
                      <MeditationTypesSelector chatId={chatId} />                    ) : toolName === "showMeditationPromptSelector" ? (
                      <MeditationPromptSelector type={result.type} chatId={chatId} />
                    ) : toolName === "showMeditationLanguageSelector" ? (
                      <MeditationLanguageSelector 
                        type={result.type} 
                        intention={result.intention}
                        chatHistory={result.chatHistory}
                        chatId={chatId} 
                      />
                    ) : toolName === "generateMeditationContent" ? (
                      <MeditationDisplay {...result} chatId={chatId} />
                    ) : toolName === "createMeditation" ? (
                      <MeditationConfirmation {...result} />
                    ) : toolName === "listMeditations" ? (
                      <ListMeditations meditations={result.meditations} chatId={chatId} />
                    ) : toolName === "getMeditation" ? (
                      <MeditationDisplay {...result} chatId={chatId} />
                    ) : toolName === "deleteMeditation" ? (
                      <MeditationConfirmation status="deleted" meditationId={result.meditationId} />
                    ) : (
                      <div>{JSON.stringify(result, null, 2)}</div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "addTask" ? (
                      <TaskConfirmation status="added" taskId="temp-skeleton" />
                    ) : toolName === "listTasks" ? (
                      <ListTasks tasks={[]} onToggleTask={() => {}} onRemoveTask={() => {}} chatId={chatId} />
                    ) : toolName === "markTaskComplete" ? (
                      <TaskConfirmation status="pending" taskId="temp-skeleton" />
                    ) : toolName === "saveMemory" ? (
                      <MemoryConfirmation status="saved" memoryId="temp-skeleton" />
                    ) : toolName === "recallMemories" ? (
                      <ListMemories memories={[]} />                    ) : toolName === "forgetMemory" ? (
                      <MemoryConfirmation status="forgotten" memoryId="temp-skeleton" />
                    ) : toolName === "showMeditationTypeSelector" ? (
                      <MeditationTypesSelector chatId={chatId} />                    ) : toolName === "showMeditationPromptSelector" ? (
                      <MeditationPromptSelector type="mindfulness" chatId={chatId} />
                    ) : toolName === "showMeditationLanguageSelector" ? (
                      <MeditationLanguageSelector 
                        type="mindfulness" 
                        chatId={chatId} 
                      />
                    ) : toolName === "generateMeditationContent" ? (
                      <MeditationDisplay type="mindfulness" title="Loading..." content="Generating your meditation..." chatId={chatId} />
                    ) : toolName === "createMeditation" ? (
                      <MeditationConfirmation status="created" meditationId="temp-skeleton" />
                    ) : toolName === "listMeditations" ? (
                      <ListMeditations meditations={[]} chatId={chatId} />
                    ) : toolName === "getMeditation" ? (
                      <MeditationDisplay type="mindfulness" title="Loading..." content="Loading meditation..." chatId={chatId} />
                    ) : toolName === "deleteMeditation" ? (
                      <MeditationConfirmation status="deleted" meditationId="temp-skeleton" />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
