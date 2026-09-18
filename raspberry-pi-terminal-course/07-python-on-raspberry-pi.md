> **Архів (до 2026-09).** Цей Markdown — стара версія уроків і може містити застарілі або хибні твердження. Актуальний курс — `index.html` (уроки, quiz, шпаргалка).

# Урок 7 — Python на Raspberry Pi

## Про що цей урок

Python — основна мова для скриптів, GPIO, автоматизації і AI на Raspberry Pi. Pi 5 має потужний CPU — Python підходить для більшості навчальних і домашніх проєктів. Virtual environment (venv) ізолює залежності проєкту від системи.

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

---

## Команди

### `python3 --version`

| | |
|---|---|
| **Що робить** | Версія Python 3 |
| **Приклад** | `python3 --version` → `Python 3.11.x` |
| **Ризик** | **Низький** |

---

### `python3`

| | |
|---|---|
| **Що робить** | Інтерактивний REPL |
| **Коли** | Швидкий тест коду |
| **Вихід** | `exit()` або `Ctrl+D` |
| **Ризик** | **Низький** |

---

### `python3 script.py`

| | |
|---|---|
| **Що робить** | Запуск скрипта |
| **Приклад** | `python3 main.py` |
| **Помилки** | `ModuleNotFoundError` — немає бібліотеки; `SyntaxError` — помилка в коді |
| **Ризик** | **Низький** |

---

### `pip3 --version` / `pip3 install <package>`

| | |
|---|---|
| **Що робить** | Менеджер пакетів Python |
| **Коли** | Встановити бібліотеку (requests, RPi.GPIO тощо) |
| **Приклад** | `pip3 install requests` |
| **Ризик** | **Низький–середній** (краще в venv, не в системний Python) |

---

### `python3 -m venv .venv`

| | |
|---|---|
| **Що робить** | Створює virtual environment у папці `.venv` |
| **Коли** | Кожен проєкт — окремі залежності |
| **Приклад** | `python3 -m venv .venv` |
| **Ризик** | **Низький** |

---

### `source .venv/bin/activate` / `deactivate`

| | |
|---|---|
| **Що робить** | Увімкнути / вимкнути venv (prompt зміниться на `(.venv)`) |
| **Коли** | Перед `pip install` і запуском скрипта в проєкті |
| **Приклад** | `source .venv/bin/activate` |
| **Ризик** | **Низький** |

---

## Повний сценарій проєкту

```bash
mkdir ~/projects/python-test
cd ~/projects/python-test
python3 -m venv .venv
source .venv/bin/activate
pip install requests
nano main.py
```

**main.py:**

```python
import requests

response = requests.get("https://httpbin.org/get")
print("Status:", response.status_code)
print("Python on Pi 5 works!")
```

```bash
python3 main.py
deactivate
```

---

## Поради для Pi

- Завжди `python3`, не `python` (на старих системах `python` може бути Python 2)
- У systemd service вказуй повний шлях: `/usr/bin/python3` або venv: `/home/stanislav/projects/app/.venv/bin/python3`
- Для GPIO часто потрібен `sudo` або членство в групі `gpio` — залежить від бібліотеки

---

## Практичне завдання

1. Створи `~/projects/python-test` з venv.
2. Активуй venv, встанови `requests`.
3. Напиши скрипт, що виводить `hostname` через `socket` або `requests.get` до httpbin.
4. Запусти скрипт. `deactivate`.
5. `which python3` до і після `activate` — порівняй шляхи.

---

## Міні-чекліст

- [ ] Вмію створити venv і активувати його
- [ ] Встановлюю пакети через `pip` у venv
- [ ] Запускаю скрипт: `python3 main.py`
- [ ] Розумію різницю системного Python і venv