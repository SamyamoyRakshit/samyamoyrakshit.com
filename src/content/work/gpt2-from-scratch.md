---
title: GPT-2, from scratch
# "GPT-2" rather than the repo folder's "GPT": the citation below the heading
# is "Language Models are Unsupervised Multitask Learners", which never says
# which GPT, so the heading has to.
short: GPT-2
kind: scratch
paper:
  title: Language Models are Unsupervised Multitask Learners
  authors: Radford et al.
  year: "2019"
  url: https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf
summary: A 6.9M-parameter Bengali GPT-2, tokenizer included, pre-trained from random weights on one laptop. It writes fluent, Wikipedia-shaped Bengali, and the facts in it are invented.
highlights:
  - Pre-trained a 6.9M-parameter GPT-2 from random weights on Bengali Wikipedia — 111M tokens, 1,700 steps, 4 h 15 m on laptop MPS — reaching 0.6545 bits per byte on held-out articles, against 1.1592 for a unigram baseline.
  - Hand-wrote the byte-level BPE tokenizer and fixed GPT-2's pre-tokenizer for Bengali, whose letter class cut every vowel sign off its consonant — 3.8× fewer chunks once vowel signs count as part of a word.
  - Same articles and same size as the BERT rebuild, one mask apart, with GPT-2's pre-norm blocks, final LayerNorm, 1/√N residual init and tied output layer. Measured bf16, torch.compile and FlashAttention on the M1; none of them helped.
specs:
  # Same convention as the other rebuilds: a tilde is a rounded magnitude, a
  # bare figure a measurement. 6,901,760 params and 111.4M tokens are rounded;
  # the run time and the bits per byte are as measured.
  - { label: Params, value: "~6.9M" }
  - { label: Tokens, value: "~111M" }
  - { label: Pre-trained, value: "4h 15m" }
  - { label: Bits/byte, value: "0.6545" }
year: "2026"
role: Everything — tokenizer, implementation, pre-training, evaluation
stack: [PyTorch, Python]
links:
  repo: https://github.com/SamyamoyRakshit/papers-from-scratch/tree/main/GPT
order: 4
featured: true
---

The write-up is already published: src/content/blog/gpt2-from-scratch/ARTICLE.md.
