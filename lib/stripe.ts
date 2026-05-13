import Stripe from "stripe"

const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"

export const stripe = new Stripe(apiKey, {
  apiVersion: "2024-06-20", // Use a stable version if possible, or keep the existing one
  typescript: true,
})
