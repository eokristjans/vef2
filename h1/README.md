# # noteworthyMD

#### Course: HBV403G (Web Development 2)
#### Final Project
#### Author: Erling Óskar Kristjánsson

## Glósur höfundar

Skráin `reqs.txt` inniheldur þær skipanir sem voru framkvæmdar til að setja upp þróunarumhverfi. 
Hins vegar ætti að duga að keyra `npm install` og svo `npm setup`.


## Project Description

**# noteworthyMD** is an online platform for storing and organizing notes, whether they be for courses at school, projects at work or anything else that that needs to be noted down. What separates **# noteworthyMD** from other platforms is that all of your notes can be written and stored in the `Markdown` markup language.

The basic layout is as such:

* Notebook
  * Section
    * Page
    * ... [more pages]
  * ... [more sections]
  * SectionGroup
    * Section
      * Page
      * ... [more pages]
    * ... [more sections]
  * ... [more section groups]
  * Image Section
    * List of image URLs.
* ... [more notebooks]

A user can register for and login to the platform, create multiple notebooks and add and delete section groups, sections and pages as they desire. A page can only be added within a section. The user can edit his pages by writing Markdown text into them, which the browser can render immediately and then store on the platform. The system stores the pages so that they can be viewed in any browser on any device as long as the user is logged in. Each user only has access to their own notebooks and their contents.


## Functional requirements

Create a web service with:

* User Management
  * Users can register and login.
  * Users can change, create and delete their own notebooks, section groups, sections and pages.
  * Users can change their password.
  * Admins can make other users into admins.
  * Admins can delete users and content created by them.
  * (Optional) Admins can update the *About* section of the platform.
* Notebooks
  * Belong to a user.
  * May contain section groups.
  * May contain sections.
* Section Groups
  * Belong to a user.
  * Belong to a notebook.
  * May contain sections.
* Sections
  * Belong to a user.
  * Belong to a notebook 
  * May belong to a section group.
  * May contain pages.
* Pages
  * Belong to a user.
  * Belong to a section.
  * Written in [Markdown with rendering and live preview](https://www.npmjs.com/package/react-markdown-renderer).
* ImageURLs
  * Belong to a user.
  * Belong to a notebook.
  * Upload images through the platform that can be stored on [Cloudinary](https://cloudinary.com/) 
    and the link can be embedded into the markdown-formatted blog post.

A list of ImageURLs must be available.
(Optional) *About* section for the webpage must be viewable by all and editable by admins.


### Technical requirements

* Back-end 
  * Web Service should be a REST API created using `express`
  * It should have `GET`, `POST`, `PATCH` and `DELETE` endpoints.
* Data
  * PostgreSQL must be used as a DB, in which all the data will be stored.
  * All data provided by the user must be validated and sanitized, using `xss`.
  * There should be a way to populate the DB with data.
  * Fake pages created with `faker`.
* User Management
  * You should be able to register a user and login.
  * JWT with Passport should be used for authentication.
  * Passwords should not be present on this list of [500 bad passwords](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/500-worst-passwords.txt).
  * (Optional Extra) Limited number of login attempts permitted.

* Front End
  * Written in React.
  * (Optional) Written with TypeScript.
* README
  * The root of the project should have a README file that includes:
    * Information on how to setup and run the project.
    * Request examples to the API.
    * Valid login credentials for an admin user.
* Other
  * The project should be running on Heroku.
  * (Optional) The project uses pagination.


## Database Tables

* Users
  * Id, integer, assigned by default.
  * Username, unique, not null.
  * Email, unique, not null.
  * Password, not null, at least 8 characters and not in this list of [500 bad passwords](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/500-worst-passwords.txt), stored as a hash from `bcrypt`.
  * Admin, boolean, default  `false`.
  * Created, date with timezone, assigned by default.
  * Modified, date with timezone, assigned by default.
* Notebooks
  * Id, integer, assigned by default.
  * UserId, integer, assigned by default.
  * Created, date with timezone, assigned by default.
  * Modified, date with timezone, assigned by default.
  * SectionGroupIds, array.
  * SectionIds, array.
  * ImageIds, array.
  * Title, not null.
  * Unique (UserId, Title).
* SectionGroups
  * Id, integer, assigned by default.
  * UserId, integer, assigned by default.
  * NotebookId, integer, assigned by default.
  * Created, date with timezone, assigned by default.
  * Modified, date with timezone, assigned by default.
  * SectionIds, array.
  * Title, not null.
  * Unique (NotebookId, Title).
* Sections
  * Id, integer, assigned by default.
  * UserId, integer, assigned by default.
  * SectionGroupId, integer, assigned by default.
  * NotebookId, integer, assigned by default.
  * Created, date with timezone, assigned by default.
  * Modified, date with timezone, assigned by default.
  * PageIds, array.
  * Title, not null.
  * Unique (SectionGroupId, Title).
* Pages
  * Id, integer, assigned by default.
  * UserId, integer, assigned by default.
  * SectionId, integer, assigned by default.
  * SectionGroupId, integer, assigned by default.
  * NotebookId, integer, assigned by default.
  * Created, date with timezone, assigned by default.
  * Modified, date with timezone, assigned by default.
  * Title, not null.
  * Body, not null.
  * Unique (SectionId, Title).
* Images
  * Id, integer, assigned by default.
  * UserId, integer, assigned by default.
  * NotebookId, integer, assigned by default.
  * Created, date with timezone, assigned by default.
  * Title, not null.
  * Url, not null.
  * Unique (NotebookId, Title).

**TODO: Consider whether this two-way pointing is necessary (i.e. Pages point to Sections and Sections contain Array of Pages). Bear in mind that if a Section is created, it must first delete all the pages it contains, otherwise it will break a constraint. However, because page points to a section, `cascade` might be able to take care of deleting everything that points to the section.**

Tables should have unique Ids and use [foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) to point to other tables.


## Data

When a new user is created, one sample notebook is created for him. This notebook contains:
* 1 section.
* 1 section group with 2 sections.
* Each section contains 2 pages.
* 2 images.

Populate the pages by creating fake data with [faker](https://github.com/Marak/faker.js):
Some pages will contain the images.


## Images

All images shall be stored on [Cloudinary](https://cloudinary.com/), including default images.

Only allow images with the following (`mime type`):

* jpg, `image/jpeg`
* png, `image/png`
* gif, `image/gif`

[Although Cloudinary supports other image mime types](https://cloudinary.com/documentation/image_transformations#supported_image_formats), we can verify that the files are images *before* uploading them to Cloudinary.


## Web Services

Create a web service that takes care of all functionality. Use `JSON` for all requests.

GET `/` shall return a list of possible operations.


### Users

* `/users`
  * `GET` returns a list of users, only if the user that performs the request is an admin.
* `/users/:id`
  * `GET` returns a user, only if the user that performs the request is an admin.
  * `PATCH` changes whether the user is an admin or not, only if the user that performs the request is an admin and is not changing themself.
  * `DELETE` deletes the users and all its contents, only if the user who performs the request is an admin.
* `/users/register`
  * `POST` validates and creates a user. Returns authentification and email. Newly created user shall never be an admin.
* `/users/login`
  * `POST` with email and password, returns token if input is correct.
* `/users/me`
  * `GET` returns info about the user who owns the token, authentication and email. Only if the user is logged in.
  * `PATCH` updates email and/or password, if data input is correct and valid. Only if the user is logged in.

Never return or show password hash.

### Notebooks
* `/notebooks`
  * `GET` returns a list of notebooks that belong to the user who performs the request. **TODO: Contents nested within?**
  * `POST` creates a new notebook owned by the user who performs the request.
* `/notebooks/:id`
  * `GET` returns a notebook, only if it belong to the user who performs the request.
  * `PATCH` updates the name of the notebook, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the notebook and all its contents, only if the user who performs the request is the owner.

### Section Groups
* `/notebooks/:id/section-groups`
  * `POST` creates a new section group owned by the user who performs the request.
* `/notebooks/:id/section-groups/:id`
  * `GET` returns a section group, only if it belong to the user who performs the request.
  * `PATCH` updates the name of the section group, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the section group and all its contents, only if the user who performs the request is the owner.

### Sections
*Sections do not have to be nested within a section-group.*

* `/notebooks/:id/sections`
  * `POST` creates a new section owned by the user who performs the request.
* `/notebooks/:id/sections/:id`
  * `GET` returns a section, only if it belong to the user who performs the request.
  * `PATCH` updates the name of the section, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the section and all its contents, only if the user who performs the request is the owner.

### Pages
*Parent section deos not have to be nested within a section-group.*

* `/notebooks/:id/sections/:id/pages`
  * `POST` creates a new page owned by the user who performs the request.
* `/notebooks/:id/sections/:id/pages/:id`
  * `GET` returns a page, only if it belong to the user who performs the request.
  * `PATCH` updates the page, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the page, only if the user who performs the request is the owner.

### Images
* `/notebook/:id/images`
  * `POST` uploads a new image owned by the user, contained within the notebook, only if data input is valid and only if the notebook is owned by the user who performs the request.
  * `GET` returns a list of all image owned by the user, contained within the notebook, only if the notebook is owned by the user who performs the request.
* `/notebook/:id/images/:id`
  * `GET` returns an image, only if it belong to the user who performs the request.
  * `PATCH` updates the image, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the image, only if the user who performs the request is the owner.

Each time when data is created or updated, the web service should verify that the user has permission and that the data is valid. If not, then the web service should return the appropriate HTTP status code and error message.



> Útgáfa 0.1

| Útgáfa | Lýsing                                                                   |
|--------|--------------------------------------------------------------------------|
| 0.1    | Fyrsta útgáfa                                                            |
