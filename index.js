const _eth = require('ethereumjs-wallet')
const _wal = _eth.default.generate()
console.log(_wal.getAddressString())
console.log(_wal.getPrivateKeyString())