package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model

	Name     string `json:"name"`
	Category string `json:"category"`
	Stock    int    `json:"stock"`

	LowStockThreshold     int `json:"low_stock_threshold"`
	HealthyStockThreshold int `json:"healthy_stock_threshold"`

	SellingPrice float64 `json:"selling_price"`
	Cogs         float64 `json:"cogs"`

	UserID uint `json:"user_id"` // owner
}
