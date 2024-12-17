import { format, startOfDay, startOfWeek, startOfMonth, isSameDay, isSameWeek, isSameMonth, parseISO } from 'date-fns'

export const groupTransactionByPeriod = (transactions,groupByType ) => {
  const grouped = {}

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    let groupKey = ""

    switch (groupByType) {
      case "daily":
        groupKey = format(transactionDate, "yyyy-MM-dd")
        break
      case "weekly":
        groupKey = format(transactionDate, "yyyy-ww")
        break
      case "monthly":
        groupKey = format(transactionDate, "yyyy-MM")
        break
      default:
        console.error("Invalid groupByType. Use 'daily', 'weekly', or 'monthly'.")
        return
    }

    if (!grouped[groupKey]) grouped[groupKey] = []
    grouped[groupKey].push(transaction)
  })

  return grouped
}

export const formatTime = (inputTime) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = days[inputTime.getDay()]
  const date = inputTime.getDate().toString().padStart(2, '0')
  const month = months[inputTime.getMonth()]
  const year = inputTime.getFullYear()
  
  const hours = inputTime.getHours()
  const minutes = inputTime.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? '.pm' : '.am'
  const formattedHours = ((hours % 12) || 12).toString().padStart(2, '0')
  return `${day}, ${date} ${month} ${year} ${formattedHours}:${minutes}${period}`
}