document.addEventListener('DOMContentLoaded', () => {

    // (TEMPORARY, I'M LAZY) MANUALLY HIDE/SHOW OTHER LCD ELEMENTS
    HIDE_EXTRA = [13, 15];

    HIDE_EXTRA.forEach(id => {
        const el = document.querySelector(`#lcd > g[id="${id}"]`);
        if (el) el.style.display = 'none';
    });

    // INITIALIZE SEGMENT MAPS
    const DIGIT_MAP = {
        '0': ['a','b','c','d','e','f'],
        '1': ['b','c'],
        '2': ['a','b','g','e','d'],
        '3': ['a','b','g','c','d'],
        '4': ['f','g','b','c'],
        '5': ['a','f','g','c','d'],
        '6': ['a','f','g','c','d','e'],
        '7': ['a','b','c'],
        '8': ['a','b','c','d','e','f','g'],
        '9': ['a','b','c','d','f','g']
    };
    
    const WEEKDAY_MAP = {
        0: { // SUNDAY BECAUSE RAHHH 🇺🇸🇺🇸🇺🇸🦅🦅🦅
                8: ['a','c','d','f','g'],
                9: ['b','c','d','e','f']
        },
        1: { // MONDAY
                8: ['a','b','c','e','f','h'],
                9: ['a','b','c','d','e','f']
        },
        2: { // TUESDAY
                8: ['a','h'],
                9: ['b','c','d','e','f']
        },
        3: { // WEDNESDAY
                8: ['b','c','d','e','f','h'],
                9: ['a','d','e','f','g']
        },
        4: { // THURSDAY
                8: ['a','h'],
                9: ['b','c','e','f','g']
        },
        5: { // FRIDAY
                8: ['a','e','f','g'],
                9: ['a','b','c','e','f','g','h']
        },
        6: { // SATURDAY
                8: ['a','c','d','f','g'],
                9: ['a','b','c','e','f','g']
        }
    };

    // BUILD SEGMENT LOOKUP: groups[0] ... groups[9] = { a:SVGElement, b:SVGElement, ... }
    const groups = Array.from(
        document.querySelectorAll('#lcd > g')
    ).reduce((acc, g) => {
        const idx = parseInt(g.id, 10);
        if (isNaN(idx) || idx < 0 || idx > 9) return acc;

        // MAP EACH SEGMENT ID TO ITS OWN ELEMENT
        const segs = {};
        g.querySelectorAll('[id]').forEach(el => {
            segs[el.id] = el;
        });
        acc[idx] = segs;
        return acc;
    }, []);

    // UTILITY TO SHOW/CLEAR SEGMENTS FOR A GIVEN POSITION (SYMBOL)
    function setSegments(pos, toShow=[]) {
        const segs = groups[pos];
        if (!segs) return;

        // HIDE ALL
        for (let id in segs) segs[id].style.display = 'none';
        
        // SHOW DESIRED ONES
        toShow.forEach(id => {
            if (segs[id]) segs[id].style.display = 'inline';
        });
    }

    // GET DATETIME AND RETURN ARRAY
    function getTimeArray() {
        const now = new Date();

        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const d = now.getDate();
        const wd = now.getDay();
    
        return [
            Math.floor(h/10), h % 10,
            Math.floor(m/10), m % 10,
            Math.floor(s/10), s % 10,
            Math.floor(d/10), d % 10,
            wd
        ]
    }
    
    // UPDATE LOOP
    function update() {
        const [h1,h2,m1,m2,s1,s2,dd1,dd2,wd] = getTimeArray();
    
        // TIME AND DATE DIGITS
        setSegments(0, DIGIT_MAP[h1]);
        setSegments(1, DIGIT_MAP[h2]);
        setSegments(2, DIGIT_MAP[m1]);
        setSegments(3, DIGIT_MAP[m2]);
        setSegments(4, DIGIT_MAP[s1]);
        setSegments(5, DIGIT_MAP[s2]);
        setSegments(6, DIGIT_MAP[dd1]);
        setSegments(7, DIGIT_MAP[dd2]);
    
        // WEEKDAY LETTERS
        const dayCfg = WEEKDAY_MAP[wd] || {};
        setSegments(8, dayCfg[8] || []);
        setSegments(9, dayCfg[9] || []);
    }
    
    update();
    setInterval(update, 1000);
});