const moment = require('moment')

class Date {
  constructor(format = "YYYY/MM/DD:HH:SS"){
    this._format = format
  }

  getDateTimeNow(){
    this._dateTimeNow = moment().format(this.getFormat())
    return this._dateTimeNow
  }

  getFormat(){
    return this._format
  }
  setFormat(format){
    this._format = format
  }
}


module.exports = { Date }
