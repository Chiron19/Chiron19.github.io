---
layout: post-toc
title: Privacy Preserving Data Mining Techniques
subtitle: 'Literature Review on "Privacy Preserving Data Mining Techniques: Current Scenario and Future 
Prospects"'
categories: literature
tags: [literature]
permalink: PPDM
---
> This is the quick summary from literature review on reference: [Privacy Preserving Data Mining Techniques: Current Scenario and Future Prospects](https://ieeexplore.ieee.org/document/6394662). Generaly, it is a paper concluding and comparing existing PPDM techniques, discussing their performances and raise a brief introduction to soft computing techniques adapting broad and various scenarios.

# Introduction

**Privacy preserving data mining** (PPDM) deals with protecting the 
privacy of individual data or sensitive knowledge without 
sacrificing the utility of the data.

1. No privacy preserving algorithm exists that outperforms all others on all possible criteria.(Choose tools and techniques according to performances under current scenario)
2. There is no _need_ to intrude privacy for data mining, but there _might_ be privacy intrusion. (Data mining can be performed without intruding privacy)
3. The goal of PPDM is to lower the risk of misuse of data and at the same time produce results same as that produced in the absence of such privacy preserving techniques.

# PPDM Framework

<img class="mx-auto w-1/2" src="https://i.imgur.com/8nbubGB.png" alt="A framework for PPDM">

- Level 1, data transform (DS -> DW)<br>
The raw data from a single or multiple databases is transformed into a format that is well-suited for analytical purposes. Even at this stage, privacy concerns are needed to be taken care of.
- Level 2, data sanitization (DW -> PPDM)<br>
The data from data warehouses is subjected to various processes that make the data sanitized so that it can be revealed even to untrustworthy data miners. The processes applied at this stage are blocking, suppression, perturbation, modification, generalization, sampling etc.
- Level 3, data revealing (PPDM -> result)<br>
The information/knowledge so revealed by the data mining algorithms is checked for its sensitiveness towards disclosure risks. 

# PPDM Techniques

## Classification

The majority of the existing approaches can be classified into 
two broad categories:

1. (Precaution) methodologies that protect the sensitive data itself in the mining process
2. (Anti-extraction) methodologies that protect the sensitive data mining results

## Distributed Data Mining (DDM)

A simple approach to data mining over multiple sources that will **not** share data is to run existing data mining tools at each site independently and combine the results.

-> Issues that cause a disparity between _local_ and _global_ results include:

- failure detecting cross-site correlations
- over-weighted results on uneliminated duplicates
- hidden geographic or demographic distinctions due to homogeneous population

## PPDM Techniques Dimensions

1. Data distribution 
2. Data modification 
3. Data mining algorithms 
4. Data or rule hiding 
5. Privacy preservation

# PPDM Techniques Categories basing on Dimensions

1. Anonymization based PPDM 
2. Perturbation based PPDM 
3. Randomized Response based PPDM 
4. Condensation approach based PPDM 
5. Cryptography based PPDM 

## Anonymization based PPDM

The basic form of the data:
1. Explicit Identifiers (identify a record owner explicitly)
2. Quasi Identifiers (potentially identify a record owner, combing with others)
3. Sensitive Attributes (contains sensitive person specific information)
4. Non-Sensitive Attributes (no problem if revealed)

### k-anonymity

**Definition**: [K-anonymity](https://en.wikipedia.org/wiki/K-anonymity) is the property that, if the information for each person contained in the release cannot be distinguished from at least k-1 individuals whose information also appear in the release.

**Examples**:

1. Explicit Identifiers has 1-anonymity.
2. Quasi Identifiers has at least 2-anonymity.

### Procedure

**Definition**: Replacing a value with less specific but semantically consistant value is called as generalization and suppression involves blocking the values.

**Examples**:

<div>

<button type="button" class="collapsible-button">
<div>Click to expand</div>
<div class="text-center text-base" style="font-size:1.5rem;"> <i class="fa fa-angle-down" style="font-weight:600;"></i></div>
</button>

<div class="collapsible-content" markdown="1">

This example below is quoted from Wikipedia.

Patients Record (Original) <sup><sub>(Height unit: cm, Weight unit: kg)</sub></sup>

| Name | Age | Gender | Height | Weight | State of domicile | Religion | Disease |
| --- | --- | --- | --- | --- | --- | --- | --- | 
| Ramsha | 30 | Female | 165 | 72 | Tamil Nadu | Hindu | Cancer |
| Yadu | 24 | Female | 162 | 70 | Kerala | Hindu | Viral infection |
| Salima | 28 | Female | 170 | 68 | Tamil Nadu | Muslim | Tuberculosis |
| Sunny | 27 | Male | 170 | 75 | Karnataka | Parsi | No illness |
| Joan | 24 | Female | 165 | 71 | Kerala | Christian | Heart-related |
| Bahuksana | 23 | Male | 160 | 69 | Karnataka | Buddhist | Tuberculosis |
| Rambha | 19 | Male | 167 | 85 | Kerala | Hindu | Cancer |
| Kishor | 29 | Male | 180 | 81 | Karnataka | Hindu | Heart-related |
| Johnson | 17 | Male | 175 | 79 | Kerala | Christian | Heart-related |
| John | 19 | Male | 169 | 82 | Kerala | Christian | Viral infection |

- Explicit Identifiers: Name 
- Quasi Identifiers: Age, Gender, State of domicile, and Religion
- Sensitive Attributes: Disease

1. Suppression.<br>
Certain values of the attributes are replaced by an asterisk "\*". E.g., we have replaced all the values in the _Name_ attribute and the _Religion_ attribute with a "\*".
2. Generalization.<br>
Individual values of attributes are replaced with a broader category. E.g., the value "19" of the attribute _Age_ may be replaced by "≤ 20", etc.

Patient Record (Anonymized) <sup><sub>(Height unit: cm, Weight unit: kg)</sub></sup>

| Name | Age | Gender | Height | Weight | State of domicile | Religion | Disease |
| --- | --- | --- | --- | --- | --- | --- | --- | 
| * |  (20, 30] | Female | 165 | 72 | Tamil Nadu | * |  Cancer |
| * |  (20, 30] | Female | 162 | 70 | Kerala | * | Viral infection |
| * |  (20, 30] | Female | 170 | 68 | Tamil Nadu | * | Tuberculosis |
| * |  (20, 30] | Male | 170 | 75 | Karnataka | * | No illness |
| * |  (20, 30] | Female | 165 | 71 | Kerala | * | Heart-related |
| * |  (20, 30] | Male | 160 | 69 | Karnataka | * | Tuberculosis |
| * |  [0, 20] | Male | 167 | 85 | Kerala | * | Cancer |
| * |  (20, 30] | Male | 180 | 81 | Karnataka | * | Heart-related |
| * |  [0, 20] | Male | 175 | 79 | Kerala | * | Heart-related |
| * |  [0, 20] | Male | 169 | 82 | Kerala | * | Viral infection |


This data has 2-anonymity with respect to the attributes _Age_, _Gender_ and _State of domicile_, since for any combination of these attributes found in any row of the table there are always at least 2 rows with those exact attributes.


</div>

</div>


### Pros and Cons

**Pros**:
- Ensures that the transformed data is true
- The anonymization method is easy to perform

**Cons**:
- Suffers heavy information loss
- Not immune to homogeneity attack and background knowledge attack practically

## Perturbation based PPDM

### Procedure

**Definition**: In perturbation the original values are replaced with some synthetic data values so that the statistical information computed from the perturbed data does not differ from the statistical information computed from the original data to a larger extent.


**Examples**: 

<div>

<button type="button" class="collapsible-button">
<div>Click to expand</div>
<div class="text-center text-base" style="font-size:1.5rem;"> <i class="fa fa-angle-down" style="font-weight:600;"></i></div>
</button>

<div class="collapsible-content" markdown="1">

Individual incomes (k$) (Original)
```
[40, 50, 60, 70, 80, 90, 100]
```

We add random noise (synthetic data) to each income value. The noise ensures that the statistical properties remain similar while obscuring individual details. E.g. random value between -5 and +5.


Individual incomes (k$) (Perturbed)
```
[43, 48, 62, 73, 78, 92, 98]
```

</div>

</div>

**Aggregated Statistics**:

Assume the original data has mean $E[X]$ and variance $Var[X]$, and the noise is charaterized with $E[Y]$ and variance $Var[Y]$:

1. Total mean:
$$ 
E[X+Y]=E[X]+E[Y]. 
$$
2. Total variance:
$$ 
Var[X+Y]=Var[X]+Var[Y]+2 Cov(X,Y). 
$$

The statistical information remains consistent, if the distribution of random noise is known.

### Pros and Cons

**Pros**:
- cannot link specific perturbed records back to real-world individuals
- hard to recover

**Cons**:
- other techniques such as multivariate decision tree algorithms cannot work with it, because perturbation approach treats different attributes independently
- the distribution based data mining algorithms have an inherent disadvantage of loss of implicit information available in multidimensional records

## Randomized Response based PPDM

### Procedure

**Definition**: In Randomized response, the data is scrambled in such a way that the central place cannot tell with probabilities 
better than a pre-defined threshold, whether the data from a customer contains truthful information or false information.

1. In first step, the data providers randomize their data and transmit the randomized data to the data receiver. 
2. In second step, the data receiver reconstructs the original distribution of the data by employing a distribution reconstruction algorithm. 

**Examples**: 

<div>

<button type="button" class="collapsible-button">
<div>Click to expand</div>
<div class="text-center text-base" style="font-size:1.5rem;"> <i class="fa fa-angle-down" style="font-weight:600;"></i></div>
</button>

<div class="collapsible-content" markdown="1">

The Bayes estimator is one of the Randomized Response algorithm.

1. Scenario: survey about a sensitive topic, such as whether they have ever used illegal drugs.
2. Randomized Response Technique: Each respondent is given a randomization device (like a coin or dice) that determines how they answer.

Suppose we ask a person whether they’ve had sex with a prostitute this month. (Assume the event $A$ true probability is $q$)

Before answering, they flip a coin (event $B$):
- If the coin comes up tails (with probability $p$), they answer “yes” regardless of the truth.
- If the coin comes up heads (with probability $1-p$), they answer truthfully based on their actual experience.

Only they know whether their answer reflects the coin toss or their true behavior.

- We assume that people who get heads will answer truthfully.
- We assume that the events $A$ and $B$ are independent, so we have joint probability:

$$P(A \cap B) = P(A) \cdot P(B)$$

Here is the table of joint probability of two events:

| $P(\cdot)$ | $A$ | $\bar{A}$ |
| --- | --- | --- |
| $B$ | $p \cdot q$ | $p \cdot (1-q)$ | 
| $\bar{B}$| $(1-p) \cdot q$ | $(1-p) \cdot (1-q)$ |

Since $A \cap B$, $\bar{A} \cap B$, $A \cap \bar{B}$ would receive “yes” (with an observed ratio $k$) and $\bar{A} \cap \bar{B}$ would receive “no” (with an observed ratio $1-k$),
we can calculate the target probability $q$ with the prior known probabiliy $p$ and the observed conditional probability $k$:

$$
\begin{aligned}
P(\bar{A} \cap \bar{B}) &= (1-p) \cdot (1-q) = 1-k,\\
&\implies q = 1- \frac{1-k}{1-p}.
\end{aligned}
$$

For example, if observed $k=55\%$ and we know $p=50\%$, we could get $q=10\%$.

</div>

</div>


### Pros and Cons

**Pros**:
- The randomization method can be implemented at data collection time. It does not require a trusted server to contain all the original records in order to perform the anonymization process.

**Cons**:
- It treats all the records equal irrespective of their local density. This leads to a problem where the outlier records 
become more susceptible to adversarial attacks as compared to records in more dense regions in the data.

## Condensation approach based PPDM

### Procedure

**Definition**: Condensation approach constructs constrained clusters in dataset and then generates pseudo data from the statistics of these clusters.

**Examples**: 

<div>

<button type="button" class="collapsible-button">
<div>Click to expand</div>
<div class="text-center text-base" style="font-size:1.5rem;"> <i class="fa fa-angle-down" style="font-weight:600;"></i></div>
</button>

<div class="collapsible-content" markdown="1">

Student Record (original)

| Name | Age | Gender	| Major | GPA |
| --- | --- | ---	| --- | --- |
| Alice | 20 | Female | Biology | 3.8 |
| Bob | 21 | Male | Chemistry | 3.5 |
| Carol | 19 | Female | Physics | 3.9 |
| David | 22 | Male | Math | 4.0 |
| Eve | 20 | Female | Biology | 3.7 |
| Frank | 21 | Male | Chemistry | 3.6 |
| Grace | 19 | Female | Physics | 3.8 |
| Harry | 22 | Male | Math | 3.9 |

Attributes:
- Explicit identifier: _Name_
- Quasi identifiers: _Age_, _Gender_, and _Major_
- Sensitive attribute: _GPA_

1. **Clustering**: We group the records into clusters based on their quasi-identifiers. Each cluster has a size of at least k, where k is the desired anonymity level. For example, if k = 2, each cluster should have at least two records.Here’s one possible clustering result:
  - Cluster 1: Alice, Eve
  - Cluster 2: Bob, Frank
  - Cluster 3: Carol, Grace
  - Cluster 4: David, Harry
2. **Statistics**: We compute the statistics of each cluster, such as the mean, median, mode, standard deviation, etc. These statistics capture the essential information of the original data. Here’s an example of the cluster statistics:
  - Cluster 1: Mean Age = 20, Mode Gender = Female, Mode Major = Biology, Mean GPA = 3.75
  - Cluster 2: Mean Age = 21, Mode Gender = Male, Mode Major = Chemistry, Mean GPA = 3.55
  - Cluster 3: Mean Age = 19, Mode Gender = Female, Mode Major = Physics, Mean GPA = 3.85
  - Cluster 4: Mean Age = 22, Mode Gender = Male, Mode Major = Math, Mean GPA = 3.95
3. **Synthesis**: We generate synthetic data from the cluster statistics using any data generation method, such as random sampling, regression, or generative models. The synthetic data should have the same format and distribution as the original data. Here’s an example of the synthetic data:

Student Record (condensated)

| Name | Age | Gender	| Major | GPA |
| --- | --- | ---	| --- | --- |
| Anna | 20 | Female | Biology | 3.8 | 
| Beth | 20 | Female | Biology | 3.7 | 
| Chris | 21 | Male | Chemistry | 3.6 | 
| Dan | 21 | Male | Chemistry | 3.5 | 
| Emma | 19 | Female | Physics | 3.9 | 
| Fred | 19 | Female | Physics | 3.8 | 
| George | 22 | Male | Math | 4.0 | 
| Henry | 22 | Male | Math | 3.9 | 

</div>

</div>

### Pros and Cons

**Pros**:
- The use of pseudo-data provides an additional layer of protection, as it becomes difficult to perform adversarial attacks on synthetic data.
- It works even without redesigning data mining algorithms, very effective in case of data stream problems where the data is highly dynamic.

**Cons**:
- Data mining results get affected as large amount of information is lost because of the condensation of a larger number of records into a single statistical group entity.

## Cryptography based PPDM

### Procedure

**Definition**: Cryptographic techniques are ideally meant for such 
scenarios where multiple parties collaborate to compute 
results or share non sensitive mining results and thereby 
avoiding disclosure of sensitive information.

**Examples**: 

<div>

<button type="button" class="collapsible-button">
<div>Click to expand</div>
<div class="text-center text-base" style="font-size:1.5rem;"> <i class="fa fa-angle-down" style="font-weight:600;"></i></div>
</button>

<div class="collapsible-content" markdown="1">

All these methods are almost based on a special encryption protocol known as **Secure Multiparty Computation** (SMC) technology.

In Yao, Andrew C, "_How to generate and exchange secrets_", Proceedings of 27th IEEE Symposium on Foundation of Computer 
Science, 162-167, 1986 discussed a problem where two millionaires wanted to know who is richer with neither revealing their net worth. So, SMC was coined and developed. SMC defines two basic adversarial models namely (i) **Semi-Honest model** and (ii) **Malicious model**.

See more detailed protocols in [Yao's Millionaires' problem](https://en.wikipedia.org/wiki/Yao%27s_Millionaires%27_problem).

</div>

</div>


### Pros and Cons

**Pros**:
- First, it offers a well defined model for privacy that includes methods for proving and quantifying it. 
- Second, a vast set of cryptographic algorithms and constructs to implement privacy preserving data mining algorithms are available in this domain.

**Cons**:
- This approach fails to deliver when more than a few parties are involved.
- Moreover, the data mining results may breach the privacy of individual records.


# Introducing Soft Computing Techniques

Soft computing techniques may be used to handle the different challenges offered by the data mining. -> high **MIQ (Machine Intelligence Quotient)**

- [Neural Networks](https://en.wikipedia.org/wiki/Neural_network) are widely used for classification and rule generation. 
- [Genetic algorithms](https://en.wikipedia.org/wiki/Genetic_algorithm) are adaptive, robust, efficient and global search methods, suitable in situations where the search space is large.

See related concepts: [Fuzzy set](https://en.wikipedia.org/wiki/Fuzzy_set), [Rough set](https://en.wikipedia.org/wiki/Rough_set).

# Evaluation Metrics

1. **Performance**: Performance of a mining algorithm 
is measured in terms of the time required to achieve 
the privacy criteria. 
2. **Data Utility**: Data utility is basically a measure of 
information loss or loss in the functionality of data in 
providing the results, which could be generated in 
the absence of PPDM algorithms. 
3. **Uncertainty level**: It is a measure of uncertainty with 
which the sensitive information that has been hidden 
can still be predicted. 
4. **Resistance**: Resistance is a measure of tolerance 
shown by PPDM algorithm against various data 
mining algorithms and models.

---
Thanks for reading.