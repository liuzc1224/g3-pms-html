export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;


    creditOrderNo : string = '' ;
    orderNo : string = '' ;
    userId : string = '' ;
    userName : string = '' ;

    createTimeStart : any = '' ;
    createTimeEnd : any = '' ;
    planRepaymentDateStart: any = '' ;
    planRepaymentDateEnd: any = '' ;

    status : string = '13,14,1,3,4,5,6' ;
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
