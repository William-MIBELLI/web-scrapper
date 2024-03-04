import * as cheerio from 'cheerio'

export const extractPrice = (...elements: cheerio.Cheerio<cheerio.Element>[]): string => {

  for (const element of elements) {
    let priceToReturn = '';
    element.each((index, el) => {
      const $ = cheerio.load(el);
      const price = $(el).text().trim();

      if (price) {
        const parsedPrice = price.replace(/\D/g, '');
        priceToReturn = parsedPrice;
        return false;
      }
    })
    if (priceToReturn !== '') {
      return priceToReturn
    }
  }

  return ''
}

export const extractCurrency = (element: cheerio.Cheerio<cheerio.Element>): string => {
  const currency = element.text().trim().slice(0, 1);
  return currency ? currency : "";
}