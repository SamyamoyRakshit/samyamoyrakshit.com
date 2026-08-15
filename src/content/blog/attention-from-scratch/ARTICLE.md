---
title: Attention Is All You Need, from scratch
description: The original transformer rebuilt component by component, then trained to translate English into Bengali on one laptop.
pubDate: 2026-08-08
tags: [Transformer, PyTorch, Machine translation]
draft: false
---

<p class="note"><strong>The full write-up is still being written.</strong> This
is the short version — what was built and on what. The long one is mostly about
the parts of the paper that get one sentence each and decide whether the thing
trains at all.</p>

## What it is

An encoder–decoder transformer for English → Bengali translation, written out
tensor by tensor. No `nn.Transformer`, no `nn.MultiheadAttention`, nothing
imported for the parts that are the point of the paper.

Written by hand: scaled dot-product and multi-head attention, sinusoidal
positional encoding, the label-smoothed loss, the Noam learning-rate schedule,
weight tying between the embedding and the output projection, and pooled beam
search for decoding. Trained on
[AI4Bharat Samanantar](https://ai4bharat.iitm.ac.in/samanantar/).

## The constraint

The paper's base model is about 65M parameters, trained on 8 P100s. This is
about 11M, on one M1 with 16 GB of unified memory.

The rule that made that legitimate rather than a fudge: **change the size
freely, change the method never.** A rebuild that quietly swaps the schedule or
drops label smoothing to make the numbers move is not a reimplementation any
more — it is a different model that happens to share a name.

## What the full post will cover

- Why the small pieces are the hard pieces: the Noam schedule, weight tying,
  and a label-smoothed loss that goes *up* while BLEU goes up with it
- Fitting a 65M-parameter design into 16 GB without touching a single method
- Reporting BLEU next to a ~6.6× training-token gap instead of on its own

[Source on GitHub](https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/transformer)
