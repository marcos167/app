
import stripe
import os

key = "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"
stripe.api_key = key

try:
    print("Testing Stripe connection with RK key...")
    # List customers to test read permission
    customers = stripe.Customer.list(limit=1)
    print("Success: Read Customers OK")
    
    # Attempt to create a checkout session (dry run or simple)
    # We won't actually complete it, just create object
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'brl',
                'product_data': {'name': 'Test Product'},
                'unit_amount': 2000,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://example.com/success',
        cancel_url='https://example.com/cancel',
    )
    print("Success: Create Checkout Session OK")
except Exception as e:
    print(f"FAILED: {e}")
