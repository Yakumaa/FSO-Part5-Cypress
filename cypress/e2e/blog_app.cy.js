describe('Blog app', function () {
	beforeEach(function () {
		cy.visit('http://localhost:5173')
		cy.request('POST', 'http://localhost:3001/api/testing/reset')
		const user = {
			name: 'shrish',
			username: 'admin',
			password: '1234',
		}
		cy.request('POST', 'http://localhost:3001/api/users', user)
	})

	it('Login form is shown', function () {
		cy.contains('blogs')
	})

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.contains('Login').click()
			cy.get('#username').type('admin')
			cy.get('#password').type('1234')
			cy.get('#login-button').click()

			cy.contains('shrish logged-in')
		})

		it('fails with wrong credentials', function () {
			cy.contains('Login').click()
			cy.get('#username').type('root')
			cy.get('#password').type('jpt')
			cy.get('#login-button').click()

			cy.get('.error')
				.should('contain', 'Wrong username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
				.and('have.css', 'border-style', 'solid')

			cy.get('html').should('not.contain', 'shrish logged-in')
		})
	})
})
