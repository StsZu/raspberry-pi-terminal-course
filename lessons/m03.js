window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m03", order: 3, title: "Пакети apt", subtitle: "sudo, update, upgrade, install, пошук і видалення програм", icon: "apps",
  goal: "Після модуля ти розумієш різницю між update і upgrade, встановлюєш і видаляєш програми через apt і знаєш, коли справді потрібен sudo.",
  lessons: [
    {
      id: "m03-l01", title: "apt: оновити, встановити, прибрати", minutes: 13,
      steps: [
        { type: "story", title: "Потрібен git — де його взяти?",
          body: "<p>Ти хочеш клонувати проєкт з GitHub, а Pi відповідає <code>git: command not found</code>. На Mac ти б пішов у App Store чи Homebrew, а на Raspberry Pi OS програми ставлять через <code>apt</code>.</p><p>Поточна Raspberry Pi OS Trixie збудована на Debian 13 (попередній випуск, Bookworm, — на Debian 12), тож усе, що ти тут вивчиш, працює й на інших Debian-системах.</p>" },
        { type: "concept", title: "Репозиторій, список пакетів і sudo",
          body: "<p><strong>Репозиторій</strong> — сервер з тисячами перевірених пакетів. На Pi зберігається локальний <strong>список</strong> того, що там є і яких версій.</p><ul><li><code>apt update</code> — лише освіжає цей список, нічого не встановлює.</li><li><code>apt upgrade</code> — ставить новіші версії вже встановлених пакетів.</li><li><code>apt install</code> — додає нову програму разом із залежностями.</li></ul><p>Зміни в системі робить лише адміністратор, тому <code>sudo</code> — «виконай від імені root».</p>",
          analogy: "`apt update` — як узяти свіжий каталог магазину: ти дізнаєшся, що нового, але нічого не купив. `apt upgrade` — замінити вдома старі речі новішими моделями з каталогу. `apt install` — купити нову річ. А `sudo` — показати на касі документ власника квартири." },
        { type: "cli", title: "Оновлення системи",
          intro: "<p>Звичний порядок: спершу оновити список, потім пакети.</p>",
          commands: [
            { cmd: "sudo apt update", explain: "Завантажує свіжі списки пакетів з репозиторіїв. Нічого не встановлює. Перелік репозиторіїв у Trixie — файли <code>/etc/apt/sources.list.d/*.sources</code> (формат deb822); у Bookworm — ще <code>sources.list</code>.", output: "Hit:1 http://deb.debian.org/debian trixie InRelease\nHit:2 http://deb.debian.org/debian trixie-updates InRelease\nHit:3 http://deb.debian.org/debian-security trixie-security InRelease\nGet:4 http://archive.raspberrypi.com/debian trixie InRelease [55.0 kB]\nReading package lists... Done\n12 packages can be upgraded. Run 'apt list --upgradable' to see them.", risk: "low" },
            { cmd: "sudo apt upgrade", explain: "Показує список оновлень і питає <code>Y/n</code>. Встановлює новіші версії наявних пакетів, нічого не видаляючи.", risk: "medium" },
            { cmd: "sudo apt full-upgrade", explain: "Як <code>upgrade</code>, але дозволено видаляти й замінювати пакети, якщо цього вимагають залежності. Саме його рекомендує документація Raspberry Pi для регулярного оновлення — читай список перед <code>Y</code>.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: свіжий каталог",
          task: "Онови на Pi список доступних пакетів (нічого не встановлюючи).",
          expected: ["sudo apt update", "sudo apt-get update"],
          output: "Hit:1 http://deb.debian.org/debian trixie InRelease\nHit:2 http://deb.debian.org/debian trixie-updates InRelease\nHit:3 http://deb.debian.org/debian-security trixie-security InRelease\nGet:4 http://archive.raspberrypi.com/debian trixie InRelease [55.0 kB]\nReading package lists... Done\nBuilding dependency tree... Done\n12 packages can be upgraded. Run 'apt list --upgradable' to see them.",
          hint: "Потрібні права адміністратора, менеджер пакетів і дія «оновити список».",
          explain: "Після `update` apt знає про нові версії, але нічого ще не змінив. Встановлення — окремий крок: `upgrade` чи `install`." },
        { type: "check", title: "update чи upgrade",
          question: "Ти щойно виконав `sudo apt update` і побачив «12 packages can be upgraded». Що вже змінилось у системі?",
          options: ["Оновлено лише локальний список пакетів — програми ще старих версій", "Усі 12 пакетів уже оновлено", "Pi перезавантажиться, щоб застосувати оновлення"],
          correct: 0, feedback: "`update` лише освіжає каталог. Щоб поставити нові версії, потрібен `sudo apt upgrade` або `full-upgrade`." },
        { type: "cli", title: "Знайти, дізнатись, встановити",
          commands: [
            { cmd: "apt search gpio", explain: "Шукає пакети за словом у назві й описі. Лише читає — <code>sudo</code> не потрібен.", output: "gpiod/stable 2.2.1-2+deb13u1 arm64\n  Tools for interacting with Linux GPIO character device - binary\npython3-gpiozero/stable 2.0.1-0+rpt1+trixie all\n  Simple API for controlling devices attached to a Pi's GPIO pins", risk: "low" },
            { cmd: "apt show git", explain: "Опис, версія, розмір і залежності пакета перед встановленням.", risk: "low" },
            { cmd: "sudo apt install git", explain: "Встановлює пакет разом із залежностями. Якщо пакет уже є — повідомить про це.", output: "Setting up git (1:2.47.3-0+deb13u1) ...", risk: "medium" },
            { cmd: "apt list --installed", explain: "Список установленого. Разом із <code>| grep git</code> — швидка перевірка, чи є пакет.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: встанови git",
          task: "Встанови на Pi пакет `git`.",
          expected: ["sudo apt install git", "sudo apt-get install git", "sudo apt install -y git", "sudo apt install git -y"],
          output: "Installing:\n  git\n\nInstalling dependencies:\n  git-man  liberror-perl\n\nSummary:\n  Upgrading: 0, Installing: 3, Removing: 0, Not Upgrading: 12\n\nContinue? [Y/n] y\n...\nSetting up git (1:2.47.3-0+deb13u1) ...",
          hint: "Той самий менеджер пакетів з правами адміністратора, дія — «встановити», потім назва пакета.",
          explain: "apt сам підтягнув залежності (`git-man`, `liberror-perl`). Номер версії залежить від версії Raspberry Pi OS. Перевір: `git --version`." },
        { type: "cli", title: "Прибрати непотрібне",
          commands: [
            { cmd: "sudo apt remove htop", explain: "Видаляє програму, але лишає її системні конфіги.", risk: "medium" },
            { cmd: "sudo apt purge htop", explain: "Видаляє програму разом із конфігами. Уважно читай, що apt пропонує видалити разом із пакетом.", risk: "medium" },
            { cmd: "sudo apt autoremove", explain: "Прибирає залежності, які більше нікому не потрібні. Перед <code>Y</code> переглянь список.", risk: "medium" }
          ] },
        { type: "check", title: "Коли sudo зайвий",
          question: "Яку з цих команд можна виконати без `sudo`?",
          options: ["`apt install htop`", "`apt search htop`", "`apt remove htop`"],
          correct: 1, feedback: "`apt search` лише читає список пакетів. Встановлення й видалення змінюють систему — без `sudo` отримаєш `Permission denied`." },
        { type: "summary", title: "Підсумок",
          points: ["`sudo apt update` лише освіжає список пакетів — нічого не встановлює.", "`sudo apt upgrade` / `full-upgrade` ставлять новіші версії — читай список перед `Y`.", "`apt search` і `apt show` — пошук і опис без `sudo`; `sudo apt install` — встановлення.", "`remove` лишає конфіги, `purge` видаляє і їх; `autoremove` чистить непотрібні залежності.", "`sudo` дає повні права — вмикай його лише для змін системи."] }
      ],
      glossary: [
        { term: "apt", def: "Менеджер пакетів Debian і Raspberry Pi OS." },
        { term: "Пакет", def: "Програма чи бібліотека разом з інформацією про версію й залежності." },
        { term: "Репозиторій", def: "Сервер, з якого apt завантажує списки й файли пакетів." },
        { term: "Залежність", def: "Інший пакет, без якого програма не працює; apt ставить його автоматично." },
        { term: "sudo", def: "Виконати одну команду з правами адміністратора (root)." }
      ],
      quiz: [
        { question: "`sudo apt install gpiod` відповідає `Unable to locate package gpiod`. Що спробувати першим?", options: ["Перевстановити Raspberry Pi OS", "Встановити через `pip install gpiod`", "Виконати `sudo apt update` і повторити"], correct: 2, feedback: "Найчастіша причина — застарілий або порожній список пакетів. `update` його освіжить." },
        { question: "Чим `sudo apt full-upgrade` відрізняється від `sudo apt upgrade`?", options: ["Може видаляти або замінювати пакети, якщо того вимагають залежності", "Оновлює лише ядро", "Не потребує підтвердження"], correct: 0, feedback: "`full-upgrade` сміливіше розв'язує залежності, тому список змін треба читати. Підтвердження він так само питає." },
        { question: "Навіщо `sudo` перед `apt install`?", options: ["Щоб завантаження було швидшим", "Встановлення змінює системні папки, куди має доступ лише root", "Щоб apt шукав у більшій кількості репозиторіїв"], correct: 1, feedback: "Програми ставляться в `/usr`, конфіги — в `/etc`: писати туди може лише адміністратор." },
        { question: "Ти хочеш повністю прибрати програму разом з її налаштуваннями. Яка команда?", options: ["`sudo apt remove назва`", "`sudo apt update назва`", "`sudo apt purge назва`"], correct: 2, feedback: "`purge` = `remove` + видалення системних конфігів. `update` взагалі не приймає назву пакета." },
        { question: "Як швидко перевірити, чи встановлено `git`, не встановлюючи нічого?", options: ["`apt list --installed | grep git`", "`sudo apt install git`", "`sudo apt upgrade git`"], correct: 0, feedback: "Лише читання списку. Інші дві команди можуть змінити систему." },
        { question: "Інструкція з форуму радить `sudo apt autoremove`. Що зробити перед підтвердженням?", options: ["Нічого — команда завжди безпечна", "Прочитати список пакетів, які apt збирається видалити", "Додати `-y`, щоб не відволікатися"], correct: 1, feedback: "`autoremove` видаляє пакети. Зазвичай це справді сміття, але переглянути список — відповідальність того, хто натискає `Y`." }
      ]
    }
  ]
});
