import axios from "axios";

const BASE_URL = "http://localhost:3001/";

class CatalogService{
    getCatalogs(syntax){
        return axios.get(BASE_URL + 'catalogs?syntaxSearch=' + syntax);
    }
}

export default new CatalogService()