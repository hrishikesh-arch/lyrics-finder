import Sanscript from '@indic-transliteration/sanscript';

const text = `நான் அடிச்சா தாங்கமாட்ட
நாலு மாசம் தூங்கமாட்ட
மோதி பாரு வீடு போய் சேரமாட்ட`;

console.log('--- Original ---');
console.log(text);

console.log('\n--- HK (Harvard-Kyoto) ---');
const hk = Sanscript.t(text, 'tamil', 'hk');
console.log(hk);

console.log('\n--- Current Fixes Applied ---');
let fixed = hk
    .replace(/n2/g, 'n')
    .replace(/jh/g, 's')
    .replace(/S/g, 's')
    .replace(/sh/g, 'sh')
    .replace(/dh/g, 'th')
    .replace(/r2/g, 'tr')
    .replace(/gh/g, 'k')
    .replace(/bh/g, 'p')
    .replace(/w/g, 'l')

    // General cleanup that was in the code
    .replace(/t/g, 'th')
    .replace(/T/g, 't')
    .replace(/d/g, 'd')
    .replace(/D/g, 'd')
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
    .toLowerCase();

console.log(fixed);
