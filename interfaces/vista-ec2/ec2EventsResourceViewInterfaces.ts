export interface Ec2ResourceViewEvents {
  _id: string;
  EventName: string;
  EventTime: string;
  EventSource: string;
  Username: string;
  sync_time: string;
  Resources_ResourceName: string[];
  Resources_ResourceType: string[];
}

export type Ec2ResourceViewEventsResponse = Ec2ResourceViewEvents[];
