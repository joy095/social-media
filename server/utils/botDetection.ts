import { User } from '../models/User';

// Bot behavior detection patterns
const BOT_PATTERNS = {
  // Rapid interactions (likes/views) within short timeframe
  RAPID_INTERACTIONS: {
    timeWindow: 60 * 1000, // 1 minute
    maxInteractions: 10
  },

  // Repetitive behavior patterns
  REPETITIVE_PATTERNS: {
    timeWindow: 5 * 60 * 1000, // 5 minutes
    maxSameAction: 20
  },

  // Suspicious user agent patterns
  SUSPICIOUS_USER_AGENTS: [
    'bot', 'crawler', 'spider', 'scraper',
    'headless', 'phantom', 'selenium'
  ],

  // Unusual session durations
  SESSION_PATTERNS: {
    minValidDuration: 5 * 1000, // 5 seconds
    maxValidDuration: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Track user interactions for bot detection
class BotDetector {
  constructor() {
    this.userInteractions = new Map();
    this.cleanupInterval = setInterval(this.cleanup.bind(this), 5 * 60 * 1000); // 5 minutes
  }

  // Record a user interaction
  recordInteraction(userId, actionType, ip, userAgent) {
    const now = Date.now();
    const userKey = `${userId}-${ip}`;

    if (!this.userInteractions.has(userKey)) {
      this.userInteractions.set(userKey, {
        interactions: [],
        userAgent: userAgent,
        firstSeen: now
      });
    }

    const userData = this.userInteractions.get(userKey);
    userData.interactions.push({
      action: actionType,
      timestamp: now
    });

    // Keep only recent interactions
    userData.interactions = userData.interactions.filter(
      interaction => now - interaction.timestamp < 10 * 60 * 1000 // 10 minutes
    );

    return this.analyzeBotBehavior(userKey, userData);
  }

  // Analyze if behavior indicates bot activity
  analyzeBotBehavior(userKey, userData) {
    const now = Date.now();
    const { interactions, userAgent } = userData;
    let suspiciousScore = 0;
    const reasons = [];

    // Check for rapid interactions
    const recentInteractions = interactions.filter(
      i => now - i.timestamp < BOT_PATTERNS.RAPID_INTERACTIONS.timeWindow
    );

    if (recentInteractions.length > BOT_PATTERNS.RAPID_INTERACTIONS.maxInteractions) {
      suspiciousScore += 30;
      reasons.push('Rapid interactions detected');
    }

    // Check for repetitive patterns
    const actionCounts = {};
    interactions.forEach(interaction => {
      actionCounts[interaction.action] = (actionCounts[interaction.action] || 0) + 1;
    });

    Object.entries(actionCounts).forEach(([action, count]) => {
      if (count > BOT_PATTERNS.REPETITIVE_PATTERNS.maxSameAction) {
        suspiciousScore += 25;
        reasons.push(`Repetitive ${action} behavior`);
      }
    });

    // Check user agent
    if (userAgent && BOT_PATTERNS.SUSPICIOUS_USER_AGENTS.some(
      pattern => userAgent.toLowerCase().includes(pattern)
    )) {
      suspiciousScore += 40;
      reasons.push('Suspicious user agent');
    }

    // Check for uniform timing patterns (bots often have consistent timing)
    if (interactions.length > 5) {
      const timeDiffs = [];
      for (let i = 1; i < interactions.length; i++) {
        timeDiffs.push(interactions[i].timestamp - interactions[i - 1].timestamp);
      }

      const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
      const variance = timeDiffs.reduce((sum, diff) => sum + Math.pow(diff - avgDiff, 2), 0) / timeDiffs.length;

      // Low variance in timing suggests bot behavior
      if (variance < 1000 && avgDiff < 5000) { // Very consistent timing under 5 seconds
        suspiciousScore += 20;
        reasons.push('Uniform timing patterns');
      }
    }

    // Check for missing natural pauses
    const shortIntervals = interactions.reduce((count, interaction, index) => {
      if (index > 0) {
        const timeDiff = interaction.timestamp - interactions[index - 1].timestamp;
        if (timeDiff < 1000) { // Less than 1 second between actions
          return count + 1;
        }
      }
      return count;
    }, 0);

    if (shortIntervals > interactions.length * 0.5) { // More than 50% very fast actions
      suspiciousScore += 15;
      reasons.push('Lack of natural pauses');
    }

    const isBot = suspiciousScore >= 50;

    if (isBot) {
      console.log(`Bot behavior detected for ${userKey}: Score ${suspiciousScore}, Reasons: ${reasons.join(', ')}`);
    }

    return {
      isBot,
      suspiciousScore,
      reasons,
      interactionCount: interactions.length
    };
  }

  // Record bot behavior in user model
  async recordBotBehavior(userId, actionType) {
    try {
      const user = await User.findById(userId);
      if (user) {
        if (actionType === 'like') {
          user.suspiciousActivity.likeSpamCount += 1;
        } else if (actionType === 'view') {
          user.suspiciousActivity.viewSpamCount += 1;
        }

        user.suspiciousActivity.lastSuspiciousActivity = new Date();

        // Flag user if they have too much suspicious activity
        if (user.suspiciousActivity.likeSpamCount > 50 || user.suspiciousActivity.viewSpamCount > 100) {
          user.suspiciousActivity.isFlagged = true;
        }

        await user.save();
      }
    } catch (error) {
      console.error('Error recording bot behavior:', error);
    }
  }

  // Clean up old interaction data
  cleanup() {
    const now = Date.now();
    const cutoff = 10 * 60 * 1000; // 10 minutes

    for (const [userKey, userData] of this.userInteractions.entries()) {
      if (now - userData.firstSeen > cutoff) {
        this.userInteractions.delete(userKey);
      }
    }
  }

  // Get statistics about detected bots
  getStats() {
    const stats = {
      totalTrackedUsers: this.userInteractions.size,
      suspiciousUsers: 0,
      botUsers: 0
    };

    for (const userData of this.userInteractions.values()) {
      const analysis = this.analyzeBotBehavior('temp', userData);
      if (analysis.suspiciousScore > 25) {
        stats.suspiciousUsers++;
      }
      if (analysis.isBot) {
        stats.botUsers++;
      }
    }

    return stats;
  }

  // Clear all tracking data (for testing)
  reset() {
    this.userInteractions.clear();
  }

  // Destroy the detector and cleanup intervals
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.userInteractions.clear();
  }
}

// Create singleton instance
const botDetector = new BotDetector();

// Middleware function to check for bot behavior
const checkBotBehavior = (actionType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';

    const analysis = botDetector.recordInteraction(userId, actionType, ip, userAgent);

    if (analysis.isBot) {
      await botDetector.recordBotBehavior(userId, actionType);

      // Add bot detection info to request
      req.botDetection = {
        isBot: true,
        score: analysis.suspiciousScore,
        reasons: analysis.reasons
      };
    } else {
      req.botDetection = {
        isBot: false,
        score: analysis.suspiciousScore
      };
    }

    next();
  };
};

// Utility to check if IP is suspicious
const isSuspiciousIP = (ip) => {
  // Add IP blacklist checking logic here
  // For now, just check for localhost and common bot IPs
  const suspiciousIPs = ['127.0.0.1', '::1'];
  return suspiciousIPs.includes(ip);
};

export {
  botDetector,
  checkBotBehavior,
  isSuspiciousIP,
  BOT_PATTERNS
}

