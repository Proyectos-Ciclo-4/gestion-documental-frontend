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
    verifyUser: 'http://localhost:8080/user/',
    createDocument: 'http://localhost:8080/document/create/',
    createCategory: 'http://localhost:8080/category/create',
    getCategories: 'http://localhost:8080/category/getall',
    getSubcategories: 'http://localhost:8080/subcategory/',
    createSubcategory: 'http://localhost:8080/subcategory/create',
    getDocumentsBy: 'http://localhost:8080/documents',
    getDocumentsById: 'http://localhost:8080/documento',
    getDocumentsByCategory: 'http://localhost:8080/document',
    deleteDocument: 'http://localhost:8080/document/delete',
    updateDocument: 'http://localhost:8080/document/update',
    updateDownloads: 'http://localhost:8080/download/create',
    getDownloadsByperiod: 'http://localhost:8080/downloads'
  },
  paginationmax: 5,
  production: true,
};
