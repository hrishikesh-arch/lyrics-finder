import Sanscript from '@indic-transliteration/sanscript';

const text = 'மலரே மௌனமா'; // Tamil
const textMal = 'മലരേ മൗനമാ'; // Malayalam

console.log('--- Tamil ---');
console.log('Original:', text);
console.log('ITRANS:', Sanscript.t(text, 'tamil', 'itrans'));
console.log('HK:', Sanscript.t(text, 'tamil', 'hk'));

console.log('\n--- Malayalam ---');
console.log('Original:', textMal);
console.log('ITRANS:', Sanscript.t(textMal, 'malayalam', 'itrans'));
console.log('HK:', Sanscript.t(textMal, 'malayalam', 'hk'));
