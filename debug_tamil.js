import Sanscript from '@indic-transliteration/sanscript';

const text = 'தமிழ் ழ ஜ ச என்ன சொல்ல';
console.log('Original:', text);

try {
    console.log('ITRANS:', Sanscript.t(text, 'tamil', 'itrans'));
    console.log('HK:', Sanscript.t(text, 'tamil', 'hk'));
} catch (e) {
    console.error('Error:', e);
}
