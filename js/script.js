// Language switcher
let currentLang = 'it';

function switchLang(lang) {
    currentLang = lang;

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-it][data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text.includes('<')) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    });

    // Update placeholder inputs
    document.querySelectorAll('[data-it-placeholder][data-en-placeholder]').forEach(el => {
        el.placeholder = el.getAttribute('data-' + lang + '-placeholder');
    });

    // Update booking step labels that are set dynamically
    const labelT = document.getElementById('step-trucco-label');
    const labelN = document.getElementById('step-nome-label');
    const labelC = document.getElementById('step-capelli-label');
    const { servizio } = booking;
    if (servizio && labelT && labelN) {
        if (lang === 'it') {
            if (servizio === 'capelli') { labelN.textContent = '2. Il tuo nome e cognome'; }
            else if (servizio === 'trucco') { labelT.textContent = '2. Che stile di trucco?'; labelN.textContent = '3. Il tuo nome e cognome'; }
            else { if(labelC) labelC.textContent = '2. Che stile di capelli?'; labelT.textContent = '3. Che stile di trucco?'; labelN.textContent = '4. Il tuo nome e cognome'; }
        } else {
            if (servizio === 'capelli') { labelN.textContent = '2. Your full name'; }
            else if (servizio === 'trucco') { labelT.textContent = '2. Make-Up style?'; labelN.textContent = '3. Your full name'; }
            else { if(labelC) labelC.textContent = '2. Hair style?'; labelT.textContent = '3. Make-Up style?'; labelN.textContent = '4. Your full name'; }
        }
    }

    // Update html lang attribute
    document.documentElement.lang = lang;
}

// Navbar scroll effect
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
});

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) {
            el.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Chiudi menu mobile al click
        document.getElementById('nav-links').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
    });
});

// === BOOKING WIZARD ===
const WA_NUMBER = '39XXXXXXXXXX'; // <-- inserisci il numero WhatsApp senza + (es. 393331234567)

const STYLE_IMAGES = {
    'Onde Morbide':     'images/Onde morbide.jpg',
    'Liscio Seta':      'images/liscio seta.jpg',
    'Ricci Definiti':   'images/Ricci Definiti.jpg',
    'Chignon Elegante': 'images/Chignon Elegante.jpg',
    'Beach Waves':      'images/Beach Waves.jpg',
    'Coda Riccia':      'images/Coda Bassa Riccia.jpg',
    'Natural Make-Up':  'images/natural.jpg',
    'Smokey Make-Up':   'images/Smokey eyes.png',
    'Halo Make-Up':     'images/Halo.png',
    'Latin Make-Up':    'images/Latin.png',
};

const booking = {
    servizio: null,
    capelli: null,
    trucco: null,
};

function selectService(val) {
    booking.servizio = val;
    booking.capelli = null;
    booking.trucco = null;

    // reset scelte stile
    document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('selected'));

    // highlight bottone servizio
    document.querySelectorAll('[data-value]').forEach(b => {
        if (b.dataset.value === val && !b.dataset.type) b.classList.add('selected');
        else if (!b.dataset.type) b.classList.remove('selected');
    });

    const stepC = document.getElementById('step-capelli');
    const stepT = document.getElementById('step-trucco');
    const stepN = document.getElementById('step-nome');
    const stepP = document.getElementById('booking-preview');
    const labelT = document.getElementById('step-trucco-label');
    const labelN = document.getElementById('step-nome-label');

    stepC.classList.add('hidden');
    stepT.classList.add('hidden');
    stepN.classList.add('hidden');
    stepP.classList.add('hidden');

    const lang = currentLang;
    if (val === 'capelli') {
        stepC.classList.remove('hidden');
        labelN.textContent = lang === 'en' ? '2. Your full name' : '2. Il tuo nome e cognome';
        stepN.classList.remove('hidden');
    } else if (val === 'trucco') {
        labelT.textContent = lang === 'en' ? '2. Make-Up style?' : '2. Che stile di trucco?';
        labelN.textContent = lang === 'en' ? '3. Your full name' : '3. Il tuo nome e cognome';
        stepT.classList.remove('hidden');
        stepN.classList.remove('hidden');
    } else {
        stepC.classList.remove('hidden');
        labelT.textContent = lang === 'en' ? '3. Make-Up style?' : '3. Che stile di trucco?';
        labelN.textContent = lang === 'en' ? '4. Your full name' : '4. Il tuo nome e cognome';
        stepT.classList.remove('hidden');
        stepN.classList.remove('hidden');
    }

    updatePreview();
}

function selectStyle(type, val, el) {
    booking[type] = val;
    document.querySelectorAll(`[data-type="${type}"]`).forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    updatePreview();
}

function updatePreview() {
    const nome = (document.getElementById('booking-nome')?.value || '').trim();
    const { servizio, capelli, trucco } = booking;

    if (!servizio) return;
    if (servizio === 'capelli' && !nome) return;
    if (servizio === 'trucco' && (!trucco || !nome)) return;
    if (servizio === 'entrambi' && (!capelli || !trucco || !nome)) return;

    let msg = `Ciao Noemi! Sono ${nome || '___'}.\n\n`;

    if (servizio === 'capelli') {
        msg += `Vorrei prenotare un servizio per i capelli — stile: *${capelli}*.\n`;
        msg += `Ti invio in allegato la foto di riferimento dello stile scelto. Quando sei disponibile?`;
    } else if (servizio === 'trucco') {
        msg += `Vorrei prenotare un servizio di trucco — stile: *${trucco}*.\n`;
        msg += `Ti invio in allegato la foto di riferimento dello stile scelto. Quando sei disponibile?`;
    } else {
        msg += `Vorrei prenotare sia capelli che trucco.\n`;
        msg += `Capelli: *${capelli}*\n`;
        msg += `Trucco: *${trucco}*\n\n`;
        msg += `Ti invio in allegato le foto di riferimento degli stili scelti. Quando sei disponibile?`;
    }

    document.getElementById('booking-msg-box').textContent = msg;

    // Mostra anteprime foto
    const previewImgs = document.getElementById('booking-preview-imgs');
    previewImgs.innerHTML = '';
    const styles = [];
    if (capelli) styles.push(capelli);
    if (trucco) styles.push(trucco);
    styles.forEach(s => {
        const src = STYLE_IMAGES[s];
        if (src) {
            const img = document.createElement('img');
            img.src = src;
            img.alt = s;
            img.className = 'booking-ref-img';
            const wrap = document.createElement('div');
            wrap.className = 'booking-ref-wrap';
            const label = document.createElement('span');
            label.textContent = s;
            wrap.appendChild(img);
            wrap.appendChild(label);
            previewImgs.appendChild(wrap);
        }
    });

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    document.getElementById('booking-wa-link').href = waUrl;

    document.getElementById('booking-preview').classList.remove('hidden');
    document.getElementById('booking-copied').classList.add('hidden');
}

async function generatePdfAndOpenWA() {
    const { jsPDF } = window.jspdf;
    const nome = (document.getElementById('booking-nome')?.value || '').trim();
    const { servizio, capelli, trucco } = booking;
    const msg = document.getElementById('booking-msg-box').textContent;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pageW - margin * 2;

    // Header
    doc.setFillColor(26, 20, 18);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(201, 169, 110);
    doc.text('Noemi Natale', margin, 20);
    doc.setFontSize(9);
    doc.setTextColor(180, 160, 140);
    doc.text('Make-Up & Hairstyle', margin, 28);

    // Messaggio
    doc.setTextColor(30, 20, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let y = 55;
    doc.setFont('helvetica', 'bold');
    doc.text('Richiesta di appuntamento', margin, y);
    y += 8;
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageW - margin, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(msg, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 14;

    // Foto di riferimento
    const styles = [];
    if (capelli) styles.push(capelli);
    if (trucco) styles.push(trucco);

    if (styles.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Foto di riferimento', margin, y);
        y += 8;
        doc.setDrawColor(201, 169, 110);
        doc.line(margin, y, pageW - margin, y);
        y += 10;

        // Carica e inserisce le immagini rispettando le proporzioni originali
        const maxImgW = (contentW - 10) / 2 * 0.65;

        await Promise.all(styles.map((s, i) => new Promise(resolve => {
            const src = STYLE_IMAGES[s];
            if (!src) { resolve(); return; }
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                canvas.getContext('2d').drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                // Calcola altezza mantenendo il ratio originale
                const ratio = img.naturalHeight / img.naturalWidth;
                const imgW = maxImgW;
                const imgH = imgW * ratio;
                const x = margin + i * (imgW + 10);
                const fmt = src.endsWith('.png') ? 'PNG' : 'JPEG';
                doc.addImage(dataUrl, fmt, x, y, imgW, imgH);
                // Label sotto immagine
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(100, 80, 70);
                doc.text(s, x + imgW / 2, y + imgH + 5, { align: 'center' });
                resolve();
            };
            img.onerror = resolve;
            img.src = src;
        })));
    }

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(26, 20, 18);
    doc.rect(0, pageH - 18, pageW, 18, 'F');
    doc.setFontSize(8);
    doc.setTextColor(120, 100, 80);
    doc.text('Noemi Natale — Make-Up & Hairstyle', pageW / 2, pageH - 8, { align: 'center' });

    const oggi = new Date();
    const dataStr = `${oggi.getFullYear()}${String(oggi.getMonth()+1).padStart(2,'0')}${String(oggi.getDate()).padStart(2,'0')}`;
    const nomeFile = `look-${nome.replace(/\s+/g,'-').toLowerCase()}-${dataStr}.pdf`;

    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], nomeFile, { type: 'application/pdf' });

    // Prova Web Share API (mobile)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
            await navigator.share({
                files: [pdfFile],
                title: 'Richiesta appuntamento — Noemi Natale',
                text: msg,
            });
        } catch (e) {
            // Utente ha annullato o errore — fallback download
            doc.save(nomeFile);
        }
    } else {
        // Desktop o browser non supportato — scarica + apre WA
        doc.save(nomeFile);
        const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
        setTimeout(() => window.open(waUrl, '_blank'), 800);
    }
}

function copyMsg() {
    const text = document.getElementById('booking-msg-box').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const el = document.getElementById('booking-copied');
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 2500);
    });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
