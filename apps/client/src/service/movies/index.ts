import { PaginationType, requestAxios } from "../axios";

export interface Movie {
    film_id: number;
    title: string;
    rating: number;
    rental_rate: number;
    category: string;
    total_rental: number;
}

export interface Results {
    results: Movie[];
    total: number;
    order: string;
    sort: string;
    current: number;
    perPage: number;
    previous?: number;
    next?: number;
}

export enum ORDER_MOVIES {
    title='title',
    rating='rating',
    rental_rate='rental_rate',
    category='category',
    total_rental='total_rental'
}

export const getAll = async (query?: PaginationType) => {
    let queryRequest = '';
    if(query){
        queryRequest += '?'
        let queries: Array<string> = [];
        if(query.offset) queries.push('offset='+query.offset);
        if(query.limit) queries.push('limit='+query.limit);
        if(query.order) queries.push('order='+query.order);
        if(query.sort) queries.push('sort='+query.sort);

        const queriesString: string = queries.join('&')
        queryRequest+=queriesString
    }

    const req = await requestAxios('get', `/movies${queryRequest}`)
    return req?.data;
}