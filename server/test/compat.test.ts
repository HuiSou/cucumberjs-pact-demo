import { Verifier, VerifierOptions } from '@pact-foundation/pact';
import { describe, it, expect } from 'vitest';

describe('Pact Verification', () => {
  it('should verify the provider against the Pact Broker', async () => {
    /*const opts: VerifierOptions = {
      provider: 'server',
      providerBaseUrl: 'http://localhost:3000', // Your provider's base URL
      pactBrokerUrl: 'http://localhost:5555',
      pactBrokerToken: 'your-pact-broker-token', // Optional: if authentication is required
    };*/
    const opts: VerifierOptions = {
        pactUrls:['http://localhost:5555'],
        consumerVersionSelectors: [
        ],
        consumerVersionTags: [],
        providerBaseUrl:'http://localhost:5500',
        provider:'server'
    }

    const verifier = new Verifier(opts);
    await verifier.verifyProvider();

    // download pact
    // compare the test compatiblity
  });
});