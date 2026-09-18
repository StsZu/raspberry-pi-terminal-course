window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m04", order: 4, title: "Мережа", subtitle: "IP, шлюз, ping, DNS, порти і Wi-Fi на Pi", icon: "network",
  goal: "Після модуля ти знаходиш IP Pi, перевіряєш шлюз, відрізняєш проблему DNS від проблеми маршруту і бачиш, які порти слухає Pi.",
  lessons: [
    {
      id: "m04-l01", title: "Діагностика мережі на Pi", minutes: 14,
      steps: [
        { type: "story", title: "«Немає інтернету»",
          body: "<p>Скрипт на Pi раптом не може достукатися до API, а <code>apt update</code> пише <code>Could not resolve</code>. Перезавантажити роутер навмання — не метод.</p><p>Пройдемо ланцюжок по порядку: чи є в Pi адреса → чи знає вона шлюз <code>10.0.0.254</code> → чи ходять пакети в інтернет → чи працює DNS → чи слухає потрібний порт.</p>" },
        { type: "concept", title: "Адреса, шлюз і DNS",
          body: "<p><strong>IP-адреса</strong> (<code>10.0.0.50</code>) — номер Pi в домашній мережі. <strong>Шлюз</strong> (<code>10.0.0.254</code>, роутер) — через нього йде все, що не в локальній мережі. <strong>DNS</strong> перетворює імена на кшталт <code>google.com</code> в IP-адреси.</p><p>Якщо <code>ping 8.8.8.8</code> працює, а <code>ping google.com</code> — ні, інтернет є, зламаний саме DNS.</p>",
          analogy: "IP — номер твоєї квартири, шлюз — під'їзд, через який виходиш на вулицю, а DNS — довідник, що каже, за якою адресою живе «google.com». Якщо за точною адресою (`8.8.8.8`) ти дійшов, а за назвою — ні, винен довідник, а не дорога." },
        { type: "cli", title: "Моя адреса і мій шлюз",
          commands: [
            { cmd: "hostname -I", explain: "Швидко показує IP-адреси Pi — саме те, що потрібно для <code>ssh</code> з Mac. Велика <code>I</code>!", output: "10.0.0.50", risk: "low" },
            { cmd: "ip addr", explain: "Усі інтерфейси: <code>eth0</code> (кабель), <code>wlan0</code> (Wi-Fi), їхній стан <code>UP/DOWN</code> і адреси.", output: "2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 state DOWN\n3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP\n    inet 10.0.0.50/24 brd 10.0.0.255 scope global dynamic wlan0", risk: "low" },
            { cmd: "ip route", explain: "Таблиця маршрутів. Рядок <code>default via</code> — це шлюз.", output: "default via 10.0.0.254 dev wlan0 proto dhcp metric 600\n10.0.0.0/24 dev wlan0 proto kernel scope link src 10.0.0.50", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: знайди шлюз",
          task: "Покажи таблицю маршрутизації Pi, щоб побачити, через яку адресу вона ходить в інтернет.",
          expected: ["ip route", "ip r", "ip route show", "ip r show"],
          output: "default via 10.0.0.254 dev wlan0 proto dhcp metric 600\n10.0.0.0/24 dev wlan0 proto kernel scope link src 10.0.0.50 metric 600",
          hint: "Утиліта `ip` і об'єкт «маршрут» англійською.",
          explain: "`default via 10.0.0.254` — усе, що не в `10.0.0.0/24`, йде через роутер. Немає рядка `default` — інтернету не буде, навіть якщо Wi-Fi підключено." },
        { type: "cli", title: "Чи ходять пакети і чи працює DNS",
          commands: [
            { cmd: "ping -c 3 8.8.8.8", explain: "Три пакети до сервера за IP — перевірка інтернету без участі DNS. Без <code>-c</code> ping працює безкінечно, зупинка — <span class=\"kbd\">Ctrl</span> + <span class=\"kbd\">C</span>.", output: "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms\n3 packets transmitted, 3 received, 0% packet loss", risk: "low" },
            { cmd: "ping -c 3 google.com", explain: "Те саме, але за іменем: спершу DNS, потім пакети.", risk: "low" },
            { cmd: "curl -I https://example.com", explain: "Лише заголовки HTTP-відповіді: <code>HTTP/2 200</code> — сайт доступний.", output: "HTTP/2 200\ncontent-type: text/html", risk: "low" }
          ] },
        { type: "check", title: "Де поломка",
          question: "`ping -c 3 8.8.8.8` — 0% втрат, а `ping -c 3 google.com` пише `Temporary failure in name resolution`. Що зламано?",
          options: ["Wi-Fi-адаптер Pi", "Шлюз за замовчуванням", "DNS — перетворення імен на адреси"],
          correct: 2, feedback: "Пакети за IP доходять, отже адаптер і шлюз працюють. Не працює лише пошук адреси за іменем — DNS." },
        { type: "cli", title: "Порти і Wi-Fi",
          commands: [
            { cmd: "sudo ss -tulpn", explain: "Порти, які слухає Pi, і процеси за ними. <code>:22</code> — SSH. Без <code>sudo</code> назви чужих процесів не видно.", output: "Netid State  Local Address:Port  Process\ntcp   LISTEN 0.0.0.0:22          users:((\"sshd\",pid=612,fd=3))\ntcp   LISTEN 0.0.0.0:8080        users:((\"python3\",pid=1234,fd=5))", risk: "low" },
            { cmd: "nmcli device status", explain: "Стан інтерфейсів через NetworkManager: підключено чи ні і до якої мережі.", output: "DEVICE  TYPE      STATE         CONNECTION\nwlan0   wifi      connected     HomeWiFi\neth0    ethernet  unavailable   --", risk: "low" },
            { cmd: "rfkill list", explain: "Чи не заблоковано Wi-Fi або Bluetooth. <code>Soft blocked: yes</code> — вимкнено програмно.", output: "0: hci0: Bluetooth\n\tSoft blocked: no\n\tHard blocked: no\n1: phy0: Wireless LAN\n\tSoft blocked: no\n\tHard blocked: no", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: хто слухає порти",
          task: "Подивись, які TCP- і UDP-порти слухає Pi і які процеси за ними стоять (з правами адміністратора, щоб бачити всі процеси).",
          expected: ["sudo ss -tulpn", "sudo ss -tlnp", "sudo ss -tulnp", "sudo ss -ltnup", "sudo ss -lntup"],
          output: "Netid State  Local Address:Port  Process\nudp   UNCONN 0.0.0.0:5353        users:((\"avahi-daemon\",pid=455,fd=12))\ntcp   LISTEN 0.0.0.0:22          users:((\"sshd\",pid=612,fd=3))\ntcp   LISTEN 0.0.0.0:8080        users:((\"python3\",pid=1234,fd=5))",
          hint: "Утиліта `ss` з прапорцями: tcp, udp, listening, processes, numeric.",
          explain: "`0.0.0.0:8080` — твій Python-сервіс приймає з'єднання з усієї мережі. Порт 5353 — `avahi`, завдяки якому працює `raspberrypi.local`." },
        { type: "check", title: "Wi-Fi зник",
          question: "Після експериментів Pi не бачить Wi-Fi, `ip addr` показує `wlan0` зі станом `DOWN`. Яку команду логічно перевірити наступною?",
          options: ["`rfkill list` — чи не заблоковано Wi-Fi", "`sudo apt upgrade`", "`ping -c 3 google.com`"],
          correct: 0, feedback: "Якщо інтерфейс лежить, ping нічого не дасть, а оновлення без мережі не завантажаться. `rfkill` покаже, чи Wi-Fi заблоковано." },
        { type: "summary", title: "Підсумок",
          points: ["`hostname -I` — швидко дізнатись IP Pi для SSH; `ip addr` — деталі інтерфейсів.", "`ip route` → `default via 10.0.0.254` — шлюз; без нього інтернету немає.", "`ping 8.8.8.8` працює, а `ping google.com` ні — проблема DNS.", "`sudo ss -tulpn` — хто слухає порти; `nmcli device status` і `rfkill list` — стан Wi-Fi.", "Усі ці команди лише читають — ризик низький."] }
      ],
      glossary: [
        { term: "IP-адреса", def: "Числова адреса пристрою в мережі, напр. `10.0.0.50`." },
        { term: "Шлюз (gateway)", def: "Роутер, через який пристрій виходить за межі локальної мережі; тут `10.0.0.254`." },
        { term: "DNS", def: "Служба, що перетворює імена (`google.com`) на IP-адреси." },
        { term: "Порт", def: "Номер «дверей» для служби на пристрої: 22 — SSH, 80/443 — веб." },
        { term: "wlan0 / eth0", def: "Типові назви Wi-Fi та дротового інтерфейсу на Pi." }
      ],
      quiz: [
        { question: "Тобі треба підключитися до Pi з Mac, а `raspberrypi.local` не знаходиться. Яка команда на Pi (з монітором) найшвидше дасть адресу?", options: ["`ip route`", "`hostname -I`", "`rfkill list`"], correct: 1, feedback: "`hostname -I` друкує саме IP-адреси Pi. `ip route` показує шлюз, а `rfkill` — блокування радіо." },
        { question: "У виводі `ip route` немає рядка `default via …`. Що це означає?", options: ["Pi не знає, куди відправляти пакети в інтернет", "DNS налаштований неправильно", "SSH-сервер вимкнений"], correct: 0, feedback: "Без маршруту за замовчуванням Pi бачить лише локальну мережу. DNS і SSH тут ні до чого." },
        { question: "Навіщо в `ping -c 3 8.8.8.8` прапорець `-c 3`?", options: ["Пришвидшує відповідь утричі", "Перевіряє три DNS-сервери", "Надсилає рівно три пакети й завершується"], correct: 2, feedback: "У Linux `ping` без `-c` працює, доки не натиснеш Ctrl+C. `-c 3` — рівно три спроби." },
        { question: "Твій Python-сервіс мав слухати порт 8080, але з Mac не відкривається. Яка команда на Pi перевірить, чи порт справді слухається?", options: ["`sudo ss -tulpn`", "`nmcli device status`", "`hostname -I`"], correct: 0, feedback: "`ss -tulpn` показує порти в стані LISTEN і процеси за ними. Інші команди — про адреси й інтерфейси." },
        { question: "`curl -I https://example.com` повертає `HTTP/2 200`. Що це доводить?", options: ["Pi отримала нову IP-адресу", "Мережа, DNS і доступ до вебсервера працюють", "Порт 22 відкритий"], correct: 1, feedback: "Щоб отримати відповідь 200, Pi мусила знайти адресу через DNS, пройти через шлюз і поговорити з сервером." },
        { question: "Який ризик у команд `ip addr`, `ip route`, `ss -tulpn`, `rfkill list`?", options: ["Високий — можуть обірвати SSH", "Середній — змінюють налаштування мережі", "Низький — лише показують стан"], correct: 2, feedback: "У такому вигляді всі вони лише читають. Ризик з'являється, коли додаєш дії: `ip link set … down`, `rfkill block …`." }
      ]
    }
  ]
});
