/**
 * Tæmir HTML element
 */
export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}


/**
 * Fyrir: Element el, almennt .list
 *        lectInfo er fylki með útvöldum strengjum úr lectures.json
 *          þeir innihalda title, category og thumbnail
 * Eftir: Smíðar eftirfarandi HTML element og setur það inní <div class="grid__row list">
        <div class="grid__col">
          <div class="lecture">
            <div class="lecture__title"><h2 class="headline2">lectureTitleString</h2></div>
            <div class="lecture__category"><h3 class="headline3">lectureCategoryString</h3></div>
            <div class="lecture__image"><img src="lectureThumbString" alt="" class="img"></div>
          </div>
        </div>
 */
function displayLectureOnIndex(el, lectInfo, lectData) {
  const element = el;
  const lectureTitleString = lectInfo[0];
  const lectureCategoryString = lectInfo[1];
  let lectureThumbString = lectInfo[2];
  const lectSlug = lectData.slug;
  const savedSlug = window.localStorage.getItem(lectSlug);


  if (lectureThumbString === undefined) lectureThumbString = '';
  // Númer 1
  const gridCol = document.createElement('div');
  gridCol.className = 'grid__col';
  // Númer 2
  const lecture = document.createElement('div');
  lecture.className = 'lecture';
  // 3 hlutir inní Númer 2
  const lectureTitle = document.createElement('div');
  lectureTitle.className = 'lecture__title';
  const lectureCategory = document.createElement('div');
  lectureCategory.className = 'lecture__category';
  const lectureImage = document.createElement('div');
  lectureImage.className = 'lecture__image';
  // 3 hlutir, einn inní hvern ofangreindra hluta
  const lectureTitleH2 = document.createElement('h2');
  lectureTitleH2.className = 'headline2';
  let lectureTitleH2Check;
  if (savedSlug) {
    lectureTitle.style.display = 'inline-flex';
    lectureTitleH2.style.width = '50%';
    lectureTitleH2.appendChild(document.createTextNode(lectureTitleString));
    lectureTitleH2Check = document.createElement('h2');
    lectureTitleH2Check.className = 'headline2';
    lectureTitleH2Check.style.width = '50%';
    lectureTitleH2Check.style.textAlign = 'right';
    lectureTitleH2Check.style.color = '#2d2';
    lectureTitleH2Check.appendChild(document.createTextNode('✔'));
  } else {
    lectureTitleH2.appendChild(document.createTextNode(lectureTitleString));
  }
  const lectureCategoryH3 = document.createElement('h3');
  lectureCategoryH3.className = 'headline3';
  lectureCategoryH3.appendChild(document.createTextNode(lectureCategoryString));
  const lectureImageImg = document.createElement('img');
  lectureImageImg.className = 'img';
  lectureImageImg.src = lectureThumbString;

  // Púslum þessu saman
  lectureTitle.appendChild(lectureTitleH2);
  if (savedSlug) {
    lectureTitle.appendChild(lectureTitleH2Check);
  }
  lectureCategory.appendChild(lectureCategoryH3);
  lectureImage.appendChild(lectureImageImg);
  lecture.appendChild(lectureTitle);
  lecture.appendChild(lectureCategory);
  lecture.appendChild(lectureImage);
  gridCol.appendChild(lecture);
  element.appendChild(gridCol);
}

function allEqual(arr) {
  return new Set(arr).size === 1;
}

export function displayAllLecturesOnIndex(el, lectKeys, allLects, buttonBool) {
  const element = el;
  const lectureKeys = lectKeys;
  const allLectures = allLects;

  allLectures.forEach((k) => {
    const lectureInfo = [k[lectureKeys[0]], k[lectureKeys[1]], k[lectureKeys[2]]];
    const category = lectureInfo[1];
    if (allEqual(buttonBool)) {
      displayLectureOnIndex(element, lectureInfo, k);
    } else if (buttonBool[0] && category === 'html') { // Ef það er klikkað á html takkann til þess að sía síðu
      displayLectureOnIndex(element, lectureInfo, k);
    } else if (buttonBool[1] && category === 'css') { // Ef það er klikkað á css takkann til þess að sía síðu
      displayLectureOnIndex(element, lectureInfo, k);
    } else if (buttonBool[2] && category === 'javascript') { // Ef það er klikkað á js takkann til þess að sía síðu
      displayLectureOnIndex(element, lectureInfo, k);
    }
  });
}

// ***** Byrjun á safni falla til að birta efni á fyrirlestur.html ***** //

export function displayYoutubeVideo(el, data) {
  const div = document.createElement('div');
  div.className = 'lecture-video';
  const lecVideo = document.createElement('iframe');
  lecVideo.className = 'iframe';
  lecVideo.src = data;
  div.appendChild(lecVideo);
  el.appendChild(div);
}

export function displayText(el, data) {
  const div = document.createElement('div');
  div.className = 'lp-div';
  const textArray = data.split('\n');
  textArray.forEach((k) => {
    const p = document.createElement('p');
    p.className = 'lp-p';
    p.appendChild(document.createTextNode(k));
    div.appendChild(p);
  });
  el.appendChild(div);
}

export function displayQuote(el, data, attribute) {
  const bq = document.createElement('blockquote');
  bq.className = 'lp-div lp-bq';
  const p0 = document.createElement('p');
  p0.appendChild(document.createTextNode(data));
  bq.appendChild(p0);
  if (attribute !== '') {
    const p1 = document.createElement('p');
    p1.className = 'lp-p';
    p1.appendChild(document.createTextNode(attribute));
    bq.appendChild(p1);
  }
  el.appendChild(bq);
}

export function displayImage(el, data, caption) {
  const div = document.createElement('div');
  div.className = 'lp-image';
  const img = document.createElement('img');
  img.className = 'lp-img';
  img.src = data;
  div.appendChild(img);
  el.appendChild(div);
  if (caption !== '') {
    const cite = document.createElement('cite');
    cite.appendChild(document.createTextNode(caption));
    div.appendChild(cite);
  }
}

export function displayHeading(el, data) {
  const h2 = document.createElement('h2');
  h2.className = 'lp-h2';
  h2.appendChild(document.createTextNode(data));
  el.appendChild(h2);
}

export function displayList(el, data) {
  const ul = document.createElement('ul');
  ul.className = 'lp-ul';
  data.forEach((k) => {
    const li = document.createElement('li');
    li.className = 'lp-li';
    li.appendChild(document.createTextNode(k));
    ul.appendChild(li);
  });
  el.appendChild(ul);
}

// TODO bæta við tómum línum eftir fyrirsögn og fyrir lista í markdown'inu
export function displayCode(el, data) {
  const div = document.createElement('div');
  div.className = 'lp-div';

  const textArray = data.split('\n'); // Virðast vera tvö \n á eftir ### Markdown fyrirsögn
  textArray.forEach((k) => {
    const code = document.createElement('code');
    code.className = 'lp-code';
    code.appendChild(document.createTextNode(k));
    div.appendChild(code);
  });
  el.appendChild(div);
}

// ***** Endir á safni falla til að birta efni á fyrirlestur.html ***** //
