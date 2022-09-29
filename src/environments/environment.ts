// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
    createDocument: 'http://localhost:8080/document/create',
    createCategory: 'http://localhost:8080/category/create',
    getCategories: 'http://localhost:8080/category/getall',
    getCategoriesToCompareEndPoint: 'http://localhost:8080/category/compare',
    getSubcategories: 'http://localhost:8080/subcategory/',
    getSubcategoriesToCompareEndPoint: 'http://localhost:8080/subcategory/compare',
    createSubcategory: 'http://localhost:8080/subcategory/create',
    getDocumentsBy: 'http://localhost:8080/documents',
    getDocumentsById: 'http://localhost:8080/documento',
    getDocumentsByCategory: 'http://localhost:8080/document',
    deleteDocument: 'http://localhost:8080/document/delete',
    updateDocument: 'http://localhost:8080/document/update',
    updateDateDownloadsDocument: 'https://localhost:8080/document/update/lastDownload',
    updateDownloads: 'http://localhost:8080/download/create',
    getDownloadsByperiod: 'http://localhost:8080/downloads'
  },
  blockchain: {
    putData: 'https://albertus-main.herokuapp.com/create/block',
    getData: 'https://albertus-view.herokuapp.com/block/'
  },
  paginationmax: 5,
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
