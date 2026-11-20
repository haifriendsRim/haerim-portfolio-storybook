const toggle=document.getElementById('langToggle');
let lang='ko';
toggle.addEventListener('click',()=>{
  lang=lang==='ko'?'en':'ko';
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-ko]').forEach(el=>el.innerHTML=el.dataset[lang]);
  toggle.innerHTML=lang==='ko'?'EN <span>↗</span>':'KO <span>↗</span>';updateSlide();
});
const menu=document.getElementById('menuToggle'), nav=document.querySelector('.desktop-nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const box=document.getElementById('lightbox'), media=document.getElementById('lightboxMedia');
document.querySelectorAll('.work-card[data-type]').forEach(card=>card.addEventListener('click',()=>{
  media.innerHTML='';
  const node=document.createElement(card.dataset.type==='video'?'video':'img');
  node.src=card.dataset.src;
  if(card.dataset.type==='video'){node.controls=true;node.autoplay=true;node.playsInline=true}
  else node.alt=card.dataset.title;
  media.appendChild(node);
  document.getElementById('lightboxTitle').textContent=card.dataset.title;
  document.getElementById('lightboxDesc').textContent=card.dataset.desc;
  box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}));
function closeBox(){box.classList.remove('open');box.setAttribute('aria-hidden','true');media.innerHTML='';document.body.style.overflow=''}
document.getElementById('lightboxClose').addEventListener('click',closeBox);
box.addEventListener('click',e=>{if(e.target===box)closeBox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox()});

// Featured image slideshow: cross-fade, manual navigation, pause/resume.
const slideInfo=[
{category:'ILLUSTRATION / 01',title:'A New Step, Every Day',ko:'일상 속 작은 도전과 새로운 시작을 표현한 AI 일러스트레이션.',en:'An AI illustration about everyday courage and fresh beginnings.'},
{category:'CAMPAIGN / 02',title:'Chuseok Big Sale',ko:'명절 시즌 프로모션을 위한 밝고 경쾌한 광고 비주얼.',en:'A playful promotional visual for the Chuseok holiday.'},
{category:'PRODUCT VISUAL / 03',title:'Radiance in a Pure Form',ko:'투명함과 청량감을 강조한 스킨케어 제품 콘셉트.',en:'A luminous skincare visual focused on clarity and freshness.'},
{category:'SEASONAL / 04',title:'Merry Winter Coffee',ko:'따뜻한 겨울 분위기를 담은 시즌 음료 포스터.',en:'A warm winter-themed beverage campaign concept.'},
{category:'SUMMER CAMPAIGN / 05',title:'Summer Sale — A Brighter You',ko:'여름 햇살과 바다를 배경으로 한 시즌 프로모션 비주얼.',en:'A sunlit summer sale campaign visual by the sea.'}
];
const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.slide-dot')];
const slideTitle=document.getElementById('slideTitle'),slideCategory=document.getElementById('slideCategory'),slideDescription=document.getElementById('slideDescription'),slideCount=document.getElementById('slideCount'),pauseSlides=document.getElementById('pauseSlides');
let currentSlide=0,paused=false,slideTimer=null;
function updateSlide(){const d=slideInfo[currentSlide];slides.forEach((el,i)=>el.classList.toggle('active',i===currentSlide));dots.forEach((el,i)=>{el.classList.toggle('active',i===currentSlide);if(i===currentSlide)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current')});slideTitle.textContent=d.title;slideCategory.textContent=d.category;slideDescription.textContent=d[lang];slideCount.innerHTML=String(currentSlide+1).padStart(2,'0')+' <i>/</i> '+String(slides.length).padStart(2,'0');}
function restartSlides(){clearInterval(slideTimer);if(!paused)slideTimer=setInterval(()=>{currentSlide=(currentSlide+1)%slides.length;updateSlide()},6000)}
function goSlide(n){currentSlide=(n+slides.length)%slides.length;updateSlide();restartSlides()}
document.getElementById('prevSlide').addEventListener('click',()=>goSlide(currentSlide-1));
document.getElementById('nextSlide').addEventListener('click',()=>goSlide(currentSlide+1));
dots.forEach((d,i)=>d.addEventListener('click',()=>goSlide(i)));
pauseSlides.addEventListener('click',()=>{paused=!paused;pauseSlides.textContent=paused?'▶':'Ⅱ';pauseSlides.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');restartSlides()});
pauseSlides.textContent=paused?'▶':'Ⅱ';pauseSlides.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');
// Hover no longer pauses the slideshow; only the explicit pause button does.
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(slideTimer);else restartSlides()});
updateSlide();restartSlides();

// Copy email without opening a mail application. Works in secure contexts and local file previews.
const copyEmailButton=document.getElementById('copyEmail');
const copyToast=document.getElementById('copyToast');
let copyToastTimer;
function fallbackCopy(text){
  const input=document.createElement('textarea');
  input.value=text;input.setAttribute('readonly','');
  input.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
  document.body.appendChild(input);
  input.focus();input.select();input.setSelectionRange(0,text.length);
  let ok=false;
  try{ok=document.execCommand('copy')}catch(e){}
  input.remove();
  return ok;
}
function showCopyToast(success){
  copyToast.textContent=success
    ?(lang==='ko'?'이메일 주소가 복사되었습니다!':'Email address copied!')
    :(lang==='ko'?'복사할 수 없어요. 위 이메일 주소를 직접 선택해 복사해 주세요.':'Could not copy. Please select the email address above.');
  copyToast.classList.add('show');
  clearTimeout(copyToastTimer);
  copyToastTimer=setTimeout(()=>copyToast.classList.remove('show'),3000);
}
copyEmailButton.addEventListener('click',async()=>{
  const address='vega18@naver.com';
  let success=false;
  if(navigator.clipboard&&window.isSecureContext){
    try{await navigator.clipboard.writeText(address);success=true}catch(e){}
  }
  if(!success)success=fallbackCopy(address);
  showCopyToast(success);
});
