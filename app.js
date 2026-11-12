/* LOGIKA TAB: r1 = Ringkasan, r2 = Prediksi, r3 = Pemantauan, r4 = Graph; build() menyusun halaman dan kontrol. */
function r1() {
    const e = $('#t1'),
        s = S.s1,
        sts = s === 'ALL' ? ST : [s],
        dt = D.dates
    const ms = [...new Set(dt.map((d) => d.slice(0, 7)))],
        mi = ms.map((m) =>
            dt.map((d, i) => (d.startsWith(m) ? i : -1)).filter((i) => i >= 0)
        )
    let n = 0,
        c = [0, 0, 0],
        sm = 0,
        sn = 0
    sts.forEach((k) =>
        D.daily[k].kat.forEach((v, i) => {
            if (v != null) {
                n++
                c[v]++
            }
            const u = D.daily[k].ispu[i]
            if (u != null) {
                sm += u
                sn++
            }
        })
    )
    e.querySelector('.k').innerHTML =
        kpi('hari-stasiun berlabel', n) +
        kpi('BAIK', pct(c[0] / n)) +
        kpi('SEDANG', pct(c[1] / n)) +
        kpi('TIDAK SEHAT', pct(c[2] / n)) +
        kpi('rata-rata ISPU maksimum', fmt(sm / sn))
    const ser = sts.map((k, j) => ({
        n: k,
        c: C.st[ST.indexOf(k)],
        v: mi.map((ix) => {
            const a = ix.map((i) => D.daily[k].ispu[i]).filter((v) => v != null)
            return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null
        }),
    }))
    line(
        e.querySelector('.c1'),
        ser,
        ms.map((m) => m + '-01'),
        {
            y0: 0,
            lg: ser.length > 1 ? ser.map((a) => [a.n, a.c]) : null,
            h: [
                { v: 50, n: 'BAIK', c: '#3a9d5d' },
                { v: 100, n: 'SEDANG', c: '#d64545' },
            ],
        }
    )
    stack(
        e.querySelector('.c2'),
        ms,
        mi.map((ix) => {
            const a = [0, 0, 0]
            sts.forEach((k) =>
                ix.forEach((i) => {
                    const v = D.daily[k].kat[i]
                    if (v != null) a[v]++
                })
            )
            return a
        })
    )
}
function r2() {
    const e = $('#t2'),
        T = D.test,
        th = S.th2,
        key = S.m2
    const st = (rows, f) => {
        const a = rows.filter(f),
            tp = a.filter((i) => T.y[i] === 2).length,
            pos = T.y.filter((v) => v === 2).length
        return {
            a: a.length,
            tp: tp,
            r: tp / pos,
            p: a.length ? tp / a.length : 0,
        }
    }
    const ix = T.y.map((_, i) => i),
        m = st(ix, (i) => T[key][i] >= th),
        b = st(ix, (i) => T.pers[i] === 2)
    e.querySelector('.k').innerHTML =
        kpi('alarm (model)', m.a) +
        kpi(
            'hari tidak sehat tertangkap',
            m.tp + ' dari ' + T.y.filter((v) => v === 2).length
        ) +
        kpi('recall', pct(m.r)) +
        kpi('precision', pct(m.p)) +
        kpi('pembanding persistensi: recall', pct(b.r)) +
        kpi('pembanding persistensi: precision', pct(b.p))
    const rows = ix.filter((i) => T.st[i] === S.s2),
        xl = rows.map((i) => T.date[i])
    line(
        e.querySelector('.c1'),
        [{ c: '#2f6fdd', v: rows.map((i) => T[key][i]) }],
        xl,
        {
            y0: 0,
            y1: 1,
            h: [{ v: th, n: 'threshold', c: '#d64545' }],
            pts: rows
                .map((i, j) =>
                    T.y[i] === 2
                        ? {
                              i: j,
                              v: 0.015,
                              c: '#d64545',
                              f: '#d64545',
                              r: 2.6,
                              t: xl[j] + ': tidak sehat (aktual)',
                          }
                        : null
                )
                .filter(Boolean)
                .concat(
                    rows
                        .map((i, j) =>
                            T[key][i] >= th
                                ? {
                                      i: j,
                                      v: T[key][i],
                                      c: '#d64545',
                                      r: 4,
                                      t: xl[j] + ': alarm',
                                  }
                                : null
                        )
                        .filter(Boolean)
                ),
        }
    )
    const mx = Math.max.apply(
        null,
        D.models.map((x) => x.f1)
    )
    e.querySelector('.c2').innerHTML =
        '<table><tr><th>Model</th><th>Akurasi</th><th>Macro F1</th><th>Recall TIDAK SEHAT</th></tr>' +
        D.models
            .map(
                (x) =>
                    '<tr><td>' +
                    x.model +
                    '</td>' +
                    [x.akurasi, x.f1, x.rec]
                        .map(
                            (v) =>
                                '<td><span class="bar" style="width:' +
                                Math.round(v * 70) +
                                'px"></span>' +
                                v.toFixed(3) +
                                '</td>'
                        )
                        .join('') +
                    '</tr>'
            )
            .join('') +
        '</table>'
}
function r3() {
    const e = $('#t3'),
        A = D.anom,
        th = S.th3
    const fl = A.skor.map((v, i) => (v > th ? i : -1)).filter((i) => i >= 0)
    e.querySelector('.k').innerHTML =
        kpi('pembacaan diperiksa', A.skor.length) +
        kpi('ditandai janggal', fl.length) +
        kpi('proporsi ditandai', pct(fl.length / A.skor.length))
    const rows = A.st.map((_, i) => i).filter((i) => A.st[i] === S.s3),
        xl = rows.map((i) => A.date[i])
    line(
        e.querySelector('.c1'),
        [{ c: '#2f6fdd', v: rows.map((i) => A.skor[i]), w: 1.2 }],
        xl,
        {
            y0: -0.2,
            y1: 0.3,
            h: [{ v: th, n: 'threshold', c: '#d64545' }],
            pts: rows
                .map((i, j) =>
                    A.skor[i] > th
                        ? {
                              i: j,
                              v: A.skor[i],
                              c: '#d64545',
                              f: '#d64545',
                              r: 3.2,
                              t: xl[j] + ': skor ' + A.skor[i],
                          }
                        : null
                )
                .filter(Boolean),
        }
    )
    const top = A.skor
        .map((v, i) => i)
        .sort((a, b) => A.skor[b] - A.skor[a])
        .slice(0, 10)
    e.querySelector('.c2').innerHTML =
        '<table><tr><th>Tanggal</th><th>Stasiun</th><th>Skor</th>' +
        D.meta.polutan.map((p) => '<th>z ' + PN[p] + '</th>').join('') +
        '</tr>' +
        top
            .map(
                (i) =>
                    '<tr><td>' +
                    A.date[i] +
                    '</td><td>' +
                    A.st[i] +
                    '</td><td>' +
                    A.skor[i] +
                    '</td>' +
                    A.z[i]
                        .map(
                            (z) =>
                                '<td' +
                                (Math.abs(z) >= 2
                                    ? ' style="color:#d64545;font-weight:600"'
                                    : '') +
                                '>' +
                                z +
                                '</td>'
                        )
                        .join('') +
                    '</tr>'
            )
            .join('') +
        '</table>'
}
function r4() {
    const e = $('#t4'),
        G = D.graphA,
        N = G.nodes,
        th = S.gth,
        W = 560,
        H = 420,
        s = sv(W, H),
        deg = N.map(() => 0),
        E = []
    for (let i = 0; i < N.length; i++)
        for (let j = i + 1; j < N.length; j++) {
            const r = G.corr[i][j]
            if (r != null && r >= th) {
                E.push([i, j, r])
                deg[i]++
                deg[j]++
            }
        }
    const P = (i) => [30 + N[i].x * (W - 60), 30 + N[i].y * (H - 60)],
        cm = G.comm[String(th)]
    E.forEach((x) => {
        const a = P(x[0]),
            b = P(x[1])
        ad(s, 'line', {
            x1: a[0],
            y1: a[1],
            x2: b[0],
            y2: b[1],
            stroke: '#8a94a0',
            'stroke-opacity': 0.25 + (0.5 * (x[2] - th)) / (1 - th + 1e-9),
            'stroke-width': 1.2,
        })
    })
    N.forEach((n, i) => {
        const p = P(i),
            c =
                S.gcol === 'pol'
                    ? C.pol[n.pol]
                    : cm[i] < 0
                      ? '#999'
                      : C.cm[cm[i] % C.cm.length]
        const ci = ad(s, 'circle', {
            cx: p[0],
            cy: p[1],
            r: 4 + deg[i] * 0.9,
            fill: c,
            stroke: 'var(--bg)',
            'stroke-width': 1,
        })
        ci.appendChild(
            Object.assign(document.createElementNS(NS, 'title'), {
                textContent:
                    n.st +
                    ' ' +
                    PN[n.pol] +
                    ': terhubung ke ' +
                    deg[i] +
                    ' titik',
            })
        )
        ad(
            s,
            'text',
            {
                x: p[0],
                y: p[1] - 8 - deg[i] * 0.5,
                class: 't',
                'text-anchor': 'middle',
                'font-size': 9,
            },
            n.st.slice(3) + PN[n.pol]
        )
    })
    e.querySelector('.k').innerHTML =
        kpi('titik', N.length) +
        kpi('garis', E.length) +
        kpi('jumlah komunitas', new Set(cm.filter((v) => v >= 0)).size)
    e.querySelector('.c1').innerHTML = ''
    e.querySelector('.c1').appendChild(s)
    e.querySelector('.lg1').innerHTML =
        S.gcol === 'pol'
            ? legend(Object.keys(PN).map((k) => [PN[k], C.pol[k]]))
            : '<span>Satu warna = satu komunitas (kelompok titik yang lebih rapat terhubung)</span>'
    const B = D.graphB,
        w = 330,
        h = 250,
        m = sv(w, h)
    B.labels.forEach((l, j) => {
        ad(
            m,
            'text',
            { x: 92 + j * 80 + 40, y: 30, class: 't', 'text-anchor': 'middle' },
            l
        )
        ad(
            m,
            'text',
            { x: 84, y: 62 + j * 60, class: 't', 'text-anchor': 'end' },
            l
        )
    })
    B.prob.forEach((r, i) =>
        r.forEach((v, j) => {
            ad(m, 'rect', {
                x: 92 + j * 80,
                y: 40 + i * 60,
                width: 76,
                height: 54,
                fill: C.kat[j],
                'fill-opacity': 0.12 + 0.85 * v,
                rx: 4,
            })
            ad(
                m,
                'text',
                {
                    x: 92 + j * 80 + 38,
                    y: 72 + i * 60,
                    'text-anchor': 'middle',
                    class: 'tl',
                    fill: 'var(--ink)',
                    'font-weight': 600,
                },
                pct(v)
            )
        })
    )
    ad(
        m,
        'text',
        { x: 92, y: 240, class: 't' },
        'baris = hari ini, kolom = besok'
    )
    e.querySelector('.c2').innerHTML = ''
    e.querySelector('.c2').appendChild(m)
    e.querySelector('.d2').innerHTML =
        '<table><tr><th>Kategori</th><th>Peluang bertahan</th><th>Perkiraan lama episode</th></tr>' +
        B.labels
            .map(
                (l, i) =>
                    '<tr><td>' +
                    l +
                    '</td><td>' +
                    pct(B.prob[i][i]) +
                    '</td><td>' +
                    fmt(1 / (1 - B.prob[i][i])) +
                    ' hari</td></tr>'
            )
            .join('') +
        '</table>'
}
function build() {
    const nav = $('#nav'),
        main = $('#main')
    TABS.forEach((t, i) => {
        const b = document.createElement('button')
        b.textContent = t[1]
        b.setAttribute('role', 'tab')
        b.setAttribute('aria-selected', i === 0)
        b.onclick = () => show(t[0])
        b.id = 'b' + t[0]
        nav.appendChild(b)
        const s = document.createElement('section')
        s.id = t[0]
        s.className = i === 0 ? 'on' : ''
        s.innerHTML =
            '<p class="q">' +
            Q[t[0]] +
            '</p><div class="row ctl"></div><div class="row k"></div>' +
            (t[0] === 't4'
                ? '<div class="grid"><div class="card"><h3>Jaringan korelasi stasiun dan polutan</h3><div class="lg1"></div><div class="c1"></div></div><div class="card"><h3>Peluang perpindahan kategori</h3><div class="c2"></div><div class="d2"></div></div></div>'
                : '<div class="grid"><div class="card"><h3>' +
                  {
                      t1: 'Rata-rata ISPU maksimum per bulan',
                      t2: 'Peluang tidak sehat besok',
                      t3: 'Skor kejanggalan harian',
                  }[t[0]] +
                  '</h3><div class="c1"></div>' +
                  (t[0] === 't1'
                      ? '<h3 style="margin-top:10px">Komposisi kategori per bulan</h3><div class="c2"></div>' +
                        legend(KN.map((k, j) => [k, C.kat[j]]))
                      : '') +
                  '</div>' +
                  (t[0] === 't1'
                      ? ''
                      : '<div class="card"><h3>' +
                        {
                            t2: 'Perbandingan model pada data uji',
                            t3: 'Sepuluh pembacaan paling janggal',
                        }[t[0]] +
                        '</h3><div class="c2"></div></div>') +
                  '</div>') +
            panel(t[0])
        main.appendChild(s)
    })
    const L = (t, x) => {
        const l = document.createElement('label')
        l.textContent = t
        l.appendChild(x)
        return l
    }
    const so = [['ALL', 'Semua stasiun']].concat(ST.map((s) => [s, s])),
        sn = ST.map((s) => [s, s])
    $('#t1 .ctl').append(L('Stasiun', sel('s1', so, 's1', r1)))
    const sl = (k, min, max, step, cb, lab) => {
        const i = document.createElement('input')
        i.type = 'range'
        i.min = min
        i.max = max
        i.step = step
        i.value = S[k]
        const o = document.createElement('b')
        o.textContent = ' ' + S[k]
        i.oninput = () => {
            S[k] = +i.value
            o.textContent = ' ' + S[k]
            cb()
        }
        const l = L(lab, i)
        l.appendChild(o)
        return l
    }
    $('#t2 .ctl').append(
        L('Stasiun', sel('s2', sn, 's2', r2)),
        L(
            'Model',
            sel(
                'm2',
                [
                    ['p_rf', 'Random Forest'],
                    ['p_hgb', 'Hist Gradient Boosting'],
                    ['p_lr', 'Logistic Regression'],
                ],
                'm2',
                r2
            )
        ),
        sl('th2', 0.1, 0.9, 0.05, r2, 'Threshold alarm')
    )
    $('#t3 .ctl').append(
        L('Stasiun', sel('s3', sn, 's3', r3)),
        sl('th3', -0.1, 0.2, 0.01, r3, 'Threshold skor')
    )
    $('#t4 .ctl').append(
        sl('gth', 0.4, 0.8, 0.1, r4, 'Threshold korelasi'),
        L(
            'Warna titik',
            sel(
                'gcol',
                [
                    ['pol', 'Menurut polutan'],
                    ['com', 'Menurut komunitas'],
                ],
                'gcol',
                r4
            )
        )
    )
    r1()
    r2()
    r3()
    r4()
}
function show(t) {
    document
        .querySelectorAll('section')
        .forEach((s) => s.classList.toggle('on', s.id === t))
    TABS.forEach((x) =>
        $('#b' + x[0]).setAttribute('aria-selected', x[0] === t)
    )
}
build()
