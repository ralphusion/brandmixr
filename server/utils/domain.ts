import whois from 'whois-json';

export interface DomainCheckResult {
  available: boolean;
  domain: string;
}

export async function checkDomainAvailability(name: string): Promise<DomainCheckResult> {
  // Convert name to lowercase and remove spaces/special characters
  const sanitizedName = name.toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .trim();

  const domain = `${sanitizedName}.com`;

  try {
    const result = await whois(domain, {
      follow: 3, // Follow up to 3 redirects
      timeout: 5000, // 5 second timeout
    });

    // More robust availability check
    const isAvailable = 
      // If there's no registrar info, domain is likely available
      (!result.registrar && !result.registrarUrl) &&
      // Check for common "not found" indicators
      (result.domainName === undefined || 
       (typeof result.text === 'string' && 
        (result.text.includes('No match for') || 
         result.text.includes('NOT FOUND') ||
         result.text.includes('Status: AVAILABLE'))));

    console.log(`Domain check for ${domain}:`, {
      available: isAvailable,
      registrar: result.registrar,
      creationDate: result.creationDate,
      text: result.text?.substring(0, 100) // Log first 100 chars of response
    });

    return {
      available: isAvailable,
      domain
    };
  } catch (error) {
    // Log the specific error for debugging
    console.error(`Error checking domain availability for ${domain}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // If there's a connection error or timeout, we'll assume the domain might be available
    // but mark it as needing verification
    return {
      available: false,
      domain
    };
  }
}