package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimiter struct {
	ips map[string][]time.Time
	mu  sync.Mutex
}

var limiter = &rateLimiter{
	ips: make(map[string][]time.Time),
}

// RateLimitMiddleware restricts requests per IP to `limit` per `window`
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		limiter.mu.Lock()
		now := time.Now()
		times := limiter.ips[ip]

		var valid []time.Time
		for _, t := range times {
			if now.Sub(t) < window {
				valid = append(valid, t)
			}
		}

		if len(valid) >= limit {
			limiter.ips[ip] = valid
			limiter.mu.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many requests. Please try again later."})
			c.Abort()
			return
		}

		valid = append(valid, now)
		limiter.ips[ip] = valid
		limiter.mu.Unlock()

		c.Next()
	}
}
