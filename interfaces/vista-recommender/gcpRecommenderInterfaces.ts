export interface RecommenderGcp {
    project_id: string;
    location: string;
    recommender_name: string;
    category: string;
    savings_estimate: {
        currency?: string;
        amount?: number;
    };
    description: string;
    recommender_subtype: string;
    priority: string;
    last_refresh_time: string;
}