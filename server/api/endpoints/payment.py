import os
import stripe
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlmodel import Session, select
from server.db import get_session
from server.models import User, PlanTier
from server.api.deps import get_current_user

router = APIRouter()

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
# Product Price ID (Must be created in Stripe Dashboard)
# For MVP, we use environmental or hardcoded fallback, but user MUST set it.
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "price_1Q...") 

@router.post("/create-checkout-session")
def create_checkout_session(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    try:
        # Check if already has customer_id, else create
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.full_name
            )
            current_user.stripe_customer_id = customer.id
            session.add(current_user)
            session.commit()

        checkout_session = stripe.checkout.Session.create(
            customer=current_user.stripe_customer_id,
            line_items=[
                {
                    'price': STRIPE_PRICE_ID,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000") + '/plans/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000") + '/plans?canceled=true',
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, session: Session = Depends(get_session)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session_obj = event['data']['object']
        customer_id = session_obj.get('customer')
        subscription_id = session_obj.get('subscription')
        
        # Find user by customer_id
        statement = select(User).where(User.stripe_customer_id == customer_id)
        user = session.exec(statement).first()
        
        if user:
            user.stripe_subscription_id = subscription_id
            user.plan_tier = PlanTier.MASTERCHEF
            user.plan_status = "active"
            session.add(user)
            session.commit()
            print(f"User {user.email} upgraded to MasterChef")

    return {"status": "success"}
