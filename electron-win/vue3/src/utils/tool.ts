const formatAgeText = (param: string | number) => {
  let _isAge: boolean = false
  let _integer: number = 0
  let _decimal: number = 0

  if (typeof param == 'string') {
    _isAge = parseInt(param) % 12 == 0
    _integer = Math.floor(parseInt(param) / 12)
    _decimal = parseInt(param) - _integer * 12
  } else if (typeof param == 'number') {
    _isAge = param % 12 == 0
    _integer = Math.floor(param / 12)
    _decimal = param - _integer * 12
  }

  if (_integer == 0 && _decimal == 0) {
    return `0`
  } else if (_integer < 1) {
    return `${_decimal}个月`
  } else if (_isAge) {
    return `${_integer}岁`
  }
  return `${_integer}岁${_decimal}个月`
}

export { formatAgeText }
