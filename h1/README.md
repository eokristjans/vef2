# # noteworthyMD

#### Course: HBV403G (Web Development 2)
#### Final Project (back-end)
#### Author: Erling Óskar Kristjánsson

## Setup

TODO: Finish description

### Users

* Admin with username `matthias` and password `doctor-who-2020`.
* Non-admin user with username `kristjan` and password `mister-master-2020`.
  * Has some default notebooks with sections and pages.

## The author's notes

The file `reqs.txt` contains commands used to set up the development environment.
However, it should suffice to run

```bash
npm install
npm setup
```

Always remember that if Icelandic letters do not show correctly in PSQL, run the following:

```bash
SET PGCLIENTENCODING=utf-8
chcp 65001
```

### Setting up Heroku and deploying project

```bash
# Set up Heroku (globally)
npm install -g heroku

# Navigate to git root folder, in my case it's vef2-eok4 and backend is contained within directory h1/

# Login
heroku login 

# Connect to remote
heroku git:remote -a noteworthy-md-eok4

# Push just a subtree (the webapp) to Heroku
git subtree push --prefix h1 heroku master

# See https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f for more details


# Set up Postgres database
heroku addons:create heroku-postgresql:hobby-dev -a noteworthy-md-eok4

# Set up Redis - Make sure to configure REDIS_URL usage in app.
heroku addons:create heroku-redis:hobby-dev -a noteworthy-md-eok4

# Run setup on Heroku (make sure Config Vars are correct on Heroku)
heroku run node setup.js
```

Use Papertrail for logging and Heroku-Redis for caching.


### Setting up redis (noSQL) for caching (inconvient on Windows)

If you want to configure caching on development environment, you'll have to set up and have a redis-server running locally.

```bash
# Install on Linux
sudo apt install redis-server

# Run server with default config
redis-server
```


## Project Description

**# noteworthyMD** is an online platform for storing and organizing notes, whether they be for courses at school, projects at work or anything else that that needs to be noted down. What separates **# noteworthyMD** from other platforms is that all of your notes can be written and stored in the `Markdown` markup language.

The basic layout is as such:

* Notebook
  * Section
    * Page
    * ... [more pages]
  * ... [more sections]
  * ImageURLs
    * ImageURL
    * ... [more ImageURLs]
* ... [more notebooks]

A user can register for and login to the platform, create multiple notebooks and add and delete sections and pages as they desire. A page can only be added within a section. The user can edit his pages by writing Markdown text into them, which the browser can render immediately and also store on the server. The system stores the pages so that they can be viewed in any browser on any device as long as the user is logged in. Each user only has access to their own notebooks and their contents.


## Functional requirements

Create a web service with:

* User Management
  * Users can register and login.
  * Users can change, create and delete their own notebooks, sections and pages.
  * Users can change their email and password.
  * Admins can make other users into admins or remove other users' admin privelege.
  * Admins can view all users, delete them and consequently all of their content.
  * (Optional) Admins can update the *About* section of the platform.
  * (Optional) Users can move their sections between notebooks, and their pages between sections.
* Notebooks
  * Belong to a user.
  * May contain sections.
  * Users can create, rename and delete their notebooks.
* Sections
  * Belong to a user.
  * Belong to a notebook.
  * May contain pages.
  * Users can create, rename and delete their sections.
* Pages
  * Belong to a user.
  * Belong to a section.
  * Users can create, rename and delete their pages.
  * Written in [Markdown with rendering and live preview](https://www.npmjs.com/package/react-markdown-renderer).
  * TODO: Keep in mind [Markdown's XSS vulnerabilities](https://github.com/showdownjs/showdown/wiki/Markdown's-XSS-Vulnerability-(and-how-to-mitigate-it))
* ImageURLs
  * Belong to a user.
  * Users can create and delete their images. Images are uploaded through the platform and stored on [Cloudinary](https://cloudinary.com/) 
    and the link can be embedded into the markdown-formatted blog post.
  * Users can view a list of their images.

(Optional) *About* section for the webpage must be viewable by all and editable by admins.


### Technical requirements

* Back-end 
  * Web Service should be a REST API created using `express`
  * It should have `GET`, `POST`, `PATCH` and `DELETE` endpoints.
* Data
  * PostgreSQL must be used as a DB, in which all the data will be stored.
  * All data provided by the user must be validated and sanitized, using `xss`.
  * There should be a way to populate the DB with data.
  * Fake pages created with `faker`. TODO: Consider if necessary? Use some available dataset instead?
* User Management
  * You should be able to register a user and login.
  * JWT with Passport should be used for authentication.
  * Passwords should not be present in this list of [500 bad passwords](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/500-worst-passwords.txt).
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
  * Updated, date with timezone, assigned by default.
* Notebooks
  * Id, integer, assigned by default.
  * UserId, integer.
  * Created, date with timezone, assigned by default.
  * Updated, date with timezone, assigned by default.
  * Title, varchar, not null.
  * Unique (UserId, Title).
* Sections
  * Id, integer, assigned by default.
  * UserId, integer.
  * NotebookId, integer.
  * Created, date with timezone, assigned by default.
  * Updated, date with timezone, assigned by default.
  * Title, varchar, not null.
  * Unique (NotebookId, Title).
* Pages
  * Id, integer, assigned by default.
  * UserId, integer. 
  * SectionId, integer. 
  * NotebookId, integer. 
  * Created, date with timezone, assigned by default.
  * Updated, date with timezone, assigned by default.
  * Title, varchar, not null.
  * Body, text (or bytea??), not null.
  * Unique (SectionId, Title).
* Images
  * Id, integer, assigned by default.
  * UserId, integer.
  * Created, date with timezone, assigned by default.
  * Title, varchar, not null.
  * Url, varchar, not null.
  * Unique (UserId, Title).

*Two-way pointing (i.e. Pages point to Sections and Sections contain Array of Pages) is unnecessary, because we can quickly get all Pages in a Section using the section_id.*

Tables should have unique Ids and use [foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) to point to other tables.


## Data

When a new user is created, one sample notebook is created for him. This notebook contains:
* 1 section with 2 pages.
* 2 images.

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
  * `GET` returns a list of up to 10 users, only if the user that performs the request is an admin. Uses pagination to return more users.
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
  * `GET` returns a list of notebooks that belong to the user who performs the request.
  * `POST` creates a new notebook owned by the user who performs the request. Request body must contain a valid title for the new notebook.
* `/notebooks/:id`
  * `GET` returns the notebook, only if it belongs to the user who performs the request.
  * `PATCH` updates the name of the notebook, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the notebook and all its contents, only if the user who performs the request is the owner.

### Sections

* `/sections`
  * `POST` creates a new section owned by the user who performs the request with foreign key pointing to a notebook entity owned by the user. Request body must contain the notebook id and a valid title for the new section.
* `/sections/:id`
  * `GET` returns the section, only if it belongs to the user who performs the request.
  * `PATCH` updates the name of the section, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the section and all its contents, only if the user who performs the request is the owner.

### Pages

* `/pages`
  * `POST` creates a new page owned by the user who performs the request with foreign key pointing to a section entity owned by the user. Request body must contain the section id and a valid title for the new section.
* `/pages/:id`
  * `GET` returns the page, only if it belongs to the user who performs the request.
  * `PATCH` updates the page, only if data input is valid, and if the user who performs the request is the owner.
  * `DELETE` deletes the page, only if the user who performs the request is the owner.

### Images
* `/images`
  * `POST` uploads a new image owned by the user who performs the request, only if data input is valid.
  * `GET` returns a list of up to 10 images owned by the user who performs the request. Uses pagination to return more images.
* `/images/:id`
  * `GET` returns an image, only if it belong to the user who performs the request.
  * `DELETE` deletes the image, only if the user who performs the request is the owner.
  * (Optional TODO): Allow patching to change names of images.
  * (Optional TODO): Delete images from cloudinary when deleted.

Each time when data is created or updated, the web service should verify that the user has permission and that the data is valid. If not, then the web service should return the appropriate HTTP status code and error message.



> Release 0.3

| Release | Description                                                              |
|---------|--------------------------------------------------------------------------|
| 0.1     | First release                                                            |
| 0.2     | Updated description.                                                     |
| 0.3     | Functionality completed.                                                 |
