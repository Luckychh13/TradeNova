'use server'

import qs from 'query-string'

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if(!BASE_URL) throw new Error("Could not get the base url")
if(!API_KEY) throw new Error("Could not get api Key")

export async function fetcher<T>(
    endpoint:string,
    params?:QueryParams,
    revalidate = 60,
): Promise<T> {
    const url = qs.stringifyUrl({
        url:`${BASE_URL}/${endpoint}`,
        query:params,
    },{skipEmptyString:true, skipNull:true})
   
    const response = await fetch(url, {
        headers: {
            "x-cg-demo-api-key": API_KEY,
            "Content-Type": "application/json",
        }as Record<string, string>,
        next: {revalidate}
    })

    if(!response.ok){
        const errorBody: CoinGeckoErrorBody = await response.json()
          .catch(() => ({}))

        throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`)  
    }

    return response.json()
}    
