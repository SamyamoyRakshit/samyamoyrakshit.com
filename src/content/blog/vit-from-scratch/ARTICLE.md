---
title: Vision Transformer, from scratch
description: A ViT trained on 1,935 photographs of Bengali terracotta temples — a dataset I had to build first — to test the paper's claim about pre-training. It failed, exactly as predicted.
pubDate: 2026-08-07
tags: [Vision Transformer, PyTorch, Computer vision]
draft: false
---

<p class="note"><strong>The full write-up is still being written.</strong> This
is the short version — the dataset, the two runs and the numbers. The long one
is about why the failing run is the one worth keeping.</p>

## What it is

A Vision Transformer, and before that, something to train it on.

The dataset is 1,935 photographs of the terracotta temples at Bishnupur, sorted
into ten classes. It did not exist before this; I assembled and labelled it,
and that turned out to be most of the project.

## The experiment

The paper makes a claim that is easy to read past: transformers lack the
inductive biases a convolutional network gets for free, so they do not
generalise well on insufficient data. Large-scale pre-training is not an
optimisation in ViT — it is a precondition. A 1,935-image dataset is an almost
ideal instrument for testing that, because it is unambiguously insufficient.

| Setup | Top-1 accuracy |
| --- | --- |
| Trained from scratch on 1,935 images | **14.9%** |
| Pre-trained ViT-B/16, frozen feature extractor | **88.9%** |

Ten classes means chance is 10%. The architecture is identical between the two
runs, so the gap is not architectural — it is entirely what the model had
already seen. The 88.9% belongs to torchvision's weights, not to the
from-scratch model.

## What the full post will cover

- Why 14.9% is the most valuable number in the repository
- Telling a finding apart from a bug when a from-scratch run lands at chance
- What it takes to build a labelled dataset for something nobody has published
  one for

[Source on GitHub](https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/ViT)
