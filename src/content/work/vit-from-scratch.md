---
title: Vision Transformer, from scratch
short: Vision Transformer
kind: scratch
paper:
  title: An Image Is Worth 16x16 Words
  authors: Dosovitskiy et al.
  year: "2021"
  url: https://arxiv.org/abs/2010.11929
summary: A ViT trained on 1,935 photographs of Bengali terracotta temples — a dataset I had to build first — to test the paper's claim about pre-training. It failed, exactly as predicted.
highlights:
  - Assembled a 1,935-image, 10-class dataset of Bengali terracotta temples and used it to test the paper's central claim.
  - Trained from scratch on those 1,935 images the ViT reached 14.9% — barely above the 10% chance line. Swapping in torchvision's pre-trained ViT-B/16 as a frozen feature extractor, same data, reached 88.9%. The 88.9% belongs to torchvision's weights, not to the from-scratch model; the gap between the two numbers is the paper's central claim, reproduced.
specs:
  - { label: Images, value: "1,935" }
  - { label: Classes, value: "10" }
  - { label: From scratch, value: "14.9%" }
  - { label: Pre-trained ViT-B/16, value: "88.9%" }
year: "2026"
role: Dataset collection, implementation, training, evaluation
stack: [PyTorch, Python]
links:
  repo: https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/ViT
order: 3
featured: true
---

## What I built

A Vision Transformer, and before that, something to train it on.

The dataset is 1,935 photographs of terracotta temples at Bishnupur, sorted
into ten classes. It did not exist before this; I assembled and labelled it.
That turned out to be most of the project, and it is the part I would repeat.

## The experiment

The ViT paper makes a claim that is easy to read past: transformers lack the
inductive biases a convolutional network gets for free — locality, translation
equivariance — and so they do not generalise well when trained on insufficient
data. Large-scale pre-training is not an optimisation in ViT, it is a
precondition.

A 1,935-image dataset is an almost ideal instrument for testing that, because
it is unambiguously insufficient. So I trained the same architecture two ways:

| Setup | Top-1 accuracy |
| --- | --- |
| Trained from scratch on 1,935 images | **14.9%** |
| Pre-trained, fine-tuned as a feature extractor | **88.9%** |

Ten classes means chance is 10%. Trained from scratch, the model landed at
14.9% — barely distinguishable from guessing. The identical architecture, with
pre-trained weights, reached 88.9%.

## Why I kept the failure

14.9% is the most valuable number in this repo.

It is a clean, independent reproduction of the paper's central caveat, on data
the authors never saw, at a scale they never tested. The gap between 14.9% and
88.9% is not a gap in architecture — the architecture is byte-identical between
the two runs. It is entirely a gap in what the model had already seen.

There is a real temptation, when a from-scratch run lands at chance, to treat
it as a bug and go hunting for the mistake. Sometimes it is a bug. Here it was
the finding, and reporting it is the difference between reproducing a paper and
advertising one.
