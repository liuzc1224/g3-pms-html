export class SearchModel {
  pageNumber: any = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  auditStartDate: any;
  auditEndDate: any;
  columns: Array<String> = ["auditDate"];
  orderBy: Array<Boolean> = [true];
}
