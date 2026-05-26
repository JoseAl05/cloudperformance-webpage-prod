export type JiraConnectorPayload = {
  jira_url: string;
  client_id: string;
  client_secret: string;
  default_project: string;
};

export type ServiceNowConnectorPayload = {
  instance_url: string;
  client_id: string;
  client_secret: string;
  default_table: string;
};

export type ConnectorType = "jira" | "servicenow";

export type ConnectorBackendStatus =
  | "active"
  | "invalid_credentials"
  | "disabled";

export type JiraConnectorConfig = {
  jira_url: string;
  client_id: string;
  default_project: string;
};

export type ServiceNowConnectorConfig = {
  instance_url: string;
  client_id: string;
  default_table: string;
};

export type ExternalConnectorResponse = {
  id: string;
  connectorType: ConnectorType;
  config: JiraConnectorConfig | ServiceNowConnectorConfig;
  status: ConnectorBackendStatus;
  createdAt: string;
  updatedAt: string;
  lastValidatedAt: string | null;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type FastApiValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

const API_BASE = process.env.API_CONNECTORS ?? "";
export const JIRA_CONNECTOR_KEY = "/api/connector/bridge/connector/create/jira";
export const SERVICENOW_CONNECTOR_KEY = "/api/connector/bridge/connector/create/servicenow";

const parseErrorDetail = (detail: unknown, fallbackStatus: number): string => {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return (detail as FastApiValidationError[])
      .map((err) => {
        const field = err.loc.filter((p) => p !== "body").join(".");
        return field ? `${field}: ${err.msg}` : err.msg;
      })
      .join("; ");
  }
  return `Error ${fallbackStatus}`;
};

export const createJiraConnectorFetcher = async (
  url: string,
  { arg }: { arg: JiraConnectorPayload }
): Promise<ExternalConnectorResponse> => {
  const response = await fetch(JIRA_CONNECTOR_KEY, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(parseErrorDetail(data?.detail, response.status), response.status);
  }

  return response.json() as Promise<ExternalConnectorResponse>;
};

export const createServiceNowConnectorFetcher = async (
  url: string,
  { arg }: { arg: ServiceNowConnectorPayload }
): Promise<ExternalConnectorResponse> => {
  const response = await fetch(SERVICENOW_CONNECTOR_KEY, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(parseErrorDetail(data?.detail, response.status), response.status);
  }

  return response.json() as Promise<ExternalConnectorResponse>;
};

export const isJiraConnectorConfig = (
  config: JiraConnectorConfig | ServiceNowConnectorConfig
): config is JiraConnectorConfig => "jira_url" in config;

export const isServiceNowConnectorConfig = (
  config: JiraConnectorConfig | ServiceNowConnectorConfig
): config is ServiceNowConnectorConfig => "instance_url" in config;