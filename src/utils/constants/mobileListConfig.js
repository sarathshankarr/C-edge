// Search fields, date filters, menu IDs and endpoints for the mobile list APIs
// (POST {baseUrl}/mobileList/...). Each entry feeds useSearchablePagedList.
//
//   endpoint             — path under mobileList/ (or a full path for legacy ones, see `path`)
//   menuId               — sent as menuId when the endpoint uses it
//   sendCompany          — false for endpoints that take no compIds (Stock Issue / Return)
//   searchOptions        — [{label, value}], first one is the default
//   dateFilters          — [{label, value}], first one is the default; omit if none
//   searchUsesDateFilter — search results are limited by the date filter
//   uniqueKey            — row field used to de-duplicate pages

export const MOBILE_LIST_PAGE_SIZE = 25;

const DATE_FILTER_LAST_N_DAYS_PO = [
  {label: 'Recent PO', value: '60Days'},
  {label: 'All PO', value: 'olderDays'},
];

const DATE_FILTER_LAST_30_DAYS = [
  {label: 'Last 30 Days Data', value: '30Days'},
  {label: 'All Data', value: 'olderDays'},
];

export const MOBILE_LIST_CONFIG = {
  GRN: {
    path: 'grn/loadAllGrn',
    menuId: 5,
    extraBody: {locIds: '0', brandIds: '0'},
    dateFilters: DATE_FILTER_LAST_N_DAYS_PO,
    searchOptions: [
      {label: 'Style', value: 'styleName'},
      {label: 'Vendor', value: 'vendor_name'},
      {label: 'PO No', value: 'id'},
      {label: 'Invoice No', value: 'invoiceNo'},
      {label: 'PO Status', value: 'status'},
      {label: 'Type', value: 'type'},
      {label: 'GRN No', value: 'grnno'},
      {label: 'RM/Fabric', value: 'rmfabric'},
      // Reference No is only offered when menuId = 5
      {label: 'Reference No', value: 'refoNos', onlyMenuId: 5},
      {label: 'RM/FM Code', value: 'rmcode'},
      {label: 'Roll No', value: 'rollno'},
    ],
    uniqueKey: 'poNumber',
  },

  GRN_CHECKING: {
    endpoint: 'loadAllGrnChecking',
    menuId: 981,
    dateFilters: DATE_FILTER_LAST_N_DAYS_PO,
    searchOptions: [
      {label: 'Style', value: 'styleName'},
      {label: 'Vendor', value: 'vendor_name'},
      {label: 'PO#', value: 'id'},
      {label: 'Invoice No', value: 'invoiceNo'},
      {label: 'PO Status', value: 'status'},
      {label: 'ITEM/TRIMS', value: 'type'},
      {label: 'GRN No', value: 'grnno'},
      {label: 'RM/Trims/FG', value: 'rmfabric'},
      {label: 'RM/Fabric code', value: 'rmcode'},
      {label: 'Roll No/Lot', value: 'rollno'},
    ],
    uniqueKey: 'poNumber',
  },

  BATCH_CREATION: {
    endpoint: 'loadAllBatchCreation',
    menuId: 0,
    dateFilters: DATE_FILTER_LAST_30_DAYS,
    searchOptions: [
      {label: 'BatchId', value: 'batchId'},
      {label: 'Batch Nos', value: 'batchname'},
      {label: 'Batch Creation Date', value: 'creationdate'},
      {label: 'Lot Nos', value: 'lotnos'},
      {label: 'PO No', value: 'ponos'},
    ],
    // id repeats across a batch's detail rows; batchDetailsId is unique per row
    uniqueKey: 'batchDetailsId',
  },

  FABRIC_MASTER: {
    endpoint: 'loadAllFabrics',
    menuId: 0,
    searchOptions: [
      {label: 'Fabric No', value: 'styleno'},
      {label: 'Color', value: 'color'},
      {label: 'Fabric Code', value: 'fab_code'},
    ],
    uniqueKey: 'fabricId',
  },

  RM_MASTER: {
    endpoint: 'loadAllRawMaterials',
    menuId: 0,
    searchOptions: [
      {label: 'Raw Material Name', value: 'trimname'},
      {label: 'Raw Material Color', value: 'rmcolor'},
      {label: 'Raw Material Type', value: 'trimtype'},
      {label: 'Raw Material Code', value: 'rmcode'},
      {label: 'User Name', value: 'username'},
    ],
    uniqueKey: 'trimconstruction_id',
  },

  VENDOR_MASTER: {
    endpoint: 'loadAllVendors',
    menuId: 0,
    searchOptions: [
      {label: 'Vendor Name', value: 'vendor_name'},
      {label: 'Code', value: 'vendor_code'},
      {label: 'Type', value: 'user_type'},
      {label: 'Id', value: 'id'},
      {label: 'City', value: 'city'},
      {label: 'Phone', value: 'mobile'},
    ],
    uniqueKey: 'id',
  },

  BOX_TRANSFER_IN: {
    endpoint: 'loadAllBoxTransferStyles',
    menuId: 753,
    dateFilters: DATE_FILTER_LAST_30_DAYS,
    searchOptions: [
      {label: 'ID', value: 'id'},
      {label: 'Box Name', value: 'boxname'},
      {label: 'Style Name', value: 'style'},
      {label: 'From Location', value: 'fromlocation'},
      {label: 'To Location', value: 'tolocation'},
    ],
    uniqueKey: 'id',
  },

  STOCK_ISSUE: {
    endpoint: 'loadAllStockIssues',
    sendCompany: false,
    searchOptions: [
      {label: 'Stock Id', value: 'stockId'},
      {label: 'Style/BuyerPO', value: 'styleBuyerPo'},
      {label: 'Location', value: 'location'},
      {label: 'Creation Date', value: 'creationDate'},
    ],
    uniqueKey: 'g_id',
  },

  STOCK_ISSUE_RETURN: {
    endpoint: 'loadAllStockIssueReturns',
    sendCompany: false,
    searchOptions: [
      {label: 'Stock Id', value: 'stockId'},
      {label: 'Creation Date', value: 'creationDate'},
      {label: 'Created By', value: 'createdBy'},
    ],
    uniqueKey: 'sird_id',
  },

  STYLE_TRANSFER_RECEIVE: {
    endpoint: 'loadAllStyleTransfers',
    dateFilters: [
      {label: 'Recent Data', value: '120Days'},
      {label: 'All Data', value: 'olderDays'},
    ],
    searchUsesDateFilter: true,
    searchOptions: [
      {label: 'ST NO', value: 'stNo'},
      {label: 'Order Id', value: 'orderId'},
      {label: 'Style (Color)', value: 'style'},
      {label: 'From Location', value: 'fromLocation'},
      {label: 'Requested By', value: 'requestedBy'},
      {label: 'To Location/Customer', value: 'toLocation'},
      {label: 'Creation Date', value: 'creationDate'},
      {label: 'Delivery Date', value: 'deliveryDate'},
    ],
    uniqueKey: 'styletransferId',
  },
};
