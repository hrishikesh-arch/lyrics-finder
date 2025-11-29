import Sanscript from '@indic-transliteration/sanscript';

const text = `என்ன சொல்ல ஏது சொல்ல கண்ணோடு கண் பேச வார்த்தை இல்ல
என்னவென்று சொல்வதம்மா வஞ்சி அவள் பேரழகை
சொல்ல மொழி இல்லையம்மா`;

console.log('--- Original ---');
console.log(text);

console.log('\n--- ITRANS ---');
console.log(Sanscript.t(text, 'tamil', 'itrans'));

console.log('\n--- HK (Harvard-Kyoto) ---');
const hk = Sanscript.t(text, 'tamil', 'hk');
console.log(hk);

console.log('\n--- HK with Custom Fixes ---');
let fixed = hk
    .replace(/n2/g, 'n')
    .replace(/jh/g, 's')
    .replace(/S/g, 's')
    .replace(/sh/g, 'sh')
    .replace(/dh/g, 'th')
    // Add potential new fixes here to test
    .replace(/k/g, 'k') // Just checking
    .toLowerCase();

console.log(fixed);
