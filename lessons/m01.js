window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m01", order: 1, title: "SSH і перший вхід", subtitle: "З Mac на Pi: ping, ssh, exit і основи bash", icon: "terminal",
  goal: "Після модуля ти підключаєшся до Raspberry Pi з Mac через SSH, завжди розумієш, де виконується команда, і вмієш знайти довідку до будь-якої команди.",
  lessons: [
    {
      id: "m01-l01", title: "Mac → Pi: ping, ssh і exit", minutes: 12,
      steps: [
        { type: "story", title: "Pi без монітора",
          body: "<p>Raspberry Pi 5 лежить на полиці біля роутера: без монітора, без клавіатури, лише живлення і мережа. Керувати нею ти будеш з Mac — через Terminal і SSH.</p><p>Спершу треба переконатися, що Pi взагалі в мережі, потім увійти на неї, а наприкінці — коректно вийти. І весь час розуміти, на якому комп'ютері ти зараз вводиш команди.</p>" },
        { type: "concept", title: "SSH — віддалений термінал",
          body: "<p><strong>SSH</strong> (Secure Shell) відкриває зашифровану сесію: ти друкуєш у Terminal на Mac, а команди виконуються на Pi. Для входу потрібні три речі:</p><ul><li><strong>username</strong> на Pi — наприклад <code>stanislav</code> (не обов'язково <code>pi</code>);</li><li><strong>адреса</strong> — ім'я <code>raspberrypi.local</code> або IP <code>10.0.0.50</code>;</li><li>увімкнений <strong>SSH-сервер</strong> на Pi (у Raspberry Pi Imager під час запису образу або в налаштуваннях Raspberry Pi OS).</li></ul>",
          analogy: "SSH — як телефонний дзвінок черговому в серверній: ти сидиш удома (Mac), диктуєш команди, а він виконує їх на місці (Pi) і читає тобі результат. Поки дзвінок триває, усе, що ти кажеш, стосується серверної. Поклав слухавку (`exit`) — ти знову сам у своїй кімнаті." },
        { type: "cli", title: "Перевірити, що Pi в мережі",
          intro: "<p>Ці команди виконуються <strong>на Mac</strong>, у звичайному Terminal. Запрошення Mac закінчується на <code>%</code>.</p>",
          commands: [
            { cmd: "ping -c 3 raspberrypi.local", explain: "Надсилає 3 тестові пакети на Pi за іменем (mDNS). Без <code>-c 3</code> ping працює безкінечно — зупини його <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span>.", output: "64 bytes from 10.0.0.50: icmp_seq=0 ttl=64 time=2.1 ms\n64 bytes from 10.0.0.50: icmp_seq=1 ttl=64 time=1.8 ms\n64 bytes from 10.0.0.50: icmp_seq=2 ttl=64 time=1.9 ms", risk: "low" },
            { cmd: "ping -c 3 10.0.0.50", explain: "Те саме за IP-адресою. Якщо ім'я <code>.local</code> не знаходиться, а IP відповідає — проблема в mDNS, не в Pi.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: чи жива Pi?",
          prompt: "Stas@MacBook-Pro ~ %",
          task: "На Mac надішли рівно 3 пакети ping на Pi за іменем `raspberrypi.local`.",
          expected: ["ping -c 3 raspberrypi.local", "ping raspberrypi.local -c 3", "ping -c3 raspberrypi.local"],
          output: "PING raspberrypi.local (10.0.0.50): 56 data bytes\n64 bytes from 10.0.0.50: icmp_seq=0 ttl=64 time=2.1 ms\n64 bytes from 10.0.0.50: icmp_seq=1 ttl=64 time=1.8 ms\n64 bytes from 10.0.0.50: icmp_seq=2 ttl=64 time=1.9 ms\n--- raspberrypi.local ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss",
          hint: "Команда `ping`, прапорець кількості пакетів `-c` з числом і ім'я Pi з доменом `.local`.",
          explain: "Відповіді прийшли з `10.0.0.50` — тепер ти знаєш і IP Pi. `0.0% packet loss` означає, що мережа між Mac і Pi працює." },
        { type: "check", title: "Pi не відповідає",
          question: "`ping -c 3 raspberrypi.local` пише `cannot resolve raspberrypi.local`, а `ping -c 3 10.0.0.50` отримує відповіді. Що найімовірніше?",
          options: ["Pi вимкнена", "Pi в мережі, але ім'я `.local` не розпізнається — підключайся за IP", "На Pi вимкнений SSH"],
          correct: 1, feedback: "IP відповідає — отже Pi увімкнена і в мережі. Не працює лише пошук імені (mDNS). Про SSH ping нічого не каже: він перевіряє лише мережу." },
        { type: "cli", title: "Увійти і вийти",
          commands: [
            { cmd: "ssh stanislav@raspberrypi.local", explain: "Підключення до Pi користувачем <code>stanislav</code>. Першого разу SSH спитає про fingerprint ключа Pi — перевір, що підключаєшся до своєї Pi, і введи <code>yes</code>. Потім — пароль (під час введення символи не видно).", output: "stanislav@raspberrypi.local's password:\nLinux raspberrypi 6.18.34+rpt-rpi-2712 #1 SMP PREEMPT Debian 1:6.18.34-1+rpt1 (2026-06-09) aarch64\nstanislav@raspberrypi:~ $", risk: "low" },
            { cmd: "ssh stanislav@10.0.0.50", explain: "Те саме за IP — надійніше, якщо <code>.local</code> не працює.", risk: "low" },
            { cmd: "exit", explain: "Закриває SSH-сесію. Ти повертаєшся в Terminal Mac — запрошення знову закінчується на <code>%</code>.", output: "logout\nConnection to raspberrypi.local closed.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: увійди на Pi",
          prompt: "Stas@MacBook-Pro ~ %",
          task: "Підключись з Mac до Pi користувачем `stanislav` за IP-адресою `10.0.0.50`.",
          expected: ["ssh stanislav@10.0.0.50"],
          output: "stanislav@10.0.0.50's password:\nLinux raspberrypi 6.18.34+rpt-rpi-2712 #1 SMP PREEMPT Debian 1:6.18.34-1+rpt1 (2026-06-09) aarch64\nLast login: Thu Sep 17 21:04:11 2026 from 10.0.0.42\nstanislav@raspberrypi:~ $",
          hint: "Формат: `ssh користувач@адреса`.",
          explain: "Запрошення змінилося на `stanislav@raspberrypi:~ $` — тепер кожна команда виконується на Pi, а не на Mac." },
        { type: "concept", title: "Де я зараз: Mac чи Pi?",
          body: "<p>Найчастіша помилка новачка — ввести команду не на тому комп'ютері. Дивись на запрошення:</p><table><thead><tr><th>Запрошення</th><th>Де виконується</th></tr></thead><tbody><tr><td><code>Stas@MacBook-Pro ~ %</code></td><td>Mac, zsh</td></tr><tr><td><code>stanislav@raspberrypi:~ $</code></td><td>Pi, bash</td></tr></tbody></table><p>Сумніваєшся — введи <code>hostname</code>: він назве комп'ютер, на якому ти зараз.</p>",
          analogy: "Це як дві вкладки браузера з однаковим сайтом — тестовою і робочою. Перш ніж натиснути «Видалити», дивишся на адресний рядок. Запрошення терміналу — твій адресний рядок." },
        { type: "terminal", title: "Спробуй: перевір, де ти",
          task: "Ти щойно увійшов по SSH. Переконайся, що команди виконуються на Pi: виведи ім'я комп'ютера.",
          expected: ["hostname"], output: "raspberrypi",
          hint: "Ім'я хоста англійською — host name, одним словом.",
          explain: "`raspberrypi` — це Pi. На Mac та сама команда показала б `MacBook-Pro.local`." },
        { type: "check", title: "Після exit",
          question: "Ти ввів на Pi `exit`, а потім `hostname`. Що побачиш?",
          options: ["`raspberrypi` — сесія ще відкрита", "Помилку: після exit команди не працюють", "`MacBook-Pro.local` — ти знову на Mac"],
          correct: 2, feedback: "`exit` закриває SSH-сесію і повертає тебе в Terminal Mac. Наступні команди виконуються вже на Mac." },
        { type: "summary", title: "Підсумок",
          points: ["Перед SSH перевір мережу: `ping -c 3 raspberrypi.local` або `ping -c 3 10.0.0.50`.", "`ssh stanislav@10.0.0.50` відкриває сесію на Pi; `exit` повертає на Mac.", "Запрошення `%` — Mac, `$` з `raspberrypi` — Pi; сумніваєшся — `hostname`.", "Не знаходиться `.local`, але IP відповідає — підключайся за IP."] }
      ],
      glossary: [
        { term: "SSH", def: "Протокол зашифрованого віддаленого доступу: команди з Mac виконуються на Pi." },
        { term: "hostname", def: "Ім'я комп'ютера в мережі; для Pi за замовчуванням — `raspberrypi`." },
        { term: "mDNS (.local)", def: "Спосіб знайти пристрій у локальній мережі за іменем `raspberrypi.local` без налаштування DNS." },
        { term: "fingerprint", def: "Відбиток ключа Pi; SSH показує його при першому підключенні, щоб ти підтвердив, що це саме твоя Pi." },
        { term: "IP-адреса", def: "Числова адреса пристрою в мережі, наприклад `10.0.0.50`." }
      ],
      quiz: [
        { question: "SSH відповідає `Connection refused`, хоча `ping 10.0.0.50` працює. Що перевірити першим?", options: ["Чи увімкнений SSH-сервер на Pi", "Чи не зламався кабель живлення Pi", "Чи правильний пароль"], correct: 0, feedback: "Pi в мережі (ping є), але на порту SSH ніхто не відповідає — сервіс SSH вимкнений. Неправильний пароль дав би `Permission denied`." },
        { question: "Навіщо в `ping -c 3 raspberrypi.local` прапорець `-c 3`?", options: ["Щоб ping ішов утричі швидше", "Щоб надіслати рівно 3 пакети і завершитись самостійно", "Щоб перевірити 3 різні адреси"], correct: 1, feedback: "`-c` — count, кількість пакетів. Без нього ping на Mac і Linux працює, доки не натиснеш Ctrl+C." },
        { question: "SSH при першому підключенні питає про fingerprint. Як діяти?", options: ["Завжди відповідати `no`", "Вимкнути перевірку ключів назавжди", "Переконатися, що підключаєшся до своєї Pi у своїй мережі, і відповісти `yes`"], correct: 2, feedback: "Питання з'являється один раз для нового пристрою. Якщо згодом SSH попередить, що ключ змінився без причини, — зупинись і з'ясуй чому." },
        { question: "У тебе запрошення `stanislav@raspberrypi:~ $`. Де виконається `ls`?", options: ["На Raspberry Pi, у папці `/home/stanislav`", "На Mac, у домашній папці", "Одночасно на Mac і на Pi"], correct: 0, feedback: "Запрошення показує користувача `stanislav` на хості `raspberrypi`, папка `~` — домашня на Pi." },
        { question: "`ssh stanislav@raspberrypi.local` пише `Permission denied`. Найімовірніша причина?", options: ["Pi вимкнена", "Неправильний username або пароль", "Mac не підключений до мережі"], correct: 1, feedback: "`Permission denied` означає, що Pi відповіла, але не пустила: не той користувач чи пароль. Вимкнена Pi чи відсутня мережа дали б timeout або «could not resolve»." },
        { question: "Як закінчити роботу на Pi, щоб повернутися в Terminal Mac?", options: ["`sudo shutdown -h now`", "Закрити кришку Mac", "`exit`"], correct: 2, feedback: "`exit` закриває лише SSH-сесію. `shutdown` вимкнув би саму Pi — і вмикати її довелося б фізично." }
      ]
    },
    {
      id: "m01-l02", title: "Основи bash: shell, PATH і довідка", minutes: 11,
      steps: [
        { type: "story", title: "Та сама мова, інший комп'ютер",
          body: "<p>На Mac ти працюєш у <code>zsh</code>, на Pi тебе зустрічає <code>bash</code>. Більшість команд однакові: <code>ls</code>, <code>cd</code>, <code>pwd</code>. Але домашня папка тут <code>/home/stanislav</code>, програми ставляться через <code>apt</code>, а деяких утиліт (наприклад, <code>vcgencmd</code>) на Mac узагалі немає.</p><p>Розберімося, хто виконує твої команди на Pi і де шукати довідку, коли забув прапорець.</p>" },
        { type: "concept", title: "Команда, прапорець, аргумент",
          body: "<p><strong>Shell</strong> читає рядок і розбирає його на частини:</p><table><thead><tr><th>Частина</th><th>Приклад</th><th>Що це</th></tr></thead><tbody><tr><td>команда</td><td><code>ls</code></td><td>яку програму запустити</td></tr><tr><td>прапорець</td><td><code>-la</code></td><td>як саме її запустити</td></tr><tr><td>аргумент</td><td><code>/home/stanislav</code></td><td>з чим працювати</td></tr></tbody></table><p>Змінна <code>PATH</code> — список папок, де shell шукає програму за назвою.</p>",
          analogy: "Shell — як диспетчер таксі. Ти кажеш: «`ls`, детально (`-la`), до адреси `/home/stanislav`». Диспетчер шукає вільну машину з назвою `ls` у своїх гаражах за списком (`PATH`) і відправляє її за адресою. Немає такої машини в жодному гаражі — «command not found»." },
        { type: "cli", title: "Хто я і що за shell",
          intro: "<p>Усі команди нижче лише показують інформацію — ризику немає.</p>",
          commands: [
            { cmd: "echo $SHELL", explain: "Шлях до твоєї оболонки. На Raspberry Pi OS — <code>/bin/bash</code>.", output: "/bin/bash", risk: "low" },
            { cmd: "whoami", explain: "Від імені якого користувача виконуються команди.", output: "stanislav", risk: "low" },
            { cmd: "pwd", explain: "Повний шлях до поточної папки. Після входу по SSH — домашня папка.", output: "/home/stanislav", risk: "low" },
            { cmd: "history", explain: "Список попередніх команд. Стрілки <span class=\"kbd\">↑</span> / <span class=\"kbd\">↓</span> гортають їх у рядку вводу.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: яка оболонка?",
          task: "Виведи шлях до оболонки, яку використовує твій користувач на Pi.",
          expected: ["echo $SHELL", "echo \"$SHELL\""], output: "/bin/bash",
          hint: "Виведи на екран змінну `SHELL` — перед назвою змінної стоїть знак долара.",
          explain: "На Pi — `bash`, на Mac — `zsh`. Базові команди однакові, але конфігураційні файли різні: `~/.bashrc` на Pi, `~/.zshrc` на Mac." },
        { type: "cli", title: "Де живе програма",
          commands: [
            { cmd: "which python3", explain: "Повний шлях до файлу, який запуститься за командою. Порожній вивід — команди немає в <code>PATH</code>.", output: "/usr/bin/python3", risk: "low" },
            { cmd: "command -v git", explain: "Те саме, але стандартний спосіб для скриптів: працює і для вбудованих команд shell.", output: "/usr/bin/git", risk: "low" },
            { cmd: "echo $PATH | tr ':' '\\n'", explain: "Папки з <code>PATH</code> по одній на рядок: <code>tr</code> замінює двокрапки на переноси.", output: "/usr/local/bin\n/usr/bin\n/bin\n/usr/local/games\n/usr/games", risk: "low" }
          ] },
        { type: "check", title: "command not found",
          question: "Ти ввів `htop`, а bash відповів `command not found`. Що це найімовірніше означає?",
          options: ["Програми немає в жодній папці з `PATH` — її, мабуть, не встановлено", "Pi перегрілася", "У тебе немає інтернету"],
          correct: 0, feedback: "Shell перебрав усі папки з `PATH` і не знайшов файл `htop`. На Pi це лікується `sudo apt install htop` (модуль про apt)." },
        { type: "terminal", title: "Спробуй: де python3?",
          task: "Дізнайся повний шлях до програми `python3`, яка запуститься на Pi.",
          expected: ["which python3", "command -v python3"], output: "/usr/bin/python3",
          hint: "Англійське «which» — «який саме».",
          explain: "`/usr/bin/python3` — системний Python з Raspberry Pi OS. Коли активуєш venv (модуль про Python), шлях зміниться на папку проєкту." },
        { type: "cli", title: "Довідка і пошук команд",
          commands: [
            { cmd: "man ls", explain: "Повна довідка (manual). <span class=\"kbd\">Space</span> — далі, <code>/слово</code> — пошук, <code>q</code> — вихід.", risk: "low" },
            { cmd: "apropos network", explain: "Шукає команди за словом в описах. Допомагає, коли знаєш задачу, але не назву команди.", output: "ip (8)               - show / manipulate routing, network devices…\nnmcli (1)            - command-line tool for controlling NetworkManager\nping (8)             - send ICMP ECHO_REQUEST to network hosts", risk: "low" },
            { cmd: "ls --help", explain: "Коротка довідка прямо в терміналі — швидше, ніж <code>man</code>.", risk: "low" }
          ] },
        { type: "check", title: "Як вийти з man",
          question: "Ти відкрив `man ls` і прочитав потрібне. Як повернутися до запрошення?",
          options: ["Ввести `exit`", "Натиснути `q`", "Закрити SSH-сесію"],
          correct: 1, feedback: "`man` показує довідку в переглядачі `less`, з якого виходять клавішею `q`. `exit` тут не спрацює, а закривати сесію нема потреби." },
        { type: "summary", title: "Підсумок",
          points: ["На Pi працює `bash`, на Mac — `zsh`; базові команди однакові.", "Рядок команди = програма + прапорці + аргументи.", "`which` і `command -v` показують, звідки запускається програма; `command not found` — її немає в `PATH`.", "`man команда` (вихід — `q`), `команда --help` і `apropos слово` — три способи знайти потрібне."] }
      ],
      glossary: [
        { term: "bash", def: "Оболонка (shell) за замовчуванням у Raspberry Pi OS." },
        { term: "PATH", def: "Змінна зі списком папок, де shell шукає програми." },
        { term: "Прапорець (опція)", def: "Модифікатор команди з дефісом: `-l`, `-a`, `--help`." },
        { term: "man", def: "Вбудована довідка до команди; вихід — клавіша `q`." }
      ],
      quiz: [
        { question: "У команді `ls -la /home/stanislav` що є аргументом?", options: ["`ls`", "`-la`", "`/home/stanislav`"], correct: 2, feedback: "`ls` — команда, `-la` — прапорці, `/home/stanislav` — аргумент: з якою папкою працювати." },
        { question: "Ти забув назву команди, яка показує мережеві інтерфейси. Що допоможе знайти її за словом «network»?", options: ["`apropos network`", "`which network`", "`echo $PATH`"], correct: 0, feedback: "`apropos` шукає за словом в описах усіх команд. `which` потребує точної назви, а `PATH` лише показує папки." },
        { question: "Що покаже `which python3`, якщо python3 встановлено?", options: ["Версію Python", "Повний шлях до файлу програми, наприклад `/usr/bin/python3`", "Список усіх Python-пакетів"], correct: 1, feedback: "`which` відповідає на питання «який саме файл запуститься». Версію показує `python3 --version`." },
        { question: "Чим відрізняється домашня папка на Pi від Mac?", options: ["На Pi — `/home/stanislav`, на Mac — `/Users/Stas`", "Нічим, в обох — `/Users/stas`", "На Pi домашньої папки немає"], correct: 0, feedback: "Linux тримає домашні папки в `/home`, macOS — у `/Users`. Скорочення `~` працює на обох." },
        { question: "Який ризик у команд `whoami`, `pwd`, `echo $PATH`, `man ls`?", options: ["Високий — змінюють систему", "Середній — змінюють налаштування користувача", "Низький — лише показують інформацію"], correct: 2, feedback: "Усі вони тільки читають і виводять. Їх можна вводити без жодних побоювань." },
        { question: "Як найшвидше повторити команду, яку ти ввів хвилину тому на Pi?", options: ["Перепідключитися по SSH", "Натиснути стрілку ↑ і Enter", "Ввести `repeat`"], correct: 1, feedback: "Стрілка ↑ гортає історію команд bash. Повну історію показує `history`." }
      ]
    }
  ]
});
