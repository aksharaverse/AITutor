from datetime import date

from app.core.quota import remaining_today

TODAY = date(2026, 7, 11)
YESTERDAY = date(2026, 7, 10)


def test_pro_is_unlimited():
    assert remaining_today("pro", 999, TODAY, TODAY, 10) is None


def test_free_counts_down():
    assert remaining_today("free", 3, TODAY, TODAY, 10) == 7


def test_free_exhausted_clamps_at_zero():
    assert remaining_today("free", 15, TODAY, TODAY, 10) == 0


def test_lazy_reset_restores_full_quota():
    assert remaining_today("free", 10, YESTERDAY, TODAY, 10) == 10
