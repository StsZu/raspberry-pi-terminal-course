# Урок 14 — 14-денний план практики

## Про що цей урок

Структурований план на 2 тижні: від першого SSH до **Python service з автозапуском**. Кожен день — 20–30 хвилин, максимум 5–7 команд, 3 вправи, 1 контрольне питання.

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

---

## Як проходити план

- Один день = одна сесія, не поспішай
- Виконуй всі 3 вправи — теорія без практики не працює
- Відповідай письмово на контрольне питання (нотатки, README проєкту)
- У День 14 маєш працюючий `my-service` з `enable` і логами в journalctl

---

## День 1: SSH і орієнтація

**Команди:** `ping`, `ssh`, `whoami`, `hostname`, `pwd`, `exit`

**Вправи:**
1. З Mac: ping Pi, потім SSH.
2. На Pi: `whoami`, `hostname`, `pwd` — запиши в нотатки.
3. `exit`, зайди знову через IP замість `.local`.

**Контрольне питання:** Що перевірити, якщо `ssh` дає `Connection refused`?

---

## День 2: Навігація і створення проєкту

**Команди:** `ls`, `ls -la`, `cd`, `mkdir`, `touch`, `nano`

**Вправи:**
1. `mkdir -p ~/projects/day2-test`, `cd` туди.
2. `touch notes.txt`, відкрий у `nano`, збережи рядок з датою.
3. `ls -la` — поясни різницю `.` і `..`.

**Контрольне питання:** Де знаходиться твоя домашня папка в абсолютному шляху?

---

## День 3: Робота з файлами

**Команди:** `cp`, `mv`, `rm`, `cat`, `less`

**Вправи:**
1. Скопіюй `notes.txt` → `notes.bak`.
2. Перейменуй `notes.txt` → `journal.txt` через `mv`.
3. Прочитай через `less journal.txt`. Видали `notes.bak` через `rm` (один файл).

**Контрольне питання:** Чим `rm` відрізняється від `rm -rf`?

---

## День 4: PATH і пошук команд

**Команди:** `which`, `command -v`, `echo $PATH`, `man`, `history`, `clear`

**Вправи:**
1. `which python3` і `command -v git`.
2. `echo $PATH | tr ':' '\n'`.
3. `man ls`, вийди через `q`.

**Контрольне питання:** Навіщо `which`, якщо команда «not found»?

---

## День 5: Пакети

**Команди:** `sudo apt update`, `sudo apt upgrade`, `sudo apt install`, `apt search`, `apt show`

**Вправи:**
1. `sudo apt update && sudo apt upgrade` (якщо є оновлення).
2. `apt show git` — прочитай опис.
3. `apt search htop` — знайди пакет, встанови: `sudo apt install htop`.

**Контрольне питання:** Чому `update` перед `install`?

---

## День 6: Мережа

**Команди:** `hostname -I`, `ip addr`, `ip route`, `ping`, `curl`

**Вправи:**
1. Запиши IP і default gateway.
2. `ping 8.8.8.8` і `ping google.com`.
3. `curl -I https://example.com`.

**Контрольне питання:** IP ping працює, домен ні — де проблема?

---

## День 7: Стан системи

**Команди:** `free -h`, `df -h`, `uptime`, `vcgencmd measure_temp`, `vcgencmd get_throttled`

**Вправи:**
1. Health-check: temp, throttled, RAM, disk.
2. `du -sh ~/projects`.
3. Запиши baseline — порівняєш пізніше під навантаженням.

**Контрольне питання:** Що означає `throttled` не `0x0`?

---

## День 8: Процеси

**Команди:** `ps aux`, `top`, `pgrep`, `grep`

**Вправи:**
1. `top` 1 хвилину — хто їсть CPU?
2. `ps aux | grep ssh`.
3. `ps aux | grep python` (може бути порожньо — це ок).

**Контрольне питання:** Коли використовувати `kill` замість `systemctl stop`?

---

## День 9: Python і venv

**Команди:** `python3 --version`, `python3 -m venv`, `source .venv/bin/activate`, `pip install`, `deactivate`

**Вправи:**
1. `~/projects/python-service` + venv.
2. `pip install requests`, скрипт з HTTP-запитом.
3. `python3 main.py` у venv, потім `deactivate`.

**Контрольне питання:** Чому venv краще за `pip install` у системний Python?

---

## День 10: GPIO (теорія + pinout)

**Команди:** `pinout`, `gpiodetect`, `gpioinfo`, `ls /dev/gpiochip*`

**Вправи:**
1. `pinout` — знайди 3.3V, GND, GPIO17.
2. `sudo apt install gpiod`, `gpiodetect`.
3. Запиши правила 3.3V — без фізичного підключення.

**Контрольне питання:** Чому GPIO — не «просто дротик»?

---

## День 11: systemd service

**Команди:** `systemctl status`, `enable`, `start`, `journalctl -u`

**Вправи:**
1. Service-файл для Python-скрипта з Дня 9 (свій username).
2. `daemon-reload`, `enable`, `start`, `status`.
3. `journalctl -u my-service -f` — побач 3 цикли логу.

**Контрольне питання:** Навіщо `daemon-reload` після зміни unit-файлу?

---

## День 12: Логи і діагностика

**Команди:** `journalctl -xe`, `dmesg | tail`, `grep`, `systemctl restart`

**Вправи:**
1. Штучна помилка в скрипті — знайди Traceback у journal.
2. Виправ, `restart`, перевір чисті логи.
3. `dmesg | tail -20`.

**Контрольне питання:** Перші дві команди, якщо service failed?

---

## День 13: Git і transfer з Mac

**Команди:** `git clone`, `git status`, `git pull`, `scp`, `rsync`

**Вправи:**
1. Клонуй або ініціалізуй repo в `~/projects`.
2. З Mac: `scp` один файл на Pi.
3. `rsync -av` оновлену папку проєкту.

**Контрольне питання:** Коли `rsync` краще за `scp`?

---

## День 14: Фінальна збірка — автозапуск під ключ

**Команди:** усі з попередніх днів + `sudo reboot`, перевірка після boot

**Вправи:**
1. **Фінальний проєкт:** `~/projects/my-service/` — Python-скрипт у venv, systemd unit з шляхом до venv python:
   ```
   ExecStart=/home/stanislav/projects/my-service/.venv/bin/python3 /home/stanislav/projects/my-service/main.py
   ```
2. `enable`, `start`, перевір `status` і `journalctl -u my-service`.
3. **`sudo reboot`** — почекай 2 хв, SSH знову, перевір що service **active** без ручного start.
4. Огляд [cheatsheet.md](cheatsheet.md) — відмічай команди, які пам'ятаєш.

**Контрольне питання:** Опиши повний шлях від Mac до автозапущеного сервісу на Pi (5–7 кроків).

---

## Після 14 днів

Ти вмієш:
- Підключатись по SSH і діагностувати мережу
- Керувати файлами і пакетами
- Моніторити температуру і throttling Pi
- Запускати Python у venv
- Створювати systemd service з автозапуском
- Читати логи і уникати небезпечних команд

**Наступний крок:** реальний проєкт — датчик, file server, або automation script з Git deploy на Pi.

---

## Міні-чекліст завершення курсу

- [ ] Пройшов усі 14 днів
- [ ] Service стартує після `reboot` без ручного втручання
- [ ] Знаю `vcgencmd get_throttled` і `journalctl -u`
- [ ] Уникаю `rm -rf` і `curl | bash` без перевірки
- [ ] Тримаю [cheatsheet.md](cheatsheet.md) під рукою