"""A.3a: the content-authoring guide's examples are executable.

A guide that lies is worse than no guide: a contributor trusts it, fails, and
concludes the tooling is broken. So every YAML block in
`docs/Build/Content-Authoring.md` is extracted and run through the *real* linter:

    # VALID    → must lint clean
    # INVALID  → must be rejected, for the reason the guide claims

The deliverable for A.3a is "someone who has never seen the project can add ten
valid items". These tests are what stops that from silently stopping being true —
if a lint rule changes and the guide doesn't, this goes red.
"""

import pathlib
import re

import pytest

from app.ingest.item_spec import ItemError, lint, parse
from app.ingest.kc_graph import load as load_kc

ROOT = pathlib.Path(__file__).resolve().parents[2]
GUIDE = ROOT / "docs" / "Build" / "Content-Authoring.md"
KC = ROOT / "content" / "kc" / "phy_mechanics.yaml"

KC_SPEC = load_kc(KC)
KC_IDS = {k.id for k in KC_SPEC.kcs}

_BLOCK_RE = re.compile(r"```yaml\n(.*?)```", re.S)


def _blocks(marker: str) -> list[str]:
    text = GUIDE.read_text(encoding="utf-8")
    return [b for b in _BLOCK_RE.findall(text) if b.lstrip().startswith(marker)]


def test_the_guide_exists_and_has_examples():
    assert GUIDE.is_file(), "the content guide is the A.3a deliverable"
    assert _blocks("# VALID"), "no VALID examples — nothing for a contributor to copy"
    assert _blocks("# INVALID"), "no INVALID examples — the guide never shows a failure"


@pytest.mark.parametrize("block", _blocks("# VALID"), ids=lambda b: b.split("\n")[0])
def test_every_valid_example_in_the_guide_actually_lints(block):
    # If a contributor copies this and it fails, the guide is the bug.
    lint(parse(block), KC_IDS, kc_chapter=KC_SPEC.chapter)


@pytest.mark.parametrize("block", _blocks("# INVALID"), ids=lambda b: b.split("\n")[0])
def test_every_invalid_example_in_the_guide_is_actually_rejected(block):
    # A guide that says "this is rejected" about something we happily accept is
    # teaching a rule that doesn't exist.
    with pytest.raises(ItemError):
        lint(parse(block), KC_IDS, kc_chapter=KC_SPEC.chapter)


def test_guide_examples_use_real_kcs():
    # Every example tags a KC that exists in the shipped graph, so copy-paste
    # works rather than 404-ing on an invented id.
    for block in _blocks("# VALID"):
        for item in parse(block).items:
            assert item.kc in KC_IDS, f"guide references unknown KC {item.kc}"


def test_guide_slugs_do_not_collide_with_the_real_bank():
    # The guide's examples get copy-pasted. If one reuses a shipped slug, the
    # contributor's first --check fails with 'duplicate slug' and the guide looks
    # broken on line one.
    from app.ingest.item_spec import load as load_items
    real = {i.slug for i in load_items(ROOT / "content" / "items" / "phy_mechanics.yaml").items}
    for block in _blocks("# VALID") + _blocks("# INVALID"):
        for item in parse(block).items:
            assert item.slug not in real, f"guide reuses a live slug: {item.slug}"


def test_guide_documents_the_commands_it_tells_you_to_run():
    text = GUIDE.read_text(encoding="utf-8")
    assert "python -m app.ingest.items" in text
    assert "--check" in text
    assert "--kc" in text


def test_guide_covers_the_rules_the_linter_enforces():
    """Every fatal rule must be discoverable BEFORE hitting it. A rule a
    contributor can only learn by tripping it is a rule that wastes their time."""
    text = GUIDE.read_text(encoding="utf-8").lower()
    for topic in ("slug", "difficulty", "source", "choices", "unit",
                  "duplicate", "breadth"):
        assert topic in text, f"the guide never mentions {topic!r}"
