// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://172.20.0.10:4200',
  mogadorServerIPs: [
    {
      hotel_name: 'Pluriel test',
      ip: '192.168.2.222:8000'
    },
    {
      hotel_name: 'Mogador Menara',
      ip: '192.168.2.500:50'
    },
    {
      hotel_name: 'Mogador Kasbah',
      ip: '192.168.2.63'
    },
    {
      hotel_name: 'Mogador Tanger',
      ip: '192.168.2.44'
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
