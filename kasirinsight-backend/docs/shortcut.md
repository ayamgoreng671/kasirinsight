## ⚡ Make Command Shortcuts

To speed up development, this project provides shorthand commands that combine multiple generators into a single command.

---

## 🚀 `make mc` (Model + Controller)

Generates both a **model** and its corresponding **controller** in one command.

### 📌 Usage

```bash
make mc mn=ModelName field=FieldName-type
```

### 🧩 Parameters

| Parameter | Required | Description                         |
| --------- | -------- | ----------------------------------- |
| `mn`      | ✅ Yes    | Model name (PascalCase)             |
| `field`   | ❌ No     | Model fields (same as `make model`) |

---

### 📂 Output

```bash
models/<model>.go
controllers/<model>_controller.go
```

---

### 📌 Example

```bash
make mc mn=Product field=Name-s,Price-f,Stock-i
```

---

### ⚙️ What It Does

* Runs:

  ```bash
  make model mn=Product field=...
  make controller mn=Product
  ```
* Generates:

  * Model struct with fields
  * Controller based on template

---

## 🚀 `make mcr` (Model + Controller + Route)

Generates a full **CRUD setup** including:

* Model
* Controller
* Routes

---

### 📌 Usage

```bash
make mcr mn=ModelName field=FieldName-type project=your_project_name
```

---

### 🧩 Parameters

| Parameter | Required | Description                             |
| --------- | -------- | --------------------------------------- |
| `mn`      | ✅ Yes    | Model name (PascalCase)                 |
| `field`   | ❌ No     | Model fields                            |
| `project` | ⚠️ Yes*  | Required if controller template uses it |

---

### 📂 Output

```bash
models/<model>.go
controllers/<model>_controller.go
routes/routes.go (updated)
```

---

### 📌 Example

```bash
make mcr mn=Product field=Name-s,Price-f project=github.com/yourusername/app
```

---

### ⚙️ What It Does

Runs the following in sequence:

```bash
make model mn=Product field=...
make controller mn=Product project=...
make route mn=Product
```

---

### 🧾 Result

You instantly get:

#### ✅ Model

```go
type Product struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}
```

#### ✅ Controller

```go
type ProductController struct {}
```

#### ✅ Routes

```go
auth.POST("/products", controllers.CreateProduct)
auth.GET("/products", controllers.GetAllProducts)
auth.GET("/products/:id", controllers.GetProduct)
auth.PUT("/products/:id", controllers.UpdateProduct)
auth.DELETE("/products/:id", controllers.DeleteProduct)
```

---

## ⚠️ Notes

* `mc` and `mcr` are **shortcuts** for chaining commands
* They depend on:

  * `make model`
  * `make controller`
  * `make route`
* Existing files may be overwritten
* Route insertion depends on `AuthMiddleware` existing in `routes.go`

---

## ✅ Recommended Workflow

```bash
make mcr mn=Product field=Name-s,Price-f,Stock-i project=your/module
```

→ Full backend CRUD scaffold in seconds 🚀

