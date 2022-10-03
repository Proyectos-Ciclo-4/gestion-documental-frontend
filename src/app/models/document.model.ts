export interface DocumentModel {
  _id: string,
  name: string,
  userId: string,
  categoryId: string,
  subCategoryName: string,
  version: number,
  pathDocument: string,
  blockChainId: [string],
  description: string
}

export interface DocumentModelBlockchain {
  _id: string,
  name: string,
  version: number,
  pathDocument: string,
  description: string
  date: Date,
  categoryId: string,
  subCategoryName: string,
}
export interface DocumentModelQuery {
  name: string,
  categoryId: string,
  subCategoryName: string,
  version: number,
  pathDocument: string,
  blockChainId: [string],
  description: string,
  uuid: string,
  dateCreated: Date,
  lastDateDownload: Date
}
export interface DocumentUpdateModel {
  name: string,
  pathDocument: string,
  description: string,
  blockChainId: [string]
}

export interface DocumentWithDownloads {
  name: string,
  categoryId: string,
  subCategoryName: string,
  version: number,
  pathDocument: string,
  blockChainId: [string],
  description: string,
  uuid: string,
  dateCreated: Date,
  downloads: number
}
