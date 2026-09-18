> **Архів (до 2026-09).** Цей Markdown — стара версія уроків і може містити застарілі або хибні твердження. Актуальний курс — `index.html` (уроки, quiz, шпаргалка).

# Raspberry Pi 5 — практичний курс Terminal

Практичний курс для роботи з Raspberry Pi 5 через Terminal з Mac. Не енциклопедія Linux — а сценарії для реальних задач: SSH, файли, мережа, Python, GPIO, systemd, Git.

**Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.**

## Як користуватися курсом

```bash
cd raspberry-pi-terminal-course
open README.md          # на Mac
nano README.md          # на Raspberry Pi
less README.md          # перегляд у Terminal
```

Проходь уроки по порядку. Після кожного — виконай практичне завдання. Шпаргалку тримай під рукою: [cheatsheet.md](cheatsheet.md).

## Інтерактивний тренажер

Практикуй команди в браузері: [../index.html](../index.html)

## Зміст курсу (14 уроків)

| № | Урок | Файл | Що навчишся |
|---|------|------|-------------|
| 1 | SSH і перший вхід | [01-ssh-and-first-login.md](01-ssh-and-first-login.md) | Підключення до Pi з Mac, перевірка доступності |
| 2 | Основи Terminal | [02-linux-terminal-basics.md](02-linux-terminal-basics.md) | Shell, prompt, PATH, пошук команд |
| 3 | Файли і папки | [03-files-and-folders.md](03-files-and-folders.md) | Створення проєкту, nano, rm vs rm -rf |
| 4 | Пакети і оновлення | [04-packages-and-updates.md](04-packages-and-updates.md) | apt update/upgrade/install |
| 5 | Діагностика мережі | [05-network-diagnostics.md](05-network-diagnostics.md) | IP, ping, DNS, Wi-Fi |
| 6 | Стан системи і процеси | [06-system-status-and-processes.md](06-system-status-and-processes.md) | Температура, RAM, диск, vcgencmd |
| 7 | Python на Raspberry Pi | [07-python-on-raspberry-pi.md](07-python-on-raspberry-pi.md) | venv, pip, запуск скриптів |
| 8 | GPIO і залізо | [08-gpio-and-hardware.md](08-gpio-and-hardware.md) | pinout, gpiod, безпека підключень |
| 9 | systemd-сервіси | [09-systemd-services.md](09-systemd-services.md) | Автозапуск Python-скрипта |
| 10 | Логи і діагностика | [10-logs-and-troubleshooting.md](10-logs-and-troubleshooting.md) | journalctl, dmesg, grep |
| 11 | Git і проєкти | [11-git-and-project-workflow.md](11-git-and-project-workflow.md) | clone, commit, pull |
| 12 | Передача файлів Mac → Pi | [12-file-transfer-mac-to-pi.md](12-file-transfer-mac-to-pi.md) | scp, rsync |
| 13 | Небезпечні команди | [13-dangerous-commands.md](13-dangerous-commands.md) | rm -rf, curl\|bash, reboot |
| 14 | 14-денний план практики | [14-daily-practice-plan.md](14-daily-practice-plan.md) | Від SSH до service з автозапуском |

## Мінімум команд, який варто знати напам'ять

Це ~40 команд для щоденної роботи з Raspberry Pi 5:

```bash
ssh
exit
pwd
ls -la
cd
mkdir
touch
nano
cat
less
cp
mv
rm
sudo apt update
sudo apt upgrade
sudo apt install
ip addr
ip route
hostname -I
ping
curl
systemctl status
journalctl -u
top
ps aux
df -h
free -h
vcgencmd measure_temp
python3
pip3
git status
git pull
git clone
scp
rsync
sudo reboot
sudo shutdown -h now
```

Повний список з поясненнями — у [cheatsheet.md](cheatsheet.md).

## Для кого цей курс

- Mac + Raspberry Pi 5 через SSH
- Домашня автоматизація, file server, VPN, Python, GPIO
- GitHub-проєкти на Pi
- Без зайвої теорії Linux — тільки те, що потрібно в полі

## Рекомендований шлях

1. Уроки 1–3 — база (SSH, навігація, файли)
2. Уроки 4–6 — система і мережа
3. Уроки 7–9 — Python + GPIO + автозапуск
4. Уроки 10–13 — логи, Git, передача файлів, безпека
5. Урок 14 — закріплення за 14 днів

Успіхів. Pi чекає в мережі.