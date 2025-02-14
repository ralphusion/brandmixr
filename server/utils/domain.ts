import whois from 'whois-json';

export interface DomainCheckResult {
  available: boolean;
  domain: string;
}

export async function checkDomainAvailability(name: string): Promise<DomainCheckResult> {
  // Convert name to lowercase and remove spaces/special characters
  const sanitizedName = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

  const domain = `${sanitizedName}.com`;

  try {
    const result = await whois(domain);
    // If there's no registrar or creation date, the domain is likely available
    const available = !result.registrar && !result.creationDate;

    return {
      available,
      domain
    };
  } catch (error) {
    console.error(`Error checking domain availability for ${domain}:`, error);
    // If there's an error checking, we'll assume the domain is taken to be safe
    return {
      available: false,
      domain
    };
  }
}