/* GRAFIK: fungsi umum penggambar grafik (garis, batang 100%) dan komponen (kartu KPI, dropdown, panel insight). */
function sv(w, h) {
    const s = document.createElementNS(NS, 'svg')
    s.setAttribute('viewBox', '0 0 ' + w + ' ' + h)
    return s
}
function ad(p, t, a, x) {
    const e = document.createElementNS(NS, t)
    for (const k in a) e.setAttribute(k, a[k])
    if (x != null) e.textContent = x
    p.appendChild(e)
    return e
}
const fmt = (v) => Math.round(v * 100) / 100,
    pct = (v) => (v * 100).toFixed(1) + '%'
function kpi(l, v) {
    return '<div class="kpi"><b>' + v + '</b><span>' + l + '</span></div>'
}
function sel(id, opts, key, cb) {
    const s = document.createElement('select')
    opts.forEach((o) => {
        const e = document.createElement('option')
        e.value = o[0]
        e.textContent = o[1]
        s.appendChild(e)
    })
    s.value = S[key]
    s.onchange = () => {
        S[key] = s.value
        cb()
    }
    return s
}
function xt(s, xl, m, W, H, X) {
    let last = ''
    xl.forEach((d, i) => {
        const ym = d.slice(0, 7)
        if (ym !== last && +d.slice(5, 7) % 3 === 1) {
            ad(
                s,
                'text',
                { x: X(i), y: H - 6, class: 't', 'text-anchor': 'middle' },
                ym
            )
        }
        last = ym
    })
}
function line(el, ser, xl, o) {
    o = o || {}
    const W = 640,
        H = 250,
        m = { l: 40, r: 100, t: 10, b: 24 }
    const s = sv(W, H)
    const vs = ser.flatMap((a) => a.v).filter((v) => v != null),
        y0 = o.y0 != null ? o.y0 : 0,
        y1 = o.y1 != null ? o.y1 : Math.ceil(Math.max.apply(null, vs) * 1.1)
    const X = (i) => m.l + (i * (W - m.l - m.r)) / Math.max(xl.length - 1, 1),
        Y = (v) => H - m.b - ((v - y0) / (y1 - y0)) * (H - m.t - m.b)
    for (let k = 0; k <= 4; k++) {
        const v = y0 + ((y1 - y0) * k) / 4
        ad(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'g' })
        ad(
            s,
            'text',
            { x: m.l - 6, y: Y(v) + 4, class: 't', 'text-anchor': 'end' },
            fmt(v)
        )
    }
    xt(s, xl, m, W, H, X)
    ;(o.h || []).forEach((h) => {
        ad(s, 'line', {
            x1: m.l,
            x2: W - m.r,
            y1: Y(h.v),
            y2: Y(h.v),
            stroke: h.c,
            'stroke-dasharray': '4 3',
        })
        ad(
            s,
            'text',
            { x: W - m.r + 4, y: Y(h.v) + 4, class: 'tl', fill: h.c },
            h.n
        )
    })
    ser.forEach((a) => {
        let d = '',
            pen = false
        a.v.forEach((v, i) => {
            if (v == null) {
                pen = false
                return
            }
            d += (pen ? 'L' : 'M') + X(i) + ' ' + Y(v)
            pen = true
        })
        ad(s, 'path', {
            d: d,
            fill: 'none',
            stroke: a.c,
            'stroke-width': a.w || 1.6,
        })
        if (a.n && ser.length === 1) {
            let li = a.v.length - 1
            while (li > 0 && a.v[li] == null) li--
            ad(
                s,
                'text',
                { x: X(li) + 4, y: Y(a.v[li]) + 4, class: 'tl', fill: a.c },
                a.n
            )
        }
    })
    ;(o.pts || []).forEach((p) => {
        ad(s, 'circle', {
            cx: X(p.i),
            cy: Y(p.v),
            r: p.r || 3,
            fill: p.f || 'none',
            stroke: p.c,
            'stroke-width': 1.3,
        }).appendChild(
            Object.assign(document.createElementNS(NS, 'title'), {
                textContent: p.t || '',
            })
        )
    })
    el.innerHTML = ''
    el.appendChild(s)
    if (o.lg) el.insertAdjacentHTML('beforeend', legend(o.lg))
}
function stack(el, ms, cn) {
    const W = 640,
        H = 230,
        m = { l: 36, r: 8, t: 8, b: 24 },
        s = sv(W, H),
        bw = (W - m.l - m.r) / ms.length
    ;[0, 0.5, 1].forEach((v) => {
        const y = H - m.b - v * (H - m.t - m.b)
        ad(s, 'line', { x1: m.l, x2: W - m.r, y1: y, y2: y, class: 'g' })
        ad(
            s,
            'text',
            { x: m.l - 5, y: y + 4, class: 't', 'text-anchor': 'end' },
            v * 100 + '%'
        )
    })
    ms.forEach((mo, i) => {
        const t = cn[i].reduce((a, b) => a + b, 0) || 1
        let y = H - m.b
        cn[i].forEach((c, k) => {
            const h = (c / t) * (H - m.t - m.b)
            y -= h
            ad(s, 'rect', {
                x: m.l + i * bw + 1,
                y: y,
                width: bw - 2,
                height: h,
                fill: C.kat[k],
            }).appendChild(
                Object.assign(document.createElementNS(NS, 'title'), {
                    textContent: mo + ' ' + KN[k] + ': ' + pct(c / t),
                })
            )
        })
        if (i % 3 === 0)
            ad(
                s,
                'text',
                {
                    x: m.l + i * bw + bw / 2,
                    y: H - 6,
                    class: 't',
                    'text-anchor': 'middle',
                },
                mo.slice(2)
            )
    })
    el.innerHTML = ''
    el.appendChild(s)
}
function panel(t) {
    const I = INSIGHTS[t],
        f = (x) =>
            x
                ? '<p>' + x + '</p>'
                : '<p class="ph">Belum diisi. Tulis interpretasi Anda pada bagian INSIGHTS di kode.</p>'
    return (
        '<div class="ins"><h4>Yang ditampilkan</h4><p>' +
        SAY[t] +
        '</p><h4>Artinya (interpretasi bisnis)</h4>' +
        f(I.mean) +
        '<h4>Tindakan yang dapat diambil</h4>' +
        f(I.act) +
        '</div>'
    )
}
const legend = (items) =>
    '<div class="lg">' +
    items
        .map(
            (i) =>
                '<span><i style="background:' +
                i[1] +
                '"></i>' +
                i[0] +
                '</span>'
        )
        .join('') +
    '</div>'
