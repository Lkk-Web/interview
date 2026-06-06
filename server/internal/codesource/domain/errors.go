package domain

import "errors"

// ErrNotFound 在按 pageKey+codeKey 查不到记录时返回。
var ErrNotFound = errors.New("code source not found")
