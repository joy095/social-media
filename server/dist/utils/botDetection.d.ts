declare const BOT_PATTERNS: {
    RAPID_INTERACTIONS: {
        timeWindow: number;
        maxInteractions: number;
    };
    REPETITIVE_PATTERNS: {
        timeWindow: number;
        maxSameAction: number;
    };
    SUSPICIOUS_USER_AGENTS: string[];
    SESSION_PATTERNS: {
        minValidDuration: number;
        maxValidDuration: number;
    };
};
declare class BotDetector {
    constructor();
    recordInteraction(userId: any, actionType: any, ip: any, userAgent: any): {
        isBot: boolean;
        suspiciousScore: number;
        reasons: string[];
        interactionCount: any;
    };
    analyzeBotBehavior(userKey: any, userData: any): {
        isBot: boolean;
        suspiciousScore: number;
        reasons: string[];
        interactionCount: any;
    };
    recordBotBehavior(userId: any, actionType: any): Promise<void>;
    cleanup(): void;
    getStats(): {
        totalTrackedUsers: any;
        suspiciousUsers: number;
        botUsers: number;
    };
    reset(): void;
    destroy(): void;
}
declare const botDetector: BotDetector;
declare const checkBotBehavior: (actionType: any) => (req: any, res: any, next: any) => Promise<any>;
declare const isSuspiciousIP: (ip: any) => boolean;
export { botDetector, checkBotBehavior, isSuspiciousIP, BOT_PATTERNS };
//# sourceMappingURL=botDetection.d.ts.map