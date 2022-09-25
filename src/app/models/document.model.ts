export interface DocumentModel{
    name: string,
    categoryId:string,
    subCategoryName: string,
    version:number,
    pathDocument:string,
    blockChainId:string,
    description:string
}
export interface DocumentModelQuery{
  name: string,
  categoryId:string,
  subCategoryName: string,
  version:number,
  pathDocument:string,
  blockChainId:string,
  description:string,
  uuid: string
}
