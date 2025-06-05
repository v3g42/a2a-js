/**
 * Main entry point for the A2A Server V2 library.
 * Exports the server class, store implementations, and core types.
 */

// Export store-related types and implementations
export type { TaskStore } from "./server/store.js";
export { InMemoryTaskStore } from "./server/store.js";

// Export the custom error class
export { A2AError } from "./server/error.js";

export { A2AExpressApp } from "./server/a2a_express_app.js";
export type { AgentExecutor } from "./server/agent_execution/agent_executor.js";
export { RequestContext } from "./server/agent_execution/request_context.js";
export type { IExecutionEventBus } from "./server/events/execution_event_bus.js";
export { DefaultRequestHandler } from "./server/request_handler/default_request_handler.js";

// Re-export all schema types for convenience
export * as schema from "./types.js";
export { A2AResponse } from "./a2a_response.js";
