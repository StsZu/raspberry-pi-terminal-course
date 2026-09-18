window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m09", order: 9, title: "Логи і діагностика", subtitle: "journalctl, dmesg і grep: знайти, чому зламалось", icon: "troubleshoot",
  goal: "Після модуля ти знаходиш причину падіння сервісу в журналі, стежиш за логами наживо, читаєш повідомлення ядра і відрізняєш помилку коду від проблеми заліза чи живлення.",
  lessons: [
    {
      id: "m09-l01", title: "Сервіс впав: читаємо журнал", minutes: 13,
      steps: [
        { type: "story", title: "failed — і більше нічого",
          body: "<p><code>systemctl status my-service</code> показує червоне <code>failed</code>. Скрипт на Mac працював, на Pi — ні. Гадати можна довго, але відповідь уже записана: усе, що сервіс надрукував перед смертю, лежить у журналі.</p><p>Навчимося його читати.</p>" },
        { type: "concept", title: "Де Linux зберігає логи",
          body: "<ul><li><strong>Журнал systemd</strong> (journal) — вивід усіх сервісів і системи; читається <code>journalctl</code>.</li><li><strong>Кільцевий буфер ядра</strong> — повідомлення драйверів: USB, SD-карта, живлення; читається <code>dmesg</code>.</li><li><strong>Текстові файли</strong> у <code>/var/log/</code>. Файла <code>/var/log/syslog</code> у новіших Raspberry Pi OS може не бути — залежить від версії; журнал є завжди.</li></ul>",
          analogy: "Журнал systemd — як бортовий журнал корабля: кожна подія записана з часом і ім'ям того, хто її зробив. `journalctl -u my-service` — це попросити сторінки лише про одного члена екіпажу, а `-f` — стояти поруч і читати нові записи, щойно їх пишуть." },
        { type: "cli", title: "Логи одного сервісу",
          commands: [
            { cmd: "journalctl -u my-service -n 50", explain: "Останні 50 рядків журналу сервісу <code>my-service</code>. Тут шукай <code>Traceback</code> Python.", output: "Sep 18 10:05:02 raspberrypi python[1234]: Traceback (most recent call last):\nSep 18 10:05:02 raspberrypi python[1234]:   File \"/home/stanislav/projects/my-service/main.py\", line 3, in <module>\nSep 18 10:05:02 raspberrypi python[1234]:     import requests\nSep 18 10:05:02 raspberrypi python[1234]: ModuleNotFoundError: No module named 'requests'\nSep 18 10:05:02 raspberrypi systemd[1]: my-service.service: Failed with result 'exit-code'.", risk: "low" },
            { cmd: "journalctl -u my-service -f", explain: "Показує нові рядки наживо (follow). <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span> зупиняє лише перегляд — сервіс працює далі.", risk: "low" },
            { cmd: "journalctl -u my-service --since today", explain: "Лише записи за сьогодні — коли журнал за тиждень занадто довгий.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: останні 50 рядків",
          task: "Виведи останні 50 рядків журналу сервісу `my-service`.",
          expected: ["journalctl -u my-service -n 50", "journalctl -u my-service.service -n 50", "journalctl -n 50 -u my-service", "journalctl -n 50 -u my-service.service", "journalctl -u my-service -n50", "journalctl -u my-service --lines=50", "sudo journalctl -u my-service -n 50"],
          output: "Sep 18 10:05:02 raspberrypi python[1234]: Traceback (most recent call last):\nSep 18 10:05:02 raspberrypi python[1234]:   File \"/home/stanislav/projects/my-service/main.py\", line 3, in <module>\nSep 18 10:05:02 raspberrypi python[1234]: ModuleNotFoundError: No module named 'requests'\nSep 18 10:05:02 raspberrypi systemd[1]: my-service.service: Main process exited, code=exited, status=1/FAILURE\nSep 18 10:05:02 raspberrypi systemd[1]: my-service.service: Failed with result 'exit-code'.",
          hint: "Прапорець вибору сервісу (unit) плюс прапорець кількості рядків.",
          explain: "`ModuleNotFoundError` — сервіс запускається не тим Python: бібліотека стоїть у venv, а `ExecStart` вказує на системний. Виправ шлях, `daemon-reload`, `restart`." },
        { type: "check", title: "Вийти з -f",
          question: "Ти дивишся `journalctl -u my-service -f` і натискаєш Ctrl+C. Що станеться із сервісом?",
          options: ["Сервіс зупиниться", "Нічого: зупиниться лише перегляд логу, сервіс працює далі", "Сервіс перезапуститься"], correct: 1,
          feedback: "`journalctl` лише читає журнал. Ctrl+C закриває читача, а не сервіс — ним керує systemd." },
        { type: "cli", title: "Фільтри і ширша картина",
          commands: [
            { cmd: "journalctl -u my-service | grep -i error", explain: "Лише рядки зі словом error у будь-якому регістрі (<code>-i</code>). Так само шукають <code>Traceback</code> чи <code>failed</code>.", risk: "low" },
            { cmd: "journalctl -xe", explain: "Кінець загального журналу з поясненнями (<code>-x</code>) — перше, куди дивитися, коли «щось зламалось», але не знаєш що.", risk: "low" },
            { cmd: "sudo dmesg | tail -50", explain: "Останні повідомлення ядра: USB, SD-карта, undervoltage. Без <code>sudo</code> може бути <code>Operation not permitted</code> — залежить від налаштувань системи.", output: "[ 8123.45] usb 1-1: USB disconnect, device number 3\n[ 8125.02] usb 1-1: new high-speed USB device number 4 using xhci-hcd\n[ 8125.20] usb-storage 1-1:1.0: USB Mass Storage device detected", risk: "low" },
            { cmd: "vcgencmd get_throttled", explain: "Коли збої «дивні» (зникає USB, псується SD) — перевір живлення. <code>0x0</code> — проблем не було.", output: "throttled=0x50000", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: лише помилки",
          task: "Виведи з журналу сервісу `my-service` тільки рядки, що містять слово error в будь-якому регістрі.",
          expected: ["journalctl -u my-service | grep -i error", "journalctl -u my-service.service | grep -i error", "journalctl -u my-service | grep -i \"error\"", "journalctl -u my-service | grep -i 'error'", "journalctl -u my-service | grep error -i"],
          output: "Sep 18 10:05:02 raspberrypi python[1234]: ERROR: sensor read failed\nSep 18 10:07:41 raspberrypi python[1301]: Error: timeout reading GPIO17",
          hint: "Передай вивід журналу сервісу через `|` у фільтр рядків з прапорцем «без урахування регістру».",
          explain: "`grep -i` знайшов і `ERROR`, і `Error`. Без `-i` один з рядків загубився б." },
        { type: "check", title: "Код чи залізо",
          question: "Pi раз на кілька годин губить USB-диск, у `dmesg` — `USB disconnect`, а `vcgencmd get_throttled` показує не `0x0`. Що перевірити першим?",
          options: ["Блок живлення і кабель — Pi фіксувала проблеми з живленням", "Код Python-сервісу", "Налаштування Wi-Fi"],
          correct: 0, feedback: "Ненульове `get_throttled` означає, що були undervoltage або троттлінг. Слабке живлення — часта причина відвалу USB на Pi 5." },
        { type: "summary", title: "Підсумок",
          points: ["Сервіс впав → `systemctl status`, потім `journalctl -u my-service -n 50` і шукай `Traceback`.", "`-f` — логи наживо; Ctrl+C закриває лише перегляд.", "`grep -i error` фільтрує помилки; `journalctl -xe` — загальна картина.", "`dmesg` і `vcgencmd get_throttled` — для проблем заліза й живлення.", "`/var/log/syslog` є не на кожній версії ОС — журнал systemd є завжди."] }
      ],
      glossary: [
        { term: "journal", def: "Журнал systemd: вивід сервісів і системи з часом і джерелом кожного рядка." },
        { term: "journalctl", def: "Утиліта для читання журналу; `-u` — сервіс, `-n` — кількість рядків, `-f` — наживо." },
        { term: "dmesg", def: "Повідомлення ядра Linux: драйвери, USB, диски, живлення." },
        { term: "Traceback", def: "Звіт Python про помилку: де саме в коді і яке виключення сталося." },
        { term: "grep", def: "Фільтр рядків за шаблоном; `-i` — без урахування регістру." }
      ],
      quiz: [
        { question: "Сервіс у стані `failed`. Яка команда найшвидше покаже, чому він упав?", options: ["`journalctl -u my-service -n 50`", "`dmesg | tail -50`", "`uptime`"], correct: 0, feedback: "Причину падіння сервіс друкує у свій журнал — його читають через `journalctl -u`. `dmesg` про ядро, `uptime` — про час роботи." },
        { question: "У журналі сервісу бачиш `ModuleNotFoundError: No module named 'requests'`, хоча у venv бібліотека є. Що найімовірніше не так?", options: ["Бракує інтернету", "`ExecStart` запускає системний Python, а не python з `.venv`", "Файл журналу пошкоджено"], correct: 1, feedback: "Сервіс не активує venv сам. У `ExecStart` має бути повний шлях до `.venv/bin/python`." },
        { question: "Навіщо `-f` у `journalctl -u my-service -f`?", options: ["Примусово перезапустити сервіс", "Видалити старі записи", "Показувати нові рядки в міру появи"], correct: 2, feedback: "`-f` (follow) тримає журнал відкритим і дописує нові рядки — зручно під час тесту. Сервіс він не чіпає." },
        { question: "На свіжій Raspberry Pi OS `tail -f /var/log/syslog` каже `No such file or directory`. Що це означає?", options: ["Логи вимкнено, діагностика неможлива", "На цій версії ОС системні логи ведуться лише в журналі — читай їх `journalctl`", "SD-карта пошкоджена"], correct: 1, feedback: "Наявність `syslog` залежить від версії ОС. Журнал systemd є завжди: `journalctl -f` робить те саме." },
        { question: "`dmesg` відповідає `Operation not permitted`. Як бути?", options: ["Перевстановити ОС", "Вимкнути захист ядра назавжди", "Запустити `sudo dmesg`"], correct: 2, feedback: "Доступ до буфера ядра може бути обмежений для звичайного користувача. `sudo dmesg` лише читає — ризик низький." },
        { question: "Чим `journalctl -u my-service | grep -i error` кращий за просте гортання журналу?", options: ["Показує лише рядки з error у будь-якому регістрі — помилку видно одразу", "Виправляє знайдені помилки", "Очищає журнал від помилок"], correct: 0, feedback: "`grep` лише фільтрує вивід. Журнал не змінюється, а `-i` ловить і `ERROR`, і `Error`." }
      ]
    }
  ]
});
