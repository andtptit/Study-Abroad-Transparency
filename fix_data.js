import fs from 'fs';

// Since criteria.js is an ES module, we'll read it as a string or dynamically import.
// Better to just dynamically import:
(async () => {
    const { CRITERIA_FALLBACK } = await import('./data/criteria.js');

    for (let c of CRITERIA_FALLBACK) {
        c.options = c.options.filter(o => o.desc !== "1");
    }

    const fileContent = `// Tự động tạo từ parse_excel.cjs\nexport const CRITERIA_FALLBACK = ${JSON.stringify(CRITERIA_FALLBACK, null, 4)};\n`;
    fs.writeFileSync('data/criteria.js', fileContent);
    console.log("Fixed criteria.js");
})();
