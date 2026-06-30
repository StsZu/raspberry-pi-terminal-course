# Урок 12 — Передача файлів Mac → Raspberry Pi

## Про що цей урок

Код пишеш на Mac — запускаєш на Pi. Треба вміти копіювати файли і папки через мережу без флешки. Два основні інструменти: **scp** (просте копіювання) і **rsync** (синхронізація з дельтою).

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

---

## scp vs rsync

| | scp | rsync |
|---|-----|-------|
| Призначення | Разове копіювання | Синхронізація, повторні передачі |
| Швидкість при повторі | Копіює все знову | Передає тільки зміни |
| Складність | Простіше | Більше опцій (`-a`, `-v`, `--delete`) |
| Коли | Один файл, невелика папка | Проєкт, який часто оновлюєш |

Обидві команди виконуються **на Mac** (з локальної папки на Pi через SSH).

---

## Команди на Mac

### `scp file.txt user@host:/path/`

| | |
|---|---|
| **Що робить** | Копіює один файл на Pi |
| **Приклад** | `scp main.py stanislav@raspberrypi.local:/home/stanislav/projects/test/` |
| **Ризик** | **Низький** |

---

### `scp -r folder user@host:/path/`

| | |
|---|---|
| **Що робить** | Рекурсивно копіює папку |
| **Приклад** | `scp -r myapp stanislav@raspberrypi.local:/home/stanislav/projects/` |
| **Ризик** | **Низький** |

---

### `rsync -av source/ user@host:/dest/`

| | |
|---|---|
| **Що робить** | Синхронізує папки (`-a` archive, `-v` verbose) |
| **Приклад** | `rsync -av ./project/ stanislav@raspberrypi.local:/home/stanislav/projects/project/` |
| **Ризик** | **Низький**; **середній** з `--delete` (видаляє зайве на destination) |

**Слеш важливий:** `project/` — вміст папки; `project` — сама папка.

---

### `ssh user@host`

| | |
|---|---|
| **Що робить** | Підключення для перевірки після копіювання |
| **Ризик** | **Низький** |

---

## Команди на Raspberry Pi (перевірка)

```bash
pwd
ls -la
mkdir -p ~/projects/test
cat main.py
```

---

## Повний сценарій

**На Mac:**

```bash
cd ~/my-project
scp main.py stanislav@raspberrypi.local:/home/stanislav/projects/test/
rsync -av ./project/ stanislav@raspberrypi.local:/home/stanislav/projects/project/
ssh stanislav@raspberrypi.local
```

**На Pi:**

```bash
ls -la ~/projects/test/
cat ~/projects/test/main.py
python3 ~/projects/test/main.py
```

---

## Поради

- Переконайся, що папка на Pi існує: `mkdir -p ~/projects/test` (на Pi) або rsync створить шлях
- Для великих проєктів додай `--exclude '.venv'` і `--exclude '__pycache__'`
- SSH keys (`ssh-copy-id`) — без пароля при кожному scp/rsync

---

## Практичне завдання

1. На Mac створи `test-transfer.txt` з одним рядком тексту.
2. На Pi: `mkdir -p ~/projects/transfer-test`.
3. `scp test-transfer.txt stanislav@raspberrypi.local:~/projects/transfer-test/`
4. На Pi: `cat ~/projects/transfer-test/test-transfer.txt`.
5. Зміни файл на Mac, `rsync -av` знову — переконайся, що оновилось.

---

## Міні-чекліст

- [ ] Розрізняю `scp` і `rsync`
- [ ] Вмію копіювати файл і папку (`-r`)
- [ ] Після transfer перевіряю через `ls` і `cat` на Pi