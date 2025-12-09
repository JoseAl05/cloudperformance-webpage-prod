export interface UnusedRoute53 {
    rs_name: string;
    hz_id: string;
    potential_savings: number;
    history: UnusedRoute53History[];
}

export interface UnusedRoute53History {
    hz_id:string;
    rs_name:string;
    sync_time:string;
    details: UnusedRoute53HistoryDetails[];
}

export interface UnusedRoute53HistoryDetails {
    rs_type: string;
    rs_ttl: number;
    rs_records: UnusedRoute53HistoryDetailsRecords[];
}

export interface UnusedRoute53HistoryDetailsRecords {
    Value: string;
}