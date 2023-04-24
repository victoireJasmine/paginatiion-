import { useEffect, useState } from 'react';
import { ORDER_MOVIES, Results, getAll } from '../service/movies';
import { PaginationType, SORT } from '../service/axios';
import {Table, Alert} from 'react-bootstrap';
import Pagination from 'rc-pagination';

type DataMovie = Results | {
  error: string
} | null

export function Movies() {
  const defaultQueries: PaginationType = {
    limit: 10,
    offset: 0,
    sort: SORT.asc,
    order: ORDER_MOVIES.title
  }

  const [queriesMovie, setQueriesMovie] = useState<PaginationType>(defaultQueries)
  const [data, setData] = useState<DataMovie>(null)

  const [size, setSize] = useState(defaultQueries.limit as number);
  const [current, setCurrent] = useState((defaultQueries.offset as number)+1);

  useEffect(()=>{
    (async function(){
      const movies = await getAll(queriesMovie);
      setData(movies)      
    })()
  }, [queriesMovie])

  function Empty() {
    return <Alert variant='primary' className='text-center'>Aucune donnée trouvée</Alert>;
  }

  function Loader() {
    return <span>Chargement...</span>;
  }

  function Offline() {
    return <Alert variant='danger' className='text-center'>impossible de se connecter au serveur</Alert>;
  }
  
  function Error(props: {message: string}) {
    return <Alert variant='warning' className='text-center'>{props.message}</Alert>;
  }
  
  function MovieList(props: {dataMovie: Results}){
    return   (
      <div>
        <Table striped bordered hover className='mt-5'>
          <thead>
            <tr>
              <th>Titre du film</th>
              <th>Genre</th>
              <th>Classification</th>
              <th>Prix</th>
              <th>Nombre de fois loué</th>
            </tr>
          </thead>
          <tbody>
            {
              props.dataMovie.results.map(movie=>
                <tr key={movie.film_id}>
                  <td>{movie.title}</td>
                  <td>{movie.category}</td>
                  <td>{movie.rating}</td>
                  <td>{movie.rental_rate} €</td>
                  <td>{movie.total_rental}</td>
                </tr>
              )
            }
          </tbody>
        </Table>
        <Pagination
          className="pagination-data"
          showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
          onChange={PaginationChange}
          total={props.dataMovie.total}
          current={current}
          pageSize={size}
          showSizeChanger={false}
          itemRender={PrevNextArrow}
        />
      </div>
    )
  }

  function PaginationChange(page: number, pageSize: number){
    setCurrent(page);
    setSize(pageSize);
    setQueriesMovie({
      ...queriesMovie,
      offset: page - 1,
    })
  }

  const PrevNextArrow = (current: any, type:  'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', originalElement: any): React.ReactNode => {
    if (type === 'prev') {
        return <button>&laquo;</button>;
    }
    if (type === 'next') {
        return <button>&raquo;</button>;
    }
    return originalElement;
  }


  function Greeting() {
    if(!data){
      return <Loader />;
    }
    else if (typeof data === 'string') {
      return <Offline />;
    }
    else if('error' in data){
      return <Error message={data.error} />;
    }
    else if(data.results.length === 0){
      return <Empty />;
    }
    return <MovieList dataMovie={data} />;
  }

  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div id="welcome" className='mb-4'>
            <h1 className='text-center'>
              <span> vivie Pagination</span>
            </h1>
          </div>
          { <Greeting /> }
          <p id="love">
            vivie ondelet
          </p>
        </div>
      </div>
    </>
  );
}

export default Movies;
