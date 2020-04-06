# Lokaverkefni - Bakendi

## Glósur höfundar

Skráin `reqs.txt` inniheldur þær skipanir sem voru framkvæmdar til að setja upp þróunarumhverfi. 
Hins vegar ætti að duga að keyra `npm install` og svo `npm setup`.


# Project Description

This is a platform where students can share their experiences from the University of Iceland. 
They can write blog posts about their classes, the teachers and other interesting things.

#### Optional TODO: Skip comments and implement logging.

## Functional requirements

Create a web service with:

* User Management
  * Users can register and login using their HÍ email address.
  * Users need to be approved by an admin.
  * Admins can make other users into admins.
  * Users can change, create and delete their own *Blog Posts*.
  * Users can write comments under blog posts and press an *Agree* button.
  * Users can change their password.
  * Admins can update the *About* section.
  * Admins can delete any *Blog Post*.
  * Admins can block other users.
* Blog Posts
  * With *Tags* that can be used to filter the list of blog posts.
  * It will also be possible to search for blog posts.
  * Written in [Markdown with rendering and live preview](https://www.npmjs.com/package/react-markdown-renderer).
  * Stored in database on the server.
  * (Optional) Upload images through the platform that can be stored on [Cloudinary](https://cloudinary.com/) 
    and the link will be embedded into the markdown-formatted blog post.
* Comments
  * With sanitazion and validation.
  * (Optional) Spam and/or toxic comment filter.
  * (Optional) Response to another comment.
* Agree (*Second that!* / *I approve this message!*)


## Technical requirements

* Back-end 
  * Web Service should be a REST API created using `express`
  * It should have `GET`, `POST`, `PATCH` and `DELETE` endpoints.
* Data
  * PostgreSQL must be used as a DB.
  * All data provided by the user must be validated and sanitized, using `xss`.
  * There should be a way to populate the DB with data.
  * Fake blog posts created with `faker`.
* User Management
  * You should be able to register a user and login.
  * JWT with Passport should be used for authentication.
  * Passwords should not be present on this list of [500 bad passwords](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/500-worst-passwords.txt).
  * (Optional Extra) Limited number of login attempts permitted.

* Front End
  * Written in React.
  * (Optional) Written with TypeScript.
* README
  * The root of the project should have a README file that includes:
    * Information on how to setup and run the project.
    * Request examples to the API.
    * Valid login credentials for an admin user.
* Other
  * The project should be running on Heroku.
  * (Optional) The project uses pagination.


## Database Tables

* Tags
  * Id, integer, assigned by default.
  * Title, unique, not null.
* Blog Posts
  * Id, integer, assigned by default.
  * Title, unique, not null.
  * Description, text or blob, not null.
  * Image, text, url to image.
  * List of TagIds, [array of integers](https://www.postgresql.org/docs/9.1/arrays.html).
  * UserId, integer, assigned by default.
  * Date Created, assigned by default.
  * Date Modified, assigned by default.
  * CommentArray, array of CommentIds
  * NumberOfComments, nonnegative integer, default 0.
  * NumberOfLikes, nonnegative integer, default 0.
  * List of CommentIds, [array of integers](https://www.postgresql.org/docs/9.1/arrays.html).
  * List of LikeIds, [array of integers](https://www.postgresql.org/docs/9.1/arrays.html) (TODO: MIGHT BE UNNECESSARY)
* Users
  * Id, integer, assigned by default.
  * Username, unique, not null.
  * Email, unique, not null.
  * Password, not null, at least 8 characters and not in this list of [500 bad passwords](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/500-worst-passwords.txt), stored as a hash from `bcrypt`.
  * Admin, boolean, default  `false`.
  * Approved, boolean, default  `false`.
  * Date Created, assigned by default.
  * 3 more optional:
    * Number of posts, nonnegative integer, default 0.
    * Number of comments, nonnegative integer, default 0.
    * Number of likes, nonnegative integer, default 0.
* Comments
  * Id, integer, assigned by default.
  * Description, text, not null.
  * UserId, integer, assigned by default. (TODO: Username better? Would have to create *indices* for the usernames in db?)
  * BlogId, integer, assigned by default.
  * ResponseToCommentId, integer. (TODO: Username of commenter better?)
  * DateCreated, assigned by default.
* Likes
  * Id, integer, assigned by default.
  * UserId, integer, assigned by default.
  * BlogId, integer, assigned by default.
  * DateCreated, assigned by default.

Tables should have unique Ids and use [foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) to point to other tables.


# Hópverkefni 1 - 2019

## Verkefnalýsing 

Útfæra skal vefþjónustur fyrir vefbúð með:

* Notendaumsjón
  * Stjórnendur sem geta breytt, bætt við, og eytt bæði vörum og flokkum, og skoðað pantanir
  * Notendum sem geta „verslað“ með því að setja í körfu og sent inn pöntun
* Vörum
  * Eftir flokkum
  * Eftir leit
* Gervivörum útbúnum með faker

## Notendaumsjón

Notendaumsjón skiptist í tvennt: stjórnendur og venjulega notendur. Stjórnendur geta átt við gögn í búð og skoðað pantanir. Notendur geta aðeins útbúið körfu, bætt vörum við körfu og breytt körfu í pöntun.

Nota skal JWT með passport og geyma notendur i gagnagrunni. Útfæra þarf auðkenningu, nýskráningu notanda og middleware sem passar upp á heimildir stjórnenda og notenda.

Útbúa skal í byrjun einn stjórnanda með notandanafn `admin` og þekkt lykilorð, skrá skal hvert lykilorð í `README` verkefnis. Stjórnendur geta gert aðra notendur að stjórnendum.

Notendur sem ekki eru innskráðir geta skoðað vörur og leitað í þeim.

## Töflur

* Flokkar
  * Titill, einstakt gildi, krafist
* Vörur
  * Titill, einstakt gildi, krafist
  * Verð, heiltala, krafist
  * Lýsing, lengri texti, krafist
  * Mynd, ekki krafist, url á mynd
  * Dagsetningu sem vöru var bætt við, útbúið sjálfkrafa
  * Flokkur, krafist, vísun í flokkstöflu
* Notendur
  * Notendanafn, einstakt, krafist
  * Netfang, einstakt, krafist
  * Lykilorð, krafist, a.m.k. 8 stafir og ekki í [lista yfir algeng lykilorð](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/500-worst-passwords.txt) geymt sem hash úr `bcrypt`
  * Stjórnandi, biti, sjálfgefið `false`
* Körfur/pantanir
  * Vísun í notanda
  * Pöntun, biti, `true` ef pöntun, annars túlkað sem karfa
  * Nafn, strengur, krafist ef pöntun (ekki í gagnagrunn)
  * Heimilisfang, strengur, krafist ef pöntun (ekki í gagnagrunn)
  * Dagsetningu sem pöntun var búin til
* Vörur í körfu/pöntun
  * Vísun í körfu/pöntun
  * Vísun í vöru
  * Fjöldi, heiltala stærri en 0

Töflur skulu hafa auðkenni og nota [_foreign keys_](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) þegar vísað er í aðrar töflur.

## Gögn

Þegar verkefni er sett upp skal útbúa gervigögn fyrir búð með [faker](https://github.com/Marak/faker.js):

* Flokkar, a.m.k. 12 einstakir flokkar (nota skal `commerce.department`)
* Vörur, a.m.k. 1000 vörur (nota skal gildi úr `commerce` og `lorem.paragraphs`)
  * Hver vara skal vera í einum af útbúnum flokk af handahófi
  * Hver vara skal velja eina mynd af handahófi úr gefnum myndum

## Myndir

Gefnar eru myndir fyrir vörur í `img/`.

Allar myndir skal geyma í [Cloudinary](https://cloudinary.com/), bæði þær sem settar eru upp í byrjun og þær sem sendar eru inn gegnum vefþjónustu.

Aðeins ætti að leyfa myndir af eftirfarandi tegund (`mime type`):

* jpg, `image/jpeg`
* png, `image/png`
* gif, `image/gif`

[Þó svo að Cloudinary styðji fleiri tegundir](https://cloudinary.com/documentation/image_transformations#supported_image_formats), þá er hægt að staðfesta að við höfum mynd _áður_ en uploadað á Cloudinary.

## Vefþjónustur

Útfæra skal vefþjónustur til að útfæra alla virkni. Nota skal `JSON` í öllum samskiptum (má sleppa þegar vara er búin til, sjá að neðan).

GET á `/` skal skila lista af slóðum í mögulegar aðgerðir.

### Notendur

* `/users/`
  * `GET` skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi
* `/users/:id`
  * `GET` skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi
  * `PATCH` breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er stjórnandi og er ekki að breyta sér sjálfum
* `/users/register`
  * `POST` staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera stjórnandi
* `/users/login`
  * `POST` með netfangi og lykilorði skilar token ef gögn rétt
* `/users/me`
  * `GET` skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður
  * `PATCH` uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður

Aldrei skal skila eða sýna hash fyrir lykilorð.

### Vörur

* `/products`
  * `GET` Skilar síðu af vörum raðað í dagsetningar röð, nýjustu vörur fyrst
  * `POST` býr til nýja vöru ef hún er gild og notandi hefur rétt til að búa til vöru, aðeins ef notandi sem framkvæmir er stjórnandi
  * Bæði er í lagi að taka við gögnum sem `form data` þar sem bæði mynd og gögn eru send inn, eða sem `JSON` og útfæra annað route sem tekur við mynd og festir við vöru, t.d. `POST /products/{id}/image`
* `/products?category={category}`
  * `GET` Skilar síðu af vörum í flokk, raðað í dagsetningar röð, nýjustu vörur fyrst
* `/products?search={query}`
  * `GET` Skilar síðu af vörum þar sem `{query}` er í titli eða lýsingu, raðað í dagsetningar röð, nýjustu vörur fyrst
  * Það er hægt að senda bæði `search` og `category` í einu
* `/products/:id`
  * `GET` sækir vöru
  * `PATCH` uppfærir vöru, aðeins ef notandi sem framkvæmir er stjórnandi
  * `DELETE` eyðir vöru, aðeins ef notandi sem framkvæmir er stjórnandi
* `/categories`
  * `GET` skilar síðu af flokkum
  * `POST` býr til flokk ef gildur og skilar, aðeins ef notandi sem framkvæmir er stjórnandi
* `/categories/:id`
  * `PATCH` uppfærir flokk, aðeins ef notandi sem framkvæmir er stjórnandi
  * `DELETE` eyðir flokk, aðeins ef notandi sem framkvæmir er stjórnandi

### Karfa/pantanir

* `/cart`
  * `GET` skilar körfu fyrir notanda með öllum línum og reiknuðu heildarverði körfu, aðeins ef notandi er innskráður
  * `POST` bætir vöru við í körfu, krefst fjölda og auðkennis á vöru, aðeins ef notandi er innskráður
* `/cart/line/:id`
  * `GET` skilar línu í körfu með fjölda og upplýsingum um vöru, aðeins ef notandi er innskráður
  * `PATCH` uppfærir fjölda í línu, aðeins ef notandi er innskráður, aðeins fyrir línu í körfu sem notandi á
  * `DELETE` eyðir línu úr körfu, aðeins ef notandi er innskráður, aðeins fyrir línu í körfu sem notandi á
* `/orders`
  * `GET` skilar síðu af pöntunum, nýjustu pantanir fyrst, aðeins pantanir notanda ef ekki stjórnandi, annars allar pantanir
  * `POST` býr til pöntun úr körfu með viðeigandi gildum, aðeins ef notandi er innskráður, á körfu og karfa inniheldur einhverjar línur
* `/orders/:id`
  * `GET` skilar pöntun með öllum línum, gildum pöntunar og reiknuðu heildarverði körfu, aðeins ef notandi á pöntun eða notandi er stjórnandi

Fyrir hvert tilvik, bæði þegar gögn eru búin til eða uppfærð, skal staðfesta að notandi hafi rétt og að gögn séu rétt. Ef svo er ekki skal skila viðeigandi HTTP status kóða og villuskilaboðum sem segja til um villur.

## Annað

Allar niðurstöður sem geta skilað mörgum færslum (fleiri en 10) skulu skila _síðum_, ekki þarf að skila síðum fyrir línur í pöntun.

Ekki þarf að útfæra „týnt lykilorð“ virkni.

Vörur geta aðeins verið í einum flokk.

Þegar gögn eru flutt inn í gagnagrunn getur verið gott að nýta `await` í lykkju þó að eslint mæli gegn því. Ef t.d. er reynt að setja inn yfir 500 færslur í einu í gagnagrunn með `Promise.all`, getur tenging rofnað vegna villu.

Lausn skal keyra á Heroku.

## Hópavinna

Verkefnið skal unnið í hóp, helst með þremur einstaklingum. Hópar með tveim eða fjórum einstaklingum eru einnig í lagi, ekki er dregið úr kröfum fyrir færri í hóp en gerðar eru auknar kröfur ef fleiri en þrír einstaklingar eru í hóp.

Hægt er að auglýsa eftir hóp á slack á rásinni #vef2-2019-hopur.

Hafið samband við kennara ef ekki tekst eða ekki mögulegt að vinna í hóp.

## README

Í rót verkefnis skal vera `README.md` skjal sem tilgreinir:

* Upplýsingar um hvernig setja skuli upp verkefnið
* Dæmi um köll í vefþjónustu
* Innskráning fyrir `admin` stjórnanda ásamt lykilorði
* Nöfn og notendanöfn allra í hóp

## Git og GitHub

Verkefni þetta er sett fyrir á GitHub og almennt ætti að skila því úr einka (private) repo nemanda. Nemendur geta fengið gjaldfrjálsan aðgang að einkarepos á meðan námi stendur, sjá https://education.github.com/.

Til að byrja er hægt að afrita þetta repo og bæta við á sínu eigin:

```bash
> git clone https://github.com/vefforritun/vef2-2019-h1.git
> cd vef2-2019-h1
> git remote remove origin # fjarlægja remote sem verkefni er í
> git remote add origin <slóð á repo> # bæta við í þínu repo
> git push -u origin master # ýta á nýtt origin og tracka branch
```

## Mat

* 20% – Töflur og gögn lesin inn
* 30% – Auðkenning og notendaumsjón
* 30% – Vörur og flokkar
* 20% – Karfa og pantanir

## Sett fyrir

Verkefni sett fyrir í fyrirlestri fimmtudaginn 28. febrúar 2019.

## Skil

Einn aðili í hóp skal skila fyrir hönd allra og skila skal undir „Verkefni og hlutaprófa“ á Uglu í seinasta lagi fyrir lok dags miðvikudaginn 27. mars 2018.

Skilaboð skulu innihalda:

* Slóð á GitHub repo fyrir verkefni, og dæmatímakennurum skal hafa verið boðið í repo (sjá leiðbeiningar). Notendanöfn þeirra eru `freyrdanielsson`, `gunkol`, `kth130`
* Slóð á verkefni keyrandi á Heroku
* Nöfn allra í hópnum

Fyrir skil gæti þurft að fjarlægja einhvern hópmeðlimi af repo, þ.a. hægt sé að bjóða dæmatímakennurum.

## Einkunn

Sett verða fyrir sex minni verkefni þar sem fimm bestu gilda 6% hvert, samtals 30% af lokaeinkunn.

Sett verða fyrir tvö hópverkefni þar sem hvort um sig gildir 15%, samtals 30% af lokaeinkunn.

Verkefnahluti gildir 60% og lokapróf gildir 40%. Ná verður *bæði* verkefnahluta og lokaprófi með lágmarkseinkunn 5.

---

> Útgáfa 0.2

| Útgáfa | Lýsing                                                                   |
|--------|--------------------------------------------------------------------------|
| 0.1    | Fyrsta útgáfa                                                            |
| 0.2    | Bæta við nákvæmri útlistun á hvað notandi getur ekki en stjórnandi getur |
