export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;


    status : string = '1,3,4,5,6' ;
    loanType : Number;

    creditOrderNo : string = '';
    orderNo : string = '';
    userPhone : string ='' ;
    userName : string ='' ;


    minPlanRepaymentDate : any = '' ;
    maxPlanRepaymentDate : any = '' ;

    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
}
