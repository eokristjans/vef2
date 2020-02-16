import List from './lib/list';
import {
  displayYoutubeVideo,
  displayText,
  displayCode,
  displayHeading,
  displayImage,
  displayQuote,
  displayList,
} from './lib/helpers';

let klaradButt;
let backButt;

function lecKlaradur() {
  const currTexti = klaradButt.innerText;
  const slug = window.location.search.substring(6);
  if (currTexti === 'Klára fyrirlestur') {
    klaradButt.style.color = '#2d2';
    const texti = '✔ Kláraður fyrirlestur';
    klaradButt.innerText = texti;
    window.localStorage.setItem(`${slug}`, slug);
  } else {
    window.localStorage.removeItem(slug);
    klaradButt.style.color = 'black';
    klaradButt.innerText = 'Klára fyrirlestur';
  }
}

function lecHome() {
  window.location.href = ('http://localhost:3000');
}

/**
 * Birtir fót á fyrirlestur.html
 */
function displayFooter(el, lpSlug) {
  const savedSlug = window.localStorage.getItem(lpSlug);
  let texti;
  const lecFooter = document.createElement('footer');
  lecFooter.className = 'footer';
  const lecFooterContent = document.createElement('div');
  lecFooterContent.className = 'footer__content';
  const lecKlarad = document.createElement('button');
  lecKlarad.className = 'footer__button';
  lecKlarad.classList.add('klarad');
  if (savedSlug) {
    lecKlarad.style.color = '#2d2';
    texti = '✔ Kláraður fyrirlestur';
    lecKlarad.innerText = texti;
  } else {
    lecKlarad.appendChild(document.createTextNode('Klára fyrirlestur'));
  }
  const lecBack = document.createElement('button');
  lecBack.className = 'footer__button';
  lecBack.classList.add('back');
  lecBack.appendChild(document.createTextNode('Til baka'));

  lecFooterContent.appendChild(lecKlarad);
  lecFooterContent.appendChild(lecBack);
  lecFooter.appendChild(lecFooterContent);
  el.appendChild(lecFooter);
}

/**
 * Birtir haus á fyrirlestur.html
 */
function displayHeader(el, lpCategory, lpTitle, lpImg) {
  // Búa til hausinn
  const lecHeader = document.createElement('header');
  lecHeader.className = 'header';
  const lecHeaderContent = document.createElement('div');
  lecHeaderContent.className = 'header__content';
  const lecHeaderH3 = document.createElement('h3');
  lecHeaderH3.className = 'headline3';
  lecHeaderH3.appendChild(document.createTextNode(lpCategory));
  const lecHeaderH1 = document.createElement('h1');
  lecHeaderH1.className = 'headline1';
  lecHeaderH1.appendChild(document.createTextNode(lpTitle));

  // Setja hausinn á síðuna
  if (lpImg === 'url(\'/undefined\')') {
    lecHeader.style.backgroundColor = '#aaa';
  } else {
    lecHeader.style.backgroundImage = lpImg;
  }
  lecHeaderContent.appendChild(lecHeaderH3);
  lecHeaderContent.appendChild(lecHeaderH1);
  lecHeader.appendChild(lecHeaderContent);
  el.appendChild(lecHeader);
}

function displayContent(el, lpContent) {
  const element = document.createElement('main');
  element.className = 'lecture-content';
  el.appendChild(element);

  const types = [
    'youtube',
    'text',
    'quote',
    'image',
    'heading',
    'list',
    'code',
  ];

  lpContent.forEach((k) => {
    const kt = k.type;
    const kd = k.data;
    let k0;
    switch (kt) {
      case types[0]:
        displayYoutubeVideo(element, kd);
        break;
      case types[1]:
        displayText(element, kd);
        break;
      case types[2]:
        k0 = k.attribute;
        if (k0 === undefined) k0 = '';
        displayQuote(element, kd, k0);
        break;
      case types[3]:
        k0 = k.caption;
        if (k0 === undefined) k0 = '';
        displayImage(element, kd, k0);
        break;
      case types[4]:
        displayHeading(element, kd);
        break;
      case types[5]:
        displayList(element, kd);
        break;
      case types[6]:
        displayCode(element, kd);
        break;
      default:
        break;
    }
  });
}

/**
 * Undirbýr birtingu efnis á fyrirlestur.html
 * Sækir gögn í sessionStorage eftir því hvaða fyrirlestur var smellt á
 * Kallar á displayHeader til að birta upplýsingar í header
 * Kallar a'displayContent til að birta restina af upplýsingunum
 */
function loadLecturePage(page) {
  const lectureData = JSON.parse(sessionStorage.getItem('data'));

  const lpCategory = lectureData.category;
  const lpTitle = lectureData.title;
  const lpImg = `url('/${lectureData.image}')`;
  const lpContent = lectureData.content;
  const lpSlug = lectureData.slug;
  displayHeader(page, lpCategory, lpTitle, lpImg);
  displayContent(page, lpContent);
  displayFooter(page, lpSlug);
}

/**
 * eventListener á DomContentLoaded
 * Keyrir mismunandi eftir því hvort fyrirlestur eða index hlóðst.
 */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');
  if (isLecturePage) {
    /**
     * Sækir gögn í sessionStorage eftir því hvaða fyrirlestur var smellt á
     * Ef DOM síðan sem hlóðst hefur class="lecture-page", þá er
     * kallað á fallið loadLecturePage
     */
    loadLecturePage(page);
    klaradButt = document.querySelector('.klarad');
    klaradButt.addEventListener('click', lecKlaradur);
    backButt = document.querySelector('.back');
    backButt.addEventListener('click', lecHome);
  } else {
    /**
     * Ef DOM síðan sem hlóðst er ekki "lecture-page", þ.e. "index.html" síðan,
     *  þá er eftirfarandi keyrt. Kóðinn fyrir forsíðuna er í list.js
     */
    const list = new List();
    list.load();
  }
});
