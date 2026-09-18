window.CLI_COURSE_CONFIG = {
  id: "raspberry-pi",
  title: "Raspberry Pi 5 Terminal",
  subtitle: "Linux на Raspberry Pi 5 з Mac: SSH, файли, apt, мережа, Python і venv, GPIO, systemd, логи, Git і небезпечні команди.",
  overline: "Курс для новачків · bash · Raspberry Pi OS",
  brandSub: "курс терміналу Raspberry Pi",
  storageKey: "cli-raspberry-pi-v1",
  caseInsensitive: false,
  prompt: "stanislav@raspberrypi:~ $",
  termTitle: "bash на Raspberry Pi — навчальний термінал",
  sandbox: "trainer.html",
  quizBank: null,
  skills: [
    ["terminal", "Підключатися до Pi з Mac через `ssh` і завжди розуміти, де виконується команда — на Mac чи на Pi."],
    ["folder", "Ходити папками, створювати проєкт, редагувати файли в `nano` і видаляти без втрат."],
    ["apps", "Встановлювати програми через `apt`, а Python-бібліотеки — у `venv`."],
    ["monitor_heart", "Перевіряти здоров'я Pi: температуру, живлення (`vcgencmd get_throttled`), пам'ять, диск, мережу."],
    ["settings", "Запускати свій скрипт як сервіс systemd і читати його логи через `journalctl`."],
    ["shield", "Розпізнавати небезпечні команди (`rm -rf`, `dd`, `mkfs`, `curl | bash`) і знати безпечні альтернативи."]
  ],
  audience: "<p>Для власника Mac і Raspberry Pi 5, який хоче керувати Pi з Terminal: домашня автоматизація, Python-скрипти, GPIO, сервіси, Git. Досвід Linux не потрібен.</p><p>Головна мета — не вивчити всі команди, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.</p>",
  safety: "<p>Кроки «Спробуй сам» і пісочниця — імітація: вони нічого не змінюють ні на Mac, ні на Pi. На справжній Pi починай з команд, що лише читають (ризик «низький»), перед видаленням перевір <code>pwd</code> і <code>ls</code>, а до GPIO нічого не під'єднуй без схеми — логіка контактів 3,3 В.</p>",
  sources: [
    { href: "https://www.raspberrypi.com/documentation/computers/getting-started.html", label: "Raspberry Pi — Getting started (Raspberry Pi Imager)" },
    { href: "https://www.raspberrypi.com/documentation/computers/remote-access.html", label: "Raspberry Pi — Remote access (SSH, scp, rsync)" },
    { href: "https://www.raspberrypi.com/documentation/computers/os.html", label: "Raspberry Pi OS — apt, Python і venv, vcgencmd, GPIO" },
    { href: "https://gpiozero.readthedocs.io/", label: "gpiozero — документація" },
    { href: "https://www.freedesktop.org/software/systemd/man/latest/systemctl.html", label: "systemd — systemctl" },
    { href: "https://docs.python.org/3/library/venv.html", label: "Python — venv" }
  ]
};
