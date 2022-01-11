/// <reference types="cypress-xpath" />

require('cypress-xpath')

// signed out user
describe('Check view', () => {

  beforeEach(() => {
    //cy.visit('http://localhost:4200')
  })

  it('Title is Obkljukovalnica', () => {
    cy.visit('http://localhost:4200/')
    cy.contains("Obkljukovalnica")
  })

  it('login toast is shown', () => {
    cy.contains("Najprej se moraš prijaviti!")
    cy.xpath('//button[span[. = "Zapri"]]').click()
  })

  it('navbar is visible', () => {
    cy.xpath('//mat-toolbar/button')
      .should('have.length', 3)
  })
})

describe('Pregled view', () => {
  it('Navigate to pregled', () => {
    cy.xpath('//mat-toolbar/button[2]').click()
  })

  it('Settings title is visible', () => {
    cy.contains('Pregled')
  })
})

describe('Settings view', () => {
  it('Navigate to settings', () => {
    cy.xpath('//mat-toolbar/button[3]').click()
  })

  it('Settings title is visible', () => {
    cy.contains('Nastavitve')
  })

  it('Google Sign-in section', () => {
    cy.xpath('//mat-expansion-panel[1]').click()
    cy.contains('Prijava z Googlom')
    cy.xpath('//div[contains(@class, "container google")]')
      .should('be.visible')
    cy.xpath('//div[contains(@class, "container google")]/div[@id = "my-signin2"]')
      .should('be.visible')
  })

  it('Preglednica section', () => {
    cy.xpath('//mat-expansion-panel[2]').click()
    cy.contains('Preglednica')
    cy.xpath('//div[contains(@class, "container preglednica")]')
      .should('be.visible')
    cy.xpath('//div[contains(@class, "container preglednica")]/div/button[. = "Pridobi preglednico!"]')
      .should('be.visible')
  })


  it('Nastavitve section', () => {
    cy.xpath('//mat-expansion-panel[3]').click()
    cy.contains('Nastavitve')
    cy.xpath('//div[contains(@class, "container sekcija")]')
      .should('be.visible')
    cy.xpath('//div[contains(@class, "container sekcija")]//button[. = "Shrani"]')
      .should('be.visible')
  })

  it('ON section', () => {
    cy.xpath('//mat-expansion-panel[4]').click()
    cy.contains('Osebno napredovanje')
    cy.contains('Omogoči osebno napredovanje!')
    cy.contains('Preglednica')

    cy.xpath('//span[text() = "Sign in with Google"]')
      .should('contain', 'Sign in with Google')

    cy.contains('Preglednica')
    cy.contains('Nastavitve')


    cy.xpath('//button')
      .should('contain', 'Pridobi preglednico!')
    })

  it('google login', () => {
    cy.loginByGoogleApi()
    console.log(window.localStorage.getItem('access_token'))
  })
})

// user logged in
describe('Nastavi preglednico', () => {
  it('Navigacija', () => {
    cy.xpath('//mat-expansion-panel[2]').click()
    cy.contains('Preglednica')
    cy.xpath('//div[contains(@class, "container preglednica")]')
      .should('be.visible')
    cy.xpath('//div[contains(@class, "container preglednica")]/div/button[. = "Pridobi preglednico!"]')
      .should('be.visible')

    cy.xpath('//input[@id = "povezavaTabela"]').type('https://docs.google.com/spreadsheets/d/1crR7NUCd6npmSk-on1o9O6BxGuoZMog7OBaq2xTlsoI/edit#gid=0')
    cy.xpath('//button[@id = "pridobiPreglednico"]').click()
    cy.xpath("//mat-select[@id = 'skupinaDropdown']").click()
    cy.xpath("//mat-option[2]").click()
    cy.xpath("//button[@id = 'shraniPreglednico']").click()
  })
})
