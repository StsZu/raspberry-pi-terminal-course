"use strict";
/* Raspberry Pi 5 Terminal Trainer — емуляція bash на Pi і zsh на Mac без реального виконання.
   Контекст явний: до `ssh` ти на Mac, після — на Pi, `exit` повертає на Mac.
   Зарахування команд — лише повний збіг після нормалізації (див. matches). */

const STORAGE_KEY = "cli-raspberry-pi-v1-trainer";
const PI_HOME = "/home/stanislav";
const MAC_HOME = "/Users/Stas";
const PROJ = PI_HOME + "/projects";
const LED = PROJ + "/led-test";
const PI_IP = "10.0.0.50";
const ROUTER = "10.0.0.254";
const GOAL = "Головна мета — не вивчити всі команди, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.";

// Пункти чекліста: [команда, підказка]. Підказка — також питання тест-режиму, тому вона однозначна.
// ctx — де стартує розділ: "mac" (Terminal на Mac) або "pi" (SSH-сесія вже відкрита); cwd — стартова папка на Pi.
const MODULE_LIST = [
  { id: "ssh", ctx: "mac", title: "1. SSH і перший вхід", intro: "З Mac: перевірити, що Pi в мережі, увійти по SSH, зорієнтуватися і вийти.", commands: [
    ["ping -c 3 raspberrypi.local", "На Mac: надіслати 3 пакети ping на Pi за іменем raspberrypi.local."],
    ["ping -c 3 10.0.0.50", "На Mac: надіслати 3 пакети ping на Pi за IP-адресою 10.0.0.50."],
    ["ssh stanislav@raspberrypi.local", "Підключитися з Mac до Pi користувачем stanislav за іменем raspberrypi.local."],
    ["hostname", "Показати ім'я комп'ютера, на якому ти зараз (Mac чи Pi?)."],
    ["whoami", "Показати ім'я поточного користувача."],
    ["pwd", "Показати повний шлях до поточної папки."],
    ["exit", "Закрити SSH-сесію і повернутися в Terminal Mac."],
    ["ssh stanislav@10.0.0.50", "Підключитися з Mac до Pi користувачем stanislav за IP-адресою."]
  ] },
  { id: "basics", ctx: "pi", title: "2. Основи bash", intro: "Shell, PATH, історія і довідка — орієнтація на Pi.", commands: [
    ["echo $SHELL", "Показати шлях до поточної оболонки (на Pi — /bin/bash)."],
    ["clear", "Очистити екран терміналу."],
    ["history", "Показати список раніше введених команд."],
    ["which python3", "Дізнатися, який файл запуститься за командою python3."],
    ["command -v git", "Перевірити наявність git у PATH способом, що працює і в скриптах."],
    ["echo $PATH", "Показати змінну PATH одним рядком."],
    ["echo $PATH | tr ':' '\\n'", "Показати папки з PATH по одній на рядок."],
    ["man ls", "Відкрити повну довідку (manual) до команди ls."],
    ["ls --help", "Показати коротку вбудовану довідку до ls."],
    ["apropos network", "Знайти команди, в описі яких є слово network."]
  ] },
  { id: "files", ctx: "pi", cwd: LED, title: "3. Файли та папки", intro: "Навігація, створення, читання, копіювання й видалення файлів проєкту led-test.", commands: [
    ["pwd", "Показати повний шлях до поточної папки."],
    ["ls", "Короткий список файлів у поточній папці."],
    ["ls -la", "Детальний список з правами, розміром і прихованими файлами."],
    ["cat main.py", "Вивести вміст main.py на екран."],
    ["less main.py", "Переглянути main.py посторінково (q — вихід)."],
    ["head -5 log.txt", "Показати перші 5 рядків log.txt."],
    ["tail -5 log.txt", "Показати останні 5 рядків log.txt."],
    ["tail -f log.txt", "Стежити за новими рядками log.txt у реальному часі."],
    ["nano main.py", "Відкрити main.py у текстовому редакторі nano."],
    ["touch notes.txt", "Створити порожній файл notes.txt."],
    ["cp main.py main.py.bak", "Зробити резервну копію main.py під іменем main.py.bak."],
    ["cp -r folder folder-copy", "Скопіювати папку folder разом із вмістом у folder-copy."],
    ["mv old.txt new.txt", "Перейменувати old.txt на new.txt."],
    ["rm file.txt", "Видалити один файл file.txt (без кошика)."],
    ["rmdir empty", "Видалити порожню папку empty."],
    ["rm -r folder", "Видалити папку folder з усім вмістом."],
    ["rm -rf build", "Примусово видалити папку build без жодних питань."],
    ["cd ..", "Піднятися на одну папку вище."],
    ["cd /etc", "Перейти в системну папку /etc за абсолютним шляхом."],
    ["cd", "Повернутися в домашню папку командою без аргументів."],
    ["mkdir -p ~/projects/demo/src", "Створити вкладені папки demo/src у ~/projects одним рухом."],
    ["cd ~/projects/led-test", "Перейти в папку проєкту led-test з будь-якого місця."]
  ] },
  { id: "packages", ctx: "pi", title: "4. Пакети apt", intro: "update, upgrade, install, search — керування програмами Raspberry Pi OS.", commands: [
    ["sudo apt update", "Оновити списки пакетів з репозиторіїв (нічого не встановлює)."],
    ["sudo apt upgrade", "Встановити нові версії вже встановлених пакетів."],
    ["sudo apt full-upgrade", "Оновлення, яке може додавати й видаляти залежності."],
    ["apt search htop", "Знайти пакет за словом htop."],
    ["apt show htop", "Показати опис і версію пакета htop."],
    ["sudo apt install htop", "Встановити пакет htop."],
    ["apt list --installed", "Показати список встановлених пакетів."],
    ["sudo apt remove htop", "Видалити програму htop, залишивши її налаштування."],
    ["sudo apt purge htop", "Видалити htop разом з файлами налаштувань."]
  ] },
  { id: "network", ctx: "pi", title: "5. Мережа", intro: "IP, шлюз, DNS, порти й Wi-Fi — діагностика «немає інтернету».", commands: [
    ["hostname -I", "Швидко показати IP-адреси Pi."],
    ["ip addr", "Показати мережеві інтерфейси, їхній стан і адреси."],
    ["ip route", "Показати таблицю маршрутизації і шлюз за замовчуванням."],
    ["ping -c 3 10.0.0.254", "Перевірити зв'язок з роутером (3 пакети)."],
    ["ping -c 3 8.8.8.8", "Перевірити вихід в інтернет за IP, без DNS (3 пакети)."],
    ["ping -c 3 google.com", "Перевірити інтернет разом з DNS (3 пакети)."],
    ["curl -I https://example.com", "Отримати лише HTTP-заголовки відповіді сайту."],
    ["ss -tulpn", "Показати порти, які слухають сервіси на Pi."],
    ["nmcli device status", "Показати стан мережевих пристроїв через NetworkManager."],
    ["rfkill list", "Перевірити, чи не заблоковані Wi-Fi і Bluetooth."]
  ] },
  { id: "system", ctx: "pi", title: "6. Стан системи", intro: "Температура, живлення, пам'ять і диск — здоров'я Pi 5.", commands: [
    ["uname -a", "Показати версію ядра Linux і архітектуру."],
    ["cat /etc/os-release", "Показати назву і версію операційної системи."],
    ["uptime", "Показати час роботи і середнє навантаження."],
    ["vcgencmd measure_temp", "Показати температуру процесора Pi."],
    ["vcgencmd get_throttled", "Перевірити, чи були недостатнє живлення або перегрів (throttling)."],
    ["free -h", "Показати використання оперативної пам'яті в зручних одиницях."],
    ["df -h", "Показати вільне місце на дисках."],
    ["du -sh ~/projects", "Показати загальний розмір папки ~/projects."],
    ["lsblk", "Показати диски й розділи (SD-карта, SSD, флешка)."]
  ] },
  { id: "processes", ctx: "pi", title: "7. Процеси", intro: "Знайти процес, подивитися навантаження, коректно завершити.", commands: [
    ["ps aux | grep python", "Знайти запущені процеси Python серед усіх процесів."],
    ["pgrep -f main.py", "Знайти PID процесу, в командному рядку якого є main.py."],
    ["top", "Відкрити інтерактивний монітор процесів (q — вихід)."],
    ["kill 1234", "Попросити процес з PID 1234 коректно завершитися (SIGTERM)."],
    ["kill -9 1234", "Примусово вбити процес 1234 без шансу прибрати за собою."],
    ["killall python3", "Завершити всі процеси з іменем python3."]
  ] },
  { id: "python", ctx: "pi", cwd: LED, title: "8. Python і venv", intro: "Чому pip поза venv блокується і як правильно ставити бібліотеки.", commands: [
    ["python3 --version", "Показати версію Python 3."],
    ["pip3 install requests", "Спробувати встановити пакет поза venv і побачити помилку externally-managed-environment."],
    ["python3 -m venv .venv", "Створити віртуальне середовище в папці .venv."],
    ["source .venv/bin/activate", "Активувати віртуальне середовище .venv."],
    ["pip install requests", "Встановити бібліотеку requests всередині активного venv."],
    ["python3 main.py", "Запустити скрипт main.py."],
    ["deactivate", "Вийти з віртуального середовища."],
    ["sudo apt install python3-requests", "Встановити requests для системного Python з репозиторію apt."]
  ] },
  { id: "gpio", ctx: "pi", cwd: LED, title: "9. GPIO та залізо", intro: "pinout, pinctrl, libgpiod і gpiozero. Логіка 3,3 В — спершу схема, потім дроти.", commands: [
    ["pinout", "Показати схему контактів GPIO цієї плати."],
    ["pinctrl get 17", "Подивитися поточний режим і рівень GPIO17 (діагностика на Pi 5)."],
    ["gpiodetect", "Показати список GPIO-чіпів (libgpiod)."],
    ["gpioinfo", "Показати лінії GPIO: назви, напрям, хто використовує."],
    ["ls /dev/gpiochip*", "Показати файли пристроїв GPIO-чіпів у /dev."],
    ["cat blink.py", "Подивитися приклад блимання світлодіодом на gpiozero."],
    ["python3 blink.py", "Запустити приклад blink.py на gpiozero."],
    ["gpioset -c gpiochip0 17=1", "Подати 1 на лінію 17 чіпа gpiochip0 (синтаксис libgpiod v2)."]
  ] },
  { id: "systemd", ctx: "pi", title: "10. systemd-сервіси", intro: "Свій скрипт як сервіс: enable ≠ start, enable --now = обидва.", commands: [
    ["sudo nano /etc/systemd/system/my-service.service", "Відкрити unit-файл сервісу my-service для редагування."],
    ["sudo systemctl daemon-reload", "Перечитати unit-файли після зміни."],
    ["systemctl status my-service", "Показати стан сервісу my-service і останні рядки логу."],
    ["sudo systemctl enable my-service", "Увімкнути автозапуск my-service при завантаженні (без запуску зараз)."],
    ["sudo systemctl start my-service", "Запустити my-service зараз."],
    ["sudo systemctl enable --now my-service", "Увімкнути автозапуск і одразу запустити my-service однією командою."],
    ["systemctl is-enabled my-service", "Перевірити, чи ввімкнено автозапуск my-service."],
    ["sudo systemctl restart my-service", "Перезапустити my-service (підхопити новий код)."],
    ["sudo systemctl stop my-service", "Зупинити my-service зараз."],
    ["sudo systemctl disable my-service", "Вимкнути автозапуск my-service при завантаженні."]
  ] },
  { id: "logs", ctx: "pi", title: "11. Логи та діагностика", intro: "journalctl і dmesg: знайти, чому сервіс упав.", commands: [
    ["journalctl -u my-service", "Показати весь журнал сервісу my-service."],
    ["journalctl -u my-service -n 50", "Показати останні 50 рядків журналу my-service."],
    ["journalctl -u my-service -f", "Стежити за журналом my-service у реальному часі."],
    ["journalctl -u my-service | grep -i error", "Відфільтрувати з журналу my-service рядки з error будь-яким регістром."],
    ["journalctl -xe", "Показати останні записи системного журналу з поясненнями."],
    ["journalctl --since today", "Показати записи журналу за сьогодні."],
    ["sudo dmesg | tail -50", "Показати останні 50 повідомлень ядра."]
  ] },
  { id: "git", ctx: "pi", cwd: PROJ, title: "12. Git на Pi", intro: "Клонувати, оновити, зафіксувати зміни — Pi як робочий вузол.", commands: [
    ["git --version", "Перевірити, що Git встановлено, і його версію."],
    ["git clone https://github.com/stas/weather-station.git", "Клонувати репозиторій weather-station з GitHub."],
    ["cd weather-station", "Перейти в папку клонованого репозиторію."],
    ["git status", "Показати стан робочої папки Git."],
    ["nano config.py", "Відредагувати config.py у nano."],
    ["git diff", "Показати незакомічені зміни."],
    ["git add .", "Додати всі зміни в поточній папці до staging."],
    ["git commit -m \"Update config\"", "Зафіксувати staged-зміни з повідомленням Update config."],
    ["git push", "Відправити коміти на GitHub."],
    ["git pull", "Отримати нові коміти з GitHub."],
    ["git log --oneline", "Показати коротку історію комітів."],
    ["git restore config.py", "Скасувати незакомічені зміни в config.py."]
  ] },
  { id: "transfer", ctx: "mac", title: "13. Передача файлів Mac → Pi", intro: "scp і rsync запускаються на Mac, а файли їдуть на Pi.", commands: [
    ["ls", "Короткий список файлів у поточній папці."],
    ["scp led-test/main.py stanislav@raspberrypi.local:~/projects/led-test/", "На Mac: скопіювати файл led-test/main.py у ~/projects/led-test/ на Pi."],
    ["scp -r led-test stanislav@raspberrypi.local:~/projects/", "На Mac: скопіювати всю папку led-test у ~/projects/ на Pi."],
    ["rsync -av --dry-run ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", "На Mac: пробний прогін rsync — показати, що буде передано, нічого не змінюючи."],
    ["rsync -av ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", "На Mac: синхронізувати вміст папки led-test з Pi (лише зміни)."],
    ["ssh-copy-id stanislav@raspberrypi.local", "На Mac: скопіювати свій публічний SSH-ключ на Pi, щоб входити без пароля."]
  ] },
  { id: "danger", ctx: "pi", title: "14. Небезпечні команди", intro: "curl | bash, dd, mkfs, reboot, shutdown — розуміння ризику й безпечні альтернативи.", commands: [
    ["curl -fsSL https://example.com/install.sh | bash", "Завантажити скрипт з інтернету і одразу виконати його без перегляду."],
    ["curl -fsSL https://example.com/install.sh -o install.sh", "Безпечніше: лише завантажити install.sh у файл."],
    ["less install.sh", "Прочитати install.sh перед запуском."],
    ["lsblk", "Показати диски й розділи (SD-карта, SSD, флешка)."],
    ["sudo dd if=raspios.img of=/dev/sda bs=4M status=progress", "Записати образ побайтово на пристрій /dev/sda (затирає все на ньому)."],
    ["sudo mkfs.ext4 /dev/sda1", "Відформатувати розділ /dev/sda1 у ext4 (знищує дані розділу)."],
    ["sudo shutdown -r +5", "Запланувати перезавантаження Pi через 5 хвилин."],
    ["sudo shutdown -c", "Скасувати заплановане вимкнення або перезавантаження."],
    ["sudo reboot", "Негайно перезавантажити Pi (SSH-сесія обірветься)."],
    ["sudo shutdown -h now", "Негайно вимкнути Pi (увімкнути — лише фізично)."]
  ] },
  { id: "practice", ctx: "mac", title: "15. Щоденна перевірка", intro: "Ранковий огляд Pi за 5 хвилин: вхід, температура, живлення, диск, сервіс, оновлення.", commands: [
    ["ssh stanislav@10.0.0.50", "Підключитися з Mac до Pi користувачем stanislav за IP-адресою."],
    ["vcgencmd measure_temp", "Показати температуру процесора Pi."],
    ["vcgencmd get_throttled", "Перевірити, чи були недостатнє живлення або перегрів (throttling)."],
    ["df -h", "Показати вільне місце на дисках."],
    ["free -h", "Показати використання оперативної пам'яті в зручних одиницях."],
    ["systemctl status my-service", "Показати стан сервісу my-service і останні рядки логу."],
    ["journalctl -u my-service -n 20", "Показати останні 20 рядків журналу my-service."],
    ["sudo apt update", "Оновити списки пакетів з репозиторіїв (нічого не встановлює)."],
    ["exit", "Закрити SSH-сесію і повернутися в Terminal Mac."]
  ] }
];

// Явні еквіваленти: повні рядки, що дають той самий результат. Жодних префіксів.
const R_LED = ["stanislav@raspberrypi.local:~/projects/led-test/", "stanislav@raspberrypi.local:/home/stanislav/projects/led-test/", "stanislav@10.0.0.50:~/projects/led-test/", "stanislav@10.0.0.50:/home/stanislav/projects/led-test/"];
const R_PROJ = ["stanislav@raspberrypi.local:~/projects/", "stanislav@raspberrypi.local:/home/stanislav/projects/", "stanislav@raspberrypi.local:~/projects", "stanislav@raspberrypi.local:/home/stanislav/projects", "stanislav@10.0.0.50:~/projects/", "stanislav@10.0.0.50:/home/stanislav/projects/"];
const ALIASES = {
  "ping -c 3 raspberrypi.local": ["ping raspberrypi.local -c 3", "ping -c3 raspberrypi.local"],
  "ping -c 3 10.0.0.50": ["ping 10.0.0.50 -c 3", "ping -c3 10.0.0.50"],
  "ping -c 3 10.0.0.254": ["ping 10.0.0.254 -c 3", "ping -c3 10.0.0.254"],
  "ping -c 3 8.8.8.8": ["ping 8.8.8.8 -c 3", "ping -c3 8.8.8.8"],
  "ping -c 3 google.com": ["ping google.com -c 3", "ping -c3 google.com"],
  "echo $SHELL": ["echo \"$SHELL\""],
  "echo $PATH": ["echo \"$PATH\""],
  "echo $PATH | tr ':' '\\n'": ["echo $PATH | tr \":\" \"\\n\"", "echo \"$PATH\" | tr ':' '\\n'"],
  "which python3": [],
  "ls -la": ["ls -al", "ls -l -a", "ls -a -l"],
  "head -5 log.txt": ["head -n 5 log.txt", "head -n5 log.txt"],
  "tail -5 log.txt": ["tail -n 5 log.txt", "tail -n5 log.txt"],
  "cp -r folder folder-copy": ["cp -R folder folder-copy", "cp -r folder/ folder-copy", "cp -a folder folder-copy"],
  "rmdir empty": ["rmdir empty/"],
  "rm -r folder": ["rm -r folder/", "rm -R folder", "rm -R folder/"],
  "rm -rf build": ["rm -rf build/", "rm -fr build", "rm -fr build/", "rm -r -f build"],
  "cd /etc": ["cd /etc/"],
  "cd": ["cd ~", "cd ~/", "cd /home/stanislav", "cd /home/stanislav/", "cd $HOME"],
  "mkdir -p ~/projects/demo/src": ["mkdir -p /home/stanislav/projects/demo/src"],
  "cd ~/projects/led-test": ["cd ~/projects/led-test/", "cd /home/stanislav/projects/led-test", "cd /home/stanislav/projects/led-test/"],
  "sudo apt install htop": ["sudo apt install -y htop", "sudo apt-get install htop"],
  "sudo apt update": ["sudo apt-get update"],
  "sudo apt upgrade": ["sudo apt-get upgrade"],
  "sudo apt remove htop": ["sudo apt-get remove htop"],
  "sudo apt purge htop": ["sudo apt-get purge htop", "sudo apt remove --purge htop"],
  "ip addr": ["ip a", "ip address", "ip addr show"],
  "ip route": ["ip r", "ip route show"],
  "curl -I https://example.com": ["curl --head https://example.com"],
  "ss -tulpn": ["ss -tlnpu", "ss -tunlp", "ss -lntup", "ss -plunt", "sudo ss -tulpn"],
  "nmcli device status": ["nmcli dev status", "nmcli d"],
  "du -sh ~/projects": ["du -sh /home/stanislav/projects", "du -sh ~/projects/"],
  "ps aux | grep python": ["ps aux | grep python3"],
  "kill 1234": ["kill -15 1234", "kill -TERM 1234", "kill -SIGTERM 1234"],
  "kill -9 1234": ["kill -KILL 1234", "kill -SIGKILL 1234"],
  "python3 --version": ["python3 -V"],
  "source .venv/bin/activate": [". .venv/bin/activate"],
  "pip install requests": ["pip3 install requests", "python -m pip install requests", "python3 -m pip install requests"],
  "pip3 install requests": ["pip install requests", "python3 -m pip install requests"],
  "ls /dev/gpiochip*": [],
  "gpioset -c gpiochip0 17=1": ["gpioset gpiochip0 17=1"],
  "sudo systemctl enable --now my-service": ["sudo systemctl enable my-service --now", "sudo systemctl enable --now my-service.service"],
  "systemctl status my-service": ["systemctl status my-service.service", "sudo systemctl status my-service"],
  "sudo systemctl start my-service": ["sudo systemctl start my-service.service"],
  "sudo systemctl stop my-service": ["sudo systemctl stop my-service.service"],
  "sudo systemctl restart my-service": ["sudo systemctl restart my-service.service"],
  "sudo systemctl enable my-service": ["sudo systemctl enable my-service.service"],
  "sudo systemctl disable my-service": ["sudo systemctl disable my-service.service"],
  "journalctl -u my-service": ["journalctl -u my-service.service", "sudo journalctl -u my-service"],
  "journalctl -u my-service -n 50": ["journalctl -u my-service -n50", "journalctl -n 50 -u my-service", "journalctl -u my-service --lines=50"],
  "journalctl -u my-service -n 20": ["journalctl -u my-service -n20", "journalctl -n 20 -u my-service", "journalctl -u my-service --lines=20"],
  "journalctl -u my-service -f": ["journalctl -fu my-service", "journalctl -f -u my-service"],
  "journalctl -u my-service | grep -i error": ["journalctl -u my-service | grep -i \"error\"", "journalctl -u my-service | grep -i 'error'"],
  "sudo dmesg | tail -50": ["sudo dmesg | tail -n 50", "dmesg | tail -50", "dmesg | tail -n 50"],
  "git commit -m \"Update config\"": ["git commit -m 'Update config'"],
  "git add .": ["git add -A", "git add --all"],
  "git clone https://github.com/stas/weather-station.git": ["git clone https://github.com/stas/weather-station"],
  "cd weather-station": ["cd weather-station/", "cd ~/projects/weather-station"],
  "scp led-test/main.py stanislav@raspberrypi.local:~/projects/led-test/": R_LED.slice(1).map(r => "scp led-test/main.py " + r),
  "scp -r led-test stanislav@raspberrypi.local:~/projects/": R_PROJ.slice(1).map(r => "scp -r led-test " + r),
  "rsync -av ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/": R_LED.slice(1).map(r => "rsync -av ./led-test/ " + r)
    .concat(R_LED.map(r => "rsync -av led-test/ " + r)),
  "rsync -av --dry-run ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/": R_LED.slice(1).map(r => "rsync -av --dry-run ./led-test/ " + r)
    .concat(R_LED.map(r => "rsync -avn ./led-test/ " + r), R_LED.map(r => "rsync -av -n ./led-test/ " + r), R_LED.map(r => "rsync -av --dry-run led-test/ " + r)),
  "ssh-copy-id stanislav@raspberrypi.local": ["ssh-copy-id stanislav@10.0.0.50"],
  "sudo dd if=raspios.img of=/dev/sda bs=4M status=progress": ["sudo dd if=raspios.img of=/dev/sda bs=4M"],
  "sudo shutdown -r +5": ["sudo shutdown -r 5"],
  "sudo shutdown -h now": ["sudo poweroff", "sudo shutdown now"],
  "sudo reboot": ["sudo shutdown -r now"],
  "curl -fsSL https://example.com/install.sh -o install.sh": ["curl -fsSL -o install.sh https://example.com/install.sh", "curl -fsSLo install.sh https://example.com/install.sh"],
  "curl -fsSL https://example.com/install.sh | bash": ["curl -fsSL https://example.com/install.sh | sudo bash", "curl -fsSL https://example.com/install.sh | sh"]
};

const UK_HINTS = {};
const MODULES = {};
MODULE_LIST.forEach(m => {
  MODULES[m.id] = { id: m.id, title: m.title, intro: m.intro, ctx: m.ctx, cwd: m.cwd, commands: m.commands.map(c => c[0]) };
  m.commands.forEach(c => { if (!UK_HINTS[c[0]]) UK_HINTS[c[0]] = c[1]; });
});

/* ---------- строгий матчинг ---------- */
function normalizeCommand(s) {
  return String(s || "").replace(/[“”„«»]/g, "\"").replace(/[‘’ʼ]/g, "'").replace(/\s+/g, " ").trim();
}
// bash і zsh регістрозалежні — регістр не нормалізуємо.
function matches(input, listed) {
  const a = normalizeCommand(input);
  if (!a) return false;
  if (a === normalizeCommand(listed)) return true;
  return (ALIASES[listed] || []).some(x => normalizeCommand(x) === a);
}
function allCommands() {
  const seen = new Set(), out = [];
  MODULE_LIST.forEach(m => m.commands.forEach(c => { if (!seen.has(c[0])) { seen.add(c[0]); out.push(c[0]); } }));
  return out;
}
window.TRAINER = { commands: allCommands, matches: matches };

/* ---------- стан емулятора ---------- */
const SIM = {
  host: "mac", piOn: true, cwd: { mac: MAC_HOME, pi: PI_HOME },
  fs: { mac: null, pi: null },
  venv: false, venvCreated: false, requests: false, htop: false, htopConf: false,
  svc: null, git: null, piKey: false, shutdownPlanned: false
};

function makeFS(dirs, files) { return { dirs: new Set(dirs), files: new Map(files) }; }
const LOG_LINES = ["[INFO] led-test started", "[INFO] GPIO17 -> LED on", "[INFO] GPIO17 -> LED off", "[WARN] button bounce ignored",
  "[INFO] GPIO17 -> LED on", "[ERROR] sensor timeout", "[INFO] retry ok", "[INFO] GPIO17 -> LED off"];
const BLINK = "from gpiozero import LED\nfrom time import sleep\n\nled = LED(17)  # BCM 17 = фізичний контакт 11\n\nwhile True:\n    led.on()\n    sleep(1)\n    led.off()\n    sleep(1)\n";
const UNIT = "[Unit]\nDescription=LED test service\nAfter=network.target\n\n[Service]\nUser=stanislav\nWorkingDirectory=/home/stanislav/projects/led-test\nExecStart=/home/stanislav/projects/led-test/.venv/bin/python main.py\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\n";
function initFS() {
  SIM.fs.pi = makeFS(["/", "/home", PI_HOME, PROJ, LED, LED + "/folder", LED + "/empty", LED + "/build", "/etc", "/etc/systemd", "/etc/systemd/system",
    "/var", "/var/log", "/dev", "/usr", "/usr/bin", "/tmp", "/boot", "/boot/firmware"], [
    [PI_HOME + "/.bashrc", "# ~/.bashrc: executed by bash for non-login shells.\n"],
    [LED + "/main.py", "print(\"Hello from Raspberry Pi 5\")\n"],
    [LED + "/blink.py", BLINK],
    [LED + "/log.txt", LOG_LINES.join("\n") + "\n"],
    [LED + "/old.txt", "старий файл\n"],
    [LED + "/file.txt", "тимчасовий файл\n"],
    [LED + "/folder/a.txt", "a\n"], [LED + "/folder/b.txt", "b\n"],
    [LED + "/build/firmware.bin", "(binary)\n"],
    ["/etc/hostname", "raspberrypi\n"],
    ["/etc/os-release", "PRETTY_NAME=\"Debian GNU/Linux 12 (bookworm)\"\nNAME=\"Debian GNU/Linux\"\nVERSION_ID=\"12\"\nVERSION=\"12 (bookworm)\"\nVERSION_CODENAME=bookworm\nID=debian\n"],
    ["/etc/systemd/system/my-service.service", UNIT]
  ]);
  SIM.fs.mac = makeFS(["/", "/Users", MAC_HOME, MAC_HOME + "/.ssh", MAC_HOME + "/led-test", MAC_HOME + "/Desktop"], [
    [MAC_HOME + "/.ssh/id_ed25519.pub", "ssh-ed25519 AAAA…(публічний ключ) Stas@MacBook-Pro\n"],
    [MAC_HOME + "/led-test/main.py", "print(\"Hello from Raspberry Pi 5 — v2 з Mac\")\n"],
    [MAC_HOME + "/led-test/blink.py", BLINK]
  ]);
  SIM.cwd = { mac: MAC_HOME, pi: PI_HOME };
  SIM.host = "mac"; SIM.piOn = true;
  SIM.venv = false; SIM.venvCreated = false; SIM.requests = false; SIM.htop = false; SIM.htopConf = false;
  SIM.svc = { enabled: false, active: false, needReload: false };
  SIM.git = null; SIM.piKey = false; SIM.shutdownPlanned = false;
}

const F = () => SIM.fs[SIM.host];
const HOME = () => (SIM.host === "pi" ? PI_HOME : MAC_HOME);
const CWD = () => SIM.cwd[SIM.host];
function resolvePath(p) {
  p = String(p || "").replace(/^["']|["']$/g, "");
  let abs;
  if (!p || p === "~" || p === "$HOME") abs = HOME();
  else if (p.startsWith("~/")) abs = HOME() + p.slice(1);
  else if (p.startsWith("/")) abs = p;
  else abs = CWD() + "/" + p;
  const out = [];
  abs.split("/").forEach(seg => { if (!seg || seg === ".") return; if (seg === "..") out.pop(); else out.push(seg); });
  return "/" + out.join("/");
}
function parentOf(abs) { const i = abs.lastIndexOf("/"); return i <= 0 ? "/" : abs.slice(0, i); }
function baseOf(abs) { return abs === "/" ? "/" : abs.slice(abs.lastIndexOf("/") + 1); }
function tilde(abs) { const h = HOME(); return abs === h ? "~" : abs.startsWith(h + "/") ? "~" + abs.slice(h.length) : abs; }
function isDir(abs) { return F().dirs.has(abs); }
function isFile(abs) { return F().files.has(abs); }
function exists(abs) { return isDir(abs) || isFile(abs); }
function children(dir) {
  const pre = dir === "/" ? "/" : dir + "/";
  const names = new Set();
  [...F().dirs, ...F().files.keys()].forEach(p => {
    if (p !== dir && p.startsWith(pre)) { const rest = p.slice(pre.length); if (rest && !rest.includes("/")) names.add(rest); }
  });
  return [...names].sort((a, b) => a.localeCompare(b));
}
function subtree(dir) { const pre = dir === "/" ? "/" : dir + "/"; return [...F().dirs, ...F().files.keys()].filter(p => p.startsWith(pre)).sort(); }
function removeTree(abs) { subtree(abs).forEach(p => { F().dirs.delete(p); F().files.delete(p); }); F().dirs.delete(abs); F().files.delete(abs); }
function mkdirp(abs) { let p = abs; const chain = []; while (!isDir(p)) { chain.push(p); p = parentOf(p); } chain.forEach(d => F().dirs.add(d)); }

/* ---------- стан інтерфейсу ---------- */
const state = {
  currentModule: "ssh",
  history: [], histIdx: -1,
  triedByModule: Object.fromEntries(Object.keys(MODULES).map(k => [k, new Set()])),
  selectedScenario: null,
  testMode: { active: false, queue: [], index: 0, correct: 0, wrong: 0, answered: false }
};
const SCENARIOS = MODULE_LIST.map((m, i) => ({ id: i + 1, moduleId: m.id, title: m.title, desc: m.intro, commands: m.commands.length }));
state.selectedScenario = SCENARIOS[0];

function saveProgress() {
  try {
    const tried = {};
    Object.keys(state.triedByModule).forEach(k => { tried[k] = [...state.triedByModule[k]]; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, module: state.currentModule, tried }));
  } catch (e) { /* сховище недоступне — прогрес лише в цій сесії */ }
}
function loadProgress() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (e) { data = null; }
  if (!data || typeof data !== "object") return;
  if (data.tried && typeof data.tried === "object") {
    Object.keys(MODULES).forEach(k => {
      const list = Array.isArray(data.tried[k]) ? data.tried[k] : [];
      list.forEach(c => { if (MODULES[k].commands.includes(c)) state.triedByModule[k].add(c); });
    });
  }
  if (data.module && MODULES[data.module]) state.currentModule = data.module;
}

const $ = id => document.getElementById(id);
const livePanel = $("livePanel"), outputEl = $("output"), outputStatus = $("outputStatus"), cmdInput = $("cmdInput");
const progressBar = $("progressBar"), progressText = $("progressText"), cmdChecklist = $("cmdChecklist");
const moduleBadge = $("moduleBadge"), moduleNav = $("moduleNav"), termTitle = $("termTitle"), promptLabel = $("promptLabel");
const ctxBadge = $("ctxBadge");
const MAX_ENTRIES = 40;
let viewChunks = [];

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function getModule() { return MODULES[state.currentModule]; }
function getCurrentCommands() { return getModule().commands; }
function getTried() { return state.triedByModule[state.currentModule]; }

function beginView(cmd) {
  viewChunks = [];
  if (cmd != null) viewChunks.push(`<div class="line-user">${esc(promptLabel.textContent)} ${esc(cmd)}</div>`);
}
function print(html, cls = "line-sys") { viewChunks.push(`<div class="${cls}">${html}</div>`); }
function ukHint(text) { return `<div class="line-uk-hint">${esc(text)}</div>`; }
function printResult(title, body, type = "ok", hint = null) {
  const cls = { warn: "result-box warn", purple: "result-box purple", danger: "result-box danger" }[type] || "result-box";
  viewChunks.push(`<div class="${cls}"><div class="result-title">${esc(title)}</div>${body}${hint ? ukHint(hint) : ""}</div>`);
}
function out(lines, cls = "line-ok") { return `<pre class="${cls}">${esc(Array.isArray(lines) ? lines.join("\n") : lines)}</pre>`; }
function flushView(status, replace) {
  const entry = document.createElement("div");
  entry.className = "entry";
  entry.innerHTML = viewChunks.join("");
  if (replace) livePanel.innerHTML = "";
  livePanel.appendChild(entry);
  while (livePanel.children.length > MAX_ENTRIES) livePanel.removeChild(livePanel.firstChild);
  outputEl.scrollTop = outputEl.scrollHeight;
  if (status) outputStatus.textContent = status;
}

function updatePrompt() {
  let label, title;
  if (SIM.host === "pi") {
    label = `${SIM.venv ? "(.venv) " : ""}stanislav@raspberrypi:${tilde(CWD())} $`;
    title = `stanislav@raspberrypi — bash (SSH з Mac) — ${CWD()}`;
  } else {
    const c = CWD();
    label = `Stas@MacBook-Pro ${c === MAC_HOME ? "~" : baseOf(c)} %`;
    title = `Stas@MacBook-Pro — zsh (Mac) — ${tilde(c)}`;
  }
  promptLabel.textContent = label;
  termTitle.textContent = title;
  if (ctxBadge) {
    ctxBadge.textContent = SIM.host === "pi" ? "Зараз: Raspberry Pi (bash через SSH)" : "Зараз: Mac (zsh, локально)";
    ctxBadge.className = "ctx-badge " + SIM.host;
  }
}

function updateProgress() {
  const cmds = getCurrentCommands();
  const n = cmds.filter(c => getTried().has(c)).length;
  moduleBadge.textContent = getModule().title;
  progressBar.style.width = cmds.length ? `${(n / cmds.length) * 100}%` : "0%";
  progressText.textContent = `${n} / ${cmds.length} команд` + (n === cmds.length ? " — розділ пройдено!" : "");
  cmdChecklist.querySelectorAll("button[data-cmd]").forEach(b => {
    const done = getTried().has(b.dataset.cmd);
    b.parentElement.classList.toggle("done", done);
    b.setAttribute("aria-label", b.dataset.cmd + (done ? " — виконано" : " — ще не виконано") + ". Вставити в поле вводу");
  });
  updatePrompt();
}

function updateModuleNav() {
  moduleNav.innerHTML = Object.values(MODULES).map(mod => {
    const t = mod.commands.filter(c => state.triedByModule[mod.id].has(c)).length;
    const pct = mod.commands.length ? Math.round((t / mod.commands.length) * 100) : 0;
    const act = mod.id === state.currentModule;
    return `<button type="button" class="btn${act ? " active" : ""}" data-module="${mod.id}"${act ? " aria-current=\"true\"" : ""}>${esc(mod.title)} · ${t}/${mod.commands.length} (${pct}%)</button>`;
  }).join("");
  moduleNav.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => switchModule(btn.dataset.module)));
}

function buildChecklist() {
  cmdChecklist.innerHTML = getCurrentCommands().map(c =>
    `<li><button type="button" class="cmd-btn" data-cmd="${esc(c)}" title="${esc(UK_HINTS[c] || "")}"><code>${esc(c)}</code></button></li>`
  ).join("");
  cmdChecklist.querySelectorAll("button[data-cmd]").forEach(b => {
    b.addEventListener("click", () => { cmdInput.value = b.dataset.cmd; cmdInput.focus(); });
  });
  updateProgress();
  updateModuleNav();
}

// Розділ задає стартовий контекст: Mac або вже відкрита SSH-сесія на Pi — про це явно повідомляємо.
function applyModuleContext(m) {
  SIM.piOn = true;
  SIM.host = m.ctx;
  if (m.ctx === "pi") SIM.cwd.pi = m.cwd || PI_HOME;
  if (m.ctx === "mac") SIM.cwd.mac = MAC_HOME;
  if (!SIM.venvCreated || m.id !== "python") SIM.venv = false;
  updatePrompt();
}

function switchModule(id, showWelcome = true) {
  if (!MODULES[id]) return;
  state.currentModule = id;
  saveProgress();
  const m = getModule();
  applyModuleContext(m);
  buildChecklist();
  if (!showWelcome) return;
  beginView(null);
  const where = m.ctx === "pi"
    ? `Тренажер уже підключився до Pi (<span class="line-cmd">ssh stanislav@${PI_IP}</span>) — запрошення <span class="line-hl">stanislav@raspberrypi:… $</span>. <span class="line-cmd">exit</span> поверне на Mac.`
    : `Ти на Mac — запрошення <span class="line-hl">Stas@MacBook-Pro ~ %</span>. Команди Pi запрацюють лише після <span class="line-cmd">ssh</span>.`;
  printResult(`Розділ: ${m.title}`, `<span class="line-muted">${esc(m.intro)}</span><br>${where}<br><span class="line-hl">Команд:</span> ${m.commands.length}`,
    "purple", "Клік по команді зліва вставляє її в поле — натисни Enter. Зараховується лише точна команда (або її явний еквівалент).");
  flushView(`$ · ${m.title}`);
}

function welcome() {
  beginView(null);
  print(`<span class="line-muted">Raspberry Pi 5 Terminal Trainer — емуляція без реального виконання</span>`);
  printResult("Почни з розділу «SSH і перший вхід»", `
    Ти на Mac: <span class="line-cmd">ping -c 3 raspberrypi.local</span> → <span class="line-cmd">ssh stanislav@${PI_IP}</span> → <span class="line-cmd">hostname</span> → <span class="line-cmd">exit</span><br>
    <span class="line-muted">15 розділів · файли · apt · мережа · Python/venv · GPIO · systemd · логи · Git · небезпечні команди</span>`, "ok", GOAL);
  flushView("$ · Raspberry Pi 5 емулятор", true);
}

/* ---------- розбір рядка ---------- */
function tokenize(s) {
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g, t = []; let m;
  while ((m = re.exec(s))) t.push(m[1] != null ? m[1] : m[2] != null ? m[2] : m[3]);
  return t;
}
function splitFlags(args) {
  const flags = new Set(), rest = [];
  args.forEach(a => { if (/^-[A-Za-z]+$/.test(a)) a.slice(1).split("").forEach(f => flags.add(f)); else rest.push(a); });
  return { flags, rest };
}
function fileLines(abs) { return (F().files.get(abs) || "").replace(/\n$/, "").split("\n"); }
function notFound(cmd, name) {
  const extra = SIM.host === "pi" && CWD() !== LED && [LED + "/" + name].some(isFile) ? `\n(цей файл лежить у ~/projects/led-test — спершу cd ~/projects/led-test)` : "";
  return out(`${cmd}: ${SIM.host === "pi" ? `cannot access '${name}'` : name}: No such file or directory${extra}`, "line-err");
}
function lsLong(dir, all) {
  const names = children(dir).filter(n => all || !n.startsWith("."));
  const u = SIM.host === "pi" ? "stanislav stanislav " : "Stas  staff";
  const rows = names.map(n => {
    const p = dir === "/" ? "/" + n : dir + "/" + n;
    const d = isDir(p);
    const size = d ? 4096 : (F().files.get(p) || "").length;
    return `${d ? "drwxr-xr-x" : "-rw-r--r--"} 1 ${u} ${String(size).padStart(5)} Sep 18 09:30 ${n}`;
  });
  const head = all ? [`drwxr-xr-x 5 ${u}  4096 Sep 18 09:30 .`, `drwxr-xr-x 4 ${u}  4096 Sep 18 09:00 ..`] : [];
  return [`total ${rows.length * 4 + 8}`].concat(head, rows);
}
const PI_PATHS = { python3: "/usr/bin/python3", git: "/usr/bin/git", bash: "/usr/bin/bash", ls: "/usr/bin/ls", nano: "/usr/bin/nano", vcgencmd: "/usr/bin/vcgencmd",
  pinout: "/usr/bin/pinout", pinctrl: "/usr/bin/pinctrl", gpiodetect: "/usr/bin/gpiodetect", gpioinfo: "/usr/bin/gpioinfo", gpioset: "/usr/bin/gpioset",
  systemctl: "/usr/bin/systemctl", journalctl: "/usr/bin/journalctl", curl: "/usr/bin/curl", ssh: "/usr/bin/ssh", apt: "/usr/bin/apt", nmcli: "/usr/bin/nmcli" };
function piWhich(tool) {
  if (tool === "htop") return SIM.htop ? "/usr/bin/htop" : null;
  if ((tool === "python3" || tool === "python" || tool === "pip" || tool === "pip3") && SIM.venv) return LED + "/.venv/bin/" + tool;
  if (tool === "pip" || tool === "pip3") return "/usr/bin/" + tool;
  return PI_PATHS[tool] || null;
}
const PI_ONLY = new Set(["vcgencmd", "pinout", "pinctrl", "gpiodetect", "gpioinfo", "gpioset", "gpioget", "apt", "apt-get", "systemctl", "journalctl", "dmesg",
  "free", "lsblk", "nmcli", "rfkill", "ss", "pgrep", "killall", "deactivate", "source", "mkfs.ext4", "dd", "reboot", "shutdown", "sudo", "hostname -I", "ip"]);

/* ---------- Mac (zsh) ---------- */
function runMac(raw) {
  const t = tokenize(raw), name = t[0], args = t.slice(1);
  const { flags, rest } = splitFlags(args);
  const canon = canonOf(raw);
  const hint = UK_HINTS[canon] || null;
  const H = (title, body, type = "ok", h = hint) => { printResult(title, body, type, h); return true; };
  switch (name) {
    case "ping": return doPing(raw, args, hint, "mac");
    case "ssh": {
      const target = args.find(a => a.includes("@")) || args[0] || "";
      const m = target.match(/^([^@]+)@(raspberrypi\.local|10\.0\.0\.50)$/);
      if (!m) return H(raw, out(target ? `ssh: Could not resolve hostname ${target.split("@").pop()}: nodename nor servname provided, or not known` : "usage: ssh [-p port] user@host", "line-err"), "warn", "Формат: ssh stanislav@raspberrypi.local або ssh stanislav@10.0.0.50"), false;
      if (!SIM.piOn) return H(raw, out(`ssh: connect to host ${m[2]} port 22: Operation timed out`, "line-err"), "warn", "Pi вимкнена. Pi 5 вмикається кнопкою живлення на платі або перепідключенням живлення; у тренажері — «Скинути файли» або інший розділ."), false;
      if (m[1] !== "stanislav") return H(raw, out(`${m[1]}@${m[2]}: Permission denied (publickey,password).`, "line-err"), "warn", "На цій Pi користувач — stanislav. Username не обов'язково pi."), false;
      SIM.host = "pi"; SIM.cwd.pi = PI_HOME; SIM.venv = false; updatePrompt();
      return H(raw, out([SIM.piKey ? "(вхід за SSH-ключем — пароль не питали)" : `${m[1]}@${m[2]}'s password: (введено)`,
        "Linux raspberrypi 6.6.51+rpt-rpi-2712 #1 SMP PREEMPT Debian aarch64", "Last login: Thu Sep 17 21:04:11 2026 from 10.0.0.42"]), "ok",
        hint || "Тепер команди виконуються на Pi — дивись на запрошення.");
    }
    case "exit": printResult(raw, out("(ти вже на Mac, SSH-сесії немає; у справжньому Terminal exit закрив би вікно)", "line-muted"), "warn", "exit повертає з Pi на Mac лише всередині SSH-сесії."); return false;
    case "hostname": return H(raw, out("MacBook-Pro.local"), "ok", hint || "Це Mac. Після ssh ця сама команда покаже raspberrypi.");
    case "whoami": return H(raw, out("Stas"));
    case "pwd": return H(raw, out(CWD()));
    case "clear": welcome(); return "clear";
    case "ls": {
      const target = rest[0] ? resolvePath(rest[0]) : CWD();
      if (!exists(target)) return H(raw, out(`ls: ${rest[0]}: No such file or directory`, "line-err"), "warn"), false;
      if (flags.has("l")) return H(raw, out(lsLong(target, flags.has("a"))));
      const names = children(target).filter(n => flags.has("a") || !n.startsWith("."));
      return H(raw, out(names.join("   ") || "(порожньо)"));
    }
    case "cd": {
      const abs = resolvePath(args[0] == null ? "~" : args[0]);
      if (!isDir(abs)) return H(raw, out(`cd: no such file or directory: ${args[0]}`, "line-err"), "warn"), false;
      SIM.cwd.mac = abs; updatePrompt(); return H(raw, out(`(тепер ти в ${tilde(abs)} на Mac)`, "line-muted"));
    }
    case "cat": {
      const abs = resolvePath(rest[0] || "");
      if (!isFile(abs)) return H(raw, out(`cat: ${rest[0] || ""}: No such file or directory`, "line-err"), "warn"), false;
      return H(raw, out(fileLines(abs)));
    }
    case "scp": case "rsync": return macTransfer(raw, name, args, flags, rest, hint);
    case "ssh-copy-id": {
      if (!/^stanislav@(raspberrypi\.local|10\.0\.0\.50)$/.test(args[0] || "")) return H(raw, out("usage: ssh-copy-id user@host", "line-err"), "warn"), false;
      if (!SIM.piOn) return H(raw, out("ssh: connect to host port 22: Operation timed out", "line-err"), "warn"), false;
      SIM.piKey = true;
      return H(raw, out(["/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: \"/Users/Stas/.ssh/id_ed25519.pub\"", `${args[0]}'s password: (введено)`, "", "Number of key(s) added: 1", "", `Now try logging into the machine, with: "ssh '${args[0]}'"`]), "ok",
        "Публічний ключ дописано в ~/.ssh/authorized_keys на Pi. Приватний ключ нікуди не передається.");
    }
  }
  const piCmd = PI_ONLY.has(name) || /^(vcgencmd|pinout|gpio)/.test(name) || /^(python3|pip3?|git|journalctl|nano|tail|head|less|touch|mkdir|rm|cp|mv|uptime|df|du|uname|top|ps|kill|echo|which|man|apropos|history|curl)$/.test(name);
  if (piCmd) {
    printResult("Ти на Mac, а не на Pi", `${out(`zsh: ${PI_ONLY.has(name) || /^(vcgencmd|pinout|gpio)/.test(name) ? "command not found: " + name : "(у цьому тренажері Mac знає лише ping, ssh, scp, rsync, ls, cd, cat)"}`, "line-err")}<span class="line-muted">Команди для Pi виконуй після <span class="line-cmd">ssh stanislav@${PI_IP}</span> — запрошення має стати <span class="line-hl">stanislav@raspberrypi:~ $</span>.</span>`, "warn");
    return false;
  }
  printResult("Невідома команда", `${out(`zsh: command not found: ${name}`, "line-err")}<span class="line-muted">Тренажер не знає «${esc(raw)}». Спробуй команду зі списку зліва.</span>`, "warn");
  return false;
}

function doPing(raw, args, hint, from) {
  const { rest } = splitFlags(args.filter(a => a !== "3" && !/^-c\d+$/.test(a)));
  const host = rest[0] || "";
  const count = /-c\s*3|-c3/.test(raw);
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  const known = { "raspberrypi.local": PI_IP, "10.0.0.50": PI_IP, "10.0.0.254": ROUTER, "8.8.8.8": "8.8.8.8", "google.com": "142.250.186.78" };
  if (!known[host]) { printResult(raw, out(`ping: cannot resolve ${host || "(порожньо)"}: Unknown host`, "line-err"), "warn", "Тренажер знає raspberrypi.local, 10.0.0.50, 10.0.0.254, 8.8.8.8 і google.com."); return false; }
  const ip = known[host];
  if (ip === PI_IP && !SIM.piOn) return H(out(`PING ${host} (${ip}): 56 data bytes\nRequest timeout for icmp_seq 0\nRequest timeout for icmp_seq 1\nRequest timeout for icmp_seq 2`, "line-err"), "warn", "Pi вимкнена — пакети не повертаються.");
  if (!count) {
    printResult(raw, out(`PING ${host} (${ip}): 56 data bytes\n64 bytes from ${ip}: icmp_seq=0 ttl=64 time=2.0 ms\n64 bytes from ${ip}: icmp_seq=1 ttl=64 time=1.9 ms\n… (без -c ping не зупиняється сам — у справжньому терміналі натисни Ctrl+C)`, "line-warn"), "warn", "Додай -c 3, щоб надіслати рівно 3 пакети.");
    return false;
  }
  const t = ip === PI_IP || ip === ROUTER ? ["2.1", "1.8", "1.9"] : ["14.2", "13.8", "14.0"];
  const lines = [`PING ${host} (${ip}) 56(84) bytes of data.`].concat(t.map((x, i) => `64 bytes from ${ip}: icmp_seq=${i + 1} ttl=${ip === PI_IP || ip === ROUTER ? 64 : 117} time=${x} ms`),
    ["", `--- ${host} ping statistics ---`, "3 packets transmitted, 3 received, 0% packet loss"]);
  if (from === "mac") lines[0] = `PING ${host} (${ip}): 56 data bytes`;
  return H(out(lines));
}

function macTransfer(raw, name, args, flags, rest, hint) {
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  const target = rest[rest.length - 1] || "";
  const m = target.match(/^stanislav@(raspberrypi\.local|10\.0\.0\.50):(.+)$/);
  if (rest.filter(a => !a.startsWith("--")).length < 2 || !m) { printResult(raw, out(`usage: ${name} [опції] джерело stanislav@raspberrypi.local:шлях`, "line-err"), "warn", "Віддалений шлях пишуть після двокрапки: stanislav@raspberrypi.local:~/projects/"); return false; }
  if (!SIM.piOn) { printResult(raw, out("ssh: connect to host port 22: Operation timed out", "line-err"), "warn"); return false; }
  const srcArg = rest.filter(a => !a.startsWith("--"))[0];
  const src = resolvePath(srcArg);
  if (!exists(src)) { printResult(raw, out(`${name}: ${srcArg}: No such file or directory`, "line-err"), "warn", "scp і rsync запускаються на Mac — перевір ls у поточній папці Mac."); return false; }
  const remote = m[2].replace(/^~(?=\/|$)/, PI_HOME);
  const pi = SIM.fs.pi;
  const dryRun = args.includes("--dry-run") || flags.has("n");
  const destDir = remote.replace(/\/$/, "");
  const piDirExists = d => pi.dirs.has(d);
  const copyFile = (from, to) => { if (!dryRun) { let p = parentOf(to); const chain = []; while (!pi.dirs.has(p)) { chain.push(p); p = parentOf(p); } chain.forEach(d => pi.dirs.add(d)); pi.files.set(to, SIM.fs.mac.files.get(from)); } };
  if (name === "scp") {
    if (isDir(src)) {
      if (!flags.has("r")) { printResult(raw, out(`scp: ${srcArg}: not a regular file`, "line-err"), "warn", "Папку копіюють з -r."); return false; }
      if (!piDirExists(destDir)) { printResult(raw, out(`scp: ${remote}: No such file or directory`, "line-err"), "warn"); return false; }
      const files = subtree(src).filter(isFile);
      files.forEach(f => copyFile(f, destDir + "/" + baseOf(src) + f.slice(src.length)));
      return H(out(files.map(f => `${baseOf(f).padEnd(12)} 100%  ${String(SIM.fs.mac.files.get(f).length).padStart(4)}   85.3KB/s   00:00`)));
    }
    const to = remote.endsWith("/") || piDirExists(destDir) ? destDir + "/" + baseOf(src) : remote;
    if (!piDirExists(parentOf(to))) { printResult(raw, out(`scp: ${remote}: No such file or directory`, "line-err"), "warn", "Папки на Pi ще немає: створи її на Pi (mkdir -p) або використай rsync."); return false; }
    copyFile(src, to);
    return H(out(`${baseOf(src).padEnd(12)} 100%   ${SIM.fs.mac.files.get(src).length}    42.1KB/s   00:00`));
  }
  // rsync
  if (!flags.has("a")) { printResult(raw, out("(без -a rsync не зберігає права й час зміни і не копіює підпапки)", "line-warn"), "warn", "Типовий набір: rsync -av джерело/ ціль/"); return false; }
  if (!isDir(src)) { printResult(raw, out("(у тренажері rsync синхронізує папку led-test/)", "line-muted"), "warn"); return false; }
  const trailing = /\/$/.test(srcArg);
  const base = trailing ? destDir : destDir + "/" + baseOf(src);
  const files = subtree(src).filter(isFile);
  const changed = files.filter(f => pi.files.get(base + f.slice(src.length)) !== SIM.fs.mac.files.get(f));
  changed.forEach(f => copyFile(f, base + f.slice(src.length)));
  if (!dryRun) { let p = base; while (!pi.dirs.has(p)) { pi.dirs.add(p); p = parentOf(p); } }
  const lines = [dryRun ? "sending incremental file list (DRY RUN — нічого не змінено)" : "sending incremental file list"]
    .concat(changed.length ? changed.map(f => f.slice(src.length + 1)) : ["(змін немає — нічого не передано)"],
      ["", `sent ${changed.length * 180 + 120} bytes  received 35 bytes`, dryRun ? "total size is 312  speedup is 1.00 (DRY RUN)" : "total size is 312  speedup is 1.52"]);
  return H(out(lines), "ok", hint || (trailing ? "Слеш у кінці джерела: копіюється вміст папки." : "Без слеша: на Pi з'явиться вкладена папка led-test/led-test."));
}

/* ---------- Pi (bash) ---------- */
function canonOf(raw) {
  const all = allCommands();
  return all.find(c => normalizeCommand(c) === normalizeCommand(raw)) || all.find(c => matches(raw, c)) || raw;
}
function runPi(raw) {
  const canon = canonOf(raw);
  const hint = UK_HINTS[canon] || null;
  const H = (title, body, type = "ok", h = hint) => { printResult(title, body, type, h); return true; };

  // конвеєри: лише ті, що є в розділах, + стоп для curl | bash
  if (/\|\s*(sudo\s+)?(ba|z)?sh\b/.test(raw)) {
    return H(raw, `<span class="line-err">⚠ Тренажер не виконує «завантажити й одразу запустити».</span><br><span class="line-muted">Скрипт з інтернету отримав би всі твої права (а з sudo — root) без перевірки. Безпечно: curl -fsSL URL -o install.sh → less install.sh → лише потім bash install.sh.</span>`, "danger");
  }
  if (raw.includes("|")) {
    if (canon === "echo $PATH | tr ':' '\\n'") return H(raw, out(piPath().split(":")));
    if (canon === "ps aux | grep python") return H(raw, out(["USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
      "stanislav        1234  2.1  0.4  32412 18220 ?        Ss   09:12   0:41 /home/stanislav/projects/led-test/.venv/bin/python main.py",
      "stanislav        2211  0.0  0.0   6180  1960 pts/0    S+   09:31   0:00 grep --color=auto python"]), "ok", hint || "Останній рядок — сам grep, його ігноруй.");
    if (canon === "journalctl -u my-service | grep -i error") return H(raw, out(["Sep 18 09:12:44 raspberrypi python[1234]: [ERROR] sensor timeout", "Sep 18 09:12:44 raspberrypi python[1234]: TimeoutError: sensor did not answer in 2 s"]));
    if (canon === "sudo dmesg | tail -50") {
      if (!/^sudo /.test(raw)) return H(raw, out(["dmesg: read kernel buffer failed: Operation not permitted", "(залежить від налаштувань системи: якщо читання журналу ядра обмежене — потрібен sudo)"], "line-warn"), "warn");
      return H(raw, out(["[    2.114011] rp1-firmware: RP1 firmware version …", "[    3.402356] brcmfmac: wlan0: Firmware: BCM4345/6", "[    5.873120] usb 3-1: new high-speed USB device number 2 using xhci-hcd",
        "[    5.901237] usb-storage 3-1:1.0: USB Mass Storage device detected", "[    6.920004] sd 0:0:0:0: [sda] 30031872 512-byte logical blocks: (15.4 GB/14.3 GiB)", "[   12.114578] wlan0: associated"]));
    }
    return H("Конвеєр не емулюється", `<span class="line-muted">Тренажер знає лише конвеєри з розділів. Спробуй команду зі списку зліва.</span>`, "warn"), false;
  }

  let t = tokenize(raw);
  const sudo = t[0] === "sudo";
  if (sudo) t = t.slice(1);
  const name = t[0], args = t.slice(1);
  const { flags, rest } = splitFlags(args);
  if (sudo && !name) return H(raw, out("usage: sudo команда", "line-muted")), false;

  switch (name) {
    case "exit": {
      SIM.host = "mac"; SIM.venv = false; updatePrompt();
      return H(raw, out(["logout", "Connection to raspberrypi.local closed."]), "ok", hint || "Ти знову на Mac — запрошення закінчується на %.");
    }
    case "ssh": return H(raw, out("(ти вже на Pi — вкладена SSH-сесія не потрібна; щоб повернутися на Mac, введи exit)", "line-warn"), "warn"), false;
    case "scp": case "rsync": case "ssh-copy-id":
      return H(raw, out(`(${name} для передачі Mac → Pi запускають на Mac. Спершу exit, потім команда на Mac.)`, "line-warn"), "warn"), false;
    case "echo": {
      const v = args.join(" ");
      const map = { "$SHELL": "/bin/bash", "$HOME": PI_HOME, "$PATH": piPath(), "$USER": "stanislav" };
      return H(raw, out(v.replace(/\$[A-Z]+/g, m => map[m] != null ? map[m] : "")));
    }
    case "whoami": return H(raw, out(sudo ? "root" : "stanislav"));
    case "hostname": return args[0] === "-I" ? H(raw, out(`${PI_IP} fd12:3456:789a:1::50`)) : H(raw, out("raspberrypi"), "ok", hint || "Ти на Pi. На Mac ця команда показала б MacBook-Pro.local.");
    case "pwd": return H(raw, out(CWD()));
    case "clear": welcome(); return "clear";
    case "history": return H(raw, state.history.length ? out(state.history.map((h, i) => `${String(i + 1).padStart(5)}  ${h}`)) : out("(порожньо)", "line-muted"));
    case "which": { const p = piWhich(args[0] || ""); return p ? H(raw, out(p)) : H(raw, out("(порожньо — команди немає в PATH)", "line-muted"), "ok", hint || "which нічого не виводить, якщо команду не знайдено."); }
    case "command": { if (args[0] !== "-v" || !args[1]) break; const p = piWhich(args[1]); return H(raw, p ? out(p) : out("(порожньо — команду не знайдено, код виходу 1)", "line-muted")); }
    case "man": return H(raw, out(`${(args[0] || "").toUpperCase()}(1)                User Commands\n\nNAME\n       ${args[0]} - … (емуляція довідки)\n\nПробіл — далі, /слово — пошук, q — вихід.`, "line-muted"));
    case "apropos": return H(raw, out(["ip (8)               - show / manipulate routing, network devices, interfaces and tunnels", "nmcli (1)            - command-line tool for controlling NetworkManager", "ping (8)             - send ICMP ECHO_REQUEST to network hosts", "ss (8)               - another utility to investigate sockets"]));
    case "ls": {
      if (args[0] === "--help") return H(raw, out(["Usage: ls [OPTION]... [FILE]...", "List information about the FILEs (the current directory by default).", "  -a, --all                  do not ignore entries starting with .", "  -h, --human-readable       with -l, print sizes like 1K 234M 2G", "  -l                         use a long listing format"]));
      if (rest[0] === "/dev/gpiochip*") return H(raw, out("/dev/gpiochip0  /dev/gpiochip10  /dev/gpiochip11  /dev/gpiochip12  /dev/gpiochip13  /dev/gpiochip4"), "ok", hint || "Номери чіпів залежать від версії ядра.");
      const target = rest[0] ? resolvePath(rest[0]) : CWD();
      if (!exists(target)) return H(raw, notFound("ls", rest[0]), "warn"), false;
      if (isFile(target)) return H(raw, out(rest[0]));
      if (flags.has("l")) return H(raw, out(lsLong(target, flags.has("a"))));
      const names = children(target).filter(n => flags.has("a") || !n.startsWith("."));
      return H(raw, names.length ? out(names.join("  ")) : out("(папка порожня)", "line-muted"));
    }
    case "cd": {
      const tgt = args[0] == null ? "~" : args[0];
      const abs = resolvePath(tgt);
      if (!isDir(abs)) return H(raw, out(isFile(abs) ? `-bash: cd: ${tgt}: Not a directory` : `-bash: cd: ${tgt}: No such file or directory`, "line-err"), "warn"), false;
      SIM.cwd.pi = abs; updatePrompt();
      return H(raw, out(`(тепер ти в ${abs} — див. запрошення)`, "line-muted"), "ok", hint || "cd нічого не виводить, якщо все добре.");
    }
    case "mkdir": {
      const outl = [];
      rest.forEach(n => {
        const abs = resolvePath(n);
        if (exists(abs)) { if (!flags.has("p")) outl.push(`mkdir: cannot create directory '${n}': File exists`); return; }
        if (!isDir(parentOf(abs)) && !flags.has("p")) { outl.push(`mkdir: cannot create directory '${n}': No such file or directory`); return; }
        mkdirp(abs);
      });
      return H(raw, outl.length ? out(outl, "line-err") : out("(папку створено)", "line-muted"));
    }
    case "touch": {
      if (!rest.length) break;
      rest.forEach(n => { const abs = resolvePath(n); if (!exists(abs) && isDir(parentOf(abs))) F().files.set(abs, ""); });
      return H(raw, out("(файл створено або оновлено дату зміни)", "line-muted"));
    }
    case "nano": {
      const abs = resolvePath(rest[0] || "");
      if (!rest[0]) break;
      if (abs.startsWith("/etc/") && !sudo) return H(raw, out(`[ Error writing ${abs}: Permission denied ]`, "line-err"), "warn", "Файли в /etc редагують з sudo: sudo nano …"), false;
      if (!isDir(parentOf(abs))) return H(raw, out(`[ Directory '${parentOf(abs)}' does not exist ]`, "line-err"), "warn"), false;
      if (abs === "/etc/systemd/system/my-service.service") {
        SIM.svc.needReload = true;
        return H(raw, out(`  GNU nano 7.2        ${abs}\n\n${UNIT}\n^O Write Out   ^X Exit   (зміни збережено)`), "ok", "Після зміни unit-файлу обов'язково: sudo systemctl daemon-reload");
      }
      if (!isFile(abs)) F().files.set(abs, "");
      if (SIM.git && abs.startsWith(SIM.git.root + "/")) SIM.git.modified.add(abs.slice(SIM.git.root.length + 1));
      if (SIM.git && abs.startsWith(SIM.git.root + "/")) F().files.set(abs, "CITY = \"Kyiv\"\nINTERVAL = 300\n");
      return H(raw, out(`  GNU nano 7.2        ${rest[0]}\n\n${F().files.get(abs) || ""}\n^O Write Out (Ctrl+O, Enter)   ^X Exit (Ctrl+X)   (емуляція: файл збережено)`));
    }
    case "cat": case "less": {
      const n = rest[0];
      if (!n) break;
      const abs = resolvePath(n);
      if (!isFile(abs)) return H(raw, notFound(name, n), "warn"), false;
      return H(raw, out(fileLines(abs).concat(name === "less" ? ["(END) — q для виходу"] : [])));
    }
    case "head": case "tail": {
      let n = 10, file = null, follow = false;
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === "-f") follow = true;
        else if (a === "-n") n = +args[++i];
        else if (/^-n\d+$/.test(a)) n = +a.slice(2);
        else if (/^-\d+$/.test(a)) n = +a.slice(1);
        else file = a;
      }
      if (!file) break;
      const abs = resolvePath(file);
      if (!isFile(abs)) return H(raw, notFound(name, file), "warn"), false;
      const lines = fileLines(abs);
      const sel = name === "head" ? lines.slice(0, n) : lines.slice(-n);
      return H(raw, out(follow ? sel.concat(["… (чекаю нові рядки; Ctrl+C — вийти)"]) : sel));
    }
    case "cp": case "mv": {
      if (rest.length < 2) break;
      const src = resolvePath(rest[0]); let dst = resolvePath(rest[1]);
      if (!exists(src)) return H(raw, out(`${name}: cannot stat '${rest[0]}': No such file or directory`, "line-err"), "warn"), false;
      if (isDir(dst)) dst = dst + "/" + baseOf(src);
      if (isDir(src)) {
        if (name === "cp" && !flags.has("r") && !flags.has("R") && !flags.has("a")) return H(raw, out(`cp: -r not specified; omitting directory '${rest[0]}'`, "line-err"), "warn", "Папку копіюють з -r: cp -r folder folder-copy"), false;
        subtree(src).concat(src).forEach(p => { const np = dst + p.slice(src.length); if (isDir(p)) F().dirs.add(np); else F().files.set(np, F().files.get(p)); });
        if (name === "mv") removeTree(src);
      } else {
        const overwrite = isFile(dst);
        F().files.set(dst, F().files.get(src));
        if (name === "mv") F().files.delete(src);
        if (overwrite) return H(raw, out(`(${rest[1]} перезаписано без питань!)`, "line-warn"), "warn", "cp і mv мовчки перезаписують наявний файл. Прапорець -i питає дозволу.");
      }
      return H(raw, out(name === "cp" ? "(скопійовано)" : "(переміщено / перейменовано)", "line-muted"));
    }
    case "rm": {
      if (!rest.length) break;
      const recursive = flags.has("r") || flags.has("R"), force = flags.has("f");
      const outl = []; let removed = 0;
      for (const n of rest) {
        const abs = resolvePath(n);
        if (abs === "/" || abs === PI_HOME || abs === "/home" || abs === PROJ || n === "*" || abs.startsWith("/etc") || abs.startsWith("/usr") || abs.startsWith("/boot")) {
          return H(raw, `<span class="line-err">⛔ Тренажер відмовився: ${esc(n)} — це ${abs === PI_HOME ? "вся домашня папка" : "системна папка або все підряд"}.</span><br><span class="line-muted">На справжній Pi це знищило б дані або систему безповоротно. Перед видаленням: pwd і ls; замість rm -rf — rm -ri або перейменування в _old.</span>`, "danger");
        }
        if (!exists(abs)) { if (!force) outl.push(`rm: cannot remove '${n}': No such file or directory`); continue; }
        if (isDir(abs) && !recursive) { outl.push(`rm: cannot remove '${n}': Is a directory`); continue; }
        if (flags.has("i")) { outl.push(`rm: remove '${n}'? (у тренажері відповідь n — нічого не видалено)`); continue; }
        removeTree(abs); removed++;
      }
      const type = recursive && force ? "danger" : recursive ? "warn" : "ok";
      const body = (removed ? out(recursive && force ? "(видалено без жодного питання — кошика в Linux-терміналі немає)" : "(видалено назавжди — не в кошик)", recursive && force ? "line-err" : "line-warn") : "") + (outl.length ? out(outl, "line-err") : "");
      if (!removed && outl.length) return H(raw, body, "warn"), false;
      return H(raw, body || out("(нічого не сталося: -f мовчить, навіть коли файлу немає)", "line-muted"), type, hint || (recursive ? "rm -r видаляє папку з усім вмістом. Перед цим: pwd і ls." : "rm видаляє файл без кошика."));
    }
    case "rmdir": {
      const n = (rest[0] || "").replace(/\/$/, "");
      const abs = resolvePath(n);
      if (!isDir(abs)) return H(raw, out(`rmdir: failed to remove '${n}': No such file or directory`, "line-err"), "warn"), false;
      if (children(abs).length) return H(raw, out(`rmdir: failed to remove '${n}': Directory not empty`, "line-err"), "warn", "rmdir видаляє лише порожні папки — тому він безпечніший за rm -r."), false;
      F().dirs.delete(abs);
      return H(raw, out("(порожню папку видалено)", "line-muted"));
    }
    case "chmod": case "chown":
      if (flags.has("R") || /777/.test(raw)) return H(raw, `<span class="line-err">⛔ Тренажер не виконує ${esc(raw)}.</span><br><span class="line-muted">Рекурсивна зміна прав або 777 відкриває файли всім чи ламає систему. Змінюй права одного конкретного файлу: chmod +x script.sh.</span>`, "danger");
      return H(raw, out("(права змінено)", "line-muted"), "warn");
    case "apt": case "apt-get": return piApt(raw, sudo, args, hint);
    case "ip": {
      const sub = args[0] || "";
      if (/^(a|addr|address)$/.test(sub)) return H(raw, out(["1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN", "    inet 127.0.0.1/8 scope host lo",
        "2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 state DOWN", "    link/ether 2c:cf:67:0a:11:22 brd ff:ff:ff:ff:ff:ff",
        "3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP", "    link/ether 2c:cf:67:0a:11:23 brd ff:ff:ff:ff:ff:ff", `    inet ${PI_IP}/24 brd 10.0.0.255 scope global dynamic wlan0`]), "ok", hint || "wlan0 — Wi-Fi (UP, має адресу), eth0 — кабель (DOWN, не під'єднано).");
      if (/^(r|route)$/.test(sub)) return H(raw, out([`default via ${ROUTER} dev wlan0 proto dhcp src ${PI_IP} metric 600`, `10.0.0.0/24 dev wlan0 proto kernel scope link src ${PI_IP} metric 600`]), "ok", hint || `default via ${ROUTER} — шлюз за замовчуванням, тобто роутер.`);
      break;
    }
    case "ping": return doPing(raw, args, hint, "pi");
    case "curl": {
      if (args.includes("-o")) {
        const f = resolvePath(args[args.indexOf("-o") + 1] || "install.sh");
        F().files.set(f, "#!/bin/bash\n# install.sh — завантажено, ще НЕ виконано\nset -e\necho \"Installing demo-tool…\"\nsudo apt install -y demo-tool\n");
        return H(raw, out("(файл install.sh завантажено, нічого не виконано — тепер прочитай його: less install.sh)", "line-muted"));
      }
      if (args.includes("-o") === false && /-[a-zA-Z]*o/.test(args.join(" ")) && args.some(a => a === "install.sh")) {
        F().files.set(resolvePath("install.sh"), "#!/bin/bash\n# install.sh — завантажено, ще НЕ виконано\nset -e\necho \"Installing demo-tool…\"\nsudo apt install -y demo-tool\n");
        return H(raw, out("(файл install.sh завантажено, нічого не виконано — тепер прочитай його: less install.sh)", "line-muted"));
      }
      if (flags.has("I") || args.includes("--head")) return H(raw, out(["HTTP/2 200", "content-type: text/html", "server: ECAcc (dcd/7D5A)", "content-length: 1256"]), "ok", hint || "200 — сайт відповів; мережа і DNS працюють.");
      return H(raw, out("<!doctype html>\n<html>…<title>Example Domain</title>…</html>"));
    }
    case "ss": return H(raw, out(["Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process", "udp   UNCONN 0      0            0.0.0.0:5353      0.0.0.0:*",
      "tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*", "tcp   LISTEN 0      128             [::]:22           [::]:*",
      "(імена процесів чужих користувачів видно лише з sudo)"]), "ok", hint || ":22 — SSH-сервер слухає. Якби його тут не було, ssh з Mac отримав би Connection refused.");
    case "nmcli": return H(raw, out(["DEVICE         TYPE      STATE                   CONNECTION", "wlan0          wifi      connected               Home-WiFi",
      "eth0           ethernet  unavailable             --", "lo             loopback  connected (externally)  lo"]));
    case "rfkill": return H(raw, out(["ID TYPE      DEVICE    SOFT      HARD", " 0 bluetooth hci0   unblocked unblocked", " 1 wlan      phy0   unblocked unblocked"]), "ok", hint || "blocked у SOFT — Wi-Fi вимкнено програмно (sudo rfkill unblock wifi).");
    case "uname": return H(raw, out("Linux raspberrypi 6.6.51+rpt-rpi-2712 #1 SMP PREEMPT Debian 1:6.6.51-1+rpt3 aarch64 GNU/Linux"), "ok", hint || "aarch64 — 64-бітна ARM-система; версія ядра залежить від оновлень.");
    case "uptime": return H(raw, out(" 09:31:07 up 2 days,  3:15,  1 user,  load average: 0.12, 0.08, 0.05"));
    case "vcgencmd": {
      if (args[0] === "measure_temp") return H(raw, out("temp=47.8'C"), "ok", hint || "До ~60 °C під навантаженням — норма. Близько 80 °C і вище Pi почне скидати частоту.");
      if (args[0] === "get_throttled") return H(raw, out("throttled=0x0"), "ok", hint || "0x0 — з моменту увімкнення не було ні недостатнього живлення, ні перегріву. Інше значення — перевір блок живлення і охолодження.");
      break;
    }
    case "free": return H(raw, out(["               total        used        free      shared  buff/cache   available", "Mem:           7.9Gi       1.1Gi       5.2Gi        48Mi       1.7Gi       6.8Gi", "Swap:          511Mi          0B       511Mi"]));
    case "df": return H(raw, out(["Filesystem      Size  Used Avail Use% Mounted on", "/dev/mmcblk0p2   58G  9.8G   45G  18% /", "/dev/mmcblk0p1  510M   75M  436M  15% /boot/firmware", "tmpfs           4.0G     0  4.0G   0% /dev/shm"]));
    case "du": { const p = resolvePath(rest[0] || "."); if (!isDir(p)) return H(raw, notFound("du", rest[0] || "."), "warn"), false; return H(raw, out(`${p === PROJ ? "38M" : "12M"}\t${rest[0] || "."}`)); }
    case "lsblk": return H(raw, out(["NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS", "sda           8:0    1 14.3G  0 disk", "└─sda1        8:1    1 14.3G  0 part",
      "mmcblk0     179:0    0 59.5G  0 disk", "├─mmcblk0p1 179:1    0  512M  0 part /boot/firmware", "└─mmcblk0p2 179:2    0   59G  0 part /"]), "ok",
      hint || "mmcblk0 — SD-карта, з якої працює система (змонтована в /). sda — USB-флешка. Перш ніж писати на пристрій, переконайся за розміром і MOUNTPOINTS, що це не системний диск.");
    case "pgrep": return H(raw, out("1234"));
    case "top": case "htop": {
      if (name === "htop" && !SIM.htop) return H(raw, out("-bash: htop: command not found", "line-err"), "warn", "Спершу: sudo apt install htop"), false;
      return H(raw, out(["top - 09:31:07 up 2 days,  3:15,  1 user,  load average: 0.12, 0.08, 0.05", "Tasks: 182 total,   1 running, 181 sleeping", "MiB Mem :   8052.0 total,   5324.1 free,   1130.4 used",
        "", "    PID USER      PR  NI    VIRT    RES  %CPU  %MEM COMMAND", "   1234 stanislav      20   0   32412  18220   2.1   0.2 python", "    812 root      20   0  120412   9240   0.3   0.1 NetworkManager", "", "(q — вихід)"]));
    }
    case "kill": {
      const pid = args[args.length - 1];
      if (pid !== "1234") return H(raw, out(`-bash: kill: (${pid || ""}) - No such process`, "line-err"), "warn", "Спершу знайди PID: ps aux | grep python або pgrep -f main.py"), false;
      const nine = raw.includes("-9") || raw.includes("KILL");
      return H(raw, out(nine ? "(процес 1234 убито миттєво — без шансу зберегти дані)" : "(процесу 1234 надіслано SIGTERM — він завершується коректно)", nine ? "line-warn" : "line-muted"), nine ? "warn" : "ok",
        hint || (nine ? "kill -9 — крайній засіб. Якщо процес — сервіс systemd, краще sudo systemctl stop." : ""));
    }
    case "killall": return H(raw, out("(завершено всі процеси python3 — зокрема й чужі скрипти та сервіси)", "line-warn"), "warn", "killall б'є по імені — всім процесам підряд. Точніше: kill PID або systemctl stop сервіс.");
    case "python3": case "python": return piPython(raw, args, hint);
    case "pip": case "pip3": return piPip(raw, canon, args, hint);
    case "source": case ".": {
      if (args[0] !== ".venv/bin/activate") break;
      if (!isFile(resolvePath(".venv/bin/activate"))) return H(raw, out("-bash: .venv/bin/activate: No such file or directory", "line-err"), "warn", "Спершу створи venv: python3 -m venv .venv (у папці проєкту)."), false;
      SIM.venv = true; updatePrompt();
      return H(raw, out("(venv активовано — запрошення почалося з (.venv))", "line-muted"));
    }
    case "deactivate":
      if (!SIM.venv) return H(raw, out("-bash: deactivate: command not found", "line-err"), "warn", "deactivate існує лише всередині активного venv."), false;
      SIM.venv = false; updatePrompt(); return H(raw, out("(venv вимкнено)", "line-muted"));
    case "pinout": return H(raw, out(["Description        : Raspberry Pi 5B rev 1.0", "RAM                : 8GB", "", "   3V3  (1) (2)  5V", " GPIO2  (3) (4)  5V", " GPIO3  (5) (6)  GND", " GPIO4  (7) (8)  GPIO14", "   GND  (9) (10) GPIO15", "GPIO17 (11) (12) GPIO18", "GPIO27 (13) (14) GND", "   …"]), "warn",
      hint || "GPIO17 — фізичний контакт 11. Логіка 3,3 В: 5 В на GPIO може спалити Pi.");
    case "pinctrl": {
      if (args[0] === "get" && args[1] === "17") return H(raw, out("17: ip    pd | lo // GPIO17 = input"), "ok", hint || "ip — input, pd — pull-down, lo — низький рівень. pinctrl на Pi 5 замінює старий raspi-gpio.");
      if (args[0] === "set") return H(raw, out("(pinctrl set змінює стан контакту — лише для діагностики і лише з перевіреною схемою)", "line-warn"), "warn");
      break;
    }
    case "gpiodetect": return H(raw, out(["gpiochip0 [gpio-brcmstb@107d508500] (32 lines)", "gpiochip1 [gpio-brcmstb@107d508520] (4 lines)", "gpiochip4 [pinctrl-rp1] (54 lines)"]), "ok",
      hint || "Номери й назви чіпів залежать від версії ядра: на новіших ядрах RP1 (контакти 40-pin) — gpiochip0, на старіших — gpiochip4.");
    case "gpioinfo": return H(raw, out(["gpiochip4 - 54 lines:", "\tline   0:     \"ID_SDA\"       unused   input  active-high", "\tline   2:      \"GPIO2\"       unused   input  active-high", "\tline  17:     \"GPIO17\"       unused   input  active-high", "\tline  18:     \"GPIO18\"       unused   input  active-high", "\t…"]), "ok",
      hint || "Кожен рядок — лінія GPIO: назва, хто її зайняв (unused — вільна), напрям. Формат виводу залежить від версії libgpiod.");
    case "gpioset": return H(raw, out(["(лінію 17 встановлено в 1 — світлодіод через резистор засвітився)", "(у libgpiod v2 gpioset тримає лінію, доки не натиснеш Ctrl+C)"], "line-warn"), "warn",
      "Синтаксис залежить від версії libgpiod: v1 — gpioset gpiochip0 17=1, v2 — gpioset -c gpiochip0 17=1. Номер чипа залежить від версії ядра. Для програм краще gpiozero.");
    case "systemctl": return piSystemctl(raw, sudo, args, hint);
    case "journalctl": return piJournal(raw, args, hint);
    case "dmesg": return H(raw, out(["dmesg: read kernel buffer failed: Operation not permitted", "(залежить від налаштувань системи; з sudo спрацює)"], "line-warn"), "warn"), false;
    case "git": return piGit(raw, args, hint);
    case "reboot": case "shutdown": case "poweroff": return piPower(raw, sudo, name, args, hint);
    case "dd": {
      if (!sudo) return H(raw, out("dd: failed to open '/dev/sda': Permission denied", "line-err"), "warn"), false;
      return H(raw, `<span class="line-err">⛔ Тренажер не виконує dd з of=/dev/….</span><br><span class="line-muted">dd пише байти на пристрій без питань: переплутаєш of=/dev/sda з of=/dev/mmcblk0 — затреш систему Pi. Для запису образу Raspberry Pi OS використовуй Raspberry Pi Imager на Mac; якщо dd — спершу lsblk і перевірка розміру та MOUNTPOINTS.</span>`, "danger");
    }
    case "mkfs.ext4": case "mkfs": case "fdisk": case "parted": {
      return H(raw, `<span class="line-err">⛔ Тренажер не виконує ${esc(name)}.</span><br><span class="line-muted">Форматування або зміна розділів знищує всі дані на розділі. Спершу lsblk: переконайся, що це флешка (sda), а не системна SD-карта (mmcblk0), і що важливе скопійовано.</span>`, "danger");
    }
  }
  if (sudo && !name) return false;
  const knownElsewhere = allCommands().find(c => c.split(" ")[0] === name || (c.startsWith("sudo ") && c.split(" ")[1] === name));
  printResult("Невідома команда", `${out(`-bash: ${name}: command not found`, "line-err")}<span class="line-muted">Тренажер не знає «${esc(raw)}»${knownElsewhere ? ` у такому вигляді. Спробуй точну команду зі списку, напр. «${esc(knownElsewhere)}»` : ". Спробуй команду зі списку зліва або man/apropos"}.</span>`, "warn");
  return false;
}

function piPath() { return (SIM.venv ? LED + "/.venv/bin:" : "") + "/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"; }

function piApt(raw, sudo, args, hint) {
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  const sub = args[0], pkg = args.filter(a => !a.startsWith("-"))[1];
  const needsRoot = ["update", "upgrade", "full-upgrade", "install", "remove", "purge", "autoremove"].includes(sub);
  if (needsRoot && !sudo) { printResult(raw, out(["E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)", "E: Unable to acquire the dpkg frontend lock, are you root?"], "line-err"), "warn", "Встановлення й оновлення змінюють систему — потрібен sudo."); return false; }
  switch (sub) {
    case "update": return H(out(["Hit:1 http://deb.debian.org/debian bookworm InRelease", "Hit:2 http://archive.raspberrypi.com/debian bookworm InRelease", "Reading package lists... Done", "Building dependency tree... Done", "3 packages can be upgraded. Run 'apt list --upgradable' to see them."]),
      "ok", hint || "update лише оновлює списки — нічого не встановлює. Назва випуску (bookworm) залежить від версії ОС.");
    case "upgrade": case "full-upgrade": return H(out(["Reading package lists... Done", "Calculating upgrade... Done", "The following packages will be upgraded:", "  libcamera0.2 raspi-firmware rpi-eeprom", "3 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.", "Do you want to continue? [Y/n] Y", "…", "Setting up rpi-eeprom … done"]), "warn",
      sub === "full-upgrade" ? "full-upgrade може видаляти й замінювати пакети заради залежностей — читай список перед Y." : "upgrade змінює систему: перед ним — update, після оновлення ядра/прошивки — перезавантаження.");
    case "install": {
      if (!pkg) break;
      if (pkg === "htop") { if (SIM.htop) return H(out("htop is already the newest version (3.2.2-2).")); SIM.htop = true; SIM.htopConf = true; }
      if (pkg === "python3-requests") SIM.requests = true;
      if (!["htop", "python3-requests", "git", "gpiod", "python3-gpiozero"].includes(pkg)) { printResult(raw, out(`E: Unable to locate package ${pkg}`, "line-err"), "warn", "Невірна назва або застарілі списки — спершу sudo apt update, потім apt search."); return false; }
      return H(out(["Reading package lists... Done", `The following NEW packages will be installed:\n  ${pkg}`, "0 upgraded, 1 newly installed, 0 to remove and 3 not upgraded.", `Setting up ${pkg} … done`]), "ok");
    }
    case "remove": case "purge": {
      if (pkg !== "htop") break;
      if (!SIM.htop && !(sub === "purge" && SIM.htopConf)) return H(out(`Package 'htop' is not installed, so not removed`), "ok");
      SIM.htop = false; if (sub === "purge") SIM.htopConf = false;
      return H(out(["The following packages will be REMOVED:", `  htop${sub === "purge" ? "*" : ""}`, "Do you want to continue? [Y/n] Y", `Removing htop …${sub === "purge" ? "\nPurging configuration files for htop …" : ""}`]), "warn",
        sub === "purge" ? "purge видаляє ще й конфіги — налаштування програми зникнуть." : "remove лишає файли налаштувань — повторне встановлення їх підхопить.");
    }
    case "search": return H(out(["Sorting... Done", "Full Text Search... Done", "htop/stable 3.2.2-2 arm64", "  interactive processes viewer"]));
    case "show": return H(out(["Package: " + (pkg || "htop"), "Version: 3.2.2-2", "Section: utils", "Description: interactive processes viewer"]));
    case "list": if (args.includes("--installed")) return H(out(["Listing... Done", "bash/stable,now 5.2.15-2+b7 arm64 [installed]", "git/stable,now 1:2.39.5-0+deb12u1 arm64 [installed]", SIM.htop ? "htop/stable,now 3.2.2-2 arm64 [installed]" : "nano/stable,now 7.2-1 arm64 [installed]", "python3/stable,now 3.11.2-1+b1 arm64 [installed]", "…"])); break;
  }
  printResult("Невідома команда", out(`(тренажер не знає «${raw}»)`, "line-muted"), "warn");
  return false;
}

function piPython(raw, args, hint) {
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  if (args[0] === "--version" || args[0] === "-V") return H(out(`Python 3.11.2`), "ok", hint || "Версія залежить від випуску Raspberry Pi OS.");
  if (args[0] === "-m" && args[1] === "venv" && args[2] === ".venv") {
    const base = resolvePath(".venv");
    mkdirp(base + "/bin"); F().files.set(base + "/bin/activate", "# activate\n"); SIM.venvCreated = true;
    return H(out("(у поточній папці створено .venv — окреме середовище для бібліотек цього проєкту)", "line-muted"));
  }
  if (args[0] === "-m" && args[1] === "pip") return piPip(raw, raw, args.slice(1), hint);
  if (args[0] === "main.py" || args[0] === "blink.py") {
    const abs = resolvePath(args[0]);
    if (!isFile(abs)) { printResult(raw, out(`python3: can't open file '${abs}': [Errno 2] No such file or directory`, "line-err"), "warn", "Перейди в папку проєкту: cd ~/projects/led-test"); return false; }
    if (args[0] === "blink.py") return H(out(["(GPIO17 блимає раз на секунду; Ctrl+C — зупинити)", "^C"]), "ok", "gpiozero на Pi 5 працює через бекенд lgpio; стара бібліотека RPi.GPIO на Pi 5 не працює (новий чип вводу-виводу RP1).");
    return H(out(fileLines(abs).map(l => { const m = l.match(/^print\("(.*)"\)$/); return m ? m[1] : l; })));
  }
  if (!args.length) return H(out(["Python 3.11.2 (main, …) [GCC 12.2.0] on linux", ">>> (інтерактивний режим; вихід — exit() або Ctrl+D)"]));
  printResult(raw, out("(тренажер знає python3 --version, python3 -m venv .venv, python3 main.py, python3 blink.py)", "line-muted"), "warn");
  return false;
}

function piPip(raw, canon, args, hint) {
  const sub = args[0], pkg = args[1];
  if (sub !== "install" || !pkg) { printResult(raw, out("(тренажер знає лише pip install <пакет>)", "line-muted"), "warn"); return false; }
  if (!SIM.venv) {
    printResult(raw, out(["error: externally-managed-environment", "", "× This environment is externally managed", "╰─> To install Python packages system-wide, try apt install", "    python3-xyz, where xyz is the package you are trying to", "    install.", "", "    If you wish to install a non-Debian-packaged Python package,", "    create a virtual environment using python3 -m venv path/to/venv.", "", "note: If you believe this is a mistake, please contact your Python installation or OS distribution provider. You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages."], "line-err"),
      "warn", "Raspberry Pi OS (Bookworm і новіші) блокує pip поза venv, щоб не зламати системний Python. Рішення: python3 -m venv .venv → source .venv/bin/activate → pip install … Або apt install python3-<пакет>.");
    return canon === "pip3 install requests" && state.currentModule === "python" ? true : false;
  }
  if (args.includes("--break-system-packages")) { printResult(raw, out("(у venv цей прапорець не потрібен)", "line-muted"), "warn"); return false; }
  return printResult(raw, out([`Collecting ${pkg}`, "  Downloading requests-2.32.3-py3-none-any.whl (64 kB)", "Installing collected packages: urllib3, idna, charset-normalizer, certifi, requests", `Successfully installed ${pkg}-2.32.3 …`]), "ok", "Пакет потрапив у .venv цього проєкту — системний Python не зачеплено."), true;
}

function piSystemctl(raw, sudo, args, hint) {
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  const s = SIM.svc;
  const sub = args[0];
  const unitArg = args.filter(a => !a.startsWith("-"))[1] || "";
  const unit = unitArg.replace(/\.service$/, "");
  if (sub === "daemon-reload") {
    if (!sudo) { printResult(raw, out("Failed to reload daemon: Access denied", "line-err"), "warn", "Потрібен sudo."); return false; }
    s.needReload = false; return H(out("(systemd перечитав unit-файли)", "line-muted"));
  }
  if (unit === "ssh" || unit === "sshd") {
    if (sub === "status") return H(out(["● ssh.service - OpenBSD Secure Shell server", "     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)", "     Active: active (running) since Wed 2026-09-16 06:12:01 EEST; 2 days ago"]));
    if (["stop", "disable", "mask"].includes(sub)) return H(`<span class="line-err">⛔ Тренажер не виконує ${esc(raw)}.</span><br><span class="line-muted">Ти підключений саме через SSH: зупиниш ssh — втратиш доступ до Pi, і повертати його доведеться з монітором і клавіатурою. Для свого сервісу — systemctl stop my-service.</span>`, "danger");
  }
  if (unit !== "my-service") { printResult(raw, out(unit ? `Unit ${unitArg}.service could not be found.` : "(вкажи сервіс: my-service)", "line-err"), "warn"); return false; }
  const mutating = ["start", "stop", "restart", "enable", "disable"].includes(sub);
  if (mutating && !sudo) { printResult(raw, out(["==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====", "Authentication is required to " + sub + " 'my-service.service'.", "(у тренажері — відмова; використовуй sudo)"], "line-err"), "warn"); return false; }
  const now = args.includes("--now");
  const warnReload = s.needReload ? ["Warning: The unit file changed on disk. Run 'systemctl daemon-reload' to reload units."] : [];
  switch (sub) {
    case "status": {
      const lines = [`● my-service.service - LED test service`,
        `     Loaded: loaded (/etc/systemd/system/my-service.service; ${s.enabled ? "enabled" : "disabled"}; preset: enabled)`,
        s.active ? "     Active: active (running) since Fri 2026-09-18 09:12:40 EEST; 18min ago" : "     Active: inactive (dead)",
        s.active ? "   Main PID: 1234 (python)" : ""].filter(Boolean).concat(warnReload,
        s.active ? ["", "Sep 18 09:12:40 raspberrypi systemd[1]: Started my-service.service - LED test service.", "Sep 18 09:12:41 raspberrypi python[1234]: [INFO] led-test started"] : []);
      return H(out(lines), "ok", hint || (s.enabled && !s.active ? "enabled, але inactive: автозапуск увімкнено, а зараз сервіс не працює — enable не запускає." : "Loaded: …; enabled/disabled — автозапуск. Active — чи працює зараз."));
    }
    case "is-enabled": return H(out(s.enabled ? "enabled" : "disabled"));
    case "is-active": return H(out(s.active ? "active" : "inactive"));
    case "enable": {
      const was = s.enabled; s.enabled = true; if (now) s.active = true;
      return H(out((was ? [] : ["Created symlink /etc/systemd/system/multi-user.target.wants/my-service.service → /etc/systemd/system/my-service.service."])
        .concat(warnReload, [now ? "(автозапуск увімкнено і сервіс запущено зараз)" : `(автозапуск увімкнено; зараз сервіс ${s.active ? "працює" : "НЕ запущено — inactive (dead)"})`])),
        "ok", hint || (now ? "enable --now = enable + start." : "enable лише створює посилання для автозапуску при завантаженні. Щоб запустити зараз — start або enable --now."));
    }
    case "disable": {
      s.enabled = false; if (now) s.active = false;
      return H(out(["Removed \"/etc/systemd/system/multi-user.target.wants/my-service.service\".", `(автозапуск вимкнено; зараз сервіс ${s.active ? "далі працює — disable його не зупиняє" : "не працює"})`]), "warn");
    }
    case "start": s.active = true; return H(out(warnReload.concat(["(сервіс запущено; перевір: systemctl status my-service)"]), warnReload.length ? "line-warn" : "line-muted"));
    case "restart": s.active = true; return H(out(warnReload.concat(["(сервіс перезапущено — новий код підхоплено)"]), warnReload.length ? "line-warn" : "line-muted"));
    case "stop": s.active = false; return H(out(`(сервіс зупинено; автозапуск ${s.enabled ? "лишився увімкненим — після reboot він стартує знову" : "вимкнено"})`, "line-muted"), "warn");
  }
  printResult(raw, out("(тренажер знає status, start, stop, restart, enable, enable --now, disable, is-enabled, daemon-reload)", "line-muted"), "warn");
  return false;
}

function piJournal(raw, args, hint) {
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  const svc = [
    "Sep 18 09:12:40 raspberrypi systemd[1]: Started my-service.service - LED test service.",
    "Sep 18 09:12:41 raspberrypi python[1234]: [INFO] led-test started",
    "Sep 18 09:12:44 raspberrypi python[1234]: [ERROR] sensor timeout",
    "Sep 18 09:12:44 raspberrypi python[1234]: Traceback (most recent call last):",
    "Sep 18 09:12:44 raspberrypi python[1234]:   File \"/home/stanislav/projects/led-test/main.py\", line 12, in <module>",
    "Sep 18 09:12:44 raspberrypi python[1234]: TimeoutError: sensor did not answer in 2 s",
    "Sep 18 09:12:49 raspberrypi systemd[1]: my-service.service: Scheduled restart job, restart counter is at 1.",
    "Sep 18 09:12:50 raspberrypi python[1301]: [INFO] led-test started"];
  if (args.includes("-u") || args.includes("-fu")) {
    const nIdx = args.indexOf("-n");
    const n = nIdx >= 0 ? +args[nIdx + 1] : (args.find(a => /^-n\d+$|^--lines=/.test(a)) || "").replace(/\D/g, "") || null;
    if (args.includes("-f") || args.includes("-fu")) return H(out(svc.slice(-4).concat(["… (стежу за новими рядками; Ctrl+C — вийти, сервіс працює далі)"])));
    return H(out(["-- Logs begin at Wed 2026-09-16 06:11:58 EEST. --"].concat(n ? svc.slice(-Math.min(+n, svc.length)) : svc)), "ok", hint || "Шукай Traceback і рядок під ним — там причина.");
  }
  if (args.includes("-xe")) return H(out(["Sep 18 09:12:44 raspberrypi python[1234]: TimeoutError: sensor did not answer in 2 s", "Sep 18 09:12:44 raspberrypi systemd[1]: my-service.service: Main process exited, code=exited, status=1/FAILURE",
    "░░ Subject: Unit process exited", "░░ An ExecStart= process belonging to unit my-service.service has exited.", "Sep 18 09:12:44 raspberrypi systemd[1]: my-service.service: Failed with result 'exit-code'."]));
  if (args.includes("--since")) return H(out(["Sep 18 00:00:03 raspberrypi systemd[1]: Starting logrotate.service …", "Sep 18 06:25:11 raspberrypi NetworkManager[812]: <info> wlan0: DHCP lease renewed", "Sep 18 09:12:44 raspberrypi python[1234]: [ERROR] sensor timeout", "…"]));
  return H(out(svc));
}

function piGit(raw, args, hint) {
  const H = (body, type = "ok", h = hint) => { printResult(raw, body, type, h); return true; };
  const sub = args[0];
  if (sub === "--version") return H(out("git version 2.39.5"), "ok", hint || "Версія залежить від випуску ОС. Немає git — sudo apt install git.");
  if (sub === "clone") {
    const url = args[1] || "";
    if (!/^https:\/\/github\.com\/stanislav\/weather-station(\.git)?$/.test(url)) { printResult(raw, out(`fatal: repository '${url}' not found`, "line-err"), "warn"); return false; }
    const root = CWD() + "/weather-station";
    if (exists(root)) { printResult(raw, out("fatal: destination path 'weather-station' already exists and is not an empty directory.", "line-err"), "warn", "Репозиторій уже клоновано — перейди в нього: cd weather-station"); return false; }
    mkdirp(root + "/.git"); F().files.set(root + "/config.py", "CITY = \"Kyiv\"\nINTERVAL = 600\n"); F().files.set(root + "/main.py", "print(\"weather\")\n"); F().files.set(root + "/README.md", "# weather-station\n");
    SIM.git = { root, modified: new Set(), staged: new Set(), ahead: 0, commits: ["9f1c2ab Add sensor reading", "4d7e0f1 Initial commit"] };
    return H(out(["Cloning into 'weather-station'...", "remote: Enumerating objects: 24, done.", "Receiving objects: 100% (24/24), 6.10 KiB | 1.5 MiB/s, done."]));
  }
  const g = SIM.git;
  if (!g || !(CWD() === g.root || CWD().startsWith(g.root + "/"))) { printResult(raw, out("fatal: not a git repository (or any of the parent directories): .git", "line-err"), "warn", "Спершу git clone … і cd weather-station."); return false; }
  switch (sub) {
    case "status": {
      const l = ["On branch main", g.ahead ? `Your branch is ahead of 'origin/main' by ${g.ahead} commit.` : "Your branch is up to date with 'origin/main'.", ""];
      if (g.staged.size) l.push("Changes to be committed:", ...[...g.staged].map(f => `\tmodified:   ${f}`), "");
      if (g.modified.size) l.push("Changes not staged for commit:", ...[...g.modified].map(f => `\tmodified:   ${f}`), "");
      if (!g.staged.size && !g.modified.size) l.push("nothing to commit, working tree clean");
      return H(out(l));
    }
    case "diff": return H(g.modified.size ? out(["diff --git a/config.py b/config.py", "--- a/config.py", "+++ b/config.py", "@@ -1,2 +1,2 @@", " CITY = \"Kyiv\"", "-INTERVAL = 600", "+INTERVAL = 300"]) : out("(змін немає — порожній вивід)", "line-muted"));
    case "restore": {
      const f = args[1];
      if (!f || !isFile(resolvePath(f))) { printResult(raw, out(`error: pathspec '${f || ""}' did not match any file(s) known to git`, "line-err"), "warn"); return false; }
      if (g.modified.has(f)) { g.modified.delete(f); F().files.set(resolvePath(f), "CITY = \"Kyiv\"\nINTERVAL = 600\n"); return H(out("(незакомічені зміни в config.py скасовано — назавжди)", "line-warn"), "warn", "restore повертає файл до останнього коміту. Непідтверджені правки зникають без кошика."); }
      return H(out("(змін не було — нічого не змінилося)", "line-muted"));
    }
    case "add": g.modified.forEach(f => g.staged.add(f)); g.modified.clear(); return H(out("(зміни додано в staging)", "line-muted"));
    case "commit": {
      if (!g.staged.size) { printResult(raw, out("nothing to commit, working tree clean", "line-muted"), "warn", "Спершу зміни файл і git add ."); return false; }
      g.staged.clear(); g.ahead++; g.commits.unshift("b3e8d21 Update config");
      return H(out(["[main b3e8d21] Update config", " 1 file changed, 1 insertion(+), 1 deletion(-)"]));
    }
    case "push": {
      if (!g.ahead) return H(out("Everything up-to-date"), "ok");
      g.ahead = 0; return H(out(["To github.com:stanislav/weather-station.git", "   9f1c2ab..b3e8d21  main -> main"]));
    }
    case "pull": return H(out("Already up to date."), "ok", hint || "На Pi як робочому вузлі: git pull → sudo systemctl restart my-service → journalctl -u my-service -f.");
    case "log": return H(out(g.commits));
  }
  printResult(raw, out(`(тренажер не знає «${raw}»)`, "line-muted"), "warn");
  return false;
}

function piPower(raw, sudo, name, args, hint) {
  if (!sudo) { printResult(raw, out(["Call to Reboot failed: Access denied", "(потрібен sudo)"], "line-err"), "warn"); return false; }
  const cancel = args.includes("-c");
  const later = args.some(a => /^\+?\d+$/.test(a)) && !args.includes("now");
  if (cancel) {
    const was = SIM.shutdownPlanned; SIM.shutdownPlanned = false;
    printResult(raw, out(was ? "(заплановане вимкнення/перезавантаження скасовано)" : "(нічого не заплановано — скасовувати нічого)", "line-muted"), "ok", UK_HINTS["sudo shutdown -c"]); return true;
  }
  if (later) {
    SIM.shutdownPlanned = true;
    printResult(raw, out(["Reboot scheduled for Fri 2026-09-18 09:36:07 EEST, use 'shutdown -c' to cancel."], "line-warn"), "warn", "Відкладений варіант дає час зберегти файли й попередити інших. Скасувати: sudo shutdown -c"); return true;
  }
  const off = name === "poweroff" || (name === "shutdown" && !args.includes("-r"));
  SIM.host = "mac"; SIM.venv = false;
  if (off) SIM.piOn = false;
  updatePrompt();
  printResult(raw, `${out(["Connection to raspberrypi.local closed by remote host.", "Connection to raspberrypi.local closed."], "line-err")}<span class="line-muted">${off
    ? "Pi вимкнулася. SSH більше не працює; увімкнути Pi 5 — кнопкою живлення на платі або перепідключенням живлення (у тренажері — «Скинути файли» чи інший розділ). Ти знову на Mac."
    : "Pi перезавантажується (~30–60 с). SSH-сесію обірвано — ти знову на Mac. Незбережені файли в nano і незавершений apt upgrade могли зіпсуватися."}</span>`, "danger", UK_HINTS[canonOf(raw)]);
  return true;
}

function handleCommand(cmd) { return SIM.host === "pi" ? runPi(cmd) : runMac(cmd); }

function execute(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  if (state.testMode.active) { handleTestAnswer(cmd); return; }
  state.history.push(cmd);
  state.histIdx = state.history.length;
  const wasHost = SIM.host;
  beginView(cmd);
  const cur = getCurrentCommands();
  const listed = cur.find(c => normalizeCommand(c) === normalizeCommand(cmd)) || cur.find(c => matches(cmd, c));
  if (!listed) {
    const owner = MODULE_LIST.find(m => m.commands.some(c => matches(cmd, c[0])));
    if (owner && owner.id !== state.currentModule) print(`<span class="line-warn">Ця команда — з розділу «${esc(owner.title)}». Тут вона не зараховується.</span>`);
  }
  const ok = handleCommand(cmd);
  if (ok === "clear") { if (listed) markTried(listed); return; }
  flushView(`${wasHost === "pi" ? "Pi $" : "Mac %"} · ${getModule().title} · ${cmd}`);
  if (ok === true && listed) markTried(listed);
}

function markTried(listed) {
  getTried().add(listed);
  saveProgress();
  updateProgress();
  updateModuleNav();
}

/* ---------- тест-режим ---------- */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function buildTestQueue() {
  const seenHint = new Set();
  return shuffleArray(allCommands().filter(c => UK_HINTS[c] && !seenHint.has(UK_HINTS[c]) && seenHint.add(UK_HINTS[c])).map(c => ({ cmd: c, hint: UK_HINTS[c] })));
}
function updateTestButton() {
  const btn = $("btnTest"), skip = $("btnSkip");
  btn.textContent = state.testMode.active ? "Зупинити тест" : "Режим тестування";
  btn.classList.toggle("active", state.testMode.active);
  btn.setAttribute("aria-pressed", state.testMode.active ? "true" : "false");
  skip.hidden = !state.testMode.active;
}
function showTestQuestion() {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  if (!q) { finishTestMode(); return; }
  tm.answered = false;
  beginView(null);
  printResult(`Тест ${tm.index + 1}/${tm.queue.length}`, `
    <div class="test-question">Яка команда: <em>${esc(q.hint)}</em></div>
    <span class="line-muted">Введи команду і Enter або натисни «Пропустити». Правильно: ${tm.correct}, помилок: ${tm.wrong}</span>`, "purple");
  flushView(`Тест · ${tm.index + 1}/${tm.queue.length}`);
}
function startTestMode() {
  state.testMode = { active: true, queue: buildTestQueue(), index: 0, correct: 0, wrong: 0, answered: false };
  updateTestButton();
  showTestQuestion();
  cmdInput.focus();
}
function stopTestMode() { state.testMode.active = false; updateTestButton(); welcome(); }
function finishTestMode() {
  const tm = state.testMode;
  beginView(null);
  printResult("Тест завершено", `<span class="line-ok">Правильно: ${tm.correct}</span><br><span class="line-warn">Помилок / пропущено: ${tm.wrong}</span>`, "ok");
  flushView("Тест завершено");
  state.testMode.active = false;
  updateTestButton();
}
function nextTestQuestion() { state.testMode.index++; showTestQuestion(); }
function handleTestAnswer(cmd) {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  if (!q || tm.answered) return;
  tm.answered = true;
  beginView(cmd);
  if (matches(cmd, q.cmd)) { tm.correct++; printResult("✓ Правильно!", `<span class="line-ok">${esc(q.cmd)}</span>`, "ok", q.hint); }
  else { tm.wrong++; printResult("✗ Ні", `<span class="line-err">Очікувалось: ${esc(q.cmd)}</span>`, "warn", q.hint); }
  flushView(`Тест · ${tm.correct}✓ ${tm.wrong}✗`);
  setTimeout(() => { if (state.testMode.active && state.testMode.queue[tm.index] === q) nextTestQuestion(); }, 1500);
}
function skipTestQuestion() {
  const tm = state.testMode;
  if (!tm.active) return;
  const q = tm.queue[tm.index];
  if (q && !tm.answered) {
    tm.wrong++;
    beginView(null);
    printResult("Пропущено", `<span class="line-muted">Відповідь: </span><span class="line-cmd">${esc(q.cmd)}</span>`, "warn", q.hint);
    flushView("Тест · пропущено");
  }
  nextTestQuestion();
  cmdInput.focus();
}

/* ---------- модалка сценаріїв ---------- */
const modal = $("scenarioModal");
let lastFocus = null;
function openScenarioModal() {
  const list = $("scenarioList");
  state.selectedScenario = SCENARIOS.find(s => s.moduleId === state.currentModule) || SCENARIOS[0];
  list.innerHTML = SCENARIOS.map(s => `
    <button type="button" class="scenario-item${s.moduleId === state.selectedScenario.moduleId ? " selected" : ""}" data-id="${s.id}" aria-pressed="${s.moduleId === state.selectedScenario.moduleId}">
      <strong>${esc(s.title)}</strong>
      <small>${esc(s.desc)} · ${s.commands} команд</small>
    </button>`).join("");
  list.querySelectorAll(".scenario-item").forEach(el => {
    el.addEventListener("click", () => {
      list.querySelectorAll(".scenario-item").forEach(x => { x.classList.remove("selected"); x.setAttribute("aria-pressed", "false"); });
      el.classList.add("selected"); el.setAttribute("aria-pressed", "true");
      state.selectedScenario = SCENARIOS.find(s => s.id === +el.dataset.id);
    });
  });
  lastFocus = document.activeElement;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  (list.querySelector(".selected") || list.querySelector("button")).focus();
}
function closeScenarioModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function confirmScenario() {
  if (state.selectedScenario) switchModule(state.selectedScenario.moduleId);
  closeScenarioModal();
}

/* ---------- init ---------- */
if (/[?&]embed=1/.test(location.search)) document.body.classList.add("embed");

$("cmdForm").addEventListener("submit", e => {
  e.preventDefault();
  execute(cmdInput.value);
  cmdInput.value = "";
});
cmdInput.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (state.histIdx > 0) { state.histIdx--; cmdInput.value = state.history[state.histIdx] || ""; }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.histIdx < state.history.length - 1) { state.histIdx++; cmdInput.value = state.history[state.histIdx] || ""; }
    else { state.histIdx = state.history.length; cmdInput.value = ""; }
  } else if (e.key === "Tab" && !e.shiftKey) {
    // Автодоповнення лише коли є що доповнити; інакше Tab переводить фокус далі (без пастки).
    const val = cmdInput.value;
    if (!val.trim()) return;
    const match = getCurrentCommands().find(c => c.startsWith(val) && c !== val);
    if (match) { e.preventDefault(); cmdInput.value = match; }
  }
});
$("btnTest").addEventListener("click", () => { state.testMode.active ? stopTestMode() : startTestMode(); });
$("btnSkip").addEventListener("click", skipTestQuestion);
$("btnScenario").addEventListener("click", openScenarioModal);
$("btnReset").addEventListener("click", () => { initFS(); applyModuleContext(getModule()); welcome(); });
$("btnResetProgress").addEventListener("click", () => {
  if (!confirm("Скинути прогрес усіх розділів тренажера?")) return;
  Object.keys(state.triedByModule).forEach(k => state.triedByModule[k].clear());
  saveProgress(); buildChecklist();
});
$("scenarioConfirm").addEventListener("click", confirmScenario);
$("scenarioCancel").addEventListener("click", closeScenarioModal);
modal.addEventListener("click", e => { if (e.target === modal) closeScenarioModal(); });
modal.addEventListener("keydown", e => {
  if (e.key === "Escape") { e.preventDefault(); closeScenarioModal(); return; }
  if (e.key === "Enter" && e.target.id !== "scenarioCancel") {
    e.preventDefault();
    if (e.target.classList && e.target.classList.contains("scenario-item")) e.target.click();
    confirmScenario();
    return;
  }
  if (e.key === "Tab") {
    const f = [...modal.querySelectorAll("button")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

initFS();
loadProgress();
applyModuleContext(getModule());
buildChecklist();
welcome();
