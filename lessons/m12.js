window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m12", order: 12, title: "Щоденна практика", subtitle: "Перевірка Pi за 5 хвилин і план на 14 днів", icon: "school",
  goal: "Після модуля ти за кілька хвилин перевіряєш здоров'я Pi і свого сервісу, знаєш, з чого починати діагностику, і маєш план закріплення на два тижні.",
  lessons: [
    {
      id: "m12-l01", title: "Ранкова перевірка Pi за 5 хвилин", minutes: 12,
      steps: [
        { type: "story", title: "Pi працює сама — поки не перестане",
          body: "<p>Твій <code>my-service</code> тихо працює на Pi тижнями. Але одного дня датчик мовчить: чи то SD-карта заповнилась, чи блок живлення слабкий, чи скрипт упав уночі.</p><p>П'ять хвилин щоденної перевірки ловлять такі проблеми раніше, ніж вони стануть аварією. Цей урок збирає команди з усього курсу в одну коротку рутину.</p>" },
        { type: "concept", title: "Рутина від загального до конкретного",
          body: "<p>Порядок перевірки: <strong>зв'язок</strong> (<code>ssh</code>) → <strong>залізо</strong> (температура, живлення) → <strong>ресурси</strong> (диск, пам'ять) → <strong>твій сервіс</strong> (статус, логи) → <strong>оновлення</strong>.</p><p>Так ти не шукаєш помилку в Python-коді, коли насправді винен перегрів чи заповнений диск.</p>",
          analogy: "Це як огляд пілота перед вильотом: він не починає з меню в салоні, а по черзі дивиться паливо, двигуни, прилади. Короткий чекліст щодня — і ніщо важливе не пропущено." },
        { type: "cli", title: "Зв'язок, залізо, ресурси",
          commands: [
            { cmd: "ssh stanislav@raspberrypi.local", explain: "З Mac заходиш на Pi. Далі все виконується вже на Pi (запрошення <code>stanislav@raspberrypi:~ $</code>).", risk: "low" },
            { cmd: "vcgencmd measure_temp", explain: "Температура процесора. Без навантаження зазвичай 40–60 °C; якщо тримається біля 80 °C — перевір охолодження.", output: "temp=47.2'C", risk: "low" },
            { cmd: "vcgencmd get_throttled", explain: "Чи були проблеми з живленням або перегрівом з моменту ввімкнення. <code>0x0</code> — усе гаразд.", output: "throttled=0x0", risk: "low" },
            { cmd: "df -h", explain: "Вільне місце. Розділ <code>/</code> заповнений на 90 %+ — час чистити логи чи старі файли.", output: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/mmcblk0p2   59G   12G   45G  22% /", risk: "low" },
            { cmd: "free -h", explain: "Пам'ять. Дивись на стовпчик <code>available</code>, а не <code>free</code>.", output: "               total        used        free      shared  buff/cache   available\nMem:           7.9Gi       1.2Gi       5.1Gi        48Mi       1.7Gi       6.7Gi", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: живлення в нормі?",
          task: "Pi кілька разів «підвисала» вночі. Перевір, чи фіксувала вона проблеми з живленням або перегрів.",
          expected: ["vcgencmd get_throttled"],
          output: "throttled=0x50000",
          hint: "Та сама утиліта `vcgencmd`, що й для температури, але запит про «пригальмовування».",
          explain: "Не `0x0` — з моменту ввімкнення були недостатня напруга й пригальмовування. Найчастіша причина на Pi 5 — слабкий блок живлення чи тонкий кабель USB-C." },
        { type: "check", title: "Що означає throttled",
          question: "`vcgencmd get_throttled` показує не `0x0`, а температура зараз 45 °C. Що перевірити насамперед?",
          options: ["Код `main.py`", "Блок живлення і кабель", "Налаштування Wi-Fi"],
          correct: 1, feedback: "Температура в нормі, тож найімовірніша причина — недостатнє живлення. Від нього страждають USB, SD-карта і стабільність загалом, а не код." },
        { type: "cli", title: "Твій сервіс і оновлення",
          commands: [
            { cmd: "systemctl status my-service", explain: "Чи працює сервіс (<code>active (running)</code>), з якого часу, чи вмикається при старті (<code>enabled</code>).", output: "● my-service.service - My Raspberry Pi Python Service\n     Loaded: loaded (/etc/systemd/system/my-service.service; enabled)\n     Active: active (running) since Fri 2026-09-18 07:02:11 EEST; 3h ago", risk: "low" },
            { cmd: "journalctl -u my-service -n 20", explain: "Останні 20 рядків логу сервісу — шукай <code>Traceback</code>, <code>Error</code>.", risk: "low" },
            { cmd: "sudo apt update", explain: "Оновлює список доступних пакетів. Самі пакети не встановлює — це робить <code>sudo apt upgrade</code> у зручний час.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: останні рядки логу",
          task: "Датчик мовчить з ночі. Покажи останні 20 рядків журналу сервісу `my-service`.",
          expected: [
            "journalctl -u my-service -n 20",
            "journalctl -n 20 -u my-service",
            "journalctl -u my-service -n20",
            "journalctl -u my-service.service -n 20",
            "journalctl -u my-service --lines=20",
            "journalctl -u my-service --lines 20"
          ],
          output: "Sep 18 03:14:07 raspberrypi python3[812]: Traceback (most recent call last):\nSep 18 03:14:07 raspberrypi python3[812]:   File \"/home/stanislav/projects/my-service/main.py\", line 14, in <module>\nSep 18 03:14:07 raspberrypi python3[812]: OSError: [Errno 121] Remote I/O error\nSep 18 03:14:07 raspberrypi systemd[1]: my-service.service: Main process exited, code=exited, status=1/FAILURE\nSep 18 03:14:17 raspberrypi systemd[1]: my-service.service: Scheduled restart job, restart counter is at 1.",
          hint: "Журнал systemd, фільтр за юнітом `-u` і кількість рядків `-n`.",
          explain: "О 03:14 скрипт упав на помилці вводу-виводу датчика, а `Restart=always` його перезапустив. Далі — перевірити дроти датчика і `vcgencmd get_throttled`." },
        { type: "check", title: "З чого почати",
          question: "`systemctl status my-service` показує `failed`. Яка наступна команда дасть найбільше інформації?",
          options: ["`sudo reboot`", "`sudo apt upgrade`", "`journalctl -u my-service -n 50`"],
          correct: 2, feedback: "Статус каже «що», а лог — «чому». Reboot і оновлення лише приховають причину або додадуть нових змінних." },
        { type: "callout", variant: "tip", title: "План на 14 днів",
          body: "<p>Щодня 20–30 хвилин, 5–7 команд, три вправи й одне контрольне питання.</p><table><thead><tr><th>Дні</th><th>Тема</th></tr></thead><tbody><tr><td>1–4</td><td>SSH, навігація, файли, PATH і довідка</td></tr><tr><td>5–8</td><td>apt, мережа, стан системи, процеси</td></tr><tr><td>9–10</td><td>Python у venv, GPIO: <code>pinout</code> без підключення заліза</td></tr><tr><td>11–13</td><td>systemd, логи, Git і <code>rsync</code> з Mac</td></tr><tr><td>14</td><td>фінал: сервіс з <code>enable --now</code>, потім <code>sudo reboot</code> і перевірка, що він піднявся сам</td></tr></tbody></table>" },
        { type: "check", title: "Фінальна перевірка",
          question: "День 14: після `sudo reboot` ти зайшов по SSH, і `systemctl status my-service` показує `inactive (dead)`, `disabled`. Чого бракує?",
          options: ["Автозапуску: `sudo systemctl enable --now my-service`", "Ще одного `git pull`", "Нового venv"],
          correct: 0, feedback: "`disabled` означає, що systemd не запускає сервіс при старті. `enable --now` вмикає автозапуск і одразу запускає сервіс." },
        { type: "summary", title: "Підсумок",
          points: ["Щоденна рутина: `ssh` → `vcgencmd measure_temp` → `vcgencmd get_throttled` → `df -h` → `free -h` → `systemctl status` → `journalctl -u … -n 20`.", "`throttled` не `0x0` при нормальній температурі — перевір живлення.", "`failed` у статусі — одразу в лог `journalctl -u`, а не reboot.", "План 14 днів закінчується сервісом, що сам стартує після перезавантаження."] }
      ],
      glossary: [
        { term: "Health-check", def: "Коротка регулярна перевірка стану системи за чеклістом." },
        { term: "Throttling", def: "Автоматичне зниження частоти процесора через перегрів або недостатнє живлення." },
        { term: "Baseline", def: "Звичні значення (температура, диск, пам'ять), з якими порівнюєш сьогоднішні." }
      ],
      quiz: [
        { question: "Pi раптом стала повільною. Що перевірити першим, щоб виключити «залізну» причину?", options: ["`vcgencmd measure_temp` і `vcgencmd get_throttled`", "`git log --oneline`", "`sudo apt full-upgrade`"], correct: 0, feedback: "Перегрів і слабке живлення знижують частоту процесора. Ці дві команди лише читають стан і відповідають за секунди." },
        { question: "Сервіс не може записати файл, у логах `No space left on device`. Яка команда підтвердить причину?", options: ["`free -h`", "`df -h`", "`uptime`"], correct: 1, feedback: "`df -h` показує заповненість дисків. `free -h` — про оперативну пам'ять, а не про місце на SD-карті." },
        { question: "У `free -h` стовпчик `free` показує 200Mi, а `available` — 5Gi. Чи бракує пам'яті?", options: ["Так, лишилось лише 200 МБ", "Так, треба додати swap", "Ні — Linux використовує вільну пам'ять під кеш і віддасть її за потреби"], correct: 2, feedback: "Реальний запас — `available`. Кеш (`buff/cache`) звільняється автоматично, коли програмам потрібна пам'ять." },
        { question: "Навіщо в щоденній рутині `sudo apt update`, якщо він нічого не встановлює?", options: ["Щоб бачити, чи є нові версії пакетів, і вчасно оновитися", "Щоб перезапустити сервіси", "Щоб очистити диск"], correct: 0, feedback: "`update` оновлює лише списки пакетів. Встановлення — окремо, `sudo apt upgrade`, коли зручно." },
        { question: "Сервіс `active (running)`, але датчик мовчить. Що далі?", options: ["`sudo systemctl disable my-service`", "`journalctl -u my-service -n 20` — пошукати помилки в логах", "`sudo shutdown -h now`"], correct: 1, feedback: "Процес працює, але щось іде не так усередині — це видно в його виводі. Вимикати сервіс чи Pi нічого не пояснить." },
        { question: "Як перевірити, що сервіс справді стартує сам після перезавантаження?", options: ["Подивитися `git status`", "Запустити `python3 main.py` вручну", "`sudo reboot`, знову `ssh` і `systemctl status my-service` без ручного запуску"], correct: 2, feedback: "Лише справжнє перезавантаження показує, чи працює автозапуск (`enabled`). Ручний запуск нічого про нього не каже." }
      ]
    }
  ]
});
