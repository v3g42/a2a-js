// src/server/agent_execution/request_context.ts
var RequestContext = class {
  userMessage;
  task;
  referenceTasks;
  taskId;
  contextId;
  constructor(userMessage, taskId, contextId, task, referenceTasks) {
    this.userMessage = userMessage;
    this.taskId = taskId;
    this.contextId = contextId;
    this.task = task;
    this.referenceTasks = referenceTasks;
  }
};

// src/server/events/execution_event_bus.ts
import { EventEmitter } from "events";
var DefaultExecutionEventBus = class extends EventEmitter {
  constructor() {
    super();
  }
  publish(event) {
    this.emit("event", event);
  }
  finished() {
    this.emit("finished");
  }
};

// src/server/events/execution_event_bus_manager.ts
var DefaultExecutionEventBusManager = class {
  taskIdToBus = /* @__PURE__ */ new Map();
  /**
   * Creates or retrieves an existing ExecutionEventBus based on the taskId.
   * @param taskId The ID of the task.
   * @returns An instance of IExecutionEventBus.
   */
  createOrGetByTaskId(taskId) {
    if (!this.taskIdToBus.has(taskId)) {
      this.taskIdToBus.set(taskId, new DefaultExecutionEventBus());
    }
    return this.taskIdToBus.get(taskId);
  }
  /**
   * Retrieves an existing ExecutionEventBus based on the taskId.
   * @param taskId The ID of the task.
   * @returns An instance of IExecutionEventBus or undefined if not found.
   */
  getByTaskId(taskId) {
    return this.taskIdToBus.get(taskId);
  }
  /**
   * Removes the event bus for a given taskId.
   * This should be called when an execution flow is complete to free resources.
   * @param taskId The ID of the task.
   */
  cleanupByTaskId(taskId) {
    const bus = this.taskIdToBus.get(taskId);
    if (bus) {
      bus.removeAllListeners();
    }
    this.taskIdToBus.delete(taskId);
  }
};

// src/server/request_handler/default_request_handler.ts
import { v4 as uuidv4 } from "uuid";

// src/server/error.ts
var A2AError = class _A2AError extends Error {
  code;
  data;
  taskId;
  // Optional task ID context
  constructor(code, message, data, taskId) {
    super(message);
    this.name = "A2AError";
    this.code = code;
    this.data = data;
    this.taskId = taskId;
  }
  /**
   * Formats the error into a standard JSON-RPC error object structure.
   */
  toJSONRPCError() {
    const errorObject = {
      code: this.code,
      message: this.message
    };
    if (this.data !== void 0) {
      errorObject.data = this.data;
    }
    return errorObject;
  }
  // Static factory methods for common errors
  static parseError(message, data) {
    return new _A2AError(-32700, message, data);
  }
  static invalidRequest(message, data) {
    return new _A2AError(-32600, message, data);
  }
  static methodNotFound(method) {
    return new _A2AError(
      -32601,
      `Method not found: ${method}`
    );
  }
  static invalidParams(message, data) {
    return new _A2AError(-32602, message, data);
  }
  static internalError(message, data) {
    return new _A2AError(-32603, message, data);
  }
  static taskNotFound(taskId) {
    return new _A2AError(
      -32001,
      `Task not found: ${taskId}`,
      void 0,
      taskId
    );
  }
  static taskNotCancelable(taskId) {
    return new _A2AError(
      -32002,
      `Task not cancelable: ${taskId}`,
      void 0,
      taskId
    );
  }
  static pushNotificationNotSupported() {
    return new _A2AError(
      -32003,
      "Push Notification is not supported"
    );
  }
  static unsupportedOperation(operation) {
    return new _A2AError(
      -32004,
      `Unsupported operation: ${operation}`
    );
  }
};

// src/server/events/execution_event_queue.ts
var ExecutionEventQueue = class {
  eventBus;
  eventQueue = [];
  resolvePromise;
  stopped = false;
  boundHandleEvent;
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on("event", this.handleEvent);
    this.eventBus.on("finished", this.handleFinished);
  }
  handleEvent = (event) => {
    if (this.stopped) return;
    this.eventQueue.push(event);
    if (this.resolvePromise) {
      this.resolvePromise();
      this.resolvePromise = void 0;
    }
  };
  handleFinished = () => {
    this.stop();
  };
  /**
   * Provides an async generator that yields events from the event bus.
   * Stops when a Message event is received or a TaskStatusUpdateEvent with final=true is received.
   */
  async *events() {
    while (!this.stopped || this.eventQueue.length > 0) {
      if (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        yield event;
        if (event.kind === "message" || event.kind === "status-update" && event.final) {
          this.handleFinished();
          break;
        }
      } else if (!this.stopped) {
        await new Promise((resolve) => {
          this.resolvePromise = resolve;
        });
      }
    }
  }
  /**
   * Stops the event queue from processing further events.
   */
  stop() {
    this.stopped = true;
    if (this.resolvePromise) {
      this.resolvePromise();
      this.resolvePromise = void 0;
    }
    this.eventBus.off("event", this.handleEvent);
    this.eventBus.off("finished", this.handleFinished);
  }
};

// src/server/result_manager.ts
var ResultManager = class {
  taskStore;
  currentTask;
  latestUserMessage;
  // To add to history if a new task is created
  finalMessageResult;
  // Stores the message if it's the final result
  constructor(taskStore) {
    this.taskStore = taskStore;
  }
  setContext(latestUserMessage) {
    this.latestUserMessage = latestUserMessage;
  }
  /**
   * Processes an agent execution event and updates the task store.
   * @param event The agent execution event.
   */
  async processEvent(event) {
    if (event.kind === "message") {
      this.finalMessageResult = event;
    } else if (event.kind === "task") {
      const taskEvent = event;
      this.currentTask = { ...taskEvent };
      if (this.latestUserMessage) {
        if (!this.currentTask.history?.find((msg) => msg.messageId === this.latestUserMessage.messageId)) {
          this.currentTask.history = [this.latestUserMessage, ...this.currentTask.history || []];
        }
      }
      await this.saveCurrentTask();
    } else if (event.kind === "status-update") {
      const updateEvent = event;
      if (this.currentTask && this.currentTask.id === updateEvent.taskId) {
        this.currentTask.status = updateEvent.status;
        if (updateEvent.status.message) {
          if (!this.currentTask.history?.find((msg) => msg.messageId === updateEvent.status.message.messageId)) {
            this.currentTask.history = [...this.currentTask.history || [], updateEvent.status.message];
          }
        }
        await this.saveCurrentTask();
      } else if (!this.currentTask && updateEvent.taskId) {
        const loaded = await this.taskStore.load(updateEvent.taskId);
        if (loaded) {
          this.currentTask = loaded;
          this.currentTask.status = updateEvent.status;
          if (updateEvent.status.message) {
            if (!this.currentTask.history?.find((msg) => msg.messageId === updateEvent.status.message.messageId)) {
              this.currentTask.history = [...this.currentTask.history || [], updateEvent.status.message];
            }
          }
          await this.saveCurrentTask();
        } else {
          console.warn(`ResultManager: Received status update for unknown task ${updateEvent.taskId}`);
        }
      }
    } else if (event.kind === "artifact-update") {
      const artifactEvent = event;
      if (this.currentTask && this.currentTask.id === artifactEvent.taskId) {
        if (!this.currentTask.artifacts) {
          this.currentTask.artifacts = [];
        }
        const existingArtifactIndex = this.currentTask.artifacts.findIndex(
          (art) => art.artifactId === artifactEvent.artifact.artifactId
        );
        if (existingArtifactIndex !== -1) {
          if (artifactEvent.append) {
            const existingArtifact = this.currentTask.artifacts[existingArtifactIndex];
            existingArtifact.parts.push(...artifactEvent.artifact.parts);
            if (artifactEvent.artifact.description) existingArtifact.description = artifactEvent.artifact.description;
            if (artifactEvent.artifact.name) existingArtifact.name = artifactEvent.artifact.name;
            if (artifactEvent.artifact.metadata) existingArtifact.metadata = { ...existingArtifact.metadata, ...artifactEvent.artifact.metadata };
          } else {
            this.currentTask.artifacts[existingArtifactIndex] = artifactEvent.artifact;
          }
        } else {
          this.currentTask.artifacts.push(artifactEvent.artifact);
        }
        await this.saveCurrentTask();
      } else if (!this.currentTask && artifactEvent.taskId) {
        const loaded = await this.taskStore.load(artifactEvent.taskId);
        if (loaded) {
          this.currentTask = loaded;
          if (!this.currentTask.artifacts) this.currentTask.artifacts = [];
          const existingArtifactIndex = this.currentTask.artifacts.findIndex(
            (art) => art.artifactId === artifactEvent.artifact.artifactId
          );
          if (existingArtifactIndex !== -1) {
            if (artifactEvent.append) {
              this.currentTask.artifacts[existingArtifactIndex].parts.push(...artifactEvent.artifact.parts);
            } else {
              this.currentTask.artifacts[existingArtifactIndex] = artifactEvent.artifact;
            }
          } else {
            this.currentTask.artifacts.push(artifactEvent.artifact);
          }
          await this.saveCurrentTask();
        } else {
          console.warn(`ResultManager: Received artifact update for unknown task ${artifactEvent.taskId}`);
        }
      }
    }
  }
  async saveCurrentTask() {
    if (this.currentTask) {
      await this.taskStore.save(this.currentTask);
    }
  }
  /**
   * Gets the final result, which could be a Message or a Task.
   * This should be called after the event stream has been fully processed.
   * @returns The final Message or the current Task.
   */
  getFinalResult() {
    if (this.finalMessageResult) {
      return this.finalMessageResult;
    }
    return this.currentTask;
  }
  /**
   * Gets the task currently being managed by this ResultManager instance.
   * This task could be one that was started with or one created during agent execution.
   * @returns The current Task or undefined if no task is active.
   */
  getCurrentTask() {
    return this.currentTask;
  }
};

// src/server/request_handler/default_request_handler.ts
var terminalStates = ["completed", "failed", "canceled", "rejected"];
var DefaultRequestHandler = class {
  agentCard;
  taskStore;
  agentExecutor;
  eventBusManager;
  // Store for push notification configurations (could be part of TaskStore or separate)
  pushNotificationConfigs = /* @__PURE__ */ new Map();
  constructor(agentCard, taskStore, agentExecutor, eventBusManager = new DefaultExecutionEventBusManager()) {
    this.agentCard = agentCard;
    this.taskStore = taskStore;
    this.agentExecutor = agentExecutor;
    this.eventBusManager = eventBusManager;
  }
  async getAgentCard() {
    return this.agentCard;
  }
  async _createRequestContext(incomingMessage, taskId, isStream) {
    let task;
    let referenceTasks;
    if (incomingMessage.taskId) {
      task = await this.taskStore.load(incomingMessage.taskId);
      if (!task) {
        throw A2AError.taskNotFound(incomingMessage.taskId);
      }
      if (terminalStates.includes(task.status.state)) {
        throw A2AError.invalidRequest(`Task ${task.id} is in a terminal state (${task.status.state}) and cannot be modified.`);
      }
    }
    if (incomingMessage.referenceTaskIds && incomingMessage.referenceTaskIds.length > 0) {
      referenceTasks = [];
      for (const refId of incomingMessage.referenceTaskIds) {
        const refTask = await this.taskStore.load(refId);
        if (refTask) {
          referenceTasks.push(refTask);
        } else {
          console.warn(`Reference task ${refId} not found.`);
        }
      }
    }
    const messageForContext = { ...incomingMessage };
    if (!messageForContext.contextId) {
      messageForContext.contextId = task?.contextId || uuidv4();
    }
    const contextId = incomingMessage.contextId || uuidv4();
    return new RequestContext(
      messageForContext,
      taskId,
      contextId,
      task,
      referenceTasks
    );
  }
  async _processEvents(taskId, resultManager, eventQueue, options) {
    let firstResultSent = false;
    try {
      for await (const event of eventQueue.events()) {
        await resultManager.processEvent(event);
        if (options?.firstResultResolver && !firstResultSent) {
          if (event.kind === "message" || event.kind === "task") {
            options.firstResultResolver(event);
            firstResultSent = true;
          }
        }
      }
      if (options?.firstResultRejector && !firstResultSent) {
        options.firstResultRejector(A2AError.internalError("Execution finished before a message or task was produced."));
      }
    } catch (error) {
      console.error(`Event processing loop failed for task ${taskId}:`, error);
      if (options?.firstResultRejector && !firstResultSent) {
        options.firstResultRejector(error);
      }
      throw error;
    } finally {
      this.eventBusManager.cleanupByTaskId(taskId);
    }
  }
  async sendMessage(params) {
    const incomingMessage = params.message;
    if (!incomingMessage.messageId) {
      throw A2AError.invalidParams("message.messageId is required.");
    }
    const isBlocking = params.configuration?.blocking !== false;
    const taskId = incomingMessage.taskId || uuidv4();
    const resultManager = new ResultManager(this.taskStore);
    resultManager.setContext(incomingMessage);
    const requestContext = await this._createRequestContext(incomingMessage, taskId, false);
    const finalMessageForAgent = requestContext.userMessage;
    const eventBus = this.eventBusManager.createOrGetByTaskId(taskId);
    const eventQueue = new ExecutionEventQueue(eventBus);
    this.agentExecutor.execute(requestContext, eventBus).catch((err) => {
      console.error(`Agent execution failed for message ${finalMessageForAgent.messageId}:`, err);
      const errorTask = {
        id: requestContext.task?.id || uuidv4(),
        // Use existing task ID or generate new
        contextId: finalMessageForAgent.contextId,
        status: {
          state: "failed",
          message: {
            kind: "message",
            role: "agent",
            messageId: uuidv4(),
            parts: [{ kind: "text", text: `Agent execution error: ${err.message}` }],
            taskId: requestContext.task?.id,
            contextId: finalMessageForAgent.contextId
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        history: requestContext.task?.history ? [...requestContext.task.history] : [],
        kind: "task"
      };
      if (finalMessageForAgent) {
        if (!errorTask.history?.find((m) => m.messageId === finalMessageForAgent.messageId)) {
          errorTask.history?.push(finalMessageForAgent);
        }
      }
      eventBus.publish(errorTask);
      eventBus.publish({
        // And publish a final status update
        kind: "status-update",
        taskId: errorTask.id,
        contextId: errorTask.contextId,
        status: errorTask.status,
        final: true
      });
      eventBus.finished();
    });
    if (isBlocking) {
      await this._processEvents(taskId, resultManager, eventQueue);
      const finalResult = resultManager.getFinalResult();
      if (!finalResult) {
        throw A2AError.internalError("Agent execution finished without a result, and no task context found.");
      }
      return finalResult;
    } else {
      return new Promise((resolve, reject) => {
        this._processEvents(taskId, resultManager, eventQueue, {
          firstResultResolver: resolve,
          firstResultRejector: reject
        });
      });
    }
  }
  async *sendMessageStream(params) {
    const incomingMessage = params.message;
    if (!incomingMessage.messageId) {
      throw A2AError.invalidParams("message.messageId is required for streaming.");
    }
    const taskId = incomingMessage.taskId || uuidv4();
    const resultManager = new ResultManager(this.taskStore);
    resultManager.setContext(incomingMessage);
    const requestContext = await this._createRequestContext(incomingMessage, taskId, true);
    const finalMessageForAgent = requestContext.userMessage;
    const eventBus = this.eventBusManager.createOrGetByTaskId(taskId);
    const eventQueue = new ExecutionEventQueue(eventBus);
    this.agentExecutor.execute(requestContext, eventBus).catch((err) => {
      console.error(`Agent execution failed for stream message ${finalMessageForAgent.messageId}:`, err);
      const errorTaskStatus = {
        kind: "status-update",
        taskId: requestContext.task?.id || uuidv4(),
        // Use existing or a placeholder
        contextId: finalMessageForAgent.contextId,
        status: {
          state: "failed",
          message: {
            kind: "message",
            role: "agent",
            messageId: uuidv4(),
            parts: [{ kind: "text", text: `Agent execution error: ${err.message}` }],
            taskId: requestContext.task?.id,
            contextId: finalMessageForAgent.contextId
          },
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        final: true
        // This will terminate the stream for the client
      };
      eventBus.publish(errorTaskStatus);
    });
    try {
      for await (const event of eventQueue.events()) {
        await resultManager.processEvent(event);
        yield event;
      }
    } finally {
      this.eventBusManager.cleanupByTaskId(taskId);
    }
  }
  async getTask(params) {
    const task = await this.taskStore.load(params.id);
    if (!task) {
      throw A2AError.taskNotFound(params.id);
    }
    if (params.historyLength !== void 0 && params.historyLength >= 0) {
      if (task.history) {
        task.history = task.history.slice(-params.historyLength);
      }
    } else {
      task.history = [];
    }
    return task;
  }
  async cancelTask(params) {
    const task = await this.taskStore.load(params.id);
    if (!task) {
      throw A2AError.taskNotFound(params.id);
    }
    const nonCancelableStates = ["completed", "failed", "canceled", "rejected"];
    if (nonCancelableStates.includes(task.status.state)) {
      throw A2AError.taskNotCancelable(params.id);
    }
    const eventBus = this.eventBusManager.getByTaskId(params.id);
    if (eventBus) {
      await this.agentExecutor.cancelTask(params.id, eventBus);
    } else {
      task.status = {
        state: "canceled",
        message: {
          // Optional: Add a system message indicating cancellation
          kind: "message",
          role: "agent",
          messageId: uuidv4(),
          parts: [{ kind: "text", text: "Task cancellation requested by user." }],
          taskId: task.id,
          contextId: task.contextId
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      task.history = [...task.history || [], task.status.message];
      await this.taskStore.save(task);
    }
    const latestTask = await this.taskStore.load(params.id);
    return latestTask;
  }
  async setTaskPushNotificationConfig(params) {
    if (!this.agentCard.capabilities.pushNotifications) {
      throw A2AError.pushNotificationNotSupported();
    }
    const taskAndHistory = await this.taskStore.load(params.taskId);
    if (!taskAndHistory) {
      throw A2AError.taskNotFound(params.taskId);
    }
    this.pushNotificationConfigs.set(params.taskId, params.pushNotificationConfig);
    return params;
  }
  async getTaskPushNotificationConfig(params) {
    if (!this.agentCard.capabilities.pushNotifications) {
      throw A2AError.pushNotificationNotSupported();
    }
    const taskAndHistory = await this.taskStore.load(params.id);
    if (!taskAndHistory) {
      throw A2AError.taskNotFound(params.id);
    }
    const config = this.pushNotificationConfigs.get(params.id);
    if (!config) {
      throw A2AError.internalError(`Push notification config not found for task ${params.id}.`);
    }
    return { taskId: params.id, pushNotificationConfig: config };
  }
  async *resubscribe(params) {
    if (!this.agentCard.capabilities.streaming) {
      throw A2AError.unsupportedOperation("Streaming (and thus resubscription) is not supported.");
    }
    const task = await this.taskStore.load(params.id);
    if (!task) {
      throw A2AError.taskNotFound(params.id);
    }
    yield task;
    const finalStates = ["completed", "failed", "canceled", "rejected"];
    if (finalStates.includes(task.status.state)) {
      return;
    }
    const eventBus = this.eventBusManager.getByTaskId(params.id);
    if (!eventBus) {
      console.warn(`Resubscribe: No active event bus for task ${params.id}.`);
      return;
    }
    const eventQueue = new ExecutionEventQueue(eventBus);
    try {
      for await (const event of eventQueue.events()) {
        if (event.kind === "status-update" && event.taskId === params.id) {
          yield event;
        } else if (event.kind === "artifact-update" && event.taskId === params.id) {
          yield event;
        } else if (event.kind === "task" && event.id === params.id) {
          yield event;
        }
      }
    } finally {
      eventQueue.stop();
    }
  }
};

// src/server/store.ts
var InMemoryTaskStore = class {
  store = /* @__PURE__ */ new Map();
  async load(taskId) {
    const entry = this.store.get(taskId);
    return entry ? { ...entry } : void 0;
  }
  async save(task) {
    this.store.set(task.id, { ...task });
  }
};

// src/server/transports/jsonrpc_transport_handler.ts
var JsonRpcTransportHandler = class {
  requestHandler;
  constructor(requestHandler) {
    this.requestHandler = requestHandler;
  }
  /**
   * Handles an incoming JSON-RPC request.
   * For streaming methods, it returns an AsyncGenerator of JSONRPCResult.
   * For non-streaming methods, it returns a Promise of a single JSONRPCMessage (Result or ErrorResponse).
   */
  async handle(requestBody) {
    let rpcRequest;
    try {
      if (typeof requestBody === "string") {
        rpcRequest = JSON.parse(requestBody);
      } else if (typeof requestBody === "object" && requestBody !== null) {
        rpcRequest = requestBody;
      } else {
        throw A2AError.parseError("Invalid request body type.");
      }
      if (rpcRequest.jsonrpc !== "2.0" || !rpcRequest.method || typeof rpcRequest.method !== "string") {
        throw A2AError.invalidRequest(
          "Invalid JSON-RPC request structure."
        );
      }
    } catch (error) {
      const a2aError = error instanceof A2AError ? error : A2AError.parseError(error.message || "Failed to parse JSON request.");
      return {
        jsonrpc: "2.0",
        id: typeof rpcRequest?.id !== "undefined" ? rpcRequest.id : null,
        error: a2aError.toJSONRPCError()
      };
    }
    const { method, params = {}, id: requestId = null } = rpcRequest;
    try {
      if (method === "message/stream" || method === "tasks/resubscribe") {
        const agentCard = await this.requestHandler.getAgentCard();
        if (!agentCard.capabilities.streaming) {
          throw A2AError.unsupportedOperation(`Method ${method} requires streaming capability.`);
        }
        const agentEventStream = method === "message/stream" ? this.requestHandler.sendMessageStream(params) : this.requestHandler.resubscribe(params);
        return async function* jsonRpcEventStream() {
          try {
            for await (const event of agentEventStream) {
              yield {
                jsonrpc: "2.0",
                id: requestId,
                // Use the original request ID for all streamed responses
                result: event
              };
            }
          } catch (streamError) {
            console.error(`Error in agent event stream for ${method} (request ${requestId}):`, streamError);
            throw streamError;
          }
        }();
      } else {
        let result;
        switch (method) {
          case "message/send":
            result = await this.requestHandler.sendMessage(params);
            break;
          case "tasks/get":
            result = await this.requestHandler.getTask(params);
            break;
          case "tasks/cancel":
            result = await this.requestHandler.cancelTask(params);
            break;
          case "tasks/pushNotificationConfig/set":
            result = await this.requestHandler.setTaskPushNotificationConfig(
              params
            );
            break;
          case "tasks/pushNotificationConfig/get":
            result = await this.requestHandler.getTaskPushNotificationConfig(
              params
            );
            break;
          default:
            throw A2AError.methodNotFound(method);
        }
        return {
          jsonrpc: "2.0",
          id: requestId,
          result
        };
      }
    } catch (error) {
      const a2aError = error instanceof A2AError ? error : A2AError.internalError(error.message || "An unexpected error occurred.");
      return {
        jsonrpc: "2.0",
        id: requestId,
        error: a2aError.toJSONRPCError()
      };
    }
  }
};

// src/server/a2a_express_app.ts
import express from "express";
var A2AExpressApp = class {
  requestHandler;
  // Kept for getAgentCard
  jsonRpcTransportHandler;
  constructor(requestHandler) {
    this.requestHandler = requestHandler;
    this.jsonRpcTransportHandler = new JsonRpcTransportHandler(requestHandler);
  }
  /**
   * Adds A2A routes to an existing Express app.
   * @param app Optional existing Express app.
   * @param baseUrl The base URL for A2A endpoints (e.g., "/a2a/api").
   * @returns The Express app with A2A routes.
   */
  setupRoutes(app, baseUrl = "") {
    app.use(express.json());
    app.get(`${baseUrl}/.well-known/agent.json`, async (req, res) => {
      try {
        const agentCard = await this.requestHandler.getAgentCard();
        res.json(agentCard);
      } catch (error) {
        console.error("Error fetching agent card:", error);
        res.status(500).json({ error: "Failed to retrieve agent card" });
      }
    });
    app.post(baseUrl, async (req, res) => {
      try {
        const rpcResponseOrStream = await this.jsonRpcTransportHandler.handle(req.body);
        if (typeof rpcResponseOrStream?.[Symbol.asyncIterator] === "function") {
          const stream = rpcResponseOrStream;
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.flushHeaders();
          try {
            for await (const event of stream) {
              res.write(`id: ${(/* @__PURE__ */ new Date()).getTime()}
`);
              res.write(`data: ${JSON.stringify(event)}

`);
            }
          } catch (streamError) {
            console.error(`Error during SSE streaming (request ${req.body?.id}):`, streamError);
            const a2aError = streamError instanceof A2AError ? streamError : A2AError.internalError(streamError.message || "Streaming error.");
            const errorResponse = {
              jsonrpc: "2.0",
              id: req.body?.id || null,
              // Use original request ID if available
              error: a2aError.toJSONRPCError()
            };
            if (!res.headersSent) {
              res.status(500).json(errorResponse);
            } else {
              res.write(`id: ${(/* @__PURE__ */ new Date()).getTime()}
`);
              res.write(`event: error
`);
              res.write(`data: ${JSON.stringify(errorResponse)}

`);
            }
          } finally {
            if (!res.writableEnded) {
              res.end();
            }
          }
        } else {
          const rpcResponse = rpcResponseOrStream;
          res.status(200).json(rpcResponse);
        }
      } catch (error) {
        console.error("Unhandled error in A2AExpressApp POST handler:", error);
        const a2aError = error instanceof A2AError ? error : A2AError.internalError("General processing error.");
        const errorResponse = {
          jsonrpc: "2.0",
          id: req.body?.id || null,
          error: a2aError.toJSONRPCError()
        };
        if (!res.headersSent) {
          res.status(500).json(errorResponse);
        } else if (!res.writableEnded) {
          res.end();
        }
      }
    });
    return app;
  }
};

// src/client/client.ts
var A2AClient = class {
  agentBaseUrl;
  agentCardPromise;
  requestIdCounter = 1;
  serviceEndpointUrl;
  // To be populated from AgentCard after fetching
  /**
   * Constructs an A2AClient instance.
   * It initiates fetching the agent card from the provided agent baseUrl.
   * The Agent Card is expected at `${agentBaseUrl}/.well-known/agent.json`.
   * The `url` field from the Agent Card will be used as the RPC service endpoint.
   * @param agentBaseUrl The base URL of the A2A agent (e.g., https://agent.example.com).
   */
  constructor(agentBaseUrl) {
    this.agentBaseUrl = agentBaseUrl.replace(/\/$/, "");
    this.agentCardPromise = this._fetchAndCacheAgentCard();
  }
  /**
   * Fetches the Agent Card from the agent's well-known URI and caches its service endpoint URL.
   * This method is called by the constructor.
   * @returns A Promise that resolves to the AgentCard.
   */
  async _fetchAndCacheAgentCard() {
    const agentCardUrl = `${this.agentBaseUrl}/.well-known/agent.json`;
    try {
      const response = await fetch(agentCardUrl, {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch Agent Card from ${agentCardUrl}: ${response.status} ${response.statusText}`);
      }
      const agentCard = await response.json();
      if (!agentCard.url) {
        throw new Error("Fetched Agent Card does not contain a valid 'url' for the service endpoint.");
      }
      this.serviceEndpointUrl = agentCard.url;
      return agentCard;
    } catch (error) {
      console.error("Error fetching or parsing Agent Card:");
      throw error;
    }
  }
  /**
   * Retrieves the Agent Card.
   * If an `agentBaseUrl` is provided, it fetches the card from that specific URL.
   * Otherwise, it returns the card fetched and cached during client construction.
   * @param agentBaseUrl Optional. The base URL of the agent to fetch the card from.
   * If provided, this will fetch a new card, not use the cached one from the constructor's URL.
   * @returns A Promise that resolves to the AgentCard.
   */
  async getAgentCard(agentBaseUrl) {
    if (agentBaseUrl) {
      const specificAgentBaseUrl = agentBaseUrl.replace(/\/$/, "");
      const agentCardUrl = `${specificAgentBaseUrl}/.well-known/agent.json`;
      const response = await fetch(agentCardUrl, {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch Agent Card from ${agentCardUrl}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    }
    return this.agentCardPromise;
  }
  /**
   * Gets the RPC service endpoint URL. Ensures the agent card has been fetched first.
   * @returns A Promise that resolves to the service endpoint URL string.
   */
  async _getServiceEndpoint() {
    if (this.serviceEndpointUrl) {
      return this.serviceEndpointUrl;
    }
    await this.agentCardPromise;
    if (!this.serviceEndpointUrl) {
      throw new Error("Agent Card URL for RPC endpoint is not available. Fetching might have failed.");
    }
    return this.serviceEndpointUrl;
  }
  /**
   * Helper method to make a generic JSON-RPC POST request.
   * @param method The RPC method name.
   * @param params The parameters for the RPC method.
   * @returns A Promise that resolves to the RPC response.
   */
  async _postRpcRequest(method, params) {
    const endpoint = await this._getServiceEndpoint();
    const requestId = this.requestIdCounter++;
    const rpcRequest = {
      jsonrpc: "2.0",
      method,
      params,
      // Cast because TParams structure varies per method
      id: requestId
    };
    const httpResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
        // Expect JSON response for non-streaming requests
      },
      body: JSON.stringify(rpcRequest)
    });
    if (!httpResponse.ok) {
      let errorBodyText = "(empty or non-JSON response)";
      try {
        errorBodyText = await httpResponse.text();
        const errorJson = JSON.parse(errorBodyText);
        if (!errorJson.jsonrpc && errorJson.error) {
          throw new Error(`RPC error for ${method}: ${errorJson.error.message} (Code: ${errorJson.error.code}, HTTP Status: ${httpResponse.status}) Data: ${JSON.stringify(errorJson.error.data)}`);
        } else if (!errorJson.jsonrpc) {
          throw new Error(`HTTP error for ${method}! Status: ${httpResponse.status} ${httpResponse.statusText}. Response: ${errorBodyText}`);
        }
      } catch (e) {
        if (e.message.startsWith("RPC error for") || e.message.startsWith("HTTP error for")) throw e;
        throw new Error(`HTTP error for ${method}! Status: ${httpResponse.status} ${httpResponse.statusText}. Response: ${errorBodyText}`);
      }
    }
    const rpcResponse = await httpResponse.json();
    if (rpcResponse.id !== requestId) {
      console.error(`CRITICAL: RPC response ID mismatch for method ${method}. Expected ${requestId}, got ${rpcResponse.id}. This may lead to incorrect response handling.`);
    }
    return rpcResponse;
  }
  /**
   * Sends a message to the agent.
   * The behavior (blocking/non-blocking) and push notification configuration
   * are specified within the `params.configuration` object.
   * Optionally, `params.message.contextId` or `params.message.taskId` can be provided.
   * @param params The parameters for sending the message, including the message content and configuration.
   * @returns A Promise resolving to SendMessageResponse, which can be a Message, Task, or an error.
   */
  async sendMessage(params) {
    return this._postRpcRequest("message/send", params);
  }
  /**
   * Sends a message to the agent and streams back responses using Server-Sent Events (SSE).
   * Push notification configuration can be specified in `params.configuration`.
   * Optionally, `params.message.contextId` or `params.message.taskId` can be provided.
   * Requires the agent to support streaming (`capabilities.streaming: true` in AgentCard).
   * @param params The parameters for sending the message.
   * @returns An AsyncGenerator yielding A2AStreamEventData (Message, Task, TaskStatusUpdateEvent, or TaskArtifactUpdateEvent).
   * The generator throws an error if streaming is not supported or if an HTTP/SSE error occurs.
   */
  async *sendMessageStream(params) {
    const agentCard = await this.agentCardPromise;
    if (!agentCard.capabilities?.streaming) {
      throw new Error("Agent does not support streaming (AgentCard.capabilities.streaming is not true).");
    }
    const endpoint = await this._getServiceEndpoint();
    const clientRequestId = this.requestIdCounter++;
    const rpcRequest = {
      // This is the initial JSON-RPC request to establish the stream
      jsonrpc: "2.0",
      method: "message/stream",
      params,
      id: clientRequestId
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
        // Crucial for SSE
      },
      body: JSON.stringify(rpcRequest)
    });
    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error) {
          throw new Error(`HTTP error establishing stream for message/stream: ${response.status} ${response.statusText}. RPC Error: ${errorJson.error.message} (Code: ${errorJson.error.code})`);
        }
      } catch (e) {
        if (e.message.startsWith("HTTP error establishing stream")) throw e;
        throw new Error(`HTTP error establishing stream for message/stream: ${response.status} ${response.statusText}. Response: ${errorBody || "(empty)"}`);
      }
      throw new Error(`HTTP error establishing stream for message/stream: ${response.status} ${response.statusText}`);
    }
    if (!response.headers.get("Content-Type")?.startsWith("text/event-stream")) {
      throw new Error("Invalid response Content-Type for SSE stream. Expected 'text/event-stream'.");
    }
    yield* this._parseA2ASseStream(response, clientRequestId);
  }
  /**
   * Sets or updates the push notification configuration for a given task.
   * Requires the agent to support push notifications (`capabilities.pushNotifications: true` in AgentCard).
   * @param params Parameters containing the taskId and the TaskPushNotificationConfig.
   * @returns A Promise resolving to SetTaskPushNotificationConfigResponse.
   */
  async setTaskPushNotificationConfig(params) {
    const agentCard = await this.agentCardPromise;
    if (!agentCard.capabilities?.pushNotifications) {
      throw new Error("Agent does not support push notifications (AgentCard.capabilities.pushNotifications is not true).");
    }
    return this._postRpcRequest(
      "tasks/pushNotificationConfig/set",
      params
    );
  }
  /**
   * Gets the push notification configuration for a given task.
   * @param params Parameters containing the taskId.
   * @returns A Promise resolving to GetTaskPushNotificationConfigResponse.
   */
  async getTaskPushNotificationConfig(params) {
    return this._postRpcRequest(
      "tasks/pushNotificationConfig/get",
      params
    );
  }
  /**
   * Retrieves a task by its ID.
   * @param params Parameters containing the taskId and optional historyLength.
   * @returns A Promise resolving to GetTaskResponse, which contains the Task object or an error.
   */
  async getTask(params) {
    return this._postRpcRequest("tasks/get", params);
  }
  /**
   * Cancels a task by its ID.
   * @param params Parameters containing the taskId.
   * @returns A Promise resolving to CancelTaskResponse, which contains the updated Task object or an error.
   */
  async cancelTask(params) {
    return this._postRpcRequest("tasks/cancel", params);
  }
  /**
   * Resubscribes to a task's event stream using Server-Sent Events (SSE).
   * This is used if a previous SSE connection for an active task was broken.
   * Requires the agent to support streaming (`capabilities.streaming: true` in AgentCard).
   * @param params Parameters containing the taskId.
   * @returns An AsyncGenerator yielding A2AStreamEventData (Message, Task, TaskStatusUpdateEvent, or TaskArtifactUpdateEvent).
   */
  async *resubscribeTask(params) {
    const agentCard = await this.agentCardPromise;
    if (!agentCard.capabilities?.streaming) {
      throw new Error("Agent does not support streaming (required for tasks/resubscribe).");
    }
    const endpoint = await this._getServiceEndpoint();
    const clientRequestId = this.requestIdCounter++;
    const rpcRequest = {
      // Initial JSON-RPC request to establish the stream
      jsonrpc: "2.0",
      method: "tasks/resubscribe",
      params,
      id: clientRequestId
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
      },
      body: JSON.stringify(rpcRequest)
    });
    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error) {
          throw new Error(`HTTP error establishing stream for tasks/resubscribe: ${response.status} ${response.statusText}. RPC Error: ${errorJson.error.message} (Code: ${errorJson.error.code})`);
        }
      } catch (e) {
        if (e.message.startsWith("HTTP error establishing stream")) throw e;
        throw new Error(`HTTP error establishing stream for tasks/resubscribe: ${response.status} ${response.statusText}. Response: ${errorBody || "(empty)"}`);
      }
      throw new Error(`HTTP error establishing stream for tasks/resubscribe: ${response.status} ${response.statusText}`);
    }
    if (!response.headers.get("Content-Type")?.startsWith("text/event-stream")) {
      throw new Error("Invalid response Content-Type for SSE stream on resubscribe. Expected 'text/event-stream'.");
    }
    yield* this._parseA2ASseStream(response, clientRequestId);
  }
  /**
   * Parses an HTTP response body as an A2A Server-Sent Event stream.
   * Each 'data' field of an SSE event is expected to be a JSON-RPC 2.0 Response object,
   * specifically a SendStreamingMessageResponse (or similar structure for resubscribe).
   * @param response The HTTP Response object whose body is the SSE stream.
   * @param originalRequestId The ID of the client's JSON-RPC request that initiated this stream.
   * Used to validate the `id` in the streamed JSON-RPC responses.
   * @returns An AsyncGenerator yielding the `result` field of each valid JSON-RPC success response from the stream.
   */
  async *_parseA2ASseStream(response, originalRequestId) {
    if (!response.body) {
      throw new Error("SSE response body is undefined. Cannot read stream.");
    }
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    let eventDataBuffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (eventDataBuffer.trim()) {
            const result = this._processSseEventData(eventDataBuffer, originalRequestId);
            yield result;
          }
          break;
        }
        buffer += value;
        let lineEndIndex;
        while ((lineEndIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.substring(0, lineEndIndex).trim();
          buffer = buffer.substring(lineEndIndex + 1);
          if (line === "") {
            if (eventDataBuffer) {
              const result = this._processSseEventData(eventDataBuffer, originalRequestId);
              yield result;
              eventDataBuffer = "";
            }
          } else if (line.startsWith("data:")) {
            eventDataBuffer += line.substring(5).trimStart() + "\n";
          } else if (line.startsWith(":")) {
          } else if (line.includes(":")) {
          }
        }
      }
    } catch (error) {
      console.error("Error reading or parsing SSE stream:", error.message);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
  /**
   * Processes a single SSE event's data string, expecting it to be a JSON-RPC response.
   * @param jsonData The string content from one or more 'data:' lines of an SSE event.
   * @param originalRequestId The ID of the client's request that initiated the stream.
   * @returns The `result` field of the parsed JSON-RPC success response.
   * @throws Error if data is not valid JSON, not a valid JSON-RPC response, an error response, or ID mismatch.
   */
  _processSseEventData(jsonData, originalRequestId) {
    if (!jsonData.trim()) {
      throw new Error("Attempted to process empty SSE event data.");
    }
    try {
      const sseJsonRpcResponse = JSON.parse(jsonData.replace(/\n$/, ""));
      const a2aStreamResponse = sseJsonRpcResponse;
      if (a2aStreamResponse.id !== originalRequestId) {
        console.warn(`SSE Event's JSON-RPC response ID mismatch. Client request ID: ${originalRequestId}, event response ID: ${a2aStreamResponse.id}.`);
      }
      if (this.isErrorResponse(a2aStreamResponse)) {
        const err = a2aStreamResponse.error;
        throw new Error(`SSE event contained an error: ${err.message} (Code: ${err.code}) Data: ${JSON.stringify(err.data)}`);
      }
      if (!("result" in a2aStreamResponse) || typeof a2aStreamResponse.result === "undefined") {
        throw new Error(`SSE event JSON-RPC response is missing 'result' field. Data: ${jsonData}`);
      }
      const successResponse = a2aStreamResponse;
      return successResponse.result;
    } catch (e) {
      if (e.message.startsWith("SSE event contained an error") || e.message.startsWith("SSE event JSON-RPC response is missing 'result' field")) {
        throw e;
      }
      console.error("Failed to parse SSE event data string or unexpected JSON-RPC structure:", jsonData, e);
      throw new Error(`Failed to parse SSE event data: "${jsonData.substring(0, 100)}...". Original error: ${e.message}`);
    }
  }
  isErrorResponse(response) {
    return "error" in response;
  }
};
export {
  A2AClient,
  A2AError,
  A2AExpressApp,
  DefaultExecutionEventBus,
  DefaultExecutionEventBusManager,
  DefaultRequestHandler,
  InMemoryTaskStore,
  JsonRpcTransportHandler,
  RequestContext,
  ResultManager
};
