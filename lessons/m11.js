window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m11", order: 11, title: "Небезпечні команди", subtitle: "sudo, rm -rf, chmod, curl | bash, dd, mkfs, reboot", icon: "shield",
  goal: "Після модуля ти впізнаєш команди-«стоп-сигнали», перевіряєш ціль перед незворотною дією і знаєш безпечну альтернативу для кожної з них.",
  lessons: [
    {
      id: "m11-l01", title: "Стоп-сигнали: sudo, rm -rf, chmod, curl | bash", minutes: 13,
      steps: [
        { type: "story", title: "Одна команда — і вечір на відновлення",
          body: "<p>На Raspberry Pi зазвичай одна SD-карта, один користувач і одне вікно SSH. Якщо помилкова команда зламає систему, доведеться діставати картку й записувати образ заново — а дані проєкту можуть зникнути разом зі старою системою.</p><p>Небезпечних команд небагато. Їх легко впізнати, якщо знати «стоп-сигнали».</p>" },
        { type: "concept", title: "sudo — ключ від усього будинку",
          body: "<p>Звичайний користувач <code>stanislav</code> може псувати лише свої файли. З <code>sudo</code> команда виконується від імені <strong>root</strong> — і система вже не захищає тебе від помилки: можна стерти <code>/etc</code>, зламати мережу чи SSH.</p><p>Правило: <code>sudo</code> — лише для конкретних задач (apt, systemctl, файли в <code>/etc</code>) і лише коли розумієш, що робить решта команди.</p>",
          analogy: "`sudo` — як майстер-ключ від усіх дверей у під'їзді. Відкрити свою квартиру можна і звичайним ключем, а майстер-ключ береш, лише коли точно знаєш, які двері й навіщо відчиняєш." },
        { type: "cli", title: "Команди, на яких треба зупинитися",
          intro: "<p>Тут лише пояснення — у пісочниці ці команди нічого не видаляють.</p>",
          commands: [
            { cmd: "rm -rf ~/projects/old-test", explain: "Видаляє папку з усім вмістом без питань і без кошика. Зайвий пробіл (<code>rm -rf ~/ projects</code>) — і зникне вся домашня папка.", risk: "high" },
            { cmd: "chmod -R 777 /home/stanislav", explain: "Дає <strong>усім</strong> користувачам і сервісам право читати, змінювати й запускати всі файли в папці. SSH навіть відмовиться працювати з ключами, до яких мають доступ усі.", risk: "high" },
            { cmd: "sudo chown -R stanislav:stanislav /etc", explain: "Рекурсивно міняє власника системних файлів — після цього частина сервісів перестане запускатися.", risk: "high" },
            { cmd: "curl -fsSL https://example.com/install.sh | bash", explain: "Завантажує скрипт з інтернету й одразу виконує, не показавши його. Якщо сервер зламано чи адресу підмінено — чужий код отримує твої права.", risk: "high" }
          ] },
        { type: "callout", variant: "danger", title: "Що тут незворотне і як зробити безпечно",
          body: "<ul><li><code>rm -rf</code> не має кошика. Перед ним: <code>pwd</code>, <code>ls -la шлях</code>, прочитай команду вголос; або перейменуй папку в <code>old-test_old</code> і видали через тиждень.</li><li><code>chmod -R 777</code> відкриває все всім. Натомість: <code>chmod 644 файл</code> чи <code>chmod 755 скрипт</code> для конкретного файлу.</li><li><code>curl … | bash</code> виконує невідомий код. Натомість: завантаж у файл, прочитай у <code>less</code>, і лише потім запускай.</li></ul>" },
        { type: "check", title: "Прочитай команду",
          question: "Ти бачиш у старій нотатці `sudo rm -rf / home/stanislav/tmp`. Що з нею не так?",
          options: ["Нічого — `sudo` лише додає прав", "Вона видалить тільки папку `tmp`", "Пробіл після `/` робить першою ціллю корінь системи — це знищить Pi"],
          correct: 2, feedback: "Пробіл розділяє аргументи: `rm` отримує `/` і `home/stanislav/tmp` окремо. Корінь `/` з `-rf` під `sudo` — це вся система." },
        { type: "cli", title: "Безпечний шлях замість «| bash»",
          commands: [
            { cmd: "curl -fsSL https://example.com/install.sh -o install.sh", explain: "Лише завантажує скрипт у файл <code>install.sh</code>. Нічого не виконує.", risk: "medium" },
            { cmd: "less install.sh", explain: "Читаєш скрипт: що він завантажує, куди пише, чи викликає <code>sudo</code>. <code>q</code> — вихід.", risk: "low" },
            { cmd: "bash install.sh", explain: "Запускаєш лише після перегляду і лише з джерела, якому довіряєш.", risk: "medium" },
            { cmd: "sudo cp /etc/hosts /etc/hosts.bak", explain: "Резервна копія системного файлу перед правкою. Одна стрілка <code>&gt;</code> у <code>/etc</code> перезаписує файл цілком — з копією це можна відкотити.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: завантажити, а не виконати",
          task: "Інструкція радить `curl -fsSL https://example.com/install.sh | bash`. Натомість збережи скрипт у файл `install.sh`, нічого не запускаючи.",
          expected: [
            "curl -fsSL https://example.com/install.sh -o install.sh",
            "curl -fsSL -o install.sh https://example.com/install.sh",
            "curl -fsSL https://example.com/install.sh --output install.sh",
            "curl -fsSL --output install.sh https://example.com/install.sh",
            "curl -fsSLo install.sh https://example.com/install.sh"
          ],
          output: "",
          hint: "Прибери `| bash` і додай прапорець, що вказує файл для збереження.",
          explain: "`curl` мовчки зберіг файл — `-s` прибирає індикатор, а помилки `-S` все одно покаже. Далі: `less install.sh`." },
        { type: "check", title: "Перенаправлення в /etc",
          question: "Порада з форуму: `echo \"10.0.0.50 pi\" | sudo tee /etc/hosts`. Що станеться з файлом `/etc/hosts`?",
          options: ["Весь старий вміст буде замінено одним рядком", "Рядок буде дописано в кінець", "Нічого — без `>` файл не зміниться"],
          correct: 0, feedback: "`tee` без `-a` перезаписує файл, як `>`. Дописати можна `sudo tee -a`, а перед будь-якою правкою варто зробити копію `sudo cp /etc/hosts /etc/hosts.bak`." },
        { type: "cli", title: "Завершення процесів",
          commands: [
            { cmd: "ps aux | grep python", explain: "Знайди точний PID процесу, перш ніж щось завершувати.", output: "stanislav  1234  2.1  0.4  python3 main.py", risk: "low" },
            { cmd: "kill 1234", explain: "Ввічливо просить завершитися один процес за PID. Помилишся в номері — завершиш щось інше.", risk: "medium" },
            { cmd: "killall python3", explain: "Завершує <strong>усі</strong> процеси з цим іменем — разом із сервісами, про які ти забув.", risk: "high" }
          ] },
        { type: "check", title: "Скрипт завис",
          question: "Твій сервіс `my-service` на Python не відповідає. Як зупинити його найбезпечніше?",
          options: ["`killall python3`", "`sudo systemctl stop my-service`", "`sudo reboot`"],
          correct: 1, feedback: "`systemctl stop` зупиняє саме цей сервіс і не дасть systemd одразу підняти його знову. `killall` зачепить усі Python-процеси, а reboot обірве все, включно з SSH." },
        { type: "summary", title: "Підсумок",
          points: ["Стоп-сигнали: `sudo` + видалення, `rm -rf`, `chmod -R 777`, `curl … | bash`, `>` у `/etc`, `killall`.", "Перед незворотним: `pwd`, `ls -la`, прочитай команду вголос, зроби копію.", "Замість `| bash`: `curl -o файл` → `less файл` → лише потім `bash файл`.", "Зупиняй свій сервіс через `systemctl stop`, а процес — через `kill PID`, не `killall`."] }
      ],
      glossary: [
        { term: "root", def: "Адміністратор Linux, для якого немає обмежень доступу." },
        { term: "sudo", def: "Виконати одну команду з правами root; вимагає пароль і розуміння наслідків." },
        { term: "chmod 777", def: "Права «усім можна все» — майже завжди помилка." },
        { term: "curl | bash", def: "Завантажити скрипт і одразу виконати його, не читаючи." }
      ],
      quiz: [
        { question: "Коли `sudo` справді потрібен?", options: ["Для будь-якої команди — так надійніше", "Для `apt install`, `systemctl restart` чи редагування файлу в `/etc`", "Для `ls` у своїй домашній папці"], correct: 1, feedback: "`sudo` потрібен для змін системи. Для власних файлів він зайвий і лише прибирає захист від помилки." },
        { question: "Що зробити перед `rm -rf ~/projects/old-test`?", options: ["Нічого, `-f` сам перевіряє шлях", "Додати `sudo`, щоб точно спрацювало", "Перевірити `pwd` і `ls -la ~/projects/old-test`, прочитати команду вголос"], correct: 2, feedback: "`-f` навпаки вимикає всі запитання. Перевірка шляху — єдиний захист, бо кошика немає." },
        { question: "Чому `chmod -R 777 ~/.ssh` зашкодить?", options: ["Ключі стануть доступні всім, і SSH відмовиться їх використовувати", "SSH запрацює швидше", "Нічого не станеться — це лише права"], correct: 0, feedback: "OpenSSH перевіряє права на ключі й файли в `~/.ssh` і не приймає надто відкриті. До того ж ключ може прочитати будь-хто." },
        { question: "Яка послідовність замінює `curl -fsSL URL | bash`?", options: ["`sudo curl URL | bash`", "`curl -fsSL URL -o install.sh` → `less install.sh` → `bash install.sh`", "`wget URL | bash`"], correct: 1, feedback: "Головне — прочитати скрипт до запуску. `sudo` і `wget` не додають безпеки, а навпаки." },
        { question: "Ти хочеш дописати рядок у `/etc/hosts`. Що безпечніше?", options: ["`echo … | sudo tee /etc/hosts`", "`sudo rm /etc/hosts` і створити заново", "Спершу `sudo cp /etc/hosts /etc/hosts.bak`, потім `echo … | sudo tee -a /etc/hosts`"], correct: 2, feedback: "`-a` дописує, а не перезаписує; резервна копія дає змогу відкотити будь-яку помилку." },
        { question: "У чому ризик `killall python3` на Pi?", options: ["Він завершить усі Python-процеси, включно з сервісами", "Він видалить Python", "Жодного — він лише показує процеси"], correct: 0, feedback: "`killall` б'є за іменем по всіх процесах. Точніше — `kill PID` після `ps aux | grep` або `systemctl stop` для сервісу." }
      ]
    },
    {
      id: "m11-l02", title: "Диски, образи і живлення", minutes: 13,
      steps: [
        { type: "story", title: "Нова SD-карта для Pi",
          body: "<p>Ти купив нову SD-карту чи SSD і хочеш записати на неї Raspberry Pi OS. В інтернеті радять <code>dd</code>, у форумах — <code>mkfs</code> і <code>fdisk</code>. Ці команди не питають «ти впевнений?» і за секунду стирають не той диск.</p><p>Цей урок — як знайти правильний пристрій, чим записувати образ і як безпечно вимикати Pi.</p>" },
        { type: "concept", title: "Диск — це файл у /dev",
          body: "<p>У Linux кожен диск — пристрій у <code>/dev</code>: SD-карта Pi — <code>/dev/mmcblk0</code>, USB-флешка чи USB-SSD — <code>/dev/sda</code>, NVMe-диск — <code>/dev/nvme0n1</code>. Розділи мають суфікси: <code>mmcblk0p2</code>, <code>sda1</code>.</p><p>На працюючій Pi <code>/dev/mmcblk0</code> (або NVMe, якщо система на ньому) — це диск, з якого вона зараз працює. Його не можна переписувати чи форматувати.</p>",
          analogy: "`dd` — як асфальтовий коток: котить туди, куди скерував, і не питає, чи там клумба. Помилка в одній літері (`of=/dev/mmcblk0` замість `of=/dev/sda`) — і закатано не флешку, а систему." },
        { type: "cli", title: "Спершу — подивитися диски",
          commands: [
            { cmd: "lsblk", explain: "Дерево дисків і розділів з розміром і точкою монтування. Нічого не змінює — завжди перша команда перед роботою з дисками.", risk: "low" },
            { cmd: "df -h", explain: "Які розділи змонтовані й скільки на них місця. Рядок з <code>/</code> — диск, з якого працює система.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: знайди флешку",
          task: "Ти вставив у Pi USB-флешку на 32 ГБ. Покажи всі диски й розділи, щоб зрозуміти, як вона називається.",
          expected: ["lsblk"],
          output: "NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda           8:0    1 29.7G  0 disk\n└─sda1        8:1    1 29.7G  0 part /media/stanislav/USB\nmmcblk0     179:0    0 59.5G  0 disk\n├─mmcblk0p1 179:1    0  512M  0 part /boot/firmware\n└─mmcblk0p2 179:2    0   59G  0 part /",
          hint: "Команда з п'яти літер: list block devices.",
          explain: "Флешка — `sda` (≈30 ГБ, знімна: `RM 1`). `mmcblk0` змонтована в `/` — це системна SD-карта, її не чіпаємо." },
        { type: "check", title: "Який пристрій не можна чіпати",
          question: "За виводом `lsblk` вище: який пристрій заборонено переписувати на працюючій Pi?",
          options: ["`mmcblk0` — на ньому змонтовано `/`", "`sda` — бо він знімний", "Жоден — Linux сам захистить систему"],
          correct: 0, feedback: "Точка монтування `/` означає, що з цього диска зараз працює система. `dd` чи `mkfs` на ньому зламають Pi, і Linux не зупинить команду від root." },
        { type: "callout", variant: "danger", title: "dd, mkfs і fdisk стирають диск повністю",
          body: "<p><code>dd of=/dev/…</code> переписує пристрій байт за байтом, <code>mkfs</code> створює нову файлову систему, <code>fdisk</code> змінює таблицю розділів. Усе, що було на цьому диску, втрачено, і скасувати це неможливо.</p><p>Безпечна альтернатива: рекомендований Raspberry Pi спосіб запису образу — програма <strong>Raspberry Pi Imager</strong> на Mac. Вона показує лише знімні носії, сама перевіряє запис і одразу дає увімкнути SSH, задати користувача й Wi-Fi.</p>" },
        { type: "cli", title: "Що роблять руйнівні команди (лише для розуміння)",
          commands: [
            { cmd: "sudo dd if=raspios.img of=/dev/sda bs=4M status=progress conv=fsync", explain: "Записує образ на <em>весь</em> пристрій <code>/dev/sda</code>. <code>if=</code> — звідки, <code>of=</code> — куди. Переплутаєш <code>of=</code> — зітреш інший диск.", risk: "high" },
            { cmd: "sudo mkfs.ext4 /dev/sda1", explain: "Форматує розділ у ext4. Усі файли на ньому зникають.", risk: "high" },
            { cmd: "sudo fdisk /dev/sda", explain: "Інтерактивний редактор розділів. Зміни записуються командою <code>w</code> — після неї розділи змінено.", risk: "high" }
          ] },
        { type: "check", title: "Чим записати образ",
          question: "Тобі треба підготувати нову SD-карту з Raspberry Pi OS. Що обрати новачку?",
          options: ["`sudo dd` з Mac на перший-ліпший `/dev/disk`", "`sudo mkfs.ext4` на картці, а потім скопіювати файли", "Raspberry Pi Imager — він показує лише знімні носії й перевіряє запис"],
          correct: 2, feedback: "Imager захищає від вибору системного диска і сам налаштовує SSH та користувача. `dd` і `mkfs` не мають жодного захисту від помилки в назві пристрою." },
        { type: "cli", title: "Перезавантаження і вимкнення",
          intro: "<p>Ці команди не видаляють даних, але одразу обривають SSH. Після <code>shutdown -h</code> Pi вмикається лише фізично — кнопкою живлення (є на Pi 5) або перепідключенням кабелю.</p>",
          commands: [
            { cmd: "sudo reboot", explain: "Негайне перезавантаження. Незбережені файли й запущений <code>apt upgrade</code> будуть перервані.", risk: "high" },
            { cmd: "sudo shutdown -h now", explain: "Негайне вимкнення. Якщо Pi стоїть в іншій кімнаті чи місті — дистанційно її вже не ввімкнеш.", risk: "high" },
            { cmd: "sudo shutdown -r +5", explain: "Перезавантаження через 5 хвилин: інші користувачі SSH отримають попередження, а ти встигнеш передумати.", output: "Reboot scheduled for Fri 2026-09-18 10:05:00 EEST, use 'shutdown -c' to cancel.", risk: "medium" },
            { cmd: "sudo shutdown -c", explain: "Скасовує заплановане вимкнення чи перезавантаження.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: відкладене перезавантаження",
          task: "Після оновлення треба перезавантажити Pi, але так, щоб лишилося 5 хвилин на скасування. Заплануй перезавантаження через 5 хвилин.",
          expected: ["sudo shutdown -r +5", "sudo shutdown --reboot +5"],
          output: "Reboot scheduled for Fri 2026-09-18 10:05:00 EEST, use 'shutdown -c' to cancel.",
          hint: "Та сама команда, що й для вимкнення, але з прапорцем перезавантаження і часом зі знаком `+`.",
          explain: "Pi перезавантажиться за 5 хвилин. Передумав — `sudo shutdown -c`." },
        { type: "check", title: "Pi на дачі",
          question: "Pi працює на дачі, ти підключений по SSH з дому. Яка команда найризиковіша?",
          options: ["`sudo reboot`", "`sudo shutdown -h now`", "`sudo shutdown -r +5`"],
          correct: 1, feedback: "Після `shutdown -h` Pi сама не ввімкнеться — треба фізично натиснути кнопку чи перепідключити живлення. Reboot хоча б повернеться в мережу (якщо все гаразд із системою)." },
        { type: "summary", title: "Підсумок",
          points: ["Перед будь-якою роботою з дисками — `lsblk`: знайди пристрій за розміром і точкою монтування.", "Диск, змонтований у `/`, на працюючій Pi не чіпай.", "`dd`, `mkfs`, `fdisk` стирають дані безповоротно; для образу ОС — Raspberry Pi Imager.", "`reboot` і `shutdown -h now` обривають SSH; м'якше — `shutdown -r +5` і `shutdown -c` для скасування."] }
      ],
      glossary: [
        { term: "Блочний пристрій", def: "Диск чи розділ у `/dev`: `/dev/mmcblk0`, `/dev/sda1`." },
        { term: "lsblk", def: "Показує диски й розділи деревом з розмірами й точками монтування." },
        { term: "Raspberry Pi Imager", def: "Програма для запису образу Raspberry Pi OS на SD-карту чи SSD з попереднім налаштуванням." },
        { term: "Точка монтування", def: "Папка, через яку видно вміст розділу; `/` — корінь системи." }
      ],
      quiz: [
        { question: "Яку команду виконати першою, перш ніж форматувати USB-диск на Pi?", options: ["`sudo mkfs.ext4 /dev/sda1` — одразу зрозуміло, чи спрацює", "`sudo fdisk /dev/mmcblk0`", "`lsblk` — щоб переконатися, який пристрій — це саме USB-диск"], correct: 2, feedback: "`lsblk` лише показує. Назву пристрою треба підтвердити за розміром і точкою монтування, бо помилку потім не виправиш." },
        { question: "Що означає `of=` у команді `dd`?", options: ["Пристрій або файл, КУДИ буде записано — і все на ньому зникне", "Файл, ЗВІДКИ читаються дані", "Розмір блоку"], correct: 0, feedback: "`if=` — вхід, `of=` — вихід. Помилка саме в `of=` знищує не той диск." },
        { question: "Чому Raspberry Pi Imager безпечніший за `dd` для запису образу?", options: ["Він записує швидше", "Він показує лише знімні носії й перевіряє запис", "Він не потребує SD-карти"], correct: 1, feedback: "Imager не дасть обрати системний диск Mac і після запису звіряє дані. `dd` запише куди скажеш, без запитань." },
        { question: "Ти ввів `sudo shutdown -r +5`, але згадав про незбережений файл. Що зробити?", options: ["Швидко вимкнути живлення", "Нічого — скасувати неможливо", "`sudo shutdown -c` — скасувати заплановане перезавантаження"], correct: 2, feedback: "Відкладене вимкнення чи перезавантаження скасовується `shutdown -c`. Висмикувати живлення — ризик пошкодити файлову систему." },
        { question: "Чому `sudo reboot` під час `sudo apt upgrade` в іншому вікні — погана ідея?", options: ["Оновлення перерветься на півдорозі, і пакети можуть лишитися в зламаному стані", "Reboot чекатиме, доки apt завершиться", "Нічого не станеться"], correct: 0, feedback: "Reboot не чекає на apt. Перерване оновлення доведеться лагодити `sudo dpkg --configure -a`, а в гіршому разі — система не завантажиться." },
        { question: "Що з цього НЕ стирає дані на диску?", options: ["`sudo mkfs.ext4 /dev/sda1`", "`lsblk`", "`sudo dd if=raspios.img of=/dev/sda`"], correct: 1, feedback: "`lsblk` лише показує список дисків. `mkfs` форматує розділ, а `dd` переписує весь пристрій." }
      ]
    }
  ]
});
