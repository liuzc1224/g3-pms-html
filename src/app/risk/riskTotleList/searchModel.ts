export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;
    minAuditDate : any ;
    maxAuditDate : any ;
    orderNo : any ;
    userPhoneNum : any ;
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
};