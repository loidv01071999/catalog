import { Request, Response, NextFunction } from 'express';
var url = require('url');
// Import the Google Cloud client library.
const {DataCatalogClient} = require('@google-cloud/datacatalog').v1;
const datacatalog = new DataCatalogClient();

// var Catalog = function(searchResultType: any, searchResultSubType: any, relativeResourceName: any, 
//     linkedResource: any, modifyTime: any, fullyQualifiedName: any, integratedSystem: any, system: any){
// };

//getting all catalogs
const getCatalogs = async (req: Request, res: Response, next: NextFunction) => {
    // Search data assets.

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const projectId = 'my_project'; // Google Cloud Platform project

    // Set custom query.
    var q = url.parse(req.url, true);
    var qdata = q.query;
    const query = qdata.syntaxSearch;
    const projectId = "aeriscom-acpcmn-dev-202006";
    // Create request.
    const scope = {
        includeProjectIds: [projectId],
        // Alternatively, search using Google Cloud Organization scopes.
        // includeOrgIds: [organizationId],
    };

    const request = {
        scope: scope,
        query: query,
    };
    
    const [catalogs] = await datacatalog.searchCatalog(request);

    catalogs.forEach((catalog: any) => {
        catalog.modifyTime = catalog.modifyTime.seconds;
        catalog.linkedResource = convertLinkResource(catalog.linkedResource);
    });
    
    return res.status(200).json({
        catalogs: catalogs
    });
};

let convertLinkResource = function(linkResource: String){
    var temp = linkResource.substring(2);
    var tempArray = temp.split("/");
    var projectName = tempArray[2];
    var dataset = tempArray[4];
    if(linkResource.includes("tables")){
        var tableName = tempArray[6];
        return `https://console.cloud.google.com/bigquery?project=${projectName}&d=${dataset}&p=${projectName}&t=${tableName}&page=table&ws=!1m5!1m4!4m3!1s${projectName}!2s${dataset}!3s${tableName}`;
    }else{
        return `https://console.cloud.google.com/bigquery?project=${projectName}&d=${dataset}&p=${projectName}&page=dataset&ws=!1m4!1m3!3m2!1s${projectName}!2s${dataset}`;
    }
}

export default { getCatalogs };
