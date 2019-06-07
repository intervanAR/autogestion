// tipo:
// 'TC'=>Tarjeta De Credito
// 'TD'=>Tarjeta De Debito
// 'OT' =>Otros medios de Pago

const creditoDecidir = [
  {
    id:1,
    marca:'Visa',
    longitud_pan: 16,
    formato_cvv:'XXX',
    icono:'visa',
    activo:true,
    tipo:'TC',
  },
  {
    id:15,
    marca:'Master Card',
    longitud_pan:16,
    formato_cvv:'XXX',
    icono:'mastercard',
    activo:true,
    tipo:'TC',
  },
  {
    id:65,
    marca:'American Express',
    longitud_pan:15,
    formato_cvv:'XXXX',
    icono:'americanexpress',
    activo:true,
    tipo:'TC',
  },
  {
    id:24,
    marca:'Tarjeta Naranja',
    longitud_pan:16,
    formato_cvv:'XXX',
    icono:'naranja',
    activo:true,
    tipo:'TC',
  },
  {
    id:61,
    marca:'Tarjeta La Anónima',
    longitud_pan:16,
    formato_cvv:'XXX',
    icono:'la',
    activo:true,
    tipo:'TC',
  },
  {
    id:25,
    marca:'Pago Facil',
    longitud_pan:null,
    formato_cvv:null,
    icono:'pagofacil',
    activo:true,
    tipo:'OT',
  },
  {
    id:26,
    marca:'Rapi Pago',
    longitud_pan:null,
    formato_cvv:null,
    icono:'rapipago',
    activo:true,
    tipo:'OT',
  },
];

const debitoDecidir = [
  {
    id:31,
    marca:'Visa Débito',
    longitud_pan:16,
    formato_cvv:'XXX',
    icono:'visadebito',
    activo:true,
    tipo:'TD',
  },
  {
    id:66,
    marca:'Master Card Debit',
    longitud_pan:16,
    formato_cvv:'XXX',
    icono:'mastercarddebito',
    activo:true,
    tipo:'TD',
  },
  {
    id:67,
    marca:'Cabal Débito',
    longitud_pan:16,
    formato_cvv:'XXX',
    icono:'cabaldebito',
    activo:true,
    tipo:'TD',
  },
];

export {creditoDecidir, debitoDecidir};
