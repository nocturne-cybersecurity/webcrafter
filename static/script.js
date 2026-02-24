// ============================================
// WEBCRAFTER - EDITOR COMPLETO
// ============================================

// Estado global
const S = {
    blocks: [],
    selected: null,
    device: 'desktop',
    history: ['[]'],
    histIdx: 0,
    nextId: 1,
    dragSrc: null,
    dragType: null,
    activeTab: 'style',
    imgTarget: null
};

// Estado del file modal
const fileState = {
    currentTarget: null,
    currentFile: null,
    currentFileType: null,
    currentFileData: null,
    library: []
};

// ============================================
// DEFINICIÓN DE BLOQUES
// ============================================

const DEFS = {
    navigation: [
        { type: 'navbar', name: 'Navbar', preview: 'navbar' },
        { type: 'footer', name: 'Footer', preview: 'footer' },
    ],
    secciones: [
        { type: 'hero', name: 'Hero Section', preview: 'hero' },
        { type: 'quote', name: 'Cita destacada', preview: 'quote' },
    ],
    contenido: [
        { type: 'text', name: 'Texto', preview: 'text' },
        { type: 'image', name: 'Imagen', preview: 'img' },
        { type: 'video_file', name: 'Video', preview: 'video_file' },
        { type: 'divider', name: 'Separador', preview: 'div' },
    ],
    componentes: [
        { type: 'cards', name: 'Tarjetas', preview: 'card' },
        { type: 'cards_enhanced', name: 'Tarjetas con imágenes', preview: 'cards_enhanced' },
        { type: 'gallery', name: 'Galería', preview: 'gal' },
        { type: 'badges', name: 'Badges', preview: 'badge' },
        { type: 'grid2', name: 'Grid 2 col', preview: 'g2' },
    ],
    conversion: [
        { type: 'button', name: 'Botones', preview: 'btn' },
        { type: 'form', name: 'Formulario', preview: 'form' },
        { type: 'pricing', name: 'Precios', preview: 'price' },
        { type: 'testimonial', name: 'Testimonios', preview: 'test' },
    ]
};

// ============================================
// MINI PREVIEWS
// ============================================

function miniHTML(p) {
    const m = {
        navbar: `<div class="mini-navbar"><div class="dot"></div><div class="dots"><span></span><span></span><span></span></div></div>`,
        hero: `<div class="mini-hero"><div class="line" style="width:70%;"></div><div class="sub"></div><div class="mbtn"></div></div>`,
        text: `<div class="mini-text"><div class="h"></div><div class="p" style="width:100%;"></div><div class="p" style="width:75%;"></div></div>`,
        img: `<div class="mini-img">🖼️</div>`,
        card: `<div class="mini-card-wrap"><div class="top"></div><div class="bot"><div class="t"></div><div class="s"></div></div></div>`,
        btn: `<div class="mini-btn"><span style="background:#7c3aed;"></span><span style="background:var(--border2);"></span></div>`,
        form: `<div class="mini-form"><div class="field"></div><div class="field"></div><div class="submit"></div></div>`,
        g2: `<div class="mini-g2"><div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div></div>`,
        gal: `<div class="mini-gal">${['#ede9fe', '#fce7f3', '#d1fae5', '#dbeafe'].map(c => `<div class="cell" style="background:${c}"></div>`).join('')}</div>`,
        video_file: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1e1b4b,#2d1b69);display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-video"></i></div>`,
        div: `<div class="mini-div"><div class="line"></div></div>`,
        footer: `<div class="mini-footer"><div class="lines"><span></span><span style="width:60%"></span></div></div>`,
        quote: `<div class="mini-quote"><span></span><span style="width:80%"></span><span style="width:55%"></span></div>`,
        badge: `<div class="mini-badge"><span style="background:#ede9fe;"></span><span style="background:#d1fae5;"></span><span style="background:#dbeafe;"></span></div>`,
        price: `<div class="mini-price"><div class="sm"></div><div class="big"></div><div class="sm"></div><div class="pb"></div></div>`,
        test: `<div class="mini-test"><div class="stars"><span></span><span></span><span></span><span></span><span></span></div><div class="lines"><span></span><span style="width:80%"></span></div></div>`,
        cards_enhanced: `<div style="width:100%;height:100%;display:flex;gap:2px;padding:4px;"><div style="flex:1;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:4px;"></div><div style="flex:1;background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-radius:4px;"></div></div>`
    };
    return m[p] || `<div style="font-size:20px;">📦</div>`;
}

// ============================================
// LABELS
// ============================================

function typeLabel(t) {
    const labels = {
        navbar: 'Navbar',
        footer: 'Footer',
        hero: 'Hero',
        text: 'Texto',
        image: 'Imagen',
        video: 'Video',
        video_file: 'Video (archivo)',
        divider: 'Separador',
        quote: 'Cita',
        badges: 'Badges',
        button: 'Botones',
        form: 'Formulario',
        cards: 'Tarjetas',
        cards_enhanced: 'Tarjetas con imágenes',
        gallery: 'Galería',
        grid2: 'Grid 2 Col',
        pricing: 'Precios',
        testimonial: 'Testimonios'
    };
    return labels[t] || t;
}

// ============================================
// CONSTRUCCIÓN DE BLOQUES
// ============================================

function buildBlock(type, id) {
    const block = S.blocks.find(b => b.id === id) || { content: {} };
    const c = block.content || {};
    
    const builders = {
        navbar: () => `<div class="b-navbar"><div class="nav-logo">${c.logo || 'WebCrafter'}</div><nav class="nav-links"><a href="#">${c.link1 || 'Inicio'}</a><a href="#">${c.link2 || 'Servicios'}</a><a href="#">${c.link3 || 'Portafolio'}</a><a href="#">${c.link4 || 'Blog'}</a></nav><button class="nav-cta">${c.cta || 'Empezar →'}</button></div>`,
        hero: () => `<div class="b-hero"><div class="chip">${c.chip || '✨ Nuevo · Bienvenido'}</div><h1>${c.h1 || 'Crea páginas web increíbles'}</h1><p>${c.p || 'Una descripción clara y concisa que comunica el valor de tu propuesta.'}</p><div class="hero-btns"><button class="btn-p">${c.btn1 || 'Comenzar gratis'}</button><button class="btn-s">${c.btn2 || 'Ver ejemplos →'}</button></div></div>`,
        text: () => `<div class="b-text"><h2>${c.h2 || 'Encabezado de sección'}</h2><p>${c.p || 'Puedes hacer doble clic para editar este texto directamente en el canvas.'}</p></div>`,
        image: () => `<div class="b-image"><img src="${c.src || 'https://picsum.photos/seed/42/1200/500'}" alt="${c.alt || 'Imagen'}"></div>`,
        video: () => `<div class="b-video"><div class="video-wrap"><div class="play">▶</div></div></div>`,
        video_file: () => buildVideoFileBlock(id),
        divider: () => `<div class="b-divider"><hr></div>`,
        quote: () => `<div class="b-quote"><div class="quote-wrap"><div class="qt">"${c.quote || 'El diseño no es solo cómo se ve o cómo se siente. El diseño es cómo funciona.'}"</div><div class="qa">${c.author || '— Steve Jobs'}</div></div></div>`,
        badges: () => `<div class="b-badges"><span class="badge bpurple">✦ ${c.b1 || 'Nuevo'}</span><span class="badge bgreen">✓ ${c.b2 || 'Activo'}</span><span class="badge borange">⚡ ${c.b3 || 'Pro'}</span><span class="badge bblue">🔵 ${c.b4 || 'Info'}</span><span class="badge bpink">♡ ${c.b5 || 'Favorito'}</span></div>`,
        button: () => `<div class="b-button"><button class="b-btn-p">${c.btn1 || 'Acción principal'}</button><button class="b-btn-s">${c.btn2 || 'Secundario'}</button><button class="b-btn-g">${c.btn3 || 'Ver más →'}</button></div>`,
        form: () => `<div class="b-form"><div class="form-wrap"><h3>${c.h3 || 'Contáctanos'}</h3><p class="sub">${c.sub || 'Te respondemos en menos de 24 horas.'}</p><div class="field"><label>${c.f1 || 'Nombre completo'}</label><input type="text" placeholder="${c.p1 || 'Tu nombre'}"></div><div class="field"><label>${c.f2 || 'Correo electrónico'}</label><input type="email" placeholder="${c.p2 || 'tu@email.com'}"></div><div class="field"><label>${c.f3 || 'Mensaje'}</label><textarea placeholder="${c.p3 || '¿En qué podemos ayudarte?'}"></textarea></div><button class="form-submit">${c.submit || 'Enviar mensaje →'}</button></div></div>`,
        cards: () => `<div class="b-cards">${['🎨', '🚀', '⭐'].map((e, i) => `<div class="b-card-item"><div class="card-img">${c['icon' + (i + 1)] || e}</div><div class="card-body"><h4>${c['title' + (i + 1)] || 'Característica ' + (i + 1)}</h4><p>${c['desc' + (i + 1)] || 'Describe los beneficios clave.'}</p><button class="card-btn">${c['cta' + (i + 1)] || 'Saber más →'}</button></div></div>`).join('')}</div>`,
        cards_enhanced: () => buildCardsEnhancedBlock(id),
        gallery: () => `<div class="b-gallery"><div class="gal-grid">${[11, 22, 33, 44, 55, 66].map((n, i) => `<div class="gal-item"><img src="${c['img' + (i + 1)] || 'https://picsum.photos/seed/' + n + '/400/400'}" alt="Foto"></div>`).join('')}</div></div>`,
        grid2: () => `<div class="b-grid2"><div class="g2-cell"><div class="icon">${c.icon1 || '⚡'}</div><h4>${c.t1 || 'Velocidad'}</h4><p>${c.d1 || 'Sitios optimizados para la mejor experiencia.'}</p></div><div class="g2-cell"><div class="icon">${c.icon2 || '🎨'}</div><h4>${c.t2 || 'Diseño'}</h4><p>${c.d2 || 'Interfaz limpia que refleja tu marca.'}</p></div><div class="g2-cell"><div class="icon">${c.icon3 || '📱'}</div><h4>${c.t3 || 'Responsivo'}</h4><p>${c.d3 || 'Se adapta a cualquier dispositivo.'}</p></div><div class="g2-cell"><div class="icon">${c.icon4 || '🔒'}</div><h4>${c.t4 || 'Seguridad'}</h4><p>${c.d4 || 'Protección avanzada para tus datos.'}</p></div></div>`,
        pricing: () => `<div class="b-pricing"><div class="price-grid">${[{ n: c.plan1 || 'Básico', p: c.price1 || '0', f: [c.f1_1 || '5 proyectos', c.f1_2 || 'Exportar HTML', c.f1_3 || 'Soporte email'], btn: c.btn1 || 'Gratis', feat: false }, { n: c.plan2 || 'Pro', p: c.price2 || '19', f: [c.f2_1 || 'Proyectos ilimitados', c.f2_2 || 'Dominio propio', c.f2_3 || 'Soporte prioritario'], btn: c.btn2 || 'Empezar Pro', feat: true }, { n: c.plan3 || 'Empresa', p: c.price3 || '49', f: [c.f3_1 || 'Todo en Pro', c.f3_2 || 'Equipo ilimitado', c.f3_3 || 'API access'], btn: c.btn3 || 'Contactar', feat: false }].map(card => `<div class="price-card ${card.feat ? 'featured' : ''}"><div class="plan">${card.n}</div><div class="price"><sup>$</sup>${card.p}<span class="per">/mes</span></div><ul class="feats">${card.f.map(x => `<li>${x}</li>`).join('')}</ul><button class="plan-btn ${card.feat ? '' : 'light'}">${card.btn}</button></div>`).join('')}</div></div>`,
        testimonial: () => `<div class="b-testimonial"><div class="t-grid">${[{ n: c.name1 || 'Ana García', r: c.role1 || 'Diseñadora', t: c.text1 || 'Increíble herramienta.', i: 'A' }, { n: c.name2 || 'Carlos López', r: c.role2 || 'Emprendedor', t: c.text2 || 'La recomiendo ampliamente.', i: 'C' }].map(x => `<div class="t-card"><div class="stars">★★★★★</div><div class="tt">"${x.t}"</div><div class="ta"><div class="av">${x.i}</div><div><div class="an">${x.n}</div><div class="ar">${x.r}</div></div></div></div>`).join('')}</div></div>`,
        footer: () => `<div class="b-footer"><div class="f-grid"><div><div class="fb">${c.brand || 'WebCrafter'}</div><div class="fd">${c.desc || 'La plataforma más fácil para crear páginas web.'}</div></div><div class="fc"><h5>${c.col1 || 'Producto'}</h5><a href="#">${c.l1_1 || 'Características'}</a><a href="#">${c.l1_2 || 'Precios'}</a><a href="#">${c.l1_3 || 'Plantillas'}</a></div><div class="fc"><h5>${c.col2 || 'Empresa'}</h5><a href="#">${c.l2_1 || 'Nosotros'}</a><a href="#">${c.l2_2 || 'Blog'}</a><a href="#">${c.l2_3 || 'Carreras'}</a></div><div class="fc"><h5>${c.col3 || 'Soporte'}</h5><a href="#">${c.l3_1 || 'Docs'}</a><a href="#">${c.l3_2 || 'Tutoriales'}</a><a href="#">${c.l3_3 || 'Contacto'}</a></div></div><div class="f-bottom"><div class="fcopy">${c.copy || '© 2025 WebCrafter'}</div><div class="fsoc"><a href="#"><i class="fab fa-twitter"></i></a><a href="#"><i class="fab fa-instagram"></i></a><a href="#"><i class="fab fa-linkedin"></i></a></div></div></div>`
    };
    
    return (builders[type] || (() => `<div style="padding:40px;text-align:center;color:#aaa;">Bloque: ${type}</div>`))();
}

// ============================================
// BLOQUE DE VIDEO CON ARCHIVO
// ============================================

function buildVideoFileBlock(id) {
    const block = S.blocks.find(b => b.id === id) || { content: {} };
    const c = block.content || {};
    
    if (!c.src) {
        return `
            <div class="b-video-file" style="padding:48px;text-align:center;">
                <div style="background:#f9fafb;border-radius:16px;padding:48px;border:2px dashed #e5e7eb;">
                    <i class="fas fa-video" style="font-size:48px;color:#9ca3af;margin-bottom:16px;display:block;"></i>
                    <p style="color:#6b7280;margin-bottom:16px;">Selecciona un video para reproducir</p>
                    <button onclick="openFileModal({blockId:${id}, fieldKey:'src', mediaType:'video'})" 
                            style="padding:10px 20px;background:#7c3aed;color:white;border:none;border-radius:8px;cursor:pointer;">
                        <i class="fas fa-upload"></i> Subir video
                    </button>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="b-video-file" style="padding:32px 48px;">
            <div style="position:relative;border-radius:16px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,0.12);">
                <video 
                    src="${c.src}"
                    poster="${c.poster || ''}"
                    ${c.autoplay ? 'autoplay' : ''}
                    ${c.controls !== false ? 'controls' : ''}
                    ${c.loop ? 'loop' : ''}
                    ${c.muted ? 'muted' : ''}
                    style="width:100%;display:block;"
                ></video>
            </div>
            ${c.caption ? `<p style="margin-top:12px;color:#6b7280;text-align:center;">${c.caption}</p>` : ''}
        </div>
    `;
}

// ============================================
// BLOQUE DE TARJETAS MEJORADAS (CON IMÁGENES REALES)
// ============================================

function buildCardsEnhancedBlock(id) {
    const block = S.blocks.find(b => b.id === id) || { content: {} };
    const c = block.content || {};
    
    // Valores por defecto con imágenes reales
    const defaultCards = [
        { 
            id: 1, 
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', 
            title: 'Diseño Moderno', 
            description: 'Interfaces limpias y profesionales que cautivan a tus usuarios.', 
            buttonText: 'Ver más',
            badge: 'Nuevo'
        },
        { 
            id: 2, 
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', 
            title: 'Desarrollo Rápido', 
            description: 'Construye y publica en horas, no en meses.', 
            buttonText: 'Comenzar',
            badge: 'Popular'
        }
    ];
    
    const cards = c.cards || defaultCards;
    const columns = c.columns || 2;
    
    return `
        <div class="b-cards-enhanced" style="padding:48px;">
            ${c.title ? `<h2 style="font-family:'DM Serif Display',serif;font-size:32px;text-align:center;margin-bottom:32px;color:#1f2937;">${c.title}</h2>` : ''}
            <div style="display:grid;grid-template-columns:repeat(${columns},1fr);gap:24px;">
                ${cards.map((card, idx) => `
                    <div class="enhanced-card" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid #f3f4f6;transition:transform 0.2s,box-shadow 0.2s;">
                        <div style="position:relative;">
                            <img src="${card.image}" style="width:100%;aspect-ratio:16/9;object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'">
                            ${card.badge ? `<span style="position:absolute;top:12px;right:12px;background:#7c3aed;color:white;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;">${card.badge}</span>` : ''}
                        </div>
                        <div style="padding:20px;">
                            <h3 style="font-size:18px;font-weight:700;margin-bottom:8px;color:#1f2937;">${card.title}</h3>
                            <p style="color:#6b7280;margin-bottom:16px;line-height:1.5;">${card.description}</p>
                            <button style="background:#f5f3ff;color:#7c3aed;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;transition:background 0.2s;">${card.buttonText || 'Saber más'}</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ============================================
// RENDERIZADO DE PANELES DE CONTENIDO
// ============================================

function renderVideoFilePanel(block, body) {
    const c = block.content || {};
    
    let html = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Video</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
    `;
    
    if (c.src) {
        html += `
            <div style="margin-bottom:12px;">
                <video src="${c.src}" style="width:100%;border-radius:8px;" controls></video>
            </div>
        `;
    }
    
    html += `
                <button onclick="openFileModal({blockId:${block.id}, fieldKey:'src', mediaType:'video'})" 
                        style="width:100%;padding:10px;background:#7c3aed;color:white;border:none;border-radius:8px;margin-bottom:8px;">
                    <i class="fas fa-upload"></i> ${c.src ? 'Cambiar video' : 'Subir video'}
                </button>
                <div class="content-field">
                    <label>Póster (imagen de portada)</label>
                    <button onclick="openFileModal({blockId:${block.id}, fieldKey:'poster', mediaType:'image'})" 
                            style="width:100%;padding:8px;background:#f5f3ff;color:#7c3aed;border:none;border-radius:6px;">
                        <i class="fas fa-image"></i> Seleccionar imagen
                    </button>
                </div>
                <div class="content-field">
                    <label>Pie de foto</label>
                    <input type="text" onchange="applyContent('caption',this.value)" value="${c.caption || ''}">
                </div>
            </div>
        </div>
        
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Opciones</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <label style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" onchange="applyContent('controls',this.checked)" ${c.controls !== false ? 'checked' : ''}>
                    <span>Mostrar controles</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" onchange="applyContent('autoplay',this.checked)" ${c.autoplay ? 'checked' : ''}>
                    <span>Auto-reproducción</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" onchange="applyContent('loop',this.checked)" ${c.loop ? 'checked' : ''}>
                    <span>Repetir</span>
                </label>
                <label style="display:flex;align-items:center;gap:8px;">
                    <input type="checkbox" onchange="applyContent('muted',this.checked)" ${c.muted ? 'checked' : ''}>
                    <span>Silenciado</span>
                </label>
            </div>
        </div>
    `;
    
    body.innerHTML = html;
}

function renderCardsEnhancedPanel(block, body) {
    const c = block.content || {};
    const cards = c.cards || [
        { id: 1, image: 'https://picsum.photos/seed/1/400/300', title: 'Característica 1', description: 'Descripción detallada de esta característica', buttonText: 'Saber más', badge: 'Nuevo' },
        { id: 2, image: 'https://picsum.photos/seed/2/400/300', title: 'Característica 2', description: 'Otra característica importante', buttonText: 'Ver demo', badge: 'Popular' }
    ];
    
    let html = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Configuración</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Título de sección</label>
                    <input type="text" onchange="applyContent('title',this.value)" value="${c.title || ''}">
                </div>
                <div class="p-row">
                    <label>Columnas</label>
                    <select class="p-input" onchange="applyContent('columns',parseInt(this.value))">
                        <option value="2" ${c.columns === 2 ? 'selected' : ''}>2 columnas</option>
                        <option value="3" ${c.columns === 3 ? 'selected' : ''}>3 columnas</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    cards.forEach((card, idx) => {
        html += `
            <div class="prop-sec">
                <div class="prop-sec-hd" onclick="toggleSec(this)">
                    <span>Tarjeta ${idx + 1}</span>
                    <button onclick="removeCard(${idx})" style="border:none;background:transparent;color:#ef4444;margin-right:8px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="prop-sec-body">
                    <div class="content-field">
                        <label>Imagen</label>
                        <div style="margin-bottom:8px;">
                            <img src="${card.image}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;">
                        </div>
                        <button onclick="openFileModal({blockId:${block.id}, cardIndex:${idx}, fieldKey:'image', mediaType:'image'})" 
                                style="width:100%;padding:8px;background:#7c3aed;color:white;border:none;border-radius:6px;">
                            <i class="fas fa-upload"></i> Cambiar imagen
                        </button>
                    </div>
                    <div class="content-field">
                        <label>Título</label>
                        <input type="text" onchange="updateCardField(${idx}, 'title', this.value)" value="${card.title || ''}">
                    </div>
                    <div class="content-field">
                        <label>Descripción</label>
                        <textarea onchange="updateCardField(${idx}, 'description', this.value)">${card.description || ''}</textarea>
                    </div>
                    <div class="content-field">
                        <label>Texto botón</label>
                        <input type="text" onchange="updateCardField(${idx}, 'buttonText', this.value)" value="${card.buttonText || ''}">
                    </div>
                    <div class="content-field">
                        <label>Badge</label>
                        <input type="text" onchange="updateCardField(${idx}, 'badge', this.value)" value="${card.badge || ''}">
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        <button onclick="addNewCard()" style="width:calc(100% - 32px);margin:0 16px 12px;padding:12px;background:#f5f3ff;color:#7c3aed;border:2px dashed #7c3aed;border-radius:8px;">
            <i class="fas fa-plus"></i> Añadir tarjeta
        </button>
    `;
    
    body.innerHTML = html;
}

// Funciones auxiliares para tarjetas
function updateCardField(cardIndex, field, value) {
    const block = S.blocks.find(b => b.id === S.selected);
    if (!block) return;
    if (!block.content.cards) block.content.cards = [];
    if (!block.content.cards[cardIndex]) block.content.cards[cardIndex] = {};
    block.content.cards[cardIndex][field] = value;
    
    const el = document.querySelector(`.c-el[data-id="${block.id}"]`);
    if (el) {
        const toolbar = el.querySelector('.c-el-toolbar');
        const toolbarHTML = toolbar ? toolbar.outerHTML : '';
        el.innerHTML = buildBlock(block.type, block.id) + toolbarHTML;
    }
    
    saveHistory();
}

function addNewCard() {
    const block = S.blocks.find(b => b.id === S.selected);
    if (!block) return;
    if (!block.content.cards) block.content.cards = [];
    block.content.cards.push({
        id: Date.now(),
        image: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 100) + '/400/300',
        title: 'Nueva tarjeta',
        description: 'Descripción de la nueva tarjeta',
        buttonText: 'Saber más'
    });
    renderPanel();
    renderCanvas();
    saveHistory();
}

function removeCard(cardIndex) {
    const block = S.blocks.find(b => b.id === S.selected);
    if (!block) return;
    block.content.cards.splice(cardIndex, 1);
    renderPanel();
    renderCanvas();
    saveHistory();
}

// ============================================
// FUNCIONES DEL MODAL DE ARCHIVOS
// ============================================

function initFileLibrary() {
    try {
        const saved = localStorage.getItem('webcraft_file_library');
        if (saved) fileState.library = JSON.parse(saved);
    } catch (e) { console.warn('Error cargando biblioteca:', e); }
}

function saveFileLibrary() {
    try {
        localStorage.setItem('webcraft_file_library', JSON.stringify(fileState.library));
    } catch (e) { console.warn('Error guardando biblioteca:', e); }
}

function openFileModal(target) {
    fileState.currentTarget = target;
    fileState.currentFile = null;
    fileState.currentFileData = null;
    
    const modal = document.getElementById('file-modal');
    const title = document.getElementById('file-modal-title');
    
    if (target.mediaType === 'video') {
        title.textContent = 'Seleccionar video';
        document.getElementById('file-accepted-types').textContent = 'Formatos: MP4, WebM, OGG';
        document.getElementById('file-input').accept = 'video/*';
    } else {
        title.textContent = 'Seleccionar imagen';
        document.getElementById('file-accepted-types').textContent = 'Formatos: JPG, PNG, GIF, WebP';
        document.getElementById('file-input').accept = 'image/*';
    }
    
    switchFileTab('upload');
    document.getElementById('file-preview-container').style.display = 'none';
    document.getElementById('file-preview').innerHTML = '';
    document.getElementById('file-url-input').value = '';
    
    renderFileLibrary();
    modal.style.display = 'flex';
}

function closeFileModal() {
    document.getElementById('file-modal').style.display = 'none';
    fileState.currentTarget = null;
}

function switchFileTab(tabName) {
    document.querySelectorAll('.file-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        tab.style.color = isActive ? '#7c3aed' : '#9ca3af';
        tab.style.borderBottom = isActive ? '2px solid #7c3aed' : 'none';
    });
    
    document.querySelectorAll('.file-tab-panel').forEach(panel => {
        panel.style.display = panel.id === `file-tab-${tabName}` ? 'block' : 'none';
    });
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    fileState.currentFile = file;
    fileState.currentFileType = file.type.startsWith('image/') ? 'image' : 'video';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        fileState.currentFileData = e.target.result;
        showFilePreview(e.target.result, fileState.currentFileType);
    };
    reader.readAsDataURL(file);
}

function showFilePreview(dataUrl, type) {
    const container = document.getElementById('file-preview-container');
    const preview = document.getElementById('file-preview');
    
    if (type === 'image') {
        preview.innerHTML = `<img src="${dataUrl}" style="width:100%;max-height:200px;object-fit:contain;">`;
    } else {
        preview.innerHTML = `<video controls style="width:100%;max-height:200px;"><source src="${dataUrl}"></video>`;
    }
    
    container.style.display = 'block';
}

function applySelectedFile() {
    if (!fileState.currentTarget) return;
    
    const { blockId, fieldKey, cardIndex, mediaType } = fileState.currentTarget;
    const block = S.blocks.find(b => b.id === blockId);
    if (!block) return;
    
    let fileUrl = fileState.currentFileData || document.getElementById('file-url-input').value;
    if (!fileUrl) {
        toast('Selecciona un archivo o ingresa una URL', 'red');
        return;
    }
    
    // Guardar en contenido del bloque
    if (cardIndex !== undefined) {
        if (!block.content.cards) block.content.cards = [];
        if (!block.content.cards[cardIndex]) block.content.cards[cardIndex] = {};
        block.content.cards[cardIndex][fieldKey] = fileUrl;
        block.content.cards[cardIndex].mediaType = mediaType || 
            (fileUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');
    } else {
        block.content[fieldKey] = fileUrl;
        if (mediaType) block.content.mediaType = mediaType;
    }
    
    // Re-renderizar
    const el = document.querySelector(`.c-el[data-id="${block.id}"]`);
    if (el) {
        const toolbar = el.querySelector('.c-el-toolbar');
        const toolbarHTML = toolbar ? toolbar.outerHTML : '';
        el.innerHTML = buildBlock(block.type, block.id) + toolbarHTML;
    }
    
    if (S.selected === blockId) renderPanel();
    
    saveHistory();
    closeFileModal();
    toast('Archivo aplicado ✓', 'green');
}

function applyFileFromUrl() {
    const url = document.getElementById('file-url-input').value.trim();
    if (!url) return;
    
    fileState.currentFileData = url;
    fileState.currentFile = null;
    
    const ext = url.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    
    if (imageExts.includes(ext)) {
        fileState.currentFileType = 'image';
        showFilePreview(url, 'image');
    } else {
        fileState.currentFileType = 'video';
        showFilePreview(url, 'video');
    }
}

function renderFileLibrary() {
    const grid = document.getElementById('file-library-grid');
    if (!grid) return;
    
    if (fileState.library.length === 0) {
        grid.innerHTML = `<div style="grid-column:span3;text-align:center;padding:20px;color:#9ca3af;">
            <i class="fas fa-folder-open" style="font-size:24px;margin-bottom:8px;display:block;"></i>
            No hay archivos en la biblioteca
        </div>`;
        return;
    }
    
    grid.innerHTML = fileState.library.map(item => `
        <div style="border:1px solid #f3f4f6;border-radius:8px;overflow:hidden;cursor:pointer;position:relative;"
             onclick="selectFromLibrary('${item.id}')">
            ${item.type === 'image' 
                ? `<img src="${item.url}" style="width:100%;aspect-ratio:1;object-fit:cover;">`
                : `<div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,#1e1b4b,#2d1b69);display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-video"></i></div>`
            }
            <div style="padding:6px;"><div style="font-size:10px;">${item.name || 'Sin nombre'}</div></div>
        </div>
    `).join('');
}

function selectFromLibrary(itemId) {
    const item = fileState.library.find(i => i.id === itemId);
    if (!item) return;
    fileState.currentFileData = item.url;
    fileState.currentFileType = item.type;
    showFilePreview(item.url, item.type);
}

// ============================================
// FUNCIONES PRINCIPALES DEL EDITOR
// ============================================

function renderElements(filter = '') {
    const c = document.getElementById('elements-container');
    c.innerHTML = '';
    const q = filter.toLowerCase();
    const catNames = { navigation: 'Navegación', secciones: 'Secciones', contenido: 'Contenido', componentes: 'Componentes', conversion: 'Conversión' };
    
    for (const [cat, items] of Object.entries(DEFS)) {
        const vis = filter ? items.filter(i => i.name.toLowerCase().includes(q) || i.type.includes(q)) : items;
        if (!vis.length) continue;
        
        const lbl = document.createElement('div');
        lbl.className = 'cat-label';
        lbl.textContent = catNames[cat] || cat;
        c.appendChild(lbl);
        
        const grid = document.createElement('div');
        grid.className = 'comp-grid';
        
        vis.forEach(item => {
            const card = document.createElement('div');
            card.className = 'comp-card';
            card.draggable = true;
            card.title = item.name;
            card.innerHTML = `<div class="comp-card-preview">${miniHTML(item.preview)}</div><div class="comp-name">${item.name}</div>`;
            
            card.addEventListener('dragstart', e => {
                S.dragSrc = 'palette';
                S.dragType = item.type;
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', item.type);
            });
            
            card.addEventListener('click', () => {
                addBlock(item.type);
                toast(`${typeLabel(item.type)} añadido ✓`, 'green');
            });
            
            grid.appendChild(card);
        });
        
        c.appendChild(grid);
    }
}

function addBlock(type, record = true) {
    const id = S.nextId++;
    S.blocks.push({ id, type, styles: {}, content: {} });
    renderCanvas();
    selectBlock(id);
    if (record) saveHistory();
    updateSidebars();
    updateStatus();
}

function renderCanvas() {
    const page = document.getElementById('canvas-page');
    const empty = document.getElementById('canvas-empty');
    
    page.querySelectorAll('.c-el').forEach(e => e.remove());
    
    if (!S.blocks.length) {
        empty.classList.remove('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    
    S.blocks.forEach(block => {
        const w = document.createElement('div');
        w.className = 'c-el' + (S.selected === block.id ? ' selected' : '');
        w.dataset.id = block.id;
        w.dataset.name = typeLabel(block.type);
        Object.assign(w.style, block.styles);
        w.innerHTML = buildBlock(block.type, block.id);
        
        const tb = document.createElement('div');
        tb.className = 'c-el-toolbar';
        tb.innerHTML = `
            <button class="c-el-tb-btn etb-move"><i class="fas fa-grip-vertical"></i></button>
            <button class="c-el-tb-btn etb-dup" onclick="dupBlock(${block.id})"><i class="fas fa-copy"></i></button>
            <button class="c-el-tb-btn etb-del" onclick="delBlock(${block.id})"><i class="fas fa-times"></i></button>
        `;
        w.appendChild(tb);
        
        w.addEventListener('click', e => {
            e.stopPropagation();
            selectBlock(block.id);
        });
        
        w.addEventListener('dblclick', e => {
            const ed = e.target.closest('h1,h2,h3,h4,p,a,button');
            if (ed && !ed.closest('button')) {
                ed.contentEditable = 'true';
                ed.focus();
                ed.addEventListener('blur', () => {
                    ed.contentEditable = 'false';
                    saveHistory();
                }, { once: true });
            }
        });
        
        tb.querySelector('.etb-move').addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
            
            const sy = e.clientY;
            const idx = S.blocks.findIndex(b => b.id === block.id);
            let moved = false;
            
            const onM = ev => {
                const d = ev.clientY - sy;
                if (Math.abs(d) > 36) {
                    const ni = idx + (d > 0 ? 1 : -1);
                    if (ni >= 0 && ni < S.blocks.length) {
                        const arr = [...S.blocks];
                        const [it] = arr.splice(idx, 1);
                        arr.splice(ni, 0, it);
                        S.blocks = arr;
                        renderCanvas();
                        updateSidebars();
                        moved = true;
                    }
                    document.removeEventListener('mousemove', onM);
                    document.removeEventListener('mouseup', onU);
                }
            };
            
            const onU = () => {
                document.removeEventListener('mousemove', onM);
                document.removeEventListener('mouseup', onU);
                if (moved) saveHistory();
            };
            
            document.addEventListener('mousemove', onM);
            document.addEventListener('mouseup', onU);
        });
        
        page.appendChild(w);
    });
}

function selectBlock(id) {
    S.selected = id;
    S.activeTab = 'style';
    renderCanvas();
    renderPanel();
    updateSidebars();
}

function deselectAll() {
    S.selected = null;
    renderCanvas();
    renderPanel();
    updateSidebars();
}

function handleBgClick(e) {
    if (e.target === document.getElementById('canvas-area') || e.target === document.getElementById('canvas-page')) {
        deselectAll();
    }
}

function delBlock(id) {
    S.blocks = S.blocks.filter(b => b.id !== id);
    if (S.selected === id) S.selected = null;
    renderCanvas();
    renderPanel();
    updateSidebars();
    updateStatus();
    saveHistory();
    toast('Elemento eliminado');
}

function dupBlock(id) {
    const idx = S.blocks.findIndex(b => b.id === id);
    if (idx < 0) return;
    
    const orig = S.blocks[idx];
    const nb = { ...orig, id: S.nextId++, styles: { ...orig.styles }, content: JSON.parse(JSON.stringify(orig.content)) };
    S.blocks.splice(idx + 1, 0, nb);
    renderCanvas();
    selectBlock(nb.id);
    updateSidebars();
    updateStatus();
    saveHistory();
    toast('Elemento duplicado ✓', 'green');
}

function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    document.getElementById('canvas-page').classList.add('drag-over');
}

function onDragLeave(e) {
    if (!document.getElementById('canvas-page').contains(e.relatedTarget)) {
        document.getElementById('canvas-page').classList.remove('drag-over');
    }
}

function onDrop(e) {
    e.preventDefault();
    document.getElementById('canvas-page').classList.remove('drag-over');
    
    const type = e.dataTransfer.getData('text/plain');
    if (type && S.dragSrc === 'palette') {
        addBlock(type);
        toast(`${typeLabel(type)} añadido ✓`, 'green');
    }
    
    S.dragSrc = null;
    S.dragType = null;
}

// ============================================
// PANEL DE PROPIEDADES
// ============================================

function renderPanel() {
    const body = document.getElementById('panel-body');
    const tag = document.getElementById('panel-tag');
    const tabs = document.getElementById('panel-tabs');
    const block = S.blocks.find(b => b.id === S.selected);
    
    if (!block) {
        tag.style.display = 'none';
        tabs.style.display = 'none';
        body.innerHTML = `<div class="panel-empty"><div class="pei"><i class="fas fa-mouse-pointer"></i></div><p>Selecciona un elemento para editar sus propiedades</p></div>`;
        return;
    }
    
    tag.style.display = 'inline-block';
    tag.textContent = typeLabel(block.type);
    tabs.style.display = 'flex';
    
    tabs.querySelectorAll('.ptab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === S.activeTab);
    });
    
    if (S.activeTab === 'style') {
        renderStylePanel(block, body);
    } else {
        // Renderizar panel de contenido según el tipo
        const contentRenderers = {
            'hero': renderHeroContentPanel,
            'text': renderTextContentPanel,
            'image': renderImageContentPanel,
            'navbar': renderNavbarContentPanel,
            'button': renderButtonContentPanel,
            'cards': renderCardsContentPanel,
            'gallery': renderGalleryContentPanel,
            'quote': renderQuoteContentPanel,
            'badges': renderBadgesContentPanel,
            'form': renderFormContentPanel,
            'pricing': renderPricingContentPanel,
            'testimonial': renderTestimonialContentPanel,
            'grid2': renderGrid2ContentPanel,
            'footer': renderFooterContentPanel,
            'video_file': renderVideoFilePanel,
            'cards_enhanced': renderCardsEnhancedPanel
        };
        
        const renderer = contentRenderers[block.type];
        if (renderer) {
            renderer(block, body);
        } else {
            renderGenericContentPanel(block, body);
        }
    }
}

function renderStylePanel(block, body) {
    const st = block.styles;
    
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Espaciado</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="p-row"><label>Padding</label><input class="p-input" type="text" placeholder="Ej: 48px" value="${st.padding || ''}" onchange="applyStyle('padding',this.value)"></div>
                <div class="p-row"><label>Padding top</label><input class="p-input" type="text" placeholder="Ej: 32px" value="${st.paddingTop || ''}" onchange="applyStyle('paddingTop',this.value)"></div>
                <div class="p-row"><label>Padding bottom</label><input class="p-input" type="text" placeholder="Ej: 32px" value="${st.paddingBottom || ''}" onchange="applyStyle('paddingBottom',this.value)"></div>
                <div class="p-row"><label>Margen</label><input class="p-input" type="text" placeholder="Ej: 0 auto" value="${st.margin || ''}" onchange="applyStyle('margin',this.value)"></div>
            </div>
        </div>
        
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Fondo</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="p-row">
                    <label>Color</label>
                    <input class="p-input" type="color" value="${st.backgroundColor || '#ffffff'}" onchange="applyStyle('backgroundColor',this.value)">
                </div>
                <div class="p-row">
                    <label>Imagen</label>
                    <input class="p-input" type="text" placeholder="URL de imagen" value="${st.backgroundImage || ''}" onchange="applyStyle('backgroundImage',this.value ? 'url('+this.value+')' : '')">
                </div>
                <div class="p-row">
                    <label>Tamaño</label>
                    <select class="p-input" onchange="applyStyle('backgroundSize',this.value)">
                        <option value="">Automático</option>
                        <option value="cover" ${st.backgroundSize === 'cover' ? 'selected' : ''}>Cubrir (cover)</option>
                        <option value="contain" ${st.backgroundSize === 'contain' ? 'selected' : ''}>Contener (contain)</option>
                        <option value="100% 100%" ${st.backgroundSize === '100% 100%' ? 'selected' : ''}>Estirar</option>
                    </select>
                </div>
                <div class="color-swatches">
                    ${['#ffffff', '#f5f3ff', '#fce7f3', '#d1fae5', '#dbeafe', '#1e1b4b', '#111827', '#f9fafb'].map(c => 
                        `<div class="swatch" style="background:${c};" onclick="applyStyle('backgroundColor','${c}')" title="${c}"></div>`
                    ).join('')}
                </div>
            </div>
        </div>

        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Tipografía</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="p-row"><label>Fuente</label>
                    <select class="p-input" onchange="applyStyle('fontFamily',this.value)">
                        <option value="">Predeterminada</option>
                        <option value="'DM Sans', sans-serif" ${st.fontFamily && st.fontFamily.includes('DM Sans') ? 'selected' : ''}>DM Sans</option>
                        <option value="'DM Serif Display', serif" ${st.fontFamily && st.fontFamily.includes('DM Serif') ? 'selected' : ''}>DM Serif</option>
                        <option value="Georgia, serif" ${st.fontFamily === 'Georgia, serif' ? 'selected' : ''}>Georgia</option>
                        <option value="'Courier New', monospace" ${st.fontFamily && st.fontFamily.includes('Courier') ? 'selected' : ''}>Courier New</option>
                        <option value="Arial, sans-serif" ${st.fontFamily === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                    </select>
                </div>
                <div class="p-row"><label>Tamaño</label>
                    <input class="p-input" type="text" placeholder="Ej: 16px" value="${st.fontSize || ''}" onchange="applyStyle('fontSize',this.value)">
                </div>
                <div class="p-row"><label>Color texto</label>
                    <input class="p-input" type="color" value="${st.color || '#1f2937'}" onchange="applyStyle('color',this.value)">
                </div>
                <div class="p-row"><label>Peso</label>
                    <select class="p-input" onchange="applyStyle('fontWeight',this.value)">
                        <option value="">Normal</option>
                        <option value="300" ${st.fontWeight === '300' ? 'selected' : ''}>Ligero (300)</option>
                        <option value="400" ${st.fontWeight === '400' ? 'selected' : ''}>Regular (400)</option>
                        <option value="500" ${st.fontWeight === '500' ? 'selected' : ''}>Medio (500)</option>
                        <option value="600" ${st.fontWeight === '600' ? 'selected' : ''}>Semi-negrita (600)</option>
                        <option value="700" ${st.fontWeight === '700' ? 'selected' : ''}>Negrita (700)</option>
                    </select>
                </div>
                <div class="p-row"><label>Alineación</label>
                    <div style="display:flex;gap:4px;flex:1;">
                        ${['left', 'center', 'right'].map(a => `
                            <button style="flex:1;height:28px;border:1.5px solid ${st.textAlign === a ? '#7c3aed' : '#f3f4f6'};border-radius:5px;background:${st.textAlign === a ? '#f5f3ff' : 'white'};cursor:pointer;font-size:11px;color:${st.textAlign === a ? '#7c3aed' : '#9ca3af'};" 
                                    onclick="applyStyle('textAlign','${a}')">
                                ${a === 'left' ? '◀ Izq' : a === 'center' ? '◆ Centro' : '▶ Der'}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Borde y sombra</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="p-row"><label>Radio</label><input class="p-input" type="number" min="0" max="60" value="${parseInt(st.borderRadius) || ''}" placeholder="0" oninput="applyStyle('borderRadius',this.value+'px')"></div>
                <div class="p-row"><label>Borde</label><input class="p-input" type="text" placeholder="1px solid #eee" value="${st.border || ''}" onchange="applyStyle('border',this.value)"></div>
                <div class="p-row"><label>Sombra</label>
                    <select class="p-input" onchange="applyStyle('boxShadow',this.value)">
                        <option value="">Ninguna</option>
                        <option value="0 1px 3px rgba(0,0,0,0.08)" ${st.boxShadow === '0 1px 3px rgba(0,0,0,0.08)' ? 'selected' : ''}>Suave</option>
                        <option value="0 4px 12px rgba(0,0,0,0.1)" ${st.boxShadow === '0 4px 12px rgba(0,0,0,0.1)' ? 'selected' : ''}>Media</option>
                        <option value="0 12px 32px rgba(0,0,0,0.12)" ${st.boxShadow === '0 12px 32px rgba(0,0,0,0.12)' ? 'selected' : ''}>Fuerte</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Ancho y alto</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="p-row"><label>Ancho</label><input class="p-input" type="text" placeholder="auto / 100%" value="${st.width || ''}" onchange="applyStyle('width',this.value)"></div>
                <div class="p-row"><label>Max ancho</label><input class="p-input" type="text" placeholder="1200px" value="${st.maxWidth || ''}" onchange="applyStyle('maxWidth',this.value)"></div>
                <div class="p-row"><label>Alto</label><input class="p-input" type="text" placeholder="auto" value="${st.height || ''}" onchange="applyStyle('height',this.value)"></div>
            </div>
        </div>
    `;

    // Botón eliminar
    const del = document.createElement('button');
    del.className = 'del-btn';
    del.innerHTML = '<i class="fas fa-trash"></i> Eliminar elemento';
    del.onclick = () => delBlock(block.id);
    body.appendChild(del);
}

function renderGenericContentPanel(block, body) {
    body.innerHTML = `
        <div style="padding:24px;text-align:center;color:#9ca3af;font-size:13px;">
            <div style="font-size:24px;margin-bottom:8px;">✏️</div>
            <p>Haz doble clic sobre el texto en el canvas para editarlo directamente.</p>
        </div>
        <button class="del-btn" onclick="delBlock(${block.id})"><i class="fas fa-trash"></i> Eliminar elemento</button>
    `;
}

function applyStyle(prop, val) {
    const b = S.blocks.find(b => b.id === S.selected);
    if (!b) return;
    b.styles[prop] = val;
    
    const el = document.querySelector(`.c-el[data-id="${b.id}"]`);
    if (el) el.style[prop] = val;
}

function applyContent(key, val) {
    const b = S.blocks.find(b => b.id === S.selected);
    if (!b) return;
    b.content[key] = val;
    
    const el = document.querySelector(`.c-el[data-id="${b.id}"]`);
    if (el) {
        const toolbar = el.querySelector('.c-el-toolbar');
        const toolbarHTML = toolbar ? toolbar.outerHTML : '';
        el.innerHTML = buildBlock(b.type, b.id) + toolbarHTML;
    }
    
    saveHistory();
}

function toggleSec(hd) {
    hd.closest('.prop-sec').classList.toggle('closed');
}

// ============================================
// LAYERS Y ESTADO
// ============================================

function updateSidebars() {
    const list = document.getElementById('layers-list');
    
    if (!S.blocks.length) {
        list.innerHTML = '<p style="font-size:12px;color:#9ca3af;text-align:center;padding:20px;">Sin capas aún</p>';
        return;
    }
    
    list.innerHTML = '';
    [...S.blocks].reverse().forEach(b => {
        const row = document.createElement('div');
        row.className = 'layer-row' + (S.selected === b.id ? ' active' : '');
        row.innerHTML = `
            <span class="li"><i class="fas fa-square-full" style="font-size:7px;"></i></span>
            <span class="ln">${typeLabel(b.type)}</span>
            <div class="la">
                <button class="la-btn" onclick="dupBlock(${b.id})" title="Duplicar"><i class="fas fa-copy"></i></button>
                <button class="la-btn" onclick="delBlock(${b.id})" title="Eliminar"><i class="fas fa-times"></i></button>
            </div>
        `;
        row.addEventListener('click', e => {
            if (!e.target.closest('.la-btn')) selectBlock(b.id);
        });
        list.appendChild(row);
    });
}

function updateStatus() {
    const n = S.blocks.length;
    document.getElementById('sb-el').textContent = `${n} elemento${n !== 1 ? 's' : ''}`;
}

// ============================================
// HISTORIAL
// ============================================

function saveHistory() {
    const snap = JSON.stringify(S.blocks.map(b => ({
        ...b,
        content: JSON.parse(JSON.stringify(b.content)),
        styles: { ...b.styles }
    })));
    
    S.history = S.history.slice(0, S.histIdx + 1);
    S.history.push(snap);
    S.histIdx = S.history.length - 1;
    
    document.getElementById('btn-undo').disabled = S.histIdx <= 0;
    document.getElementById('btn-redo').disabled = S.histIdx >= S.history.length - 1;
}

function undo() {
    if (S.histIdx <= 0) return;
    S.histIdx--;
    S.blocks = JSON.parse(S.history[S.histIdx]);
    S.selected = null;
    renderCanvas();
    renderPanel();
    updateSidebars();
    updateStatus();
    toast('Deshecho');
}

function redo() {
    if (S.histIdx >= S.history.length - 1) return;
    S.histIdx++;
    S.blocks = JSON.parse(S.history[S.histIdx]);
    S.selected = null;
    renderCanvas();
    renderPanel();
    updateSidebars();
    updateStatus();
    toast('Rehecho');
}

// ============================================
// DISPOSITIVOS Y UTILIDADES
// ============================================

function setDevice(d) {
    S.device = d;
    const page = document.getElementById('canvas-page');
    page.className = `w-${d}`;
    
    const labels = { desktop: '1100px · Escritorio', tablet: '768px · Tablet', mobile: '390px · Móvil' };
    document.getElementById('sb-dev').textContent = labels[d];
    
    document.querySelectorAll('.device-btn').forEach(b => b.classList.toggle('active', b.dataset.device === d));
}

function toast(msg, type = '') {
    const c = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(() => el.remove(), 2900);
}

// ============================================
// PLANTILLAS
// ============================================

const TMPLS = [
    // NEGOCIOS
    { name: 'Startup Tech', icon: '🚀', desc: 'Landing page moderna para startups', blocks: ['navbar', 'hero', 'badges', 'cards_enhanced', 'pricing', 'testimonial', 'footer'], premium: false, category: 'negocios' },
    { name: 'Consultoría', icon: '📊', desc: 'Para consultores y servicios B2B', blocks: ['navbar', 'hero', 'stats', 'testimonial', 'grid2', 'form', 'footer'], premium: false, category: 'negocios' },
    { name: 'Agencia Creativa', icon: '🎨', desc: 'Portafolio para agencias', blocks: ['navbar', 'hero', 'gallery', 'cards_enhanced', 'testimonial', 'footer'], premium: true, category: 'negocios' },
    
    // E-COMMERCE
    { name: 'Tienda Online', icon: '🛍️', desc: 'E-commerce con productos', blocks: ['navbar', 'hero', 'cards_enhanced', 'gallery', 'pricing', 'footer'], premium: false, category: 'ecommerce' },
    { name: 'Landing de Producto', icon: '📱', desc: 'Lanzamiento de producto', blocks: ['navbar', 'hero', 'cards_enhanced', 'testimonial', 'form', 'footer'], premium: false, category: 'ecommerce' },
    
    // PORTAFOLIOS
    { name: 'Portafolio Artista', icon: '🖼️', desc: 'Galería para artistas', blocks: ['navbar', 'hero', 'gallery', 'testimonial', 'form', 'footer'], premium: false, category: 'creativo' },
    { name: 'Fotógrafo', icon: '📸', desc: 'Muestra tu trabajo', blocks: ['navbar', 'hero', 'gallery', 'cards_enhanced', 'footer'], premium: true, category: 'creativo' },
    
    // BLOG
    { name: 'Blog Personal', icon: '📝', desc: 'Para escritores', blocks: ['navbar', 'hero', 'text', 'cards_enhanced', 'quote', 'footer'], premium: false, category: 'blog' },
    
    // EDUCACIÓN
    { name: 'Curso Online', icon: '🎓', desc: 'Landing para cursos', blocks: ['navbar', 'hero', 'pricing', 'testimonial', 'form', 'footer'], premium: false, category: 'educacion' },
    
    // SALUD
    { name: 'Gimnasio', icon: '💪', desc: 'Para centros deportivos', blocks: ['navbar', 'hero', 'pricing', 'testimonial', 'footer'], premium: false, category: 'salud' },
    
    // RESTAURANTES
    { name: 'Restaurante', icon: '🍽️', desc: 'Carta y reservas', blocks: ['navbar', 'hero', 'gallery', 'cards_enhanced', 'form', 'footer'], premium: true, category: 'restaurante' },
    
    // INMOBILIARIA
    { name: 'Inmobiliaria', icon: '🏠', desc: 'Propiedades', blocks: ['navbar', 'hero', 'cards_enhanced', 'gallery', 'form', 'footer'], premium: true, category: 'inmobiliaria' },
];

function renderTemplates() {
    const c = document.getElementById('templates-container');
    if (!c) return;
    
    c.innerHTML = '';
    TMPLS.forEach(t => {
        const el = document.createElement('div');
        el.style.cssText = 'background:white;border:1.5px solid #f3f4f6;border-radius:12px;overflow:hidden;cursor:pointer;transition:all 0.15s;';
        el.innerHTML = `
            <div style="height:80px;background:linear-gradient(135deg,#f5f3ff,#ede9fe,#fce7f3);display:flex;align-items:center;justify-content:center;font-size:32px;">
                ${t.icon}
            </div>
            <div style="padding:10px 12px;">
                <div style="font-size:13px;font-weight:700;color:#1f2937;margin-bottom:2px;">${t.name}</div>
                <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${t.desc}</div>
                <button style="width:100%;padding:7px;background:#f5f3ff;color:#7c3aed;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
                    Usar plantilla
                </button>
            </div>
        `;
        
        el.querySelector('button').onclick = () => {
            if (S.blocks.length && !confirm('¿Reemplazar el canvas?')) return;
            S.blocks = [];
            t.blocks.forEach(b => addBlock(b, false));
            toast(`Plantilla "${t.name}" cargada ✓`, 'green');
        };
        
        el.addEventListener('mouseenter', () => el.style.borderColor = '#7c3aed');
        el.addEventListener('mouseleave', () => el.style.borderColor = '#f3f4f6');
        c.appendChild(el);
    });
}

// ============================================
// PANELES DE CONTENIDO PARA TODOS LOS BLOQUES
// ============================================

function renderHeroContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Contenido principal</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Chip / Badge</label>
                    <input type="text" onchange="applyContent('chip',this.value)" value="${c.chip || '✨ Nuevo · Bienvenido'}">
                </div>
                <div class="content-field">
                    <label>Título principal</label>
                    <input type="text" onchange="applyContent('h1',this.value)" value="${c.h1 || 'Crea páginas web increíbles'}">
                </div>
                <div class="content-field">
                    <label>Subtítulo</label>
                    <textarea onchange="applyContent('p',this.value)">${c.p || 'Una descripción clara y concisa que comunica el valor de tu propuesta.'}</textarea>
                </div>
                <div class="content-field">
                    <label>Botón primario</label>
                    <input type="text" onchange="applyContent('btn1',this.value)" value="${c.btn1 || 'Comenzar gratis'}">
                </div>
                <div class="content-field">
                    <label>Botón secundario</label>
                    <input type="text" onchange="applyContent('btn2',this.value)" value="${c.btn2 || 'Ver ejemplos →'}">
                </div>
            </div>
        </div>
    `;
}

function renderTextContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Texto</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Encabezado</label>
                    <input type="text" onchange="applyContent('h2',this.value)" value="${c.h2 || 'Encabezado de sección'}">
                </div>
                <div class="content-field">
                    <label>Párrafo</label>
                    <textarea onchange="applyContent('p',this.value)">${c.p || 'Puedes hacer doble clic para editar este texto directamente en el canvas.'}</textarea>
                </div>
            </div>
        </div>
    `;
}

function renderImageContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Imagen</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div style="margin-bottom:12px;">
                    <img src="${c.src || 'https://picsum.photos/seed/42/1200/500'}" style="width:100%;border-radius:8px;aspect-ratio:16/9;object-fit:cover;">
                </div>
                <button onclick="openFileModal({blockId:${block.id}, fieldKey:'src', mediaType:'image'})" 
                        style="width:100%;padding:10px;background:#7c3aed;color:white;border:none;border-radius:8px;margin-bottom:8px;">
                    <i class="fas fa-upload"></i> ${c.src ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
                <div class="content-field">
                    <label>Texto alternativo</label>
                    <input type="text" onchange="applyContent('alt',this.value)" value="${c.alt || ''}">
                </div>
            </div>
        </div>
    `;
}

function renderNavbarContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Navegación</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Logo / Marca</label>
                    <input type="text" onchange="applyContent('logo',this.value)" value="${c.logo || 'WebCrafter'}">
                </div>
                <div class="content-field">
                    <label>Enlace 1</label>
                    <input type="text" onchange="applyContent('link1',this.value)" value="${c.link1 || 'Inicio'}">
                </div>
                <div class="content-field">
                    <label>Enlace 2</label>
                    <input type="text" onchange="applyContent('link2',this.value)" value="${c.link2 || 'Servicios'}">
                </div>
                <div class="content-field">
                    <label>Enlace 3</label>
                    <input type="text" onchange="applyContent('link3',this.value)" value="${c.link3 || 'Portafolio'}">
                </div>
                <div class="content-field">
                    <label>Botón CTA</label>
                    <input type="text" onchange="applyContent('cta',this.value)" value="${c.cta || 'Empezar →'}">
                </div>
            </div>
        </div>
    `;
}

function renderButtonContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Botones</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Botón primario</label>
                    <input type="text" onchange="applyContent('btn1',this.value)" value="${c.btn1 || 'Acción principal'}">
                </div>
                <div class="content-field">
                    <label>Botón secundario</label>
                    <input type="text" onchange="applyContent('btn2',this.value)" value="${c.btn2 || 'Secundario'}">
                </div>
                <div class="content-field">
                    <label>Botón ghost</label>
                    <input type="text" onchange="applyContent('btn3',this.value)" value="${c.btn3 || 'Ver más →'}">
                </div>
            </div>
        </div>
    `;
}

function renderCardsContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Tarjetas</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                ${[1,2,3].map(i => `
                    <div style="border-bottom:1px solid #f3f4f6;padding-bottom:12px;margin-bottom:12px;">
                        <h4 style="font-size:12px;margin-bottom:8px;">Tarjeta ${i}</h4>
                        <div class="content-field">
                            <label>Ícono</label>
                            <input type="text" onchange="applyContent('icon${i}',this.value)" value="${c['icon'+i] || ['🎨','🚀','⭐'][i-1]}">
                        </div>
                        <div class="content-field">
                            <label>Título</label>
                            <input type="text" onchange="applyContent('title${i}',this.value)" value="${c['title'+i] || 'Característica '+i}">
                        </div>
                        <div class="content-field">
                            <label>Descripción</label>
                            <textarea onchange="applyContent('desc${i}',this.value)">${c['desc'+i] || 'Describe los beneficios clave.'}</textarea>
                        </div>
                        <div class="content-field">
                            <label>Botón</label>
                            <input type="text" onchange="applyContent('cta${i}',this.value)" value="${c['cta'+i] || 'Saber más →'}">
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderGalleryContentPanel(block, body) {
    const c = block.content || {};
    let html = `<div class="prop-sec"><div class="prop-sec-hd" onclick="toggleSec(this)"><span>Galería</span><i class="fas fa-chevron-down"></i></div><div class="prop-sec-body">`;
    
    for (let i = 1; i <= 6; i++) {
        html += `
            <div style="margin-bottom:12px;">
                <label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Imagen ${i}</label>
                <img src="${c['img'+i] || 'https://picsum.photos/seed/'+ (i*11) +'/400/400'}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:4px;">
                <button onclick="openFileModal({blockId:${block.id}, fieldKey:'img${i}', mediaType:'image'})" 
                        style="width:100%;padding:6px;background:#f5f3ff;color:#7c3aed;border:none;border-radius:4px;font-size:11px;">
                    Cambiar imagen ${i}
                </button>
            </div>
        `;
    }
    html += '</div></div>';
    body.innerHTML = html;
}

function renderQuoteContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Cita</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Texto de la cita</label>
                    <textarea onchange="applyContent('quote',this.value)">${c.quote || 'El diseño no es solo cómo se ve o cómo se siente. El diseño es cómo funciona.'}</textarea>
                </div>
                <div class="content-field">
                    <label>Autor</label>
                    <input type="text" onchange="applyContent('author',this.value)" value="${c.author || '— Steve Jobs'}">
                </div>
            </div>
        </div>
    `;
}

function renderBadgesContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Badges</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                ${[1,2,3,4,5].map(i => `
                    <div class="content-field">
                        <label>Badge ${i}</label>
                        <input type="text" onchange="applyContent('b${i}',this.value)" value="${c['b'+i] || ['Nuevo','Activo','Pro','Info','Favorito'][i-1]}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFormContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Formulario</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field">
                    <label>Título</label>
                    <input type="text" onchange="applyContent('h3',this.value)" value="${c.h3 || 'Contáctanos'}">
                </div>
                <div class="content-field">
                    <label>Subtítulo</label>
                    <input type="text" onchange="applyContent('sub',this.value)" value="${c.sub || 'Te respondemos en menos de 24 horas.'}">
                </div>
                <div class="content-field">
                    <label>Campo 1 (label)</label>
                    <input type="text" onchange="applyContent('f1',this.value)" value="${c.f1 || 'Nombre completo'}">
                </div>
                <div class="content-field">
                    <label>Placeholder 1</label>
                    <input type="text" onchange="applyContent('p1',this.value)" value="${c.p1 || 'Tu nombre'}">
                </div>
                <div class="content-field">
                    <label>Botón enviar</label>
                    <input type="text" onchange="applyContent('submit',this.value)" value="${c.submit || 'Enviar mensaje →'}">
                </div>
            </div>
        </div>
    `;
}

function renderPricingContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Plan Básico</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Nombre</label><input type="text" onchange="applyContent('plan1',this.value)" value="${c.plan1 || 'Básico'}"></div>
                <div class="content-field"><label>Precio</label><input type="text" onchange="applyContent('price1',this.value)" value="${c.price1 || '0'}"></div>
            </div>
        </div>
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Plan Pro</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Nombre</label><input type="text" onchange="applyContent('plan2',this.value)" value="${c.plan2 || 'Pro'}"></div>
                <div class="content-field"><label>Precio</label><input type="text" onchange="applyContent('price2',this.value)" value="${c.price2 || '19'}"></div>
            </div>
        </div>
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Plan Empresa</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Nombre</label><input type="text" onchange="applyContent('plan3',this.value)" value="${c.plan3 || 'Empresa'}"></div>
                <div class="content-field"><label>Precio</label><input type="text" onchange="applyContent('price3',this.value)" value="${c.price3 || '49'}"></div>
            </div>
        </div>
    `;
}

function renderTestimonialContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Testimonio 1</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Nombre</label><input type="text" onchange="applyContent('name1',this.value)" value="${c.name1 || 'Ana García'}"></div>
                <div class="content-field"><label>Rol</label><input type="text" onchange="applyContent('role1',this.value)" value="${c.role1 || 'Diseñadora'}"></div>
                <div class="content-field"><label>Testimonio</label><textarea onchange="applyContent('text1',this.value)">${c.text1 || 'Increíble herramienta.'}</textarea></div>
            </div>
        </div>
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Testimonio 2</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Nombre</label><input type="text" onchange="applyContent('name2',this.value)" value="${c.name2 || 'Carlos López'}"></div>
                <div class="content-field"><label>Rol</label><input type="text" onchange="applyContent('role2',this.value)" value="${c.role2 || 'Emprendedor'}"></div>
                <div class="content-field"><label>Testimonio</label><textarea onchange="applyContent('text2',this.value)">${c.text2 || 'La recomiendo ampliamente.'}</textarea></div>
            </div>
        </div>
    `;
}

function renderGrid2ContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Celda 1</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Ícono</label><input type="text" onchange="applyContent('icon1',this.value)" value="${c.icon1 || '⚡'}"></div>
                <div class="content-field"><label>Título</label><input type="text" onchange="applyContent('t1',this.value)" value="${c.t1 || 'Velocidad'}"></div>
                <div class="content-field"><label>Descripción</label><textarea onchange="applyContent('d1',this.value)">${c.d1 || 'Sitios optimizados para la mejor experiencia.'}</textarea></div>
            </div>
        </div>
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Celda 2</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Ícono</label><input type="text" onchange="applyContent('icon2',this.value)" value="${c.icon2 || '🎨'}"></div>
                <div class="content-field"><label>Título</label><input type="text" onchange="applyContent('t2',this.value)" value="${c.t2 || 'Diseño'}"></div>
                <div class="content-field"><label>Descripción</label><textarea onchange="applyContent('d2',this.value)">${c.d2 || 'Interfaz limpia que refleja tu marca.'}</textarea></div>
            </div>
        </div>
    `;
}

function renderFooterContentPanel(block, body) {
    const c = block.content || {};
    body.innerHTML = `
        <div class="prop-sec">
            <div class="prop-sec-hd" onclick="toggleSec(this)"><span>Footer</span><i class="fas fa-chevron-down"></i></div>
            <div class="prop-sec-body">
                <div class="content-field"><label>Marca</label><input type="text" onchange="applyContent('brand',this.value)" value="${c.brand || 'WebCrafter'}"></div>
                <div class="content-field"><label>Descripción</label><textarea onchange="applyContent('desc',this.value)">${c.desc || 'La plataforma más fácil para crear páginas web.'}</textarea></div>
                <div class="content-field"><label>Copyright</label><input type="text" onchange="applyContent('copy',this.value)" value="${c.copy || '© 2025 WebCrafter'}"></div>
            </div>
        </div>
    `;
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderElements();
    renderTemplates()
    initFileLibrary();
    setDevice('desktop');
    
    // Event listeners
    document.querySelectorAll('.s-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.s-nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.s-panel').forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const target = document.getElementById('panel-' + btn.dataset.panel);
            if (target) target.classList.add('active');
        });
    });
    
    document.getElementById('panel-tabs').addEventListener('click', e => {
        const tab = e.target.closest('.ptab');
        if (!tab) return;
        S.activeTab = tab.dataset.tab;
        renderPanel();
    });
    
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.addEventListener('click', () => setDevice(btn.dataset.device));
    });
    
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);
    document.getElementById('btn-preview').addEventListener('click', openPreview);
    document.getElementById('btn-publish').addEventListener('click', () => {
        toast('🚀 Publicando...');
        setTimeout(() => toast('✅ Publicado en webcrafter.app/mi-proyecto', 'green'), 1500);
    });
    
    document.getElementById('el-search').addEventListener('input', e => renderElements(e.target.value));
    
    document.getElementById('img-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('img-modal')) closeImgModal();
    });
    
    document.getElementById('file-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('file-modal')) closeFileModal();
    });
    
    document.addEventListener('keydown', e => {
    const ac = document.activeElement;
    if (ac.tagName === 'INPUT' || ac.tagName === 'TEXTAREA' || ac.isContentEditable) return;
    
    // Deshacer (Ctrl+Z)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { 
        e.preventDefault(); 
        undo(); 
    }
    
    // Rehacer (Ctrl+Y o Ctrl+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { 
        e.preventDefault(); 
        redo(); 
    }
    
    // Duplicar (Ctrl+D)
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') { 
        e.preventDefault(); 
        if (S.selected) dupBlock(S.selected); 
    }
    
    // ESC para deseleccionar/cerrar modales
    if (e.key === 'Escape') { 
        deselectAll(); 
        closeImgModal(); 
        closeFileModal(); 
    }
    
    // 🟢 SUPRIMIR - Versión mejorada (funciona en todos los teclados)
    if ((e.key === 'Delete' || e.key === 'Del') && S.selected) { 
        e.preventDefault();
        delBlock(S.selected); 
    }
});
    
    // Canvas drag & drop
    const canvas = document.getElementById('canvas-page');
    canvas.addEventListener('dragover', onDragOver);
    canvas.addEventListener('dragleave', onDragLeave);
    canvas.addEventListener('drop', onDrop);
    
    toast('Bienvenido a WebCrafter!', 400);
});

window.delBlock = delBlock;
window.dupBlock = dupBlock;
window.selectBlock = selectBlock;
window.deselectAll = deselectAll;
window.handleBgClick = handleBgClick;
window.applyStyle = applyStyle;
window.applyContent = applyContent;
window.toggleSec = toggleSec;
window.openFileModal = openFileModal;
window.closeFileModal = closeFileModal;
window.switchFileTab = switchFileTab;
window.handleFileSelect = handleFileSelect;
window.applySelectedFile = applySelectedFile;
window.applyFileFromUrl = applyFileFromUrl;
window.updateCardField = updateCardField;
window.addNewCard = addNewCard;
window.removeCard = removeCard;
window.openImgModal = openImgModal;
window.closeImgModal = closeImgModal;
window.applyImgUrl = applyImgUrl;
window.handleImgFile = handleImgFile;