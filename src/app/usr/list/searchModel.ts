export class SearchModel {
    pageNumber : any = 0;
    pageSize : number = 10 ;
    currentPage : number = 1;
    phoneNumber : string = '' ;
    username : string = '' ;
    cpf:string='';
    // idNumber : string = '' ;
    inviteCode:string='';
    id : any;
    registerTimeStart : any = '' ;
    registerTimeEnd : any = '' ;
    columns : Array< String > = [] ;
    orderBy : Array< Boolean > = [] ;
    email : string = '' ;
    channelId:string='';
    invitationCode:string='';
}