// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'sofkadocdoc',
    appId: '1:954298867566:web:e29628a271a2450f966b7f',
    storageBucket: 'sofkadocdoc.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyB7AsM07uZSk6uS8jhaCBZcu1_i2YcTZ-g',
    authDomain: 'sofkadocdoc.firebaseapp.com',
    messagingSenderId: '954298867566',
    measurementId: 'G-TQ53SY842K',
    },
    host:{
      verifyUser: 'http://localhost:8080/usuario/',
      createDocu: 'http://localhost:8080/document/create/'
    },
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
