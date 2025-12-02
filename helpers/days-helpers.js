const getYearAndMonthOfToday = ()=> {
    // 取得當天的年/月/日
    const theDay = new Date()
    const thisYear = theDay.getFullYear()
    const thisMonth = theDay.getMonth() + 1  // 月份為0~11

    let result = `${thisYear}-${thisMonth}`
    if (result.length < 7) result = result.replace('-', '-0')

    return result
}

const getDaysInCurrentMonth = (selectTime) => {
    const now = new Date()
    const theDay = new Date(selectTime)
    if (now > theDay) return 1

    const today = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    const firstDayNextMonth = new Date(year, month + 1, 1)
    const lastDayThisMonth = new Date(firstDayNextMonth - 1)

    // 回傳值: 本月總天數 - 當下日期 + 1 (含當天)
    return lastDayThisMonth.getDate() - today + 1
}

module.exports = { getYearAndMonthOfToday, getDaysInCurrentMonth }