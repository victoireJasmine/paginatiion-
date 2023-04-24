import { Request, Response, Router } from 'express';
import * as MovieService from './movies.service';
import { paginate } from '../../utils/paginate';

 const moviesRoutes = Router();

 moviesRoutes.get('/', async (req: Request, res: Response) => {
    try {

        const limit = parseInt((req.query.limit as string), 10) || 1000;
        const offset = parseInt((req.query.offset as string), 10) || 0;
        const order = (req.query?.order as string) ?? 'title';
        const sort = (req.query?.sort as string) ?? 'asc';

        const nbData = await MovieService.getNbMovies();

        const pagination = paginate({ offset,  limit, order, sort }, nbData[0].numRows);
        
        if('err' in pagination){
            res.status(400).json({ ...pagination });
        }

        const movies = await MovieService.getMovies({offset,  limit, order, sort});
    
        res.status(200).json({
            results: movies,
            ...pagination
        });

    } catch (error) {
        console.error('[movies.controller][getMovies][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
          message: 'There was an error when fetching movies'
        });
    }
});

export default moviesRoutes;