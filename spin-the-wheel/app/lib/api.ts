export const DFIRE_CONTRACT = 'HBoE2hMCNRY4jZ7AFKbqEsPrtYAJdY7A4ed81Jp6moon'
const DEX_SCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens/'

export interface DfireData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  pairAddress: string;
  dexId: string;
}

export async function fetchDfireData(): Promise<DfireData> {
  try {
    const response = await fetch(`${DEX_SCREENER_API}${DFIRE_CONTRACT}`)
    const data = await response.json()
    console.log('Raw DEX Screener data:', data);
    
    if (data.pairs && data.pairs.length > 0) {
      const mainPair = data.pairs[0] // Using the first/main trading pair
      console.log('Parsed DFIRE data:', {
        price: parseFloat(mainPair.priceUsd || '0'),
        priceChange24h: parseFloat(mainPair.priceChange?.h24 || '0'),
        volume24h: parseFloat(mainPair.volume?.h24 || '0'),
        marketCap: parseFloat(mainPair.fdv || '0'),
        pairAddress: mainPair.pairAddress,
        dexId: mainPair.dexId,
      });
      return {
        price: parseFloat(mainPair.priceUsd || '0'),
        priceChange24h: parseFloat(mainPair.priceChange?.h24 || '0'),
        volume24h: parseFloat(mainPair.volume?.h24 || '0'),
        marketCap: parseFloat(mainPair.fdv || '0'),
        pairAddress: mainPair.pairAddress,
        dexId: mainPair.dexId,
      }
    }
    throw new Error('No trading pair data found')
  } catch (error) {
    console.error('Error fetching DFIRE data:', error)
    return {
      price: 0,
      priceChange24h: 0,
      volume24h: 0,
      marketCap: 0,
      pairAddress: '',
      dexId: '',
    }
  }
}

