## 🎮 Make Command: `make controller`

This command generates a **Go controller file** from a template, automatically replacing placeholders with your model and project name.

---

### 🚀 Usage

```bash id="k2x1pq"
make controller mn=ModelName project=your_project_name
```

---

### 🧩 Parameters

| Parameter | Required | Description                           |
| --------- | -------- | ------------------------------------- |
| `mn`      | ✅ Yes    | Model name (PascalCase)               |
| `project` | ❌ Yes*   | Project/module name (used in imports) |

> ⚠️ `project` is required if your template uses it (e.g., for Go module imports).

---

### 📌 Example

```bash id="qz91la"
make controller mn=Product project=github.com/yourusername/yourapp
```

---

### 📂 Output

This will generate:

```id="m8sd2w"
controllers/product_controller.go
```

---

### 🧾 Generated Code Example

```go id="w5n2bt"
package controllers

import (
	"github.com/yourusername/yourapp/models"
)

type ProductController struct {}
```

> The actual content depends on your template file.

---

### ⚙️ How It Works

1. Validates that `mn` (model name) is provided.
2. Displays a loading animation.
3. Creates the `controllers/` directory if it doesn't exist.
4. Converts the model name to `snake_case` for the filename.

   * Example: `ProductItem` → `product_item_controller.go`
5. Uses a template file:

   ```
   makesrc/controller.go.txt
   ```
6. Replaces placeholders:

   * `{mn}` → Model name
   * `{project}` → Project/module name
7. Saves the generated file to:

   ```
   controllers/<snake_case_model>_controller.go
   ```

---

### 🧱 Template Requirement

Ensure you have a template file at:

```id="v9ap8k"
makesrc/controller.go.txt
```

Example template:

```go id="y7l3de"
package controllers

import (
	"{project}/models"
)

type {mn}Controller struct {}
```

---

### ⚠️ Notes

* Model name must be in **PascalCase**
* File name is automatically converted to **snake_case**
* Existing controller files with the same name will be overwritten
* Make sure your `{project}` matches your `go.mod` module path

---

### ✅ Quick Tips

* Keep controller names aligned with models (`ProductController`, `UserController`)
* Extend your template with:
  * CRUD handlers
  * Request validation
  * Service layer integration
* Combine with your `make model` command for faster scaffolding


