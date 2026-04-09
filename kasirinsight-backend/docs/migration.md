## 🗄️ Database Migration Commands

This project uses the golang-migrate CLI to manage database schema changes with MySQL.

---

## ⚙️ Configuration

### 🔗 Database URL

```bash id="dburl01"
DB_URL=mysql://root@tcp(127.0.0.1:3306)/gin_db?charset=utf8mb4&parseTime=True&loc=Local
```

> Make sure your database is running and accessible before running migrations.

---

## 🚀 `make migrate-create`

Creates a new migration file and automatically generates a **basic table schema template**.

---

### 📌 Usage

```bash id="migcrt01"
make migrate-create name=create_users_table
```

---

### 🧩 Parameters

| Parameter | Required | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `name`    | ✅ Yes    | Migration name (use `create_<table>_table` convention) |

---

### 📂 Output

```bash id="migcrt02"
migrations/
├── 000001_create_users_table.up.sql
├── 000001_create_users_table.down.sql
```

---

### 🧾 Generated Template

#### Up Migration

```sql id="migcrt03"
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_users_deleted_at` (`deleted_at`)
);
```

#### Down Migration

```sql id="migcrt04"
DROP TABLE `users`;
```

---

### ⚙️ How It Works

1. Runs:

   ```bash
   migrate create -ext sql -dir migrations -seq <name>
   ```
2. Extracts table name from:

   ```
   create_<table>_table
   ```
3. Converts table name to **snake_case**
4. Auto-generates:

   * `id` (primary key)
   * timestamps (`created_at`, `updated_at`)
   * soft delete column (`deleted_at`)
   * index for `deleted_at`
5. Writes:

   * `.up.sql` → CREATE TABLE
   * `.down.sql` → DROP TABLE

---

### ⚠️ Notes

* Naming must follow:

  ```bash id="migcrt05"
  create_<table>_table
  ```
* Example:

  * `create_user_profiles_table`
* If naming is inconsistent → table name extraction may fail

---

## ⬆️ `make migrate-up`

Applies all pending migrations to the database.

---

### 📌 Usage

```bash id="migup01"
make migrate-up
```

---

### ⚙️ What It Does

```bash id="migup02"
migrate -path migrations -database "$(DB_URL)" up
```

* Runs all unapplied `.up.sql` files
* Updates migration version history

---

## ⬇️ `make migrate-down`

Rolls back the **last migration**.

---

### 📌 Usage

```bash id="migdown01"
make migrate-down
```

---

### ⚙️ What It Does

```bash id="migdown02"
migrate -path migrations -database "$(DB_URL)" down 1
```

* Reverts the most recent migration using `.down.sql`

---

## 🧠 Migration Workflow

```bash id="migflow01"
# 1. Create migration
make migrate-create name=create_products_table

# 2. Edit migration if needed
# (add columns, constraints, etc.)

# 3. Apply migration
make migrate-up

# 4. Rollback if needed
make migrate-down
```

---

## ⚠️ Common Errors

| Error                  | Cause                               |
| ---------------------- | ----------------------------------- |
| `unknown driver mysql` | Missing MySQL driver in migrate CLI |
| `no change`            | No new migrations to apply          |
| connection refused     | Database not running / wrong DB_URL |

---

## ✅ Quick Tips

* Always review generated SQL before running `migrate-up`
* Use meaningful table names
* Add indexes & constraints manually as needed
* Keep migrations **small and incremental**

---

## 🔧 Requirements

Make sure you have installed:

* golang-migrate CLI
* MySQL database running locally or remotely
