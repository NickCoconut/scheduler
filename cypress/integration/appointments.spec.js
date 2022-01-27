describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt='Add']")
      .first()
      .click()
      .get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones")
      .get("[alt='Sylvia Palmer']")
      .click();
    cy.contains(/save/i).click();
    cy.contains(/Saving/i).should("not.exist");
    cy.contains("Lydia Miller-Jones");
    cy.contains("Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get("[alt='Edit']")
      .first()
      .click({ force: true })
      .get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones")
      .get("[alt='Sylvia Palmer']")
      .click();
    cy.contains(/save/i).click();
    cy.contains(/Saving/i).should("not.exist");
    cy.contains("Lydia Miller-Jones");
    cy.contains("Sylvia Palmer");
  });

  it("should cancel an interview", () => {
    cy.get("[alt='Delete']").first().click({ force: true });
    cy.contains(/Confirm/i).click();
    cy.contains(/Deleting/i).should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});