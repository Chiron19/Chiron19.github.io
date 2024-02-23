---
layout: post-toc
title: Privacy Preserving Methods Based on Optimization
subtitle: 'Literature Review on "Per-se Privacy Preserving Solution Methods Based on Optimization"'
categories: literature
tags: [literature]
permalink: PP_Optimization
---
> This is the quick summary from literature review on reference: [Per-se Privacy Preserving Solution Methods Based on Optimization](https://terpconnect.umd.edu/~baras/publications/papers/2013/13-05%20P%20C%20Weeraddana.pdf), which is the summary of the contribution of paper [Per-se Privacy Preserving Distributed Optimization](http://arxiv.org/abs/1210.3283). Generaly, it summarized existed cryptography approaches and within the scope of non-cryptographic approaches, it developed a unified framework for privacy preserving solutions and give a general definition quantifying privacy with some examples.
>
> Please refer to original paper to view examples and detailed explaination.

<div class="md-content md-typeset">
<details class="example" markdown="1">
<summary>This blog may include testing blocks.</summary>

Emerging [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) to [Jekyll](https://jekyllrb.com), this blog contains [Admonitions](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) blocks to illustrate some features for functioning test.

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

<div class="md-content md-typeset">
<details class="notation" markdown="1" open>
<summary>Notation</summary>

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

</details>
</div>

## Definition 1 (Optimization problem)

<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 1</p>

$$\begin{align}
\min\ \ &f_0(\mathbf{x})\\
\text{s.t.}\ \ &f_i(\mathbf{x})\leq 0,\ i=1,\ldots,q\\
 &h_i(\mathbf{x})=0,\ i=1,\ldots,p\\
\end{align}\tag{1}
$$

</div>
</div>

Here:
- $f_0 : \mathbb{R}^n \to \mathbb{R}$ is called the _objective function_,
- $f_i(\mathbf{x}) \leq 0,\ i = 1, \ldots , q$ are called _inequality constraints_ with the associated _inequality constraint functions_ $f_i: \mathbb{R}^n \to \mathbb{R},\ i = 1, \ldots , q$,
- $h_i(\mathbf{x}) = 0, i = 1, \ldots , p$ are called _equality constraints_ with the associated _equality constraint functions_ $h_i: \mathbb{R}^n \to \mathbb{R},\ i = 1, \ldots , p$,
- $\mathbf{x} = (x_1, \ldots , x_n) \in \mathbb{R}$ is called the _optimization variable_ or the _decision variable_

## Definition 2 (Convex optimization problem)

<a id="formula_2"></a>
<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 2</p>

$$\begin{align}
\min\ \ &f_0(\mathbf{x})\\
\text{s.t.}\ \ &f_i(\mathbf{x})\leq 0,\ i=1,\ldots,q\\
 &\mathbf{Cx}-\mathbf{d}=\mathbf{0}\\
\end{align}\tag{2}
$$

</div>
</div>

where the functions $f_i,\ i = 0, \ldots , q$ are _convex_ and $h_i,\ i =1, \ldots , p$ are affine, i.e., the equality constraint functions are given by $\mathbf{C} \in \mathbb{R}^{p\times n}$ with $\text{rank}(\mathbf{C}) = p$ and $d \in \mathbb{R}^p$. The optimization variable is $\mathbf{x} = (x_1, \ldots , x_n) \in \mathbb{R}^n$. 

Typically, we have $p < n$ in practice, otherwise the only potential solution, if it exists, is $\mathbf{C}^\dagger \mathbf{d}$, where $\mathbf{C}^\dagger$ is called the pseudo-inverse of $\mathbf{C}$.

## Definition 3 ($K$-party environment)

A set of $K$ parties is called a $K$-party environment.

## Definition 4 (Inputs and outputs of a convex problem)

- We call the _set of problem parameters_, i.e., $\mathbf{C}$, $\mathbf{d}$, and those required to define the functions $f_0$, $f_i$ themselves, as **inputs** of problem <a href="#formula_2">(2)</a>.
- We call the _solution_ and the _optimal value_, i.e., $\mathbf{x}$, $\min\ f_0(\mathbf{x})$ as **outputs** of problem <a href="#formula_2">(2)</a>.

## Definition 5 (Attacker model, Passive adversary)

In a multi-party environment, an entity involved in solving
a global optimization problem of the form <a href="#formula_2">(2)</a>, or even
a third party is called a **passive adversary**,if it taps the
communication lines of the multi-party environment to
obtain messages exchanged during different stages of
the solution method, keeps a record of all information it
receives, and tries to discover others’ private data. 

≠ active adversaries

## Definition 6 (Adversarial knowledge)

The set of information that an adversary might exploit to discover the
input and/or the output of problem <a href="#formula_2">(2)</a> is called the **adversarial knowledge**.

A formal definition to quantify the
privacy of transformation methods: **privacy index** $(\xi, \eta) \in [0, 1) \times \mathbb{N}$

- $\xi$ quantifies the privacy of the input and the output of problem <a href="#formula_2">(2)</a>.<br>
    - when $\xi = 0$, there is no protection against the adversary,<br>
    - when $\xi = 1$, there is perfect protection against the adversary.
- $\eta$ indicates a measure of the spread of the uncertainty of the private data.<br>
    - the higher the value of $\eta$, the more effective the transformation used to disguise the private data

## Definition 7 (Input privacy index $(\xi^\text{in}, \eta^\text{in})$)

Let $\mathcal{C}^{\text{in}}$ denote the input of problem <a href="#formula_2">(2)</a>. 

An obfuscation of the original element $c$ of $\mathcal{C}^{\text{in}}$:

$$
f_c^{\text{in}}:\ \mathcal{C}^{\text{in}}\rightarrow \mathcal{G}^{\text{in}},
$$

where $\mathcal{G}^{\text{in}} \subset \mathcal{K}$ and $\mathcal{K}$ denote the set of adversarial knowledge. Given $\mathcal{K}$, let

<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 4</p>

$$
\xi^{\text{in}}(c)=1-1/ N_\mathcal{K}^{\text{in}}, \tag{4}
$$

</div>
</div>


where $N_\mathcal{K}^{\text{in}}$ is the cardinality of the uncertainty set

<a id="formula_5"></a>
<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 5</p>

$$
\mathcal{U}^{\text{in}}(c)=\left\{ c \mid f_c^{\text{in}}(c) = k,\ f_c^{\text{in}} \text{ is arbitrary},\ \mathcal{K}\right\}, \tag{5}
$$

</div>
</div>

Moreover, let $\eta^{\text{in}}(c)$ be the affine dimension of the set $\mathcal{U}^{\text{in}}(c)$. 

We call $\left( \xi^{\text{in}}(c),\eta^{\text{in}}(c)\right)$ the **input privacy index** of $c \in \mathcal{C}^{\text{in}}$ in the presence of adversarial knowledge
$\mathcal{K}$.

We use the convention that $N_\mathcal{K}^{\text{in}}$ is infinity, whenever the
set <a href="#formula_5">(5)</a> $\mathcal{U}^{\text{in}}(c)$ is uncountable.

## Definition 8 (Output privacy index $(\xi^\text{out}, \eta^\text{out})$)
Similar to Definition 7, except that the output of problem <a href="#formula_2">(2)</a> is considered instead of the input.

# Transformation Based Methods

Denotes:
- $\mathcal{D}$: the set of points for which the objective and all
constraint functions are defined, or domain of problem <a href="#formula_2">(2)</a>, i.e., $\mathcal{D} = \bigcap_{i=0}^q \text{dom}\ f_i \cap \mathbb{R}^n$. 
- $\mathbf{x}^\star$: the solution of problem <a href="#formula_2">(2)</a>.
- $p^\star$: the optimal value of problem <a href="#formula_2">(2)</a>.

For many considered problem formulations in this paper, the domain $\mathcal{D} = \mathbb{R}^n$. 

## A. Transformation via Change of Variables

<div class="md-content md-typeset">
<div class="admonition proposition" markdown="1" open>
<p class="admonition-title">Proposition 1</p>

Let $\phi: \mathbb{R}^m \to \mathbb{R}^n$ be a function, with image covering the problem domain $\mathcal{D}$. 

Now consider the following change of variables:

<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 9</p>

$$
\mathbf{x} = \phi(\mathbf{z}), \tag{9}
$$

</div>
</div>

The resulting problem is given by

<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 10</p>

$$\begin{align}
\min\ \ &f_0(\phi(\mathbf{z}))\\
\text{s.t.}\ \ &f_i(\phi(\mathbf{z}))\leq 0,\ i=1,\ldots,q\\
 &\mathbf{C}\phi(\mathbf{z})-\mathbf{d}=\mathbf{0}\\
\end{align}\tag{10}
$$

</div>
</div>

where the variables are $\mathbf{z} \in \mathbb{R}^m$. Suppose $\mathbf{x}^\star$
solves problem (2). Then $\mathbf{z}^\star = \phi^{-1}(\mathbf{x}^\star)$ solves problem (10).

Moreover, if $\mathbf{z}^\star$ solves problem (10), then $\mathbf{x}^\star = \phi(\mathbf{z}^\star)$ solves problem (2).

</div>
</div>

## B. Transformation of Objective and Constraint Functions

<div class="md-content md-typeset">
<div class="admonition proposition" markdown="1" open>
<p class="admonition-title">Proposition 2</p>

Suppose $\psi_0: \mathbb{D}_0 \subseteq \mathbb{R} \to \mathbb{R}$ is monotonically increasing, with domain covering the image of $f_0$, i.e., $\mathbb{D}_0 \supseteq \text{image }f_0$.

Moreover, suppose that for $i = 1, \ldots, q$, $\psi_i: \mathbb{D}_i \subseteq \mathbb{R} \to \mathbb{R}$, with $\mathbb{D}_i \supseteq \text{image }f_i$, $\psi_i(z) \leq 0$ if and
only if $z \leq 0$ and $\psi: \mathbb{R}^p \to \mathbb{R}^m$ satisfies $\psi(\mathbf{z})=0$ if and only if $\mathbf{z}=0$. Then if $\mathbf{x}^\star$ solves the problem

<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 17</p>

$$\begin{align}
\min\ \ &\psi_0(f_0(\mathbf{x}))\\
\text{s.t.}\ \ &\psi_i(f_i(\mathbf{x}))\leq 0,\ i=1,\ldots,q\\
 &\psi(\mathbf{C}\mathbf{x}-\mathbf{d})=\mathbf{0}\\
\end{align}\tag{17}
$$

</div>
</div>

where the variable is $\mathbf{x} \in \mathbb{R}^n$, the solution must also solve problem (2) and vice versa. 

Moreover, the optimal value of problem (2), $p^\star$, and that of problem (17), $q^\star$, are related by

<div class="md-content md-typeset">
<div class="admonition formula" markdown="1" open>
<p class="admonition-title">Formula 18</p>

$$
\psi_0(p^\star) = q^\star. \tag{18}
$$

</div>
</div>

</div>
</div>

---
Thanks for reading.