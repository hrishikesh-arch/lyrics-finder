import Sanscript from '@indic-transliteration/sanscript';

const text = `நாலு மாசம்
நான் அடிச்சா`;

console.log('--- Original ---');
console.log(text);

console.log('\n--- HK (Harvard-Kyoto) ---');
const hk = Sanscript.t(text, 'tamil', 'hk');
console.log(hk);

console.log('\n--- Proposed Fixes ---');
let fixed = hk
    .replace(/jhjh/g, 'ch') // Double jh -> ch (adicha)
    .replace(/jh/g, 's')    // Single jh -> s (masam)

    // Other existing fixes
    .replace(/n2/g, 'n')
    .replace(/S/g, 's')
    .replace(/sh/g, 'sh')
    .replace(/dh/g, 'th')
    .replace(/r2/g, 'tr')
    .replace(/gh/g, 'k')
    .replace(/bh/g, 'p')
    .replace(/w/g, 'l')
    .replace(/G/g, 'ng')
    .replace(/D/g, 't')
    .replace(/Dh/g, 't')

    // General
    .replace(/t/g, 'th')
    .replace(/T/g, 't')
    .replace(/d/g, 'd')
    .replace(/L/g, 'l')
    .replace(/N/g, 'n')
    .replace(/R/g, 'r')
    .replace(/S/g, 'sh')
    .replace(/sh/g, 'sh')
    .replace(/~n/g, 'n')
    .replace(/\^/g, '')
    .replace(/~/g, '')
    .replace(/aa/g, 'aa')
    .replace(/ii/g, 'ee')
    .replace(/uu/g, 'oo')

    .replace(/thh/g, 'th')
    .replace(/ngk/g, 'ng')
    .toLowerCase();

console.log(fixed);
