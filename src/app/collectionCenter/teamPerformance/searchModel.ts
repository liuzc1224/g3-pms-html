export class SearchModel {
  orderType : number = 0;
  loanTermsJudgeFlag : number =null;
  loanTerms : number =null;
  loanAmountJudgeFlag : number =null;
  loanAmount : number =null;
  userGrade : string =null;

  queryStartTime:any='';
  queryEndTime:any='';
  groupId : number =null;
  staffId : number =null;
  stageId : number = null;
  pageNumber : any = 0;
  pageSize : number = 10 ;
  currentPage : number = 1;
}
