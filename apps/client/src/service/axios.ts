import axios from 'axios';

const baseUrl = (process.env['NX_API_URL'])+'/api';

export enum SORT {
    asc='ASC',
    desc='DESC',
}

export interface PaginationType {
    offset?: number; 
    limit?: number; 
    order?: string; 
    sort?: SORT; 
}

export async function requestAxios(method: string, uri: string, data: null | any = null) {    
    try {
        if (!uri) {
            console.error('fonction de api requiere uri')
            return
        }
        var url = baseUrl + uri
        var headers = {'Content-Type': 'application/json' }
        let request;
        method = method.toLowerCase()

        if(method === 'get' || method === 'delete') {
            var conf: any = { 
                method,
                headers
            }
        
            if(data === null){
                conf.url = url
            } else {
                conf.url = url+'?'+data
            }            
            request = await axios(conf);
        } else if(method === 'post' || method === 'put') {
            if(data === null) {
                data = {}
            }
            let options = {
                headers: headers
            }
            request = await axios[method](url, data, options);
        } else {
            console.log('cette methode n\'est pas prise en compte par l\'api');
            return undefined;
        }

        
        return { ...request };
    } catch(error: any){
        console.log(error);
        
        if(error.response === undefined){
            //BACK OFFLINE
            return {data: "offline"};
        } else {
            return {data: {error: error.response.data.err}}
        }
    }
}