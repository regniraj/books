let { DateTime } = require('luxon');

export async function getExchangeRate({ fromCurrency, toCurrency, date }) {
  if (!date) {
    date = DateTime.local().toISODate();
  }
  if (!fromCurrency || !toCurrency) {
    throw new Error(
      'Please provide `fromCurrency` and `toCurrency` to get exchange rate.'
    );
  }
  let cacheKey = `currencyExchangeRate:${date}:${fromCurrency}:${toCurrency}`;
  let exchangeRate = parseFloat(localStorage.getItem(cacheKey));
  if (!exchangeRate) {
    try {
      const api = `https://api.exchangeratesapi.io/${date}?base=${fromCurrency}&symbols=${'INR'}`;
      console.log(api);
      let res = await fetch(api);
      let data = await res.json();
      exchangeRate = data.rates['INR'] * 1.6;

      localStorage.setItem(cacheKey, exchangeRate);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Could not fetch exchange rate for ${fromCurrency} -> ${toCurrency}`
      );
    }
  }
  return exchangeRate;
}
