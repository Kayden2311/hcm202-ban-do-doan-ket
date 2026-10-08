// Bản Đồ Đoàn Kết Lịch Sử — Tư Tưởng Hồ Chí Minh (HCM202)
// Tuân thủ 100% tài liệu Style Guide:
// - Bảng màu: #08131a, #101d23, #203941, #50676d, #b69455, #dfbd79, #a8d7d1
// - Bản đồ thế giới độ phân giải cao 50m (Natural Earth), không phụ thuộc tile server
// - Lãnh thổ Việt Nam độc lập trọn vẹn (không bị đè hay gọt mất ở góc nhìn quốc tế)

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. BẢNG MÀU CHUẨN XÁC THEO STYLE GUIDE (MỤC 2)
    // ---------------------------------------------------------
    const STYLE = {
        mapBg: '#0e1b22',            // Nền vùng bản đồ (Xanh than thẫm)
        land: '#1f3842',             // Đất liền (Xanh đá tối sắc nét, tương phản chuẩn với đại dương)
        border: '#789fa9',           // Đường biên quốc gia (Xám xanh sáng rõ nét)
        borderGlow: '#4a7c88',       // Hào quang đường biên đất liền (Xanh đá sáng phát quang)
        solidarityFill: '#164850',   // Quốc gia bạn bè năm châu (Cyan sâu sang trọng)
        solidarityBorder: '#2dd4bf', // Viền quốc gia bạn bè (Cyan rực rỡ)
        vnFill: '#d4af37',           // Nhấn lãnh thổ Việt Nam (Vàng kim rực rỡ, ấm áp phát quang)
        vnAccent: '#dfbd79',         // Viền/điểm nhấn Việt Nam (Vàng champagne)
        markerNat: '#ff3b47',        // Marker trong nước (Đỏ Ruby - tương phản cao với vàng)
        markerInt: '#ff3b47',        // Marker quốc tế (Đỏ Ruby - tương phản cao với xanh ngọc)
        textMain: '#edf0e8',         // Chữ chính (Trắng ngà)
        textMuted: '#a1aaa7',        // Chữ phụ (Xám bạc)
        divider: 'rgba(226, 233, 221, .12)' // Đường phân cách
    };

    // Danh sách quốc gia bạn bè năm châu trong tư liệu lịch sử
    const SOLIDARITY_COUNTRIES = [
        'United States of America', 'Russia', 'Cuba', 'France',
        'United Kingdom', 'Sweden', 'Senegal', 'Indonesia', 'Argentina'
    ];

    // ---------------------------------------------------------
    // 2. KHỞI TẠO BẢN ĐỒ VECTOR (100% OFFLINE, KHÔNG DÙNG TILE API)
    // ---------------------------------------------------------
    const map = new maplibregl.Map({
        container: 'map-container',
        style: {
            version: 8,
            sources: {
                // Toàn bộ các quốc gia thế giới (Natural Earth 50m chi tiết cao)
                'world-geo': {
                    type: 'geojson',
                    data: 'assets/geo/world_clean.geojson',
                    generateId: true
                },
                // Lãnh thổ Việt Nam chi tiết gồm 63 tỉnh thành + Quần đảo Hoàng Sa & Trường Sa
                'vietnam-geo': {
                    type: 'geojson',
                    data: 'assets/geo/vietnam_clean.geojson',
                    generateId: true
                },
                // Đường biên giới quốc gia toàn vẹn Việt Nam (Đất liền + Hải đảo, thống nhất không chia cắt)
                'vietnam-boundary': {
                    type: 'geojson',
                    data: 'assets/geo/vietnam_boundary_clean.geojson'
                },
                // Mạng lưới các tuyến đoàn kết từ Hà Nội vươn ra 5 châu lục
                'solidarity-arcs': {
                    type: 'geojson',
                    data: 'assets/geo/solidarity_arcs.geojson'
                }
            },
            layers: [
                // 1. Nền vùng bản đồ đại dương (#0e1b22 - Xanh than thẫm)
                {
                    id: 'map-background',
                    type: 'background',
                    paint: {
                        'background-color': STYLE.mapBg
                    }
                },
                // 2. Đất liền toàn cầu (#1f3842 - Xanh đá tối chuẩn Style Guide, tương phản cao)
                {
                    id: 'world-continents',
                    type: 'fill',
                    source: 'world-geo',
                    paint: {
                        'fill-color': STYLE.land,
                        'fill-opacity': 1.0
                    }
                },
                // 3. Nền các quốc gia đối tác đoàn kết (Cyan sâu)
                {
                    id: 'world-solidarity-fill',
                    type: 'fill',
                    source: 'world-geo',
                    filter: ['in', ['get', 'NAME'], ['literal', SOLIDARITY_COUNTRIES]],
                    layout: {
                        'visibility': 'none'
                    },
                    paint: {
                        'fill-color': '#1a4e58',
                        'fill-opacity': 0.72
                    }
                },
                // 4A. Hào quang phát sáng dịu nhẹ viền đất liền và biên giới toàn cầu (Tắt mặc định để bản đồ không bị glow tràn lan)
                {
                    id: 'world-borders-glow',
                    type: 'line',
                    source: 'world-geo',
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': STYLE.borderGlow,
                        'line-width': [
                            'interpolate', ['linear'], ['zoom'],
                            1, 2.5,
                            3, 3.8,
                            6, 5.0
                        ],
                        'line-blur': 2.5,
                        'line-opacity': 0.65
                    }
                },
                // 4B. Đường biên quốc gia toàn cầu (Sắc nét, rõ ràng ở mọi mức zoom, bo tròn)
                {
                    id: 'world-borders',
                    type: 'line',
                    source: 'world-geo',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': STYLE.border,
                        'line-width': [
                            'interpolate', ['linear'], ['zoom'],
                            1, 1.1,
                            3, 1.35,
                            6, 1.8
                        ],
                        'line-opacity': 0.95
                    }
                },
                // 5A. Hào quang phát sáng dịu của biên giới các quốc gia bạn bè năm châu (Luminous Cyan Glow mềm mại)
                {
                    id: 'world-solidarity-glow',
                    type: 'line',
                    source: 'world-geo',
                    filter: ['in', ['get', 'NAME'], ['literal', SOLIDARITY_COUNTRIES]],
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#2dd4bf',
                        'line-width': [
                            'interpolate', ['linear'], ['zoom'],
                            1, 4.5,
                            4, 7.5
                        ],
                        'line-blur': 3.5,
                        'line-opacity': 0.85
                    }
                },
                // 5B. Viền lõi sáng sắc nét của các quốc gia bạn bè năm châu (Luminous Cyan Core)
                {
                    id: 'world-solidarity-borders',
                    type: 'line',
                    source: 'world-geo',
                    filter: ['in', ['get', 'NAME'], ['literal', SOLIDARITY_COUNTRIES]],
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#e2fcf9',
                        'line-width': [
                            'interpolate', ['linear'], ['zoom'],
                            1, 1.8,
                            4, 2.4
                        ],
                        'line-opacity': 1.0
                    }
                },
                // 6. Tuyến kết nối đoàn kết quốc tế (Hiển thị ở góc nhìn Bạn bè năm châu)
                {
                    id: 'solidarity-arcs-glow',
                    type: 'line',
                    source: 'solidarity-arcs',
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': STYLE.vnAccent,
                        'line-width': 3.0,
                        'line-opacity': 0.45,
                        'line-blur': 2.5
                    }
                },
                {
                    id: 'solidarity-arcs-main',
                    type: 'line',
                    source: 'solidarity-arcs',
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': STYLE.vnAccent,
                        'line-width': 1.5,
                        'line-opacity': 0.95,
                        'line-dasharray': [4, 3]
                    }
                },
                // 7. Lớp nền đất liền Việt Nam vững chắc
                {
                    id: 'vn-land-base',
                    type: 'fill',
                    source: 'vietnam-geo',
                    paint: {
                        'fill-color': STYLE.land,
                        'fill-opacity': 1.0
                    }
                },
                // 8. Tô nhấn lãnh thổ Việt Nam (Vàng kim ấm áp dịu dàng #d4af37, tỏa sáng ở cả 2 chế độ)
                {
                    id: 'vn-provinces-fill',
                    type: 'fill',
                    source: 'vietnam-geo',
                    paint: {
                        'fill-color': STYLE.vnFill,
                        'fill-opacity': 0.55
                    }
                },
                // 9. Ranh giới tỉnh thành nội bộ Việt Nam (Mảnh dẻ, trang nhã, không gây rối mắt)
                {
                    id: 'vn-province-borders',
                    type: 'line',
                    source: 'vietnam-geo',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#dfbd79',
                        'line-width': 0.6,
                        'line-opacity': 0.35
                    }
                },
                // 10A. Hào quang biên giới quốc gia toàn vẹn Việt Nam (Chỉ kích hoạt khi mở Ba Đình thống nhất non sông)
                {
                    id: 'vn-national-glow',
                    type: 'line',
                    source: 'vietnam-boundary',
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#dfbd79',
                        'line-width': [
                            'interpolate', ['linear'], ['zoom'],
                            1, 4.0,
                            3, 5.2,
                            6, 7.0
                        ],
                        'line-blur': 3.2,
                        'line-opacity': 0.85
                    }
                },
                // 10B. VIỀN LÕI CHỦ QUYỀN VIỆT NAM SẮC NÉT (Vàng sáng ấm áp, liền mạch toàn bộ biên giới đất liền & hải đảo)
                {
                    id: 'vn-national-core',
                    type: 'line',
                    source: 'vietnam-boundary',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#fff4cc',
                        'line-width': [
                            'interpolate', ['linear'], ['zoom'],
                            1, 1.5,
                            3, 1.8,
                            6, 2.3
                        ],
                        'line-opacity': 1.0
                    }
                },
                // 11A. Hào quang phát sáng viền khu vực đang chọn (Active Region Glow - chỉ bật cho vùng được đề cập)
                {
                    id: 'vn-region-active-glow',
                    type: 'line',
                    source: 'vietnam-geo',
                    filter: ['==', '$id', -1],
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#dfbd79',
                        'line-width': 6.0,
                        'line-blur': 4.0,
                        'line-opacity': 0.95
                    }
                },
                // 11B. Viền lõi trắng sắc nét của khu vực đang chọn
                {
                    id: 'vn-region-active-border',
                    type: 'line',
                    source: 'vietnam-geo',
                    filter: ['==', '$id', -1],
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#ffffff',
                        'line-width': 2.2,
                        'line-opacity': 1.0
                    }
                },
                // 11C. Khối 3D vùng địa lý Việt Nam khi chọn (Khởi tạo ẩn, lọc chính xác theo vùng được đề cập)
                {
                    id: 'vn-region-extrusion',
                    type: 'fill-extrusion',
                    source: 'vietnam-geo',
                    filter: ['==', '$id', -1],
                    layout: {
                        'visibility': 'none'
                    },
                    paint: {
                        'fill-extrusion-color': STYLE.vnAccent,
                        'fill-extrusion-height': 18000,
                        'fill-extrusion-base': 0,
                        'fill-extrusion-opacity': 0.88
                    }
                },
                // 12A. Hào quang phát sáng viền quốc gia quốc tế đang chọn (Active Country Glow - chỉ quốc gia được chọn)
                {
                    id: 'world-country-active-glow',
                    type: 'line',
                    source: 'world-geo',
                    filter: ['==', '$id', -1],
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#2dd4bf',
                        'line-width': 8.0,
                        'line-blur': 5.0,
                        'line-opacity': 0.95
                    }
                },
                // 12B. Viền lõi trắng sắc nét của quốc gia quốc tế đang chọn
                {
                    id: 'world-country-active-border',
                    type: 'line',
                    source: 'world-geo',
                    filter: ['==', '$id', -1],
                    layout: {
                        'visibility': 'none',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#ffffff',
                        'line-width': 2.4,
                        'line-opacity': 1.0
                    }
                },
                // 12C. Khối 3D quốc gia quốc tế khi chọn (Khởi tạo ẩn, lọc duy nhất quốc gia được đề cập)
                {
                    id: 'world-country-extrusion',
                    type: 'fill-extrusion',
                    source: 'world-geo',
                    filter: ['==', '$id', -1],
                    layout: {
                        'visibility': 'none'
                    },
                    paint: {
                        'fill-extrusion-color': '#2dd4bf',
                        'fill-extrusion-height': 16000,
                        'fill-extrusion-base': 0,
                        'fill-extrusion-opacity': 0.85
                    }
                }
            ]
        },
        center: [106.8, 16.2],
        zoom: 5.3,
        pitch: 20, // Độ nghiêng nhẹ nhàng, trang nhã
        bearing: 0,
        antialias: true,
        attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    window.map = map;

    // ---------------------------------------------------------
    // 3. TRẠNG THÁI ỨNG DỤNG
    // ---------------------------------------------------------
    let currentMode = 'national'; // 'national' hoặc 'international'
    let markers = [];
    let islandBadges = [];
    let currentIndex = 0;
    let activePointId = null;
    let activeExtrusionRegion = null;
    let activeCountryId = null;

    let vnFeatureIds = {};
    let worldFeatureIds = {};

    // ---------------------------------------------------------
    // 4. BỘ ĐIỀU KHIỂN ÂM THANH TƯ LIỆU THẬT
    // ---------------------------------------------------------
    const currentAudio = new Audio();
    const btnAudio = document.getElementById('btn-dossier-audio');
    const playIcon = document.getElementById('audio-play-icon');
    const pauseIcon = document.getElementById('audio-pause-icon');
    const audioLabel = document.getElementById('audio-label');
    const eqBars = document.querySelectorAll('.eq-bar');

    btnAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentAudio.paused) {
            currentAudio.play().then(() => {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                eqBars.forEach(b => b.classList.add('playing'));
            }).catch(err => {
                console.warn("Trình duyệt yêu cầu tương tác:", err);
                alert("Vui lòng tương tác với trang để nghe âm thanh tư liệu.");
            });
        } else {
            currentAudio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            eqBars.forEach(b => b.classList.remove('playing'));
        }
    });

    currentAudio.addEventListener('ended', () => {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        eqBars.forEach(b => b.classList.remove('playing'));
    });

    // ---------------------------------------------------------
    // 5. TẢI BẢN ĐỒ: ÁNH XẠ DỮ LIỆU & RENDER KÝ HIỆU
    // ---------------------------------------------------------
    map.on('load', () => {
        initFeatureLookups();
        renderSovereignIslands();
        renderMarkers();
    });

    function initFeatureLookups() {
        // Ánh xạ ranh giới Việt Nam
        fetch('assets/geo/vietnam_clean.geojson')
            .then(r => r.json())
            .then(data => {
                data.features.forEach((f, i) => {
                    const reg = f.properties && f.properties.Region;
                    const name = f.properties && f.properties.Name;
                    if (reg) {
                        if (!vnFeatureIds[reg]) vnFeatureIds[reg] = [];
                        vnFeatureIds[reg].push(i);
                    }
                    if (name) {
                        if (!vnFeatureIds[name]) vnFeatureIds[name] = [];
                        vnFeatureIds[name].push(i);
                    }
                });
            }).catch(e => console.error("Lỗi nạp GeoJSON VN:", e));

        // Ánh xạ các quốc gia thế giới theo trường NAME
        fetch('assets/geo/world_clean.geojson')
            .then(r => r.json())
            .then(data => {
                data.features.forEach((f, i) => {
                    const name = f.properties && f.properties.NAME;
                    const admin = f.properties && f.properties.ADMIN;
                    if (name) worldFeatureIds[name] = i;
                    if (admin && !worldFeatureIds[admin]) worldFeatureIds[admin] = i;
                });
            }).catch(e => console.error("Lỗi nạp GeoJSON thế giới:", e));
    }

    // ---------------------------------------------------------
    // 6. NHÃN HOÀNG SA & TRƯỜNG SA (TUÂN THỦ MỤC 5)
    // "Hoàng Sa và Trường Sa dùng nhãn vàng nhỏ cùng dấu chấm riêng"
    // ---------------------------------------------------------
    function renderSovereignIslands() {
        islandBadges.forEach(b => b.remove());
        islandBadges = [];

        const islands = [
            {
                name: "HOÀNG SA",
                coords: [111.8, 16.5]
            },
            {
                name: "TRƯỜNG SA",
                coords: [114.2, 9.8]
            }
        ];

        islands.forEach(isl => {
            const el = document.createElement('div');
            el.className = 'island-label-badge';
            el.innerHTML = `
                <span class="island-dot"></span>
                <span>${isl.name}</span>
            `;

            const marker = new maplibregl.Marker({
                element: el,
                anchor: 'left',
                offset: [8, 0]
            })
                .setLngLat(isl.coords)
                .addTo(map);

            islandBadges.push(marker);
        });
    }

    // ---------------------------------------------------------
    // 7. RENDER MARKER (VÀNG CHO VIỆT NAM, XANH NGỌC CHO QUỐC TẾ - MỤC 2 & 5)
    // ---------------------------------------------------------
    function renderMarkers() {
        markers.forEach(m => m.marker.remove());
        markers = [];

        const filteredData = window.SOLIDARITY_DATA.filter(d => d.perspective === currentMode);

        filteredData.forEach((point) => {
            const el = document.createElement('div');
            // Gán class phân biệt rõ rệt theo Style Guide
            const typeClass = currentMode === 'national' ? 'marker-national' : 'marker-international';
            el.className = `custom-marker ${typeClass}`;
            
            el.innerHTML = `
                <div class="marker-pulse-outer" data-id="${point.id}">
                    <div class="marker-center-dot"></div>
                </div>
            `;

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([point.coords[1], point.coords[0]])
                .addTo(map);

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                openDossier(point.id);
            });

            markers.push({ id: point.id, marker, pointData: point });
        });
    }

    // ---------------------------------------------------------
    // 8. MỞ PANEL CÂU CHUYỆN & KÍCH HOẠT KHỐI 3D
    // ---------------------------------------------------------
    function openDossier(id) {
        activePointId = id;

        const allData = window.SOLIDARITY_DATA;
        const targetData = allData.find(d => d.id === id);
        if (!targetData) return;

        const filteredData = allData.filter(d => d.perspective === currentMode);
        currentIndex = filteredData.findIndex(d => d.id === id);
        if (currentIndex === -1) currentIndex = 0;

        // Cập nhật trạng thái marker đang chọn (phóng nhẹ và tăng độ sáng theo Mục 5)
        document.querySelectorAll('.custom-marker').forEach(el => el.classList.remove('active-marker'));
        const activeMarkerEl = document.querySelector(`.marker-pulse-outer[data-id="${id}"]`);
        if (activeMarkerEl && activeMarkerEl.parentElement) {
            activeMarkerEl.parentElement.classList.add('active-marker');
        }

        // Đặt lại sạch sẽ toàn bộ trạng thái khối 3D cũ (tất cả 65 tỉnh thành)
        for (let i = 0; i < 65; i++) {
            map.setFeatureState({ source: 'vietnam-geo', id: i }, { active: false });
        }
        if (activeCountryId !== null) {
            map.setFeatureState({ source: 'world-geo', id: activeCountryId }, { active: false });
            activeCountryId = null;
        }

        // Kích hoạt khối 3D TÁCH BIỆT theo từng vùng địa lý hoặc TOÀN QUỐC (Ba Đình - Thống nhất non sông)
        if (targetData.perspective === 'national') {
            // Tắt các lớp khối 3D quốc tế
            if (map.getLayer('world-country-extrusion')) {
                map.setLayoutProperty('world-country-extrusion', 'visibility', 'none');
                map.setFilter('world-country-extrusion', ['==', '$id', -1]);
            }
            if (map.getLayer('world-country-active-glow')) {
                map.setLayoutProperty('world-country-active-glow', 'visibility', 'none');
                map.setFilter('world-country-active-glow', ['==', '$id', -1]);
            }
            if (map.getLayer('world-country-active-border')) {
                map.setLayoutProperty('world-country-active-border', 'visibility', 'none');
                map.setFilter('world-country-active-border', ['==', '$id', -1]);
            }
            if (map.getLayer('world-solidarity-fill')) {
                map.setLayoutProperty('world-solidarity-fill', 'visibility', 'none');
                map.setFilter('world-solidarity-fill', ['==', '$id', -1]);
            }

            if (targetData.regionTarget === 'ToanQuoc' || targetData.id === 'v1_11') {
                // Quảng trường Ba Đình: Khai sinh nước VN Dân chủ Cộng hòa - Kích hoạt TOÀN BỘ 65 tỉnh thành & hải đảo thống nhất
                for (let fid = 0; fid < 65; fid++) {
                    map.setFeatureState({ source: 'vietnam-geo', id: fid }, { active: true });
                }
                activeExtrusionRegion = 'ToanQuoc';
                if (map.getLayer('vn-region-extrusion')) {
                    map.setFilter('vn-region-extrusion', ['!=', ['get', 'Name'], '']);
                    map.setLayoutProperty('vn-region-extrusion', 'visibility', 'visible');
                }
                if (map.getLayer('vn-region-active-glow')) {
                    map.setFilter('vn-region-active-glow', ['!=', ['get', 'Name'], '']);
                    map.setLayoutProperty('vn-region-active-glow', 'visibility', 'visible');
                }
                if (map.getLayer('vn-region-active-border')) {
                    map.setFilter('vn-region-active-border', ['!=', ['get', 'Name'], '']);
                    map.setLayoutProperty('vn-region-active-border', 'visibility', 'visible');
                }
                if (map.getLayer('vn-national-glow')) {
                    map.setLayoutProperty('vn-national-glow', 'visibility', 'visible');
                }
                if (map.getLayer('vn-provinces-fill')) {
                    map.setPaintProperty('vn-provinces-fill', 'fill-color', STYLE.vnFill);
                    map.setPaintProperty('vn-provinces-fill', 'fill-opacity', 0.75);
                }
            } else if (targetData.regionTarget) {
                const reg = targetData.regionTarget;
                if (vnFeatureIds[reg]) {
                    vnFeatureIds[reg].forEach(fid => {
                        map.setFeatureState({ source: 'vietnam-geo', id: fid }, { active: true });
                    });
                }
                activeExtrusionRegion = reg;

                // CHỈ LÀM SÁNG KHU VỰC ĐƯỢC ĐỀ CẬP!
                if (map.getLayer('vn-region-extrusion')) {
                    map.setFilter('vn-region-extrusion', ['==', ['get', 'Region'], reg]);
                    map.setLayoutProperty('vn-region-extrusion', 'visibility', 'visible');
                }
                if (map.getLayer('vn-region-active-glow')) {
                    map.setFilter('vn-region-active-glow', ['==', ['get', 'Region'], reg]);
                    map.setLayoutProperty('vn-region-active-glow', 'visibility', 'visible');
                }
                if (map.getLayer('vn-region-active-border')) {
                    map.setFilter('vn-region-active-border', ['==', ['get', 'Region'], reg]);
                    map.setLayoutProperty('vn-region-active-border', 'visibility', 'visible');
                }
                if (map.getLayer('vn-national-glow')) {
                    map.setLayoutProperty('vn-national-glow', 'visibility', 'none');
                }
                // Các vùng khác giữ màu đất nền tối, CHỈ vùng đang chọn có màu vàng kim sáng
                if (map.getLayer('vn-provinces-fill')) {
                    map.setPaintProperty('vn-provinces-fill', 'fill-color', [
                        'case',
                        ['==', ['get', 'Region'], reg], STYLE.vnFill,
                        STYLE.land
                    ]);
                    map.setPaintProperty('vn-provinces-fill', 'fill-opacity', [
                        'case',
                        ['==', ['get', 'Region'], reg], 0.85,
                        0.2
                    ]);
                }
            }
        } else {
            // Góc nhìn Bạn bè năm châu (quốc tế)
            if (map.getLayer('vn-region-extrusion')) {
                map.setLayoutProperty('vn-region-extrusion', 'visibility', 'none');
                map.setFilter('vn-region-extrusion', ['==', '$id', -1]);
            }
            if (map.getLayer('vn-region-active-glow')) {
                map.setLayoutProperty('vn-region-active-glow', 'visibility', 'none');
                map.setFilter('vn-region-active-glow', ['==', '$id', -1]);
            }
            if (map.getLayer('vn-region-active-border')) {
                map.setLayoutProperty('vn-region-active-border', 'visibility', 'none');
                map.setFilter('vn-region-active-border', ['==', '$id', -1]);
            }

            // VIỆT NAM EXCEPTION: LUÔN TỎA SÁNG TOÀN BỘ VỚI HÀO QUANG VÀNG KIM TRÊN BẢN ĐỒ THẾ GIỚI
            if (map.getLayer('vn-national-glow')) {
                map.setLayoutProperty('vn-national-glow', 'visibility', 'visible');
            }
            if (map.getLayer('vn-national-core')) {
                map.setLayoutProperty('vn-national-core', 'visibility', 'visible');
            }
            if (map.getLayer('vn-provinces-fill')) {
                map.setPaintProperty('vn-provinces-fill', 'fill-color', STYLE.vnFill);
                map.setPaintProperty('vn-provinces-fill', 'fill-opacity', 0.7);
            }

            // CHỈ LÀM SÁNG VÀ NÂNG KHỐI DUY NHẤT QUỐC GIA ĐƯỢC ĐỀ CẬP!
            if (targetData.countryTarget) {
                const country = targetData.countryTarget;
                if (worldFeatureIds[country] !== undefined) {
                    activeCountryId = worldFeatureIds[country];
                    map.setFeatureState({ source: 'world-geo', id: activeCountryId }, { active: true });
                }
                if (map.getLayer('world-country-extrusion')) {
                    map.setFilter('world-country-extrusion', ['==', ['get', 'NAME'], country]);
                    map.setLayoutProperty('world-country-extrusion', 'visibility', 'visible');
                }
                if (map.getLayer('world-country-active-glow')) {
                    map.setFilter('world-country-active-glow', ['==', ['get', 'NAME'], country]);
                    map.setLayoutProperty('world-country-active-glow', 'visibility', 'visible');
                }
                if (map.getLayer('world-country-active-border')) {
                    map.setFilter('world-country-active-border', ['==', ['get', 'NAME'], country]);
                    map.setLayoutProperty('world-country-active-border', 'visibility', 'visible');
                }
                if (map.getLayer('world-solidarity-fill')) {
                    map.setFilter('world-solidarity-fill', ['==', ['get', 'NAME'], country]);
                    map.setLayoutProperty('world-solidarity-fill', 'visibility', 'visible');
                    map.setPaintProperty('world-solidarity-fill', 'fill-color', '#14b8a6');
                    map.setPaintProperty('world-solidarity-fill', 'fill-opacity', 0.65);
                }
            }
        }

        // Di chuyển camera mềm mại (Mục 5: easing mềm)
        const isUnifiedVietnam = targetData.perspective === 'national' && (targetData.regionTarget === 'ToanQuoc' || targetData.id === 'v1_11');
        map.flyTo({
            center: isUnifiedVietnam ? [106.8, 16.2] : [targetData.coords[1], targetData.coords[0]],
            zoom: isUnifiedVietnam ? 5.3 : (targetData.perspective === 'national' ? 6.2 : 4.4),
            pitch: isUnifiedVietnam ? 22 : 28,
            bearing: isUnifiedVietnam ? 0 : (targetData.perspective === 'national' ? 5 : -5),
            duration: 1700,
            essential: true
        });

        // Điền dữ liệu chuẩn format Mục 6
        document.getElementById('dossier-group-time').innerText = targetData.groupTime || 'VIỆT NAM';
        document.getElementById('dossier-title').innerText = targetData.title;
        document.getElementById('dossier-location').innerText = targetData.location || "Việt Nam";
        
        // Ảnh và chú thích
        const imgEl = document.getElementById('dossier-image');
        imgEl.src = targetData.image;
        document.getElementById('dossier-image-caption').innerText = targetData.imageCaption || "Ảnh minh họa";

        // Trích dẫn và nguồn kiểm chứng
        document.getElementById('dossier-quote-text').innerText = `"${targetData.quote}"`;
        document.getElementById('dossier-quote-source').innerText = `— ${targetData.quoteSource || 'Hồ Chí Minh Toàn tập'}`;

        // Bối cảnh
        document.getElementById('dossier-description').innerText = targetData.description;

        // Chỉ số trang
        document.getElementById('dossier-page-indicator').innerText = `${(currentIndex + 1).toString().padStart(2, '0')} / ${filteredData.length.toString().padStart(2, '0')}`;

        // Âm thanh tư liệu (Mục 6.6: chỉ hiện điều khiển khi có URL hợp lệ)
        const audioBox = document.getElementById('dossier-audio-box');
        if (targetData.hasAudio && targetData.audio) {
            audioBox.classList.remove('hidden');
            currentAudio.pause();
            currentAudio.src = targetData.audio;
            audioLabel.innerText = targetData.audioLabel || "Bản ghi âm tư liệu";
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            eqBars.forEach(b => b.classList.remove('playing'));
        } else {
            audioBox.classList.add('hidden');
            currentAudio.pause();
        }

        // Ẩn thẻ giới thiệu để nhường không gian cho câu chuyện chi tiết
        gsap.to('#hero-narrative', { opacity: 0, duration: 0.35 });

        // Mở panel câu chuyện trượt từ cạnh phải (hoặc cạnh dưới trên mobile)
        const panel = document.getElementById('dossier-panel');
        panel.classList.remove('pointer-events-none');
        panel.classList.add('pointer-events-auto');

        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            gsap.to('#dossier-panel', {
                y: '0%',
                opacity: 1,
                duration: 0.5,
                ease: "power3.out"
            });
        } else {
            gsap.to('#dossier-panel', {
                x: '0%',
                opacity: 1,
                duration: 0.55,
                ease: "power3.out"
            });
        }
    }

    // ---------------------------------------------------------
    // 9. ĐÓNG PANEL CÂU CHUYỆN
    // ---------------------------------------------------------
    function closeDossier() {
        const panel = document.getElementById('dossier-panel');
        const isMobile = window.innerWidth < 768;

        // Hiện lại thẻ giới thiệu
        gsap.to('#hero-narrative', { opacity: 1, duration: 0.45 });

        const anim = isMobile 
            ? { y: '110%', opacity: 0, duration: 0.4, ease: "power3.in" }
            : { x: '110%', opacity: 0, duration: 0.4, ease: "power3.in" };

        anim.onComplete = () => {
            panel.classList.remove('pointer-events-auto');
            panel.classList.add('pointer-events-none');
        };

        gsap.to('#dossier-panel', anim);

        currentAudio.pause();
        activePointId = null;

        document.querySelectorAll('.custom-marker').forEach(el => el.classList.remove('active-marker'));

        for (let i = 0; i < 65; i++) {
            map.setFeatureState({ source: 'vietnam-geo', id: i }, { active: false });
        }
        activeExtrusionRegion = null;

        if (activeCountryId !== null) {
            map.setFeatureState({ source: 'world-geo', id: activeCountryId }, { active: false });
            activeCountryId = null;
        }

        if (map.getLayer('vn-region-extrusion')) {
            map.setLayoutProperty('vn-region-extrusion', 'visibility', 'none');
            map.setFilter('vn-region-extrusion', ['==', '$id', -1]);
        }
        if (map.getLayer('vn-region-active-glow')) {
            map.setLayoutProperty('vn-region-active-glow', 'visibility', 'none');
            map.setFilter('vn-region-active-glow', ['==', '$id', -1]);
        }
        if (map.getLayer('vn-region-active-border')) {
            map.setLayoutProperty('vn-region-active-border', 'visibility', 'none');
            map.setFilter('vn-region-active-border', ['==', '$id', -1]);
        }
        if (map.getLayer('world-country-extrusion')) {
            map.setLayoutProperty('world-country-extrusion', 'visibility', 'none');
            map.setFilter('world-country-extrusion', ['==', '$id', -1]);
        }
        if (map.getLayer('world-country-active-glow')) {
            map.setLayoutProperty('world-country-active-glow', 'visibility', 'none');
            map.setFilter('world-country-active-glow', ['==', '$id', -1]);
        }
        if (map.getLayer('world-country-active-border')) {
            map.setLayoutProperty('world-country-active-border', 'visibility', 'none');
            map.setFilter('world-country-active-border', ['==', '$id', -1]);
        }
        if (map.getLayer('world-solidarity-fill')) {
            map.setLayoutProperty('world-solidarity-fill', 'visibility', 'none');
            map.setFilter('world-solidarity-fill', ['==', '$id', -1]);
        }

        // Đưa camera về tầm nhìn tổng quan tương ứng và khôi phục hiển thị
        if (currentMode === 'national') {
            if (map.getLayer('vn-national-glow')) {
                map.setLayoutProperty('vn-national-glow', 'visibility', 'none');
            }
            if (map.getLayer('vn-provinces-fill')) {
                map.setPaintProperty('vn-provinces-fill', 'fill-color', STYLE.vnFill);
                map.setPaintProperty('vn-provinces-fill', 'fill-opacity', 0.45);
            }
            map.flyTo({
                center: [106.8, 16.2],
                zoom: 5.3,
                pitch: 20,
                bearing: 0,
                duration: 1600
            });
        } else {
            // Tầm nhìn quốc tế: VIỆT NAM EXCEPTION LUÔN GLOW TOÀN BỘ VÀNG SÁNG!
            if (map.getLayer('vn-national-glow')) {
                map.setLayoutProperty('vn-national-glow', 'visibility', 'visible');
            }
            if (map.getLayer('vn-national-core')) {
                map.setLayoutProperty('vn-national-core', 'visibility', 'visible');
            }
            if (map.getLayer('vn-provinces-fill')) {
                map.setPaintProperty('vn-provinces-fill', 'fill-color', STYLE.vnFill);
                map.setPaintProperty('vn-provinces-fill', 'fill-opacity', 0.7);
            }
            map.flyTo({
                center: [42.0, 22.0],
                zoom: 2.15,
                pitch: 12,
                bearing: 0,
                duration: 1600
            });
        }
    }

    document.getElementById('btn-close-dossier').addEventListener('click', closeDossier);
    window.openDossier = openDossier;
    window.closeDossier = closeDossier;

    // ---------------------------------------------------------
    // 10. ĐIỀU KHIỂN CHUYỂN NHANH (TRƯỚC / KẾ TIẾP)
    // ---------------------------------------------------------
    document.getElementById('btn-prev-point').addEventListener('click', () => {
        const filteredData = window.SOLIDARITY_DATA.filter(d => d.perspective === currentMode);
        let newIdx = currentIndex - 1;
        if (newIdx < 0) newIdx = filteredData.length - 1;
        openDossier(filteredData[newIdx].id);
    });

    document.getElementById('btn-next-point').addEventListener('click', () => {
        const filteredData = window.SOLIDARITY_DATA.filter(d => d.perspective === currentMode);
        let newIdx = (currentIndex + 1) % filteredData.length;
        openDossier(filteredData[newIdx].id);
    });

    // ---------------------------------------------------------
    // 11. CHUYỂN ĐỔI GÓC NHÌN (VIỆT NAM <-> QUỐC TẾ)
    // ---------------------------------------------------------
    const btnToggle = document.getElementById('btn-perspective-toggle');
    const toggleText = document.getElementById('perspective-button-text');
    const headerContext = document.getElementById('header-context-label');
    const headerDot = document.getElementById('header-context-dot');
    const heroEyebrow = document.getElementById('hero-eyebrow');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroMetric = document.getElementById('hero-metric-num');

    btnToggle.addEventListener('click', () => {
        if (currentMode === 'national') {
            currentMode = 'international';
            document.body.classList.add('mode-international');
            toggleText.innerText = 'NƯỚC NON MỘT NHÀ';
            headerContext.innerText = 'BẠN BÈ NĂM CHÂU';
            headerDot.style.backgroundColor = '#a8d7d1'; // Chuyển sang xanh ngọc theo ngữ cảnh Bạn bè năm châu

            heroEyebrow.innerText = 'SỨC MẠNH DÂN TỘC · SỨC MẠNH THỜI ĐẠI';
            heroTitle.innerHTML = 'Bạn bè <br/><span class="italic font-serif text-[#a8d7d1]">năm châu.</span>';
            heroDesc.innerText = 'Từ Washington, Paris đến La Habana, nhân dân yêu chuộng hòa bình khắp năm châu cùng chung một nhịp đập ủng hộ Việt Nam.';
            heroMetric.innerText = '11';

            // Bật tuyến kết nối đoàn kết quốc tế
            if (map.getLayer('solidarity-arcs-glow')) {
                map.setLayoutProperty('solidarity-arcs-glow', 'visibility', 'visible');
                map.setLayoutProperty('solidarity-arcs-main', 'visibility', 'visible');
            }
            // Không bật glow tràn lan ở cấp toàn cầu
            if (map.getLayer('world-solidarity-fill')) {
                map.setLayoutProperty('world-solidarity-fill', 'visibility', 'none');
                map.setFilter('world-solidarity-fill', ['==', '$id', -1]);
            }
            if (map.getLayer('world-solidarity-glow')) {
                map.setLayoutProperty('world-solidarity-glow', 'visibility', 'none');
            }
            if (map.getLayer('world-solidarity-borders')) {
                map.setLayoutProperty('world-solidarity-borders', 'visibility', 'none');
            }

            // VIỆT NAM EXCEPTION: LUÔN TỎA SÁNG RỰC RỠ VÀ PHÁT HÀO QUANG VÀNG TRÊN BẢN ĐỒ THẾ GIỚI
            if (map.getLayer('vn-provinces-fill')) {
                map.setPaintProperty('vn-provinces-fill', 'fill-color', STYLE.vnFill);
                map.setPaintProperty('vn-provinces-fill', 'fill-opacity', 0.7);
            }
            if (map.getLayer('vn-national-glow')) {
                map.setLayoutProperty('vn-national-glow', 'visibility', 'visible');
            }
            if (map.getLayer('vn-national-core')) {
                map.setLayoutProperty('vn-national-core', 'visibility', 'visible');
            }
            if (map.getLayer('vn-province-borders')) {
                map.setLayoutProperty('vn-province-borders', 'visibility', 'visible');
            }

            // Camera quốc tế cân bằng: Việt Nam nằm trọn vẹn trong khung hình
            map.flyTo({
                center: [42.0, 22.0],
                zoom: 2.15,
                pitch: 12,
                bearing: 0,
                duration: 1800
            });

            closeDossier();
            renderMarkers(); // Render lại marker quốc tế
        } else {
            currentMode = 'national';
            document.body.classList.remove('mode-international');
            toggleText.innerText = 'BẠN BÈ NĂM CHÂU';
            headerContext.innerText = 'KHÔNG GIAN VIỆT NAM';
            headerDot.style.backgroundColor = '#ff3b47'; // Chuyển lại màu đỏ Ruby

            heroEyebrow.innerText = 'MỘT TƯ TƯỞNG · NHIỀU NHỊP CẦU';
            heroTitle.innerHTML = 'Nước non <br/><span class="italic font-serif text-[#dfbd79]">một nhà.</span>';
            heroDesc.innerText = 'Từ miền núi phía Bắc đến đồng bằng phương Nam, cùng khám phá những sợi dây gắn kết con người Việt Nam.';
            heroMetric.innerText = '11';

            // Ẩn tuyến kết nối và các lớp quốc tế
            if (map.getLayer('solidarity-arcs-glow')) {
                map.setLayoutProperty('solidarity-arcs-glow', 'visibility', 'none');
                map.setLayoutProperty('solidarity-arcs-main', 'visibility', 'none');
            }
            if (map.getLayer('world-solidarity-fill')) {
                map.setLayoutProperty('world-solidarity-fill', 'visibility', 'none');
            }
            if (map.getLayer('world-solidarity-glow')) {
                map.setLayoutProperty('world-solidarity-glow', 'visibility', 'none');
            }
            if (map.getLayer('world-solidarity-borders')) {
                map.setLayoutProperty('world-solidarity-borders', 'visibility', 'none');
            }

            // Khôi phục hiển thị cho Việt Nam ở góc nhìn trong nước
            if (map.getLayer('vn-provinces-fill')) {
                map.setPaintProperty('vn-provinces-fill', 'fill-color', STYLE.vnFill);
                map.setPaintProperty('vn-provinces-fill', 'fill-opacity', 0.45);
            }
            if (map.getLayer('vn-national-glow')) {
                map.setLayoutProperty('vn-national-glow', 'visibility', 'none');
            }
            if (map.getLayer('vn-national-core')) {
                map.setLayoutProperty('vn-national-core', 'visibility', 'visible');
            }
            if (map.getLayer('vn-province-borders')) {
                map.setLayoutProperty('vn-province-borders', 'visibility', 'visible');
            }

            // Thu camera về trọn vẹn dải đất hình chữ S
            map.flyTo({
                center: [106.8, 16.2],
                zoom: 5.3,
                pitch: 20,
                bearing: 0,
                duration: 1700
            });

            closeDossier();
            renderMarkers(); // Render lại marker trong nước
        }
    });

    // ---------------------------------------------------------
    // 12. TƯƠNG TÁC RÊ CHUỘT XEM TÊN QUỐC GIA (KHÔNG GIAN QUỐC TẾ)
    // ---------------------------------------------------------
    const countryViMap = {
        'United States of America': 'Hoa Kỳ (Mỹ)',
        'Russia': 'Liên bang Nga (Liên Xô)',
        'Cuba': 'Cộng hòa Cuba',
        'France': 'Cộng hòa Pháp',
        'United Kingdom': 'Vương quốc Anh',
        'Sweden': 'Vương quốc Thụy Điển',
        'Senegal': 'Cộng hòa Senegal (Châu Phi)',
        'Indonesia': 'Cộng hòa Indonesia',
        'Argentina': 'Cộng hòa Argentina (Mỹ Latinh)',
        'Vietnam': 'Nước CHXHCN Việt Nam',
        'China': 'Trung Quốc',
        'Laos': 'Cộng hòa Dân chủ Nhân dân Lào',
        'Cambodia': 'Vương quốc Campuchia',
        'Thailand': 'Vương quốc Thái Lan',
        'India': 'Cộng hòa Ấn Độ',
        'Japan': 'Nhật Bản',
        'Germany': 'Cộng hòa Liên bang Đức',
        'Algeria': 'Cộng hòa Dân chủ Nhân dân Algeria',
        'Egypt': 'Ai Cập',
        'Australia': 'Úc (Australia)',
        'Canada': 'Canada',
        'Brazil': 'Cộng hòa Liên bang Brazil'
    };

    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'country-hover-tooltip';
    document.body.appendChild(tooltipEl);

    map.on('mousemove', 'world-continents', (e) => {
        if (!e.features || !e.features.length) {
            tooltipEl.classList.remove('visible');
            return;
        }
        const feat = e.features[0];
        const name = feat.properties && (feat.properties.NAME || feat.properties.ADMIN);
        if (!name || name === 'Antarctica') {
            tooltipEl.classList.remove('visible');
            return;
        }

        const viName = countryViMap[name] || name;
        const isPartner = SOLIDARITY_COUNTRIES.includes(name);

        tooltipEl.innerHTML = `
            <div class="font-semibold text-[#edf0e8]">${viName}</div>
            ${isPartner ? '<div class="text-[9px] uppercase tracking-wider text-[#a8d7d1] mt-0.5 font-sans">★ Điểm sáng đoàn kết quốc tế</div>' : ''}
        `;
        tooltipEl.style.left = `${e.originalEvent.clientX}px`;
        tooltipEl.style.top = `${e.originalEvent.clientY}px`;
        tooltipEl.classList.add('visible');
    });

    map.on('mouseleave', 'world-continents', () => {
        tooltipEl.classList.remove('visible');
    });
});
