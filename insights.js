/* ISI SENDIRI: satu-satunya berkas yang perlu Anda edit.
   - INSIGHTS.mean = interpretasi bisnis (apa artinya grafik ini)
   - INSIGHTS.act  = tindakan yang dapat diambil
   Q = pertanyaan bisnis tiap tab, SAY = deskripsi apa yang ditampilkan grafik. */
/* ===== ISI SENDIRI: interpretasi bisnis (Charts mean) dan tindakan (Charts do) untuk tiap tab ===== */
const INSIGHTS = {
    t1: {
        mean: 'Dari rata-rata ISPU maksimum sekitar 73,1 bahwa ada rata-rata bulanan yang telah melewati batas nilai 100 yaitu, yaitu DKI4 dan DKI5 pada Juni 2025 dengan nilai 101,0 dan 101,4',
        act: 'Dari data ini, pihak terkait sebaiknya meningkatkan pemantauan kualitas udara di stasiun-stasiun yang menunjukkan nilai ISPU maksimum yang tinggi, terutama pada bulan-bulan tertentu, untuk mengambil tindakan pencegahan yang diperlukan.',
    },
    t2: {
        mean: 'Berdasarkan data dari model prediksi, semakin besar threshold alarm yang diterapkan, semakin sedikit hari tidak sehat yang terdeteksi, namun juga mengurangi jumlah alarm palsu. Hal ini menunjukkan adanya trade-off antara sensitivitas dan spesifisitas dalam sistem peringatan dini.',
        act: 'Berdasarkan hasil data, pihak terkait sebaiknya menyesuaikan threshold alarm sesuai dengan kebutuhan dan kapasitas respons mereka, serta mempertimbangkan strategi komunikasi yang efektif untuk menginformasikan masyarakat tentang potensi risiko kualitas udara.',
    },
    t3: {
        mean: 'Berdasarkan skor kejanggalan harian dari model Isolation Forest, terdapat beberapa pembacaan yang menunjukkan anomali yang paling banyak ditemukan di stasiun DKI4 dan DKI5, yang dapat mengindikasikan adanya masalah pada stasiun pemantauan atau kondisi lingkungan yang tidak biasa.',
        act: 'Berdasarkan temuan ini, pihak terkait sebaiknya melakukan pemeriksaan lebih lanjut terhadap stasiun-stasiun yang menunjukkan anomali, termasuk kalibrasi peralatan dan analisis kondisi lingkungan sekitar, untuk memastikan keakuratan data dan mengidentifikasi potensi masalah yang mempengaruhi kualitas udara.',
    },
    t4: {
        mean: 'Berdasarkan analisis hubungan antarstasiun, terdapat pola pergerakan polutan yang menunjukkan adanya interaksi antara lokasi-lokasi tertentu. Hal ini dapat memberikan wawasan tentang bagaimana polutan menyebar dan mempengaruhi kualitas udara di berbagai wilayah.',
        act: 'Berdasarkan temuan ini, pihak terkait yaitu pemerintah sebaiknya mempertimbangkan strategi pengelolaan kualitas udara yang lebih terkoordinasi antarstasiun, termasuk pemantauan dan mitigasi polutan di wilayah yang saling berinteraksi, untuk meningkatkan efektivitas upaya pengendalian kualitas udara secara keseluruhan.',
    },
}
const TABS = [
    ['t1', 'Ringkasan Kondisi'],
    ['t2', 'Prediksi dan Peringatan Dini'],
    ['t3', 'Pemantauan Anomali'],
    ['t4', 'Graph: Hubungan dan Perpindahan'],
]
const Q = {
    t1: 'Bagaimana kondisi udara dari waktu ke waktu, dan stasiun mana yang perlu diperhatikan?',
    t2: 'Seberapa banyak alarm yang dapat diterima untuk menangkap hari tidak sehat lebih awal?',
    t3: 'Pembacaan mana yang perlu diperiksa petugas lebih dulu?',
    t4: 'Apakah polutan bergerak serempak antarstasiun, dan berapa lama satu kondisi udara bertahan?',
}
const SAY = {
    t1: 'Rata-rata ISPU maksimum per bulan (garis) dan komposisi kategori harian per bulan (batang 100%) untuk stasiun terpilih.',
    t2: 'Peluang TIDAK SEHAT besok menurut model pada periode uji (Juli sampai November 2025). Titik merah di dasar grafik menandai hari tidak sehat yang sebenarnya. Lingkaran menandai hari yang memicu alarm pada threshold terpilih.',
    t3: 'Skor kejanggalan harian dari model Isolation Forest pada periode uji. Titik merah adalah pembacaan yang melampaui threshold terpilih.',
    t4: 'Jaringan korelasi: tiap titik satu deret (stasiun dan polutan), garis bila korelasi sama dengan atau di atas threshold. Matriks: peluang kategori hari ini berpindah ke kategori besok.',
}
