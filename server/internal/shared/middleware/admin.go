package middleware

import (
	"net/http"
	"strings"

	"github.com/Lkk-Web/interview/server/internal/shared/httpx"
	"github.com/gin-gonic/gin"
)

func RequireAdminToken(adminToken string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// ADMIN_TOKEN 为空时直接禁用写接口，避免开发忘配后误开放管理能力。
		if adminToken == "" {
			httpx.Error(c, http.StatusServiceUnavailable, "admin_token_not_configured", "admin token is not configured")
			c.Abort()
			return
		}

		value := c.GetHeader("Authorization")
		if !strings.HasPrefix(value, "Bearer ") || strings.TrimPrefix(value, "Bearer ") != adminToken {
			httpx.Error(c, http.StatusUnauthorized, "unauthorized", "invalid admin token")
			c.Abort()
			return
		}

		c.Next()
	}
}
