# Description

This repo helps you to quickly save a credit card to a customer.

## Steps

1. Search the string `"YOUR-ACCESS-TOKEN"` and replace it with your access token (from your seller test-user)
2. Search the string `"YOUR-PUBLIC-KEY"` and replace it with your public key (from your seller test-user)
3. npm install
4. npm start run
5. go to `localhost:3001/bricks`
6. fill the bricks form.
* If you are using production credentials (APP-*), use a test-user email from an user at the same country of your seller.
* Use a test credit card from the same country of your seller user.
8. click pay

In the devtools console of your browser, you can check the relevant information from the `payment`, created `customer` and saved `card`.

The `customer id` and `saved card id`, information needed to initialize a brick with that saved card, you can found here:

```json
{
    "payment": {},
    "customer": {
        "body": {
            "id": "<HERE IS THE CUSTOMER ID>"
        },
        "response": {},
        "status": 201
    },
    "savedCard": {
        "body": {
            "id": "<HERE IS THE SAVED CARD ID>"
        },
        "response": {},
        "status": 201
    },
    "status": "approved"
}
```
