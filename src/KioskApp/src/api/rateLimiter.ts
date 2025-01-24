type TokenBucket = {
  tokens: number;
  lastRefill: number;
};

class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private readonly maxTokens: number;
  private readonly refillRate: number;
  private readonly refillInterval: number;

  constructor(maxTokens = 60, refillRate = 1, refillInterval = 1000) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.refillInterval = refillInterval;
  }

  private refillBucket(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  async checkRateLimit(endpoint: string): Promise<boolean> {
    let bucket = this.buckets.get(endpoint);
    
    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: Date.now() };
      this.buckets.set(endpoint, bucket);
    }

    this.refillBucket(bucket);

    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    }

    return false;
  }

  getRemainingTokens(endpoint: string): number {
    const bucket = this.buckets.get(endpoint);
    if (!bucket) return this.maxTokens;
    
    this.refillBucket(bucket);
    return bucket.tokens;
  }

  async waitForToken(endpoint: string): Promise<void> {
    while (!(await this.checkRateLimit(endpoint))) {
      await new Promise(resolve => setTimeout(resolve, this.refillInterval));
    }
  }
}

export const rateLimiter = new RateLimiter();