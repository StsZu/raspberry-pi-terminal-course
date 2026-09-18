window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m08", order: 8, title: "systemd: свій сервіс", subtitle: "Автозапуск Python-скрипта: unit-файл, enable, start, status", icon: "settings",
  goal: "Після модуля ти описуєш свій скрипт як сервіс systemd, розрізняєш enable і start, запускаєш сервіс однією командою enable --now і не відрізаєш собі SSH.",
  lessons: [
    {
      id: "m08-l01", title: "Скрипт, що живе після reboot", minutes: 14,
      steps: [
        { type: "story", title: "Скрипт помирає разом з SSH",
          body: "<p>Скрипт <code>main.py</code> кожну хвилину читає датчик. Ти запускаєш його через <code>python3 main.py</code>, закриваєш ноутбук — і скрипт зупиняється разом із SSH-сесією. Після перезавантаження Pi теж нічого не працює.</p><p>Щоб скрипт жив сам по собі, його оформлюють як <strong>сервіс</strong> systemd.</p>" },
        { type: "concept", title: "systemd і unit-файл",
          body: "<p><strong>systemd</strong> — менеджер сервісів Raspberry Pi OS. Він запускає програми під час старту, перезапускає їх після падіння і збирає їхні логи в журнал.</p><p>Кожен сервіс описано в <strong>unit-файлі</strong>, наприклад <code>/etc/systemd/system/my-service.service</code>: що запускати, від якого користувача, в якій папці і коли.</p>",
          analogy: "systemd — як адміністратор готелю, а unit-файл — картка гостя: хто він (`User=stanislav`), у якому номері живе (`WorkingDirectory`), що робити зранку (`ExecStart`) і чи будити знову, якщо заснув (`Restart=always`). Без картки адміністратор про гостя нічого не знає." },
        { type: "concept", title: "Як виглядає unit-файл",
          body: "<table><thead><tr><th>Рядок</th><th>Навіщо</th></tr></thead><tbody><tr><td><code>[Unit]</code><br><code>Description=My Pi service</code><br><code>After=network.target</code></td><td>опис і «стартувати після мережі»</td></tr><tr><td><code>[Service]</code><br><code>User=stanislav</code><br><code>WorkingDirectory=/home/stanislav/projects/my-service</code><br><code>ExecStart=/home/stanislav/projects/my-service/.venv/bin/python main.py</code><br><code>Restart=always</code></td><td>від кого, де і що запускати; перезапуск після падіння</td></tr><tr><td><code>[Install]</code><br><code>WantedBy=multi-user.target</code></td><td>до якого етапу завантаження прив'язати автозапуск</td></tr></tbody></table><p>Шляхи в <code>ExecStart</code> — лише повні. Для скрипта без venv — <code>/usr/bin/python3 main.py</code>.</p>" },
        { type: "cli", title: "Зареєструвати і запустити",
          intro: "<p>Unit-файл створюють через <code>sudo nano /etc/systemd/system/my-service.service</code>. Далі:</p>",
          commands: [
            { cmd: "sudo systemctl daemon-reload", explain: "Перечитує unit-файли. Потрібна після створення або кожної зміни <code>.service</code>-файлу.", risk: "medium" },
            { cmd: "sudo systemctl enable my-service", explain: "Лише вмикає <strong>автозапуск під час завантаження</strong>. Зараз сервіс не запускає — <code>status</code> покаже <code>enabled</code>, але <code>inactive (dead)</code>.", output: "Created symlink /etc/systemd/system/multi-user.target.wants/my-service.service → /etc/systemd/system/my-service.service.", risk: "medium" },
            { cmd: "sudo systemctl start my-service", explain: "Запускає сервіс зараз. Автозапуск при цьому не вмикається.", risk: "medium" },
            { cmd: "sudo systemctl enable --now my-service", explain: "Обидві дії разом: увімкнути автозапуск і запустити сервіс одразу.", risk: "medium" }
          ] },
        { type: "check", title: "enable чи start",
          question: "Ти виконав лише `sudo systemctl enable my-service`. Що покаже `systemctl status my-service` до перезавантаження?",
          options: ["`enabled`, але `inactive (dead)` — сервіс ще не запущено", "`active (running)` — enable одразу запускає сервіс", "Помилку: спершу треба start"],
          correct: 0, feedback: "`enable` лише реєструє автозапуск на майбутні завантаження. Щоб запустити зараз, потрібен `start` — або одразу `enable --now`." },
        { type: "terminal", title: "Спробуй: увімкни й запусти одразу",
          task: "Однією командою увімкни автозапуск сервісу `my-service` і запусти його прямо зараз.",
          expected: ["sudo systemctl enable --now my-service", "sudo systemctl enable --now my-service.service", "sudo systemctl --now enable my-service", "sudo systemctl --now enable my-service.service", "sudo systemctl enable my-service --now"],
          output: "Created symlink /etc/systemd/system/multi-user.target.wants/my-service.service → /etc/systemd/system/my-service.service.",
          hint: "Дія автозапуску плюс прапорець «зараз» англійською; потрібні права адміністратора.",
          explain: "Посилання в `multi-user.target.wants` — це і є автозапуск. Прапорець `--now` додатково виконав `start`." },
        { type: "cli", title: "Керувати сервісом щодня",
          commands: [
            { cmd: "systemctl status my-service", explain: "Стан (<code>active (running)</code>, <code>failed</code>…), чи ввімкнено автозапуск і останні рядки логу. Нічого не змінює.", output: "● my-service.service - My Pi service\n     Loaded: loaded (/etc/systemd/system/my-service.service; enabled; preset: enabled)\n     Active: active (running) since Fri 2026-09-18 10:02:11 EEST; 5s ago\n   Main PID: 1234 (python)", risk: "low" },
            { cmd: "sudo systemctl restart my-service", explain: "Зупиняє і знову запускає — щоб підхопити новий код після <code>git pull</code>.", risk: "medium" },
            { cmd: "sudo systemctl stop my-service", explain: "Зупиняє сервіс зараз. Автозапуск лишається — після reboot він знову стартує.", risk: "medium" },
            { cmd: "sudo systemctl disable my-service", explain: "Прибирає автозапуск. Уже запущений сервіс працює далі (разом — <code>disable --now</code>).", risk: "medium" },
            { cmd: "sudo systemctl stop ssh", explain: "Зупиняє SSH-сервер Pi. Нові підключення з Mac стануть неможливими.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Не відріж собі гілку, на якій сидиш",
          body: "<p><code>sudo systemctl stop ssh</code> чи <code>disable ssh</code>, зупинка мережевих сервісів — і до Pi більше не підключитися з Mac. Виправити можна лише з монітором і клавіатурою, під'єднаними до самої Pi.</p><p><strong>Безпечно:</strong> керуй лише своїми сервісами, спершу дивись <code>systemctl status &lt;назва&gt;</code>, а для перевірки змін використовуй <code>restart</code> свого сервісу замість <code>stop</code> системних.</p>" },
        { type: "terminal", title: "Спробуй: перевір стан",
          task: "Подивись, чи працює сервіс `my-service` і чи ввімкнено його автозапуск.",
          expected: ["systemctl status my-service", "systemctl status my-service.service", "sudo systemctl status my-service", "sudo systemctl status my-service.service"],
          output: "● my-service.service - My Pi service\n     Loaded: loaded (/etc/systemd/system/my-service.service; enabled; preset: enabled)\n     Active: active (running) since Fri 2026-09-18 10:02:11 EEST; 1min ago\n   Main PID: 1234 (python)\nSep 18 10:03:11 raspberrypi python[1234]: Service running...",
          hint: "Та сама утиліта керування сервісами, дія — «стан»; для читання sudo не обов'язковий.",
          explain: "`enabled` у рядку Loaded — автозапуск увімкнено, `active (running)` — сервіс працює зараз. Це дві незалежні речі." },
        { type: "check", title: "Змінив unit-файл",
          question: "Ти виправив `ExecStart` у `my-service.service`, зробив `restart`, а сервіс запускає старий шлях. Чого бракує?",
          options: ["`sudo systemctl enable my-service`", "Перезавантажити Mac", "`sudo systemctl daemon-reload` перед `restart`"],
          correct: 2, feedback: "systemd тримає unit-файли в пам'яті. Після кожної зміни — `daemon-reload`, потім `restart`." },
        { type: "summary", title: "Підсумок",
          points: ["Сервіс systemd живе без SSH і після reboot; описується unit-файлом у `/etc/systemd/system/`.", "`enable` — лише автозапуск, `start` — запуск зараз, `enable --now` — обидва.", "Після зміни unit-файлу — `sudo systemctl daemon-reload`.", "`status` читає, `restart`/`stop`/`disable` змінюють стан — ризик середній.", "Зупинка чи вимкнення `ssh` відрізає доступ до Pi — високий ризик."] }
      ],
      glossary: [
        { term: "systemd", def: "Менеджер сервісів Linux: запускає, перезапускає й журналює програми." },
        { term: "Unit-файл", def: "Опис сервісу (`.service`): що, від кого і коли запускати." },
        { term: "enable", def: "Увімкнути автозапуск сервісу під час завантаження (без запуску зараз)." },
        { term: "start", def: "Запустити сервіс негайно (без автозапуску)." },
        { term: "daemon-reload", def: "Команда, що змушує systemd перечитати змінені unit-файли." }
      ],
      quiz: [
        { question: "Сервіс працює, але після reboot не стартує. Найімовірніша причина?", options: ["Його запустили через `start`, але не зробили `enable`", "Забули `daemon-reload`", "Сервіс запущено від `stanislav`"], correct: 0, feedback: "`start` запускає лише зараз. Автозапуск дає `enable` (або `enable --now` одразу)." },
        { question: "Яка команда і вмикає автозапуск, і запускає сервіс одразу?", options: ["`sudo systemctl start --boot my-service`", "`sudo systemctl enable --now my-service`", "`sudo systemctl restart my-service`"], correct: 1, feedback: "`--now` додає до `enable` негайний запуск. Прапорця `--boot` немає, а `restart` автозапуск не вмикає." },
        { question: "Навіщо `Restart=always` в unit-файлі?", options: ["Перезавантажувати Pi щодня", "Оновлювати код з Git", "systemd сам перезапустить скрипт, якщо той впаде"], correct: 2, feedback: "Це політика перезапуску процесу після завершення чи падіння. До Pi і Git вона стосунку не має." },
        { question: "Чому в `ExecStart` пишуть `/home/stanislav/projects/my-service/.venv/bin/python`, а не просто `python`?", options: ["Так коротше", "systemd потребує повного шляху, і так скрипт отримає бібліотеки з venv проєкту", "Без цього не працює `journalctl`"], correct: 1, feedback: "Сервіс не активує venv сам. Повний шлях до python з `.venv` дає йому потрібні бібліотеки." },
        { question: "Що з цього найризикованіше на Pi, до якої ти маєш доступ лише по SSH?", options: ["`systemctl status ssh`", "`sudo systemctl restart my-service`", "`sudo systemctl disable --now ssh`"], correct: 2, feedback: "Вимкнення SSH обірве доступ, і повернути його можна лише фізично біля Pi. Перегляд стану нічого не змінює." },
        { question: "Ти хочеш тимчасово зупинити свій сервіс, але щоб після reboot він знову працював. Що обрати?", options: ["`sudo systemctl stop my-service`", "`sudo systemctl disable my-service`", "Видалити unit-файл"], correct: 0, feedback: "`stop` зупиняє зараз, автозапуск лишається. `disable` прибирає автозапуск, а видалення файлу — сам сервіс." }
      ]
    }
  ]
});
