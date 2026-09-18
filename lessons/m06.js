window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m06", order: 6, title: "Python і venv", subtitle: "Скрипти на Pi, pip і віртуальні середовища", icon: "code",
  goal: "Після модуля ти запускаєш Python-скрипти на Pi, розумієш помилку externally-managed-environment і ставиш бібліотеки у власне venv, не ламаючи системний Python.",
  lessons: [
    {
      id: "m06-l01", title: "Python, pip і venv без поломок", minutes: 13,
      steps: [
        { type: "story", title: "pip відмовляється працювати",
          body: "<p>Ти пишеш скрипт, якому потрібна бібліотека <code>requests</code>. Вводиш звичне <code>pip3 install requests</code> — а замість установки бачиш червоне <code>error: externally-managed-environment</code>.</p><p>Це не поломка Pi, а захист. Розберемося, від чого він захищає і як правильно ставити бібліотеки.</p>" },
        { type: "concept", title: "Системний Python і venv",
          body: "<p>На Raspberry Pi OS Trixie (Debian 13), як і в попередній Bookworm, системним Python користується сама ОС: частину її інструментів написано на Python, а бібліотеки для них ставить <code>apt</code>. Тому <code>pip</code> поза віртуальним середовищем заблоковано (стандарт PEP 668).</p><p><strong>venv</strong> — окрема папка проєкту (зазвичай <code>.venv</code>) з власним Python і власними бібліотеками. Що ставиш туди, не зачіпає систему.</p>",
          analogy: "Системний Python — як спільна кухня в гуртожитку: посуд там розставив комендант (`apt`), і якщо ти переставиш усе під себе, у сусідів зламається вечеря. `venv` — твоя власна валіза з посудом: бери в неї що завгодно, спільна кухня від цього не постраждає." },
        { type: "cli", title: "Версія Python і перша спроба pip",
          intro: "<p>Команди виконуються на Pi в папці проєкту <code>~/projects/python-test</code>.</p>",
          commands: [
            { cmd: "python3 --version", explain: "Показує версію Python 3. Точний номер залежить від версії Raspberry Pi OS.", output: "Python 3.13.5", risk: "low" },
            { cmd: "pip3 install requests", explain: "Поза venv на сучасній Raspberry Pi OS не встановить нічого — pip зупиниться з помилкою <code>externally-managed-environment</code> і підкаже шлях через venv.", output: "error: externally-managed-environment\n\n× This environment is externally managed\n╰─> To install Python packages system-wide, try apt install\n    python3-xyz, where xyz is the package you are trying to\n    install.\n    ...\n    If you wish to install a non-Debian-packaged Python package,\n    create a virtual environment using python3 -m venv path/to/venv.", risk: "medium" },
            { cmd: "python3 main.py", explain: "Запускає скрипт <code>main.py</code> з поточної папки. Завжди пиши <code>python3</code>, а не <code>python</code>.", output: "Hello from Raspberry Pi 5", risk: "low" }
          ] },
        { type: "check", title: "Що означає помилка",
          question: "`pip3 install requests` на Pi видав `externally-managed-environment`. Що це означає?",
          options: ["Пакета `requests` не існує", "Pi не має інтернету", "Система захищає свій Python від змін через pip — бібліотеку треба ставити у venv або через `apt`"],
          correct: 2, feedback: "Це захист PEP 668: системним Python керує `apt`. Інтернет і назва пакета тут ні до чого — pip навіть не почав завантаження." },
        { type: "terminal", title: "Спробуй: створи venv",
          prompt: "stanislav@raspberrypi:~/projects/python-test $",
          task: "Створи віртуальне середовище в папці `.venv` поточного проєкту.",
          expected: ["python3 -m venv .venv", "python3 -m venv .venv/", "python3 -m venv ./.venv"],
          output: "",
          hint: "Запусти модуль `venv` через `python3 -m` і вкажи назву папки з крапкою на початку.",
          explain: "Команда нічого не виводить, але в проєкті з'явилась прихована папка `.venv` з власним Python і pip. Її видно через `ls -la`." },
        { type: "cli", title: "Робота у venv",
          commands: [
            { cmd: "source .venv/bin/activate", explain: "Вмикає venv у поточній сесії. На початку запрошення з'являється <code>(.venv)</code> — тепер <code>python</code> і <code>pip</code> беруться з папки проєкту.", risk: "low" },
            { cmd: "pip install requests", explain: "Усередині venv установка дозволена і зачіпає лише <code>.venv</code> цього проєкту.", output: "Collecting requests\n...\nSuccessfully installed certifi charset-normalizer idna requests urllib3", risk: "medium" },
            { cmd: "deactivate", explain: "Вимикає venv: <code>(.venv)</code> зникає із запрошення, знову працює системний Python.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: увімкни venv",
          prompt: "stanislav@raspberrypi:~/projects/python-test $",
          task: "Активуй віртуальне середовище `.venv`, яке щойно створив.",
          expected: ["source .venv/bin/activate", ". .venv/bin/activate", "source ./.venv/bin/activate", ". ./.venv/bin/activate"],
          output: "(.venv) stanislav@raspberrypi:~/projects/python-test $",
          hint: "Скрипт активації лежить у підпапці `bin` середовища; його треба «підключити» командою `source`.",
          explain: "Префікс `(.venv)` у запрошенні — знак, що venv увімкнено. Команда `which python` тепер покаже шлях усередині `.venv`." },
        { type: "callout", variant: "danger", title: "--break-system-packages — не вихід",
          body: "<p>В інтернеті радять <code>pip install --break-system-packages …</code>. Прапорець знімає захист, і pip пише бібліотеки прямо в системний Python. Оновлення чи інша версія пакета може зламати системні програми, а відкотити це непросто.</p><p><strong>Безпечно:</strong> venv для свого проєкту або системний пакет через <code>sudo apt install python3-…</code>.</p>" },
        { type: "cli", title: "Два безпечні шляхи і один небезпечний",
          commands: [
            { cmd: "sudo apt install python3-requests", explain: "Ставить бібліотеку для всієї системи з репозиторію Raspberry Pi OS. Версія може бути старішою, але узгодженою з ОС.", risk: "medium" },
            { cmd: "python3 -m venv --system-site-packages .venv", explain: "venv, який бачить і системні бібліотеки. Зручно для GPIO: <code>gpiozero</code> на Raspberry Pi OS уже встановлено системно.", risk: "medium" },
            { cmd: "pip install --break-system-packages requests", explain: "Обходить захист і змінює системний Python. Ризик зламати програми ОС — не використовуй.", risk: "high" }
          ] },
        { type: "check", title: "Скрипт для GPIO у venv",
          question: "Проєкт у venv має керувати світлодіодом через `gpiozero`, який уже стоїть у системі. Як найпростіше дати venv доступ до нього?",
          options: ["Створити venv з прапорцем `--system-site-packages`", "Виконати `pip install --break-system-packages gpiozero`", "Запускати скрипт через `sudo python3`"],
          correct: 0, feedback: "`--system-site-packages` дозволяє venv бачити системні бібліотеки, не змінюючи їх. Інші варіанти ламають захист або дають зайві права root." },
        { type: "summary", title: "Підсумок",
          points: ["Поза venv `pip` на сучасній Raspberry Pi OS блокується помилкою `externally-managed-environment` — це захист системи.", "`python3 -m venv .venv` → `source .venv/bin/activate` → `pip install …` → `deactivate`.", "Системні бібліотеки — через `sudo apt install python3-…`.", "`--break-system-packages` — високий ризик; безпечна альтернатива — venv."] }
      ],
      glossary: [
        { term: "venv", def: "Віртуальне середовище Python: папка проєкту з власним інтерпретатором і бібліотеками." },
        { term: "pip", def: "Менеджер пакетів Python; встановлює бібліотеки з PyPI." },
        { term: "externally-managed-environment", def: "Помилка pip: системним Python керує `apt`, тому ставити пакети туди через pip заборонено." },
        { term: "PEP 668", def: "Стандарт Python, за яким дистрибутив може позначити свій Python як «керований ззовні»." },
        { term: "(.venv)", def: "Префікс у запрошенні, що показує: віртуальне середовище увімкнене." }
      ],
      quiz: [
        { question: "Ти створив venv, але забув його активувати, і вводиш `pip3 install requests`. Що станеться на сучасній Raspberry Pi OS?", options: ["Пакет встановиться у `.venv` автоматично", "pip відмовить з `externally-managed-environment`", "Пакет встановиться для всієї системи"], correct: 1, feedback: "Без активації працює системний pip, а його захищає PEP 668. Спершу `source .venv/bin/activate`." },
        { question: "Як зрозуміти, що venv зараз увімкнене?", options: ["Запрошення починається з `(.venv)`", "Команда `pwd` показує `.venv`", "Змінюється ім'я хоста"], correct: 0, feedback: "Скрипт `activate` додає назву середовища на початок запрошення. Поточна папка при цьому не змінюється." },
        { question: "Навіщо кожному проєкту окремий venv?", options: ["Щоб Python працював швидше", "Так вимагає SSH", "Щоб бібліотеки й версії одного проєкту не конфліктували з іншими та з системою"], correct: 2, feedback: "venv ізолює залежності: проєкту A потрібна одна версія бібліотеки, проєкту B — інша, і вони не заважають одне одному." },
        { question: "Яка команда правильно вимикає venv?", options: ["`exit`", "`deactivate`", "`rm -rf .venv`"], correct: 1, feedback: "`deactivate` лише вимикає середовище. `exit` закриє SSH-сесію, а `rm -rf .venv` видалить середовище зовсім." },
        { question: "Порада з форуму: «додай `--break-system-packages`, і помилка зникне». Чому це погана ідея?", options: ["Прапорця не існує", "Він працює лише на Mac", "Він пише пакети в системний Python і може зламати програми ОС"], correct: 2, feedback: "Прапорець справжній, але знімає захист. Безпечно — venv або `sudo apt install python3-…`." },
        { question: "Тобі потрібна бібліотека для всієї системи, без venv. Який шлях правильний?", options: ["`sudo apt install python3-<назва>`", "`sudo pip3 install <назва>`", "Скопіювати бібліотеку з Mac"], correct: 0, feedback: "Системні бібліотеки ставить `apt` — він знає залежності ОС. `sudo pip3` так само заблокований і небезпечний." }
      ]
    }
  ]
});
