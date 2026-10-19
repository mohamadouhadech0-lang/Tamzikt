/* بيانات التطبيق: أضف حروفًا أو كلمات هنا فقط.
   الصوت: يبحث التطبيق أولًا عن ملف audio/letters/<اسم>.mp3 أو audio/words/<اسم>.mp3 (انظر slug في app.js).
   audio: مسار ملف صوتي مخصص لعنصر معيّن. ph: كتابة لاتينية بديلة لتحسين النطق الآلي. */
const E={aman:["ⴰⵎⴰⵏ","aman","ماء"],abrid:["ⴰⴱⵔⵉⴷ","abrid","طريق"],agllid:["ⴰⴳⵍⵍⵉⴷ","agllid","ملك"],adrar:["ⴰⴷⵔⴰⵔ","adrar","جبل"],id:["ⵉⴹ","iḍ","ليل"],afus:["ⴰⴼⵓⵙ","afus","يد"],akal:["ⴰⴽⴰⵍ","akal","أرض / تراب"],ixf:["ⵉⵅⴼ","ixf","رأس"],tamurt:["ⵜⴰⵎⵓⵔⵜ","tamurt","بلاد / أرض"],tanm:["ⵜⴰⵏⵎⵎⵉⵔⵜ","tanmmirt","شكرا"],azul:["ⴰⵣⵓⵍ","azul","مرحبا"],argaz:["ⴰⵔⴳⴰⵣ","argaz","رجل"],azru:["ⴰⵥⵕⵓ","aẓṛu","حجر"],aghrum:["ⴰⵖⵔⵓⵎ","aɣrum","خبز"],asif:["ⴰⵙⵉⴼ","asif","نهر"],taddart:["ⵜⴰⴷⴷⴰⵔⵜ","taddart","بيت"],tifawt:["ⵜⵉⴼⴰⵡⵜ","tifawt","ضوء"],ayyur:["ⴰⵢⵢⵓⵔ","ayyur","قمر"]};
const L=[["ⴰ","a","أ",E.aman],["ⴱ","b","ب",E.abrid],["ⴳ","g","گ",E.agllid],["ⴷ","d","د",E.adrar],["ⴹ","ḍ","ض",E.id],["ⴻ","e","فتحة خفيفة (ə)"],["ⴼ","f","ف",E.afus],["ⴽ","k","ك",E.akal],["ⵀ","h","ه"],["ⵃ","ḥ","ح"],["ⵄ","ɛ","ع"],["ⵅ","x","خ",E.ixf],["ⵇ","q","ق"],["ⵉ","i","ي / إ",E.id],["ⵊ","j","ج"],["ⵍ","l","ل",E.agllid],["ⵎ","m","م",E.tamurt],["ⵏ","n","ن",E.tanm],["ⵓ","u","و (ضمة)",E.azul],["ⵔ","r","ر",E.argaz],["ⵕ","ṛ","ر مفخمة",E.azru],["ⵖ","ɣ","غ",E.aghrum],["ⵙ","s","س",E.asif],["ⵚ","ṣ","ص"],["ⵛ","c","ش"],["ⵜ","t","ت",E.taddart],["ⵟ","ṭ","ط"],["ⵡ","w","و",E.tifawt],["ⵢ","y","ي",E.ayyur],["ⵣ","z","ز",E.azul],["ⵥ","ẓ","ظ",E.azru]];
const W=[
["ⵎⵎⴰ","mma","أمي","family"],["ⴱⴱⴰ","bba","أبي","family"],["ⵓⵍⵜⵎⴰ","ultma","أخت","family"],["ⵓⵎⴰ","uma","أخ","family"],["ⵎⵎⵉ","mmi","ابني","family"],["ⴰⵔⴰⵡ","araw","أبناء","family"],["ⴰⵔⴳⴰⵣ","argaz","رجل","family"],["ⵜⴰⵎⵖⴰⵔⵜ","tamɣart","امرأة","family"],["ⵜⴰⴷⴷⴰⵔⵜ","taddart","بيت","family"],
["ⵢⴰⵏ","yan","واحد","numbers"],["ⵙⵉⵏ","sin","اثنان","numbers"],["ⴽⵔⴰⴹ","kraḍ","ثلاثة","numbers"],["ⴽⴽⵓⵥ","kkuẓ","أربعة","numbers"],["ⵙⵎⵎⵓⵙ","smmus","خمسة","numbers"],["ⵙⴹⵉⵙ","sḍis","ستة","numbers"],["ⵙⴰ","sa","سبعة","numbers"],["ⵜⴰⵎ","tam","ثمانية","numbers"],["ⵜⵥⴰ","tẓa","تسعة","numbers"],["ⵎⵔⴰⵡ","mraw","عشرة","numbers"],
["ⴰⴱⵔⴽⴰⵏ","aberkan","أسود","colors"],["ⴰⵎⵍⴰⵍ","amlal","أبيض","colors"],["ⴰⵡⵔⴰⵖ","awraɣ","أصفر","colors"],["ⴰⵣⴳⵣⴰⵡ","azgzaw","أخضر","colors"],["ⴰⵣⵓⴳⴳⵯⴰⵖ","azuggwaɣ","أحمر","colors"],
["ⴰⵎⴰⵏ","aman","ماء","nature"],["ⴰⴷⵔⴰⵔ","adrar","جبل","nature"],["ⴰⵙⵉⴼ","asif","نهر","nature"],["ⵜⴰⴼⵓⴽⵜ","tafukt","شمس","nature"],["ⴰⵢⵢⵓⵔ","ayyur","قمر","nature"],["ⵜⵉⴼⴰⵡⵜ","tifawt","ضوء","nature"],["ⴰⵏⵣⴰⵔ","anzar","مطر","nature"],["ⴰⵥⵕⵓ","aẓṛu","حجر","nature"],["ⴰⴽⴰⵍ","akal","أرض / تراب","nature"],
["ⴰⵣⵓⵍ","azul","مرحبا","basic"],["ⵜⴰⵏⵎⵎⵉⵔⵜ","tanmmirt","شكرا","basic"],["ⵉⵀ","ih","نعم","basic"],["ⵓⵀⵓ","uhu","لا","basic"],["ⴰⵖⵔⵓⵎ","aɣrum","خبز","basic"],["ⵜⴰⵎⴰⵣⵉⵖⵜ","tamazight","اللغة الأمازيغية","basic"]];
window.DATA={
  AUDIO:{dir:"audio/",ext:".mp3"},
  CATS:{family:"العائلة",numbers:"الأرقام",colors:"الألوان",nature:"الطبيعة",basic:"عبارات وأساسيات"},
  LETTERS:L.map(a=>({t:a[0],lat:a[1],ar:a[2],audio:null,ph:null,ex:a[3]?{t:a[3][0],lat:a[3][1],ar:a[3][2]}:null})),
  WORDS:W.map(w=>({t:w[0],lat:w[1],ar:w[2],cat:w[3],audio:null,ph:null}))
};
