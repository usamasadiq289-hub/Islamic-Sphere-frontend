export const getZakatPrices = async () => {
    const res = await fetch('http://localhost:3000/api/zakat/prices');
    if (!res.ok) throw new Error('Failed to fetch zakat prices');
    const data = await res.json();
    
    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch zakat prices');
    }
    
    return data;
};

// Helper function to get specific currency prices
export const getCurrencyPrices = (allPrices, currency = 'PKR') => {
    if (!allPrices || !allPrices.currencies) {
        return null;
    }
    return allPrices.currencies[currency] || allPrices.currencies['PKR'];
};

// Helper function to get available currencies
export const getAvailableCurrencies = (allPrices) => {
    if (!allPrices || !allPrices.currencies) {
        return [];
    }
    return Object.keys(allPrices.currencies).sort();
};
  