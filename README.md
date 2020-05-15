# Vefforritun 2 / Web Development 2

## Háskóli Íslands / Univeristy of Iceland

### Erling Óskar Kristjánsson, eok4@hi.is

#### Spring 2019

This repository contains my notes and solutions to some of the projects from this class.

## Final Project

I designed and developed a website for taking notes, organizing them and storing them online so they can be accessed through any browser. The notes can be written in markdown with live rendering. I came up with the idea because I often write notes when learning something new. I like to write notes in markdown because it's easy to put in a code section and even some formulas (not supported by all converters), but I think that Google Colab is too heavy weight and can be a bit slow, and writing them directly on the computer requires that the correct tools are set up and you have to remember to push them to git so that you can access them from other devices. So I designed the page as I would like to have it, so that I can use it. The backend is a Restful API written in NodeJS with the Express Framework. hosted on Heroku [here](https://noteworthy-md-eok4.herokuapp.com/); the code for the backend is in the folder **h1**. The frontend is written in React with TypeScript and can be found in the folder **h2**. A detailed description of each of them and their functionalities can be found in corresponding README.md files.

****

Notes from classes...

## Fyrirlestur 4 - Öryggi - OWASP Top 10

### A10 Insufficient Logging and Monitoring
Ekki loggað nógu vel eða ekki fylgst nógu vel með þeim loggum.

Logga auditable atburði eins og CRUD aðgerðir.

Skrá niður hvað er gert svo hægt sé að fylgjast með.

Þ.á.m. innskráningar og tilraunir til að skrá sig inn.

Hvaðan koma þessir atburðir? Eru þeir óeðlilega miklir?

Er verið að eyða helling? Er það eðlilegt?

Hversu mikið á að logga? Hvaða gögn? 

Hvert á að logga? - Í skrá, eða þjónustu eins og pappartrail eða Sentry, eða Console eins og á Heroku.

Log levels:

  - error: Villa í forriti sem stöðvar keyrslu eða setur forrit í óræða stöðu, ætti ekki að koma upp.
  - warn: Eitthvað sem ætti ekki að koma fyrir, en ekki alvarlega villa. T.d. reynt að senda ógild gögn.
  - info: Upplýsingar um eitthvað, request á vefþjón, hlutur búinn til eða eytt.
  - debug: Upplýsingar sem hjálpa til við debug, oft mikið af upplýsingum.

`morgan` er NodeJS pakki sem loggar HTTP request á stöðluðu formi.
Settur sem middleware á express app. Þarf bara að sækja og stilla. 
Loggar í console log og skrár eins og *app.log* og *debug.log*.
`winston` er annar pakki sem leyfir logging. Hefur fleiri stillingar en winston.


### A9 - Using Components with Known Vulnerability
Muna að uppfæra modules og plugins á kerfum sem eru í notkun.

Hafa ferli til að uppfæra (gjarnan outsource-að).

Sjálfvirkar athuganir (GitHub gerir það).

Oft finnast veikleikar í mikið notuðum modules. 

Hættulegt að nota nákvæmar útgáfur af NPM pökkum.


### A8 - Insecure Deserialization
Gögn eru oft send á milli serialized (breytt í texta, t.d. Json) og sent á milli og síðan deserialized.
Jafnvel hægt að serialize-a fall og senda á server og keyra þar! 
Ef ekki er athugað hvort gögn séu í lagi eftir að vera deserialized geta opnast holur.


### A7 - Cross-side Scripting (XSS)
Óæskilegur kóði e rkeyrður af notanda í vafra.
Kóðinn hefur sömu leyfi og notandi og getur nálgast upplýsingar.
T.d. hægt að stela upplýsingum, leka upplýsingum, framkvæma aðgerðum.
**Lausn**: Hreinsa allt inntak frá notanda ALLTAF.

#### Reflected XSS
Skaðlegum kóða er komið fyrir t.d. í querystring og sendur fórnarlambi.
Kóði er keyrður þegar fórnarlamb opnar slóð.
Sbr. Phishing árásir eða stela aðgang. 
**Lausn**: Hreinsa allt inntak frá notanda ALLTAF.

#### Persistent XSS
Skaðlegur kóði er sendur í gagnageymslu t.d. gagnagrunn,
sem er síðan birt aftur seinna jafnvel hjá öðrum notendum.
Kóði er keyrður þegar gögn eru sótt.
Mjög alvarlegur galli.

XSS kemur **ekki** bara fram þegar við erum að vinna með form, 
heldur líka þegar við sækjum gögn t.d. í gegnum API
(því þar getur hafa verið XSS galli).

Http Headers get líka innihaldið XSS.

Það sem við erum að Logga (sbr A10) getur innihaldið XSS,
t.d. ef sá sem er að framkvæma requests (hér á server sem 
keyrir á localhost) gerir það með curl og breytir user-agent 
(hluti af request header) á eftirfarandi máta 
`curl -A "<script>alert(1)</script>" http://localhost:3000`

**Lausn:** NPM XSS library
```js
const xss = require('xss')
const clean = xss(req.body.value);
```

### A3 - Sensitive Data Exposure
Ef árasaraðili kemst yfir gögnin þín getur verið að viðkomandi geti lesið úr þeim eitthvað viðkvæmt.
Gott að hafa þau dulkóðuð eða aðskilin og tekin úr samhengi á bakenda.


### A2 - Broken Authentication
Árásaraðili stelur aðgangi annara með leka eða vegna öryggisgalla.
Erfitt að smíða auðkenningar- og session-kerfi rétt, viljum því nota trausta og prófaða pakka.
Galli getur verið í auðkenningunni sjálfri, útskráningu, session meðhöndlun, gleymdu lykilorðs virkni o.s.frv.

#### Lausnir: 
  - Banna stutt og þekkt lykilorð. Ef admin er með einfalt lykilorð getur hann sett aðra í hættu.
  - 2-factor authentication (lykilorð + t.d. SMS/email/auðkennislykill/fingrafar/auga/rödd).
    - SMS ekki mjög öruggt vegna social engineering við símafyrirtæki.
  - Geyma **aldrei** lykilorð í hreinum texta, ekki heldur í loggum. Henda beint í tætifall með *salti*!
  
```js
const bcrypt = require('bcrypt') // or 'bcryptjs' ??
```


### A1 - Injection
Ef gögn frá notanda eru ekki staðfest eða hreinsuð áður en 
þau eru notuð í skipanir getur það leitt til injection árása.
Árasaraðili útbýr texta sem nýtir sér galla til að ná sínu fram.

Getur átt sér stað í *XML*, *SMTP* (tölvupóstsamskipti), *OS* o.s.frv.

#### SQL Injection

**Lausn:** Hreinsa inntak. Nota parameterized viðmót.

```js
// Dæmi um parameterization í Javascript
const values = ['123', 'asdf'];
client.query(
  'INSERT INTO test (foo, bar) VALUES($1, $2)',
  values,
 );
```

### A8 (2013) - Cross Site Request Forgery (CSRF)
Árasaraðili setur hlekk hjá sér yfir á vef með ákveðinni aðgerð, 
ef notandi (sem smellir á hlekkinn) er auðkennur er aðgerðin keyrð.

```html
<img src="http://example.org/admin/delete-everything">
```

Erfitt að forðast, **Lausn:**
  - Biðja notanda að auðkenna sig áður en ákveðnar aðgerðir eru keyrðar.
  - Setja falið gildi í form sem er staðfest á bakenda.
    - T.d. `csurf` middleware býr til tímaháðan token.
  
    ```js
    const cookieParser = require('cookie-parser'); // til geyma cookies
    const csrf = require('csurf')
    const express = require('express')
    
    const csrfProtection = csrf({ cookie: true });
    
    //...
    
    app.get('/', csrfProtection, (req, res) => {
      // csrfProtection middleware mun kasta villu ef token er ekki réttur
      res.send(`
      <form method="post" action="/process">
        <input type="hidden" name="_csrf" value="${req.csrfToken()}">
        <input type="text" name="data">
        <button>Senda</button>
      </form>`);
      });
    ```

### Penetration test (*pentest*)
Próf á kerfi sem reynir að finna veikleika.
Jafnvel hægt að gera með pakka eða þekktu forriti.

Dæmi um forrit:
- Kali Linux
- Metasploit

Fleiri [hér](https://www.comparitech.com/blog/information-security/free-pentesting-tools/).


<hr>

## Fyrirlestur 5 - Auðkenning

### Basic Authentication
Notendanafn og lykilorð í header fyrir HTTP samskipti.
Þetta er ekki öruggt, og því nauðsynlegt að nota með HTTPS svo ekki sé hægt að sniffa það.
Ekkert sérstaklega gott, en mögulega nóg fyrir eitthvað mjög einfalt.



### Cookies
HTTP er stöðulaust. Notum því *Cookies* til að halda utan um upplýsingar um notendur.

*Session* er þegar við notum *cookie* til að geyma auðkenni/vísun í notanda.

**Notum *Session* en ekki *Cookie* til að geyma gögn um notanda!!** (Sjá neðar).

Geymdar sem enkóðaður querystring t.d. `foo=bar&bar=baz`.

Cookie inniheldur:
- nafn
- gildi
- expiration date
- slóð (allur vefur eða hluti)
- lén (öll lén eða nákvæmlega einu)
- Lén verður að innihalda a.m.k. einn punk svo *localhost* virkar ekki en *127.0.0.1* virkar.
- Örugg kaka er bara sent yfir HTTPS.
- Getum bannað JavaScript virkni að nálgast köku (setja HTTP only)
- Signed cookie eru vistaðar sem gildi + undirskrift sem fengin er út frá leyndarmáli (geymt á server).
  - `undirritun = hash(value + secret)`


Nálgumst cookie með `document.cookie`

Cookies í Express:

```js
res.cookie(name, value [, options]); // setja
res.cookie(
    '2min', 
    'cookie expirsed in 2 minutes', 
    { domain: cookieHostname, expires: new Date(Date.now() + 120000) },
);
res.clearCookie(name [,options]); // eyða

// getur ekki lesið eða passað cookies með express, notum:
const cookieParser = require('cookieParser');
app.use (cookieParser(cookieSecret)); // secret notað við dulkóðun
req.cookies; // inniheldur cookies

```

#### Cookie types
- Session Cookie: Engin skilgreind lokadagsetning.
- Persistent Cookie: Með lokadagsetningu.
- 3rd Party Cookies: Ef tvær eða fleiri síður sækja gögn frá sama domain getur það domain sett cookies og viðað hvaðan komið er (t.d. auglýsendur eða aðrar þjónustur)
  - Google Analytics heldur utan um hvaða síður þú ferð á, hve lengi þú varst á honum o.fl. og deilir upplýsingum til annara vefsíðna sem nota það
  - *Ghostery* extension blokkar 3rd party cookies.
  - Hægt að vera með Facebook í einum vafra, Google í öðrum, og browse-a í þriðja til að koma í veg fyrir dreifingu.
  - GDPR löggjöf: Verður að fá *upplýst samþykki* frá notanda *áður* en cookie er sett. Notendur hafa líka réttindi til að láta gleyma sér - eyða **öllum** gögnum frá þjónustu.


### Session

Engin gögn geymd í session cookie, aðeins vísun (yfirleitt dulkóðuð og breytt reglulega).

Notum `express-session` middleware sem inniheldur CookieParser.

Sjálfgefið geymt session í minni, en hægt að vista til lengri tíma í gagnagrunni.

```js
const session = require('express-session'); 
```  


### Notendaumsjón & Auðkenning

`passport.js` er mest notaða leiðin til að halda utan um auðkenningu í Express.

Notum `local` strategy til að auðkenna. Einnig hægt að sækja Google, Facebook, o.fl. 3rd parties.

Þurfum að hafa Serialize og Deserialize fyrir notandann, til að vita hvað við viljum geyma um hann.

Sjá [passport.js](../vef2-19-master/fyrirlestrar/05/daemi/auth/04.passport.js) úr fyrirlestri 5.


<hr>


## Fyrirlestur 5.2 - Twelve-Factor App

Samansafn af 12 atriðum sem hjálpar okkur að skrifa forrit sem auðvelt er að reka.

DevOps hugmyndarfræði.

### 1. Codebase

One codebase tracked in revision (source) control.

Many deploys of the same codebase for each purpose like production, staging and for each developer.

### 2. Dependencies

Explicitly declare and isolate dependencies. Never assume anything. `package.json` declares these.

### 3. Config

Store config (that differ between deploys) in the environment.

This includes databases, login info etc.

we can keep this in `process.env`

### 4. Backing services

Treat _backing services_ as attached resources.

A backing service is a service that we need for software and we retrieve over the internet 
(E.g. databases, web services etc.).

The app connects via URL and does not distinguish between a local or 3rd party service.

Heroku has a lot of add-ons, like `Heroku postgres`


### 5. Build, release, run

Strictly separate build and run stages.

Code is changed to deploy in these three steps.


### 6. Processes

Execute the app as one or more stateless processes.

We run an app with one or more stateless process. Each deploy is stateless and shares nothing with other deploys.

Thus we can't save anything to memory on Heroku. Not files and not even the session. Need to use _backing services_.

Define how heroku should run the app in `procfile`.

### 7. Port binding

Export services via port binding.

App binds itself to ports in running environment and listens to instructions coming from that port.

### 8. Concurrency

Scale out via the process model.

Design our software so that they can utilize various _process types_ (e.g. `web` for web traffic and `worker` for data processing or something that takes longer).

Heroku can add more _dynos_ (containers that run our programs) on demand, which scales very well. We can define how much our app can scale.

### 9. Disposability

Maximize robustness with fast startup and graceful shutdown.

Make sure not to store any data in memory for any prolonged time.

### 10. Dev/proc parity

Keep development, staging and production as similar as possible...

in order to speed up deployment, reduce the gap between development and operations, tools that are used etc. 

Includes keeping the same database scheme in development and deployment.

Should be able to deploy often per day without any issues, because if it worked locally and we push to master it should still work.

### 11. Logs

Treat logs as event streams.

App shouldn't think about logging, just writing out what happens. 

During development, the developer pays attention to the console. 

Specific _backing services_ can keep track of logs from production deployment.


### Admin processes

Run admin/mgmt tasks as one-off processes.

These include tasks that are not part of daily deployment (e.g. create database, reorder database, clean up data).

This can be done with `heroku run <script>`.



## Fyrirlestur 6.1 - Vefþjónustur

Í grunnin: samskipti milli tölva yfir net.

- Remote Procedure Calls (RPC): Kallað á fall í annari tölvu.
- XML-RPC: Kall kóðað í XML og sent yfir HTTP.
- Service Oriented Architecture (SOA): Hönnunar og arkítektúra mynstur, hugbúnaður veitir virkni sem þjónustu.
- WSDL: Lýsing á þjónustu og samskiptum sem byggir á XML
  - Týpur (einfaldar og flóknar)
  - Aðgerðir og inntak/úttak
  - Endapunkt (hvert á að kalla á þjónstuna)
  - Langoftast eru notuð tól sem búa til kóða útfrá WSDL (stór og mikil XML skjöl)
- SOAP: Sett inní Envelope með (valkvæmum) header og body.
- Monolith: 
  - Kerfi sem eru stór og innihalda næstum alla virkni (business, application logic o.fl.)
  - Getur verið erfitt að viðhalda.
- Microservice: 
  - Nýleg túlkun á SOA til að útfæra dreifð kerfi.
  - Einblínir á að skipta forriti upp í lauslega tengda hluta.
  - Góð hugmynd en krefst mikils aga og skipulags í útfærslu.

### HTTP Aðferðir
- GET
- POST
- PATCH: Uppfærir aðeisn þá hluta einingar sem eru sendir.
- DELETE
- PUT: Blanda af POST og PATCH... yfirskrifar mögulega með tómum gildum í request body?
- HEAD: Sækir bara haus.

Örugg aðgerð: Breytir engri stöðu (GET og HEAD). Annars óörugg.

Idempotency (æ-dem-pó-tent): Ef kallað á þær mörgum sinnum með sömu skilyðrum hefur sömu áhrif og á að kalla einu sinni (sér í lagi PUT og DELETE, en líka GET og HEAD).


### Stöðukóðar
- 1xx Til upplýsinga
- 2xx Success
  - 200 OK
  - 201 Created
  - 202 Accepted (beiðni móttekin en aðgerð er ekki lokið)
  - 204 No Conent (t.d. vegna þess að einhverju var eytt)
- 3xx Redirection
  - 301 Moved Permanently
  - 304 Not Modified (ekkert hefur breyst síðan í fyrri beiðni m.v. `If-Modified-Since` eða `If-None-Match` hausa - notað með *caching*).
- 4xx Villa hjá client
  - 400 Bad Request (villa hjá client t.d. gögn ekki gild)
  - 401 Unauthorized (Auðkenningar er krafist)
  - 403 Forbidden (Uppgefin auðkenning hefur ekki aðgang)
  - 404 Not Found
  - 451 Unavailable for Legal Reasons
- 5xx Villa hjá server
  - 500 Internal Server Error (kemur líka ef engin villumeðhöndlun var skilgreind á Express netþjón).
  - 501 Not Implemented (Server skildi svar en kann ekki (ennþá) að svara).
  - 503 Service Unavailable (Server getur ekki svarað t.d. vegna anna).

### Representational State Transfer (REST)

Hunsar útfærslu og samskipti en einblínir á hlutverk eininga, samskipti þeirra á milli og takmarkanir þar á.

1. Samræmt viðmót aðskilur Client og Server.
2. Stöðulausar: Engin staða er geymd milli beiðna.
3. Cacheable: Client getur geymt afrit af svari, svör verða því að skilgreina hvort það megi eða ekki. Getum þannig skilgreint hvort þau hafi breyst (t.d `lastModifed`)
4. Lagskipt kerfi: Client þarf ekki að vita hvort hann sé tengdur enda-server eða hvort hann tengist einhverjum millilið (proxy).
5. Code on demand (valkvæmt): Servers geta útvíkkað eða breytt hegðun hjá Client tímabundið með því að senda client-side scripts eða þýdd applets. 
6. Samræmt viðmót: 
      - Grunnur á hönnun á REST þjónustu (einfaldur og aðskildur arkítektúr þ.a. client og server geta vaxið óháð hvor öðrum). 
      - Sjálf-lýsandi skilaboð: Vitum alltaf nóg til að geta unnið með skilaboðin.

Hypermedia As The Engine Of Application State (HATEOAS): Client þarf engar frekari upplýsingar en þær sem hann fær í byrjun (svipað WSDL).

##### Notum:
- URI fyrir auðlindirnar okkar - nafnorð
- Content Types fyrir framsetningu
- HTTP aðgerðir til að tilgreina hvað við ætum að gera - sagnorð


##### RESTful 
- Json
- HTTP aðgerðir
- Stöðukóði.

Annað liggur milli hluta.

Gerum okkar besta í að gera þjónustu sem er þægilegt að nota, fyrir forritara og notendur.

##### REST tól

- Postman
- cURL
- JSON Formatter extension


### REST & express

app.use(express.json()) í stað url-encoded

res.json({ data: 'foo' }); í stað res.render(..);

Ef beðið um lista af færslum og hann er tómur þá svörum við samt 200 OK.


### Hönnun

- Samræmi á heitum (ekki nota username, userName og user-name)
- Samræmi á URI (ekki /get-users og svo /products)
- Samræmi á villuskilaboðum

Hugsum heildstætt. Hvað gerist í hverju tilfelli?
- Hvað gerist ef beðið um eitthvað sem eru ekki til?
- Hvað gerist er (óþekkt) villa kemur upp?
  - Debugging og logs

##### Dýnamískar fyrirspurnir

- Stundum þarf að undirbúa fyrirspurnir með strengjameðhöndlun, ekki bara prepared statement. T.d. ef boðið er upp á `ORDER BY id ASC` eða `... DESC`.
- Eins með update statement, þegar það á bara að uppfæra eitthvað ákveðið.
- Þarf að fara einstaklega varlega til að koma í veg fyrir SQL injection árásir.

```javascript
async function list(req, res) {
  const asc = req.query.order === 'ASC';

  // röðum eftir id í ascending (ASC) eða descending
  // (DESC) röð eftir því hvort boolean gildi sé
  // satt eða ekki
  // Notum ekkert frá notanda í dýnamískrí fyrirsp.
  // GETUM AÐEINS HAFT TVÖ GILDI!
  const order = asc ? 'id ASC' : 'id DESC';

  const q = `SELECT * FROM items ORDER BY ${order}`;

  const result = await query(q);
}
```


##### Færslur búnar til

* Getum notað `RETURNING` syntax í postgres til að fá til baka færslu sem búin var til
* Þurfum ekki aðra fyrirspurn til að fletta upp reitum eins og `id` eða `created`
* `INSERT INTO items (text) VALUES ('foo') RETURNING id, text, created;`
* Eyðing: `return (await query('DELETE FROM foo WHERE id = $1 RETURNING *', [id])).rows === 1;` sem skilar True ef nkl. einni færslu var eytt.


## 7.1 Redis

NoSQL (non relational) gagnataga geymsla (key-value store) í skyndiminni.

Gjarnan notuð fyrir gildi sem *mega gleymast*. 

Gjarnan notað fyrir caching og session store.

```redis
SET hello "hello world" EX 10 // 10 sek líftími
GET hello // skilar "hello world", eða null ef ekki til

MSET hello "hello world" foo "bar" // Set many
```

Hægt að sækja alla lykla með `KEYS *`. Sjá [allar skipanir](https://redis.io/commands).

Hægt að nota með `redis-cli`.

Hægt að setja upp `heroku redis` og npm pakka `npm install redis`.

Þurfum að nota `util.promisify()` til að nota `async - await`.

Þurfum að hætta keyrslu með `client.quit()` svo þetta hætti keyrslu á event-loop, nema það sé fast við `express`, þá hættir þau keyrslu saman.

```js
const client = redis.createClient({
  url: redisUrl
});
const setAsync = promisify(cilent.set).bind(client);

awaiit setAsync('hello', 'hello world', 'EX', 10);

client.quit();
```


#### redis session storage

```js
const RedisStore = require('connect-redis')(session);

app.use(session({
  // ...
  // session hættir því að renna út þegar server hættir/pásar keyrslu (eða client?)
  store: new RedisStore({ url: redisUrl }),
}));
```

#### redis sem cache

Notum JSON með því að keyra `stringify` á gögn.

```js
const cached = fromCache(key);

// If data is cached, return it
if (cached) {
  return cached;
}

// Otherwise, perform expensive operation 
const result = expensiveOperation();

// Store result in cache
cache(key, result, expires);

// Return result
return result;
```


## 7.2-3 Vefþjónustur 

### Auðkenning

Notum ekki session því þau skalast illa.

#### Tokens

Búum til undirritaða *tokens*.

Getum stýrt því hvaða upplýsingar eru geymdar.

Auðvelt að senda á milli í single sign-on kerfum.

Vefþjónn undirritar *token* með dulkóðunaraðferð og földum lykli.

Client fær token og geymir, sendir hann með hverri request þar til auðkenningar (Authorization header).

#### JWT (JSON Web Tokens)

Tryggja að JSON hlutir sendir á milli hafi ekki verið breytt.

Byggja á því að base64 kóða upplýsingar og undirrita með leyndarmáli.

Hefur verið gagnrýndur fyrir **að vera ekki nógu vel skilgreindur og óöruggur**.

Notum til að vita að sá sem heldur á token hafi á einhverjum tímapunkti auðkennt sig gagnvart okkur. Geymir **engar** viðkvæmar upplýsingar í token (það með hvorki netfang né lykilorð, en þó mögulega notendanafn).

*Log me out from all devices* eyðir því vanalega tokens.

Notum `passport-jwt` npm pakkann og undirritum með `jsonwebtoken`.

Þurfum ekki session og þurfum ekki að framkvæma *(de)serialize* á notanda.

Þarf að passa upp á þessi *tokens* því handhafi þeirra getur gert allt eins og hann sé skráður inn, eins og hann sé með notandanafn og lykilorð.

Þurfum að staðfesta token í hvert skipti sem notandi biður um eitthvað sem krefst auðkenningar.

Geymum `JWT_SECRET` í `.env` skrá, sem má alls ekki leka út því þá væri hægt að undirrita hvað sem er og þykjast vera hvaða notandi sem er í kerfinu án þess að hafa lykilorðið hans (þarf samt að hafa hvað annað sem notað er til að búa til token).

Sjá [vef2-19-master/07/daemi/jwt/app.js](../vef2-19-master/fyrirlestrar/07/daemi/jwt/app.js).


### Paging

Takmarka hversu miklu er skilað þegar gögn eru sótt (viljum ekki endilega allt í einu). Það er yfirleitt útfært með *síðum*.

#### Síður

Takmarkast af fjölda færsla per síðu (limit) og hve mörgum við sleppum (offset).

`limit=10, offset=10` birtir færslur 11-20. Hægt að skilgreina `page=1` sem færslur 1-10, `page=4` sem færslur 31-40 etc.

RFC 5988 staðallinn skilgreining *web linking* og hvernig nota megi í hausnum hlekk. Hypertext application language (HAL) skilgreinir hvernig tengja megi saman síður:

```json
"_links": {
  "self": {
    "href": "http://api.example.com/?page=2"
  },
  "previous": {
    "href": "http://api.example.com/?page=1"
  },
  "next": {
    "href": "http://api.example.com/?page=3"
  },
  "items": [
    // items á þessari page
  ]
}
```

Bætta má við heildarfjölda síðna.

Getum sent `offset` og `limit` í postgres query með `SELECT * FROM foo OFFSET 0 LIMIT 10` (sendum parameterized gildi). Rétt eins og ef við gerum `SELECT * FROM foo` úr stórri töflu þá birtir kerfið t.d. 10 línur í einu á skipanalínu og við ýtum á Spacebar til að fá næstu 10.



### Leit

**Table Scan**: `Where description LIKE '%foo%'` leit í gagnagrunni er ekki góð (línuleg leit og samaburður við öll stök).

Notum því frekar **Index** fyrir töflu, veljum einhverja dálka og geymum þá sérstaklega. Getum þurft sérstaka uppsetningu í gagnagrunn.

Önnur lausn er að vera með **Leitarþjónustu**, t.d. `elasticsearch` og `algolia`.

#### Leit í Postgres (nokkuð góð)

Leitar m.t.t. málfræði (allavega ensku).

Skilgreinum í hvaða dálk við leitum og eftir hverju í `to_tsvector` eða `plainto_tsvector` og `to_tsquery`. T.d.

```sql
SELECT title 
FROM pgweb
WHERE
  -- leita í body dálknum
  to_tsvector('english', body)
  @@
  -- eftir 'friend' og svipuðum orðum eins og 'friends' og 'friendship' og e-h
  to_tsquery('english', 'friend')
```


#### Caching

1. Ferskleiki: Gefinn tími sem gögn eru *fersk* og ekki þarf að sækja aftur á vefþjón, t.d. með `Cache-Control: max-age=100` haus sem væru þá 100 sek.
2. Staðfesting: Getum fengið staðfestingu hvort gögn séu enn í lagi t.d. með `If-Last-Modified` haus og `ETag` haus. 
3. Ógilding: Ef við breytum gögnum getum POST, PUT og DELETE þá er cache hreinsað.

##### Hverjir og hvar er cache-að

- Vafrar 
- Proxy: t.d. hjá fyrirtæki eða ISP 
- Gateway: t.d. sett upp fyrir framan bakenda til að draga úr þörf á að sækja sama efnið oft.


##### Content Delivery Network (CDN)

Sér um að dreifa efni um heiminn og gera aðgengilegra hraðar.

Gagnaver á mismunandi stöðum um heiminn.

##### Forrit sem cache-a

- Cache á gildi sem tekur langan tíma að reikna.
- Cache á síðu sem er lengi að vera búin til (t.d. vegna margra uppfletting í gagnagrunni)
- Cache á gögnum frá (öðrum) API

Stundum er cache-að t.d. listi yfir fréttir og geymdur í 5 mín, og svo er ný frétt send inn en hann birtist ekki á listanum fyrr en hann verður endurnýjaður.


#### Pakkar 

Sem hjálpa til við framendagerð, til að skrifa kóða sem getur bæði keyrt í vafra (client með global `window`) og á server (node umhverfi með global `process`):

- `request`
- `axios`
- `node-fetch` - Bara til að nota fetch í node. Hjálpar ekki við að nota það á vafra, þurfum þar `isomorphic-fetch`.
- `isomorphic-fetch` - Í dag er svona kóði kallaður *universal* frekar en *isomorphic*. Kallast *server-side rendering* þegar það er að hluta eða öllu leyti render-að á server.

### `fetch` notkun

Búa til request, t.d. `fetch(url)` framkvæmir `GET` á `url` og skilar Promise. Hægt að gera með `async await`. Getum líka set headers og framkvæmt aðrar Http Requests. 

Fáum til baka `response` hlut og `response.ok` ef svarkóði er á bilinu 200-299.

Þurfum að vita á hvaða sniði svarið er, t.d. `response.json()` en fyrir binary gögn þá `response.blob()`.

Setjum `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` og `Access-Control-Allow-Headers` í *header* í HTTP svör á server (stillt fyrir Express app) til að leyfa öðrum vefforritum að tengjast okkar vefþjónustu.


