export class SearchModel {
  groupId: number=null;
  staffName: string="";
  phonenumer: string="";


  firmName: string="";
  firmType: number=null;
  status: number=null;

  firmId: number=null;
  stageId: number=null;
  groupType: number=null;
  groupName: string="";

  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
  columns : Array< String > = [] ;
  orderBy : Array< Boolean > = [] ;
}
