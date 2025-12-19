import os
import stripe
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlmodel import Session, select
from server.db import get_session
from server.models import User
from server.api.deps import get_current_user

router = APIRouter()

# Initialize Stripe with live keys
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "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")
stripe.api_key = STRIPE_SECRET_KEY

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# MasterChef Product and Price IDs
MASTERCHEF_PRODUCT_ID = "prod_Td5XZpTT1RpolN"
MASTERCHEF_PRICE_ID = "price_1SfpMdEg2I4fRUxs5tF9XEbD"

# App URLs
APP_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")

@router.post("/create-checkout-session")
def create_checkout_session(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a Stripe Checkout session for MasterChef subscription"""
    try:
        # Check if user already has an active subscription
        if current_user.plan_tier == "masterchef" and current_user.plan_status == "active":
            raise HTTPException(status_code=400, detail="Você já é um MasterChef!")

        # Check if already has customer_id, else create
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.full_name or current_user.email,
                metadata={
                    "user_id": str(current_user.id)
                }
            )
            current_user.stripe_customer_id = customer.id
            session.add(current_user)
            session.commit()

        checkout_session = stripe.checkout.Session.create(
            customer=current_user.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[
                {
                    'price': MASTERCHEF_PRICE_ID,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=f"{APP_URL}/plans/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{APP_URL}/plans?canceled=true",
            metadata={
                "user_id": str(current_user.id)
            },
            subscription_data={
                "metadata": {
                    "user_id": str(current_user.id)
                }
            }
        )
        return {"checkout_url": checkout_session.url}
    except stripe.error.StripeError as e:
        print(f"STRIPE ERROR: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e.user_message if hasattr(e, 'user_message') else e))
    except Exception as e:
        import traceback
        print(f"GENERAL ERROR: {str(e)}")
        # Return 400 to ensure frontend sees the message instead of "Internal Server Error"
        raise HTTPException(status_code=400, detail=f"DEBUG ERROR: {str(e)}")

@router.get("/subscription-status")
def get_subscription_status(
    current_user: User = Depends(get_current_user)
):
    """Get current user's subscription status"""
    return {
        "plan_tier": current_user.plan_tier,
        "plan_status": current_user.plan_status,
        "is_masterchef": current_user.plan_tier == "masterchef" and current_user.plan_status == "active"
    }

@router.post("/create-portal-session")
def create_portal_session(
    current_user: User = Depends(get_current_user)
):
    """Create a Stripe Customer Portal session for managing subscription"""
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="Nenhuma assinatura encontrada")
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=f"{APP_URL}/profile"
        )
        return {"portal_url": portal_session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, session: Session = Depends(get_session)):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    # If webhook secret is not set, skip signature verification (for testing)
    if STRIPE_WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        import json
        event = json.loads(payload)

    event_type = event.get('type', event.get('type'))
    data = event.get('data', {}).get('object', {})

    # Handle checkout.session.completed - User completed payment
    if event_type == 'checkout.session.completed':
        customer_id = data.get('customer')
        subscription_id = data.get('subscription')
        
        statement = select(User).where(User.stripe_customer_id == customer_id)
        user = session.exec(statement).first()
        
        if user:
            user.stripe_subscription_id = subscription_id
            user.plan_tier = "masterchef"
            user.plan_status = "active"
            session.add(user)
            session.commit()
            print(f"✅ User {user.email} upgraded to MasterChef!")

    # Handle subscription updated
    elif event_type == 'customer.subscription.updated':
        subscription_id = data.get('id')
        status = data.get('status')
        
        statement = select(User).where(User.stripe_subscription_id == subscription_id)
        user = session.exec(statement).first()
        
        if user:
            user.plan_status = status
            if status in ['canceled', 'unpaid', 'past_due']:
                user.plan_tier = "free"
            session.add(user)
            session.commit()
            print(f"📝 User {user.email} subscription status: {status}")

    # Handle subscription deleted
    elif event_type == 'customer.subscription.deleted':
        subscription_id = data.get('id')
        
        statement = select(User).where(User.stripe_subscription_id == subscription_id)
        user = session.exec(statement).first()
        
        if user:
            user.plan_tier = "free"
            user.plan_status = "canceled"
            user.stripe_subscription_id = None
            session.add(user)
            session.commit()
            print(f"❌ User {user.email} subscription canceled")

    return {"status": "success"}
