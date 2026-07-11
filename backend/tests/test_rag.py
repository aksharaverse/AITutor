from app.core.prompts import SYSTEM_PROMPT, build_messages
from app.ingest.cli import chunk_markdown


def test_system_prompt_is_first_and_stable():
    msgs = build_messages([], [], "What is Snell's law?")
    assert msgs[0] == {"role": "system", "content": SYSTEM_PROMPT}
    assert msgs[-1]["role"] == "user"
    assert "Snell's law" in msgs[-1]["content"]


def test_context_chunks_are_delimited_with_source_refs():
    chunks = [{"content": "n1 sin i = n2 sin r", "source_ref": "optics#3"}]
    msgs = build_messages(chunks, [], "Q")
    assert 'source_ref="optics#3"' in msgs[-1]["content"]
    assert "n1 sin i = n2 sin r" in msgs[-1]["content"]


def test_history_is_trimmed_to_last_four_exchanges():
    history = [{"role": "user", "content": str(i)} for i in range(20)]
    msgs = build_messages([], history, "Q")
    assert len(msgs) == 1 + 8 + 1  # system + trimmed history + question


def test_chunker_respects_target_and_overlaps():
    paras = [f"Paragraph {i} " + "x" * 400 for i in range(20)]
    chunks = chunk_markdown("\n\n".join(paras), target_chars=1000)
    assert len(chunks) > 1
    for c in chunks:
        assert len(c) <= 1000 + 450  # target + one paragraph of slack
    # consecutive chunks share their boundary paragraph
    first_of_next = chunks[1].split("\n\n")[0]
    assert first_of_next in chunks[0]


def test_chunker_never_splits_a_paragraph():
    text = "A" * 5000  # single huge paragraph
    chunks = chunk_markdown(text, target_chars=1000)
    assert chunks == [text]
