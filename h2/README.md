# # noteworthyMD

#### Course: HBV403G (Web Development 2)
#### Final Project (front-end)
#### Author: Erling Óskar Kristjánsson

This is a React Web App that consumes [this](https://github.com/eokristjans/vef2/tree/master/h1) Restful API web service.

The project was created with [`create-react-app` with `typescript`](https://facebook.github.io/create-react-app/docs/adding-typescript) with `react-router` and `react-helmet`:

```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
npm install react-router react-router-dom react-helmet
```

## Setup

Copy `.env_example` into `.env` and set URL to web service.

```bash
npm install
npm run start
```

## Functionality

### Header

Header should contain:

* Title of the page, link to front page.
* (Optional) Link to *About* section.
* If the user is **not** logged in:
  * Links to register and login pages.
* If the user is logged in:
  * Username.
  * Logout button.
* If the user is logged in **and** is an admin:
  * Link to a list of users.

### Sidebar

If the user is logged in, there should be a sidebar which contains:

* Create notebook button.
* Overview of notebooks.
  * If the user clicks a notebook, it will open, revealing:
    * Overview of contained sections.
    * Create section button.
    * If the user clicks a section, it will open, revealing:
      * Overview of contained pages.
      * Create page button.
      * If the user clicks a page, it will open, revealing its contents.
        * The page is an editable document into written in [Markdown with rendering and live preview](https://www.npmjs.com/package/react-markdown-renderer) side-by-side.
        * The user can easily save changes to his page.
        * (Optional) Changes are saved automatically a few seconds after some changes have been made.
* Link to list of images.
  * The image can be displayed with its title and a URL that can easily be copied.
* The user can delete pages, sections, notebooks and images.
* (Optional) The user can have an option to rename pages, sections and notebooks.

### Admin activity

* The admin can view all users.
* Admin can delete a user.
* (Optional) Admin can make another user into an admin.
* (Optional) The admin can view all notebooks, sections and their contents, essentially with one massive sidebar.

### Other

* When HTTP requests are made to the web service, loading state should be displayed and errors should be handled.
* If site was not found, then display a 404 site.
* Styles with CSS, Sass, maybe Bootstrap.


> Release 0.1

| Release | Description                                                              |
|---------|--------------------------------------------------------------------------|
| 0.1     | First release                                                            |
