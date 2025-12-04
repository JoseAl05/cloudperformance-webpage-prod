export interface AsociatedElbV2Resources {
    elb_arn: string;
    target_groups: AsociatedElbV2ResourcesTg[];
    target_healths: AsociatedElbV2ResourcesTh[];
    target_groups_count: number;
    target_healths_count: number;
}

export interface AsociatedElbV2ResourcesTg {
    sync_time: string;
    TargetGroupName: string;
    Protocol: string;
    Port: number;
    TargetType: string;
    HealthCheckProtocol: string;
    HealthCheckPort: string;
}

export interface AsociatedElbV2ResourcesTh {
    target_group: string;
    target_id: string;
    details: AsociatedElbV2ResourcesThDetails[];
}

export interface AsociatedElbV2ResourcesThDetails {
    sync_time: string;
    TargetHealth:{
        State: string;
    };
    Target:{
        Id: string;
        Port: number;
    };
    HealthCheckPort: string;
}