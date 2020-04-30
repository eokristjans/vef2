# Vefforritun 2

## Webpack - fyrirlestur 11.1

Notað til að þýða JS modules. Leysir úr dependencies og safnar öllum *notuðum* skjölum í eitt *bundle*.

Fáum `src/` og `dist/` möppum, og setjum þá seinni í `.gitignore`.

[Myndband á YouTube](https://www.youtube.com/watch?v=-QflGExg62g&feature=youtu.be)


## TypeScript - fyrirlestur 11.2

Þarf að þýða úr TypeScript í JavaScript.

Bætir við týpum og athugum á þeim á compile tíma, týpu ályktun (type inference), interfaces og generics.

Stillum þýðanda í `tsconfig.json`.

```bash
npm install -g typescript # install globally
tsc index.ts # translate to js
node index.js # run js file with node

# install type definitions for node projects
npm install --save-dev @types/node 
```

[Basic Types - Handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html)  
[Functions - Handbook](https://www.typescriptlang.org/docs/handbook/functions.html)

Function examples

```ts
function add(x: number, y: number): number {
  return x + y;
}

// ... nums means that there can be multiple inputs
// the input will be put into an array of numbers
function sum(...nums: number[]): number {
  return nums.reduce((x, y) => x + y, 0);
}

const result: number = add(1, 2);
const summed: number = sum(1, 2, 3, 4);

```

Can use `any` type if we're unsure of the type, if it's fleeting, or if it would be inefficient to specify each type e.g. of a JSON object.

### Interfaces

Leið til að skilgreina hvernig gögn í hlutum líta út.

Skilgreinum hvert property með týpu og hvort það sé optional (merkt `?`) eða ekki .

Skilgreinum föll t.d. `(num) => boolean`.

```ts
interface ICategory {
  id: number;
  title: string;
}

interface IProduct {
  id: number;
  title: string;
  price: number;
  category: ICategory; // category can't be null
  description?: string; // can be null
}

interface IProps {
  children: any; // Should probably be react.node
  onClick: (e: any) => void; // Could be html anchor event or something else perhaps 
}
```

**Interfaces geta komið í stað React `PropTypes`.**

### Generics

* Leið til að skilgreina endurnýtanlegan kóða fyrir almenna týpu.
* Gætum notað `any` en með generics veljum við hver týpan er og hún er tryggð í gegn,
  þ.e.a.s. fallið heldur utan um týpuna og þýðandinn veit hver hún er inní fallinu og ef það er sent áfram.
* Skilgreinum fyrir föll (og klasa) með `<T>` eftir heiti.

```ts
// Generic function
function identity<T>(arg: T): T {
    return arg;
}
const result = identity<string>("myString");
```

### TypeScript with React

See [React, adding TypeScript](https://create-react-app.dev/docs/adding-typescript/) for more info.

* Install typescript with types to already existing react app
  * `npm install --save typescript @types/node @types/react @types/react-dom @types/jest`
* Reinstall React globally if it was installed and create a new react app
  * `npm uninstall -g create-react-app`
  * `npx create-react-app my-app --template typescript` 


****

## React - fyrirlestrar 8-10

### Single Page Application (SPA)

Framkvæma aldrei *refresh* eftir fyrsta load.

Fáum ný gögn frá vefþjón með `Ajax` eða álíka.

#### Grunnhugmynd React

Þeir halda því fram að aðskilnaður milli markup í formi template og lógíkar (JS) er órökréttur því template mál hafa öðruvísi og ekki jafn kröftugan syntax og JS. 

- **High cohesion**: Hver hluti inniheldur langflest sem þarf til birtingar og notkunar.
- **Loose coupling**: Hver hluti er sjálfum sér nægur og þarf ekki aðra hluti.

Notum ES6/2015, þ.e. `import` og `export` í stað `require` og `module.exports`.

Notum `babel` transpiler: breyta ES2015+ kóða í *backwards compatible* JS kóða sem keyrir annars staðar.

#### Starter kits

React krefst margra tækja og tóla til að þróa verkefni. *Starter kits* taka saman ýmist þau nauðsynlegu (*unopinionated*) og þau sem einhverjir halda fram að séu góð (*opinionated*).

##### create react app (cra)

*Zero config*, felur langflestar flækjur, viðhaldið af react, *unopinionated*.

`npm run eject` sleppir svo CRA styllingum í okkar hendur ef við viljum (birtir flækjurnar).

```bash
npx create-react-app my-app
cd my-app
npm start
```

Til að fá eslint til að virka þá getum við þurft að búa eftirfarandi `.eslint.json`, en það ætti að duga að hafa það `"eslintConfig"` í `package.json`.

```json
{
  "extends": "react-app"
}
```

##### React Dev Tools

Extension fyrir Chrome og Firefox.

### JSX

Viðbót við JS sem leyfir okkur að lýsa viðmóti með JS.

Blandar saman HTML elementum, React components og JavaScript.

**JSX tré**: Svipar til DOM, má hreiðra. Element sem byrja á stórum staf eru React element, en annars DOM element. Öll lauf element eru DOM element (renderuð út til að birtast á skjá).

Vefjum JSX inní () til að koma í veg fyrir automatic semicolon insertion.

```jsx
(<p>Testing {[1, 2, 3].join(', ')}</p>)
```

Einnig hægt að túlka JSX sem segð:

```jsx
return (<h1>Hello world!</h1>);
```

Element í JSX geta átt attribute, skrifuð með *camalCase* frekar en *kebab-case* eins og í HTML.

Notum `className` í stað `class`.

Öll gildi sem túlkuð eru í JSX eru *escaped* til að vernda fyrir XSS.

Getum notað (verðum að nota?) self-closing syntax úr XML/XHTML (þ.e. loka t.d. img tag eins og ég er vanur).

Til þess að JSX virki fyir höfuð þarð að vera búið að gera `import React from 'react'`.

JSX element eru ekki DOM element og því töluvert ódýrara að búa þau til, þar til á einhverjum tímapunkti sem við búum til DOM element í raun. Búum loks til DOM tré með:

```jsx
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

#### Uppfærsla í DOM

Ef eitthvað lætur `element` breytast eða ef við köllum aftur í `render` eða ef einhver component kallar á `setState` þá mun React *aðeins uppfæra* það sem breytist. Það heldur semsagt utan um *Virtual DOM (VDOM)*. Þetta sync er kallað **Reconsiliation**. 

Með Reconsiliation er t.d. öllu hluttré hent (og endurteiknað) ef foreldri breytist, því það tekur minni tíma en að breyta einu tré í annað. 

Fyrir lista af hlutum ætti forritari að láta vita hvort breytingar hafi átt sér stað með `key` attribute, gefum lista semsagt *stable id*.

##### Reconsiliation reiknirit (einfaldað)

1. React býr til nýtt VDOM
2. Diffar við gamla
3. Útbýr minnsta sett af DOM agðgerum til að breyta á milli
4. Framkvæmið aðgerðir

Mjög einfalt og þægilegt. Við þurfum aldrei að pæla í þessu og aldrei að kalla í `window.createElement(...)`, `.appendChild(...)` eða eh.


### Components

Með því að nota components getum við skipt viðmótinu okkar upp í sjálfstæðar einingar. Mjög góð pæling sem virkar vel í praxís. Ef margir forritarar vinna í mismunandi components á sama tíma þá hafa þeir engin áhrif hver á annan.

```jsx
// Hægt skilgreina með function
function Welcome(props) {
  // props er stytting á properties
  return <h1>Hello, {props.name}</h1>;
}

// Klasi gerir það sama
class Welcome extends React.Component {
  // Þurfum alltaf að útfæra render fallið
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Myndum nota bæði tvennt á sama máta
const element = <Welcome 
                  name="Sara"
                  // Næsta prop er óþarfi, bara sýna hvernig það gæti litið út.
                  otherProp="some other info"
                />;
```

Components geta skilað Elements, JSX segð, fylkjum af þessu, eða falsy gildi (ekkert verður skrifað út í DOM tréið).

```jsx
const numbers = [1, 2, 3, 4];
const listItems = numbers.map((number) =>
  // eigum að hafa key eða unique id til að ýtra eftir,
  // getum gripið til þess að búa það til eftir index úr fylkinu.
  <li key={number.toString()}> 
    {number}
  </li>
)
```

### Fragments

* Stundum viljum við skila mörgum elementum.
* Getum skilað fragment sem útbýr ekki element.

```jsx
function Columns(props) {
  // Gætum líka skilað fylki
  return (
    <React.Fragment>
      <td>Foo</td>
      <td>Bar</td>
    </React.Fragment>
  );
}

function Table(props) {
  return (
    <table>
      <tr>
        <Columns />
      </tr>
    </table>
  );
}
```

Best að skipta forriti upp í fleiri, minni components.

### `App` component

Rót fyrir UI, geymt í `App.js`.

Tekur ekki inn nein props.

Stillir og setur upp ákveðna hluti eins og routing.

`index.js` sækir svo `App.js` og keyrir `ReactDOM.render(<App />, document.getElementById('root'))`.


### Props

React components ættu að vera hrein föll m.t.t. *props*:

- Ef ég sendi inn *props* með þessu gildi núna og aftur seinna, þá fæ ég sömu niðurstöðu.
- Breytum aldrei *props*, þau eru read-only.

Notum *state* til að bregðast við breytingu í UI.

Notum sérstakt `children` *prop* sem geta verið mismunandi gagnatýpur. 
Notum `React.Children.toArray(children);` til að breyta þeim öllum í `array` að lengd 0, 1 eða meira.

Notum `prop-types` pakkann til að keyra type check á runtime í þróun (t.d. til að passa að strengur sé strengur, og array sé array).

*Prop types* geta t.d. verið `node` (hægt að birta), JS týpur, listar (`oneOf`, `oneOfType`, `arrayOf`) eða hlutur á ákveðnu formi (`shape({})).

Getum skilgreint `defaultProps`, en notum það ekki með `isRequired`.

```jsx
import PropTypes from 'prop-types';

// Skilgreinum hvað má fara inn
Comp.proptypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['foo', 'bar']),
  user: PropTypes.shape({
    name: PropTypes.string,
    age: propTypes.number,
  }),
  onClick: PropTypes.func,
};

// Skilgreinum default props, ef einhver
Comp.defaultProps = {
  type: 'foo',
  user: null,
  onClick: () => {},
};
```

Með réttum stillingum á babel getum við sett `propTypes` og `defaultProps` sem `static` breytur á class. Sjá dæmi.

```jsx
class Person extends Component {
  static propTypes = {
    name: PropTypes.string,
  }

  static defaultProps = {
    name: 'NN',
  }
  //...
}
```


### State

Keimlíkt `props` en er prívat fyrir component, og **ekki** read-only.

Stjórnað af component að öllu leiti.

Mögulega aðeins til staðar ef componenent er skilgreint sem `class`.

Ættum aðeins að setja hluti sem verða birtir í `state`. Önnur gögn getum við geymt í `class` með `this`.

```jsx
class Foo extends Component {
  constructor(props) {
    super(props)
    this.state = { /* ... */ } // Eina skiptið sem við SETJUM state
  }
}
// Or if we don't need to do anything else in the constructor, then:
class Foo extends Component {
  state = { /* ... */ } // Eina skiptið sem við SETJUM state
}
```

Uppfærsla á `state` fer alltaf fram í gegnum `this.setState()`, t.d. `this.setState({ comment: 'Hello' })` til að uppfæra breytuna `comment`.

Uppfærslur eru keyrðar async, svo þetta gerist ekki endilega alveg strax (keyrt sem batch jobs, X margar á sekúndu).

Notum því callback eins og `this.setState((prevState, props) => { /* ... */ })`

```jsx
this.setState((prevState, props) => ({
  // props.incr er væntanlega eitthvað function.
  counter: prevState.counter + props.incr,
}));
```

#### Flæði gagna

Components nota JSX til að birta sig, `props` til að fá inn einhverja stöðu, og nota `state` til að halda utan um sína eigin stöðu.

`state` er aldrei aðgengilegt öðrum component, svo aðrir components geta aldrei gert ráð fyrir neinu úr þeim. Einn getur látið annan vita með því að senda stöðu áfram í `prop` hjá honum. Gögn flæða því ALLTAF *niður* (*top-down / unidirectional*). Vegna *reconciliation* er ódýrara að teikna *allt* UI aftur en að breyta ákveðnum hlut.


### Atburðir í react

* Replace Events. Are synthetic versions, not exactly the same.
* Sendum fallið inn með `<button onClick={handleClick}>`

```jsx
function ActionLink() {
  function handleClick(e) {
    // Prevents us from going to whatever is defined in `href`
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}

```

* Nokkrar leiðir til að binda þetta
  * Binding method in constructor:
    * `this.handleClick = this.handleclick.bind(this);`
  * Binding method í event'inum sjálfum:
    * `<button onClick={(e) => this.handleClick(e)}>`
  * Public Class field binding (RÉTTA LEIÐIN Í CRA)...

```jsx
class Foo extends Component {
  handleClick = (e) => {
    console.log(this, e);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        click
      </button>
    );
  }
}

// Or alternatively with argument event handler
handler = (foo) => (e) => {
  e.preventDefault();

  // Lokun (closure) yfir foo
  // foo er aðgengilegt þegar
  // atburður á sér stað
}

// ...

return (<button onClick={this.handler('foo')}>);
```


### `react-router`

* Leiðarkerfi í react
* Notar declarative API
* Notar *dynamic* routing
  * Getur búið til ný routes á keyrslutíma
  * Route er skilgreint með component sem hægt er að rendera hér og þar, hvenær sem er.
* 

```jsx
const App = () => (
  <div>
    <nav>
      <Link to="/dashboard">Dashboard</Link> 
    </nav>
    <Route
      path="/dashboard"
      component={Dashboard}
    /> // this component is only rendered out when the path is /dashboard
  </div>
);
```

