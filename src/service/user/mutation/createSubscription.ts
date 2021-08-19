import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import { gql } from "graphql-request";

const { SHOP, ACCESS_TOKEN } = process.env;

const plans = {
  BASIC: {
    price: 99.9,
  },
  GOLD: {
    price: 199.9,
  },
  PLATINUM: {
    price: 299.9,
  },
};

// const APP_SUB_CREATE = gql`
//  mutation {
//         appSubscriptionCreate(
//           name: "Storebrew subscription",
//           lineItems: {plan: { appRecurringPricingDetails: {
//             interval: EVERY_30_DAYS,
//             price: {
//               amount: 1000,
//               currencyCode: USD
//             }
//           },

//           }

//         }            ,
//         returnUrl:  "http://localhost:3000/subscription-success",  test: true ) {

//       }}
// `;

const createSubscription = async (args, context) => {
  console.log("args", args);
  const plan = plans[args.data.plan];
  const client = new Shopify.Clients.Graphql(SHOP, ACCESS_TOKEN);
  const res = await client.query({
    data: ` 
    mutation {
        appSubscriptionCreate(
          name: "Storebrew subscription",
          lineItems: {plan: { appRecurringPricingDetails: {
            interval: EVERY_30_DAYS,
            price: {
              amount: ${plan.price},
              currencyCode: USD
            }
          },
   
          }
          
          }            , 
          returnUrl:  "http://localhost:3000/subscription-success",  test: true ) {
          appSubscription {
            id
            lineItems {
          plan {
            pricingDetails 
          }
          }}
          confirmationUrl
          userErrors {
            field
            message
          
        }
      }}
    `,
  });
  console.log("subccccc", res.body);
  const subscription = (res.body as any).data.appSubscriptionCreate;
  console.log(
    "subscrio pricing details",
    subscription.appSubscription.lineItems[0].plan
  );
  const data = {
    id: subscription.appSubscription.id,
    confirmationUrl: subscription.confirmationUrl,
  };
  return data;
};

export default createSubscription;
