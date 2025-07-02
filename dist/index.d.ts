import { EventEmitter } from 'events';
import { Express } from 'express';

/**
 * A2A supported request types
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "A2ARequest".
 */
type A2ARequest = SendMessageRequest | SendStreamingMessageRequest | GetTaskRequest | CancelTaskRequest | SetTaskPushNotificationConfigRequest | GetTaskPushNotificationConfigRequest | TaskResubscriptionRequest;
/**
 * Represents a part of a message, which can be text, a file, or structured data.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "Part".
 */
type Part = TextPart | FilePart | DataPart;
/**
 * Mirrors the OpenAPI Security Scheme Object
 * (https://swagger.io/specification/#security-scheme-object)
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SecurityScheme".
 */
type SecurityScheme = APIKeySecurityScheme | HTTPAuthSecurityScheme | OAuth2SecurityScheme | OpenIdConnectSecurityScheme;
/**
 * JSON-RPC response for the 'tasks/cancel' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "CancelTaskResponse".
 */
type CancelTaskResponse = JSONRPCErrorResponse | CancelTaskSuccessResponse;
/**
 * Represents the possible states of a Task.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskState".
 */
type TaskState = "submitted" | "working" | "input-required" | "completed" | "canceled" | "failed" | "rejected" | "auth-required" | "unknown";
/**
 * JSON-RPC response for the 'tasks/pushNotificationConfig/set' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "GetTaskPushNotificationConfigResponse".
 */
type GetTaskPushNotificationConfigResponse = JSONRPCErrorResponse | GetTaskPushNotificationConfigSuccessResponse;
/**
 * JSON-RPC response for the 'tasks/get' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "GetTaskResponse".
 */
type GetTaskResponse = JSONRPCErrorResponse | GetTaskSuccessResponse;
/**
 * Represents a JSON-RPC 2.0 Response object.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONRPCResponse".
 */
type JSONRPCResponse = JSONRPCErrorResponse | SendMessageSuccessResponse | SendStreamingMessageSuccessResponse | GetTaskSuccessResponse | CancelTaskSuccessResponse | SetTaskPushNotificationConfigSuccessResponse | GetTaskPushNotificationConfigSuccessResponse;
/**
 * JSON-RPC response model for the 'message/send' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SendMessageResponse".
 */
type SendMessageResponse = JSONRPCErrorResponse | SendMessageSuccessResponse;
/**
 * JSON-RPC response model for the 'message/stream' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SendStreamingMessageResponse".
 */
type SendStreamingMessageResponse = JSONRPCErrorResponse | SendStreamingMessageSuccessResponse;
/**
 * JSON-RPC response for the 'tasks/pushNotificationConfig/set' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SetTaskPushNotificationConfigResponse".
 */
type SetTaskPushNotificationConfigResponse = JSONRPCErrorResponse | SetTaskPushNotificationConfigSuccessResponse;
interface MySchema {
    [k: string]: unknown;
}
/**
 * JSON-RPC error indicating invalid JSON was received by the server.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONParseError".
 */
interface JSONParseError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32700;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * JSON-RPC error indicating the JSON sent is not a valid Request object.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "InvalidRequestError".
 */
interface InvalidRequestError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32600;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * JSON-RPC error indicating the method does not exist or is not available.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "MethodNotFoundError".
 */
interface MethodNotFoundError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32601;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * JSON-RPC error indicating invalid method parameter(s).
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "InvalidParamsError".
 */
interface InvalidParamsError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32602;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * JSON-RPC error indicating an internal JSON-RPC error on the server.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "InternalError".
 */
interface InternalError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32603;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * A2A specific error indicating the requested task ID was not found.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskNotFoundError".
 */
interface TaskNotFoundError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32001;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * A2A specific error indicating the task is in a state where it cannot be canceled.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskNotCancelableError".
 */
interface TaskNotCancelableError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32002;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * A2A specific error indicating the agent does not support push notifications.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "PushNotificationNotSupportedError".
 */
interface PushNotificationNotSupportedError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32003;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * A2A specific error indicating the requested operation is not supported by the agent.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "UnsupportedOperationError".
 */
interface UnsupportedOperationError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32004;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * A2A specific error indicating incompatible content types between request and agent capabilities.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "ContentTypeNotSupportedError".
 */
interface ContentTypeNotSupportedError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32005;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * A2A specific error indicating agent returned invalid response for the current method
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "InvalidAgentResponseError".
 */
interface InvalidAgentResponseError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: -32006;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * JSON-RPC request model for the 'message/send' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SendMessageRequest".
 */
interface SendMessageRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "message/send";
    params: MessageSendParams;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface MessageSendParams {
    configuration?: MessageSendConfiguration;
    message: Message;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * Send message configuration.
 */
interface MessageSendConfiguration {
    /**
     * Accepted output modalities by the client.
     */
    acceptedOutputModes: string[];
    /**
     * If the server should treat the client as a blocking request.
     */
    blocking?: boolean;
    /**
     * Number of recent messages to be retrieved.
     */
    historyLength?: number;
    pushNotificationConfig?: PushNotificationConfig;
}
/**
 * Where the server should send notifications when disconnected.
 */
interface PushNotificationConfig {
    authentication?: PushNotificationAuthenticationInfo;
    /**
     * Push Notification ID - created by server to support multiple callbacks
     */
    id?: string;
    /**
     * Token unique to this task/session.
     */
    token?: string;
    /**
     * URL for sending the push notifications.
     */
    url: string;
}
/**
 * Defines authentication details for push notifications.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "PushNotificationAuthenticationInfo".
 */
interface PushNotificationAuthenticationInfo {
    /**
     * Optional credentials
     */
    credentials?: string;
    /**
     * Supported authentication schemes - e.g. Basic, Bearer
     */
    schemes: string[];
}
/**
 * The message being sent to the server.
 */
interface Message {
    /**
     * The context the message is associated with
     */
    contextId?: string;
    /**
     * The URIs of extensions that are present or contributed to this Message.
     */
    extensions?: string[];
    /**
     * Event type
     */
    kind: "message";
    /**
     * Identifier created by the message creator
     */
    messageId: string;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Message content
     */
    parts: Part[];
    /**
     * List of tasks referenced as context by this message.
     */
    referenceTaskIds?: string[];
    /**
     * Message sender's role
     */
    role: "agent" | "user";
    /**
     * Identifier of task the message is related to
     */
    taskId?: string;
}
/**
 * Represents a text segment within parts.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TextPart".
 */
interface TextPart {
    /**
     * Part type - text for TextParts
     */
    kind: "text";
    /**
     * Optional metadata associated with the part.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Text content
     */
    text: string;
}
/**
 * Represents a File segment within parts.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "FilePart".
 */
interface FilePart {
    /**
     * File content either as url or bytes
     */
    file: FileWithBytes | FileWithUri;
    /**
     * Part type - file for FileParts
     */
    kind: "file";
    /**
     * Optional metadata associated with the part.
     */
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * Define the variant where 'bytes' is present and 'uri' is absent
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "FileWithBytes".
 */
interface FileWithBytes {
    /**
     * base64 encoded content of the file
     */
    bytes: string;
    /**
     * Optional mimeType for the file
     */
    mimeType?: string;
    /**
     * Optional name for the file
     */
    name?: string;
}
/**
 * Define the variant where 'uri' is present and 'bytes' is absent
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "FileWithUri".
 */
interface FileWithUri {
    /**
     * Optional mimeType for the file
     */
    mimeType?: string;
    /**
     * Optional name for the file
     */
    name?: string;
    /**
     * URL for the File content
     */
    uri: string;
}
/**
 * Represents a structured data segment within a message part.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "DataPart".
 */
interface DataPart {
    /**
     * Structured data content
     */
    data: {
        [k: string]: unknown;
    };
    /**
     * Part type - data for DataParts
     */
    kind: "data";
    /**
     * Optional metadata associated with the part.
     */
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * JSON-RPC request model for the 'message/stream' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SendStreamingMessageRequest".
 */
interface SendStreamingMessageRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "message/stream";
    params: MessageSendParams1;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface MessageSendParams1 {
    configuration?: MessageSendConfiguration;
    message: Message;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * JSON-RPC request model for the 'tasks/get' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "GetTaskRequest".
 */
interface GetTaskRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "tasks/get";
    params: TaskQueryParams;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface TaskQueryParams {
    /**
     * Number of recent messages to be retrieved.
     */
    historyLength?: number;
    /**
     * Task id.
     */
    id: string;
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * JSON-RPC request model for the 'tasks/cancel' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "CancelTaskRequest".
 */
interface CancelTaskRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "tasks/cancel";
    params: TaskIdParams;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface TaskIdParams {
    /**
     * Task id.
     */
    id: string;
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * JSON-RPC request model for the 'tasks/pushNotificationConfig/set' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SetTaskPushNotificationConfigRequest".
 */
interface SetTaskPushNotificationConfigRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "tasks/pushNotificationConfig/set";
    params: TaskPushNotificationConfig;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface TaskPushNotificationConfig {
    pushNotificationConfig: PushNotificationConfig1;
    /**
     * Task id.
     */
    taskId: string;
}
/**
 * Push notification configuration.
 */
interface PushNotificationConfig1 {
    authentication?: PushNotificationAuthenticationInfo;
    /**
     * Push Notification ID - created by server to support multiple callbacks
     */
    id?: string;
    /**
     * Token unique to this task/session.
     */
    token?: string;
    /**
     * URL for sending the push notifications.
     */
    url: string;
}
/**
 * JSON-RPC request model for the 'tasks/pushNotificationConfig/get' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "GetTaskPushNotificationConfigRequest".
 */
interface GetTaskPushNotificationConfigRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "tasks/pushNotificationConfig/get";
    params: TaskIdParams1;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface TaskIdParams1 {
    /**
     * Task id.
     */
    id: string;
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * JSON-RPC request model for the 'tasks/resubscribe' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskResubscriptionRequest".
 */
interface TaskResubscriptionRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: "tasks/resubscribe";
    params: TaskIdParams2;
}
/**
 * A Structured value that holds the parameter values to be used during the invocation of the method.
 */
interface TaskIdParams2 {
    /**
     * Task id.
     */
    id: string;
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * API Key security scheme.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "APIKeySecurityScheme".
 */
interface APIKeySecurityScheme {
    /**
     * Description of this security scheme.
     */
    description?: string;
    /**
     * The location of the API key. Valid values are "query", "header", or "cookie".
     */
    in: "cookie" | "header" | "query";
    /**
     * The name of the header, query or cookie parameter to be used.
     */
    name: string;
    type: "apiKey";
}
/**
 * Defines optional capabilities supported by an agent.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AgentCapabilities".
 */
interface AgentCapabilities {
    /**
     * extensions supported by this agent.
     */
    extensions?: AgentExtension[];
    /**
     * true if the agent can notify updates to client.
     */
    pushNotifications?: boolean;
    /**
     * true if the agent exposes status change history for tasks.
     */
    stateTransitionHistory?: boolean;
    /**
     * true if the agent supports SSE.
     */
    streaming?: boolean;
}
/**
 * A declaration of an extension supported by an Agent.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AgentExtension".
 */
interface AgentExtension {
    /**
     * A description of how this agent uses this extension.
     */
    description?: string;
    /**
     * Optional configuration for the extension.
     */
    params?: {
        [k: string]: unknown;
    };
    /**
     * Whether the client must follow specific requirements of the extension.
     */
    required?: boolean;
    /**
     * The URI of the extension.
     */
    uri: string;
}
/**
 * An AgentCard conveys key information:
 * - Overall details (version, name, description, uses)
 * - Skills: A set of capabilities the agent can perform
 * - Default modalities/content types supported by the agent.
 * - Authentication requirements
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AgentCard".
 */
interface AgentCard {
    capabilities: AgentCapabilities1;
    /**
     * The set of interaction modes that the agent supports across all skills. This can be overridden per-skill.
     * Supported media types for input.
     */
    defaultInputModes: string[];
    /**
     * Supported media types for output.
     */
    defaultOutputModes: string[];
    /**
     * A human-readable description of the agent. Used to assist users and
     * other agents in understanding what the agent can do.
     */
    description: string;
    /**
     * A URL to documentation for the agent.
     */
    documentationUrl?: string;
    /**
     * A URL to an icon for the agent.
     */
    iconUrl?: string;
    /**
     * Human readable name of the agent.
     */
    name: string;
    provider?: AgentProvider;
    /**
     * Security requirements for contacting the agent.
     */
    security?: {
        [k: string]: string[];
    }[];
    /**
     * Security scheme details used for authenticating with this agent.
     */
    securitySchemes?: {
        [k: string]: SecurityScheme;
    };
    /**
     * Skills are a unit of capability that an agent can perform.
     */
    skills: AgentSkill[];
    /**
     * true if the agent supports providing an extended agent card when the user is authenticated.
     * Defaults to false if not specified.
     */
    supportsAuthenticatedExtendedCard?: boolean;
    /**
     * A URL to the address the agent is hosted at.
     */
    url: string;
    /**
     * The version of the agent - format is up to the provider.
     */
    version: string;
}
/**
 * Optional capabilities supported by the agent.
 */
interface AgentCapabilities1 {
    /**
     * extensions supported by this agent.
     */
    extensions?: AgentExtension[];
    /**
     * true if the agent can notify updates to client.
     */
    pushNotifications?: boolean;
    /**
     * true if the agent exposes status change history for tasks.
     */
    stateTransitionHistory?: boolean;
    /**
     * true if the agent supports SSE.
     */
    streaming?: boolean;
}
/**
 * The service provider of the agent
 */
interface AgentProvider {
    /**
     * Agent provider's organization name.
     */
    organization: string;
    /**
     * Agent provider's URL.
     */
    url: string;
}
/**
 * HTTP Authentication security scheme.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "HTTPAuthSecurityScheme".
 */
interface HTTPAuthSecurityScheme {
    /**
     * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually
     * generated by an authorization server, so this information is primarily for documentation
     * purposes.
     */
    bearerFormat?: string;
    /**
     * Description of this security scheme.
     */
    description?: string;
    /**
     * The name of the HTTP Authentication scheme to be used in the Authorization header as defined
     * in RFC7235. The values used SHOULD be registered in the IANA Authentication Scheme registry.
     * The value is case-insensitive, as defined in RFC7235.
     */
    scheme: string;
    type: "http";
}
/**
 * OAuth2.0 security scheme configuration.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "OAuth2SecurityScheme".
 */
interface OAuth2SecurityScheme {
    /**
     * Description of this security scheme.
     */
    description?: string;
    flows: OAuthFlows;
    type: "oauth2";
}
/**
 * An object containing configuration information for the flow types supported.
 */
interface OAuthFlows {
    authorizationCode?: AuthorizationCodeOAuthFlow;
    clientCredentials?: ClientCredentialsOAuthFlow;
    implicit?: ImplicitOAuthFlow;
    password?: PasswordOAuthFlow;
}
/**
 * Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0.
 */
interface AuthorizationCodeOAuthFlow {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS
     */
    authorizationUrl: string;
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard
     * requires the use of TLS.
     */
    tokenUrl: string;
}
/**
 * Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0
 */
interface ClientCredentialsOAuthFlow {
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard
     * requires the use of TLS.
     */
    tokenUrl: string;
}
/**
 * Configuration for the OAuth Implicit flow
 */
interface ImplicitOAuthFlow {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS
     */
    authorizationUrl: string;
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
}
/**
 * Configuration for the OAuth Resource Owner Password flow
 */
interface PasswordOAuthFlow {
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard
     * requires the use of TLS.
     */
    tokenUrl: string;
}
/**
 * OpenID Connect security scheme configuration.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "OpenIdConnectSecurityScheme".
 */
interface OpenIdConnectSecurityScheme {
    /**
     * Description of this security scheme.
     */
    description?: string;
    /**
     * Well-known URL to discover the [[OpenID-Connect-Discovery]] provider metadata.
     */
    openIdConnectUrl: string;
    type: "openIdConnect";
}
/**
 * Represents a unit of capability that an agent can perform.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AgentSkill".
 */
interface AgentSkill {
    /**
     * Description of the skill - will be used by the client or a human
     * as a hint to understand what the skill does.
     */
    description: string;
    /**
     * The set of example scenarios that the skill can perform.
     * Will be used by the client as a hint to understand how the skill can be used.
     */
    examples?: string[];
    /**
     * Unique identifier for the agent's skill.
     */
    id: string;
    /**
     * The set of interaction modes that the skill supports
     * (if different than the default).
     * Supported media types for input.
     */
    inputModes?: string[];
    /**
     * Human readable name of the skill.
     */
    name: string;
    /**
     * Supported media types for output.
     */
    outputModes?: string[];
    /**
     * Set of tagwords describing classes of capabilities for this specific skill.
     */
    tags: string[];
}
/**
 * Represents the service provider of an agent.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AgentProvider".
 */
interface AgentProvider1 {
    /**
     * Agent provider's organization name.
     */
    organization: string;
    /**
     * Agent provider's URL.
     */
    url: string;
}
/**
 * Represents an artifact generated for a task.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "Artifact".
 */
interface Artifact {
    /**
     * Unique identifier for the artifact.
     */
    artifactId: string;
    /**
     * Optional description for the artifact.
     */
    description?: string;
    /**
     * The URIs of extensions that are present or contributed to this Artifact.
     */
    extensions?: string[];
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Optional name for the artifact.
     */
    name?: string;
    /**
     * Artifact parts.
     */
    parts: Part[];
}
/**
 * Configuration details for a supported OAuth Flow
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AuthorizationCodeOAuthFlow".
 */
interface AuthorizationCodeOAuthFlow1 {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS
     */
    authorizationUrl: string;
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard
     * requires the use of TLS.
     */
    tokenUrl: string;
}
/**
 * Represents a JSON-RPC 2.0 Error Response object.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONRPCErrorResponse".
 */
interface JSONRPCErrorResponse {
    error: JSONRPCError | JSONParseError | InvalidRequestError | MethodNotFoundError | InvalidParamsError | InternalError | TaskNotFoundError | TaskNotCancelableError | PushNotificationNotSupportedError | UnsupportedOperationError | ContentTypeNotSupportedError | InvalidAgentResponseError;
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
}
/**
 * Represents a JSON-RPC 2.0 Error object.
 * This is typically included in a JSONRPCErrorResponse when an error occurs.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONRPCError".
 */
interface JSONRPCError {
    /**
     * A Number that indicates the error type that occurred.
     */
    code: number;
    /**
     * A Primitive or Structured value that contains additional information about the error.
     * This may be omitted.
     */
    data?: {
        [k: string]: unknown;
    };
    /**
     * A String providing a short description of the error.
     */
    message: string;
}
/**
 * JSON-RPC success response model for the 'tasks/cancel' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "CancelTaskSuccessResponse".
 */
interface CancelTaskSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    result: Task;
}
/**
 * The result object on success.
 */
interface Task {
    /**
     * Collection of artifacts created by the agent.
     */
    artifacts?: Artifact[];
    /**
     * Server-generated id for contextual alignment across interactions
     */
    contextId: string;
    history?: Message1[];
    /**
     * Unique identifier for the task
     */
    id: string;
    /**
     * Event type
     */
    kind: "task";
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    status: TaskStatus;
}
/**
 * Represents a single message exchanged between user and agent.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "Message".
 */
interface Message1 {
    /**
     * The context the message is associated with
     */
    contextId?: string;
    /**
     * The URIs of extensions that are present or contributed to this Message.
     */
    extensions?: string[];
    /**
     * Event type
     */
    kind: "message";
    /**
     * Identifier created by the message creator
     */
    messageId: string;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Message content
     */
    parts: Part[];
    /**
     * List of tasks referenced as context by this message.
     */
    referenceTaskIds?: string[];
    /**
     * Message sender's role
     */
    role: "agent" | "user";
    /**
     * Identifier of task the message is related to
     */
    taskId?: string;
}
/**
 * Current status of the task
 */
interface TaskStatus {
    message?: Message2;
    state: TaskState;
    /**
     * ISO 8601 datetime string when the status was recorded.
     */
    timestamp?: string;
}
/**
 * Represents a single message exchanged between user and agent.
 */
interface Message2 {
    /**
     * The context the message is associated with
     */
    contextId?: string;
    /**
     * The URIs of extensions that are present or contributed to this Message.
     */
    extensions?: string[];
    /**
     * Event type
     */
    kind: "message";
    /**
     * Identifier created by the message creator
     */
    messageId: string;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Message content
     */
    parts: Part[];
    /**
     * List of tasks referenced as context by this message.
     */
    referenceTaskIds?: string[];
    /**
     * Message sender's role
     */
    role: "agent" | "user";
    /**
     * Identifier of task the message is related to
     */
    taskId?: string;
}
/**
 * Configuration details for a supported OAuth Flow
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "ClientCredentialsOAuthFlow".
 */
interface ClientCredentialsOAuthFlow1 {
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard
     * requires the use of TLS.
     */
    tokenUrl: string;
}
/**
 * Represents the base entity for FileParts
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "FileBase".
 */
interface FileBase {
    /**
     * Optional mimeType for the file
     */
    mimeType?: string;
    /**
     * Optional name for the file
     */
    name?: string;
}
/**
 * JSON-RPC success response model for the 'tasks/pushNotificationConfig/get' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "GetTaskPushNotificationConfigSuccessResponse".
 */
interface GetTaskPushNotificationConfigSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    result: TaskPushNotificationConfig1;
}
/**
 * The result object on success.
 */
interface TaskPushNotificationConfig1 {
    pushNotificationConfig: PushNotificationConfig1;
    /**
     * Task id.
     */
    taskId: string;
}
/**
 * JSON-RPC success response for the 'tasks/get' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "GetTaskSuccessResponse".
 */
interface GetTaskSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    result: Task1;
}
/**
 * The result object on success.
 */
interface Task1 {
    /**
     * Collection of artifacts created by the agent.
     */
    artifacts?: Artifact[];
    /**
     * Server-generated id for contextual alignment across interactions
     */
    contextId: string;
    history?: Message1[];
    /**
     * Unique identifier for the task
     */
    id: string;
    /**
     * Event type
     */
    kind: "task";
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    status: TaskStatus;
}
/**
 * Configuration details for a supported OAuth Flow
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "ImplicitOAuthFlow".
 */
interface ImplicitOAuthFlow1 {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS
     */
    authorizationUrl: string;
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
}
/**
 * Base interface for any JSON-RPC 2.0 request or response.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONRPCMessage".
 */
interface JSONRPCMessage {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id?: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
}
/**
 * Represents a JSON-RPC 2.0 Request object.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONRPCRequest".
 */
interface JSONRPCRequest {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id?: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * A String containing the name of the method to be invoked.
     */
    method: string;
    /**
     * A Structured value that holds the parameter values to be used during the invocation of the method.
     */
    params?: {
        [k: string]: unknown;
    };
}
/**
 * JSON-RPC success response model for the 'message/send' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SendMessageSuccessResponse".
 */
interface SendMessageSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * The result object on success
     */
    result: Task2 | Message1;
}
/**
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "Task".
 */
interface Task2 {
    /**
     * Collection of artifacts created by the agent.
     */
    artifacts?: Artifact[];
    /**
     * Server-generated id for contextual alignment across interactions
     */
    contextId: string;
    history?: Message1[];
    /**
     * Unique identifier for the task
     */
    id: string;
    /**
     * Event type
     */
    kind: "task";
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    status: TaskStatus;
}
/**
 * JSON-RPC success response model for the 'message/stream' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SendStreamingMessageSuccessResponse".
 */
interface SendStreamingMessageSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * The result object on success
     */
    result: Task2 | Message1 | TaskStatusUpdateEvent | TaskArtifactUpdateEvent;
}
/**
 * Sent by server during sendStream or subscribe requests
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskStatusUpdateEvent".
 */
interface TaskStatusUpdateEvent {
    /**
     * The context the task is associated with
     */
    contextId: string;
    /**
     * Indicates the end of the event stream
     */
    final: boolean;
    /**
     * Event type
     */
    kind: "status-update";
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    status: TaskStatus1;
    /**
     * Task id
     */
    taskId: string;
}
/**
 * Current status of the task
 */
interface TaskStatus1 {
    message?: Message2;
    state: TaskState;
    /**
     * ISO 8601 datetime string when the status was recorded.
     */
    timestamp?: string;
}
/**
 * Sent by server during sendStream or subscribe requests
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskArtifactUpdateEvent".
 */
interface TaskArtifactUpdateEvent {
    /**
     * Indicates if this artifact appends to a previous one
     */
    append?: boolean;
    artifact: Artifact1;
    /**
     * The context the task is associated with
     */
    contextId: string;
    /**
     * Event type
     */
    kind: "artifact-update";
    /**
     * Indicates if this is the last chunk of the artifact
     */
    lastChunk?: boolean;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Task id
     */
    taskId: string;
}
/**
 * Represents an artifact generated for a task.
 */
interface Artifact1 {
    /**
     * Unique identifier for the artifact.
     */
    artifactId: string;
    /**
     * Optional description for the artifact.
     */
    description?: string;
    /**
     * The URIs of extensions that are present or contributed to this Artifact.
     */
    extensions?: string[];
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
    /**
     * Optional name for the artifact.
     */
    name?: string;
    /**
     * Artifact parts.
     */
    parts: Part[];
}
/**
 * JSON-RPC success response model for the 'tasks/pushNotificationConfig/set' method.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SetTaskPushNotificationConfigSuccessResponse".
 */
interface SetTaskPushNotificationConfigSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    result: TaskPushNotificationConfig2;
}
/**
 * The result object on success.
 */
interface TaskPushNotificationConfig2 {
    pushNotificationConfig: PushNotificationConfig1;
    /**
     * Task id.
     */
    taskId: string;
}
/**
 * Represents a JSON-RPC 2.0 Success Response object.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "JSONRPCSuccessResponse".
 */
interface JSONRPCSuccessResponse {
    /**
     * An identifier established by the Client that MUST contain a String, Number.
     * Numbers SHOULD NOT contain fractional parts.
     */
    id: string | number | null;
    /**
     * Specifies the version of the JSON-RPC protocol. MUST be exactly "2.0".
     */
    jsonrpc: "2.0";
    /**
     * The result object on success
     */
    result: {
        [k: string]: unknown;
    };
}
/**
 * Configuration for the send message request.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "MessageSendConfiguration".
 */
interface MessageSendConfiguration1 {
    /**
     * Accepted output modalities by the client.
     */
    acceptedOutputModes: string[];
    /**
     * If the server should treat the client as a blocking request.
     */
    blocking?: boolean;
    /**
     * Number of recent messages to be retrieved.
     */
    historyLength?: number;
    pushNotificationConfig?: PushNotificationConfig;
}
/**
 * Sent by the client to the agent as a request. May create, continue or restart a task.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "MessageSendParams".
 */
interface MessageSendParams2 {
    configuration?: MessageSendConfiguration;
    message: Message;
    /**
     * Extension metadata.
     */
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * Allows configuration of the supported OAuth Flows
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "OAuthFlows".
 */
interface OAuthFlows1 {
    authorizationCode?: AuthorizationCodeOAuthFlow;
    clientCredentials?: ClientCredentialsOAuthFlow;
    implicit?: ImplicitOAuthFlow;
    password?: PasswordOAuthFlow;
}
/**
 * Base properties common to all message parts.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "PartBase".
 */
interface PartBase {
    /**
     * Optional metadata associated with the part.
     */
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * Configuration details for a supported OAuth Flow
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "PasswordOAuthFlow".
 */
interface PasswordOAuthFlow1 {
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2
     * standard requires the use of TLS.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short
     * description for it. The map MAY be empty.
     */
    scopes: {
        [k: string]: string;
    };
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard
     * requires the use of TLS.
     */
    tokenUrl: string;
}
/**
 * Configuration for setting up push notifications for task updates.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "PushNotificationConfig".
 */
interface PushNotificationConfig2 {
    authentication?: PushNotificationAuthenticationInfo;
    /**
     * Push Notification ID - created by server to support multiple callbacks
     */
    id?: string;
    /**
     * Token unique to this task/session.
     */
    token?: string;
    /**
     * URL for sending the push notifications.
     */
    url: string;
}
/**
 * Base properties shared by all security schemes.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "SecuritySchemeBase".
 */
interface SecuritySchemeBase {
    /**
     * Description of this security scheme.
     */
    description?: string;
}
/**
 * Parameters containing only a task ID, used for simple task operations.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskIdParams".
 */
interface TaskIdParams3 {
    /**
     * Task id.
     */
    id: string;
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * Parameters for setting or getting push notification configuration for a task
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskPushNotificationConfig".
 */
interface TaskPushNotificationConfig3 {
    pushNotificationConfig: PushNotificationConfig1;
    /**
     * Task id.
     */
    taskId: string;
}
/**
 * Parameters for querying a task, including optional history length.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskQueryParams".
 */
interface TaskQueryParams1 {
    /**
     * Number of recent messages to be retrieved.
     */
    historyLength?: number;
    /**
     * Task id.
     */
    id: string;
    metadata?: {
        [k: string]: unknown;
    };
}
/**
 * TaskState and accompanying message.
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "TaskStatus".
 */
interface TaskStatus2 {
    message?: Message2;
    state: TaskState;
    /**
     * ISO 8601 datetime string when the status was recorded.
     */
    timestamp?: string;
}

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
 * Represents any valid JSON-RPC response defined in the A2A protocol.
 */
type A2AResponse = SendMessageResponse | SendStreamingMessageResponse | GetTaskResponse | CancelTaskResponse | SetTaskPushNotificationConfigResponse | GetTaskPushNotificationConfigResponse | JSONRPCErrorResponse;

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

type A2AStreamEventData = Message | Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent;
/**
 * A2AClient is a TypeScript HTTP client for interacting with A2A-compliant agents.
 */
declare class A2AClient {
    private agentBaseUrl;
    private agentCardPromise;
    private requestIdCounter;
    private serviceEndpointUrl?;
    /**
     * Constructs an A2AClient instance.
     * It initiates fetching the agent card from the provided agent baseUrl.
     * The Agent Card is expected at `${agentBaseUrl}/.well-known/agent.json`.
     * The `url` field from the Agent Card will be used as the RPC service endpoint.
     * @param agentBaseUrl The base URL of the A2A agent (e.g., https://agent.example.com).
     */
    constructor(agentBaseUrl: string);
    /**
     * Fetches the Agent Card from the agent's well-known URI and caches its service endpoint URL.
     * This method is called by the constructor.
     * @returns A Promise that resolves to the AgentCard.
     */
    private _fetchAndCacheAgentCard;
    /**
     * Retrieves the Agent Card.
     * If an `agentBaseUrl` is provided, it fetches the card from that specific URL.
     * Otherwise, it returns the card fetched and cached during client construction.
     * @param agentBaseUrl Optional. The base URL of the agent to fetch the card from.
     * If provided, this will fetch a new card, not use the cached one from the constructor's URL.
     * @returns A Promise that resolves to the AgentCard.
     */
    getAgentCard(agentBaseUrl?: string): Promise<AgentCard>;
    /**
     * Gets the RPC service endpoint URL. Ensures the agent card has been fetched first.
     * @returns A Promise that resolves to the service endpoint URL string.
     */
    private _getServiceEndpoint;
    /**
     * Helper method to make a generic JSON-RPC POST request.
     * @param method The RPC method name.
     * @param params The parameters for the RPC method.
     * @returns A Promise that resolves to the RPC response.
     */
    private _postRpcRequest;
    /**
     * Sends a message to the agent.
     * The behavior (blocking/non-blocking) and push notification configuration
     * are specified within the `params.configuration` object.
     * Optionally, `params.message.contextId` or `params.message.taskId` can be provided.
     * @param params The parameters for sending the message, including the message content and configuration.
     * @returns A Promise resolving to SendMessageResponse, which can be a Message, Task, or an error.
     */
    sendMessage(params: MessageSendParams): Promise<SendMessageResponse>;
    /**
     * Sends a message to the agent and streams back responses using Server-Sent Events (SSE).
     * Push notification configuration can be specified in `params.configuration`.
     * Optionally, `params.message.contextId` or `params.message.taskId` can be provided.
     * Requires the agent to support streaming (`capabilities.streaming: true` in AgentCard).
     * @param params The parameters for sending the message.
     * @returns An AsyncGenerator yielding A2AStreamEventData (Message, Task, TaskStatusUpdateEvent, or TaskArtifactUpdateEvent).
     * The generator throws an error if streaming is not supported or if an HTTP/SSE error occurs.
     */
    sendMessageStream(params: MessageSendParams): AsyncGenerator<A2AStreamEventData, void, undefined>;
    /**
     * Sets or updates the push notification configuration for a given task.
     * Requires the agent to support push notifications (`capabilities.pushNotifications: true` in AgentCard).
     * @param params Parameters containing the taskId and the TaskPushNotificationConfig.
     * @returns A Promise resolving to SetTaskPushNotificationConfigResponse.
     */
    setTaskPushNotificationConfig(params: TaskPushNotificationConfig): Promise<SetTaskPushNotificationConfigResponse>;
    /**
     * Gets the push notification configuration for a given task.
     * @param params Parameters containing the taskId.
     * @returns A Promise resolving to GetTaskPushNotificationConfigResponse.
     */
    getTaskPushNotificationConfig(params: TaskIdParams): Promise<GetTaskPushNotificationConfigResponse>;
    /**
     * Retrieves a task by its ID.
     * @param params Parameters containing the taskId and optional historyLength.
     * @returns A Promise resolving to GetTaskResponse, which contains the Task object or an error.
     */
    getTask(params: TaskQueryParams): Promise<GetTaskResponse>;
    /**
     * Cancels a task by its ID.
     * @param params Parameters containing the taskId.
     * @returns A Promise resolving to CancelTaskResponse, which contains the updated Task object or an error.
     */
    cancelTask(params: TaskIdParams): Promise<CancelTaskResponse>;
    /**
     * Resubscribes to a task's event stream using Server-Sent Events (SSE).
     * This is used if a previous SSE connection for an active task was broken.
     * Requires the agent to support streaming (`capabilities.streaming: true` in AgentCard).
     * @param params Parameters containing the taskId.
     * @returns An AsyncGenerator yielding A2AStreamEventData (Message, Task, TaskStatusUpdateEvent, or TaskArtifactUpdateEvent).
     */
    resubscribeTask(params: TaskIdParams): AsyncGenerator<A2AStreamEventData, void, undefined>;
    /**
     * Parses an HTTP response body as an A2A Server-Sent Event stream.
     * Each 'data' field of an SSE event is expected to be a JSON-RPC 2.0 Response object,
     * specifically a SendStreamingMessageResponse (or similar structure for resubscribe).
     * @param response The HTTP Response object whose body is the SSE stream.
     * @param originalRequestId The ID of the client's JSON-RPC request that initiated this stream.
     * Used to validate the `id` in the streamed JSON-RPC responses.
     * @returns An AsyncGenerator yielding the `result` field of each valid JSON-RPC success response from the stream.
     */
    private _parseA2ASseStream;
    /**
     * Processes a single SSE event's data string, expecting it to be a JSON-RPC response.
     * @param jsonData The string content from one or more 'data:' lines of an SSE event.
     * @param originalRequestId The ID of the client's request that initiated the stream.
     * @returns The `result` field of the parsed JSON-RPC success response.
     * @throws Error if data is not valid JSON, not a valid JSON-RPC response, an error response, or ID mismatch.
     */
    private _processSseEventData;
    isErrorResponse(response: JSONRPCResponse): response is JSONRPCErrorResponse;
}

export { A2AClient, A2AError, A2AExpressApp, type A2ARequest, type A2ARequestHandler, type A2AResponse, type APIKeySecurityScheme, type AgentCapabilities, type AgentCapabilities1, type AgentCard, type AgentExecutor, type AgentExtension, type AgentProvider, type AgentProvider1, type AgentSkill, type Artifact, type Artifact1, type AuthorizationCodeOAuthFlow, type AuthorizationCodeOAuthFlow1, type CancelTaskRequest, type CancelTaskResponse, type CancelTaskSuccessResponse, type ClientCredentialsOAuthFlow, type ClientCredentialsOAuthFlow1, type ContentTypeNotSupportedError, type DataPart, DefaultExecutionEventBus, DefaultExecutionEventBusManager, DefaultRequestHandler, type ExecutionEventBus, type ExecutionEventBusManager, type FileBase, type FilePart, type FileWithBytes, type FileWithUri, type GetTaskPushNotificationConfigRequest, type GetTaskPushNotificationConfigResponse, type GetTaskPushNotificationConfigSuccessResponse, type GetTaskRequest, type GetTaskResponse, type GetTaskSuccessResponse, type HTTPAuthSecurityScheme, type ImplicitOAuthFlow, type ImplicitOAuthFlow1, InMemoryTaskStore, type InternalError, type InvalidAgentResponseError, type InvalidParamsError, type InvalidRequestError, type JSONParseError, type JSONRPCError, type JSONRPCErrorResponse, type JSONRPCMessage, type JSONRPCRequest, type JSONRPCResponse, type JSONRPCSuccessResponse, JsonRpcTransportHandler, type Message, type Message1, type Message2, type MessageSendConfiguration, type MessageSendConfiguration1, type MessageSendParams, type MessageSendParams1, type MessageSendParams2, type MethodNotFoundError, type MySchema, type OAuth2SecurityScheme, type OAuthFlows, type OAuthFlows1, type OpenIdConnectSecurityScheme, type Part, type PartBase, type PasswordOAuthFlow, type PasswordOAuthFlow1, type PushNotificationAuthenticationInfo, type PushNotificationConfig, type PushNotificationConfig1, type PushNotificationConfig2, type PushNotificationNotSupportedError, RequestContext, ResultManager, type SecurityScheme, type SecuritySchemeBase, type SendMessageRequest, type SendMessageResponse, type SendMessageSuccessResponse, type SendStreamingMessageRequest, type SendStreamingMessageResponse, type SendStreamingMessageSuccessResponse, type SetTaskPushNotificationConfigRequest, type SetTaskPushNotificationConfigResponse, type SetTaskPushNotificationConfigSuccessResponse, type Task, type Task1, type Task2, type TaskArtifactUpdateEvent, type TaskIdParams, type TaskIdParams1, type TaskIdParams2, type TaskIdParams3, type TaskNotCancelableError, type TaskNotFoundError, type TaskPushNotificationConfig, type TaskPushNotificationConfig1, type TaskPushNotificationConfig2, type TaskPushNotificationConfig3, type TaskQueryParams, type TaskQueryParams1, type TaskResubscriptionRequest, type TaskState, type TaskStatus, type TaskStatus1, type TaskStatus2, type TaskStatusUpdateEvent, type TaskStore, type TextPart, type UnsupportedOperationError };
