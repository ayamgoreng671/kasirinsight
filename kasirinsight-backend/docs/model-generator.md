## 📦 Make Command: `make model`

This command automatically generates a **Go struct model** file with optional fields based on a simple shorthand syntax.

---

### 🚀 Usage

```bash
make model mn=ModelName field=FieldName-type,AnotherField-type
```

---

### 🧩 Parameters

| Parameter | Required | Description                    |
| --------- | -------- | ------------------------------ |
| `mn`      | ✅ Yes    | Model name (PascalCase)        |
| `field`   | ❌ No     | Comma-separated list of fields |

---

### 🏷️ Field Format

Each field follows this pattern:

```
FieldName-type
```

#### Supported Types

| Code | Go Type   |
| ---- | --------- |
| `s`  | `string`  |
| `i`  | `int`     |
| `f`  | `float64` |
| `b`  | `bool`    |

---

### 📌 Example

```bash
make model mn=Product field=Name-s,Price-f,Stock-i,IsActive-b
```

---

### 📂 Output

This will generate:

```
models/product.go
```

---

### 🧾 Generated Code Example

```go
type Product struct {
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Stock    int     `json:"stock"`
	IsActive bool    `json:"is_active"`
}
```

---

### ⚙️ How It Works

1. Validates that `mn` (model name) is provided.
2. Displays a loading animation.
3. Creates the `models/` directory if it doesn't exist.
4. Parses the `field` parameter:

   * Converts shorthand types into Go types
   * Converts field names into `snake_case` JSON tags
5. Uses a template file:

   ```
   makesrc/model.go.txt
   ```
6. Replaces:

   * `{mn}` → Model name
   * `{properties}` → Generated fields
7. Saves the final file to:

   ```
   models/<snake_case_model>.go
   ```

---

### 🧱 Template Requirement

Ensure you have a template file at:

```
makesrc/model.go.txt
```

Example template:

```go
package models

type {mn} struct {
{properties}
}
```

---

### ⚠️ Notes

* Field names must be in **PascalCase** (e.g., `ProductName`)
* JSON tags are automatically converted to **snake_case**
* If `field` is omitted, an empty struct will be generated
* Existing files with the same name will be overwritten

---

### ✅ Quick Tips

* Keep model names singular (`Product`, not `Products`)
* Use clear, descriptive field names
* Extend template if you want tags like `gorm`, `validate`, etc.


