import { environment } from "../../environments/environment";
const host = environment.host;

const system = {
  depart: {
    list: host + "/department/tree",
    opera: host + "/department"
  },
  login: host + "/employee/login",
  loginMenu: host + "/menu/tree",
  button: host + "/menu/button",
  menu: host + "/menu",
  role: host + "/role",
  staff: host + "/employee"
};

const usr = {
  list: host + "/user/list",
  login: {
    info: host + "/user/login/recently",
    all: host + "/user/login"
  },
  basicInfo: host + "/user/anthInfo"
};

const finance = {
  loanList: host + "/finance/payment/list",
  repayList: host + "/finance/repayment/list",
  loan: {
    loan: host + "/finance/payment/loan"
  },
  repay: {
    repay: host + "/finance/repayment"
  }
};

const risk = {
  riskList: host + "/risk/done",
  exportList: host + "/creditOrder/export",
  riskTotleList: host + "/audit/statistics/list",
  riskTotle: host + "/audit/statistics",
  riskShureList: host + "/risk/employee", //信审管理列表
  riskSignIn: host + "/risk/employee/signIn", //签到
  riskSignOut: host + "/risk/employee/signOut", //签退
  riskSignOutAudit: host + "/risk/employee/signOut/audit", //审批签退
  isSignIn: host + "/risk/employee/isSignIn",
  lockOrder: host + "/creditAudit/workBench/order/check",//查看订单是否分配给其他人员
  record: host + "/creditOrder/record",
  riskRecordList: host + "/creditAudit/workBench",
  employees: host + "/creditAudit/workBench/allocation/signIn/employees",
  setEmployees: host + "/creditAudit/workBench/allocation",
  riskConfig: host + "/business/param/config",
	compare : host + "/business/param/config/setBusinessParam",//控制开关
  riskTotalList: host + "/creditAudit/statement",
	auditList:host + "/creditAudit/workBench",
	getCount:host + "/creditAudit/statement/statistics",
	querySiginStatus:host+ "/creditAudit/workBench/signIn/state",
	goSignin:host+ "/creditAudit/workBench/signIn",
	goSignOut:host+ "/creditAudit/workBench/signOut",
  attendanceList:host+ "/creditAudit/workBench/attendance"
};

const order = {
  user: {
    basicInfo: host + "/user/info",
    accountInfo: host + "/account/debt",
    auth: host + "/user/detail/image",
    userInfo: host + "/user/login/recently",
    detailinfo: host + "/user/detail/info",
    orderdetailinfo: host + "/user/order/detail/info",
    orderauth: host + "/user/order/detail/image",
    familyInfo: host + "/user/family",
    workInfo: host + "/user/work",
    friendInfo: host + "/user/contact",
    bankInfo: host + "/account/bankcard",
    orderHisList: host + "/order/history",
    recordDetail: host + "/creditOrder/detail"
  },
  loanRecord: {
    detail: host + "/order/detail",
    orderQuery: host + "/order/userCenter/orderQuery",
    letterQuery: host + "/creditOrder/get"
  },
  list: {
    all: host + "/order/unionQuery",
    // get /order/unionQuery
    // all: host + "/order/query",
    detail: host + "/order/detail",
    applyCash: host + "/order/applyCash/account",
    repayment: host + "/finance/repayment/repaymentPlanList",
    getStream: host + "/finance/repayment/manualRepaymentList",
    operation: host + "/order/operation/record",
    product: host + "/creditOrder/product"
  },
  operate: {
    risk: {
      audit: host + "/creditOrder/commit",
      duration: host + "/user/behavior/pageDuration"
    },
    reback: host + "/creditOrder/recall"
  },
  record: {
    risk: host + "/risk/audit/record",
    payment: host + "/finance/payment/list",
    loan: host + "/finance/payment/loan/list",
    repayment: host + "/finance/repayment/list",
    repaymentRecord: host + "/finance/repayment/record",
    loanList: host + "/finance/payment/detail"
  }
};
const defaultIndex = {
  history: host + "/statistics/history",
  today: host + "/statistics/today",
  lastest: host + "/statistics/day/seven",
  refreshToday: host + "/statistics/today/refresh"
};
const coupon = {
  list: host + "/coupon/getCouponList",
  delete: host + "/coupon",
  addCoupon: host + "/coupon/addCoupon",
  getCoupon: host + "/coupon/getCoupon",
  push: host + "/coupon/pushMessage",
  pauseButton: host + "/coupon/updatePauseButton",
  update: host + "/coupon/updateCoupon"
};
const channel = {
  getList: host + "/channel",
  update: host + "/channel",
  addChannel: host + "/channel",
  channelBranch: {
    getChannelBranch: host + "/channel/branch",
    addChannelBranch: host + "/channel/branch",
    invitationCode: host + "/channel/branch/invitationCode",
    unUsedQuantity: host + "//channel/branch/invitationCode/unUsedQuantity",
    update: host + "/channel/branch",
    export: host + "/channel/branch/export",
    import: host + "/channel/branch/import",
    generate: host + "/channel/branch/invitationCode/generate"
  },
  channelH5: {
    getChannelH5: host + "/channel/h5",
    addChannelH5: host + "/channel/h5",
    update: host + "/channel/h5"
  }
};
const productCenter = {
  product: {
    getProduct: host + "/loanProduct",
    addProduct: host + "/loanProduct",
    updateProduct: host + "/loanProduct",
    deleteProduct: host + "/loanProduct/delete"
  },
  userLevel: {
    getUserLevel: host + "/loanUser",
    addUserLevel: host + "/loanUser",
    updateUserLevel: host + "/loanUser",
    deleteUserLevel: host + "/loanUser/delete",
    getLoanProduct: host + "/loanProduct/productUserType"
  }
};
const bank = {
  list: host + "/support/bank",
  add: host + "/support/bank/save",
  update: host + "/support/bank/update",
  delete: host + "/support/bank"
};
const reportCenter = {
  channelData: host + "/statistics/channel/invitationCode",
  channelExport: host + "/statistics/channel/invitationCode/export",
  channelH5Export: host + "/statistics/channel/h5/export",
  channelDataH5: host + "/statistics/channel/h5"
};
const collectionBusiness={
  getData: host + "/overdue/businessConfig/list",
  addData: host + "/overdue/businessConfig",
  updateData: host + "/overdue/businessConfig",
};
const collectionManagement={
  caseManagement:{
    loanUser:host + "/loanUser",
    queryOverdueOrder: host + "/overdueCaseManage/queryOverdueOrder",
    allocate: host + "/overdueCaseManage/allocate",
    setOverdueOrderKeep: host + "/overdueCaseManage/setOverdueOrderKeep",
    getAllOverdueStaff: host + "/overdueMembersManage/getAllOverdueStaff",
    exportOverdueOrder: host + "/overdueCaseManage/exportOverdueOrder"
  },
  memberManagement:{
    addOverdueFirm: host + "/overdueMembersManage/addOverdueFirm",
    queryOverdueFirm: host + "/overdueMembersManage/queryOverdueFirm",
    updateOverdueFirm: host + "/overdueMembersManage/updateOverdueFirm",

    addOverdueGroup: host + "/overdueMembersManage/addOverdueGroup",
    queryOverdueGroup: host + "/overdueMembersManage/queryOverdueGroup",
    updateOverdueGroup: host + "/overdueMembersManage/updateOverdueGroup",

    addOverdueStaff: host + "/overdueMembersManage/addOverdueStaff",
    queryOverdueStaff: host + "/overdueMembersManage/queryOverdueStaff",
    updateOverdueStaff: host + "/overdueMembersManage/updateOverdueStaff",

    getAllOverdueFirm: host + "/overdueMembersManage/getAllOverdueFirm",
    getAllOverdueGroup: host + "/overdueMembersManage/getAllOverdueGroup"
  },
  record:{
    queryOverdueCallRecord: host + "/overdueRecord/queryOverdueCallRecord",
    queryOverdueMessageRecord: host + "/overdueRecord/queryOverdueMessageRecord"
  },
  report:{
    exportGroupStatement: host + "/overdueStatement/exportGroupStatement",
    exportStatement: host + "/overdueStatement/exportStatement",
    getGroupStatement: host + "/overdueStatement/getGroupStatement",
    getStatement: host + "/overdueStatement/getStatement",
    loanUser:host + "/loanUser"
  }
};
const collectWorkBench = {
  recallDetail: host + "/urgentRecall/urgentRecallDetail",
  addRecallLog: host + "/urgentRecall/addUrgentRecallLog",
  adminReport: host + "/urgentRecall/getAdminReport",
  overdueOrder: host + "/overdueCaseManage/queryOverdueOrderInWorkbench",
  exportOverdueOrder: host + "/overdueCaseManage/exportOverdueOrderInWorkbench",
  getRecallLog: host + "/urgentRecall/queryUrgentRecallLog",
  getWebCallList: host + "/urgentRecall/queryWebCallLog",
  sendMsg: host + "/urgentRecall/sendMsg",
  queryMsgLog: host + "/urgentRecall/queryMsgLog",
  queryFlowHistory: host + "/urgentRecall/queryFlowHistory",
  remindRecord: host + "/urgentRecall/queryRemindRecordByParam",
  groupStatement: host + "/overdueStatement/getGroupStatement",
  updateRemind: host + "/urgentRecall/batchUpdateRemindRecordByParam",
  exhibition: host + "/urgentRecall/exhibitionPeriod",
  getExhibition: host + "/urgentRecall/exhibitionPeriodInfo",
  getCurrentEmployeeFirmID: host + "/overdueMembersManage/getCurrentEmployeeFirmID",
  getCurrentEmployeeStaffID : host + "/overdueMembersManage/getCurrentEmployeeStaffID"
};
export const GLOBAL = {
  API: {
    system: system,
    usr: usr,
    finance: finance,
    risk: risk,
    order: order,
    default: defaultIndex,
    bank: bank,
    channel: channel,
    coupon: coupon,
    reportCenter: reportCenter,
    productCenter: productCenter,
    collectionBusiness:collectionBusiness,
    collectionManagement:collectionManagement,
    collectWorkBench: collectWorkBench
  },
  rights: "@copyright 2018 xxx"
};
