import { EventEmitter } from 'events';
import { M as Message, T as Task, a as TaskStatusUpdateEvent, b as TaskArtifactUpdateEvent, A as AgentCard, c as MessageSendParams, d as TaskQueryParams, e as TaskIdParams, f as TaskPushNotificationConfig, g as A2AResponse, J as JSONRPCError } from './client--jO4FTP_.js';
export { h as A2AClient, i as A2ARequest, a0 as APIKeySecurityScheme, a1 as AgentCapabilities, a3 as AgentCapabilities1, a2 as AgentExtension, a4 as AgentProvider, ae as AgentProvider1, ad as AgentSkill, af as Artifact, az as Artifact1, a8 as AuthorizationCodeOAuthFlow, ag as AuthorizationCodeOAuthFlow1, V as CancelTaskRequest, C as CancelTaskResponse, ai as CancelTaskSuccessResponse, a9 as ClientCredentialsOAuthFlow, am as ClientCredentialsOAuthFlow1, x as ContentTypeNotSupportedError, N as DataPart, an as FileBase, H as FilePart, K as FileWithBytes, L as FileWithUri, Y as GetTaskPushNotificationConfigRequest, G as GetTaskPushNotificationConfigResponse, ao as GetTaskPushNotificationConfigSuccessResponse, R as GetTaskRequest, k as GetTaskResponse, aq as GetTaskSuccessResponse, a5 as HTTPAuthSecurityScheme, aa as ImplicitOAuthFlow, as as ImplicitOAuthFlow1, t as InternalError, y as InvalidAgentResponseError, s as InvalidParamsError, I as InvalidRequestError, q as JSONParseError, ah as JSONRPCErrorResponse, at as JSONRPCMessage, au as JSONRPCRequest, l as JSONRPCResponse, aC as JSONRPCSuccessResponse, aj as Message1, al as Message2, B as MessageSendConfiguration, aD as MessageSendConfiguration1, Q as MessageSendParams1, aE as MessageSendParams2, r as MethodNotFoundError, p as MySchema, a6 as OAuth2SecurityScheme, a7 as OAuthFlows, aF as OAuthFlows1, ac as OpenIdConnectSecurityScheme, P as Part, aG as PartBase, ab as PasswordOAuthFlow, aH as PasswordOAuthFlow1, E as PushNotificationAuthenticationInfo, D as PushNotificationConfig, X as PushNotificationConfig1, aI as PushNotificationConfig2, w as PushNotificationNotSupportedError, S as SecurityScheme, aJ as SecuritySchemeBase, z as SendMessageRequest, m as SendMessageResponse, av as SendMessageSuccessResponse, O as SendStreamingMessageRequest, n as SendStreamingMessageResponse, ax as SendStreamingMessageSuccessResponse, W as SetTaskPushNotificationConfigRequest, o as SetTaskPushNotificationConfigResponse, aA as SetTaskPushNotificationConfigSuccessResponse, ar as Task1, aw as Task2, Z as TaskIdParams1, $ as TaskIdParams2, aK as TaskIdParams3, v as TaskNotCancelableError, u as TaskNotFoundError, ap as TaskPushNotificationConfig1, aB as TaskPushNotificationConfig2, aL as TaskPushNotificationConfig3, aM as TaskQueryParams1, _ as TaskResubscriptionRequest, j as TaskState, ak as TaskStatus, ay as TaskStatus1, aN as TaskStatus2, F as TextPart, U as UnsupportedOperationError } from './client--jO4FTP_.js';
import { Express } from 'express';

type AgentExecutionEvent = Message | Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent;
interface ExecutionEventBus {
    publish(event: AgentExecutionEvent): void;
    on(eventName: 'event' | 'finished', listener: (event: AgentExecutionEvent) => void): this;
    off(eventName: 'event' | 'finished', listener: (event: AgentExecutionEvent) => void): this;
    once(eventName: 'event' | 'finished', listener: (event: AgentExecutionEvent) => void): this;
    removeAllListeners(eventName?: 'event' | 'finished'): this;
    finished(): void;
}
declare class DefaultExecutionEventBus extends EventEmitter implements ExecutionEventBus {
    constructor();
    publish(event: AgentExecutionEvent): void;
    finished(): void;
}

declare class RequestContext {
    readonly userMessage: Message;
    readonly task?: Task;
    readonly referenceTasks?: Task[];
    readonly taskId: string;
    readonly contextId: string;
    constructor(userMessage: Message, taskId: string, contextId: string, task?: Task, referenceTasks?: Task[]);
}

interface AgentExecutor {
    /**
     * Executes the agent logic based on the request context and publishes events.
     * @param requestContext The context of the current request.
     * @param eventBus The bus to publish execution events to.
     */
    execute: (requestContext: RequestContext, eventBus: ExecutionEventBus) => Promise<void>;
    /**
     * Method to explicitly cancel a running task.
     * The implementation should handle the logic of stopping the execution
     * and publishing the final 'canceled' status event on the provided event bus.
     * @param taskId The ID of the task to cancel.
     * @param eventBus The event bus associated with the task's execution.
     */
    cancelTask: (taskId: string, eventBus: ExecutionEventBus) => Promise<void>;
}

interface ExecutionEventBusManager {
    createOrGetByTaskId(taskId: string): ExecutionEventBus;
    getByTaskId(taskId: string): ExecutionEventBus | undefined;
    cleanupByTaskId(taskId: string): void;
}
declare class DefaultExecutionEventBusManager implements ExecutionEventBusManager {
    private taskIdToBus;
    /**
     * Creates or retrieves an existing ExecutionEventBus based on the taskId.
     * @param taskId The ID of the task.
     * @returns An instance of IExecutionEventBus.
     */
    createOrGetByTaskId(taskId: string): ExecutionEventBus;
    /**
     * Retrieves an existing ExecutionEventBus based on the taskId.
     * @param taskId The ID of the task.
     * @returns An instance of IExecutionEventBus or undefined if not found.
     */
    getByTaskId(taskId: string): ExecutionEventBus | undefined;
    /**
     * Removes the event bus for a given taskId.
     * This should be called when an execution flow is complete to free resources.
     * @param taskId The ID of the task.
     */
    cleanupByTaskId(taskId: string): void;
}

interface A2ARequestHandler {
    getAgentCard(): Promise<AgentCard>;
    sendMessage(params: MessageSendParams): Promise<Message | Task>;
    sendMessageStream(params: MessageSendParams): AsyncGenerator<Message | Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent, void, undefined>;
    getTask(params: TaskQueryParams): Promise<Task>;
    cancelTask(params: TaskIdParams): Promise<Task>;
    setTaskPushNotificationConfig(params: TaskPushNotificationConfig): Promise<TaskPushNotificationConfig>;
    getTaskPushNotificationConfig(params: TaskIdParams): Promise<TaskPushNotificationConfig>;
    resubscribe(params: TaskIdParams): AsyncGenerator<Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent, void, undefined>;
}

/**
 * Simplified interface for task storage providers.
 * Stores and retrieves the task.
 */
interface TaskStore {
    /**
     * Saves a task.
     * Overwrites existing data if the task ID exists.
     * @param data An object containing the task.
     * @returns A promise resolving when the save operation is complete.
     */
    save(task: Task): Promise<void>;
    /**
     * Loads a task by task ID.
     * @param taskId The ID of the task to load.
     * @returns A promise resolving to an object containing the Task, or undefined if not found.
     */
    load(taskId: string): Promise<Task | undefined>;
}
declare class InMemoryTaskStore implements TaskStore {
    private store;
    load(taskId: string): Promise<Task | undefined>;
    save(task: Task): Promise<void>;
}

declare class DefaultRequestHandler implements A2ARequestHandler {
    private readonly agentCard;
    private readonly taskStore;
    private readonly agentExecutor;
    private readonly eventBusManager;
    private readonly pushNotificationConfigs;
    constructor(agentCard: AgentCard, taskStore: TaskStore, agentExecutor: AgentExecutor, eventBusManager?: ExecutionEventBusManager);
    getAgentCard(): Promise<AgentCard>;
    private _createRequestContext;
    private _processEvents;
    sendMessage(params: MessageSendParams): Promise<Message | Task>;
    sendMessageStream(params: MessageSendParams): AsyncGenerator<Message | Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent, void, undefined>;
    getTask(params: TaskQueryParams): Promise<Task>;
    cancelTask(params: TaskIdParams): Promise<Task>;
    setTaskPushNotificationConfig(params: TaskPushNotificationConfig): Promise<TaskPushNotificationConfig>;
    getTaskPushNotificationConfig(params: TaskIdParams): Promise<TaskPushNotificationConfig>;
    resubscribe(params: TaskIdParams): AsyncGenerator<Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent, void, undefined>;
}

declare class ResultManager {
    private taskStore;
    private currentTask?;
    private latestUserMessage?;
    private finalMessageResult?;
    constructor(taskStore: TaskStore);
    setContext(latestUserMessage: Message): void;
    /**
     * Processes an agent execution event and updates the task store.
     * @param event The agent execution event.
     */
    processEvent(event: AgentExecutionEvent): Promise<void>;
    private saveCurrentTask;
    /**
     * Gets the final result, which could be a Message or a Task.
     * This should be called after the event stream has been fully processed.
     * @returns The final Message or the current Task.
     */
    getFinalResult(): Message | Task | undefined;
    /**
     * Gets the task currently being managed by this ResultManager instance.
     * This task could be one that was started with or one created during agent execution.
     * @returns The current Task or undefined if no task is active.
     */
    getCurrentTask(): Task | undefined;
}

/**
 * Handles JSON-RPC transport layer, routing requests to A2ARequestHandler.
 */
declare class JsonRpcTransportHandler {
    private requestHandler;
    constructor(requestHandler: A2ARequestHandler);
    /**
     * Handles an incoming JSON-RPC request.
     * For streaming methods, it returns an AsyncGenerator of JSONRPCResult.
     * For non-streaming methods, it returns a Promise of a single JSONRPCMessage (Result or ErrorResponse).
     */
    handle(requestBody: any): Promise<A2AResponse | AsyncGenerator<A2AResponse, void, undefined>>;
}

declare class A2AExpressApp {
    private requestHandler;
    private jsonRpcTransportHandler;
    constructor(requestHandler: A2ARequestHandler);
    /**
     * Adds A2A routes to an existing Express app.
     * @param app Optional existing Express app.
     * @param baseUrl The base URL for A2A endpoints (e.g., "/a2a/api").
     * @returns The Express app with A2A routes.
     */
    setupRoutes(app: Express, baseUrl?: string): Express;
}

/**
 * Custom error class for A2A server operations, incorporating JSON-RPC error codes.
 */
declare class A2AError extends Error {
    code: number;
    data?: Record<string, unknown>;
    taskId?: string;
    constructor(code: number, message: string, data?: Record<string, unknown>, taskId?: string);
    /**
     * Formats the error into a standard JSON-RPC error object structure.
     */
    toJSONRPCError(): JSONRPCError;
    static parseError(message: string, data?: Record<string, unknown>): A2AError;
    static invalidRequest(message: string, data?: Record<string, unknown>): A2AError;
    static methodNotFound(method: string): A2AError;
    static invalidParams(message: string, data?: Record<string, unknown>): A2AError;
    static internalError(message: string, data?: Record<string, unknown>): A2AError;
    static taskNotFound(taskId: string): A2AError;
    static taskNotCancelable(taskId: string): A2AError;
    static pushNotificationNotSupported(): A2AError;
    static unsupportedOperation(operation: string): A2AError;
}

export { A2AError, A2AExpressApp, type A2ARequestHandler, A2AResponse, AgentCard, type AgentExecutor, DefaultExecutionEventBus, DefaultExecutionEventBusManager, DefaultRequestHandler, type ExecutionEventBus, type ExecutionEventBusManager, InMemoryTaskStore, JSONRPCError, JsonRpcTransportHandler, Message, MessageSendParams, RequestContext, ResultManager, Task, TaskArtifactUpdateEvent, TaskIdParams, TaskPushNotificationConfig, TaskQueryParams, TaskStatusUpdateEvent, type TaskStore };
