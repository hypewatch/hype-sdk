import { HypeSDK } from '../sdk';
import { PublicKey } from '@solana/web3.js';

describe('HypeSDK', () => {
  let sdk: HypeSDK;

  beforeEach(() => {
    sdk = new HypeSDK();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(sdk.programId).toBeDefined();
      expect(sdk.version).toBeDefined();
      expect(sdk.connection).toBeDefined();
      expect(sdk.programId.toString()).toBe('HYPExvaQRQHrkCNc1DAHJoByUeBqFvkJyhtpFdacLcdH');
    });

    it('should throw error when using methods before initRoot', async () => {
      const publicKey = new PublicKey('11111111111111111111111111111111');
      await expect(sdk.getUserTokens(publicKey)).rejects.toThrow('Init root first!');
    });
  });

  describe('getUserTokens', () => {
    it('should return tokens for existing user', async () => {
      await sdk.initRoot();
      const publicKey = new PublicKey('G1XZNbpX2GoPHPEV71JrNvRicRnTYzjmrJfXQdbUnhoZ');
      const tokens = await sdk.getUserTokens(publicKey);
      expect(tokens).toBeInstanceOf(Array);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0]).toHaveProperty('address');
      expect(tokens[0]).toHaveProperty('balance');
      expect(tokens[0]).toHaveProperty('price');
      expect(tokens[0]).toHaveProperty('supply');
    });
  });

  describe('getUserBalance', () => {
    it('should return balance for existing user', async () => {
      const sdk = new HypeSDK();
      await sdk.initRoot();
      const publicKey = new PublicKey('G1XZNbpX2GoPHPEV71JrNvRicRnTYzjmrJfXQdbUnhoZ');
      const balance = await sdk.getUserBalance(publicKey);
      expect(balance).toHaveProperty('sol');
      expect(balance).toHaveProperty('usdc');
      expect(balance.sol).toHaveProperty('toString');
      expect(balance.usdc).toHaveProperty('toString');
      expect(typeof balance.sol.toString()).toBe('string');
      expect(typeof balance.usdc.toString()).toBe('string');
    });
  });

  describe('getTokenList', () => {
    it('should return token list after initializing root', async () => {
      const sdk = new HypeSDK();
      await sdk.initRoot();
      const tokens = await sdk.getTokenList();
      expect(tokens).toBeInstanceOf(Array);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0]).toHaveProperty('address');
      expect(tokens[0]).toHaveProperty('price');
      expect(tokens[0]).toHaveProperty('supply');
    });

    it('should apply filters correctly', async () => {
      await sdk.initRoot();
      const tokens = await sdk.getTokenList({
        filters: [{ field: 'price', filters: { gte: 0.2, lte: 0.5 } }],
      });
      expect(Array.isArray(tokens)).toBe(true);
    });
  });
});
