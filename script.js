import {
    fetchInitiatives,
    fetchNews,
    fetchCalendar,
    fetchLinks,
    fetchSettings
} from './db-service.js';

// ========== LOADING & INITIALIZATION ==========
window.addEventListener('load', async () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);

    await loadAllContent();
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== LOAD ALL CONTENT ==========
async function loadAllContent() {
    try {
        // Load settings (stats, principal, contact)
        const settings = await fetchSettings();

        // Load stats
        if (settings.stats) {
            document.getElementById('stat-students').setAttribute('data-target', settings.stats.students || 450);
            document.getElementById('stat-teachers').setAttribute('data-target', settings.stats.teachers || 35);
            document.getElementById('stat-classes').setAttribute('data-target', settings.stats.classes || 18);
            document.getElementById('stat-achievements').setAttribute('data-target', settings.stats.achievements || 25);
        }
        animateStats();

        // Load initiatives
        const initiatives = await fetchInitiatives();
        renderInitiatives(initiatives);

        // Load news
        const news = await fetchNews();
        renderNews(news);

        // Load links
        const links = await fetchLinks();
        renderLinks(links);

        // Load principal info
        if (settings.principal) {
            renderPrincipal(settings.principal);
        }

        // Load contact info
        if (settings.contact) {
            renderContact(settings.contact);
        }

        // Load calendar
        await loadCalendar();

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// ========== STATS ANIMATION ==========
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}

// ========== RENDER INITIATIVES ==========
function renderInitiatives(initiatives) {
    const grid = document.getElementById('initiatives-grid');
    grid.innerHTML = '';

    initiatives.forEach(init => {
        const features = (init.features || []).map(f =>
            `<li><i class="fas fa-check-circle"></i><span>${f}</span></li>`
        ).join('');

        const card = `
            <div class="initiative-card" style="border-color: ${init.color}">
                ${init.badge ? `<div class="initiative-badge"><i class="fas fa-star"></i> ${init.badge}</div>` : ''}
                <div class="initiative-header">
                    <div class="initiative-icon-wrapper">
                        <div class="initiative-icon" style="background: linear-gradient(135deg, ${init.color}, #333)">
                            <i class="fas ${init.icon}"></i>
                        </div>
                    </div>
                    <h3 class="initiative-title">${init.name}</h3>
                    <p class="initiative-subtitle">${init.subtitle}</p>
                </div>
                <div class="initiative-body">
                    <p class="initiative-description">${init.desc || ''}</p>
                    <ul class="initiative-features">${features}</ul>
                    <a href="${init.link}" target="_blank" class="initiative-link" style="background: linear-gradient(135deg, ${init.color}, #333)">
                        <span><i class="fas fa-rocket"></i> ${init.linkText || 'المزيد'}</span>
                    </a>
                </div>
            </div>
        `;

        grid.innerHTML += card;
    });

    // Animate on scroll
    const cards = grid.querySelectorAll('.initiative-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease-out';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// ========== RENDER NEWS ==========
function renderNews(newsArray) {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';

    newsArray.forEach(item => {
        const card = `
            <div class="news-card">
                <div class="news-icon">
                    <i class="fas ${item.icon}"></i>
                </div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-content">${item.content}</p>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// ========== RENDER LINKS ==========
function renderLinks(linksArray) {
    const grid = document.getElementById('links-grid');
    grid.innerHTML = '';

    linksArray.forEach(link => {
        const card = `
            <a href="${link.url}" target="_blank" class="link-card">
                <div class="link-icon">
                    <i class="fas ${link.icon}"></i>
                </div>
                <span class="link-text">${link.name}</span>
            </a>
        `;
        grid.innerHTML += card;
    });
}

// ========== RENDER PRINCIPAL ==========
function renderPrincipal(principal) {
    const container = document.getElementById('principal-card');
    const imageTag = principal.image ?
        `<img src="${principal.image}" alt="${principal.name}" class="principal-image">` : '';

    const message = principal.message ||
        'أهلاً بكم في موقع مدرستنا. نؤمن أن التعليم هو رحلة مشتركة بين البيت والمدرسة لبناء شخصية الطالب. نسعى لتقديم بيئة تعليمية محفزة، آمنة، وداعمة للإبداع والتميز. معاً نبني مستقبلاً مشرقاً لأبنائنا وبناتنا.';

    container.innerHTML = `
        ${imageTag}
        <p class="principal-message">${message}</p>
        <div class="principal-signature">${principal.name}, مدير المدرسة</div>
    `;
}

// ========== RENDER CONTACT ==========
function renderContact(contact) {
    const grid = document.getElementById('contact-grid');
    grid.innerHTML = `
        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-phone"></i>
            </div>
            <h3 class="contact-title">الهاتف</h3>
            <div class="contact-info">
                <a href="tel:${contact.phone}">${contact.phone}</a>
            </div>
        </div>

        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-fax"></i>
            </div>
            <h3 class="contact-title">الفاكس</h3>
            <div class="contact-info">${contact.fax}</div>
        </div>

        <div class="contact-card">
            <div class="contact-icon">
                <i class="fas fa-envelope"></i>
            </div>
            <h3 class="contact-title">البريد الإلكتروني</h3>
            <div class="contact-info">
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
    `;

    // Social Links
    const socialContainer = document.getElementById('social-links');
    socialContainer.innerHTML = `
        <a href="${contact.facebook || '#'}" target="_blank" class="social-link">
            <i class="fab fa-facebook-f"></i>
        </a>
        <a href="${contact.youtube || '#'}" target="_blank" class="social-link">
            <i class="fab fa-youtube"></i>
        </a>
        <a href="https://wa.me/${contact.whatsapp || ''}" target="_blank" class="social-link">
            <i class="fab fa-whatsapp"></i>
        </a>
    `;

    // WhatsApp Floating Button
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (contact.whatsapp) {
        whatsappBtn.href = `https://wa.me/${contact.whatsapp}?text=أريد%20الاستفسار%20عن...`;
    }
}

// ========== CALENDAR ==========
const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const monthsData = [
    { name: "أيلول 2025", days: 30, startDay: 1 },
    { name: "تشرين الأول 2025", days: 31, startDay: 3 },
    { name: "تشرين الثاني 2025", days: 30, startDay: 6 },
    { name: "كانون الأول 2025", days: 31, startDay: 1 },
    { name: "كانون الثاني 2026", days: 31, startDay: 4 },
    { name: "شباط 2026", days: 28, startDay: 0 },
    { name: "آذار 2026", days: 31, startDay: 0 },
    { name: "نيسان 2026", days: 30, startDay: 3 },
    { name: "أيار 2026", days: 31, startDay: 5 },
    { name: "حزيران 2026", days: 30, startDay: 1 }
];

let currentMonthIndex = 0;
let calendarEvents = [];

async function loadCalendar() {
    try {
        const events = await fetchCalendar();
        calendarEvents = events;

        // Find current month
        const today = new Date();
        const currentMonth = today.getMonth();
        const monthMap = {
            "كانون الثاني": 0, "شباط": 1, "آذار": 2, "نيسان": 3, "أيار": 4, "حزيران": 5,
            "تموز": 6, "آب": 7, "أيلول": 8, "تشرين الأول": 9, "تشرين الثاني": 10, "كانون الأول": 11
        };

        for (let i = 0; i < monthsData.length; i++) {
            const monthName = monthsData[i].name.split(" ")[0];
            if (monthMap[monthName] === currentMonth) {
                currentMonthIndex = i;
                break;
            }
        }

        createMonthSelector();
        showMonth(currentMonthIndex);

    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

function createMonthSelector() {
    const selector = document.getElementById('monthSelector');
    selector.innerHTML = '';

    monthsData.forEach((month, index) => {
        const btn = document.createElement('button');
        btn.className = 'month-btn';
        btn.textContent = month.name;
        btn.onclick = () => showMonth(index);
        selector.appendChild(btn);
    });
}

function showMonth(index) {
    currentMonthIndex = index;

    document.querySelectorAll('.month-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    const month = monthsData[index];

    document.getElementById('currentMonthTitle').textContent = month.name;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // Add day headers
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Add empty days before month starts
    for (let i = 0; i < month.startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        grid.appendChild(emptyDay);
    }

    // Add month days
    for (let day = 1; day <= month.days; day++) {
        const dayElement = document.createElement('div');
        const dayOfWeek = (month.startDay + day - 1) % 7;

        dayElement.className = `calendar-day ${dayOfWeek === 5 || dayOfWeek === 6 ? 'calendar-weekend' : ''}`;

        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        // Add events for this day
        const dayEvents = calendarEvents.filter(e => e.monthIndex === index && e.day === day);
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event event-type-${event.type}`;
            eventElement.textContent = event.text;
            eventElement.title = event.text;
            dayElement.appendChild(eventElement);
        });

        grid.appendChild(dayElement);
    }

    // Show month values if available
    updateMonthValues(index);
}

async function updateMonthValues(index) {
    // This would fetch from monthValues in settings
    // For now, we'll leave empty or use default
    const valuesSection = document.getElementById('valuesSection');
    valuesSection.innerHTML = '';
}

// ========== SCROLL EFFECTS ==========
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
