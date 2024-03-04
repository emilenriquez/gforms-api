#GFORMS API
API for a google form clone


## Pre requisites
- yarn
- node version lts/gallium as provided in the .nvmrc file



## Run migrations
  - npx knex:migrate latest

## how to start application
  - yarn start-dev

## API Documentation

  - Documentation is automatically provided to all available API endpoints needed by using Swagger in combination with hapiJS framework, it is able to automatically detect any endpoints added.
  - you can visit localhost:3900/documentation to access swagger docs


## Schema/Model
* User
  - id (PK)
  - first_name
  - last_name
  - email (Unique)
  - password
  - role (Enum: USER, ADMIN)

* Form
  - id (PK)
  - label
  - admin_id (FK ref User)

* Question
  - id (PK)
  - label
  - form_id (FK ref Form)
  - section_group *used to identify the groupings of each section*
  - type (Enum: FREETEXT, SINGLE_CHOICE, MULTIPLE_SELECTION)
  - is_required (Boolean)

* Option
  - id (PK)
  - value
  - question_id (FK ref Question)

* User Response
  - id (PK)
  - form_id
  - user_id (FK ref User)
  - question_id (FK ref Question)
  - response




## Routes
*May also visit swagger for more detailed api documentation and trial executions

* Users
  - Create new Account
    - Endpoint: `/users`
    - method: `POST`
    - Payload:
      ```
        {
          firstName,
          lastName,
          email,
          password,
          role
        }
      ```
  - Login To the account
    - Endpoint: `/login`
    - method: `POST`
    - payload:
      ```
        {
          email,
          password
        }
      ```
* Forms
  - Create New Form
    - Endpoint: `/forms`
    - method: `POST`
    - Payload:
      ```
        label: string
        adminId: userId
      ```
  - Get all forms:
    - Endpoint: `/forms`
      method: `POST`

  - Update a form
    - Endpoint: `/forms/${id}`
    - method: `PUT`

  - Delete a form
    - Endpoint: `/forms/${id}`
    - method: `DELETE`









