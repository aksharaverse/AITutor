from datetime import datetime, timezone

import stripe
from fastapi import APIRouter, Depends, Request
from fastapi.concurrency import run_in_threadpool

from app.config import settings
from app.db import get_pool
from app.deps import get_profile
from app.errors import ApiError

router = APIRouter()
stripe.api_key = settings.stripe_secret_key


@router.post("/v1/billing/checkout")
async def create_checkout(profile: dict = Depends(get_profile)):
    if profile["plan"] == "pro":
        raise ApiError(409, "ALREADY_PRO", "You already have an active Pro plan")

    def _create():
        return stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": settings.stripe_price_id, "quantity": 1}],
            customer_email=profile["email"] or None,
            client_reference_id=str(profile["id"]),
            success_url=f"{settings.frontend_url}/account?upgraded=1",
            cancel_url=f"{settings.frontend_url}/account",
        )

    session = await run_in_threadpool(_create)
    return {"checkout_url": session.url}


@router.post("/v1/billing/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise ApiError(400, "BAD_SIGNATURE", "Invalid Stripe signature")

    pool = get_pool()
    # Idempotency in one line: Stripe retries webhooks; a replay is a no-op.
    inserted = await pool.fetchrow(
        "insert into billing_events (stripe_event_id) values ($1) "
        "on conflict do nothing returning stripe_event_id",
        event["id"],
    )
    if inserted is None:
        return {"received": True, "duplicate": True}

    obj = event["data"]["object"]

    if event["type"] == "checkout.session.completed":
        user_id = obj.get("client_reference_id")
        sub_id = obj.get("subscription")
        expires = None
        if sub_id:
            sub = await run_in_threadpool(stripe.Subscription.retrieve, sub_id)
            expires = datetime.fromtimestamp(
                sub["current_period_end"], tz=timezone.utc
            )
        if user_id:
            await pool.execute(
                """update profiles set plan = 'pro', stripe_customer_id = $2,
                   plan_expires_at = $3 where id = $1""",
                user_id, obj.get("customer"), expires,
            )

    elif event["type"] == "customer.subscription.deleted":
        await pool.execute(
            "update profiles set plan = 'free', plan_expires_at = null "
            "where stripe_customer_id = $1",
            obj.get("customer"),
        )

    # Other events (payment_failed grace handling, proration) are Phase 2.
    return {"received": True}
