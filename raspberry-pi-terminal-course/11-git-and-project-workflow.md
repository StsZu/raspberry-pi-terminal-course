# Урок 11 — Git і робочий процес з проєктами

## Про що цей урок

Git на Raspberry Pi — клонування проєктів з GitHub, оновлення коду, фіксація змін. Pi може бути і dev-машиною, і «продакшн»-вузлом для скриптів і сервісів.

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

---

## Команди

### `git --version`

| | |
|---|---|
| **Що робить** | Перевірка наявності Git |
| **Приклад** | `git --version` |
| **Ризик** | **Низький** |

Якщо немає: `sudo apt install git`

---

### `git clone <repo>`

| | |
|---|---|
| **Що робить** | Копіює репозиторій з GitHub/GitLab |
| **Приклад** | `git clone https://github.com/user/project.git` |
| **Помилки** | `Authentication failed` — потрібен SSH key або token |
| **Ризик** | **Низький** |

---

### `git status`

| | |
|---|---|
| **Що робить** | Змінені / нові / staged файли |
| **Коли** | Перед commit, після редагування |
| **Приклад** | `git status` |
| **Ризик** | **Низький** |

---

### `git diff`

| | |
|---|---|
| **Що робить** | Показує зміни в коді (до commit) |
| **Коли** | Перевірити, що саме змінилось |
| **Приклад** | `git diff` |
| **Ризик** | **Низький** |

---

### `git add .` / `git commit -m "message"`

| | |
|---|---|
| **Що робить** | Додати файли в staging / зафіксувати зміни |
| **Приклад** | `git add .` → `git commit -m "Fix sensor reading"` |
| **Ризик** | **Низький** (локально); **середній** при push у спільний repo |

---

### `git push` / `git pull`

| | |
|---|---|
| **Що робить** | Відправити / отримати зміни з remote |
| **Приклад** | `git pull`, `git push` |
| **Помилки** | Конфлікт merge — треба вирішити вручну |
| **Ризик** | **Середній** |

---

### `git log --oneline` / `git branch`

| | |
|---|---|
| **Що робить** | Історія commitів / список гілок |
| **Приклад** | `git log --oneline -10` |
| **Ризик** | **Низький** |

---

### `git restore <file>`

| | |
|---|---|
| **Що робить** | Скасувати незакомічені зміни у файлі |
| **Приклад** | `git restore main.py` |
| **Ризик** | **Середній** (втратиш незбережені зміни у tracked файлі) |

---

## Типовий workflow на Pi

```bash
mkdir ~/projects
cd ~/projects
git clone https://github.com/user/project.git
cd project
git status
git pull
```

Після редагування на Pi:

```bash
git diff
git add .
git commit -m "Update config for Pi 5"
git push
```

---

## Pi як production-вузол

1. `git pull` на Pi після push з Mac
2. `sudo systemctl restart my-service` — підхопити новий код
3. `journalctl -u my-service -f` — перевірити

---

## Практичне завдання

1. `sudo apt install git` (якщо потрібно).
2. Створи тестовий repo на GitHub (або клонуй публічний).
3. `git clone` у `~/projects`.
4. Зміни один файл, `git diff`, `git status`.
5. `git add .`, `git commit -m "Test from Pi"`, `git push` (якщо є доступ).

---

## Міні-чекліст

- [ ] Вмію `clone`, `status`, `pull`
- [ ] Перед commit дивлюсь `git diff`
- [ ] Розумію зв'язок Git + systemd restart