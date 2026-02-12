import {
    fetchInitiatives, saveInitiative, deleteInitiative,
    fetchNews, saveNews, deleteNews,
    fetchCalendar, saveCalendarEvent, deleteCalendarEvent,
    fetchLinks, saveLink, deleteLink,
    fetchSettings, saveSettings
} from './db-service.js';

let selC = "#ec4899";
let delCb = null;
const TT = {
    overview: "نظرة عامة",
    initiatives: "إدارة المبادرات",
    news: "إدارة الأخبار",
    calendar: "الرزنامة",
    links: "الروابط",
    "stats-edit": "الإحصائيات",
    principal: "كلمة المدير",
    contact: "التواصل",
    preview: "معاينة الموقع"
};

const monthsData = [
    { name: "أيلول 2025" },
    { name: "تشرين الأول 2025" },
    { name: "تشرين الثاني 2025" },
    { name: "كانون الأول 2025" },
    { name: "كانون الثاني 2026" },
    { name: "شباط 2026" },
    { name: "آذار 2026" },
    { name: "نيسان 2026" },
    { name: "أيار 2026" },
    { name: "حزيران 2026" }
];

// ========== NAVIGATION ==========
function nav(p) {
    document.querySelectorAll('.pg').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.ni').forEach(x => x.classList.remove('active'));
    document.getElementById('page-' + p).classList.add('active');
    let ni = document.querySelector('[data-page="' + p + '"]');
    if (ni) ni.classList.add('active');
    document.getElementById('pt').textContent = TT[p] || '';
    document.querySelector('.sb').classList.remove('open');
}

window.nav = nav;

document.querySelectorAll('.ni').forEach(i => i.addEventListener('click', () => nav(i.dataset.page)));

// ========== TOAST NOTIFICATIONS ==========
function tst(m, t = 'ok') {
    const c = document.getElementById('tc');
    const e = document.createElement('div');
    e.className = 'tst ' + t;
    e.innerHTML = '<i class="fas ' + (t === 'ok' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + m;
    c.appendChild(e);
    setTimeout(() => e.remove(), 3000);
}

window.tst = tst;

// ========== MODAL ==========
function openD(cb) {
    delCb = cb;
    document.getElementById('dm').classList.add('active');
}

function closeM() {
    document.getElementById('dm').classList.remove('active');
    delCb = null;
}

window.closeM = closeM;

document.getElementById('cdel').addEventListener('click', () => {
    if (delCb) delCb();
    closeM();
});

// ========== UTILITIES ==========
function esc(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

function tgF(id) {
    const f = document.getElementById(id);
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

window.tgF = tgF;

// Color Picker
document.getElementById('iC').addEventListener('click', e => {
    const t = e.target.closest('.cop');
    if (!t) return;
    document.querySelectorAll('#iC .cop').forEach(c => c.classList.remove('sel'));
    t.classList.add('sel');
    selC = t.dataset.c;
});

// ========== INIT CALENDAR SELECTOR ==========
function initCal() {
    const s = document.getElementById('cM');
    monthsData.forEach((m, i) => {
        s.innerHTML += '<option value="' + i + '">' + m.name + '</option>';
    });
}

// ========== INITIATIVES ==========
window.rI = async function () {
    try {
        const initiatives = await fetchInitiatives();
        const tbody = document.getElementById('iTb');
        tbody.innerHTML = initiatives.map((x, i) =>
            '<tr><td>' + (i + 1) + '</td><td><b>' + esc(x.name) + '</b></td><td>' + esc(x.subtitle) + '</td><td><div style="width:28px;height:28px;border-radius:8px;background:' + x.color + '"></div></td><td><div class="abs"><button class="ab" onclick="eI(\'' + x.id + '\')"><i class="fas fa-pen"></i></button><button class="ab del" onclick="dI(\'' + x.id + '\')"><i class="fas fa-trash"></i></button></div></td></tr>'
        ).join('');
        uO();
    } catch (error) {
        console.error('Error loading initiatives:', error);
        tst('خطأ في تحميل المبادرات', 'er');
    }
};

window.eI = async function (id) {
    try {
        const initiatives = await fetchInitiatives();
        const x = initiatives.find(i => i.id === id);
        if (!x) return;

        document.getElementById('iIdx').value = x.id;
        document.getElementById('iFt').textContent = 'تعديل';
        document.getElementById('iN').value = x.name;
        document.getElementById('iS').value = x.subtitle;
        document.getElementById('iI').value = x.icon;
        document.getElementById('iL').value = x.link;
        document.getElementById('iBd').value = x.badge || '';
        document.getElementById('iD').value = x.desc || '';
        document.getElementById('iFe').value = (x.features || []).join('\n');
        document.getElementById('iLT').value = x.linkText || '';
        selC = x.color;
        document.querySelectorAll('#iC .cop').forEach(c => c.classList.toggle('sel', c.dataset.c === x.color));
        document.getElementById('iF').style.display = 'block';
    } catch (error) {
        console.error('Error editing initiative:', error);
    }
};

window.sI = async function () {
    try {
        const id = document.getElementById('iIdx').value;
        const d = {
            name: document.getElementById('iN').value,
            subtitle: document.getElementById('iS').value,
            icon: document.getElementById('iI').value,
            color: selC,
            link: document.getElementById('iL').value,
            linkText: document.getElementById('iLT').value,
            badge: document.getElementById('iBd').value,
            desc: document.getElementById('iD').value,
            features: document.getElementById('iFe').value.split('\n').filter(f => f.trim())
        };

        if (!d.name) return tst('أدخل الاسم', 'er');

        await saveInitiative(d, id || null);
        await rI();
        tgF('iF');
        tst(id ? 'تم التعديل' : 'تمت الإضافة');

        // Reset form
        document.getElementById('iIdx').value = '';
        ['iN', 'iS', 'iI', 'iL', 'iBd', 'iD', 'iFe', 'iLT'].forEach(x => document.getElementById(x).value = '');
    } catch (error) {
        console.error('Error saving initiative:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

window.dI = function (id) {
    openD(async () => {
        try {
            await deleteInitiative(id);
            await rI();
            tst('تم الحذف');
        } catch (error) {
            console.error('Error deleting initiative:', error);
            tst('خطأ في الحذف', 'er');
        }
    });
};

// ========== NEWS ==========
window.rN = async function () {
    try {
        const news = await fetchNews();
        const tbody = document.getElementById('nTb');
        tbody.innerHTML = news.map((x, i) =>
            '<tr><td>' + (i + 1) + '</td><td><b>' + esc(x.title) + '</b></td><td><i class="fas ' + x.icon + '" style="color:var(--pl)"></i></td><td style="max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(x.content) + '</td><td><div class="abs"><button class="ab" onclick="eN(\'' + x.id + '\')"><i class="fas fa-pen"></i></button><button class="ab del" onclick="dN(\'' + x.id + '\')"><i class="fas fa-trash"></i></button></div></td></tr>'
        ).join('');
        uO();
    } catch (error) {
        console.error('Error loading news:', error);
        tst('خطأ في تحميل الأخبار', 'er');
    }
};

window.eN = async function (id) {
    try {
        const news = await fetchNews();
        const x = news.find(n => n.id === id);
        if (!x) return;

        document.getElementById('nIdx').value = x.id;
        document.getElementById('nFt').textContent = 'تعديل';
        document.getElementById('nT').value = x.title;
        document.getElementById('nI').value = x.icon;
        document.getElementById('nC').value = x.content;
        document.getElementById('nF').style.display = 'block';
    } catch (error) {
        console.error('Error editing news:', error);
    }
};

window.sN = async function () {
    try {
        const id = document.getElementById('nIdx').value;
        const d = {
            title: document.getElementById('nT').value,
            icon: document.getElementById('nI').value,
            content: document.getElementById('nC').value
        };

        if (!d.title) return tst('أدخل العنوان', 'er');

        await saveNews(d, id || null);
        await rN();
        tgF('nF');
        tst('تم الحفظ');

        document.getElementById('nIdx').value = '';
        ['nT', 'nI', 'nC'].forEach(x => document.getElementById(x).value = '');
    } catch (error) {
        console.error('Error saving news:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

window.dN = function (id) {
    openD(async () => {
        try {
            await deleteNews(id);
            await rN();
            tst('تم الحذف');
        } catch (error) {
            console.error('Error deleting news:', error);
            tst('خطأ في الحذف', 'er');
        }
    });
};

// ========== CALENDAR ==========
window.rC = async function () {
    try {
        const events = await fetchCalendar();
        const tl = { event: 'حدث', exam: 'امتحان', holiday: 'عطلة', special: 'مميز' };
        const bc = { event: 'be', exam: 'bx', holiday: 'bh', special: 'bsp' };

        const tbody = document.getElementById('cTb');
        tbody.innerHTML = events.map(e =>
            '<tr><td>' + monthsData[e.monthIndex].name + '</td><td>' + e.day + '</td><td>' + esc(e.text) + '</td><td><span class="badge ' + bc[e.type] + '">' + (tl[e.type] || e.type) + '</span></td><td><button class="ab del" onclick="dC(\'' + e.id + '\')"><i class="fas fa-trash"></i></button></td></tr>'
        ).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--tm);padding:2rem">لا توجد أحداث</td></tr>';

        uO();
    } catch (error) {
        console.error('Error loading calendar:', error);
        tst('خطأ في تحميل الرزنامة', 'er');
    }
};

window.sC = async function () {
    try {
        const mi = +document.getElementById('cM').value;
        const d = +document.getElementById('cD').value;
        const n = document.getElementById('cN').value;
        const t = document.getElementById('cT').value;

        if (!n || !d) return tst('أكمل الحقول', 'er');

        await saveCalendarEvent({ monthIndex: mi, day: d, text: n, type: t });
        await rC();
        tgF('cF');

        document.getElementById('cN').value = '';
        document.getElementById('cD').value = '';
        tst('تمت الإضافة');
    } catch (error) {
        console.error('Error saving calendar event:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

window.dC = function (id) {
    openD(async () => {
        try {
            await deleteCalendarEvent(id);
            await rC();
            tst('تم الحذف');
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            tst('خطأ في الحذف', 'er');
        }
    });
};

// ========== LINKS ==========
window.rL = async function () {
    try {
        const links = await fetchLinks();
        const tbody = document.getElementById('lTb');
        tbody.innerHTML = links.map((x, i) =>
            '<tr><td>' + (i + 1) + '</td><td><b>' + esc(x.name) + '</b></td><td><i class="fas ' + x.icon + '" style="color:var(--pl)"></i></td><td style="direction:ltr;text-align:left;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + esc(x.url) + '" target="_blank" style="color:var(--sc)">' + esc(x.url) + '</a></td><td><div class="abs"><button class="ab" onclick="eL(\'' + x.id + '\')"><i class="fas fa-pen"></i></button><button class="ab del" onclick="dL(\'' + x.id + '\')"><i class="fas fa-trash"></i></button></div></td></tr>'
        ).join('');
        uO();
    } catch (error) {
        console.error('Error loading links:', error);
        tst('خطأ في تحميل الروابط', 'er');
    }
};

window.eL = async function (id) {
    try {
        const links = await fetchLinks();
        const x = links.find(l => l.id === id);
        if (!x) return;

        document.getElementById('lIdx').value = x.id;
        document.getElementById('lFt').textContent = 'تعديل';
        document.getElementById('lN').value = x.name;
        document.getElementById('lI').value = x.icon;
        document.getElementById('lU').value = x.url;
        document.getElementById('lF').style.display = 'block';
    } catch (error) {
        console.error('Error editing link:', error);
    }
};

window.sL = async function () {
    try {
        const id = document.getElementById('lIdx').value;
        const d = {
            name: document.getElementById('lN').value,
            icon: document.getElementById('lI').value,
            url: document.getElementById('lU').value
        };

        if (!d.name || !d.url) return tst('أكمل الحقول', 'er');

        await saveLink(d, id || null);
        await rL();
        tgF('lF');
        tst('تم الحفظ');

        document.getElementById('lIdx').value = '';
        ['lN', 'lI', 'lU'].forEach(x => document.getElementById(x).value = '');
    } catch (error) {
        console.error('Error saving link:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

window.dL = function (id) {
    openD(async () => {
        try {
            await deleteLink(id);
            await rL();
            tst('تم الحذف');
        } catch (error) {
            console.error('Error deleting link:', error);
            tst('خطأ في الحذف', 'er');
        }
    });
};

// ========== SETTINGS ==========
window.sSt = async function () {
    try {
        const settings = await fetchSettings();
        settings.stats = {
            students: +document.getElementById('sS').value,
            teachers: +document.getElementById('sT').value,
            classes: +document.getElementById('sCl').value,
            achievements: +document.getElementById('sA').value
        };
        await saveSettings(settings);
        tst('تم الحفظ');
    } catch (error) {
        console.error('Error saving stats:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

window.sP = async function () {
    try {
        const settings = await fetchSettings();
        settings.principal = {
            name: document.getElementById('pN').value,
            image: document.getElementById('pI').value,
            message: document.getElementById('pM').value
        };
        await saveSettings(settings);
        tst('تم الحفظ');
    } catch (error) {
        console.error('Error saving principal:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

window.sCt = async function () {
    try {
        const settings = await fetchSettings();
        settings.contact = {
            phone: document.getElementById('ctP').value,
            fax: document.getElementById('ctF').value,
            email: document.getElementById('ctE').value,
            whatsapp: document.getElementById('ctW').value,
            facebook: document.getElementById('ctFB').value,
            youtube: document.getElementById('ctYT').value
        };
        await saveSettings(settings);
        tst('تم الحفظ');
    } catch (error) {
        console.error('Error saving contact:', error);
        tst('خطأ في الحفظ', 'er');
    }
};

// ========== OVERVIEW ==========
async function uO() {
    try {
        const [initiatives, news, calendar, links] = await Promise.all([
            fetchInitiatives(),
            fetchNews(),
            fetchCalendar(),
            fetchLinks()
        ]);

        document.getElementById('o1').textContent = initiatives.length;
        document.getElementById('o2').textContent = news.length;
        document.getElementById('o3').textContent = calendar.length;
        document.getElementById('o4').textContent = links.length;
        document.getElementById('inb').textContent = initiatives.length;
    } catch (error) {
        console.error('Error updating overview:', error);
    }
}

// ========== LOAD SETTINGS ==========
async function loadSettings() {
    try {
        const settings = await fetchSettings();

        if (settings.stats) {
            document.getElementById('sS').value = settings.stats.students || 450;
            document.getElementById('sT').value = settings.stats.teachers || 35;
            document.getElementById('sCl').value = settings.stats.classes || 18;
            document.getElementById('sA').value = settings.stats.achievements || 25;
        }

        if (settings.principal) {
            document.getElementById('pN').value = settings.principal.name || 'رامي ارفاعية';
            document.getElementById('pI').value = settings.principal.image || '';
            document.getElementById('pM').value = settings.principal.message || 'أهلاً بكم في موقع مدرستنا.';
        }

        if (settings.contact) {
            document.getElementById('ctP').value = settings.contact.phone || '04-6313931';
            document.getElementById('ctF').value = settings.contact.fax || '04-6110614';
            document.getElementById('ctE').value = settings.contact.email || 'Musherfeschool@gmail.com';
            document.getElementById('ctW').value = settings.contact.whatsapp || '972502299119';
            document.getElementById('ctFB').value = settings.contact.facebook || '';
            document.getElementById('ctYT').value = settings.contact.youtube || '';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// ========== INIT ==========
async function init() {
    initCal();
    await loadSettings();
    await Promise.all([rI(), rN(), rC(), rL()]);
    await uO();
}

init();
