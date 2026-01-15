const fs = require('fs');

const filePath = 'c:/Users/piete/Documents/Teamspec/teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md';
const content = fs.readFileSync(filePath, 'utf-8');

console.log('File length:', content.length);
console.log('Has actual CR:', content.includes('\r'));
console.log('Has actual LF:', content.includes('\n'));

// Split by any line ending
const lines = content.split(/\r?\n/);
console.log('Line count:', lines.length);

// Find frontmatter
let inFrontmatter = false;
let frontmatterEnd = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && line.trim() === '---') {
        inFrontmatter = true;
        console.log('Found frontmatter start at line 0');
    } else if (inFrontmatter && line.trim() === '---') {
        frontmatterEnd = i;
        console.log('Found frontmatter end at line', i);
        break;
    }
}

if (frontmatterEnd > 0) {
    console.log('\nContent after frontmatter (first 200 chars):');
    const afterFM = lines.slice(frontmatterEnd + 1).join('\n');
    console.log(afterFM.substring(0, 200));

    // Find first H1
    for (let i = frontmatterEnd + 1; i < lines.length; i++) {
        const match = lines[i].match(/^#\s+(.+)$/);
        if (match) {
            console.log('\nFirst H1 found at line', i);
            console.log('Title:', match[1]);
            break;
        }
    }
}
