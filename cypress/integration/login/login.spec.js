/// <reference types="cypress" />

context('Actions', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/login')
	});
	it('must typing username and password', () => {
		cy.get('.ant-btn').click();
		cy.get('.ant-form-item-has-error .ant-form-item-explain').should('have.length', 2);
		cy.get('.ant-form-item-has-error .ant-form-item-explain').eq(0).should('have.text', '请输入账户');
		cy.get('.ant-form-item-has-error .ant-form-item-explain').eq(1).should('have.text', '请输入密码');
	});
	it('only typing username', () => {
		cy.get('.ant-input').eq(0).type('text');
		cy.get('.ant-btn').click();
		const errorItems = cy.get('.ant-form-item-has-error .ant-form-item-explain');
		errorItems.should('have.length', 1);
		errorItems.eq(0).should('have.text', '请输入密码');
	});
	it('only typing password', () => {
		cy.get('.ant-input').eq(1).type('text');
		cy.get('.ant-btn').click();
		const errorItems = cy.get('.ant-form-item-has-error .ant-form-item-explain');
		errorItems.should('have.length', 1);
		errorItems.eq(0).should('have.text', '请输入账户');
	});
	it('finish', () => {
		cy.get('.ant-input').eq(0).type('text');
		cy.get('.ant-input').eq(1).type('text');
		cy.get('.ant-btn').click();
		const errorItems = cy.get('.ant-form-item-has-error .ant-form-item-explain');
		errorItems.should('have.length', 0);
	});
});
