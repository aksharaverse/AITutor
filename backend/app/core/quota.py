"""Daily-quota logic. The atomic check-and-increment lives in ask.py's SQL;
this pure helper computes 'remaining today' for /v1/me and is unit-tested."""

from datetime import date


def remaining_today(
    plan: str,
    questions_today: int,
    questions_reset_on: date,
    today: date,
    free_daily_limit: int,
) -> int | None:
    """None means unlimited (pro). Lazy reset: a stale reset date counts as 0 used."""
    if plan == "pro":
        return None
    used = 0 if questions_reset_on < today else questions_today
    return max(free_daily_limit - used, 0)
