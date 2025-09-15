export type EventsApiResponse = AllEvents[];

export interface AllEvents {
  events: EventGroup[];
  sync_time: string;
}

export interface EventGroup {
  event_name: string;
  docs: AWSEvents[];
}

export interface AWSEvents {
  EventId: string;
  ReadOnly: string;
  AccessKeyId: string;
  EventTime: string;
  EventSource: string;
  Username: string;
  Resources: EventsResources[];
}

export interface EventsResources {
  ResourceType: string;
  ResourceName: string;
}
