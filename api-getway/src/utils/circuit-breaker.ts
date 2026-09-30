export enum CircuitState {
    CLOSED = 'CLOSED',       // Normal operation: Requests pass through
    OPEN = 'OPEN',           // Trip state: Downstream failing, fail fast immediately
    HALF_OPEN = 'HALF_OPEN', // Recovery test: Testing if downstream recovered
}

export interface CircuitBreakerOptions {
    failureThreshold?: number; // Number of failures before tripping (Default: 3)
    resetTimeoutMs?: number;   // Time to stay OPEN before testing recovery (Default: 10000ms)
}

export class CircuitBreaker {
    public state: CircuitState = CircuitState.CLOSED;
    private failureCount: number = 0;
    private failureThreshold: number;
    private resetTimeoutMs: number;
    private nextAttempt: number = Date.now();
    public serviceName: string;

    constructor(serviceName: string, options: CircuitBreakerOptions = {}) {
        this.serviceName = serviceName;
        this.failureThreshold = options.failureThreshold || 3;
        this.resetTimeoutMs = options.resetTimeoutMs || 10000;
    }

    public canExecute(): boolean {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() >= this.nextAttempt) {
                console.log(`[Circuit Breaker] 🟡 ${this.serviceName} transitioning from OPEN -> HALF_OPEN. Testing health...`);
                this.state = CircuitState.HALF_OPEN;
                return true;
            }
            return false; // Fail fast while circuit is OPEN
        }
        return true;
    }

    public recordSuccess(): void {
        if (this.state === CircuitState.HALF_OPEN) {
            console.log(`[Circuit Breaker] 🟢 ${this.serviceName} recovered! Circuit OPEN -> CLOSED.`);
        }
        this.failureCount = 0;
        this.state = CircuitState.CLOSED;
    }

    public recordFailure(): void {
        this.failureCount += 1;
        console.warn(`[Circuit Breaker] ⚠️ ${this.serviceName} failure recorded (${this.failureCount}/${this.failureThreshold})`);

        if (this.failureCount >= this.failureThreshold || this.state === CircuitState.HALF_OPEN) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.resetTimeoutMs;
            console.error(`[Circuit Breaker] 🔴 ${this.serviceName} Circuit TRIPPED -> OPEN! Failing fast for ${this.resetTimeoutMs / 1000}s`);
        }
    }
}
