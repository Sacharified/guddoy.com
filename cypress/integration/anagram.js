/// <reference types="Cypress" />

context("Actions", () => {
	beforeEach(() => {
		cy.visit("/anagram");
	});

	describe("Implicit Assertions", () => {
		it("Should load the page layout", () => {
			cy.get("body")
				.find("h6")
				.should("have.text", "Sacha Guddoy")
		});
	});

	describe("Find anagrams", () => {
		it("Should input some text", () => {
			cy.get(".layout")
				.find("input[name=anagram]")
				.type("pools")
				.should("contain.value", "pools");
		});

		it("Should find results", () => {
			cy.get("input[name=anagram]")
				.type("pools", { delay: 200 })
				.get("#ua-anagram-list")
				.should("contain.text", "spool")
				.should("contain.text", "loops")
				.should("contain.text", "polos")
				.get("input[name=anagram]")
				.clear()
				.type("splito", { delay: 200 })
				.get("#ua-anagram-list")
				.should("contain.text", "spoilt")
				.should("contain.text", "sploit")
				.should("contain.text", "pistol")
				.should("contain.text", "pilots")
				.should("contain.text", "postil");
		});
	});
});