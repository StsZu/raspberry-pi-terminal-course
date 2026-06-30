# Урок 10 — Логи і діагностика

## Про що цей урок

Коли service не стартує, Python падає, або Pi поводиться дивно — відповідь у логах. systemd збирає логи сервісів у **journal**. Ядро пише в **dmesg**. Класичні файли — `/var/log/syslog`.

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

---

## Команди

### `journalctl`

| | |
|---|---|
| **Що робить** | Логи systemd (усі сервіси) |
| **Приклад** | `journalctl --since today` |
| **Ризик** | **Низький** |

---

### `journalctl -xe`

| | |
|---|---|
| **Що робить** | Останні записи з поясненнями (зручно після failed service) |
| **Коли** | «Щось зламалось» — перший крок |
| **Приклад** | `journalctl -xe` |
| **Ризик** | **Низький** |

---

### `journalctl -u <service>` / `journalctl -u <service> -f`

| | |
|---|---|
| **Що робить** | Логи конкретного сервісу; `-f` follow |
| **Приклад** | `journalctl -u my-service -f` |
| **Ризик** | **Низький** |

---

### `dmesg` / `dmesg | tail`

| | |
|---|---|
| **Що робить** | Повідомлення ядра: USB, драйвери, GPIO, помилки заліза |
| **Приклад** | `dmesg | tail -50` |
| **Ризик** | **Низький** |

---

### `tail -f /var/log/syslog`

| | |
|---|---|
| **Що робить** | Системний лог у реальному часі (класичний спосіб) |
| **Приклад** | `tail -f /var/log/syslog` |
| **Ризик** | **Низький** |

---

### `grep`

| | |
|---|---|
| **Що робить** | Фільтр рядків за текстом |
| **Коли** | Знайти ERROR, Traceback, failed |
| **Приклад** | `journalctl -u my-service | grep -i error` |
| **Ризик** | **Низький** |

---

## Сценарії діагностики

### Service не стартує

```bash
systemctl status my-service
journalctl -u my-service -n 50
journalctl -u my-service | grep -i error
```

### Помилки Python у service

Шукай `Traceback`, `ModuleNotFoundError`, `PermissionError` у journal.

### Системні / апаратні проблеми

```bash
dmesg | tail -50
journalctl -xe
vcgencmd get_throttled
```

### Лог у реальному часі під час тесту

```bash
journalctl -u my-service -f
```

В іншому SSH-вікні — перезапусти сервіс: `sudo systemctl restart my-service`.

---

## Практичне завдання

1. У `main.py` service додай рядок, що викликає помилку (наприклад `1/0`). Перезапусти service.
2. `journalctl -u my-service -n 20` — знайди Traceback.
3. Виправ помилку, `restart`, перевір логи знову.
4. `dmesg | tail -20` — що останнє писало ядро?
5. `journalctl -xe | tail -30` — є failed units?

---

## Міні-чекліст

- [ ] Перший крок при падінні service: `status` + `journalctl -u`
- [ ] Вмію `journalctl -f` для live-логів
- [ ] Використовую `grep` для пошуку помилок
- [ ] Знаю `dmesg` для проблем заліза/USB