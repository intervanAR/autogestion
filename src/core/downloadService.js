export const downloadFile = (encodedUri, fileName) => {

   var archBajado = 0;


   // FUNCIONES PARA ANDROID + CORDOVA

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

    var errorHandler = function (fileName, e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
        };
    console.log('Error (' + fileName + '): ' + msg);
    }

    function writeToFile(fname, data) {
        //alert(fname);
        //alert(data.length);
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (directoryEntry) {
            directoryEntry.getFile(fname, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Archivo "' + fname + '"" guardado.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Error Escritura: ' + e.toString());
                    };

                    //var blob = new Blob([data], { type: 'application/pdf' });
                    var blob = b64toBlob(data, 'application/pdf');
                    fileWriter.write(blob);
                    archBajado = 1;
                }, errorHandler.bind(null, fname));
            }, errorHandler.bind(null, fname));
        }, errorHandler.bind(null, fname));
    }

    function openFile(fname) {
    cordova.plugins.fileOpener2.open(
        '/sdcard/'+fname, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
        'application/pdf',
        {
            error : function(e) {
                console.log('Error estado: ' + e.status + ' - mensaje: ' + e.message);
            },
            success : function () {
                console.log('Archivo abierto ok' + fileName);
            }
        }
       );
    }

    // CUERPO PRINCIPAL - ANDROID + CORDOVA TRATAMIENTO ESPECIAL

    var isAndroid = /(android)/i.test(navigator.userAgent);
    var isCordovaApp = !!window.cordova;

    if (isAndroid && isCordovaApp) {
      writeToFile('Download/'+fileName, encodedUri);
      while (archBajado = 0){console.log("Esperando")}
      openFile('Download/'+fileName);
      //return Promise.resolve()
      //              .then(writeToFile('Download/'+fileName, encodedUri))
      //              .then(openFile('Download/'+fileName));
     }
    const link = document.createElement("a");
    link.setAttribute("href", "data:application/pdf;charset=utf-8;base64," + encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // Required for FF
    return Promise.resolve(link.click());
};
