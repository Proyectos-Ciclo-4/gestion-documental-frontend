export interface DocumentModel {
  name: string,
  userId: string,
  categoryId: string,
  subCategoryName: string,
  version: number,
  pathDocument: string,
  blockChainId: string,
  description: string
}

export interface DocumentModelBlockchain {
  name: string,
  version: number,
  pathDocument: string,
  description: string
  date: Date
}
export interface DocumentModelQuery {
  name: string,
  categoryId: string,
  subCategoryName: string,
  version: number,
  pathDocument: string,
  blockChainId: string,
  description: string,
  uuid: string,
  dateCreated: Date
}
export interface DocumentUpdateModel {
  name: string,
  pathDocument: string,
  description: string
}

export interface DocumentWithDownloads {
  name: string,
  categoryId: string,
  subCategoryName: string,
  version: number,
  pathDocument: string,
  blockChainId: string,
  description: string,
  uuid: string,
  dateCreated: Date,
  downloads: number
}
