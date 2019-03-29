export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;
    signOutState : string;
    signInStartTime : any ;
    signInEndTime : any ;
    orderNo : any ;
    // userPhoneNum : any ;
    employeeName: any ;
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
};