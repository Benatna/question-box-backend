
# Benatna Backend

This is the back-end server created to accompany the Front End of a [Question Box](https://github.com/Benatna/question-box-frontend) Single Web Application designed to promote a peer-to-peer, culturally appropriate approach to Sex Education in Refugees and New Germans.

The back-end consist of a REST-like API that interfaces with the front-end for receiving questions, updating questions details, registering users for notifications, and submit those notifications via email and/or Web Push protocols.

Management of content is done through user profiles (_Ambassadors_, people who answer, and Administrators), which can login using JSON Web Tokens.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running tests](#running-tests)
- [Environment Variables](#environment-variables)
- [API End-Points](#api-end-points)
  - [Public Routes](#public-routes)
  - [Private Routes](#private-routes)
- [Multilanguage](#multilanguage)
- [Technology](#technology)
  - [Database](#database)
  - [Encryption](#encryption)
  - [Push Notifications](#push-notifications)
  - [Email Notifications](#email-notifications)
- [Get in Touch](#get-in-touch)
- [Acknowledgements](#acknowledgements)
- [Team](#team)
- [License](#license)
- [Funding](#funding)

## Prerequisites

The back-end requires you to have **node.js ^8.10** and **npm ^3.5.2** installed in your server.

## Getting Started

First, download or clone this repository.

```
git clone https://github.com/Benatna/question-box-backend.git
```

After downloaded, access the downloaded folder and install the required dependencies.

```
cd question-box-backend
npm install
```

You will also want to create a file with environment variables.

```
nano .env
```

You can see the list of required environment variables and their definition [here](#environment-variables).

With all dependencies installed and environment variables defined, the application can be started:

```
npm run start
```

This will start the application using the included `nodemon.json` configuration.

## Running tests

You can run the tests by executing the following command:

```
npm run test
```

Tests are carried in every single end-point of the API.

> **IMPORTANT:** No automatic testing is developed for Email notifications and Web Push. These behaviors must be tested manually, but they should work out-of-the-box.

## Environment Variables

| Variable        | Example   | Comments  |
| --------------- |---------------| ---------|
|NODE_ENV| `NODE_ENV=production` | responds to test or not test |
| PORT | `PORT=3000` |   If not defined, runs in 3000 |
| LOWDBFILE | `LOWDBFILE=db.json` | Location of JSON DB file |
| CRYPTRKEY | `CRYPTRKEY=OwE49wsPcN` | Key for encryption of emails in the database |
| JWT_KEY | `JWT_KEY=FOOUE8Kyqo` | Encryption key for the [JSON Web Tokens](https://jwt.io)  |
| ADMIN_EMAIL | `ADMIN_EMAIL=contact@yourdomain.com` | Used for the creation of default administrator account, push notifications, email transporter |
| ADMIN_PASSWORD | `ADMIN_PASSWORD=jyLouM2Gci` | Used for the creation of default administrator account|
| WEBSITE_URL | `WEBSITE_URL=https://www.yourdomain.com` | Used for the email and push notifications |
| EMAIL_PASSWORD | `EMAIL_PASSWORD=YEDZ1yRfz12` | Required for the email transporter. It pairs with `ADMIN_EMAIL` |
| EMAIL_PORT | `EMAIL_PORT=465` | Required for the email transporter  |
| EMAIL_SECURE | `EMAIL_PORT=true` | true for 465, false for other ports  |
| VAPIDKEY_PUBLIC | `VAPIDKEY_PUBLIC=BCv-0bxPV_RQj(..)` | For generating VAPID keys follow [these instructions](https://github.com/web-push-libs/web-push#generatevapidkeys) |
| VAPIDKEY_PRIVATE | `VAPIDKEY_PRIVATE=JONfGPAp9i(..)` | For generating VAPID keys follow [these instructions](https://github.com/web-push-libs/web-push#generatevapidkeys) |

## API End-Points

The API hosts two main routes: questions and users. Both are differentiated between Public and Private routes.

### Public Routes

| Method | End-Point   | Request Body  | Successful Response | Description |
| ------ | ----------- | ------------- | ------------------- | ----------- |
| POST | /users/login | email, password | JSON Web Token | Checks if user/password combination is correct and returns a web token |
| GET | /users/ambassadors |  | ambassadors array | Returns public information of ambassadors |
| GET | /questions/ |  | questions array | Returns all answered questions |
| POST | /questions/ | question object | created question object | Send a new question to the server |
| PATCH | /questions/:id/ | question object | updated question object | Update details of a specific question |
| PATCH | /questions/:id/update_views/ |  | updated question object | Increments the number of views of the question in the database |
| POST | /questions/:id/subscribe/email/ | question id, email | question id and email | Creates an email notification event in the database |
| POST | /questions/:id/subscribe/push/ | question id, subscription event | message: "Subscription successful" | Registers a push notification subscription in the database |

### Private Routes

All private routes require a valid JSON Web Token in the header as authentication.

| Method | End-Point   | Request Body  | Successful Response | Permission | Description |
| ------ | ----------- | ------------- | ------------------- | ---------- | ----------- |
| POST | /users/register/ | email, role, password, age, name, picture, location, bio | message: "User created." | Administrators | Creates a new account |
| PATCH | /users/update/ | email, new_email, new_password, role, age, name, picture, location, bio | message: "User updated." | Administrators, the user itself |Modifies an user account. It fails if no other administrator exists  |
| DELETE | /users/delete/ | email | message: "User deleted." | Administrators, the user itself | Deletes an user. It fails if no other administrator exists |
| GET | /questions/all/ |  | questions array | Ambassadors, administrators | Lists all questions, even unanswered ones |
| GET | /questions/:id/ |  | question object | Ambassadors, administrators | Get all details about the question submitted |
| PATCH | /questions/:id/modify | question object | question object | Ambassadors, administrators | Modify the question's details |
| DELETE | /questions/:id/ | | message: "Question Deleted." | Ambassadors, administrators | Delete specific question |
| PUT | /questions/:id/answer | answer object | question object | Ambassadors, administrators | Answer or update a previous answer |
| DELETE | /questions/:id/answer | | question object | Ambassadors, administrators | Delete a previous answer |

## Static files

The application can serve static files uploaded to the `/static/` folder, and accessed through the `/static/` route.

## Multi-language

The application comes bundled to work in German and English out-of-the-box. Additional language must be hard-coded for now.

## Important Dependencies

### Database

The application comes bundled with [lowdb](https://github.com/typicode/lowdb/), ready to run out-of-the-box. However, if a more complex Database solution is required, only models need to be changed.

### Encryption

Emails are encrypted using [cryptr](https://github.com/MauriceButler/cryptr#readme) and passwords are hashed and then stored using [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme).

### Push Notifications

Push notifications are implemented using the node.js package [web-push](https://github.com/web-push-libs/web-push). You can read more information about its usage in the project's github.

### Email Notifications

Email notifications are implemented using the node.js package [nodemailer](http://nodemailer.com/). You can find more information about its usage and configuration in the project's homepage.

## Get in Touch

If you need any help and/or want to get in touch with us, don't hesitate to [Submit an Issue](https://github.com/Benatna/question-box-backend/issues), and/or contact us at [contact@benatna.de](mailto:contact@benatna.de), or via [Facebook](#) and [Twitter](#).

## Acknowledgements

Thanks to Ahmad, Ahmed, Nickhil, Zain and Zeina for their support, hard work, and insights during the development and deployment of this solution.

## Team

This project was created in six months for the beautiful team of:

- **Cornelia Blum**: Lead.
- **Pedro Poblete Lasserre**: Coder.
- **Hector Pahaut**: Designer.
- **Pooja  Veerappa**: User Researcher.
- **Juli Maier**: Mentor.

## License

This project is licensed under the MIT License - see the  [LICENSE](https://github.com/Benatna/question-box-backend/LICENSE)  file for details.

## Funding

Funding for the initial development of this project came from the [Prototype Fund](https://prototypefund.de/), an initiative of the [German Federal Ministry of Education and Research](http://bmbf.de/).
