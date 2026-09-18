window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m05", order: 5, title: "Стан системи і процеси", subtitle: "Температура, живлення, пам'ять, диск і керування процесами", icon: "monitor_heart",
  goal: "Після модуля ти за хвилину робиш health-check Pi (температура, живлення, RAM, диск) і вмієш знайти та коректно зупинити завислий процес.",
  lessons: [
    {
      id: "m05-l01", title: "Здоров'я Pi: температура, живлення, пам'ять, диск", minutes: 13,
      steps: [
        { type: "story", title: "Pi «гальмує» і сама перезавантажується",
          body: "<p>Скрипт то працює, то ні, а інколи Pi перезавантажується посеред ночі. На звичайному сервері ти б дивився лише в процеси. На Raspberry Pi часто винні <strong>живлення</strong> і <strong>перегрів</strong>.</p><p>У цьому уроці збираємо короткий health-check: хто я за системою, скільки працюю, яка температура, чи вистачає живлення, пам'яті й місця.</p>" },
        { type: "cli", title: "Що це за система",
          commands: [
            { cmd: "uname -a", explain: "Ядро Linux, його версія та архітектура. <code>aarch64</code> — 64-бітний ARM. Номер ядра змінюється з оновленнями.", output: "Linux raspberrypi 6.6.51+rpt-rpi-2712 #1 SMP PREEMPT Debian 1:6.6.51-1+rpt3 aarch64 GNU/Linux", risk: "low" },
            { cmd: "cat /etc/os-release", explain: "Версія ОС. Raspberry Pi OS показує базовий Debian: 12 (bookworm) або новіший — залежить від образу, який ти записав.", output: "PRETTY_NAME=\"Debian GNU/Linux 12 (bookworm)\"\nVERSION_ID=\"12\"\nVERSION_CODENAME=bookworm", risk: "low" },
            { cmd: "uptime", explain: "Скільки Pi працює від останнього запуску і середнє навантаження за 1, 5 і 15 хвилин.", output: " 10:15:02 up 2 days,  3:15,  1 user,  load average: 0.12, 0.08, 0.05", risk: "low" }
          ] },
        { type: "concept", title: "Троттлінг: Pi сама себе гальмує",
          body: "<p>Коли процесор перегрівається або напруга живлення просідає, Pi знижує частоту — це <strong>троттлінг</strong>. Вона не зламається, але стане повільною, а при слабкому блоці живлення можливі збої USB, SD-карти й раптові перезавантаження.</p><p><code>vcgencmd get_throttled</code> показує прапорці: <code>0x0</code> — проблем не було з моменту запуску. Будь-що інше — привід перевірити блок живлення, кабель і охолодження.</p>",
          analogy: "Це як бігун, якому бракує води або який перегрівся на сонці: він не падає одразу, а переходить на крок. `get_throttled` — його фітнес-браслет: навіть якщо зараз усе добре, браслет пам'ятає, що годину тому був перегрів." },
        { type: "cli", title: "Температура й живлення — команди саме Raspberry Pi",
          intro: "<p><code>vcgencmd</code> є лише на Raspberry Pi — на Mac чи звичайному сервері його немає.</p>",
          commands: [
            { cmd: "vcgencmd measure_temp", explain: "Температура процесора. Під навантаженням 50–70 °C — нормально; близько 80 °C і вище Pi почне знижувати частоту — перевір радіатор чи вентилятор.", output: "temp=52.3'C", risk: "low" },
            { cmd: "vcgencmd get_throttled", explain: "Прапорці троттлінгу. <code>0x0</code> — усе добре. <code>0x50000</code> — з моменту запуску вже були просідання напруги й троттлінг.", output: "throttled=0x0", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: перевір живлення",
          task: "Перевір, чи були в Pi проблеми з живленням або троттлінгом від моменту ввімкнення.",
          expected: ["vcgencmd get_throttled"],
          output: "throttled=0x50000",
          hint: "Утиліта, що є лише на Raspberry Pi, з підкомандою «отримати стан троттлінгу».",
          explain: "`0x50000` — біти «було просідання напруги» і «був троттлінг». Зараз усе може бути добре, але раніше живлення не вистачало: найчастіше винні слабкий блок живлення або тонкий кабель USB-C." },
        { type: "check", title: "Прочитай прапорці",
          question: "`vcgencmd get_throttled` показує `throttled=0x0`, а `vcgencmd measure_temp` — `temp=48.0'C`. Що можна сказати?",
          options: ["Pi зараз перегріта", "Проблем з живленням і троттлінгом від запуску не було, температура нормальна", "Блок живлення слабкий"],
          correct: 1, feedback: "`0x0` — жодного прапорця подій, а 48 °C — спокійна температура. Шукати причину збоїв треба деінде." },
        { type: "cli", title: "Пам'ять і диск",
          commands: [
            { cmd: "free -h", explain: "RAM і swap у зручних одиницях. Дивись на стовпчик <code>available</code> — скільки реально доступно програмам.", output: "               total        used        free      shared  buff/cache   available\nMem:           7.9Gi       1.2Gi       5.1Gi        52Mi       1.8Gi       6.7Gi\nSwap:          511Mi          0B       511Mi", risk: "low" },
            { cmd: "df -h", explain: "Вільне місце на розділах. Корінь <code>/</code> на SD-карті зазвичай <code>/dev/mmcblk0p2</code>.", output: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/mmcblk0p2   58G   12G   44G  22% /\n/dev/mmcblk0p1  510M   76M  435M  15% /boot/firmware", risk: "low" },
            { cmd: "du -sh ~/projects", explain: "Скільки займає конкретна папка: <code>-s</code> — підсумок, <code>-h</code> — людські одиниці.", output: "24M\t/home/stanislav/projects", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: скільки вільного місця",
          task: "Покажи вільне місце на всіх розділах у зручних одиницях (Гб, Мб).",
          expected: ["df -h"],
          output: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/mmcblk0p2   58G   12G   44G  22% /\ntmpfs           4.0G     0  4.0G   0% /dev/shm\n/dev/mmcblk0p1  510M   76M  435M  15% /boot/firmware",
          hint: "Команда «disk free» з прапорцем для людських одиниць.",
          explain: "`/` заповнений на 22 %. Якщо тут 100 %, починаються дивні помилки запису — часто винні логи, що розрослися." },
        { type: "check", title: "Що заповнило диск",
          question: "`df -h` показує `/` на 97 %. Як дізнатися, чи винна саме папка `~/projects`?",
          options: ["`free -h`", "`uptime`", "`du -sh ~/projects`"],
          correct: 2, feedback: "`df` показує розділ цілком, `du` — розмір конкретної папки. `free` — про оперативну пам'ять, не про диск." },
        { type: "summary", title: "Підсумок",
          points: ["`uname -a`, `cat /etc/os-release`, `uptime` — що за система і скільки працює.", "`vcgencmd measure_temp` — температура; `vcgencmd get_throttled` — чи були просідання живлення й троттлінг (`0x0` — ні).", "Нестабільна Pi — спершу перевір блок живлення, кабель і охолодження.", "`free -h` — RAM (дивись `available`), `df -h` — місце на розділах, `du -sh` — розмір папки."] }
      ],
      glossary: [
        { term: "Троттлінг", def: "Автоматичне зниження частоти процесора через перегрів або брак живлення." },
        { term: "Undervoltage", def: "Просідання напруги живлення нижче норми — часта причина збоїв Pi." },
        { term: "vcgencmd", def: "Утиліта Raspberry Pi для температури, частот і стану живлення." },
        { term: "Load average", def: "Середня кількість задач, що чекають процесор, за 1, 5 і 15 хвилин." },
        { term: "Swap", def: "Частина диска, яку система використовує як запасну оперативну пам'ять." }
      ],
      quiz: [
        { question: "Pi 5 раптово перезавантажується під навантаженням, а `get_throttled` показує `0x50005`. З чого почати?", options: ["Перевстановити Raspberry Pi OS", "Перевірити блок живлення й кабель USB-C", "Видалити всі логи"], correct: 1, feedback: "Прапорці вказують на просідання напруги (зараз і раніше). Найчастіша причина — слабкий блок живлення або кабель." },
        { question: "Чим `df -h` відрізняється від `du -sh папка`?", options: ["`df` — вільне місце на розділах, `du` — скільки займає конкретна папка", "Нічим, це синоніми", "`df` показує RAM, `du` — диск"], correct: 0, feedback: "`df` (disk free) — про розділи, `du` (disk usage) — про файли й папки. RAM показує `free`." },
        { question: "У `free -h` бачиш `free 300Mi`, але `available 5.8Gi`. Чи бракує пам'яті?", options: ["Так, лишилося лише 300 МБ", "Так, треба збільшити swap", "Ні — система тримає кеш, який звільнить за потреби; орієнтуйся на `available`"], correct: 2, feedback: "Linux використовує вільну RAM під кеш. `available` — реальний запас для програм." },
        { question: "Навіщо `vcgencmd get_throttled`, якщо зараз температура нормальна?", options: ["Щоб знизити температуру", "Він пам'ятає події від моменту запуску — побачиш проблему, що вже минула", "Щоб вимкнути троттлінг"], correct: 1, feedback: "Прапорці «has occurred» зберігаються до перезавантаження. Команда лише читає стан, нічого не змінює." },
        { question: "Яка команда покаже, чи твоя Pi на Debian 12 Bookworm чи на новішій версії?", options: ["`cat /etc/os-release`", "`uname -a`", "`hostname`"], correct: 0, feedback: "`/etc/os-release` містить назву й версію дистрибутива. `uname` показує ядро, а не версію ОС." },
        { question: "`uptime` показує `load average: 3.90, 3.85, 3.70` на 4-ядерній Pi 5. Що це означає?", options: ["Pi вимкнеться за 3 хвилини", "Pi працює 3 дні", "Процесор тривалий час майже повністю завантажений"], correct: 2, feedback: "Навантаження близько кількості ядер протягом 15 хвилин — процесор зайнятий майже на 100 %. Час роботи показано окремо: `up …`." }
      ]
    },
    {
      id: "m05-l02", title: "Процеси: знайти і зупинити", minutes: 12,
      steps: [
        { type: "story", title: "Скрипт завис",
          body: "<p>Ти запустив <code>python3 main.py</code> у фоні, закрив вікно, а тепер Pi гріється, і скрипт не відповідає. Треба знайти його серед сотні процесів і зупинити — але так, щоб не зачепити нічого зайвого.</p>" },
        { type: "concept", title: "Процес, PID і сигнали",
          body: "<p>Кожна запущена програма — <strong>процес</strong> з унікальним номером <strong>PID</strong>. Зупиняють процес <strong>сигналом</strong>.</p><ul><li><code>kill PID</code> надсилає <code>SIGTERM</code> — ввічливе «заверши роботу»: програма може зберегти дані й закрити файли.</li><li><code>kill -9 PID</code> — <code>SIGKILL</code>: ядро знищує процес миттєво, без жодного прибирання.</li></ul>",
          analogy: "`kill PID` — попросити відвідувача кафе: «Ми зачиняємося, допивайте й розрахуйтеся». `kill -9` — охоронець, що виносить людину разом зі стільцем: швидко, але рахунок не оплачено, а чашка розбита." },
        { type: "cli", title: "Знайти процес",
          commands: [
            { cmd: "ps aux | grep python", explain: "<code>ps aux</code> — знімок усіх процесів; <code>grep</code> лишає рядки зі словом python. Другий стовпчик — PID.", output: "stanislav      1234 12.5  0.4  28400 18200 ?  S  09:12  2:31 python3 main.py\nstas      2201  0.0  0.0   6120  1900 pts/0 S+ 10:20  0:00 grep python", risk: "low" },
            { cmd: "pgrep -f main.py", explain: "Лише PID процесів, у командному рядку яких є <code>main.py</code>. Зручніше, ніж шукати очима.", output: "1234", risk: "low" },
            { cmd: "top", explain: "Живий монітор: хто їсть процесор і пам'ять. <code>q</code> — вихід. Зручніша версія <code>htop</code> ставиться через <code>sudo apt install htop</code>.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: знайди PID скрипта",
          task: "Виведи лише PID процесу, в командному рядку якого є `main.py`.",
          expected: ["pgrep -f main.py", "pgrep -f \"main.py\"", "pgrep -f 'main.py'"],
          output: "1234",
          hint: "Утиліта `pgrep` з прапорцем, що шукає в повному командному рядку, а не лише в назві програми.",
          explain: "Назва процесу — `python3`, а `main.py` — лише аргумент. Тому потрібен `-f`: без нього `pgrep main.py` нічого б не знайшов." },
        { type: "check", title: "Рядок з grep",
          question: "`ps aux | grep python` показав два рядки: `python3 main.py` і `grep python`. Що таке другий рядок?",
          options: ["Сам `grep`, який теж містить слово python", "Другий завислий скрипт", "Системний процес Python, який не можна чіпати"], correct: 0,
          feedback: "`grep` шукає слово python і сам є процесом з цим словом у командному рядку. `pgrep` цієї плутанини не має." },
        { type: "cli", title: "Зупинити процес",
          commands: [
            { cmd: "kill 1234", explain: "Надсилає <code>SIGTERM</code> процесу з PID 1234 — програма може коректно завершитися.", risk: "medium" },
            { cmd: "kill -9 1234", explain: "<code>SIGKILL</code> — миттєве знищення без збереження даних. Лише коли <code>kill</code> не допоміг.", risk: "high" },
            { cmd: "killall python3", explain: "Завершує <strong>усі</strong> процеси з назвою <code>python3</code> — і твої, і чужі сервіси на Python.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "kill -9 і killall — без вороття",
          body: "<p><code>kill -9</code> не дає програмі зберегти дані: незаписаний файл, недописаний лог чи відкрита база можуть зіпсуватися. <code>killall python3</code> зупинить усі Python-процеси, включно з сервісами, про які ти забув. Під <code>sudo</code> можна вбити й системні процеси — аж до обриву SSH.</p><p>Безпечніше: точний PID через <code>pgrep -f</code> → звичайний <code>kill PID</code> → почекати кілька секунд → лише тоді <code>kill -9</code>. Якщо програма — сервіс systemd, зупиняй її через <code>sudo systemctl stop назва</code> (модуль «systemd»), інакше systemd може одразу запустити її знову.</p>" },
        { type: "terminal", title: "Спробуй: ввічливо зупини скрипт",
          task: "Зупини процес з PID `1234` звичайним сигналом завершення (не примусовим).",
          expected: ["kill 1234", "kill -15 1234", "kill -TERM 1234", "kill -SIGTERM 1234", "kill -s TERM 1234"],
          output: "",
          hint: "Команда відправки сигналу і номер процесу — без прапорця сили.",
          explain: "`kill` без прапорця надсилає `SIGTERM` (15). Перевір, що процес зник: `pgrep -f main.py` нічого не виведе." },
        { type: "check", title: "Процес повертається",
          question: "Ти зробив `kill` для `python3 my-service.py`, а за кілька секунд він знову в `ps`. Найімовірніша причина?",
          options: ["`kill` не працює на Raspberry Pi", "Потрібно було `kill -9`", "Це сервіс systemd з автоперезапуском — зупиняти треба через `systemctl stop`"],
          correct: 2, feedback: "systemd перезапускає сервіс з `Restart=always`. `kill -9` нічого не змінить — керуй сервісом через `systemctl`." },
        { type: "summary", title: "Підсумок",
          points: ["Кожен процес має PID; `ps aux | grep`, `pgrep -f`, `top` допомагають його знайти.", "`kill PID` — ввічливий `SIGTERM`, ризик середній.", "`kill -9` і `killall` — високий ризик: без збереження даних і можна зачепити чужі процеси.", "Сервіси systemd зупиняй через `sudo systemctl stop`, а не `kill`."] }
      ],
      glossary: [
        { term: "Процес", def: "Запущена програма в пам'яті." },
        { term: "PID", def: "Унікальний номер процесу; потрібен для `kill`." },
        { term: "SIGTERM", def: "Сигнал 15: попросити процес коректно завершитися; його шле `kill` за замовчуванням." },
        { term: "SIGKILL", def: "Сигнал 9: ядро негайно знищує процес без прибирання." }
      ],
      quiz: [
        { question: "Чим `kill 1234` відрізняється від `kill -9 1234`?", options: ["Нічим, це синоніми", "Перший дає програмі коректно завершитися, другий знищує її миттєво", "Другий лише призупиняє процес"], correct: 1, feedback: "`kill` шле `SIGTERM`, який програма може обробити. `-9` — `SIGKILL`, його перехопити неможливо." },
        { question: "Чому `pgrep -f main.py` знаходить скрипт, а `pgrep main.py` — ні?", options: ["Без `-f` pgrep шукає лише в назві програми (`python3`), а не в її аргументах", "`-f` означає force", "`main.py` треба писати в лапках"], correct: 0, feedback: "Процес називається `python3`; `main.py` — аргумент. `-f` шукає в повному командному рядку." },
        { question: "На Pi працюють твій скрипт і домашній сервіс на Python. Що станеться після `killall python3`?", options: ["Зупиниться лише найновіший процес", "Нічого — потрібен `sudo`", "Зупиняться всі твої Python-процеси з назвою `python3`, включно із сервісом"], correct: 2, feedback: "`killall` б'є за назвою по всіх збігах. Тому краще точний PID." },
        { question: "Як вийти з `top`?", options: ["Натиснути `q`", "Ввести `exit`", "Закрити SSH-сесію"], correct: 0, feedback: "`q` — вихід з `top`, `htop` і `less`. Закривати SSH не потрібно." },
        { question: "Який правильний порядок зупинки завислого скрипта?", options: ["`kill -9` одразу, щоб не чекати", "Знайти PID → `kill PID` → зачекати → лише тоді `kill -9`", "Перезавантажити Pi"], correct: 1, feedback: "Спершу ввічливий сигнал — програма збереже дані. Примусове знищення — крайній захід, перезавантаження — надмірне." },
        { question: "Сервіс `my-service` треба зупинити надовго. Що обрати?", options: ["`kill` його PID", "`killall python3`", "`sudo systemctl stop my-service`"], correct: 2, feedback: "systemd стежить за сервісом і може перезапустити вбитий процес. `systemctl stop` каже systemd саме зупинити його." }
      ]
    }
  ]
});
