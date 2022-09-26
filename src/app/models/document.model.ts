export interface DocumentModel{
    name: string,
    categoryId:string,
    subCategoryName: string,
    version:number,
    pathDocument:string,
    blockChainId:string,
    description:string,
    dateCreated:Date
}
export interface DocumentModelQuery{
  name: string,
  categoryId:string,
  subCategoryName: string,
  version:number,
  pathDocument:string,
  blockChainId:string,
  description:string,
  uuid: string,
  dateCreated:Date
}
export interface DocumentUpdateModel{
  name: string,
  pathDocument:string,
  description:string
}
