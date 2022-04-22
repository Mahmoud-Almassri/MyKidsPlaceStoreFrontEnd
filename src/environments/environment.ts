/* export const environment = {
  production: false,
  apiPreLink: 'https://localhost:44318/api/',
  imagesUrl: 'https://localhost:44318/AppImages/',
  host: 'https://localhost:44318/',
  token: 'acessToken',
  sasToken:'',
  roleClaim: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  addressClaim: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/streetaddress',
  mobileClaim: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone',
  userName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  idClaim: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  firebaseConfig : {
    apiKey: "AIzaSyBT9MdfY9YnqMbUYKx4z8023C-Bov5cpfk",
    authDomain: "mykidsplacestore.firebaseapp.com",
    projectId: "mykidsplacestore",
    storageBucket: "mykidsplacestore.appspot.com",
    messagingSenderId: "187849962423",
    appId: "1:187849962423:web:7a90952744f4234b9b6e32",
    measurementId: "G-QSPWF3G62E"
  }
}; */
export const environment = {
  production: false,
  apiPreLink: 'https://mykidsplaceapis.azurewebsites.net/api/',
  token: 'acessToken',
  host: 'https://mykidsplaceapis.azurewebsites.net/',
  imagesUrl: 'https://mykidsplacestorage.file.core.windows.net/appattachments/appimages/',
  sasToken: '?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2035-03-01T07:10:49Z&st=2021-02-28T21:10:49Z&spr=https,http&sig=HzYgY%2BvbOyJiqhCnHwrr0NJG4eR%2FW73ELm%2Fk4ZZGWks%3D',
  roleClaim: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  addressClaim: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/streetaddress',
  mobileClaim: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone',
  userName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  idClaim: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  firebaseConfig : {
    apiKey: "AIzaSyBT9MdfY9YnqMbUYKx4z8023C-Bov5cpfk",
    authDomain: "mykidsplacestore.firebaseapp.com",
    projectId: "mykidsplacestore",
    storageBucket: "mykidsplacestore.appspot.com",
    messagingSenderId: "187849962423",
    appId: "1:187849962423:web:7a90952744f4234b9b6e32",
    measurementId: "G-QSPWF3G62E"
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
