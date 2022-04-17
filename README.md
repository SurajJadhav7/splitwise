# Splitwise Backend Application

This is a example of a Splitwise application providing a REST
API. Settlements (Simplify Debts) is implemented using Greedy Algorithm.

## Install

    git clone https://github.com/SurajJadhav7/splitwise.git
    cd splitwise/

## Run the app

    docker-compose up

## API

#### `/users`
* `GET` : Get all Users.
  * Example :  `http://localhost:5000/users`
  * Sample Response :
    ```
    [
      {
          "id": "cb7ef38c-6913-4b86-baf0-be35cd26872e",
          "username": "user1"
      },
      {
          "id": "d295ccaf-d7cb-4cb6-985b-28726b62e588",
          "username": "user2"
      },
      {
          "id": "fcf455e5-1fcc-4c32-bdb0-6231e42eadb3",
          "username": "user3"
      }
    ]
    ```
* `POST` : Create a new user. Requires username in the body.
  * Example :  `http://localhost:5000/users`
    ```
    {
      "username": "user5"
    }
    ```
  * Sample Response :
    ```
    {
        "message": "User created successfully.",
        "user": {
            "id": "cdb4cb2e-21fb-4539-92f8-e7007201fb7b",
            "username": "user5"
        }
    }
    ```

#### `/users/:id`
* `GET` : Get particular user. Requires user id in params.
  * Example :  `http://localhost:5000/users/d295ccaf-d7cb-4cb6-985b-28726b62e588`
  * Sample Response :
    ```
    {
        "id": "d295ccaf-d7cb-4cb6-985b-28726b62e588",
        "username": "user2"
    }
    ```

#### `/groups`
* `GET` : Get all Groups.
  * Example :  `http://localhost:5000/groups`
  * Sample Response :
    ```
    [
        {
            "id": "00ff2b79-e765-44a2-97b0-c352a14b356e",
            "groupname": "group3"
        },
        {
            "id": "9bcd0715-bc18-4b16-8641-026e15c81336",
            "groupname": "group2"
        },
        {
            "id": "b708eed7-9d99-42b4-b983-179493d212f3",
            "groupname": "group1"
        },
        {
            "id": "f9a80065-8012-477f-b1c6-a8bdf1f54ec7",
            "groupname": "group4"
        }
    ]
    ```
* `POST` : Create a new group. Requires groupname(string) and members(array of user ids) in the body.
  * Example :  `http://localhost:5000/groups`
    ```
    {
        "groupname": "group4",
        "members": [
            "cb7ef38c-6913-4b86-baf0-be35cd26872e",
            "d295ccaf-d7cb-4cb6-985b-28726b62e588"
        ]
    }
    ```
  * Sample Response :
    ```
    {
        "message": "Group created successfully.",
        "groupid": "89e7097e-0a99-4884-975c-54202757fa76",
        "members": [
            "cb7ef38c-6913-4b86-baf0-be35cd26872e",
            "d295ccaf-d7cb-4cb6-985b-28726b62e588"
        ]
    }
    ```

#### `/groups/:id`
* `GET` : Get particular group. Requires groupid in params.
  * Example :  `http://localhost:5000/groups/f9a80065-8012-477f-b1c6-a8bdf1f54ec7`
  * Sample Response :
    ```
    {
        "id": "f9a80065-8012-477f-b1c6-a8bdf1f54ec7",
        "groupname": "group4",
        "members": [
            "d295ccaf-d7cb-4cb6-985b-28726b62e588",
            "cb7ef38c-6913-4b86-baf0-be35cd26872e"
        ]
    }
    ```

#### `/transactions`
* `POST` : Create new Transaction. Requires name(string), paidby(object of payers and amounts), paidto(object of receivers and amounts), groupid. You can add multiple paidby or paidto users and respective amounts.
  * Example :  `http://localhost:5000/transactions`
    ```
    {
        "name": "dinner",
        "paidby": {
            "cb7ef38c-6913-4b86-baf0-be35cd26872e": 30
            },
        "paidto": {
            "fcf455e5-1fcc-4c32-bdb0-6231e42eadb3": 30
            },
        "groupid": "b708eed7-9d99-42b4-b983-179493d212f3"
    }
    ```
  * Sample Response :
    ```
    {
        "message": "Transaction created successfully.",
        "transactionid": "a8437685-b081-414f-be58-1d29a7bf50ed"
    }
    ```

#### `/transactions?id=<transaction id>`
* `GET` : Get transaction using transaction id. Requires transaction id.
  * Example :  `http://localhost:5000/transactions?id=9a35c80f-af1a-41a4-bb7a-cb78af579389`
  * Sample Response :
    ```
    {
        "id": "9a35c80f-af1a-41a4-bb7a-cb78af579389",
        "groupid": "b708eed7-9d99-42b4-b983-179493d212f3",
        "detail": "dinner2",
        "operations": [
            {
                "id": "3acdfbd1-3915-41f1-a1c5-4b824d466c4a",
                "groupid": "b708eed7-9d99-42b4-b983-179493d212f3",
                "transactionid": "9a35c80f-af1a-41a4-bb7a-cb78af579389",
                "paidby": "cb7ef38c-6913-4b86-baf0-be35cd26872e",
                "paidto": "fcf455e5-1fcc-4c32-bdb0-6231e42eadb3",
                "amount": 30
            }
        ]
    }
    ```

#### `/settlements?id=<group id>`
* `GET` : Get settlements using group id. Requires group id.
  * Example :  `http://localhost:5000/settlements?id=b708eed7-9d99-42b4-b983-179493d212f3`
  * Sample Response :
    ```
    {
        "beforeSettlements": [
            {
                "userWhoIsGoingToReceive": "cb7ef38c-6913-4b86-baf0-be35cd26872e",
                "userWhoIsGoingToPay": "fcf455e5-1fcc-4c32-bdb0-6231e42eadb3",
                "amount": 70
            },
            {
                "userWhoIsGoingToReceive": "fcf455e5-1fcc-4c32-bdb0-6231e42eadb3",
                "userWhoIsGoingToPay": "d295ccaf-d7cb-4cb6-985b-28726b62e588",
                "amount": 10
            },
            {
                "userWhoIsGoingToReceive": "d295ccaf-d7cb-4cb6-985b-28726b62e588",
                "userWhoIsGoingToPay": "cb7ef38c-6913-4b86-baf0-be35cd26872e",
                "amount": 10
            }
        ],
        "afterSettlements": [
            {
                "userWhoIsGoingToReceive": "cb7ef38c-6913-4b86-baf0-be35cd26872e",
                "userWhoIsGoingToPay": "fcf455e5-1fcc-4c32-bdb0-6231e42eadb3",
                "amount": 60
            }
        ]
    }
    ```
