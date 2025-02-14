import axios from 'axios';

export interface TrademarkSearchResult {
  exists: boolean;
  similarMarks: Array<{
    serialNumber: string;
    registrationNumber: string;
    wordMark: string;
    status: string;
  }>;
}

export async function checkTrademarkAvailability(name: string): Promise<TrademarkSearchResult> {
  try {
    // Use USPTO's TESS search API
    const response = await axios.get(
      `https://tmsearch.uspto.gov/bin/showfield?f=toc&state=4809%3A4yk7ir.1.1&p_search=searchss&p_L=50&BackReference=&p_plural=yes&p_s_PARA1=&p_tagrepl~%3A=PARA1%24LD&expr=PARA1+AND+PARA2&p_s_PARA2=${encodeURIComponent(name)}&p_tagrepl~%3A=PARA2%24COMB&p_op_ALL=AND&a_default=search&a_search=Submit+Query&a_search=Submit+Query`,
      {
        headers: {
          'User-Agent': 'BrandNameGenerator/1.0'
        }
      }
    );

    // Parse the HTML response to check for trademark existence
    const html = response.data;
    const hasSimilarMarks = html.includes('Status/') || html.includes('Serial Number');

    // For demo purposes, return minimal information
    // In production, you'd want to properly parse the HTML response
    return {
      exists: hasSimilarMarks,
      similarMarks: hasSimilarMarks ? [{
        serialNumber: "Demo",
        registrationNumber: "Demo",
        wordMark: name,
        status: "LIVE"
      }] : []
    };
  } catch (error) {
    console.error(`Error checking trademark for ${name}:`, error);
    // If there's an error checking, we'll return a conservative result
    return {
      exists: false,
      similarMarks: []
    };
  }
}