export class SearchModel {
  startTime: any= '';
  endTime: any = '';
  callNumber: string="";
  callTo: string="";
  callFrom: string="";
  receiver: string="";

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
