const GOAL_PHRASE = "Головна мета — не вивчити всі команди Linux, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії на Raspberry Pi.";

const UK_HINTS = {
  "ping raspberrypi.local": "Перевіряє, чи Pi доступна в локальній мережі (mDNS).",
  "ping 10.0.0.50": "Пінг за IP — якщо .local не працює.",
  "ssh stanislav@raspberrypi.local": "SSH з Mac до Pi через hostname (mDNS).",
  "ssh stanislav@10.0.0.50": "SSH за IP-адресою Raspberry Pi.",
  "hostname": "Ім'я Pi в мережі (зазвичай raspberrypi).",
  "whoami": "Поточний користувач Linux на Pi.",
  "pwd": "Поточна директорія (print working directory).",
  "exit": "Вихід з SSH-сесії — повернення на Mac.",
  "echo $SHELL": "Шлях до shell — на Pi зазвичай /bin/bash.",
  "clear": "Очищує екран терміналу.",
  "history": "Історія команд поточної сесії.",
  "which python3": "Де знаходиться python3 у $PATH.",
  "command -v git": "Перевірка наявності git без запуску.",
  "echo $PATH": "Список папок пошуку програм.",
  "echo $PATH | tr ':' '\\n'": "PATH — по одному шляху на рядок.",
  "man ls": "Довідка (manual) для команди ls.",
  "apropos network": "Пошук команд за ключовим словом.",
  "ls": "Список файлів у поточній папці.",
  "ls -la": "Детальний список з прихованими файлами.",
  "cd ~/projects": "Перехід у папку projects у домашній директорії.",
  "cd ..": "На рівень вище в дереві каталогів.",
  "cd ~": "Додому — /home/stanislav.",
  "mkdir led-test": "Створює папку для проєкту.",
  "touch main.py": "Створює порожній Python-файл.",
  "nano main.py": "Редагує файл у текстовому редакторі nano.",
  "cat main.py": "Виводить вміст файлу на екран.",
  "less main.py": "Перегляд файлу з прокруткою (q — вихід).",
  "head -5 main.py": "Перші 5 рядків файлу.",
  "tail -5 main.py": "Останні 5 рядків.",
  "tail -f log.txt": "Стежить за новими рядками логу.",
  "cp file.txt backup.txt": "Копіює файл.",
  "mv old.txt new.txt": "Перейменовує або переміщує.",
  "rm file.txt": "Видаляє файл. Без кошика!",
  "rm -r folder": "Рекурсивно видаляє папку з вмістом.",
  "rm -rf folder": "⚠ ВИСОКИЙ РИЗИК: примусове видалення без підтвердження.",
  "rmdir empty": "Видаляє лише порожню папку.",
  "sudo apt update": "Оновлює список пакетів з репозиторіїв.",
  "sudo apt upgrade": "Встановлює оновлення встановлених пакетів.",
  "sudo apt install git": "Встановлює пакет git.",
  "sudo apt install python3-pip": "Встановлює pip для Python 3.",
  "apt search gpio": "Шукає пакети за ключовим словом.",
  "apt show git": "Детальна інформація про пакет.",
  "apt list --installed": "Список встановлених пакетів.",
  "hostname -I": "IP-адреси Pi (швидко).",
  "ip addr": "Мережеві інтерфейси та IP.",
  "ip route": "Таблиця маршрутизації, default gateway.",
  "ping 8.8.8.8": "Перевірка доступу до інтернету (DNS-free).",
  "ping google.com": "Перевірка DNS + інтернет.",
  "curl https://example.com": "HTTP-запит — перевірка з'єднання.",
  "ss -tulpn": "Відкриті порти, що слухають.",
  "rfkill list": "Статус Wi-Fi/Bluetooth (чи заблоковано).",
  "uname -a": "Версія ядра Linux та архітектура.",
  "cat /etc/os-release": "Дистрибутив (Raspberry Pi OS / Debian).",
  "uptime": "Час роботи системи та load average.",
  "vcgencmd measure_temp": "Температура CPU Pi — ключова діагностика!",
  "vcgencmd get_throttled": "Проблеми живлення/перегріву (throttling flags).",
  "free -h": "Використання RAM (людсько-читабельно).",
  "df -h": "Вільне місце на дисках.",
  "du -sh ~/projects": "Розмір папки projects.",
  "ps aux | grep python": "Процеси Python у системі.",
  "top": "Інтерактивний монітор процесів (q — вихід).",
  "python3 --version": "Версія Python 3 на Pi.",
  "python3 -m venv .venv": "Створює virtual environment.",
  "source .venv/bin/activate": "Активує venv (prompt зміниться).",
  "pip3 install requests": "Встановлює Python-пакет у venv.",
  "python3 main.py": "Запуск Python-скрипту.",
  "deactivate": "Вихід з virtual environment.",
  "pinout": "Схема GPIO-контактів Raspberry Pi.",
  "gpiodetect": "Список GPIO chips на платі.",
  "gpioinfo": "Детальна інформація про GPIO lines.",
  "ls /dev/gpiochip*": "Пристрої GPIO у /dev.",
  "systemctl status my-service": "Статус systemd service.",
  "sudo systemctl start my-service": "Запускає service.",
  "sudo systemctl enable my-service": "Автозапуск service при boot.",
  "journalctl -u my-service -f": "Логи service в реальному часі.",
  "journalctl -xe": "Останні системні помилки (розширено).",
  "dmesg | tail -50": "Останні повідомлення ядра.",
  "git status": "Стан Git-репозиторію.",
  "git clone https://github.com/user/project.git": "Клонує проєкт на Pi.",
  "git pull": "Підтягує зміни з GitHub.",
  "git log --oneline": "Компактна історія комітів.",
  "scp main.py stanislav@raspberrypi.local:/home/stanislav/projects/": "Копіює файл з Mac на Pi.",
  "rsync -av ./project/ stanislav@raspberrypi.local:/home/stanislav/projects/project/": "Синхронізація папки Mac→Pi.",
  "sudo reboot": "Перезавантаження Pi — завершить SSH-сесію!",
  "sudo shutdown -h now": "Безпечне вимкнення Pi.",
  "curl -fsSL URL | bash": "⚠ Завантажує і одразу виконує скрипт з інтернету!"
};

const MODULES = {
  ssh: {
    id: "ssh", title: "1. SSH і перший вхід",
    intro: "Підключення з Mac до Raspberry Pi 5 через SSH.",
    commands: [
      "ping raspberrypi.local", "ping 10.0.0.50",
      "ssh stanislav@raspberrypi.local", "ssh stanislav@10.0.0.50",
      "hostname", "whoami", "pwd", "exit"
    ]
  },
  basics: {
    id: "basics", title: "2. Terminal basics",
    intro: "Shell, PATH, довідка — основа Linux на Pi.",
    commands: [
      "echo $SHELL", "whoami", "hostname", "pwd", "clear", "history",
      "which python3", "command -v git", "echo $PATH",
      "echo $PATH | tr ':' '\\n'", "man ls", "apropos network"
    ]
  },
  files: {
    id: "files", title: "3. Файли та папки",
    intro: "Створення проєкту, nano, копіювання, видалення.",
    commands: [
      "ls", "ls -la", "cd ~/projects", "cd ..", "cd ~",
      "mkdir led-test", "touch main.py", "nano main.py", "cat main.py",
      "less main.py", "head -5 main.py", "tail -5 main.py", "tail -f log.txt",
      "cp file.txt backup.txt", "mv old.txt new.txt",
      "rm file.txt", "rm -r folder", "rm -rf folder", "rmdir empty"
    ]
  },
  packages: {
    id: "packages", title: "4. Пакети та оновлення",
    intro: "apt update/upgrade/install — управління пакетами Pi OS.",
    commands: [
      "sudo apt update", "sudo apt upgrade", "sudo apt install git",
      "sudo apt install python3-pip", "apt search gpio", "apt show git",
      "apt list --installed"
    ]
  },
  network: {
    id: "network", title: "5. Мережева діагностика",
    intro: "IP, gateway, ping, порти, Wi-Fi на Pi.",
    commands: [
      "hostname -I", "ip addr", "ip route",
      "ping 8.8.8.8", "ping google.com", "curl https://example.com",
      "ss -tulpn", "rfkill list"
    ]
  },
  system: {
    id: "system", title: "6. Стан системи",
    intro: "Температура, RAM, диск, процеси — здоров'я Pi 5.",
    commands: [
      "uname -a", "cat /etc/os-release", "uptime",
      "vcgencmd measure_temp", "vcgencmd get_throttled",
      "free -h", "df -h", "du -sh ~/projects",
      "ps aux | grep python", "top"
    ]
  },
  python: {
    id: "python", title: "7. Python на Pi",
    intro: "venv, pip, запуск скриптів на Raspberry Pi.",
    commands: [
      "python3 --version", "python3 -m venv .venv",
      "source .venv/bin/activate", "pip3 install requests",
      "python3 main.py", "deactivate"
    ]
  },
  gpio: {
    id: "gpio", title: "8. GPIO та залізо",
    intro: "pinout, gpiochip — обережно з 3.3V logic!",
    commands: [
      "pinout", "gpiodetect", "gpioinfo", "ls /dev/gpiochip*"
    ]
  },
  systemd: {
    id: "systemd", title: "9. systemd services",
    intro: "Автозапуск Python-скриптів через systemd.",
    commands: [
      "systemctl status my-service", "sudo systemctl start my-service",
      "sudo systemctl enable my-service", "journalctl -u my-service -f"
    ]
  },
  logs: {
    id: "logs", title: "10. Логи та діагностика",
    intro: "journalctl, dmesg — знаходимо помилки.",
    commands: [
      "journalctl -xe", "journalctl -u my-service -f", "dmesg | tail -50"
    ]
  },
  git: {
    id: "git", title: "11. Git workflow",
    intro: "Клонування та оновлення проєктів на Pi.",
    commands: [
      "git status", "git clone https://github.com/user/project.git",
      "git pull", "git log --oneline"
    ]
  },
  transfer: {
    id: "transfer", title: "12. Передача файлів Mac→Pi",
    intro: "scp і rsync з Mac Terminal на Raspberry Pi.",
    commands: [
      "scp main.py stanislav@raspberrypi.local:/home/stanislav/projects/",
      "rsync -av ./project/ stanislav@raspberrypi.local:/home/stanislav/projects/project/"
    ]
  },
  danger: {
    id: "danger", title: "13. Небезпечні команди",
    intro: "sudo, rm -rf, curl|bash, reboot, shutdown — розуміння ризику.",
    commands: [
      "rm -rf folder", "curl -fsSL URL | bash",
      "sudo reboot", "sudo shutdown -h now"
    ]
  },
  practice: {
    id: "practice", title: "14. Щоденна практика",
    intro: "Закріплення ключових команд 14-денного плану.",
    commands: [
      "ssh stanislav@10.0.0.50", "pwd", "ls -la", "sudo apt update",
      "vcgencmd measure_temp", "python3 main.py", "systemctl status my-service"
    ]
  }
};

const SIM = {
  user: "stanislav",
  host: "raspberrypi",
  shell: "/bin/bash",
  cwd: "/home/stanislav",
  home: "/home/stanislav",
  ip: "10.0.0.50",
  gateway: "10.0.0.1",
  temp: "45.2'C",
  files: { "main.py": "print('Hello Pi')\n", "log.txt": "[INFO] service started\n" },
  dirs: ["projects", "led-test"],
  venvActive: false,
  sshFromMac: true,
  serviceRunning: true
};

const state = {
  currentModule: "ssh",
  history: [], histIdx: -1,
  triedByModule: Object.fromEntries(Object.keys(MODULES).map(k => [k, new Set()])),
  selectedScenario: null,
  testMode: { active: false, queue: [], index: 0, correct: 0, wrong: 0 }
};

const SCENARIOS = Object.values(MODULES).map((m, i) => ({
  id: i + 1, moduleId: m.id, title: m.title, desc: m.intro, commands: m.commands.length
}));
state.selectedScenario = SCENARIOS[0];

const livePanel = document.getElementById("livePanel");
const outputStatus = document.getElementById("outputStatus");
const cmdInput = document.getElementById("cmdInput");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const cmdChecklist = document.getElementById("cmdChecklist");
const moduleBadge = document.getElementById("moduleBadge");
const moduleNav = document.getElementById("moduleNav");
const termTitle = document.getElementById("termTitle");
const promptLabel = document.getElementById("promptLabel");
let viewChunks = [];

function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function getModule() { return MODULES[state.currentModule]; }
function getCurrentCommands() { return getModule().commands; }
function getTried() { return state.triedByModule[state.currentModule]; }

function beginView(cmd) {
  viewChunks = [];
  if (cmd != null) viewChunks.push(`<div class="line-user">${esc(promptLabel.textContent)} ${esc(cmd)}</div>`);
}
function ukHint(text) { return `<div class="line-uk-hint">${esc(text)}</div>`; }
function printResult(title, body, type = "ok", hint = null) {
  const cls = type === "warn" ? "result-box warn" : type === "purple" ? "result-box purple" : type === "danger" ? "result-box danger" : "result-box";
  viewChunks.push(`<div class="${cls}"><div class="result-title">${esc(title)}</div>${body}${hint ? ukHint(hint) : ""}</div>`);
}
function flushView(status) {
  livePanel.innerHTML = viewChunks.join("");
  livePanel.scrollTop = livePanel.scrollHeight;
  if (status) outputStatus.textContent = status;
}

function shortCwd() {
  if (SIM.cwd === SIM.home) return "~";
  if (SIM.cwd.startsWith(SIM.home + "/")) return "~" + SIM.cwd.slice(SIM.home.length);
  return SIM.cwd;
}

function updatePrompt() {
  const venv = SIM.venvActive ? "(.venv) " : "";
  const short = shortCwd();
  const pathPart = short === "~" ? "~" : `~${short.slice(1)}`;
  promptLabel.textContent = `${venv}${SIM.user}@${SIM.host}:${pathPart}$`;
  termTitle.textContent = `${SIM.user}@${SIM.host} — bash — ${SIM.cwd}`;
}

function findListedCommand(cmd, commands) {
  if (commands.includes(cmd)) return cmd;
  return commands.find(x => {
    if (cmd === x) return true;
    const parts = x.split(" ");
    const base = parts[0];
    if (cmd === base) return true;
    if (cmd.startsWith(base + " ")) {
      const cmdParts = cmd.split(" ");
      const xParts = x.split(" ");
      if (x.includes("|")) return cmd.includes("|") && cmd.includes(x.split("|")[0].trim().split(" ").pop());
      return cmdParts.length >= Math.min(2, xParts.length);
    }
    return false;
  }) || null;
}

function isInCurrentModule(cmd) { return !!findListedCommand(cmd, getCurrentCommands()); }
function findModuleForCommand(cmd) {
  for (const mod of Object.values(MODULES)) {
    if (findListedCommand(cmd, mod.commands)) return mod.id;
  }
  return null;
}
function getHint(cmd, listed) {
  return UK_HINTS[listed] || UK_HINTS[cmd] || null;
}

function markTried(cmd) {
  const norm = findListedCommand(cmd, getCurrentCommands());
  if (norm) { getTried().add(norm); updateProgress(); updateModuleNav(); }
}

function updateProgress() {
  const cmds = getCurrentCommands();
  const n = getTried().size;
  moduleBadge.textContent = getModule().title;
  progressBar.style.width = cmds.length ? `${(n / cmds.length) * 100}%` : "0%";
  progressText.textContent = `${n} / ${cmds.length} команд`;
  cmdChecklist.querySelectorAll("li").forEach(li => {
    li.classList.toggle("done", getTried().has(li.dataset.cmd));
  });
  updatePrompt();
}

function updateModuleNav() {
  moduleNav.innerHTML = Object.values(MODULES).map(mod => {
    const t = state.triedByModule[mod.id];
    const pct = mod.commands.length ? Math.round((t.size / mod.commands.length) * 100) : 0;
    const act = mod.id === state.currentModule ? " active" : "";
    return `<button type="button" class="btn${act}" data-module="${mod.id}">${esc(mod.title)} · ${t.size}/${mod.commands.length}</button>`;
  }).join("");
  moduleNav.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => switchModule(btn.dataset.module));
  });
}

function buildChecklist() {
  cmdChecklist.innerHTML = getCurrentCommands().map(c =>
    `<li data-cmd="${esc(c)}" title="Клік — виконати"><code>${esc(c)}</code></li>`
  ).join("");
  cmdChecklist.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => { execute(li.dataset.cmd); cmdInput.value = ""; cmdInput.focus(); });
  });
  updateProgress();
  updateModuleNav();
}

function switchModule(id, showWelcome = true) {
  if (!MODULES[id]) return;
  state.currentModule = id;
  buildChecklist();
  if (!showWelcome) return;
  beginView(null);
  const m = getModule();
  printResult(`Розділ: ${m.title}`, `
    <span class="line-muted">${esc(m.intro)}</span><br>
    <span class="line-hl">Команд:</span> ${m.commands.length}
  `, "purple", GOAL_PHRASE);
  flushView(`$ · ${m.title}`);
}

function resetState() {
  SIM.cwd = SIM.home;
  SIM.venvActive = false;
  SIM.sshFromMac = true;
  SIM.serviceRunning = true;
  SIM.files = { "main.py": "print('Hello Pi')\n", "log.txt": "[INFO] service started\n" };
  SIM.dirs = ["projects", "led-test"];
  updatePrompt();
}

function welcome() {
  beginView(null);
  print(`<span class="line-muted">Raspberry Pi 5 Terminal Trainer — емуляція bash (без реального SSH)</span>`);
  printResult("Почни з SSH", `
    <span class="line-cmd">ping raspberrypi.local</span> · <span class="line-cmd">ssh stanislav@10.0.0.50</span><br>
    <span class="line-muted">14 розділів · GPIO · systemd · apt</span>
  `, "ok", GOAL_PHRASE);
  flushView("$ · Raspberry Pi 5 емулятор");
}

function handleCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  const listed = findListedCommand(cmd, getCurrentCommands()) || cmd;
  const hint = getHint(cmd, listed);
  const owner = findModuleForCommand(cmd);

  if (!isInCurrentModule(cmd) && owner && owner !== state.currentModule) {
    print(`<span class="line-warn">⚠ «${esc(cmd)}» — зазвичай у «${esc(MODULES[owner].title)}»</span>`);
  }

  // SSH / session
  if (lower.startsWith("ping ")) {
    const host = lower.includes("10.0.0.50") ? SIM.ip : "raspberrypi.local";
    printResult(cmd, `<span class="line-ok">PING ${esc(host)}: 3 packets, 0% loss, avg 1.2ms</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("ssh ")) {
    SIM.sshFromMac = false;
    printResult(cmd, `
      <span class="line-ok">Connected to ${esc(SIM.host)} (${esc(SIM.ip)})</span><br>
      <span class="line-muted">Linux raspberrypi 6.6.31-rpi-2712 aarch64</span>
    `, "ok", hint);
    return true;
  }
  if (lower === "exit") {
    SIM.sshFromMac = true;
    printResult("exit", `<span class="line-ok">Connection to ${esc(SIM.host)} closed.</span><br><span class="line-muted">→ Mac Terminal</span>`, "ok", hint);
    return true;
  }
  if (lower === "hostname") {
    printResult("hostname", `<span class="line-ok">${esc(SIM.host)}</span>`, "ok", hint);
    return true;
  }
  if (lower === "whoami") {
    printResult("whoami", `<span class="line-ok">${esc(SIM.user)}</span>`, "ok", hint);
    return true;
  }
  if (lower === "pwd") {
    printResult("pwd", `<span class="line-ok">${esc(SIM.cwd)}</span>`, "ok", hint);
    return true;
  }

  // Basics
  if (lower === "echo $shell") {
    printResult(cmd, `<span class="line-ok">${esc(SIM.shell)}</span>`, "ok", hint);
    return true;
  }
  if (lower === "clear") { welcome(); return true; }
  if (lower === "history") {
    const lines = state.history.length ? state.history.map((h,i) => `${i+1} ${esc(h)}`).join("<br>") : `<span class="line-muted">(empty)</span>`;
    printResult("history", lines, "ok", hint);
    return true;
  }
  if (lower.startsWith("which ") || lower.startsWith("command -v ")) {
    printResult(cmd, `<span class="line-ok">/usr/bin/${esc(cmd.split(" ").pop())}</span>`, "ok", hint);
    return true;
  }
  if (lower === "echo $path") {
    printResult(cmd, `<span class="line-ok">/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin</span>`, "ok", hint);
    return true;
  }
  if (lower.includes("echo $path") && lower.includes("tr")) {
    printResult(cmd, `<span class="line-ok">/usr/local/bin<br>/usr/bin<br>/bin<br>/sbin</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("man ") || lower.startsWith("apropos ")) {
    printResult(cmd, `<span class="line-muted">Manual page (emulated). Press q to quit.</span>`, "ok", hint);
    return true;
  }

  // Files
  if (lower === "ls" || lower === "ls -la") {
    const names = [...SIM.dirs, ...Object.keys(SIM.files)];
    const out = lower.includes("-la")
      ? names.map(n => `drwxr-xr-x 2 ${SIM.user} ${SIM.user} 4096 Jun 30 12:00 ${esc(n)}`).join("<br>")
      : names.join("  ");
    printResult(lower, `<span class="line-ok">${out}</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("cd ")) {
    const t = cmd.slice(3).trim();
    if (t === "~" || t === "") SIM.cwd = SIM.home;
    else if (t === "..") SIM.cwd = SIM.home;
    else if (t.startsWith("~/")) SIM.cwd = SIM.home + t.slice(1);
    else SIM.cwd = `${SIM.home}/${t}`;
    updatePrompt();
    printResult("cd", `<span class="line-ok">→ ${esc(SIM.cwd)}</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("mkdir ")) {
    const d = cmd.slice(6).trim();
    if (d && !SIM.dirs.includes(d)) SIM.dirs.push(d.split("/").pop());
    printResult(cmd, `<span class="line-ok">✓ mkdir ${esc(d)}</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("touch ")) {
    const f = cmd.slice(6).trim();
    SIM.files[f] = SIM.files[f] || "";
    printResult(cmd, `<span class="line-ok">✓ ${esc(f)}</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("nano ")) {
    printResult(cmd, `<span class="line-ok">[ nano editor — emulated ]<br>^O Save · ^X Exit</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("cat ") || lower.startsWith("less ") || lower.startsWith("head ") || lower.startsWith("tail ")) {
    const f = cmd.split(" ").filter(p => !p.startsWith("-")).pop();
    printResult(cmd, `<span class="line-ok">${esc(SIM.files[f] || "(file content)")}</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("cp ") || lower.startsWith("mv ")) {
    printResult(cmd, `<span class="line-ok">✓ Done</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("rm -rf ")) {
    printResult(cmd, `<span class="line-err">⚠ ЕМУЛЯЦІЯ: видалено без підтвердження. У реальному Linux — незворотно!</span>`, "danger", hint);
    return true;
  }
  if (lower.startsWith("rm ") || lower.startsWith("rmdir ")) {
    printResult(cmd, `<span class="line-ok">✓ Removed</span>`, lower.includes("-r") ? "warn" : "ok", hint);
    return true;
  }

  // apt
  if (lower.startsWith("sudo apt ") || lower.startsWith("apt ")) {
    const sub = lower.replace("sudo ", "");
    let out = "✓ Done";
    if (sub.includes("update")) out = "Hit:1 http://archive.raspberrypi.com/debian bookworm InRelease\nReading package lists... Done";
    else if (sub.includes("upgrade")) out = "0 upgraded, 0 newly installed, 0 to remove";
    else if (sub.includes("install")) out = `Setting up ${cmd.split(" ").pop()} ... done`;
    else if (sub.includes("search")) out = "python3-gpiozero/stable\npython3-rpi.gpio/stable";
    else if (sub.includes("show")) out = "Package: git\nVersion: 1:2.39.2-1.1";
    else if (sub.includes("list")) out = "git/stable,now 1:2.39.2 arm64 [installed]";
    printResult(cmd, `<span class="line-ok">${out}</span>`, sub.includes("install") || sub.includes("upgrade") ? "warn" : "ok", hint);
    return true;
  }

  // Network
  if (cmd.trim() === "hostname -I") {
    printResult(cmd, `<span class="line-ok">${esc(SIM.ip)}</span>`, "ok", hint);
    return true;
  }
  if (lower === "ip addr" || lower === "ip route") {
    const out = lower.includes("route")
      ? `default via ${SIM.gateway} dev wlan0`
      : `wlan0: inet ${SIM.ip}/24`;
    printResult(cmd, `<span class="line-ok">${esc(out)}</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("curl ")) {
    if (lower.includes("| bash")) {
      printResult(cmd, `<span class="line-err">⚠ Script executed without review!</span>`, "danger", hint);
      return true;
    }
    printResult(cmd, `<span class="line-ok">HTTP/2 200 OK</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("ss ") || lower === "rfkill list") {
    printResult(cmd, `<span class="line-ok">tcp LISTEN 0.0.0.0:22 (sshd)<br>Soft blocked: no (Wi-Fi)</span>`, "ok", hint);
    return true;
  }

  // System
  if (lower === "uname -a") {
    printResult(cmd, `<span class="line-ok">Linux raspberrypi 6.6.31-rpi-2712 aarch64 GNU/Linux</span>`, "ok", hint);
    return true;
  }
  if (lower === "cat /etc/os-release") {
    printResult(cmd, `<span class="line-ok">PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"<br>ID=debian</span>`, "ok", hint);
    return true;
  }
  if (lower === "uptime") {
    printResult(cmd, `<span class="line-ok">up 2 days, 3:15, load average: 0.12, 0.08, 0.05</span>`, "ok", hint);
    return true;
  }
  if (lower === "vcgencmd measure_temp") {
    printResult(cmd, `<span class="line-ok">temp=${esc(SIM.temp)}</span>`, "ok", hint);
    return true;
  }
  if (lower === "vcgencmd get_throttled") {
    printResult(cmd, `<span class="line-ok">throttled=0x0</span><br><span class="line-muted">0x0 = OK, no undervoltage or throttling</span>`, "ok", hint);
    return true;
  }
  if (lower === "free -h") {
    printResult(cmd, `<span class="line-ok">Mem: 7.9Gi total, 1.2Gi used, 6.5Gi available</span>`, "ok", hint);
    return true;
  }
  if (lower === "df -h") {
    printResult(cmd, `<span class="line-ok">/dev/mmcblk0p2  59G  12G  45G  22% /</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("du ")) {
    printResult(cmd, `<span class="line-ok">24M\t/home/stanislav/projects</span>`, "ok", hint);
    return true;
  }
  if (lower.includes("ps aux") || lower === "top") {
    printResult(cmd, `<span class="line-ok">stanislav 1234 python3 main.py<br>root 567 sshd</span>`, "ok", hint);
    return true;
  }

  // Python
  if (lower === "python3 --version") {
    printResult(cmd, `<span class="line-ok">Python 3.11.2</span>`, "ok", hint);
    return true;
  }
  if (lower === "python3 -m venv .venv") {
    printResult(cmd, `<span class="line-ok">✓ Created .venv</span>`, "ok", hint);
    return true;
  }
  if (lower === "source .venv/bin/activate") {
    SIM.venvActive = true;
    updatePrompt();
    printResult(cmd, `<span class="line-ok">✓ venv activated</span>`, "ok", hint);
    return true;
  }
  if (lower === "deactivate") {
    SIM.venvActive = false;
    updatePrompt();
    printResult(cmd, `<span class="line-ok">✓ venv deactivated</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("pip3 ") || lower === "python3 main.py") {
    const out = lower.includes("install") ? "Successfully installed requests-2.31.0" : "Hello Pi";
    printResult(cmd, `<span class="line-ok">${out}</span>`, "ok", hint);
    return true;
  }

  // GPIO
  if (lower === "pinout") {
    printResult(cmd, `<span class="line-ok">GPIO pinout diagram (Pi 5)<br>3.3V logic · do not connect 5V loads directly!</span>`, "warn", hint);
    return true;
  }
  if (lower === "gpiodetect") {
    printResult(cmd, `<span class="line-ok">gpiochip0 [pinctrl-rp1] (54 lines)<br>gpiochip10 [gpio-brcmstb@107d508500] (4 lines)</span>`, "ok", hint);
    return true;
  }
  if (lower === "gpioinfo" || lower.startsWith("ls /dev/gpiochip")) {
    printResult(cmd, `<span class="line-ok">/dev/gpiochip0<br>/dev/gpiochip10</span>`, "ok", hint);
    return true;
  }

  // systemd
  if (lower.includes("systemctl")) {
    const running = lower.includes("stop") ? false : lower.includes("start") || lower.includes("enable") ? true : SIM.serviceRunning;
    if (lower.includes("start")) SIM.serviceRunning = true;
    if (lower.includes("stop")) SIM.serviceRunning = false;
    const status = running ? "active (running)" : "inactive (dead)";
    printResult(cmd, `<span class="line-ok">my-service.service - ${status}</span>`, lower.includes("sudo") ? "warn" : "ok", hint);
    return true;
  }
  if (lower.includes("journalctl")) {
    printResult(cmd, `<span class="line-ok">Jun 30 12:00:01 raspberrypi python3[1234]: Hello Pi<br>-- Logs end --</span>`, "ok", hint);
    return true;
  }
  if (lower.startsWith("dmesg")) {
    printResult(cmd, `<span class="line-ok">[  123.45] wlan0: connected to AP</span>`, "ok", hint);
    return true;
  }

  // Git
  if (lower.startsWith("git ")) {
    let out = "✓";
    if (lower === "git status") out = "On branch main\nnothing to commit, working tree clean";
    else if (lower.includes("clone")) out = "Cloning into 'project'... done";
    else if (lower === "git pull") out = "Already up to date.";
    else if (lower === "git log --oneline") out = "a1b2c3d Initial commit";
    printResult(cmd, `<span class="line-ok">${esc(out)}</span>`, "ok", hint);
    return true;
  }

  // Transfer (from Mac)
  if (lower.startsWith("scp ") || lower.startsWith("rsync ")) {
    printResult(cmd, `<span class="line-ok">main.py 100% 256B 1.2MB/s<br>→ ${esc(SIM.home)}/projects/</span>`, "ok", hint);
    return true;
  }

  // Danger / power
  if (lower === "sudo reboot") {
    printResult(cmd, `<span class="line-warn">⚠ Pi перезавантажується — SSH-сесія обірветься!</span>`, "warn", hint);
    return true;
  }
  if (lower === "sudo shutdown -h now") {
    printResult(cmd, `<span class="line-warn">⚠ Pi вимикається. Увімкніть знову фізично.</span>`, "warn", hint);
    return true;
  }

  if (owner) {
    printResult("Інший розділ", `<span class="line-muted">«${esc(cmd)}» → ${esc(MODULES[owner].title)}</span>`, "warn");
  } else {
    printResult("Невідома команда", `<span class="line-muted">«${esc(cmd)}» — спробуй команду зліва або man/apropos</span>`, "warn");
  }
  return false;
}

function execute(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  if (state.testMode.active) { handleTestAnswer(cmd); return; }
  state.history.push(cmd);
  state.histIdx = state.history.length;
  beginView(cmd);
  const ok = handleCommand(cmd);
  flushView(`$ · ${getModule().title} · ${cmd}`);
  if (ok !== false) markTried(cmd);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTestQueue() {
  const seen = new Set(), items = [];
  for (const mod of Object.values(MODULES)) {
    for (const c of mod.commands) {
      if (!seen.has(c) && UK_HINTS[c]) { seen.add(c); items.push({ cmd: c, hint: UK_HINTS[c] }); }
    }
  }
  return shuffleArray(items);
}

function updateTestButton() {
  const btn = document.getElementById("btnTest");
  btn.textContent = state.testMode.active ? "Зупинити тест" : "Режим тестування";
  btn.classList.toggle("active", state.testMode.active);
}

function showTestQuestion() {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  if (!q) { finishTestMode(); return; }
  beginView(null);
  printResult(`Тест ${tm.index + 1}/${tm.queue.length}`, `
    <span class="line-muted">Яка команда: <em>${esc(q.hint)}</em>?</span><br>
    ✓ ${tm.correct} · ✗ ${tm.wrong}
  `, "purple");
  flushView(`Тест · ${tm.index + 1}/${tm.queue.length}`);
}

function startTestMode() {
  state.testMode = { active: true, queue: buildTestQueue(), index: 0, correct: 0, wrong: 0 };
  updateTestButton();
  showTestQuestion();
}

function stopTestMode() {
  state.testMode.active = false;
  updateTestButton();
  welcome();
}

function finishTestMode() {
  const tm = state.testMode;
  beginView(null);
  printResult("Тест завершено", `<span class="line-ok">✓ ${tm.correct}</span> · <span class="line-warn">✗ ${tm.wrong}</span>`, "ok");
  flushView("Тест завершено");
  state.testMode.active = false;
  updateTestButton();
}

function handleTestAnswer(cmd) {
  const tm = state.testMode;
  const q = tm.queue[tm.index];
  beginView(cmd);
  const match = findListedCommand(cmd, [q.cmd]) === q.cmd || cmd.trim() === q.cmd;
  if (match) { tm.correct++; printResult("✓", `<span class="line-ok">${esc(q.cmd)}</span>`, "ok", q.hint); }
  else { tm.wrong++; printResult("✗", `<span class="line-err">Очікувалось: ${esc(q.cmd)}</span>`, "warn", q.hint); }
  flushView(`Тест · ${tm.correct}✓`);
  tm.index++;
  setTimeout(() => { if (state.testMode.active) showTestQuestion(); }, 1100);
}

function openScenarioModal() {
  const list = document.getElementById("scenarioList");
  list.innerHTML = SCENARIOS.map(s => `
    <div class="scenario-item${s.moduleId === state.selectedScenario.moduleId ? " selected" : ""}" data-id="${s.id}">
      <strong>${esc(s.title)}</strong><small>${esc(s.desc)}</small>
    </div>`).join("");
  list.querySelectorAll(".scenario-item").forEach(el => {
    el.addEventListener("click", () => {
      list.querySelectorAll(".scenario-item").forEach(x => x.classList.remove("selected"));
      el.classList.add("selected");
      state.selectedScenario = SCENARIOS.find(s => s.id === +el.dataset.id);
    });
  });
  document.getElementById("scenarioModal").classList.add("open");
}

function closeScenarioModal() {
  document.getElementById("scenarioModal").classList.remove("open");
}

document.getElementById("cmdForm").addEventListener("submit", e => {
  e.preventDefault(); execute(cmdInput.value); cmdInput.value = "";
});
cmdInput.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (state.histIdx > 0) { state.histIdx--; cmdInput.value = state.history[state.histIdx] || ""; }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (state.histIdx < state.history.length - 1) { state.histIdx++; cmdInput.value = state.history[state.histIdx] || ""; }
    else { state.histIdx = state.history.length; cmdInput.value = ""; }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const val = cmdInput.value.trim();
    const match = getCurrentCommands().find(c => c.startsWith(val) && c !== val);
    if (match) cmdInput.value = match;
  }
});
document.getElementById("btnTest").addEventListener("click", () => state.testMode.active ? stopTestMode() : startTestMode());
document.getElementById("btnScenario").addEventListener("click", openScenarioModal);
document.getElementById("btnReset").addEventListener("click", () => { resetState(); welcome(); });
document.getElementById("scenarioConfirm").addEventListener("click", () => {
  if (state.selectedScenario) switchModule(state.selectedScenario.moduleId);
  closeScenarioModal();
});
document.getElementById("scenarioCancel").addEventListener("click", closeScenarioModal);
document.getElementById("scenarioModal").addEventListener("click", e => { if (e.target.id === "scenarioModal") closeScenarioModal(); });
document.addEventListener("keydown", e => {
  if (!document.getElementById("scenarioModal").classList.contains("open")) return;
  if (e.key === "Escape") closeScenarioModal();
  if (e.key === "Enter") { switchModule(state.selectedScenario.moduleId); closeScenarioModal(); }
});

buildChecklist();
updatePrompt();
welcome();