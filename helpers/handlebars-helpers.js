module.exports = {
  ifCond: function (a, b, options) {
    if (!a || !b) {
      return options.inverse(this); // 如果有一個為空，則返回反向結果
    }
    return a.toString() === b.toString() ? options.fn(this) : options.inverse(this);
  }
}