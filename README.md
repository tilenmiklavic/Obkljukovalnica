# Obkljukovalnica

## Wiki :speech_balloon:

### Piprava preglednice

Preglednico ustvarimo na spletni storitvi Google Drive oz Google Spreadsheets. Ko tabelo prisotnosti pripravljamo, sledimo spodnjemu zgledu. 

<img width="986" alt="Screenshot 2021-10-31 at 20 55 45" src="https://user-images.githubusercontent.com/47791739/139599714-bcf0be99-8d8b-4dbe-a217-71e770141082.png">

- V stolpcu (poimenovanem **Id**) zapišemo enoličen identifikator otroka. 
- V stolpcu (poimenovanem **Ime**) zapišemo ime otroka.
- Stolpce, kjer želimo da se zapisujejo prisotnosti pa označimo z ustreznim datumom. 

V zavihku za deljenje preglednice omogočimo urejanje za vsakogar s povezavo do te datoteke, povezavo pa skopiramo, saj jo bomo potrebovali pri nastavljanju aplikacije.

### Priprava aplikacije 

Obiščemo spletni naslov [Obkljukovalnica](https://obkljukovalnica.web.app/) na mobilnem telefonu, ter izberemo možnost za dodajanje aplikacije na začetni zaslon. 
Ko aplikacijo prvič zaženemo, najprej obiščemo zavihek Nastavitve

- prijavimo se z Google računom
- povezavo iz prejšnje točke kopiramo v polje ***povezava do tabele***
- stisnemo gumb ***Pridobi preglednico!***
- iz spustnega menija *Skupina* izberemo prvo možnost (več možnosti je relevantnih samo v primeru da imamo več zavihkov v tabeli)
- stisnemo gumb ***Save***

### Uporaba aplikacije

Na pogledu **Check** imamo razvrščene otroke po vrsti kakor v preglednici. Vsak ima dodeljene 3 ikone s katerimi lahko označimo:
- :white_check_mark: prisotnost
- :o: opravičeno odsotnost
- :x: neopravičeno odsotnost

Izbiro lahko vedno tudi popravljamo.

Pogled **Pregled** se uporablja za pregled prisotnosti v istem dnevu med večimi skupinami in za uporabo z zgolj eno skupino ni uporaben. 
:building_construction: V prihodnosti bo vseboval tudi razvrstitev prisotnosti ene skupine po dnevih. 

## Contributing guidelines ##

### Working with pull requests

1. Fork the repo and create your branch from `master`.
2. Ask for .env files, code won't work without them.
3. Follow coding guidelines.
4. Document added code.
5. Describe what you have changed. 
6. Issue that pull request!

### Report bugs using [Github's issues](https://github.com/tilenmiklavic/Obkljukovalnica/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/tilenmiklavic/Obkljukovalnica/issues/new); it's that easy!

## :construction: Development guidelines :construction:

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

###Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
