export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;

    status : string  = "" ;

    withdrawDepositEnum : string;
    orderNo : string =null;
    phoneNumber : string =null ;
    bankName: string =null ;
    userName : string =null ;
    startTime:any="";
    endTime:any="";

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
