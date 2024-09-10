export interface IRechazo {
    id: number;
    status_id: number;
    status: string;
    city_id: number;
    city:string;
    province_id: number;
    province:string;
    customer_id: number;
    customer_name:string;
    product_id: number;
    product:string;
    family:string;
    subfamily:string;
    reason_rejection_id: number;
    reason_rejection:string;
    pvp:number;
    has_own_promo: boolean;
    own_promo: string;
    pvp_competitor:number;
    has_competitor_promo:boolean;
    competitor_promo:string; 
    competitor_id: number;
    competitor_name:string;
    corrective_action_value:string;
    corrective_action_symbol_id: number;
    corrective_action_symbol:string; 
    corrective_action_text:string;
    salesman_proposal:string;
    notes:string,
    rejection_date:string;
    interest_date:string;
    latitude: number;
    longitude: number;
    deleted:boolean;
}
