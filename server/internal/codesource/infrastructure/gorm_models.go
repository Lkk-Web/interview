package infrastructure

import "time"

// CodeSourceModel 是 GORM 数据库模型，对应 code_sources 表。
type CodeSourceModel struct {
	ID      uint   `gorm:"primaryKey"`
	PageKey string `gorm:"column:page_key"`
	CodeKey string `gorm:"column:code_key"`
	// PageKey + CodeKey 的唯一性由数据库 UNIQUE 约束保证，不在这里重复定义。
	Lang         string    `gorm:"column:lang"`
	Code         string    `gorm:"column:code"`
	CacheKey     *string   `gorm:"column:cache_key"`
	Title        *string   `gorm:"column:title"`
	Description  *string   `gorm:"column:description"`
	Theme        string    `gorm:"column:theme"`
	Zoomable     bool      `gorm:"column:zoomable"`
	DefaultOpen  bool      `gorm:"column:default_open"`
	EditorHeight *int      `gorm:"column:editor_height"`
	Visibility   string    `gorm:"column:visibility"`
	CreatedAt    time.Time `gorm:"column:created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at"`
}

func (CodeSourceModel) TableName() string { return "code_sources" }

// CodeSourceVersionModel 对应 code_source_versions 表。
type CodeSourceVersionModel struct {
	ID           uint      `gorm:"primaryKey"`
	CodeSourceID uint      `gorm:"column:code_source_id"`
	Version      int       `gorm:"column:version"`
	Code         string    `gorm:"column:code"`
	ChangeNote   *string   `gorm:"column:change_note"`
	CreatedAt    time.Time `gorm:"column:created_at"`
}

func (CodeSourceVersionModel) TableName() string { return "code_source_versions" }
