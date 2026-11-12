/* KONFIGURASI: warna, nama kategori dan polutan, serta state kontrol (stasiun, threshold, dst). */
const NS = 'http://www.w3.org/2000/svg',
    $ = (s) => document.querySelector(s)
const C = {
    pol: {
        pm10: '#8c6d5a',
        pm25: '#d64545',
        so2: '#e08a1e',
        co: '#5b6f82',
        o3: '#3a9d5d',
        no2: '#2f7fd1',
    },
    kat: ['#3a9d5d', '#e8b923', '#d64545'],
    st: ['#2f6fdd', '#e08a1e', '#3a9d5d', '#a14fb8', '#5b6f82'],
    cm: [
        '#2f6fdd',
        '#e08a1e',
        '#3a9d5d',
        '#a14fb8',
        '#5b6f82',
        '#c0a000',
        '#d64545',
        '#2f7fd1',
        '#8c6d5a',
        '#999',
    ],
}
const KN = ['BAIK', 'SEDANG', 'TIDAK SEHAT'],
    ST = D.meta.stasiun,
    PN = {
        pm10: 'PM10',
        pm25: 'PM2.5',
        so2: 'SO₂',
        co: 'CO',
        o3: 'O₃',
        no2: 'NO₂',
    }
const S = {
    s1: 'ALL',
    s2: 'DKI1',
    m2: 'p_rf',
    th2: 0.5,
    s3: 'DKI1',
    th3: 0,
    gth: 0.6,
    gcol: 'pol',
}
