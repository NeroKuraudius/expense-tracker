const getDaysInCurrentMonth = () => {
    const now = new Date()
    const today = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    const firstDayNextMonth = new Date(year, month + 1, 1)
    const lastDayThisMonth = new Date(firstDayNextMonth - 1)

    // 回傳值: 本月總天數 - 當下日期 + 1 (含當天)
    return lastDayThisMonth.getDate() - today + 1
}

module.exports = getDaysInCurrentMonth