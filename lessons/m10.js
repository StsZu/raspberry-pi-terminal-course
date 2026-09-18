window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m10", order: 10, title: "Git і передача файлів", subtitle: "Код з GitHub і з Mac — на Pi", icon: "git",
  goal: "Після модуля ти клонуєш і оновлюєш проєкт на Pi через Git, розгортаєш зміни в сервіс і копіюєш файли з Mac через scp та rsync, не затираючи зайвого.",
  lessons: [
    {
      id: "m10-l01", title: "Git на Pi", minutes: 12,
      steps: [
        { type: "story", title: "Код пишеш на Mac, а працює він на Pi",
          body: "<p>Скрипт для світлодіода зручно писати на Mac у звичному редакторі, а запускати треба на Raspberry Pi. Носити флешку туди-сюди — довго, а редагувати все в <code>nano</code> на Pi — незручно.</p><p>Git розв'язує це: Mac відправляє зміни на GitHub, Pi їх забирає. Заразом ти маєш історію й можливість відкотитися.</p>" },
        { type: "concept", title: "Репозиторій, коміт і remote",
          body: "<p><strong>Репозиторій</strong> — папка проєкту з історією змін. <strong>Коміт</strong> — збережений знімок файлів з підписом. <strong>Remote</strong> (зазвичай <code>origin</code> на GitHub) — спільна копія, через яку Mac і Pi обмінюються комітами.</p><p><code>git push</code> відправляє твої коміти на remote, <code>git pull</code> забирає чужі (або з іншого комп'ютера) до себе.</p>",
          analogy: "GitHub — як спільна поштова скринька під'їзду. Mac кидає туди конверт з новою версією (`git push`), Pi зазирає в скриньку й забирає конверт (`git pull`). Кожен конверт підписаний і датований — це коміт." },
        { type: "cli", title: "Отримати проєкт і роздивитися",
          intro: "<p>Команди виконуються на Pi. Якщо Git не встановлено — <code>sudo apt install git</code>.</p>",
          commands: [
            { cmd: "git --version", explain: "Перевіряє, що Git встановлено, і показує версію (залежить від версії ОС).", output: "git version 2.39.5", risk: "low" },
            { cmd: "git clone https://github.com/stas/led-test.git", explain: "Копіює репозиторій у нову папку <code>led-test</code> у поточній папці. Для приватного репозиторію потрібен SSH-ключ або токен — токен ніколи не вписуй у команду чи файл проєкту.", output: "Cloning into 'led-test'...\nremote: Enumerating objects: 12, done.\nReceiving objects: 100% (12/12), done.", risk: "medium" },
            { cmd: "git status", explain: "Що змінено, що нове, що вже підготовлено до коміту. Нічого не змінює.", risk: "low" },
            { cmd: "git log --oneline", explain: "Коротка історія: один коміт — один рядок з хешем і підписом.", output: "3f9c2e1 Add blink delay\na1b2c3d Initial commit", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: що змінилося?",
          prompt: "stanislav@raspberrypi:~/projects/led-test $",
          task: "Ти в папці `~/projects/led-test`. Перевір стан репозиторію: які файли змінено й чи є що комітити.",
          expected: ["git status"],
          output: "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n\tmodified:   main.py\n\nno changes added to commit (use \"git add\" and/or \"git commit -a\")",
          hint: "Команда Git, яка буквально питає про «стан».",
          explain: "`main.py` змінено на Pi, але ще не додано до коміту. `git status` — перша команда перед будь-якою дією в репозиторії." },
        { type: "check", title: "Що робить status",
          question: "Ти запустив `git status` і побачив `modified: main.py`. Що сталося з файлом?",
          options: ["Git уже відправив зміни на GitHub", "Файл змінено локально, але зміни ще не в коміті", "Git відкотив файл до попередньої версії"],
          correct: 1, feedback: "`git status` лише показує стан. `modified` означає, що файл відрізняється від останнього коміту, і ці зміни поки ніде не збережені в історії." },
        { type: "cli", title: "Зафіксувати й відправити зміни",
          commands: [
            { cmd: "git diff", explain: "Показує рядки, які змінилися (ще не в коміті). Дивися його перед кожним комітом.", output: "-DELAY = 1.0\n+DELAY = 0.5", risk: "low" },
            { cmd: "git add .", explain: "Готує до коміту всі змінені й нові файли в поточній папці. Перевір <code>git status</code>, щоб не додати зайве (наприклад, <code>.venv</code> — його варто внести в <code>.gitignore</code>).", risk: "medium" },
            { cmd: "git commit -m \"Faster blink on Pi\"", explain: "Створює коміт з підписом. Змінює лише локальну історію.", risk: "medium" },
            { cmd: "git push", explain: "Відправляє коміти на GitHub. Потрібні права на запис у репозиторій.", risk: "medium" },
            { cmd: "git restore main.py", explain: "Викидає незакомічені зміни у файлі й повертає версію з останнього коміту. Ці зміни не відновити — спершу подивись <code>git diff</code>.", risk: "medium" }
          ] },
        { type: "check", title: "Відкотити правки",
          question: "Ти наплутав у `main.py` на Pi і хочеш повернути версію з останнього коміту. Що важливо знати про `git restore main.py`?",
          options: ["Вона відправить файл на GitHub", "Вона створить новий коміт з виправленням", "Незакомічені зміни в цьому файлі зникнуть без можливості відновлення"],
          correct: 2, feedback: "`git restore` перезаписує файл версією з коміту. Те, що ти не закомітив, Git ніде не зберігав — тому перед відкатом варто глянути `git diff`." },
        { type: "cli", title: "Розгортання: Mac → GitHub → Pi → сервіс",
          intro: "<p>Типовий цикл: на Mac <code>git push</code>, далі на Pi три кроки.</p>",
          commands: [
            { cmd: "git pull", explain: "Забирає нові коміти з GitHub і оновлює файли в робочій папці. Якщо на Pi є незакомічені правки в тих самих файлах — Git зупиниться й попросить розібратися.", output: "Updating a1b2c3d..3f9c2e1\nFast-forward\n main.py | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)", risk: "medium" },
            { cmd: "sudo systemctl restart my-service", explain: "Перезапускає сервіс, щоб він підхопив новий код. Без перезапуску працює стара версія, завантажена в пам'ять.", risk: "medium" },
            { cmd: "journalctl -u my-service -f", explain: "Стежить за логами сервісу наживо — видно, чи стартував новий код без помилок. <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span> — вийти, сервіс працює далі.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: забрати зміни",
          prompt: "stanislav@raspberrypi:~/projects/led-test $",
          task: "На Mac ти щойно зробив `git push`. Онови код на Pi з GitHub.",
          expected: ["git pull", "git pull origin main"],
          output: "Updating a1b2c3d..3f9c2e1\nFast-forward\n main.py | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)",
          hint: "Протилежність до push — «потягнути».",
          explain: "Pi отримав новий коміт. Код на диску оновлено, але сервіс ще працює зі старою версією — далі потрібен `sudo systemctl restart my-service`." },
        { type: "check", title: "Чому не видно змін",
          question: "Ти зробив `git pull` на Pi, але сервіс поводиться як раніше. Що найімовірніше пропущено?",
          options: ["Перезапуск сервісу: `sudo systemctl restart my-service`", "Ще один `git push` з Pi", "Команда `git clone` заново"],
          correct: 0, feedback: "Запущений процес тримає в пам'яті стару версію коду. `git pull` міняє лише файли — сервіс треба перезапустити, а потім перевірити `journalctl -u my-service -f`." },
        { type: "summary", title: "Підсумок",
          points: ["`git clone` — отримати проєкт, `git status` і `git diff` — подивитися зміни, нічого не ламаючи.", "`git add .` → `git commit -m` → `git push` фіксують і відправляють зміни.", "`git restore файл` безповоротно викидає незакомічені правки.", "Розгортання на Pi: `git pull` → `sudo systemctl restart my-service` → `journalctl -u my-service -f`."] }
      ],
      glossary: [
        { term: "Репозиторій", def: "Папка проєкту разом з історією змін Git." },
        { term: "Коміт", def: "Збережений знімок файлів з підписом і хешем, наприклад `3f9c2e1`." },
        { term: "Remote (origin)", def: "Віддалена копія репозиторію, зазвичай на GitHub, через яку синхронізуються Mac і Pi." },
        { term: "git pull / git push", def: "Забрати коміти з remote / відправити свої коміти на remote." }
      ],
      quiz: [
        { question: "Яку команду виконати першою, коли зайшов у репозиторій на Pi і не пам'ятаєш, що там міняв?", options: ["`git status`", "`git push`", "`git restore .`"], correct: 0, feedback: "`git status` лише показує стан. `git push` щось відправить, а `git restore .` викине всі незакомічені зміни." },
        { question: "`git clone` приватного репозиторію відповідає `Authentication failed`. Що правильно?", options: ["Вписати пароль від GitHub просто в URL команди", "Налаштувати SSH-ключ або токен доступу, не зберігаючи його у файлах проєкту", "Зробити `git pull` замість `clone`"], correct: 1, feedback: "GitHub не приймає пароль акаунта для Git. Потрібен SSH-ключ або токен; вписаний у URL чи файл, він може потрапити в історію чи на екран." },
        { question: "Навіщо дивитися `git diff` перед `git commit`?", options: ["Без нього коміт не створиться", "Він відправляє зміни на сервер", "Щоб побачити, які саме рядки потраплять у коміт, і не закомітити зайве"], correct: 2, feedback: "`git diff` лише показує різницю. Це остання нагода помітити налагоджувальний `print` чи випадкову правку." },
        { question: "Ти змінив `main.py` на Pi і на Mac одночасно, а потім зробив `git pull` на Pi. Що може статися?", options: ["Git повідомить про конфлікт і попросить розв'язати його вручну", "Git мовчки залишить версію з Mac", "Pi перезавантажиться"], correct: 0, feedback: "Якщо обидві сторони змінили ті самі рядки, Git не вгадує, яка версія правильна, — зупиняється й просить розібратися." },
        { question: "У чому ризик `git restore main.py`?", options: ["Файл буде видалено з GitHub", "Незакомічені зміни у файлі пропадуть назавжди", "Git видалить усю історію комітів"], correct: 1, feedback: "Відкат зачіпає лише робочу копію файлу. Але саме ті правки, яких нема в жодному коміті, відновити неможливо." },
        { question: "Який порядок розгортання нового коду з Mac у сервіс на Pi правильний?", options: ["`git pull` на Mac → `git push` на Pi → `sudo reboot`", "`git clone` на Pi щоразу заново → `python3 main.py`", "`git push` на Mac → `git pull` на Pi → `sudo systemctl restart my-service` → перевірка логів"], correct: 2, feedback: "Mac відправляє, Pi забирає, сервіс перезапускається, логи підтверджують, що новий код працює. Перезавантажувати всю Pi для цього не треба." }
      ]
    },
    {
      id: "m10-l02", title: "Mac → Pi: scp і rsync", minutes: 12,
      steps: [
        { type: "story", title: "Файл є на Mac, а потрібен на Pi",
          body: "<p>Не кожен файл варто класти в Git: тестові дані, фото, конфіг з локальними налаштуваннями. Їх простіше скопіювати напряму через мережу.</p><p>Для цього є <code>scp</code> і <code>rsync</code>. Обидві працюють поверх SSH і запускаються <strong>на Mac</strong>, а не на Pi.</p>" },
        { type: "concept", title: "scp — разово, rsync — синхронізація",
          body: "<table><thead><tr><th></th><th>scp</th><th>rsync</th></tr></thead><tbody><tr><td>Для чого</td><td>разово скопіювати файл чи папку</td><td>тримати папку на Pi в актуальному стані</td></tr><tr><td>Повторний запуск</td><td>копіює все знову</td><td>передає лише змінене</td></tr><tr><td>Видалення зайвого</td><td>ні</td><td>лише з <code>--delete</code></td></tr></tbody></table><p>Адреса на Pi пишеться як <code>користувач@хост:шлях</code>, наприклад <code>stanislav@raspberrypi.local:~/projects/led-test/</code>.</p>",
          analogy: "`scp` — як відправити посилку: пакуєш і відсилаєш усе, навіть якщо половина вже є в отримувача. `rsync` — як сусід, що звіряє два списки покупок і докуповує лише те, чого бракує." },
        { type: "cli", title: "Копіювання з Mac на Pi",
          intro: "<p>Усі команди — у Terminal на Mac. Папка призначення на Pi має існувати (<code>mkdir -p ~/projects/led-test</code> на Pi).</p>",
          commands: [
            { cmd: "scp main.py stanislav@raspberrypi.local:~/projects/led-test/", explain: "Копіює один файл у папку на Pi. Файл з такою самою назвою там буде перезаписано без питань.", output: "main.py                  100%  412   180.3KB/s   00:00", risk: "medium" },
            { cmd: "scp -r led-test stanislav@raspberrypi.local:~/projects/", explain: "<code>-r</code> — копіювати папку з усім вмістом. Без нього <code>scp</code> відмовиться копіювати папку.", risk: "medium" },
            { cmd: "rsync -av ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", explain: "<code>-a</code> зберігає структуру, права й дати, <code>-v</code> показує, що передано. Наступний запуск передасть лише змінені файли.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: один файл на Pi",
          prompt: "Stas@MacBook-Pro led-test %",
          task: "Ти на Mac у папці з `main.py`. Скопіюй `main.py` на Pi (користувач `stanislav`, хост `raspberrypi.local`) у папку `~/projects/led-test/`.",
          expected: [
            "scp main.py stanislav@raspberrypi.local:~/projects/led-test/",
            "scp main.py stanislav@raspberrypi.local:~/projects/led-test",
            "scp main.py stanislav@raspberrypi.local:/home/stanislav/projects/led-test/",
            "scp main.py stanislav@raspberrypi.local:/home/stanislav/projects/led-test",
            "scp main.py stanislav@10.0.0.50:~/projects/led-test/",
            "scp main.py stanislav@10.0.0.50:~/projects/led-test",
            "scp main.py stanislav@10.0.0.50:/home/stanislav/projects/led-test/",
            "scp main.py stanislav@10.0.0.50:/home/stanislav/projects/led-test",
            "scp ./main.py stanislav@raspberrypi.local:~/projects/led-test/"
          ],
          output: "main.py                  100%  412   180.3KB/s   00:00",
          hint: "Спершу що копіюєш, потім куди: `користувач@хост:папка`.",
          explain: "Файл пішов через SSH, тому знадобився б пароль або SSH-ключ. Перевір на Pi: `cat ~/projects/led-test/main.py`." },
        { type: "check", title: "Слеш у кінці має значення",
          question: "Яка різниця між `rsync -av ./led-test/ …:~/projects/led-test/` і `rsync -av ./led-test …:~/projects/led-test/`?",
          options: ["Жодної — rsync ігнорує слеш", "Друга команда видалить папку на Mac", "Перша копіює вміст папки, друга — саму папку, тож на Pi вийде `led-test/led-test`"],
          correct: 2, feedback: "Слеш у кінці джерела означає «вміст цієї папки». Без слеша rsync створить у призначенні ще одну папку `led-test`." },
        { type: "cli", title: "Корисні прапорці rsync і вхід без пароля",
          commands: [
            { cmd: "rsync -av --exclude '.venv' ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", explain: "Не передає віртуальне середовище Mac — на Pi воно все одно не запрацює, його створюють на місці.", risk: "medium" },
            { cmd: "rsync -av --dry-run --delete ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", explain: "<code>--dry-run</code> (або <code>-n</code>) лише показує, що було б скопійовано й видалено. Нічого не змінює.", risk: "low" },
            { cmd: "rsync -av --delete ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/", explain: "Робить папку на Pi точною копією Mac: файли, яких немає на Mac, <strong>видаляються на Pi</strong>. Логи чи дані, створені на Pi, зникнуть.", risk: "high" },
            { cmd: "ssh-copy-id stanislav@raspberrypi.local", explain: "Додає твій публічний SSH-ключ з Mac на Pi — після цього <code>ssh</code>, <code>scp</code> і <code>rsync</code> не питатимуть пароль. Спершу потрібен ключ: <code>ssh-keygen -t ed25519</code>.", risk: "medium" }
          ] },
        { type: "callout", variant: "danger", title: "rsync --delete стирає файли на Pi",
          body: "<p><code>--delete</code> видаляє в папці призначення все, чого немає в джерелі. Переплутаєш напрям чи шлях — і логи, бази даних або фото на Pi зникнуть без кошика.</p><p>Безпечно: спершу запусти ту саму команду з <code>--dry-run</code>, прочитай список <code>deleting …</code> і лише потім прибери <code>--dry-run</code>. А ще простіше — не вживати <code>--delete</code>, поки він справді не потрібен.</p>" },
        { type: "terminal", title: "Спробуй: синхронізувати проєкт",
          prompt: "Stas@MacBook-Pro Projects %",
          task: "Ти на Mac у папці, де лежить `led-test`. Синхронізуй вміст `./led-test/` у `~/projects/led-test/` на Pi (`stanislav@raspberrypi.local`) з прапорцями архіву й докладного виводу, без видалення.",
          expected: [
            "rsync -av ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/",
            "rsync -av led-test/ stanislav@raspberrypi.local:~/projects/led-test/",
            "rsync -va ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/",
            "rsync -va led-test/ stanislav@raspberrypi.local:~/projects/led-test/",
            "rsync -av ./led-test/ stanislav@raspberrypi.local:/home/stanislav/projects/led-test/",
            "rsync -av led-test/ stanislav@raspberrypi.local:/home/stanislav/projects/led-test/",
            "rsync -av ./led-test/ stanislav@10.0.0.50:~/projects/led-test/",
            "rsync -av led-test/ stanislav@10.0.0.50:~/projects/led-test/",
            "rsync -av ./led-test/ stanislav@10.0.0.50:/home/stanislav/projects/led-test/"
          ],
          output: "sending incremental file list\n./\nmain.py\nconfig.json\n\nsent 1,204 bytes  received 57 bytes  2,522.00 bytes/sec\ntotal size is 1,020  speedup is 0.81",
          hint: "Прапорці `a` і `v`; не забудь слеш у кінці джерела, щоб передати вміст, а не саму папку.",
          explain: "Передано лише `main.py` і `config.json` — решта вже була на Pi. Повтори команду без змін — і список файлів буде порожній." },
        { type: "check", title: "Вибери інструмент",
          question: "Ти щодня правиш проєкт на Mac і хочеш швидко оновлювати копію на Pi, не зачіпаючи лог-файли, які створює сам Pi. Що обрати?",
          options: ["`rsync -av --delete` щоразу", "`rsync -av` без `--delete`", "`scp -r` усієї папки щоразу"],
          correct: 1, feedback: "`rsync -av` передає лише змінене і нічого не видаляє на Pi. `--delete` стер би логи, а `scp -r` щоразу копіює все заново." },
        { type: "summary", title: "Підсумок",
          points: ["`scp` і `rsync` запускаються на Mac і працюють через SSH.", "`scp файл user@host:папка/` — разово; `scp -r` — для папки.", "`rsync -av ./src/ user@host:dst/` передає лише зміни; слеш у кінці джерела = «вміст папки».", "`--delete` видаляє файли на Pi — спершу `--dry-run`.", "`ssh-copy-id` прибирає введення пароля при кожному копіюванні."] }
      ],
      glossary: [
        { term: "scp", def: "Secure copy — копіювання файлів через SSH." },
        { term: "rsync", def: "Синхронізація папок: передає лише різницю між джерелом і призначенням." },
        { term: "--dry-run", def: "Пробний запуск rsync: показує, що буде зроблено, нічого не змінюючи." },
        { term: "ssh-copy-id", def: "Утиліта, що додає публічний SSH-ключ на віддалений комп'ютер для входу без пароля." }
      ],
      quiz: [
        { question: "Де запускати `scp main.py stanislav@raspberrypi.local:~/projects/`?", options: ["На Pi після входу по SSH", "Будь-де — результат однаковий", "На Mac, у папці, де лежить `main.py`"], correct: 2, feedback: "Джерело `main.py` — локальний файл, отже команда виконується там, де він лежить, тобто на Mac." },
        { question: "`scp led-test stanislav@raspberrypi.local:~/projects/` відповідає `not a regular file`. Чому?", options: ["Для папки потрібен прапорець `-r`", "Pi вимкнена", "Треба `sudo`"], correct: 0, feedback: "Без `-r` scp копіює лише окремі файли. `scp -r led-test …` передасть папку з усім вмістом." },
        { question: "Чому rsync вигідніший за scp для проєкту, який ти оновлюєш щодня?", options: ["rsync шифрує, а scp — ні", "rsync передає лише змінені файли", "rsync не потребує SSH"], correct: 1, feedback: "Обидва працюють через SSH і шифрують трафік. Перевага rsync — він звіряє файли й не гонить по мережі те, що вже є." },
        { question: "Що зробить `rsync -av --delete ./led-test/ stanislav@raspberrypi.local:~/projects/led-test/`, якщо на Pi є `app.log`, якого немає на Mac?", options: ["Скопіює `app.log` на Mac", "Залишить його без змін", "Видалить `app.log` на Pi"], correct: 2, feedback: "`--delete` робить призначення точною копією джерела, тому все зайве на Pi видаляється. Спершу перевір з `--dry-run`." },
        { question: "Як безпечно дізнатися, що саме видалить `rsync --delete`?", options: ["Додати `--dry-run` (або `-n`) і прочитати список", "Запустити й подивитися потім", "Додати `-v` двічі"], correct: 0, feedback: "Пробний запуск показує рядки `deleting …`, нічого не змінюючи. `-v` лише збільшує деталізацію справжнього запуску." },
        { question: "Навіщо `ssh-copy-id stanislav@raspberrypi.local`?", options: ["Щоб скопіювати всі файли з Pi на Mac", "Щоб додати SSH-ключ Mac на Pi і входити без пароля", "Щоб увімкнути SSH на Pi"], correct: 1, feedback: "Утиліта дописує твій публічний ключ у `~/.ssh/authorized_keys` на Pi. Сам SSH на Pi при цьому вже має бути увімкнений." }
      ]
    }
  ]
});
