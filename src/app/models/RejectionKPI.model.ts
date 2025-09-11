export interface RejectionReason {
    reason: string;
    count: number;
    percentage: number;
}

export interface ConversionStatus {
    status: string;
    count: number;
    percentage: number;
}

export interface RejectionKPIs {
    totalRejections: number;
    rejectionByReason: RejectionReason[];
    pendingRejections: number;
    opportunityRejections: number;
    totalGroupedConversions: number;
    conversionsByStatus: ConversionStatus[];
}