/// <reference types="cypress-xpath" />

require('cypress-xpath')

describe('Check view', () => {

  // beforeEach(() => {
  //   cy.visit('http://localhost:4200')
  // })

  it('Title is Obkljukovalnica', () => {
    cy.visit('http://localhost:4200')
    cy.contains("Obkljukovalnica")
  })

  it('login toast is shown', () => {
    cy.contains("Najprej se moraš prijaviti!")
    cy.xpath('//button[span[. = "Close"]]').click()
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
    cy.contains('Settings')
  })

  it('Google Sign-in section', () => {
    cy.contains('Google Sign-in')
    cy.xpath('//div[@class="container google"]')
      .should('be.visible')
    cy.xpath('//div[@class="container google"]/div[@id = "my-signin2"]')
      .should('be.visible')
  })

  it('Preglednica section', () => {
    cy.contains('Preglednica')
    cy.xpath('//div[@class="container preglednica"]')
      .should('be.visible')
    cy.xpath('//div[@class="container preglednica"]/div/button[. = "Pridobi preglednico!"]')
      .should('be.visible')
  })

  it('Nastavitve section', () => {
    cy.contains('Nastavitve')
    cy.xpath('//div[@class="container sekcija"]')
      .should('be.visible')
  })

  it('Nastavitve section', () => {
    cy.xpath('//div[@class="container save"]/button[. = "Save"]')
      .should('be.visible')
  })



  it('settings page', () => {
    cy.xpath('//span[text() = "Sign in with Google"]')
      .should('contain', 'Sign in with Google')

    cy.contains('Google Sign-in')
    cy.contains('Preglednica')
    cy.contains('Nastavitve')

    cy.xpath('//div[@class = "container preglednica"]/div/button/span')
      .should('contain', 'Pridobi preglednico!')
    cy.xpath('//div[@class = "container save"]/button/span')
      .should('contain', 'Save')

  })
})
