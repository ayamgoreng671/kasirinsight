## 🛣️ Make Command: `make route`

This command automatically **adds CRUD routes** for a given model into your existing `routes/routes.go` file.

It injects route definitions directly under your authentication middleware block.

---

### 🚀 Usage

```bash
make route mn=ModelName
```

---

### 🧩 Parameters

| Parameter | Required | Description             |
| --------- | -------- | ----------------------- |
| `mn`      | ✅ Yes    | Model name (PascalCase) |

---

### 📌 Example

```bash
make route mn=Product
```

---

### 📂 Target File

Routes will be added to:

```bash
routes/routes.go
```

---

### 🧾 Generated Routes

For `mn=Product`, the following routes will be inserted:

```go
auth.POST("/products", controllers.CreateProduct)
auth.GET("/products", controllers.GetAllProducts)
auth.GET("/products/:id", controllers.GetProduct)
auth.PUT("/products/:id", controllers.UpdateProduct)
auth.DELETE("/products/:id", controllers.DeleteProduct)
```

---

### ⚙️ How It Works

1. Validates that `mn` (model name) is provided.
2. Displays a loading animation.
3. Converts model name:

   * `ProductItem` → `product_item`
   * Automatically pluralized → `product_items`
4. Builds a CRUD route block using:

   * `Create<Model>`
   * `GetAll<Model>s`
   * `Get<Model>`
   * `Update<Model>`
   * `Delete<Model>`
5. Checks if routes already exist:

   * Prevents duplicate insertion
6. Searches for this pattern in your file:

   ```go
   auth.Use(...AuthMiddleware...)
   ```
7. Inserts routes **right after that line**
8. Saves changes back to `routes/routes.go`

---

### 🧠 Route Naming Convention

| Operation | Endpoint               | Handler          |
| --------- | ---------------------- | ---------------- |
| Create    | `POST /<plural>`       | `Create<Model>`  |
| Read All  | `GET /<plural>`        | `GetAll<Model>s` |
| Read One  | `GET /<plural>/:id`    | `Get<Model>`     |
| Update    | `PUT /<plural>/:id`    | `Update<Model>`  |
| Delete    | `DELETE /<plural>/:id` | `Delete<Model>`  |

---

### ⚠️ Requirements

Your `routes/routes.go` must contain a middleware block like:

```go
auth.Use(middleware.AuthMiddleware())
```

This is required because the generator inserts routes **after this line**.

---

### ⚠️ Notes

* Model name must be in **PascalCase**
* Route paths are automatically converted to **snake_case plural**
* Simple pluralization rule: adds `"s"` at the end

  * `Category` → `categorys` ❌ (not handled automatically)
* Existing routes will NOT be duplicated
* If `AuthMiddleware` is not found → insertion will fail

---

### ❌ Possible Errors

| Message                                 | Cause                     |
| --------------------------------------- | ------------------------- |
| `❌ Please provide mn`                   | Missing model name        |
| `⚠️ Routes already exist!`              | Routes already added      |
| `❌ Could not find AuthMiddleware block` | Pattern not found in file |

---

### ✅ Quick Tips

* Use consistent naming across:

  * Model → Controller → Route
* Fix plural edge cases manually if needed (`category` → `categories`)
* Combine with:

  ```bash
  make model mn=Product
  make controller mn=Product
  make route mn=Product
  ```

  → Full CRUD setup in seconds 🚀

