---
title: Attention Is All You Need, from scratch
short: Transformer
kind: scratch
paper:
  title: Attention Is All You Need
  authors: Vaswani et al.
  year: "2017"
  url: https://arxiv.org/abs/1706.03762
summary: The original transformer rebuilt component by component, then trained to translate English into Bengali on one laptop.
highlights:
  - Built every component by hand — multi-head attention, sinusoidal positional encoding, label-smoothed loss, Noam schedule, weight tying and pooled beam search.
  - Scaled the paper's 65M-parameter base to 11M to fit 16 GB while keeping every method exact, and reported the resulting BLEU openly against the ~6.6× training-token gap rather than hiding it.
specs:
  # Both rounded — see the note in bert-from-scratch.md. The 65M is the cited
  # base-model figure, itself approximate.
  - { label: Params, value: "~11M" }
  - { label: Paper, value: "~65M" }
  - { label: Hardware, value: "M1, 16GB" }
  - { label: Data, value: "Samanantar" }
year: "2026"
role: Everything — implementation, training, evaluation
stack: [PyTorch, Python]
links:
  repo: https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/transformer
order: 2
featured: true
---

## What I built

An encoder–decoder transformer for English → Bengali translation, written out
tensor by tensor. No `nn.Transformer`, no pre-built HuggingFace model, nothing
imported for the parts that are the point of the paper.

That meant writing, by hand: scaled dot-product and multi-head attention,
sinusoidal positional encoding, the label-smoothed loss, the Noam learning-rate
schedule, weight tying between the embedding and the output projection, and
pooled beam search for decoding.

Trained on [AI4Bharat Samanantar](https://ai4bharat.iitm.ac.in/samanantar/),
the largest publicly available parallel corpus for Indic languages.

## Why the small pieces are the hard pieces

The parts of the paper that get quoted are the parts that are easy to implement.
Multi-head attention is a handful of reshapes once you have seen it. What takes
the time is everything the paper describes in a single sentence and assumes you
will get right.

The Noam schedule is one line of arithmetic that governs whether training
converges at all. Weight tying is a sentence in section 3.4. Label smoothing
gets a footnote — and it makes the model *less* confident on purpose, which
means your loss goes up and your BLEU goes up at the same time, and if you are
watching the wrong number you will think you have broken it.

Reading the paper, none of that registers as difficulty. Implementing it, it is
almost all of the difficulty.

## Fitting it into 16 GB

The paper's base model is 65M parameters, trained on 8 P100s for 12 hours. I
had one M1 with 16 GB of unified memory.

So I scaled the model down to 11M parameters and kept every method exactly as
published. That distinction matters and it is the whole discipline of the
exercise: change the *size* freely, change the *method* never. A rebuild that
quietly swaps in a different schedule or drops label smoothing to make the
numbers move is not a reimplementation of the paper any more, it is a different
model that happens to share a name.

## On the BLEU number

My model sees roughly 6.6× fewer training tokens than the paper's does. Any
BLEU I report is a number from a smaller model trained on a fraction of the
data, and comparing it directly to the paper's would be meaningless in a way
that flatters me.

So the repo reports the BLEU alongside that gap rather than on its own. The
useful claim is not "I matched the paper" — I did not, and could not on this
hardware. It is that every mechanism in the paper is implemented correctly
enough to train, converge, and translate.
