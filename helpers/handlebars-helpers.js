module.exports = {
  ifCond: function (a, b, options) {
    // 如果有一個為空，則返回反向結果
    if (!a || !b) {
      return options.inverse(this); 
    }

    return a.toString() === b.toString() ? options.fn(this) : options.inverse(this);
  },
  ifGreaterThan: function (a, b, options) {
    // 若未定義則返回反向結果
    if (typeof a === 'undefined' || typeof b === 'undefined'){
      return options.inverse(this)
    }

    const numA = typeof a === 'number' ? a :Number(a)
    const numB = typeof b === 'number' ? b :Number(b)
    if (isNaN(numA) || isNaN(numB)){
      return options.inverse(this)
    }

    return numA > numB ? options.fn(this) : options.inverse(this)
  }
}