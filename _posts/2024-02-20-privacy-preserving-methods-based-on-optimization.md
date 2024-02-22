---
layout: post-toc
title: Privacy Preserving Methods Based on Optimization
subtitle: 'Literature Review on "Per-se Privacy Preserving Solution Methods Based on Optimization"'
categories: literature
tags: [literature]
permalink: PP_Optimization
---
> This is the quick summary from literature review on reference: [Per-se Privacy Preserving Solution Methods Based on Optimization](https://terpconnect.umd.edu/~baras/publications/papers/2013/13-05%20P%20C%20Weeraddana.pdf), which is the summary of the contribution of paper [Per-se privacy preserving distributed optimization](http://arxiv.org/abs/1210.3283). Generaly, it summarized existed cryptography approaches and within the scope of non-cryptographic approaches, it developed a unified framework for privacy preserving solutions and give a general definition quantifying privacy with some examples.

<div class="md-content md-typeset">
<details class="example">
<summary>Expand to show alternate icon sets</summary>
<p>=== ":octicons-mark-github-16: Octicons"</p>
<pre><code>``` yaml
theme:
  icon:
    admonition:
      note: octicons/tag-16
      abstract: octicons/checklist-16
      info: octicons/info-16
      tip: octicons/squirrel-16
      success: octicons/check-16
      question: octicons/question-16
      warning: octicons/alert-16
      failure: octicons/x-circle-16
      danger: octicons/zap-16
      bug: octicons/bug-16
      example: octicons/beaker-16
      quote: octicons/quote-16
```
</code></pre>
<p>=== ":fontawesome-brands-font-awesome: FontAwesome"</p>
<pre><code>``` yaml
theme:
  icon:
    admonition:
      note: fontawesome/solid/note-sticky
      abstract: fontawesome/solid/book
      info: fontawesome/solid/circle-info
      tip: fontawesome/solid/bullhorn
      success: fontawesome/solid/check
      question: fontawesome/solid/circle-question
      warning: fontawesome/solid/triangle-exclamation
      failure: fontawesome/solid/bomb
      danger: fontawesome/solid/skull
      bug: fontawesome/solid/robot
      example: fontawesome/solid/flask
      quote: fontawesome/solid/quote-left
```
</code></pre>
</details>
</div>

# Introduction

<div>

<button type="button" class="collapsible-button">
<div>Click to expand</div>
<div class="text-center text-base" style="font-size:1.5rem;"> <i class="fa fa-angle-down" style="font-weight:600;"></i></div>
</button>

<div class="collapsible-content" markdown="1">

## Cryptography Methods
Cryptography is the standard approach to preserve privacy in distributed optimization solvers.

Cryptographic Primitives:
- secure multiparty computations
- pseudo random generators
- homomorphic encryption

Cryptographic Tools:
- zero-knowledge
- oblivious transfer
- oblivious evaluation of polynomials
- secret sharing
- threshold cryptography

With optimization problems, cryptographic tools are used to secure iterations in:
- simplex algorithm
- interior-point algorithm

### Pros and Cons

**Pros**:
- cryptography-based privacy preserving optimization is well investigated
- for security, cryptographic methods are desirable

**Cons**:
- unfavorable in terms of computational complexity and efficiency
- great expense among the nodes due to the exchange of security information and coordination
- easy to attacks by third parties who may inadvertently own the cryptographic keys

## Non-cryptographic methods
Introducing below.

</div></div>

# Definitions

## Notation

| Symbol | Implication |
| --- | --- | 
| $\mathbf{x}$ | vector (Boldface lowercase letter) |
| $\mathbf{A}$ | matrix (Boldface uppercase letter) |
| $\mathcal{S}$ | set (Calligraphy letter) |
| $\mathbb{R}^n$ | The set of real $n$-vectors |
| $\mathbb{R}^{m\times n}$ | The set of real $m\times n$ matrices |
| $\mathbb{N}$ | The set of non-negative integers, i.e. $\left\\\{0, 1, \ldots\right\\\}$ |
| $\mathbf{I}_n$ | The $n \times n$ identity matrix |
| $(·)^{\mathrm{T}}$ | transpose |
| $\mathbf{A}_i$ | The $i$th submatrix of a matrix (subscript) |
| $(\mathbf{a}, \mathbf{b}, \mathbf{c})$ | use parentheses to construct column vectors from comma separated lists, $=[\mathbf{a}^\mathrm{T}\ \mathbf{b}^\mathrm{T}\ \mathbf{c}^\mathrm{T}]^\mathrm{T}$ |

## Definition 1 (Optimization problem)

$$\begin{align}
\min\ \ &f_0(\mathbf{x})\\
\text{s.t.}\ \ &f_i(\mathbf{x})\leq 0,\ i=1,\ldots,q\\
 &h_i(\mathbf{x})=0,\ i=1,\ldots,p\\
\end{align}\tag{1}
$$

## Definition 2 (Convex optimization problem)

$$\begin{align}
\min\ \ &f_0(\mathbf{x})\\
\text{s.t.}\ \ &f_i(\mathbf{x})\leq 0,\ i=1,\ldots,q\\
 &\mathbf{Cx}-\mathbf{d}=\mathbf{0}\\
\end{align}\tag{2}
$$

## Definition 3 ($K$-party environment)

A set of $K$ parties is called a $K$-party environment.

## Definition 4 (Inputs and outputs of a convex problem)

- We call the _set of problem parameters_, i.e., $\mathbf{C}$, $\mathbf{d}$, and those required to define the functions $f_0$, $f_i$ themselves, as **inputs** of problem (2).
- We call the _solution_ and the _optimal value_, i.e., $\mathbf{x}$, $\min\ f_0(\mathbf{x})$ as **outputs** of problem (2).

## Definition 5 (Attacker model, Passive adversary)

In a multi-party environment, an entity involved in solving
a global optimization problem of the form (2), or even
a third party is called a **passive adversary**,if it taps the
communication lines of the multi-party environment to
obtain messages exchanged during different stages of
the solution method, keeps a record of all information it
receives, and tries to discover others’ private data. 

≠ active adversaries

## Definition 6 (Adversarial knowledge)

The set of information that an adversary might exploit to discover the
input and/or the output of problem (2) is called the **adversarial knowledge**.

A formal definition to quantify the
privacy of transformation methods: **privacy index** $(\xi, \eta) \in [0, 1) \times \mathbb{N}$

- $\xi$ quantifies the privacy of the input and the output of problem (2).<br>
    - when $\xi = 0$, there is no protection against the adversary,<br>
    - when $\xi = 1$, there is perfect protection against the adversary.
- $\eta$ indicates a measure of the spread of the uncertainty of the private data.<br>
    - the higher the value of $\eta$, the more effective the transformation used to disguise the private data

## Definition 7 (Input privacy index $(\xi^\text{in}, \eta^\text{in})$)

## Definition 8 (Output privacy index $(\xi^\text{out}, \eta^\text{out})$)

# Transformation Based Methods

## A. Transformation via Change of Variables

## B. Transformation of Objective and Constraint Functions

---
Thanks for reading.