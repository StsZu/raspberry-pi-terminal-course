window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.cheatsheet = {
  sections: [
    { title: "SSH і перший вхід (на Mac)", rows: [
      { cmd: "ping raspberrypi.local", desc: "Чи Pi в мережі (mDNS); `Ctrl+C` — зупинити", risk: "low" },
      { cmd: "ping 10.0.0.50", desc: "Те саме за IP, якщо `.local` не знаходиться", risk: "low" },
      { cmd: "ssh stanislav@raspberrypi.local", desc: "Увійти на Pi; запрошення зміниться на `stanislav@raspberrypi:~ $`", risk: "low" },
      { cmd: "ssh stanislav@10.0.0.50", desc: "Вхід за IP-адресою", risk: "low" },
      { cmd: "exit", desc: "Закрити SSH-сесію й повернутися в Terminal Mac", risk: "low" },
      { cmd: "ssh-copy-id stanislav@raspberrypi.local", desc: "Додати SSH-ключ Mac на Pi — вхід без пароля", risk: "medium" }
    ] },
    { title: "Основи bash і довідка", rows: [
      { cmd: "whoami", desc: "Поточний користувач", risk: "low" },
      { cmd: "hostname", desc: "Ім'я комп'ютера — на Pi чи на Mac я зараз", risk: "low" },
      { cmd: "pwd", desc: "Де я зараз", risk: "low" },
      { cmd: "echo $SHELL", desc: "Яка оболонка (на Pi зазвичай `/bin/bash`)", risk: "low" },
      { cmd: "which python3", desc: "Який файл запуститься за командою", risk: "low" },
      { cmd: "command -v git", desc: "Чи є команда в PATH (зручно в скриптах)", risk: "low" },
      { cmd: "echo $PATH | tr ':' '\\n'", desc: "PATH по одній папці на рядок", risk: "low" },
      { cmd: "man ls", desc: "Довідка до команди (`q` — вихід)", risk: "low" },
      { cmd: "apropos network", desc: "Знайти команду за словом в описі", risk: "low" },
      { cmd: "history", desc: "Попередні команди; стрілка ↑ — повторити", risk: "low" },
      { cmd: "clear", desc: "Очистити екран", risk: "low" }
    ] },
    { title: "Файли і папки", rows: [
      { cmd: "ls -la", desc: "Детальний список з прихованими файлами", risk: "low" },
      { cmd: "cd ~/projects / cd .. / cd ~", desc: "Увійти / вище / додому (`/home/stanislav`)", risk: "low" },
      { cmd: "mkdir -p ~/projects/led-test", desc: "Створити папку разом із проміжними", risk: "medium" },
      { cmd: "touch main.py", desc: "Створити порожній файл", risk: "medium" },
      { cmd: "nano main.py", desc: "Редагувати: `Ctrl+O` — зберегти, `Ctrl+X` — вийти", risk: "medium" },
      { cmd: "cat main.py / less main.py", desc: "Показати файл / гортати (`q` — вихід)", risk: "low" },
      { cmd: "head -5 main.py / tail -5 main.py", desc: "Перші / останні рядки", risk: "low" },
      { cmd: "tail -f app.log", desc: "Стежити за новими рядками; `Ctrl+C` — вийти", risk: "low" },
      { cmd: "cp main.py main.py.bak", desc: "Копія файлу (перезаписує без питань)", risk: "medium" },
      { cmd: "mv old.py new.py", desc: "Перейменувати або перенести", risk: "medium" },
      { cmd: "rmdir empty", desc: "Видалити лише порожню папку", risk: "medium" },
      { cmd: "rm file.txt", desc: "Видалити файл назавжди — кошика немає", risk: "high" },
      { cmd: "rm -r folder", desc: "Видалити папку з усім вмістом", risk: "high" },
      { cmd: "rm -rf folder", desc: "Те саме без жодних питань — лише після `pwd` і `ls`", risk: "high" }
    ] },
    { title: "Пакети apt", rows: [
      { cmd: "sudo apt update", desc: "Оновити списки пакетів (нічого не встановлює)", risk: "low" },
      { cmd: "sudo apt upgrade", desc: "Встановити нові версії встановлених пакетів", risk: "medium" },
      { cmd: "sudo apt full-upgrade", desc: "Оновлення, що може видаляти й замінювати залежності", risk: "medium" },
      { cmd: "sudo apt install git", desc: "Встановити пакет із залежностями", risk: "medium" },
      { cmd: "apt search gpio", desc: "Знайти пакет за словом", risk: "low" },
      { cmd: "apt show git", desc: "Опис і версія пакета", risk: "low" },
      { cmd: "apt list --installed", desc: "Що встановлено", risk: "low" },
      { cmd: "sudo apt remove пакет", desc: "Видалити програму (конфіги лишаються)", risk: "medium" },
      { cmd: "sudo apt purge пакет", desc: "Видалити програму разом з конфігами", risk: "medium" }
    ] },
    { title: "Мережа", rows: [
      { cmd: "hostname -I", desc: "IP-адреси Pi одним рядком", risk: "low" },
      { cmd: "ip addr", desc: "Інтерфейси `eth0`/`wlan0`, адреси, стан UP/DOWN", risk: "low" },
      { cmd: "ip route", desc: "Маршрути; `default via 10.0.0.254` — роутер", risk: "low" },
      { cmd: "ping 8.8.8.8 / ping google.com", desc: "Інтернет за IP / перевірка DNS", risk: "low" },
      { cmd: "curl -I https://example.com", desc: "Лише HTTP-заголовки — чи доступний сайт", risk: "low" },
      { cmd: "ss -tulpn", desc: "Які порти слухають і які процеси", risk: "low" },
      { cmd: "nmcli device status", desc: "Стан Wi-Fi та Ethernet (NetworkManager)", risk: "low" },
      { cmd: "rfkill list", desc: "Чи не заблоковано Wi-Fi/Bluetooth", risk: "low" }
    ] },
    { title: "Стан системи і процеси", rows: [
      { cmd: "uname -a", desc: "Ядро й архітектура (`aarch64`)", risk: "low" },
      { cmd: "cat /etc/os-release", desc: "Версія ОС: Debian 13 (trixie) — поточна Raspberry Pi OS; 12 (bookworm) — попередня", risk: "low" },
      { cmd: "uptime", desc: "Час роботи й навантаження", risk: "low" },
      { cmd: "vcgencmd measure_temp", desc: "Температура процесора", risk: "low" },
      { cmd: "vcgencmd get_throttled", desc: "`0x0` — без проблем; інше — були недостатнє живлення чи перегрів", risk: "low" },
      { cmd: "free -h", desc: "Пам'ять; дивись на `available`", risk: "low" },
      { cmd: "df -h", desc: "Вільне місце на дисках", risk: "low" },
      { cmd: "du -sh ~/projects", desc: "Розмір папки", risk: "low" },
      { cmd: "ps aux | grep python", desc: "Знайти процес і його PID", risk: "low" },
      { cmd: "pgrep -f main.py", desc: "PID процесу за командним рядком", risk: "low" },
      { cmd: "top", desc: "Живий монітор процесів (`q` — вихід)", risk: "low" },
      { cmd: "kill 1234", desc: "Попросити процес завершитися (SIGTERM)", risk: "medium" },
      { cmd: "kill -9 1234", desc: "Примусово вбити процес — без збереження даних", risk: "high" },
      { cmd: "killall python3", desc: "Завершити ВСІ процеси з цим іменем", risk: "high" }
    ] },
    { title: "Python і venv", rows: [
      { cmd: "python3 --version", desc: "Версія Python (залежить від версії ОС)", risk: "low" },
      { cmd: "pip install requests (поза venv)", desc: "У Trixie (як і з Bookworm) — помилка `externally-managed-environment`: системний Python захищено", risk: "low" },
      { cmd: "python3 -m venv .venv", desc: "Створити віртуальне середовище проєкту", risk: "medium" },
      { cmd: "source .venv/bin/activate", desc: "Увімкнути venv — запрошення починається з `(.venv)`", risk: "low" },
      { cmd: "pip install requests", desc: "Встановити бібліотеку всередині активного venv", risk: "medium" },
      { cmd: "deactivate", desc: "Вийти з venv", risk: "low" },
      { cmd: "sudo apt install python3-requests", desc: "Бібліотека для системного Python через apt", risk: "medium" },
      { cmd: "pip install --break-system-packages …", desc: "Обхід захисту: може зламати системні пакети — не роби так", risk: "high" }
    ] },
    { title: "GPIO (логіка 3,3 В)", rows: [
      { cmd: "pinout", desc: "Схема контактів: фізичні номери й номери BCM", risk: "low" },
      { cmd: "pinctrl get 17", desc: "Стан і режим GPIO17 — діагностика на Pi 5", risk: "low" },
      { cmd: "gpiodetect", desc: "Список GPIO-чипів (libgpiod); номер чипа залежить від ядра", risk: "low" },
      { cmd: "gpioinfo", desc: "Лінії GPIO: назви, напрям, хто використовує", risk: "low" },
      { cmd: "ls /dev/gpiochip*", desc: "Пристрої GPIO у системі", risk: "low" },
      { cmd: "gpioset -c gpiochip0 17=1", desc: "Подати 1 на лінію 17 (libgpiod v2 — у Trixie; у v1 на Bookworm — `gpioset gpiochip0 17=1`). Лише з перевіреною схемою", risk: "high" },
      { cmd: "sudo apt install python3-gpiozero", desc: "gpiozero — рекомендована бібліотека; на Pi 5 RPi.GPIO не працює (чип RP1)", risk: "medium" }
    ] },
    { title: "systemd-сервіси", rows: [
      { cmd: "sudo nano /etc/systemd/system/my-service.service", desc: "Створити або змінити unit-файл", risk: "medium" },
      { cmd: "sudo systemctl daemon-reload", desc: "Перечитати unit-файли після змін", risk: "medium" },
      { cmd: "systemctl status my-service", desc: "Стан, автозапуск (`enabled`), останні рядки логу", risk: "low" },
      { cmd: "sudo systemctl start my-service", desc: "Запустити зараз (автозапуск не змінює)", risk: "medium" },
      { cmd: "sudo systemctl stop my-service", desc: "Зупинити свій сервіс", risk: "medium" },
      { cmd: "sudo systemctl restart my-service", desc: "Перезапустити, щоб підхопити новий код", risk: "medium" },
      { cmd: "sudo systemctl enable my-service", desc: "Лише автозапуск при старті — сам не запускає", risk: "medium" },
      { cmd: "sudo systemctl enable --now my-service", desc: "Увімкнути автозапуск і одразу запустити", risk: "medium" },
      { cmd: "sudo systemctl disable my-service", desc: "Прибрати автозапуск", risk: "medium" },
      { cmd: "sudo systemctl stop ssh", desc: "Зупинити SSH — обірве доступ до Pi по мережі", risk: "high" }
    ] },
    { title: "Логи", rows: [
      { cmd: "journalctl -u my-service -n 50", desc: "Останні 50 рядків логу сервісу", risk: "low" },
      { cmd: "journalctl -u my-service -f", desc: "Лог наживо; `Ctrl+C` — вийти", risk: "low" },
      { cmd: "journalctl -xe", desc: "Останні системні записи з поясненнями", risk: "low" },
      { cmd: "journalctl --since today", desc: "Усе за сьогодні", risk: "low" },
      { cmd: "journalctl -u my-service | grep -i error", desc: "Лише рядки з error (без урахування регістру)", risk: "low" },
      { cmd: "dmesg | tail -50", desc: "Повідомлення ядра: USB, диски, живлення", risk: "low" }
    ] },
    { title: "Git і передача файлів", rows: [
      { cmd: "git clone https://github.com/stas/led-test.git", desc: "Отримати репозиторій", risk: "medium" },
      { cmd: "git status / git diff", desc: "Що змінено і які саме рядки", risk: "low" },
      { cmd: "git add . && git commit -m \"…\"", desc: "Зафіксувати зміни локально", risk: "medium" },
      { cmd: "git pull / git push", desc: "Забрати / відправити коміти", risk: "medium" },
      { cmd: "git log --oneline", desc: "Коротка історія", risk: "low" },
      { cmd: "git restore main.py", desc: "Викинути незакомічені правки у файлі — безповоротно", risk: "medium" },
      { cmd: "scp main.py stanislav@raspberrypi.local:~/projects/led-test/", desc: "З Mac: скопіювати файл на Pi", risk: "medium" },
      { cmd: "scp -r led-test stanislav@raspberrypi.local:~/projects/", desc: "З Mac: скопіювати папку", risk: "medium" },
      { cmd: "rsync -av ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", desc: "З Mac: синхронізувати лише зміни; слеш у кінці — вміст папки", risk: "medium" },
      { cmd: "rsync -av --dry-run --delete ./src/ …", desc: "Показати, що буде скопійовано й видалено, нічого не змінюючи", risk: "low" },
      { cmd: "rsync -av --delete ./src/ …", desc: "Видаляє на Pi все, чого немає на Mac", risk: "high" }
    ] },
    { title: "Небезпечні команди", rows: [
      { cmd: "sudo …", desc: "Права root — лише для apt, systemctl, `/etc`, коли розумієш команду", risk: "medium" },
      { cmd: "chmod -R 777 шлях", desc: "Відкриває все всім — замість цього `chmod 644`/`755` на конкретний файл", risk: "high" },
      { cmd: "sudo chown -R … /", desc: "Зміна власника системних файлів ламає сервіси", risk: "high" },
      { cmd: "curl -fsSL URL | bash", desc: "Виконує скрипт не читаючи; безпечніше: `-o install.sh` → `less` → `bash`", risk: "high" },
      { cmd: "lsblk", desc: "Диски й розділи — перша команда перед будь-якою роботою з дисками", risk: "low" },
      { cmd: "Raspberry Pi Imager", desc: "Рекомендований Raspberry Pi спосіб записати образ ОС на SD/SSD (програма на Mac)", risk: "medium", outsideTrainer: true },
      { cmd: "sudo dd if=… of=/dev/…", desc: "Переписує весь пристрій; помилка в `of=` стирає інший диск", risk: "high" },
      { cmd: "sudo mkfs.ext4 /dev/sda1", desc: "Форматує розділ — усі дані зникають", risk: "high" },
      { cmd: "sudo fdisk /dev/sda", desc: "Змінює таблицю розділів", risk: "high" },
      { cmd: "sudo reboot", desc: "Негайне перезавантаження — обриває SSH", risk: "high" },
      { cmd: "sudo shutdown -h now", desc: "Вимкнення — увімкнути знову лише фізично", risk: "high" },
      { cmd: "sudo shutdown -r +5", desc: "Перезавантаження через 5 хвилин з попередженням", risk: "medium" },
      { cmd: "sudo shutdown -c", desc: "Скасувати заплановане вимкнення", risk: "low" }
    ] }
  ]
};
