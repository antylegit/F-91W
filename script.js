document.addEventListener('DOMContentLoaded', () => {

    // MANUAL CONFIG (TEMPORARY)
    const format = 1; // 0 = 24H, 1 = 12H

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

    // BUILD DIGIT SEGMENT LOOKUP AND ELEMENT MAP
    const digitGroup = document.querySelector('#lcd > g#digits');
    const elementGroup = document.querySelector('#lcd > g#elements');

    const digits = Array.from(digitGroup.children).reduce((acc, g) => {
        const idx = Number(g.id);
        const segs = {};
        g.querySelectorAll('[id]').forEach(el => segs[el.id] = el);
        acc[idx] = segs;
        return acc;
    }, []);

    const elementMap = {};
    Array.from(elementGroup.children).forEach(g => {
        elementMap[g.id] = [g];
    });

    // UTILITY TO SHOW/CLEAR SEGMENTS FOR A GIVEN DIGIT (ID)
    function setSegments(id, flags=[]) {
        const segs = digits[id] || {};
        
        // HIDE ALL
        for (let seg in segs) segs[seg].style.display = 'none';
        
        // SHOW FLAGGED ONES
        flags.forEach(seg => {
            if (segs[seg]) segs[seg].style.display = 'inline';
        });
    }

    // UTILITY TO SHOW/HIDE ELEMENTS BASED ON ID
    function setElement(id, flag) {
        (elementMap[id] || []).forEach(el => {
            el.style.display = flag ? 'inline' : 'none';
        });
    }

    // GET DATETIME AND RETURN ARRAY
    function getTimeArray() {
        const now = new Date();

        let h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const d = now.getDate();
        const wd = now.getDay();
        let pm = false;

        // ACCOUNT FOR 12H FORMAT
        pm = (h >= 12) && format;
        h = ((h % (24 - (12 * format))) || 12 * format);

        return [
            Math.floor(h/10), h % 10,
            Math.floor(m/10), m % 10,
            Math.floor(s/10), s % 10,
            Math.floor(d/10), d % 10,
            wd,
            pm
        ];
    }
    
    // UPDATE LOOP
    function update() {
        const [h1,h2,m1,m2,s1,s2,dd1,dd2,wd,pm] = getTimeArray();
    
        // TIME AND DATE DIGITS
        setSegments(0, (!h1 && format) ? [] : DIGIT_MAP[h1]); // NO LEADING 0 IF 24H, ONLY IN 12H
        setSegments(1, DIGIT_MAP[h2]);
        setSegments(2, DIGIT_MAP[m1]);
        setSegments(3, DIGIT_MAP[m2]);
        setSegments(4, DIGIT_MAP[s1]);
        setSegments(5, DIGIT_MAP[s2]);
        setSegments(6, DIGIT_MAP[dd1]);
        setSegments(7, DIGIT_MAP[dd2]);
        setElement(13, pm); // PM INDICATOR
        setElement(14, !format); // 24H INDICATOR
    
        // WEEKDAY LETTERS
        const dayCfg = WEEKDAY_MAP[wd] || {};
        setSegments(8, dayCfg[8] || []);
        setSegments(9, dayCfg[9] || []);

        // EXTRA (TEMPORARY)
        setElement(15, false);
    }
    
    update();
    setInterval(update, 100);
});
