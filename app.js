/* Public site settings. Replace heroVideo with the supplied video URL or assets/hero.mp4. */
const siteConfig = {
  heroVideo: '',
  bookingUrl: 'https://map.naver.com/p/entry/place/2015335166?placePath=%2Fticket%3FadditionalHeight%3D76%26entry%3Dpll%26fromNxList%3Dtrue%26fromPanelNum%3D1%26locale%3Dko%26svcName%3Dmap_pcv5%26timestamp%3D202610231250&placeSearchOption=entry%3Dpll%26fromNxList%3Dtrue&searchType=place&c=15.00,0,0,0,dh',
  titles: {ko:'LINK 고려대점 | 우리만의 순간을 잇는 공간',en:'LINK Private Space | Your Moments, Connected.'}
};
let language = 'ko';
try { language = localStorage.getItem('link-language') === 'en' ? 'en' : 'ko'; } catch {}
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const header = document.querySelector('.header');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');header.classList.remove('menu-open');}
function setLanguage(lang){
  language=lang;document.documentElement.lang=lang;document.title=siteConfig.titles[lang];
  document.querySelectorAll('[data-ko][data-en]').forEach(el=>{const text=el.dataset[lang];if(el.hasAttribute('data-lines')){el.replaceChildren(...text.split('|').flatMap((line,i)=>i?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]));}else{el.textContent=text;}});
  document.querySelectorAll('[data-alt-ko]').forEach(el=>el.alt=el.dataset[lang==='ko'?'altKo':'altEn']);
  document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
  document.querySelector('.booking-dock').setAttribute('aria-label',lang==='ko'?'예약 안내':'Book your visit');
  menuButton.setAttribute('aria-label',lang==='ko'?'메뉴 열기':'Open menu');
  document.querySelector('#gallery-prev').setAttribute('aria-label',lang==='ko'?'이전 공간 사진':'Previous space photo');
  document.querySelector('#gallery-next').setAttribute('aria-label',lang==='ko'?'다음 공간 사진':'Next space photo');
  document.querySelector('.dock-up').setAttribute('aria-label',lang==='ko'?'맨 위로':'Back to top');
  document.querySelector('.lightbox').setAttribute('aria-label',lang==='ko'?'공간 사진 크게 보기':'Space photo viewer');
  document.querySelector('.lightbox-close').setAttribute('aria-label',lang==='ko'?'사진 닫기':'Close photo');
  try{localStorage.setItem('link-language',lang);}catch{}
  updateExperienceAlt();
  updateReviewLanguage();
}
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
document.querySelectorAll('[data-booking]').forEach(link=>link.href=siteConfig.bookingUrl);
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));header.classList.toggle('menu-open',open);});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
addEventListener('resize',()=>{if(innerWidth>760)closeMenu();});
function updateHeader(){header.classList.toggle('scrolled',scrollY>50);}addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const experiences=[{photo:'screen',ko:'LINK 대형 스크린과 프로젝터',en:'Large screen and projector at LINK'},{photo:'kitchen',ko:'LINK의 조리 가능한 주방',en:'The cooking kitchen at LINK'},{photo:'tables',ko:'모임에 맞게 배치할 수 있는 LINK 테이블',en:'Flexible tables for gatherings at LINK'}];
let activeExperience=0;
function updateExperienceAlt(){const e=experiences[activeExperience];document.querySelector('#experience-image').alt=e[language];}
document.querySelectorAll('[data-experience]').forEach(button=>button.addEventListener('click',()=>{activeExperience=Number(button.dataset.experience);document.querySelectorAll('[data-experience]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});document.querySelector('#experience-image').src=`assets/${experiences[activeExperience].photo}.webp`;updateExperienceAlt();document.querySelector('#experience-count').textContent=`0${activeExperience+1} / 03`;}));
const track=document.querySelector('#gallery-track');
document.querySelector('#gallery-next').addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.75,behavior:'smooth'}));
document.querySelector('#gallery-prev').addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.75,behavior:'smooth'}));
const lightbox=document.querySelector('.lightbox');
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const img=button.querySelector('img');lightbox.querySelector('img').src=img.src;lightbox.querySelector('img').alt=img.alt;lightbox.querySelector('p').textContent=button.querySelector('span>span').textContent;lightbox.showModal();}));
document.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close();});
const motionReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver'in window&&!motionReduced){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
const video=document.querySelector('.hero-video');const videoButton=document.querySelector('.video-control');
if(siteConfig.heroVideo){video.src=siteConfig.heroVideo;video.autoplay=!motionReduced;video.addEventListener('playing',()=>{video.hidden=false;videoButton.hidden=false;});video.addEventListener('error',()=>{video.hidden=true;videoButton.hidden=true;});videoButton.addEventListener('click',()=>{if(video.paused){video.play().catch(()=>{});}else video.pause();});video.addEventListener('pause',()=>{videoButton.textContent='▷';videoButton.setAttribute('aria-label',language==='ko'?'영상 재생':'Play video');});video.addEventListener('play',()=>{videoButton.textContent='Ⅱ';videoButton.setAttribute('aria-label',language==='ko'?'영상 일시정지':'Pause video');});if(!motionReduced)video.play().catch(()=>{});}

const visitorTrack=document.querySelector('#reviews-track');
const visitorDialog=document.querySelector('#review-dialog');
const reviewPosition=document.querySelector('#reviews-position');
const autoplayButton=document.querySelector('#reviews-autoplay');
let visitorTimer=null,autoplayEnabled=true,activeReview=0,lastReviewButton=null;
function updateReviewLanguage(){
 document.querySelector('#reviews-prev').setAttribute('aria-label',language==='ko'?'이전 후기':'Previous review');
 document.querySelector('#reviews-next').setAttribute('aria-label',language==='ko'?'다음 후기':'Next review');
 document.querySelector('.visitor-dialog-close').setAttribute('aria-label',language==='ko'?'후기 닫기':'Close review');
 document.querySelectorAll('[data-review-index]').forEach(b=>b.setAttribute('aria-label',linkReviews[Number(b.dataset.reviewIndex)].title[language]));
 if(visitorDialog.open)fillReview(activeReview);
 updateAutoplayLabel();
}
function updateAutoplayLabel(){const text=autoplayEnabled?(language==='ko'?'자동 넘김 일시정지':'Pause slideshow'):(language==='ko'?'자동 넘김 재생':'Play slideshow');autoplayButton.firstElementChild.textContent=text;autoplayButton.setAttribute('aria-pressed',String(autoplayEnabled));}
function reviewStep(){const card=visitorTrack.querySelector('.visitor-card');return card.getBoundingClientRect().width+parseFloat(getComputedStyle(visitorTrack).gap);}
function reviewMove(direction){const end=visitorTrack.scrollWidth-visitorTrack.clientWidth;let target=visitorTrack.scrollLeft+direction*reviewStep();if(direction>0&&visitorTrack.scrollLeft>=end-2)target=0;if(direction<0&&visitorTrack.scrollLeft<=2)target=end;visitorTrack.scrollTo({left:Math.max(0,Math.min(target,end)),behavior:motionReduced?'instant':'smooth'});}
function stopReviews(){clearInterval(visitorTimer);visitorTimer=null;}
function startReviews(){stopReviews();if(autoplayEnabled&&!motionReduced&&!document.hidden&&!visitorDialog.open)visitorTimer=setInterval(()=>reviewMove(1),5000);}
function fillReview(index){const r=linkReviews[index];document.querySelector('#review-dialog-title').textContent=r.title[language];document.querySelector('#review-dialog-category').textContent=r.category;document.querySelector('#review-dialog-text').textContent=(r.fullText||r.summary)[language];const gallery=document.querySelector('#review-dialog-images');gallery.replaceChildren(...r.images.map(src=>{const img=new Image();img.src=src;img.alt=r.title[language]+(language==='ko'?' · 네이버 후기 사진':' · Naver review photo');return img;}));}
document.querySelectorAll('[data-review-index]').forEach(b=>b.addEventListener('click',()=>{activeReview=Number(b.dataset.reviewIndex);lastReviewButton=b;fillReview(activeReview);stopReviews();visitorDialog.showModal();}));
document.querySelector('.visitor-dialog-close').addEventListener('click',()=>visitorDialog.close());
visitorDialog.addEventListener('click',e=>{if(e.target===visitorDialog){const r=visitorDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)visitorDialog.close();}});
visitorDialog.addEventListener('close',()=>{lastReviewButton?.focus({preventScroll:true});startReviews();});
document.querySelector('#reviews-prev').addEventListener('click',()=>{reviewMove(-1);startReviews();});
document.querySelector('#reviews-next').addEventListener('click',()=>{reviewMove(1);startReviews();});
visitorTrack.addEventListener('scroll',()=>{const n=Math.round(visitorTrack.scrollLeft/reviewStep())+1;reviewPosition.textContent=String(n).padStart(2,'0')+' / '+String(linkReviews.length).padStart(2,'0');},{passive:true});
visitorTrack.addEventListener('mouseenter',stopReviews);visitorTrack.addEventListener('mouseleave',startReviews);visitorTrack.addEventListener('focusin',stopReviews);visitorTrack.addEventListener('focusout',e=>{if(!visitorTrack.contains(e.relatedTarget))startReviews();});
autoplayButton.addEventListener('click',()=>{autoplayEnabled=!autoplayEnabled;updateAutoplayLabel();startReviews();});
document.addEventListener('visibilitychange',startReviews);
startReviews();

setLanguage(language);

// Load third-party players only after the visitor chooses a video.
let activeFilmingFrame=null;
document.querySelectorAll('[data-video-play],[data-instagram-play]').forEach(button=>button.addEventListener('click',()=>{
 const host=button.closest('.filming-player');
 if(activeFilmingFrame&&activeFilmingFrame.parentElement!==host){const oldHost=activeFilmingFrame.parentElement;activeFilmingFrame.remove();oldHost.querySelector('button').hidden=false;}
 const frame=document.createElement('iframe');const id=host.dataset.videoId;
 frame.src=id?'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0':'https://www.instagram.com/p/'+host.dataset.instagramPost+'/embed/';
 frame.title=id?button.getAttribute('aria-label'):'Instagram · 배우 김태진';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
 button.hidden=true;host.append(frame);activeFilmingFrame=frame;
}));

// GA4: record explicit media and social shortcut clicks.
(function () {
  function sendEvent(name, params) {
    if (typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', name, Object.assign({
        send_to: 'G-KL7ZYPRS4D',
        venue_id: 'link_anam',
        site_language: document.documentElement.lang === 'en' ? 'en' : 'ko'
      }, params));
      if (name !== 'page_view' && !/scroll/i.test(name)) {
        const metaEvents = {
          generate_lead: 'Lead',
          sign_up: 'CompleteRegistration',
          contact_click: 'Contact',
          view_item: 'ViewContent',
          add_to_cart: 'AddToCart',
          begin_checkout: 'InitiateCheckout',
          purchase: 'Purchase',
          search: 'Search'
        };
        if (name === 'purchase') {
          if (window.fbq) fbq('track', 'Purchase', { value: params.value, currency: 'KRW' });
        } else if (metaEvents[name]) {
          if (window.fbq) fbq('track', metaEvents[name]);
        } else {
          if (window.fbq) fbq('trackCustom', name);
        }
      }
    } catch (_) {
      // Analytics must not interrupt playback or navigation.
    }
  }

  document.querySelectorAll('[data-video-play],[data-instagram-play]').forEach(function (button) {
    button.addEventListener('click', function () {
      const host = button.closest('.filming-player');
      if (!host) return;
      sendEvent('media_embed_open', {
        media_platform: host.dataset.videoId ? 'youtube' : 'instagram',
        content_id: host.dataset.videoId || host.dataset.instagramPost,
        placement: 'filming'
      });
    });
  });

  document.querySelectorAll('.social-shortcuts a').forEach(function (link) {
    const platforms = {
      'www.instagram.com': 'instagram',
      'www.youtube.com': 'youtube',
      'blog.naver.com': 'naver_blog'
    };
    const platform = platforms[new URL(link.href).hostname];
    if (!platform) return;
    link.addEventListener('click', function () {
      sendEvent('social_click', {
        social_platform: platform,
        placement: 'social_shortcuts'
      });
    });
  });
})();
