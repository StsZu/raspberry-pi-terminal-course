# Урок 9 — systemd-сервіси

## Про що цей урок

**Service** — програма, якою керує система: старт при завантаженні, автоперезапуск при падінні, логи в journal. **systemd** — менеджер сервісів на Raspberry Pi OS.

**Навіщо автозапуск Python-скрипта:**
- Скрипт працює після reboot без ручного SSH
- Перезапуск при збої (`Restart=always`)
- Централізовані логи через `journalctl`

**Вручну:** `python3 main.py` — зупиниться при закритті SSH (без `screen`/`tmux`). **Service** — працює у фоні як частина системи.

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

---

## Команди systemctl

### `systemctl status <service>`

| | |
|---|---|
| **Що робить** | Стан сервісу: active/inactive, останні логи |
| **Приклад** | `systemctl status my-service` |
| **Ризик** | **Низький** |

---

### `sudo systemctl start|stop|restart <service>`

| | |
|---|---|
| **Що робить** | Запуск / зупинка / перезапуск |
| **Ризик** | **Середній** (зупиняє робочий сервіс) |

---

### `sudo systemctl enable|disable <service>`

| | |
|---|---|
| **Що робить** | Увімкнути / вимкнути автозапуск при boot |
| **Ризик** | **Середній** |

---

### `journalctl -u <service>` / `journalctl -u <service> -f`

| | |
|---|---|
| **Що робить** | Логи сервісу; `-f` — в реальному часі |
| **Приклад** | `journalctl -u my-service -f` |
| **Ризик** | **Низький** |

---

## Приклад service-файлу (користувач stanislav)

Username може бути не `pi`, а твій — наприклад **`stanislav`**. Шляхи в `ExecStart`, `WorkingDirectory` і `User` мають відповідати реальному користувачу.

**Скрипт:** `/home/stanislav/projects/my-service/main.py`

```ini
[Unit]
Description=My Raspberry Pi Python Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/stanislav/projects/my-service/main.py
WorkingDirectory=/home/stanislav/projects/my-service
Restart=always
User=stanislav

[Install]
WantedBy=multi-user.target
```

**main.py (мінімальний приклад):**

```python
import time
while True:
    print("Service running...", flush=True)
    time.sleep(60)
```

---

## Встановлення і запуск

```bash
mkdir -p ~/projects/my-service
nano ~/projects/my-service/main.py
sudo nano /etc/systemd/system/my-service.service
```

Встав вміст service-файлу (з правильним user і шляхами).

```bash
sudo systemctl daemon-reload
sudo systemctl enable my-service
sudo systemctl start my-service
systemctl status my-service
journalctl -u my-service -f
```

`Ctrl+C` — вийти з `-f`, сервіс продовжить працювати.

---

## Типові помилки

| Симптом | Причина |
|---------|---------|
| `failed (code=exited)` | Помилка в Python, неправильний шлях |
| `Permission denied` | Неправильний `User` або права на файл |
| `No such file` | `ExecStart` вказує на неіснуючий файл |
| Сервіс не стартує після reboot | Забули `enable` |

Після зміни `.service` файлу — завжди `sudo systemctl daemon-reload`.

---

## Практичне завдання

1. Створи `~/projects/my-service/main.py` з циклом і `print` кожні 30 сек.
2. Створи `/etc/systemd/system/my-service.service` для **свого** username.
3. `daemon-reload`, `enable`, `start`, `status`.
4. `journalctl -u my-service -f` — побач логи 2 хвилини.
5. `sudo systemctl stop my-service` — переконайся, що зупинився.

---

## Міні-чекліст

- [ ] Розумію різницю ручного запуску і service
- [ ] Вмію створити `.service` файл з правильним User і шляхами
- [ ] Знаю: `daemon-reload` після зміни unit-файлу
- [ ] Вмію `enable`, `start`, `status`, `journalctl -u`