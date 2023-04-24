export interface QueryPaginate {
    offset: number;
    limit: number;
    order: string;
    sort: string
}


export const paginate = (query: QueryPaginate, totalDataRows: number)=> {
    let numRows: number;
    let numPages: number;
    const numPerPage = query.limit;
    const page = query.offset;

    numRows = totalDataRows;
    numPages = Math.ceil(numRows / numPerPage);

    if (page > numPages) {
        return {
            err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
        }
    }

    return {
        total: totalDataRows,
        order: query.order,
        sort: query.sort,
        current: page,
        perPage: numPerPage,
        previous: page > 0 ? page - 1 : undefined,
        next: page < numPages - 1 ? page + 1 : undefined
    }
}