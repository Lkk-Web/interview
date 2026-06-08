.PHONY: dev build swagger

# 开发模式：先生成 swagger 文档，再启动服务
dev: swagger
	GOTOOLCHAIN=local GOPROXY=https://goproxy.cn,direct GOSUMDB=off go run ./cmd/api

# 只重新生成 swagger 文档
swagger:
	$(shell go env GOPATH)/bin/swag init -g cmd/api/main.go -o docs/swagger

# 构建二进制
build: swagger
	GOTOOLCHAIN=local go build -o bin/api ./cmd/api
