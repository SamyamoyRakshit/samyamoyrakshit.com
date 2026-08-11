---
title: BERT, from scratch
description: A 7.5M-parameter Bengali BERT, pre-trained from nothing on a laptop, that scores above published mBERT and IndicBERT on Bengali news classification.
pubDate: 2026-08-09
tags: [BERT, PyTorch, Bengali NLP]
draft: false
---

<p class="note"><strong>The full write-up is still being written.</strong> This
is the short version — what was built and what it measured. The long one goes
through the pre-training pipeline properly, which is where the actual work
turned out to be.</p>

## What it is

A BERT pre-trained from random initialisation on roughly 114 MB of Bengali
Wikipedia, then fine-tuned on six-class Bengali news classification.

Both pre-training objectives were written by hand and trained jointly — masked
language modelling and next-sentence prediction — along with the three-way
input embedding, the GELU feed-forward blocks, the MLM and NSP heads, and the
dynamic 80/10/10 masking the paper specifies in a single paragraph.

Pre-training took about 28 hours on the laptop's MPS backend. One run.

## Where it lands

| Model | Params | Accuracy |
| --- | --- | --- |
| **This one** | **7.5M** | **86.5%** |
| mBERT | 110M | 80.2% |
| IndicBERT | — | 78.5% |

It also comes in about a point under XLM-R, at roughly 17× fewer parameters.

## What the full post will cover

- Why BERT, not the transformer, turned out to be the harder of the two rebuilds
- Building the WordPiece vocabulary and constructing NSP pairs for a language
  whose sentence boundaries are not English's
- Masking dynamically per epoch instead of once up front, and what doing it the
  intuitive way quietly costs you

[Source on GitHub](https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/BERT)
