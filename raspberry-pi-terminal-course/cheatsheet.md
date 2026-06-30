# Шпаргалка — Raspberry Pi 5 Terminal

Команди з коротким поясненням в один рядок. Деталі — в уроках курсу.

---

## SSH

```bash
ssh user@raspberrypi.local    # підключення до Pi по імені в локальній мережі
ssh user@10.0.0.50            # підключення по IP-адресі
ping raspberrypi.local        # перевірка доступності Pi в мережі
exit                          # вийти з SSH-сесії на Mac
```

---

## Navigation

```bash
pwd                           # поточна папка
cd ~/projects                 # перейти в папку
cd ..                         # на рівень вище
cd ~                          # домашня папка
ls                            # список файлів
ls -la                        # детальний список включно з прихованими
clear                         # очистити екран
```

---

## Files

```bash
mkdir myproject               # створити папку
mkdir -p a/b/c                # вкладені папки
touch file.txt                # створити порожній файл
nano file.txt                 # редагувати файл у Terminal
cat file.txt                  # показати вміст файлу
less file.txt                 # перегляд посторінково
head file.txt                 # перші 10 рядків
tail file.txt                 # останні 10 рядків
tail -f app.log               # лог у реальному часі
cp src dst                    # копіювати файл
cp -r dir1 dir2               # копіювати папку
mv old new                    # перейменувати або перемістити
rm file.txt                   # видалити файл
rm -r folder                  # видалити папку з вмістом
rmdir empty                   # видалити порожню папку
```

---

## Packages

```bash
sudo apt update               # оновити список пакетів з репозиторіїв
sudo apt upgrade              # встановити оновлення пакетів
sudo apt install git          # встановити пакет
sudo apt remove git           # видалити пакет
apt search gpio               # знайти пакет за ключовим словом
apt show git                  # інформація про пакет
apt list --installed          # список встановлених пакетів
```

---

## Network

```bash
hostname -I                   # IP-адреси Pi
ip addr                       # мережеві інтерфейси та адреси
ip route                      # маршрути та default gateway
ping 8.8.8.8                  # перевірка інтернету по IP
ping google.com               # перевірка DNS і мережі
traceroute google.com         # маршрут пакетів до хоста
dig google.com                # DNS-запит
curl https://example.com      # HTTP-запит
wget URL                      # завантажити файл
ss -tulpn                     # відкриті порти та процеси
nmcli device status           # статус Wi-Fi/Ethernet
rfkill list                   # чи заблокований Wi-Fi
```

---

## System status

```bash
uname -a                      # ядро та архітектура
cat /etc/os-release           # версія ОС
uptime                        # час роботи та load average
free -h                       # RAM і swap
df -h                         # вільне місце на дисках
du -sh ~/projects             # розмір папки
vcgencmd measure_temp         # температура CPU Raspberry Pi
vcgencmd get_throttled        # throttling / живлення / перегрів
```

---

## Processes

```bash
top                           # інтерактивний монітор процесів
htop                          # top з зручнішим UI
ps aux                        # список усіх процесів
ps aux | grep python          # знайти процеси Python
pgrep -f main.py              # PID за ім'ям скрипта
kill 1234                     # завершити процес за PID
killall python3               # завершити всі процеси python3
```

---

## Python

```bash
python3 --version             # версія Python
python3 script.py             # запустити скрипт
python3 -m venv .venv         # створити virtual environment
source .venv/bin/activate     # активувати venv
deactivate                    # вийти з venv
pip3 install requests         # встановити пакет Python
pip3 list                     # список встановлених пакетів
```

---

## GPIO

```bash
pinout                        # схема GPIO Raspberry Pi
gpiodetect                    # список GPIO chips
gpioinfo                      # стан ліній GPIO
ls /dev/gpiochip*             # пристрої gpiochip у системі
sudo apt install gpiod        # встановити утиліти libgpiod
```

---

## systemd

```bash
systemctl status my-service   # стан сервісу
sudo systemctl start my-service    # запустити сервіс
sudo systemctl stop my-service     # зупинити сервіс
sudo systemctl restart my-service  # перезапустити сервіс
sudo systemctl enable my-service   # автозапуск при boot
sudo systemctl disable my-service  # вимкнути автозапуск
sudo systemctl daemon-reload       # перечитати unit-файли після змін
```

---

## Logs

```bash
journalctl                    # всі логи systemd
journalctl -xe                # останні логи з поясненнями
journalctl -u my-service      # логи конкретного сервісу
journalctl -u my-service -f     # логи сервісу в реальному часі
dmesg | tail -50              # останні повідомлення ядра
tail -f /var/log/syslog       # системний лог у реальному часі
grep -i error file.log        # знайти рядки з error
```

---

## Git

```bash
git --version                 # версія Git
git clone URL                 # клонувати репозиторій
git status                    # стан робочої копії
git diff                      # зміни до commit
git add .                     # додати всі зміни в staging
git commit -m "msg"           # зафіксувати зміни
git push                      # відправити на remote
git pull                      # отримати оновлення з remote
git log --oneline             # коротка історія commitів
git branch                    # список гілок
git restore file.py           # скасувати зміни у файлі
```

---

## File transfer

```bash
scp file user@pi:~/path/      # копіювати файл на Pi (з Mac)
scp -r dir user@pi:~/path/    # копіювати папку на Pi
rsync -av ./proj/ user@pi:~/proj/  # синхронізувати папку проєкту
```

---

## Danger Zone

```bash
sudo                          # виконати як root — обережно
rm -rf path                   # безповоротне видалення без питань
dd if=img of=/dev/sdX         # запис на диск — перевір of=
mkfs / fdisk / parted         # форматування — втрата даних
chmod -R 777 /path            # небезпечні права рекурсивно
chown -R user /path           # зміна власника рекурсивно
curl URL | bash               # виконати невідомий скрипт з інтернету
wget URL | bash               # те саме через wget
sudo reboot                   # перезавантажити Pi зараз
sudo shutdown -h now          # вимкнути Pi зараз
```

---

## Help

```bash
man ls                        # довідка по команді
apropos network               # знайти команди за ключовим словом
which python3                 # шлях до виконуваного файлу
command -v git                # перевірити наявність команди
echo $PATH                    # папки пошуку програм
history                       # історія команд
```