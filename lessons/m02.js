window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m02", order: 2, title: "Файли і папки", subtitle: "Навігація, створення проєкту, nano, копіювання і видалення", icon: "folder",
  goal: "Після модуля ти впевнено ходиш деревом папок на Pi, створюєш структуру проєкту, редагуєш файли в nano і видаляєш лише те, що справді хотів.",
  lessons: [
    {
      id: "m02-l01", title: "Навігація і створення проєкту", minutes: 12,
      steps: [
        { type: "story", title: "Перший проєкт на Pi",
          body: "<p>Ти підключився до Pi по SSH і хочеш зробити перший проєкт — скрипт, що блимає світлодіодом. На Pi немає Finder: папки й файли створюєш командами.</p><p>У цьому уроці ти навчишся орієнтуватися в дереві папок, створиш <code>~/projects/led-test</code> з файлом <code>main.py</code> і відредагуєш його в <code>nano</code>.</p>" },
        { type: "concept", title: "Дерево папок і шляхи",
          body: "<p>Файлова система Linux — дерево з коренем <code>/</code>. Твоя домашня папка — <code>/home/stanislav</code>, скорочено <code>~</code>.</p><p><strong>Абсолютний</strong> шлях починається з <code>/</code> і однаковий звідусіль. <strong>Відносний</strong> рахується від поточної папки: <code>..</code> — батьківська, <code>.</code> — поточна.</p>",
          analogy: "Шлях — як адреса в місті. Абсолютний `/home/stanislav/projects` — повна адреса з назвою міста: доставка знайде її звідусіль. Відносний `projects` — «сусідній будинок»: працює, лише якщо ти стоїш у правильному місці (`pwd` каже, де саме)." },
        { type: "cli", title: "Де я і що тут є",
          intro: "<p>Ці команди лише читають — їх можна вводити скільки завгодно.</p>",
          commands: [
            { cmd: "pwd", explain: "Повний шлях до поточної папки. Перевіряй перед <code>cp</code>, <code>mv</code>, <code>rm</code>.", output: "/home/stanislav", risk: "low" },
            { cmd: "ls", explain: "Короткий список файлів і папок.", output: "projects", risk: "low" },
            { cmd: "ls -la", explain: "<code>-l</code> — детально (права, власник, розмір, дата), <code>-a</code> — разом із прихованими файлами на крапку.", output: "drwxr-xr-x 5 stanislav stanislav 4096 Sep 18 10:00 .\ndrwxr-xr-x 3 root root 4096 Sep  1 09:00 ..\n-rw-r--r-- 1 stanislav stanislav 3523 Sep  1 09:00 .bashrc\ndrwxr-xr-x 3 stanislav stanislav 4096 Sep 18 10:00 projects", risk: "low" },
            { cmd: "cd ~/projects", explain: "Перейти в папку. <code>cd ..</code> — на рівень вище, <code>cd ~</code> або просто <code>cd</code> — додому.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: детальний список",
          task: "Покажи вміст домашньої папки детально, разом із прихованими файлами.",
          expected: ["ls -la", "ls -al", "ls -l -a", "ls -a -l"],
          output: "drwxr-xr-x 5 stanislav stanislav 4096 Sep 18 10:00 .\ndrwxr-xr-x 3 root root 4096 Sep  1 09:00 ..\n-rw-r--r-- 1 stanislav stanislav  220 Sep  1 09:00 .bash_logout\n-rw-r--r-- 1 stanislav stanislav 3523 Sep  1 09:00 .bashrc\ndrwxr-xr-x 3 stanislav stanislav 4096 Sep 18 10:00 projects",
          hint: "Команда списку з двома прапорцями: один — «довгий формат», другий — «усі файли».",
          explain: "Файли на крапку (`.bashrc`) — приховані налаштування. Перший стовпчик — права: `d` на початку означає папку." },
        { type: "check", title: "Куди веде cd ..",
          question: "Ти в `/home/stanislav/projects/led-test` і вводиш `cd ..`. Де ти опинишся?",
          options: ["У `/home/stanislav`", "У `/home/stanislav/projects`", "У корені `/`"],
          correct: 1, feedback: "`..` — рівно один рівень вище, тобто `/home/stanislav/projects`. Додому ведуть `cd ~` або `cd` без аргументу." },
        { type: "cli", title: "Створюємо проєкт",
          commands: [
            { cmd: "mkdir -p ~/projects/led-test", explain: "Створює папку. <code>-p</code> створює й проміжні папки, якщо їх ще немає, і не свариться, якщо папка вже є.", risk: "low" },
            { cmd: "touch main.py", explain: "Створює порожній файл (або оновлює час зміни наявного).", risk: "low" },
            { cmd: "nano main.py", explain: "Текстовий редактор у терміналі. <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">O</span>, потім <span class=\"kbd\">Enter</span> — зберегти; <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">X</span> — вийти.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: папка проєкту",
          task: "Однією командою створи папку `led-test` усередині `~/projects` так, щоб команда не зламалась, навіть якщо `projects` ще не існує.",
          expected: ["mkdir -p ~/projects/led-test", "mkdir -p ~/projects/led-test/", "mkdir -p /home/stanislav/projects/led-test", "mkdir -p /home/stanislav/projects/led-test/", "mkdir -p projects/led-test", "mkdir -p projects/led-test/"],
          output: "",
          hint: "Команда створення папки з прапорцем, який дозволяє будувати весь ланцюжок папок.",
          explain: "`mkdir` мовчить, якщо все вдалося. Перевір результат: `ls ~/projects`." },
        { type: "cli", title: "Читаємо файли без редагування",
          commands: [
            { cmd: "cat main.py", explain: "Виводить увесь файл одразу — для коротких файлів.", output: "# LED test project\nprint(\"GPIO project ready\")", risk: "low" },
            { cmd: "less main.py", explain: "Перегляд з прокруткою: пробіл — далі, <code>/слово</code> — пошук, <code>q</code> — вихід.", risk: "low" },
            { cmd: "head -5 main.py", explain: "Перші 5 рядків. <code>tail -5</code> — останні 5.", risk: "low" },
            { cmd: "tail -f app.log", explain: "Стежить за файлом і показує нові рядки в реальному часі. Вихід — <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span>.", risk: "low" }
          ] },
        { type: "check", title: "Лог росте на очах",
          question: "Скрипт пише в `app.log`, і ти хочеш бачити нові рядки, поки він працює. Що обрати?",
          options: ["`cat app.log` кожні кілька секунд", "`nano app.log`", "`tail -f app.log`"],
          correct: 2, feedback: "`tail -f` не завершується і показує кожен новий рядок. `cat` дає лише знімок, а `nano` відкриває файл на редагування — ризик випадково щось змінити." },
        { type: "summary", title: "Підсумок",
          points: ["`~` — домашня папка `/home/stanislav`; `..` — рівень вище; абсолютний шлях починається з `/`.", "`pwd`, `ls`, `ls -la`, `cd` лише орієнтують — ризик низький.", "`mkdir -p` будує цілий ланцюжок папок, `touch` створює порожній файл.", "У `nano`: Ctrl+O — зберегти, Ctrl+X — вийти.", "`cat`, `less`, `head`, `tail` читають файли; `tail -f` стежить за логом наживо."] }
      ],
      glossary: [
        { term: "Домашня папка (~)", def: "Особиста папка користувача; для `stanislav` це `/home/stanislav`." },
        { term: "Абсолютний шлях", def: "Шлях від кореня `/`, однаковий з будь-якої поточної папки." },
        { term: "Відносний шлях", def: "Шлях від поточної папки: `projects/led-test`, `..`, `./main.py`." },
        { term: "Прихований файл", def: "Файл, чия назва починається з крапки; видно через `ls -a`." },
        { term: "nano", def: "Простий текстовий редактор у терміналі, є на Raspberry Pi OS з коробки." }
      ],
      quiz: [
        { question: "Ти ввів `cd` без жодного аргументу. Що станеться?", options: ["Ти повернешся в домашню папку", "Нічого — потрібна назва папки", "Ти перейдеш у корінь `/`"], correct: 0, feedback: "У bash `cd` без аргументу — те саме, що `cd ~`: перехід у домашню папку." },
        { question: "Чим `mkdir -p ~/projects/led-test` краща за просто `mkdir ~/projects/led-test` для нового користувача?", options: ["Вона створює папку з правами root", "Вона створить і `projects`, якщо її ще немає", "Вона одразу переходить у нову папку"], correct: 1, feedback: "Без `-p` команда впаде з помилкою, якщо проміжної папки `projects` немає. У нову папку `mkdir` не переходить." },
        { question: "Ти відредагував файл у `nano`. Що зробити, щоб зберегти зміни?", options: ["Натиснути Ctrl+X одразу — зберігається автоматично", "Ввести `:wq`", "Ctrl+O, Enter, потім Ctrl+X"], correct: 2, feedback: "У nano Ctrl+O записує файл, Enter підтверджує назву, Ctrl+X виходить. `:wq` — це з редактора vim." },
        { question: "Навіщо `ls -la`, якщо є `ls`?", options: ["Щоб побачити права, власника, розмір і приховані файли", "Щоб відсортувати файли за алфавітом", "Щоб видалити порожні папки"], correct: 0, feedback: "`-l` додає деталі, `-a` показує файли на крапку. `ls` і так сортує за алфавітом, а видаляти він не вміє." },
        { question: "Файл `app.log` має 50 000 рядків. Як зручніше подивитися лише останні записи?", options: ["`cat app.log`", "`tail -20 app.log`", "`head -20 app.log`"], correct: 1, feedback: "Нові записи дописуються в кінець, тому `tail` — те, що треба. `cat` вивалить усі 50 000 рядків, `head` покаже найстаріші." },
        { question: "`pwd` показує `/home/stanislav/projects`. Куди вказує відносний шлях `led-test/main.py`?", options: ["`/led-test/main.py`", "`/home/stanislav/led-test/main.py`", "`/home/stanislav/projects/led-test/main.py`"], correct: 2, feedback: "Відносний шлях додається до поточної папки з `pwd`." }
      ]
    },
    {
      id: "m02-l02", title: "Копіювання, перейменування і видалення", minutes: 12,
      steps: [
        { type: "story", title: "Бекап перед змінами",
          body: "<p>Перед тим як міняти робочий скрипт, розумно зробити копію. А старі тестові папки час від часу треба прибирати.</p><p>Тут ховається головна пастка Linux: <code>rm</code> не має кошика. Видалене не повернути. Тому вчимося копіювати, перейменовувати і видаляти — свідомо.</p>" },
        { type: "concept", title: "cp, mv і rm — три різні дії",
          body: "<p><code>cp</code> робить копію — оригінал лишається. <code>mv</code> переносить або перейменовує — оригінальної назви більше немає. <code>rm</code> видаляє назавжди.</p><p>Увага: <code>cp</code> і <code>mv</code> без запитань <strong>перезаписують</strong> файл з такою самою назвою в місці призначення.</p>",
          analogy: "`cp` — ксерокопія документа: у тебе два аркуші. `mv` — перекласти аркуш в іншу теку або переписати назву на обкладинці. `rm` — шредер, а не кошик для паперу: дістати назад уже нічого." },
        { type: "cli", title: "Копіювати і перейменовувати",
          commands: [
            { cmd: "cp main.py main.py.bak", explain: "Копія файлу поруч — простий бекап перед змінами.", risk: "medium" },
            { cmd: "cp -r led-test led-test-copy", explain: "Копія папки з усім вмістом. Без <code>-r</code> <code>cp</code> відмовиться копіювати папку.", risk: "medium" },
            { cmd: "mv old.py new.py", explain: "Перейменування. <code>mv file.py ~/projects/</code> — перенесення в іншу папку.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: бекап скрипта",
          task: "Ти в `~/projects/led-test`. Зроби копію `main.py` з назвою `main.py.bak`.",
          prompt: "stanislav@raspberrypi:~/projects/led-test $",
          expected: ["cp main.py main.py.bak", "cp ./main.py main.py.bak", "cp main.py ./main.py.bak", "cp ./main.py ./main.py.bak"],
          output: "",
          hint: "Команда копіювання: спершу звідки, потім куди.",
          explain: "`cp` мовчить, якщо все вдалося. Тепер `ls` покаже і `main.py`, і `main.py.bak`." },
        { type: "check", title: "Перезапис без питань",
          question: "У папці є `config.txt` і `config-new.txt`. Ти вводиш `mv config-new.txt config.txt`. Що станеться?",
          options: ["Команда відмовиться, бо `config.txt` уже існує", "Старий `config.txt` буде замінено без попередження", "З'явиться `config.txt.1`"],
          correct: 1, feedback: "`mv` і `cp` за замовчуванням мовчки перезаписують. Щоб питали — прапорець `-i`: `mv -i`." },
        { type: "cli", title: "Видалення: від слабкого до найсильнішого",
          commands: [
            { cmd: "rm file.txt", explain: "Видаляє один файл. Без кошика.", risk: "medium" },
            { cmd: "rmdir empty", explain: "Видаляє лише <strong>порожню</strong> папку — найбезпечніший спосіб прибрати папку.", risk: "low" },
            { cmd: "rm -r folder", explain: "Рекурсивно видаляє папку з усім вмістом.", risk: "high" },
            { cmd: "rm -rf folder", explain: "Те саме, але <code>-f</code> (force) прибирає всі запитання й попередження. Одна помилка в шляху — і зникне не те.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "rm -rf — незворотно",
          body: "<p><code>rm -r</code> і <code>rm -rf</code> видаляють папку з усім вмістом <strong>назавжди</strong>: кошика немає, «скасувати» немає. Зайвий пробіл у <code>rm -rf ~/ projects</code> зітре всю домашню папку.</p><p>Безпечніше: спершу <code>pwd</code> і <code>ls folder</code>; видаляй через <code>rm -ri folder</code> (питає про кожен файл) або спершу перейменуй: <code>mv folder folder_old</code> — і видали через кілька днів, коли переконаєшся, що нічого не зламалось.</p>" },
        { type: "terminal", title: "Спробуй: прибрати порожню папку",
          task: "У `~/projects` є порожня папка `tmp`. Видали її найбезпечнішою командою — такою, що відмовиться працювати, якщо папка не порожня.",
          prompt: "stanislav@raspberrypi:~/projects $",
          expected: ["rmdir tmp", "rmdir tmp/", "rmdir ./tmp", "rmdir ./tmp/"],
          output: "",
          hint: "Існує окрема команда саме для порожніх папок: «remove directory».",
          explain: "`rmdir` не видалить папку з файлами — отримаєш `Directory not empty`. Це запобіжник, якого немає в `rm -r`." },
        { type: "check", title: "Обери безпечний шлях",
          question: "Треба прибрати стару папку `old-test`, але ти не певен, що в ній нічого важливого. Що найрозумніше?",
          options: ["`rm -rf old-test` — швидко й без питань", "`sudo rm -r old-test` — щоб точно видалилось", "`mv old-test old-test_old`, перевірити, що все працює, а видалити пізніше"],
          correct: 2, feedback: "Перейменування оборотне: якщо щось зламається — повернеш назву. `rm -rf` і `sudo rm` нічого не дають відновити." },
        { type: "summary", title: "Підсумок",
          points: ["`cp` копіює (`-r` для папок), `mv` переносить або перейменовує — обидва мовчки перезаписують.", "`rm` не має кошика: видалене не повернути.", "`rmdir` видаляє лише порожні папки — найбезпечніший варіант.", "`rm -r` і `rm -rf` — високий ризик: спершу `pwd` і `ls`, краще `rm -ri` або `mv` у `_old`."] }
      ],
      glossary: [
        { term: "Рекурсивно (-r)", def: "Разом з усім вмістом папки, на всіх рівнях вкладення." },
        { term: "-f (force)", def: "Прапорець `rm`, що вимикає всі запитання й попередження." },
        { term: "-i (interactive)", def: "Прапорець `cp`, `mv`, `rm`: питати підтвердження перед перезаписом чи видаленням." },
        { term: "Бекап", def: "Копія файлу чи папки до змін, щоб можна було повернутися." }
      ],
      quiz: [
        { question: "Ти ввів `cp led-test backup` і отримав `cp: -r not specified; omitting directory 'led-test'`. Що не так?", options: ["Для копіювання папки потрібен `-r`", "Папка `backup` уже існує", "Потрібен `sudo`"], correct: 0, feedback: "`cp` без `-r` копіює лише файли. `cp -r led-test backup` скопіює папку з усім вмістом." },
        { question: "Чим `rm -rf folder` небезпечніший за `rm -r folder`?", options: ["Він ще й форматує диск", "Він видаляє швидше, але можна відновити", "Він не питає нічого навіть для захищених від запису файлів і не показує помилок"], correct: 2, feedback: "Обидва незворотні. `-f` прибирає останні запитання й попередження — помилку в шляху вже ніхто не помітить." },
        { question: "Що зробить `rmdir projects`, якщо в `projects` є файли?", options: ["Видалить усе разом з файлами", "Відмовиться: `Directory not empty`", "Перемістить файли в кошик"], correct: 1, feedback: "`rmdir` видаляє лише порожні папки — це вбудований запобіжник." },
        { question: "Яка команда перейменує `test.py` на `led.py`?", options: ["`mv test.py led.py`", "`cp test.py led.py`", "`rename test.py`"], correct: 0, feedback: "У Linux перейменування — це `mv` у тій самій папці. `cp` лишить обидва файли." },
        { question: "Що варто зробити перед будь-яким `rm -r`?", options: ["Перезавантажити Pi", "Перевірити `pwd` і `ls`, щоб точно знати, що видаляєш", "Додати `sudo`, щоб не було помилок"], correct: 1, feedback: "`pwd` і `ls` — дві секунди, які рятують від видалення не тієї папки. `sudo` лише збільшує масштаб можливої шкоди." },
        { question: "Ти хочеш видаляти файли по одному з підтвердженням. Яка команда?", options: ["`rm -f *.log`", "`rm -r *.log`", "`rm -i *.log`"], correct: 2, feedback: "`-i` питає про кожен файл. `-f` навпаки нічого не питає, а `-r` потрібен лише для папок." }
      ]
    }
  ]
});
