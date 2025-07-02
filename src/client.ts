/**
 * Browser-compatible entry point for the A2A Client SDK.
 * This file exports only the client components that work in browser environments.
 */

// Export Client
export { A2AClient } from "./client/client.js";

// Re-export types that are needed for client usage
export type {
  AgentCard,
  AgentCapabilities,
  JSONRPCRequest,
  JSONRPCResponse,
  JSONRPCSuccessResponse,
  JSONRPCError,
  JSONRPCErrorResponse,
  Message,
  Task,
  TaskStatusUpdateEvent,
  TaskArtifactUpdateEvent,
  MessageSendParams,
  SendMessageResponse,
  SendStreamingMessageResponse,
  SendStreamingMessageSuccessResponse,
  TaskQueryParams,
  GetTaskResponse,
  GetTaskSuccessResponse,
  TaskIdParams,
  CancelTaskResponse,
  CancelTaskSuccessResponse,
  TaskPushNotificationConfig,
  SetTaskPushNotificationConfigRequest,
  SetTaskPushNotificationConfigResponse,
  SetTaskPushNotificationConfigSuccessResponse,
  GetTaskPushNotificationConfigRequest,
  GetTaskPushNotificationConfigResponse,
  GetTaskPushNotificationConfigSuccessResponse,
  TaskResubscriptionRequest,
  A2AError,
  SendMessageSuccessResponse,
  // Additional types needed for client usage
  Part,
  TextPart,
  FilePart,
  DataPart,
  TaskStatus,
  AgentSkill,
  SecurityScheme,
  OAuth2SecurityScheme,
  APIKeySecurityScheme,
  AgentProvider,
  Artifact,
  TaskState
} from "./types.js";

export type { A2AResponse } from "./a2a_response.js";