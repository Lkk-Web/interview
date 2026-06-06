package httpx

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func OK(c *gin.Context, data any) {
	c.JSON(http.StatusOK, data)
}

func Created(c *gin.Context, data any) {
	c.JSON(http.StatusCreated, data)
}

func Error(c *gin.Context, status int, code string, message string) {
	c.JSON(status, ErrorResponse{Code: code, Message: message})
}
