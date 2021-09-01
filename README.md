# Cloud Password Manager
Project built for a an undergrad security course (CMPS 283 @ AUB).

What follows is part of the report submitted with the project.

## Purpose

Password reuse is bad practice and password overload is an undeniable phenomenon. According to a recent research by NordPass, the average user has around 100 passwords. Even half that number of accounts is still too many accounts when trying to maintain a unique password per account.

That is where password managers come in. In order to effectively track unique passwords across the vast number of online accounts, password managers are becoming increasingly essential.

The purpose of our application is to provide a solution for users requiring a user-friendly, completely private, and highly secure application in which they can easily store, track, and transfer information.

## Scope

The app is a web-based SPA that primarily targets the security aspect of a password manager. Convenient features that do not pertain to security but are useful nonetheless, such as auto-fill, are beyond the scope of the application as they are beyond the scope of the course.

We also do not include a native mobile or desktop application, for the same reason. However, the web app is responsive to support mobile users without breaking the UI or disrupting services.

## Requirements

Below is the list of requirements we aimed to fulfill in our application:

- Complete privacy of user records (even from server)
- Secure and convenient random password generation
- Multiple templates for secure items to store (not just passwords)
- Highly customizable secure records
- Sharing items securely between users

## Features

## Responsive User Interface

All components of the application are rendered properly on mobile devices and all pages are responsive to screen size.

## Customizable Records

In order to maximize user convenience, the app features fully customizable records. There are three key properties within each record that ensure customizability:

1. A record can have any number of fields added and removed freely by the user
2. All field labels can be renamed regardless whether the field is from the template or added by the user
3. A field can be one of four types (Text, Long Text, Date, and Password) and the type can be changed at the user&#39;s will.

When the user picks a template to add a record, that template is provided for convenience and does not limit the user in any way.

## Random Password Generator

A key feature for any password manager is to provide a tool to generate secure random passwords. Our app features a tool that appears as a popup dialog when the key icon is clicked next to any field of type &quot;Password&quot;.

The key features of the password generators are as follows:

1. A colored gauge that estimates the strength of the password
2. A copy-to-clipboard button to conveniently copy the generated password
3. Generating any combination of uppercase letters, lowercase letters, numbers, and symbols
4. A length selector to generate a password between 1 and 50 characters

## Sharing Secure Items

Not all secure items are meant to be personal. For instance, the credentials of a family account is usually shared among family members or secure notes are shared with trusted persons.

Our app allows the secure sharing of any item with other app users. Ideally, in a commercial product, a user would share an item with any email and if the email does not belong to an existing member, they receive an invitation to subscribe. However, for the scope of this project, only existing members receive the shared item because implementing an invitation-by-email adds complexity that goes beyond the scope of this project and this course.

It is important to note that sharing of the secure items happens without ever exposing the content of the items to the server and without sharing the owner&#39;s key. Details of the sharing mechanism will be given in the [Security Model](#_Asymmetric_Encryption_to) section.

## Tags System

Each record can have any number of user-defined tags. Tags and items have a many-to-many relationship. The same tag can belong to many items, and one record can have many tags. A list of unique tags can be viewed in the navigation drawer to allow the user to filter records using tags. This list of tags is completely dynamic; if no record was tagged by the user, then no tags appear in the drawer—there is no predefined set of tags. Also, tags are created simply by typing the tag-label and hitting TAB or ENTER when creating the secure item. The app will take care of grouping the tags created so far.

## Security Model

This section describes in details the implementation elements that target the security aspect of the application. The described details here are high-level and do not include details regarding the libraries used.

## Keys from Master Password

At the heart of our security model is the fact that the Master Password is essential for any key derivation, but is never used directly as a key anywhere.

Whenever the Master Password is entered by the user, the following three keys are generated:

- The secret vault key (VK)
- The public key (PK)
- The auth key

The vault key remains on the client side and it is the one used for encryption and decryption of items. The auth key is sent to the server for registration and authentication purposes. And the public key is stored in the database on the server side to be used for secure item sharing later on.

![key_generation_process](https://drive.google.com/uc?export=view&id=1m0ly-X06r-2fJib14xEHBQSqhQKTdXk-)

_Figure 1: Key generation process_

## Client-side Encryption &amp; Decryption

Whenever a secure item is created, two versions of it are transformed to a JSON string with all their components encrypted fully as one string:

- Overview version: includes only item title, item type, and icon of item (no sensitive data is included)
- Detailed version: includes all components of the item

The purpose of this, is to never, at any point, have the entire list of secure items decrypted in memory on the client. When the user fetches the collection of secure items, only the overview versions are decrypted to show meaningful collection of cards on client. The full version of an item is decrypted only when that item is viewed, and then erased from memory when the item is closed.

Also note here that no meta data regarding the secure item is stored in plaintext, ever. In the unlikely event of an attacker gaining unauthorized access to the database, it is impossible for them to gain any insight about the items a user has stored. They cannot know the types or content of these items; they cannot even know the title and field labels of these items.

## Symmetric Encryption to Store Items

Items created by the user are considered owned by the user and are stored encrypted in a subcollection of items (details in the data model). A typical document of item in the database has four fields: `encryptedItem`, `encryptedOverview`, `itemHMAC`, `overviewHMAC`.

As discussed earlier, the `encryptedItem` and encryptedOverview fields respectively store the detailed and overview versions of the item&#39;s JSON string.

The HMAC fields store a 512-bits HMAC generated using the data (item or overview data), a random salt, and the vault key. These fields guarantee the integrity of the encrypted items to, again, counter the highly unlikely event of an attacker gaining unauthorized write-access to the database. The random salt generated during the HMAC signature process is stored hidden inside the encryptedOverview and encryptedItem fields.

Upon fetching the list of items, the encryptedOverview is decrypted, the salt is extracted, and the HMAC is computed and compared with the fetched overviewHMAC. The same process occurs with the encryptedItem and itemHMAC upon opening a secure item.

An altered item (or overview) is marked invalid upon decryption.
![secure_item_encryption](https://drive.google.com/uc?export=view&id=1GtI1z3dHHFDwXcIX5LAQ8YLQs0VpE1ra)

_Figure 2: Encryption process of a secure item_

## Asymmetric Encryption to Share Items

The process of securely sharing an item has a few key differences compared to the process of securely storing the owned item:

- No HMAC is generated for the shared item because it is encryption algorithm encrypts the data with the public key of the receiver and then signs it with the private key of the sender.
- Decrypting a shared item can only be done by the receiver (the owner of the public key used for encryption)
- The decryption algorithm requires the public key of the sender and the private key of the receiver. This ensures authenticity and confidentiality of the shared item.
- There are three key fields added to the record of the shared item
  - sharedBy: the email of the sender (the owner of the original item)
  - sharedWith: the email of the item&#39;s recipient
  - encryptedID: the ID of the original item encrypted via AES by the item&#39;s owner. This is needed to allow the owner of the shared document to view its details on the client
  - hashedID: a SHA-256 hash of the original item&#39;s ID. This is used to efficiently propagate changes in the original item to all the shared versions of it.

![shared_item_encryption](https://drive.google.com/uc?export=view&id=1UgDiEdzAn8Kxn30dw7fxD0k-GmazXK9C)

_Figure 3: Encryption of a shared item_

## Random Password Generator

A password manager without a random password generator is simply incomplete. The main motivation behind a password manager is the fact that the average user now needs to remember too many passwords. If the password manager requires that the user creates their own passwords, then users will go back to creating identical, or closely related passwords.

To guarantee security of a password generator, our app includes a password-strength measuring algorithm that scores passwords based on their length, the number of unique characters, and the variance in the character sets used (lowercase, uppercase, numbers, and symbols).

Further, the randomness of the password generated results from three steps:

1. A random character set is chosen depending on which character types the user has selected (lowercase, uppercase, numbers, symbols)
2. A random character within the character set is chosen
3. The character is inserted at a random position within the output array

These three steps are repeated according to the chosen length of the password until the output array is full; at which point the array is joined and the random password appears on the screen as a string of characters.

![password_generator](https://drive.google.com/uc?export=view&id=11o-bJ3Un9WHj-BpY33gLPJqMVUAJQaFj)

_Figure 4: Screenshot of the password generator_



## Data Model

Because the app features fully customizable records in terms of number of fields, field labels, and field types; our data is inherently schema-less and there is no added value gained in using a relational database. The few incidents where referential integrity is needed, are easily handled by a NoSQL database.

Our database of choice was Firestore — a document-oriented NoSQL database that brings in multiple benefits, including:

### Realtime Data

This feature comes particularly handy when sharing items. When a user shares an item with another user, the recipient will see the change in their application immediately in real time without needing to refresh. All changes occurring in the database are reflected on the client immediately, but this sharing items is the one that benefits most from this.

### Scalability and Performance

Although this is a class project and not expected to demand high scale, NoSQL databases are far more scalable than relational databases, mainly due to their ability to scale horizontally. Details concerning the scalability and performance perks of Firestore in particular are included in [Appendix A](#_Appendix_A:_Technology) along with other details regarding the technology stack used.

### Development Speed

This benefit is particularly handy in light of the timeframe that was available to develop this project. By using Firestore, and the accompanying Firebase services, we made use of the well-established Firebase SDK which meant that we did not need to implement a server-side application alongside our client application. Our application ended up being a single code-base that has front-end code and JavaScript files that use the Firebase SDK to communicate data between the client and the server.

![data_model](https://drive.google.com/uc?export=view&id=1P2OBdVhm1L2WCRzEyHYBanCPVbL2pTW8)

_Figure 5: Database collections diagram_

## Limitations

## Forgotten Master Password

Keeping the Master Password from ever reaching the server leads to a password-reset problem. If the user loses the Master Password, and the server doesn&#39;t have it, a password reset will render the encrypted vault useless; as there is no way to decrypt then re-encrypt the data with the new vault key.

Note that changing a password without having forgotten the current one is possible and implemented in the app. However, resetting a forgotten password is not possible as it stands.

We believe that a password manager that does not support a password reset is a viable product because the user only has one password to memorize. However, we recognize that there is a solution for this problem, and, as such, will detail below the high-level approach even though it was not implemented:

- User authenticates with server
- Server stores a hash representing the used device along with a random 256-bit key
- Server sends random key to client
- Client encrypts Master Password with the random key and stores it in local storage
- In case forgotten, client uses a previously-used device and requests a password-reset
- If the server recognizes the device, an OTP is sent via email to validate the request
- User uses OTP and is redirected to a password-reset form and receives decryption key from server
- Password on device is decrypted using the server&#39;s key and the old Vault Key is stored in memory
- Upon resetting the password, the user receives the old vault, decrypts it with the vault key, re-encrypts it with the new vault key generated from the new password, and sends the newly encrypted items back to the database
