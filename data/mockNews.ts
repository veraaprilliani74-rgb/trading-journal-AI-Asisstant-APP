import { MarketNews } from '../types';

export const mockNews: MarketNews[] = [
  {
    id: '1',
    headline: 'Dolar AS Melonjak Saat The Fed Mengisyaratkan Jadwal Tapering Lebih Cepat',
    summary: 'Federal Reserve memberi sinyal akan mempercepat pengurangan pembelian aset sebagai respons terhadap inflasi yang persisten, mengirim Indeks Dolar AS (DXY) ke level tertinggi 16 bulan. Pasar sekarang memperkirakan kenaikan suku bunga potensial pada Q2 2025.',
    source: 'Reuters',
    timestamp: '5 menit lalu',
    imageUrl: 'https://images.unsplash.com/photo-1622630965773-1a28a996b758?q=80&w=1170&auto=format&fit=crop',
    tags: ['Forex', 'Fed', 'USD', 'Inflasi'],
  },
  {
    id: '2',
    headline: 'Harga Emas Anjlok di Bawah Dukungan $2000 di Tengah Sikap Hawkish The Fed',
    summary: 'Emas jatuh tajam, menembus level psikologis utama $2000 per ons. Penurunan ini dipicu oleh dolar yang lebih kuat dan imbal hasil Treasury yang naik, yang mengurangi daya tarik logam mulia yang tidak memberikan imbal hasil ini bagi investor.',
    source: 'Bloomberg',
    timestamp: '30 menit lalu',
    imageUrl: 'https://images.unsplash.com/photo-1640232147035-82a1f1146a48?q=80&w=1170&auto=format&fit=crop',
    tags: ['Komoditas', 'Emas', 'XAUUSD'],
  },
  {
    id: '3',
    headline: 'OPEC+ Setuju Kenaikan Produksi Minyak Sederhana di Tengah Kekhawatiran Pasokan',
    summary: 'OPEC dan sekutunya telah menyetujui kenaikan kecil lainnya dalam produksi minyak, tetap pada rencana mereka meskipun ada seruan dari konsumen utama untuk lebih banyak pasokan guna menekan harga. Harga minyak mentah WTI tetap fluktuatif setelah pengumuman tersebut.',
    source: 'Associated Press',
    timestamp: '1 jam lalu',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1675700238054-94b28186f212?q=80&w=1170&auto=format&fit=crop',
    tags: ['Minyak', 'OPEC', 'Energi'],
  },
  {
    id: '4',
    headline: 'Bitcoin Pulih dari Level Terendah Akhir Pekan, Namun Hambatan Regulasi Tetap Ada',
    summary: 'Bitcoin telah pulih ke level $68.000 setelah aksi jual akhir pekan. Namun, pasar kripto tetap tegang di tengah pengawasan ketat dari regulator global, dengan SEC dilaporkan menyelidiki beberapa platform pinjaman DeFi.',
    source: 'CoinDesk',
    timestamp: '2 jam lalu',
    imageUrl: 'https://images.unsplash.com/photo-1641843231037-975c316183e8?q=80&w=1170&auto=format&fit=crop',
    tags: ['Kripto', 'Bitcoin', 'Regulasi'],
  },
];
