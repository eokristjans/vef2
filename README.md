# Vefforritun 2

## Háskóli Íslands

### Erling Óskar Kristjánsson, eok4@hi.is

#### Vor 2019

Mínar lausnir á verkefnum námskeiðisins ásamt glósum o.fl.


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



