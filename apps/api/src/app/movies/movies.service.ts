import { Request, RequestHandler, Response } from 'express';
import { Movie } from './movies.model';
import { execute } from '../../config/db';
import { QueryPaginate } from '../../utils/paginate';

/**
 * gets movies
 */
export const getMovies = async (paginate: QueryPaginate ) => {
    const orderby = {
        film_id: 'F.film_id',
        title: 'F.title',
        rating: 'F.rating',
        rental_rate: 'F.rental_rate',
        category: 'category',
        total_rental: 'total_rental',
    }
    let query = `
        SELECT F.film_id, F.title, F.rating, F.rental_rate, cat.name AS category, COUNT(inv.inventory_id) AS total_rental FROM film F 
        LEFT JOIN film_category fc ON fc.film_id = F.film_id
        LEFT JOIN category cat ON cat.category_id = fc.category_id
        LEFT JOIN inventory inv ON inv.film_id = F.film_id
        GROUP BY F.film_id
        ORDER BY ${orderby[paginate.order]} ${paginate.sort.toUpperCase()}
        LIMIT ${paginate.limit}
        OFFSET ${paginate.offset}
    `;

    return execute<{movies:Movie[]}>(query, []);
};

export const getNbMovies = async () => {
    return execute<{movies:{numRows: number}}>(`SELECT count(*) as numRows FROM film`, []);
};