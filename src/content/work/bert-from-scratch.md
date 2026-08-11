---
title: BERT, from scratch
short: BERT
kind: scratch
paper:
  title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"
  authors: Devlin et al.
  year: "2019"
  url: https://arxiv.org/abs/1810.04805
summary: A 7.5M-parameter Bengali BERT, pre-trained from nothing on a laptop, that scores above published mBERT and IndicBERT on Bengali news classification.
highlights:
  - Pre-trained a 7.5M-parameter BERT from scratch on a 114 MB Bengali Wikipedia corpus — MLM + NSP objectives, ~28 hours on laptop MPS.
  - Hand-wrote the three-way input embeddings, GELU feed-forward, MLM and NSP heads, dynamic 80/10/10 masking and the joint loss.
  - 86.5% test accuracy on 6-class Bengali news topics — above published mBERT (80.2, at 110M params) and IndicBERT (78.5), ~1 point under XLM-R at 17× fewer parameters.
specs:
  # A tilde means the figure is a rounded magnitude; a bare figure is a
  # measurement. 7,573,266 params, a ~114 MB corpus and ~27.4h train / 28.3h
  # wall are all approximations. The accuracy is not — it was measured.
  - { label: Params, value: "~7.5M" }
  - { label: Corpus, value: "~114MB" }
  - { label: Pre-trained, value: "~28h" }
  - { label: Accuracy, value: "86.5%" }
year: "2026"
role: Everything — implementation, pre-training, fine-tuning, evaluation
stack: [PyTorch, Python]
links:
  repo: https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/BERT
order: 1
featured: true
---

## What I built

A BERT, pre-trained from random initialisation on 114 MB of Bengali Wikipedia,
then fine-tuned on the `sna.bn` news-classification task from
[IndicGLUE](https://ai4bharat.iitm.ac.in/indic-glue/).

Both pre-training objectives, written by hand: masked language modelling and
next-sentence prediction, trained jointly. Also by hand — the three-way input
embedding (token + segment + position), the GELU feed-forward blocks, the MLM
and NSP heads, and the dynamic 80/10/10 masking that the paper specifies in a
single paragraph.

Pre-training took about 28 hours on the laptop's MPS backend. One run.

## The result

86.5% test accuracy on six-class Bengali news topics. For context, against
published numbers on the same task:

| Model | Params | Accuracy |
| --- | --- | --- |
| **This one** | **7.5M** | **86.5%** |
| mBERT | 110M | 80.2% |
| IndicBERT | — | 78.5% |

It also lands about one point under XLM-R, at roughly 17× fewer parameters.

Beating mBERT by six points at 1/15th of its size is not evidence that I am a better
engineer than the teams that built those models. It is evidence of something
duller and more useful: a small model pre-trained on the *right* corpus beats a
large model pre-trained on a hundred languages of which yours is one.

mBERT has to spend capacity on 104 languages. This one only ever saw Bengali.
That is the entire advantage, and it is available to anyone who is willing to
run a laptop hot for a day.

## Why this is the one that surprised me

Going in, I expected the transformer to be the hard rebuild and BERT to be a
variation on it. It was the other way round.

The architecture genuinely is a transformer encoder — that part was reuse. The
work is in the data pipeline: building the WordPiece vocabulary, constructing
NSP pairs at the right sentence boundaries for a language whose sentence
segmentation is not English's, and applying the 80/10/10 mask dynamically per
epoch rather than once up front. Masking statically is the intuitive
implementation, it trains fine, and it quietly costs you the augmentation
effect the paper is relying on.

None of that is architecture. All of it decides whether the model works.
