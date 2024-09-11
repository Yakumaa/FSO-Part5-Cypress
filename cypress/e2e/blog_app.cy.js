describe('Blog app', function () {
	beforeEach(function () {
		cy.visit('http://localhost:5173')
		cy.request('POST', 'http://localhost:3001/api/testing/reset')
		const user = {
			name: 'shrish',
			username: 'admin',
			password: '1234',
		}
		const user2 = {
			name: 'user2',
			username: 'user2',
			password: '1234',
		}
		cy.request('POST', 'http://localhost:3001/api/users', user)
		cy.request('POST', 'http://localhost:3001/api/users', user2)
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

	describe('When logged in', function () {
		beforeEach(function () {
			// cy.login({ username: 'admin', password: '1234' })
			cy.contains('Login').click()
			cy.get('#username').type('admin')
			cy.get('#password').type('1234')
			cy.get('#login-button').click()

			cy.contains('shrish logged-in')
		})

		it('A blog can be created', function () {
			// cy.createBlog({
			// 	title: 'Cypress blog',
			// 	author: 'admin',
			// 	url: 'https://www.cypress.io/',
			// })
			cy.get('#new-blog').click()
			cy.get('#title').type('Cypress blog')
			cy.get('#author').type('admin')
			cy.get('#url').type('https://www.cypress.io/')
			cy.get('#create-blog').click()
			cy.get('#notification').should('contain', 'A new blog Cypress blog by admin added')
		})

		it('A blog can be liked', function () {
			cy.get('#new-blog').click()
			cy.get('#title').type('Cypress blog')
			cy.get('#author').type('admin')
			cy.get('#url').type('https://www.cypress.io/')
			cy.get('#create-blog').click()
			cy.get('#view-blog').click()
			cy.get('#like-blog').click()
			cy.get('#blog-likes').should('contain', '1')
		})

		it('A blog can be deleted', function () {
			cy.get('#new-blog').click()
			cy.get('#title').type('Cypress blog')
			cy.get('#author').type('admin')
			cy.get('#url').type('https://www.cypress.io/')
			cy.get('#create-blog').click()
			cy.get('#view-blog').click()
			cy.get('#delete-blog').click()
			cy.on('window:confirm', (t) => {
				expect(t).to.equal('Remove blog Cypress blog by admin')
			})
		})

		it('Only creator can see the delete Button', function () {
			// cy.createBlog({
			// 	title: 'Cypress blog',
			// 	author: 'admin',
			// 	url: 'https://www.cypress.io/',
			// })
			cy.get('#new-blog').click()
			cy.get('#title').type('Cypress blog')
			cy.get('#author').type('admin')
			cy.get('#url').type('https://www.cypress.io/')
			cy.get('#create-blog').click()

			cy.get('#logout').click()
			// cy.login({ username: 'user2', password: '1234' })
			// cy.contains('user2 logged-in')
			// cy.contains('Login').click()
			cy.get('#username').type('user2')
			cy.get('#password').type('1234')
			cy.get('#login-button').click()

			cy.contains('user2 logged-in')

			cy.get('#view-blog').click()
			cy.get('#view-blog').should('not.contain', 'remove')
		})

		it.only('Blogs are ordered according to likes', function () {
			cy.get('#new-blog').click()
			cy.get('#title').type('Cypress blog')
			cy.get('#author').type('admin')
			cy.get('#url').type('https://www.cypress.io/')
			cy.get('#create-blog').click()

			cy.get('#new-blog').click()
			cy.get('#title').type('Cypress blog2')
			cy.get('#author').type('admin')
			cy.get('#url').type('https://www.cypress.io/')
			cy.get('#create-blog').click()
			cy.get('#view-blog').click()
			cy.get('#like-blog').click()
			cy.get('#blog-likes').should('contain', '1')

			cy.get('.blog').eq(0).should('contain', 'Cypress blog')
			cy.get('.blog').eq(1).should('contain', 'Cypress blog2')
		})
	})
})
