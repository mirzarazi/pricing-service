import { Price } from '../models/price'

export default {
  // You may want to use this empty method 🤔
  async getPriceHistory() {
    const prices = await Price.findAll();
    return prices.reduce((history: any, price: Price)=> {
      const municipality = price.municipality;
      if (municipality) {
        if(history[municipality]) {
          history[municipality].push(price.priceCents);
        } else {
          history[municipality] = [price.priceCents];
        }
      }
      return history;
    }, {})

  },
  async getPriceHistoryByMunicipality(municipality: string) {
    const prices = await Price.findAll();
    return prices.reduce((history: any, price: Price)=> {
      if(municipality===price.municipality) {
        history.push(price.priceCents);
      }
      return history;
    }, [])

  },
}