import axios from 'axios';
import * as cheerio from 'cheerio';

interface Metadata {
  title: string;
  description: string;
  favicon: string;
}

export async function fetchMetadata(url: string): Promise<Metadata> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';
    
    let favicon = $('link[rel="icon"]').attr('href') || 
                 $('link[rel="shortcut icon"]').attr('href') || 
                 '/favicon.ico';

    //favicon
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = `${urlObj.protocol}//${urlObj.host}${favicon}`;
    }

    return {
      title,
      description,
      favicon
    };
  } catch (error) {
    console.error('error fetching metadata:', error);
    return {
      title: '',
      description: '',
      favicon: ''
    };
  }
} 