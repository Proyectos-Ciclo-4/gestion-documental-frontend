export const environment = {
  firebase: {
    projectId: 'gestiondocumentalsofka',
    appId: '1:102176668601:web:131356f8fd489652975468',
    storageBucket: 'gestiondocumentalsofka.appspot.com',
    apiKey: 'AIzaSyCo9sbnfPN5Gf_tHCCKEtHZdMmt64hiX-g',
    authDomain: 'gestiondocumentalsofka.firebaseapp.com',
    messagingSenderId: '102176668601',
  },
  host: {
    verifyUser: 'https://docdoc-gestion.herokuapp.com/user/',
    createDocument: 'https://docdoc-gestion.herokuapp.com/document/create',
    createCategory: 'https://docdoc-gestion.herokuapp.com/category/create',
    getCategories: 'https://docdoc-gestion.herokuapp.com/category/getall',
    getCategoriesToCompareEndPoint: 'https://docdoc-gestion.herokuapp.com/category/compare',
    getSubcategories: 'https://docdoc-gestion.herokuapp.com/subcategory',
    getSubcategoriesToCompareEndPoint: 'https://docdoc-gestion.herokuapp.com/subcategory/compare',
    createSubcategory: 'https://docdoc-gestion.herokuapp.com/subcategory/create',
    getDocumentsBy: 'https://docdoc-gestion.herokuapp.com/documents',
    getDocumentsById: 'https://docdoc-gestion.herokuapp.com/documento',
    getDocumentsByCategory: 'https://docdoc-gestion.herokuapp.com/document',
    deleteDocument: 'https://docdoc-gestion.herokuapp.com/document/delete',
    updateDocument: 'https://docdoc-gestion.herokuapp.com/document/update',
    updateDateDownloadsDocument: 'https://docdoc-gestion.herokuapp.com/document/update/lastDownload',
    updateDownloads: 'https://docdoc-gestion.herokuapp.com/download/create',
    getDownloadsByperiod: 'https://docdoc-gestion.herokuapp.com/downloads'
  },
  blockchain: {
    token: '481051a4-2b77-42e7-9e48-146fa1517d0a',
    putData: 'https://albertus-main.herokuapp.com/create/block',
    getData: 'https://albertus-view.herokuapp.com/block'
  },
  paginationmax: 5,
  production: false
};
