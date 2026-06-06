package infrastructure

import "time"

type DiagramModel struct {
	ID              uint      `gorm:"primaryKey"`
	Slug            string    `gorm:"column:slug;uniqueIndex"`
	Title           string    `gorm:"column:title"`
	Description     *string   `gorm:"column:description"`
	Category        *string   `gorm:"column:category"`
	Chart           string    `gorm:"column:chart"`
	DiagramType     string    `gorm:"column:diagram_type"`
	Theme           string    `gorm:"column:theme"`
	Zoomable        bool      `gorm:"column:zoomable"`
	Editable        bool      `gorm:"column:editable"`
	CacheKey        *string   `gorm:"column:cache_key"`
	SourcePath      *string   `gorm:"column:source_path"`
	SourceComponent *string   `gorm:"column:source_component"`
	Visibility      string    `gorm:"column:visibility"`
	CreatedAt       time.Time `gorm:"column:created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at"`
}

func (DiagramModel) TableName() string { return "mermaid_diagrams" }

type DiagramVersionModel struct {
	ID         uint      `gorm:"primaryKey"`
	DiagramID  uint      `gorm:"column:diagram_id"`
	Version    int       `gorm:"column:version"`
	Chart      string    `gorm:"column:chart"`
	ChangeNote *string   `gorm:"column:change_note"`
	CreatedAt  time.Time `gorm:"column:created_at"`
}

func (DiagramVersionModel) TableName() string { return "mermaid_diagram_versions" }
