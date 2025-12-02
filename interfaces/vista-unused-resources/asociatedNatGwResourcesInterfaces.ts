export interface AsociatedResourcesNatGw{
    nat_gateway_id: string;
    associated_subnets_count: number;
    associated_subnets: string[];
    resources: AsociatedResourcesNatGwResource[];
}

export interface AsociatedResourcesNatGwResource {
    ec2:AsociatedResourcesNatGwEc2[];
    mysql:AsociatedResourcesNatGwRds[];
    sqlserver: AsociatedResourcesNatGwRds[];
    oracle: AsociatedResourcesNatGwRds[];
    postgresql: AsociatedResourcesNatGwRds[];
}

export interface AsociatedResourcesNatGwEc2 {
    details:AsociatedResourcesNatGwEc2Details[];
    instance_id: string;
}

export interface AsociatedResourcesNatGwEc2Details {
    sync_time: string;
    Tags: {
        [key: string]: string;
    };
    InstanceType: string;
    State:{
        Code: number;
        Name: string;
    };
    PrivateIpAddress: string;
    VpcId: string;
    SubnetId: string;
}

export interface AsociatedResourcesNatGwRds {
    db_instance_identifier: string;
    engine: string;
    details: AsociatedResourcesNatGwRdsDetails[];
}

export interface AsociatedResourcesNatGwRdsDetails {
    sync_time: string;
    DBInstanceClass: string;
    DBInstanceStatus: string;
    Endpoint:{
        Address: string;
        Port: number;
        HostedZoneId: string;
    };
    DBSubnetGroup:{
        DBSubnetGroupName: string;
        DBSubnetGroupDescription: string;
        VpcId: string;
        SubnetGroupStatus: string;
        Subnets: AsociatedResourcesNatGwRdsDetailsSubnets[];
    }
}

export interface AsociatedResourcesNatGwRdsDetailsSubnets{
    SubnetIdentifier: string;
    SubnetAvailabilityZone:{
        Name: string;
    };
    SubnetOutpost?:{
        Arn: string;
    };
    SubnetStatus: string;
}
