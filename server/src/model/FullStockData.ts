interface FullStockData {
    companyName?: string,
    symbol: string,
    todayPrice?: string,
    todayPriceChange?: number,
    todayPricePercentChange?: string,
    price7DaysAgo?: string,
    percentageChange7DaysAgo?: string,
    price30DaysAgo?: string,
    percentageChange30DaysAgo?: string
}

export default FullStockData;