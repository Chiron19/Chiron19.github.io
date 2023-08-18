---
layout: post-toc
title: Huawei Sweden Hackthon 2022 Experience
subtitle: Dec. 9-10, 2022, Stockholm, World Trade Center
categories: contest
tags: [experience]
permalink: huawei_hackathon
---

![Huawei Sweden Hackathon 2022](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214230636969-349900823.png)

[See photo album here.](https://www.flickr.com/photos/bemyapp/albums/72177720304413786/)

[See repository on Github.](https://github.com/Chiron19/HuaweiHackathon2022)

Stockholm in winter is gorgeous, espacially during the Nobel week: pure white snow peacefully falling from sky, colorful lights on the city hall, easy and transquil mood when the night comes... 

First time taking part in a team contest as an abroad student, I experienced unforgetable moments and met friends who have complete different backgrounds. Even if the performance is not satisfying enough and the process is quite torturing, we ended up getting over it and gaining progresses.

# Downlink channel allocation problem

## Qualification Contest

### Background Description

#### Physical Background
- Many users connected to a base station need to send and receive data in real-time.
- As we have limited bandwidth, efficient allocation of data channel resources to the users has a significant impact on the quality of experience of the users.
- Here, we focus on the simplified version of the downlink data channel allocation problem as a key building block of mobile networks. 

![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214230816179-1160416913.png)

### Problem statement
#### Modeling
- 5G massive MIMO resources can be divided into M*N grids where in each grid only a single user can be placed.
- We can have multiple instances of each user based on the size of its data. A user with bigger size of data potentially needs more instances (more grids) to send its data. For example, in the following figure, we have 5 instances of user U1, 3 instances of U2 and 2 instances of U3. 
- We cannot place more than one instance of the same user in the same column, for example, two U1s cannot be placed in the same column. But we can have multiple instances of the same user in the same row.

![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214232819731-1193898086.png)

Parameters:
* $M$: Number of rows
* $N$: Number of Columns
* $U$: Set of users, {U1, U2, …} 
* $\|U\|$: Number of users

#### Analysis
Each user is denoted by a tuple including: {initial speed, data size, factor}
* Initial speed: the speed of sending the user’s data when there is no conflict with other users
* Data size: the total amount of data that the user wants to send.
* Factor: the factor by which the data speed of the user reduces as a result of collocating with other users in the same column.

For example, we can have three users as follows:
- U1={20,5000,0.3}, This means that user U1 wants to send 5000 bytes data and if there is no conflict with other users the data will be sent by speed 20; otherwise the factor 0.3 should be considered and the speed would be affected. 
U2={15,3500,0.25}, 
U3={26,4200,0.6}.

The number of instances of each user depends on both the size of its data and the speed. When a user’s data cannot be sent entirely in a single grid, it needs multiple grids.

![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214233449490-1620115891.png)

Users placed in the same column negatively affect each other in terms of data speed, while users on the same row have no effect on each other.

The speed of each user in case of not collocating with other users is equal to its initial speed, however, in case of collocating with other users in the same column, it is reduced to

$$
\text{Speed}_i = \text{initial_Speed}_i \times \left( 1- \text{collocated_factor}_i \right)
$$

Where:

$$
\text{collocated_factor}_i = \text{factor}_i \times \sum_{\forall j \neq i} \text{factor}_j
$$

which Users $j$ are assianed to the same column.

* Note 1: The speed cannot be zero. Thus, if $\text{Speed}_i$ leads to a negative value (i.e., the collocated factor gets bigger than 1), consider the speed equal to zero.  
For a single column and three users, we can have four different scenarios where the users speeds are calculated as follows:

![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214233546740-768582996.png)

### Mapping speed to data transmission rate
There is a corresponding relationship between the speed and the amount of data that a user can send, shown by the speed to data map table. Here is an example of such a table.

![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214232215782-616351961.png)

* For example, when the speed of a user is 8, 2158 bytes data can be sent.

* Notes: 
  1. To map the speed to data, use the given F function than rounds the speed considering the floating point error. For example, if the speed U1 collocated with U2 is 10.65, its data is 2696.
  2. the F function is not exactly the same as the know round function because it may roundup a number which is extremly close to the next integer number to avoid the effect of floating point error, for example if the speed is 12.999999, F functions returns 13 rather than 12. 

* For the example in the previous slide, the data sent by each user, in each scenario is calculated as follows: U1={20,5000,0.3}, U2={15,3500,0.25}, U3={26,4200,0.6}.

### Objective and Constraints
Objective: Maximise the sum of average speed of all users ($ \text{Avg_Speed}_i $), formulated as

$$
    \text{Objective_function} = \frac{ \sum_{\forall \text{Users}} \text{Avg_Speed}_i}{\text{BestSpeedUsers}}
$$

Where $ \text{BestSpeedUsers} $ is sum of maximum speed of all users and can be calculated by $ \sum_{\forall \text{Users}} \text{Init_Speed}_i $
Indeed objective function is a float number between 0 and 1 
Constraint: More than one instance of the same user cannot be placed in the same column.

Penalty term: As we would like to send all the data, we apply a penalty term that shows which portion of total data of all users cannot be sent (𝐷𝑎𝑡𝑎_𝐿𝑜𝑠𝑠). Indeed, the penalty term is a float number in range 0 to 1, where 0 indicates no data loss. A solution with zero data loss is called as ‘feasible solution’.

$$
    \text{Penalty_term} =\frac{\sum_{\forall \text{Users}} \text{Data_Loss}_i}{\text{Total_Data_of_All_Users}}
$$

$\text{Total_Data_of_All_Users}$ = Sum of total data size of all users 

### Score Function 

The Score_function includes both the objective and the penalty function. It is formulated as:

Where:

$$
    \text{Score} = \text{Objective_function} - \alpha \times \text{Penalty_term}
$$

𝛼 = Data loss penalty coefficient set by the system designer based on the importance of data users loss.  The value of alpha is given in each the test case.

The best scores are achived when the penalty term is zero, which in this case the score is equal to the objective function. The worst value of score is achived when all the data is lost, which in this case the score is equal to –𝛼.

Range of score is [–𝛼 , 1]   

### Limitations

1. Write a code in C++ or Python that can find a placement for all the test cases,
2. The execution time of the code, for each test case, should be less than 1 second on your own machine.
3. Only basic libraries can be used, using optimization libraries/tools are not allowed.

Note:
At the end of the qualification phase, to validate the codes, we check the execution time of your codes on a VM with
- Intel processor 3.0 GHz eight-cores and 16GB RAM. 

If the execution time of your code on the VM is far more than 1 second, it is counted as an invalid solution. As most of today's laptops are not more powerful than the considered VM, if the execution time of your code is in the scale of a few milliseconds on your laptop, you can ensure that it doesn't take longer on the considered VM.

### Input and Output Data

- Input:

1. A speed to data map as a csv file, used for all test cases
2. A set of input files each of which corresponds to a test case where each test case includes
    1. Grid size ($M$, $N$)
    2. Number of users ($\|U\|$)
    3. Value of 𝛼
    4. Users’ information (initial speed, data size, factor) 

- Submission file: It should be a zip file including: 

1. A csv file for each test case that includes:
    1. Grid placement
    2. Penalty_term
    3. Objective_function
    4. Score
    5. Execution time of the code

2. A single source file with either .py or .cpp or .c extension

#### Output CSV Template

- The first part is called *ASSIGNMENT PART* that includes $M$ rows, number 0 to $M$-1. This part is used for showing assigment of users to grids. 
- The next part is called as *COMPLEMENTARY PART* including four next rows, used to show data loss, user speeds, the goal function value, and the execution time of the algorithm respectively.
 
- Here we assume we have only 6 users U1, U2, U3, U4, U5 and U6. But generally we could have any given number of users.

![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221214235227538-1232385172.png)

- Please use comma ’,’ as the seprator of the elements, not other sybmols. We don’t need a comma at the end of rows. Please also use a dash ’-’ to show empty grids in the assignment part, but for other empty parts dash is not needed.
- As noted in the example, the number of columns of the csv file could be bigger than $N$. Indeed, it is equal to $max (N , \|U\|+1)$

### Evaluation in Leaderboard

1. We primarily rank the teams based on the number of feasible submitted test-cases
    - A team with more number of feasible test-cases gets higher position in the leaderboard
2. In case of equal number of feasible test-cases:
    - The team with more number of valid submitted test-cases gets higher position,
3. In case of equal number of submitted test-cases and the same number of feasible test-cases, 
    - The team with higher total score (sum of score of all submitted solutions) gets higher positions in the leaderboard
4. In case of equal number of submitted test-cases, the same number of feasible test-cases, also equal total scores, the shorter sum of execution times is prioritised.

Notes:
- A valid submission is the submission that passes all the requirements in terms of file name, file type, size, layout of the csv file and correct calculations of score, objective, penalty term while the execution time of the program is less than 1 second. Otherwise, it is an invalid solution.
- An infeasible solution is a valid solution with a non-zero value of the penalty term.
- A Feasible solution is a valid solution with zero value of the penalty term. 

## Final Contest

### Changes to problem

**Adding Users Weight** to represent the prior of users.

Each user is denoted by a tuple including: {initial speed, data size, factor, weight}

### Objective and Constraints

$$
    \text{Objective_function} = \frac{\sum_{\forall \text{Users}} \text{Avg_Speed}_i \cdot \text{Weight}_i}{\text{BestSpeedUsers}}
$$

where
$$
\text{BestSpeedUsers} = \sum_{\forall \text{Users}} \text{Init_Speed}_i\cdot \text{Weight}_i
$$

# Solving Attempt

## Optimization Problem
Different from traditional ACM problems, this problem is considered NP-hard, which is impossible to derive the _optimal solution_ within polynomial computing time. A common method is to try getting a _legal solution_ within the constraint and optimize it toward a certain optimization goal, so a _feasible solution_ among a certain range may arise.

Now, try to mathematical analyze and form the optimization goal as follow:

Find $$ \mathbf{e}_{U\times N} $$ , where $$ e_{ij} = \{0,1\} $$ .
The problem now is representing as a requiry of a 0-1 matrix, where the corresponding element $ e_{ij} $ represents whether the $ i $ -th user exists on $ j $ -th column of channel.

### Goal Function
$$
\begin{aligned}
    f(\mathbf{e}_{U\times N}) &=\sum_{i=1}^{U} \left( \frac{1}{\sum_{j=1}^{N} e_{ij}}\sum_{j=1}^{N} e_{ij}\cdot v_{ij} \right) \cdot w_i\\ 
    &= \sum_{i=1}^{U}w_i \frac{\sum_{j=1}^{N} e_{ij}\cdot {v_0}_i \left[ 1-\left(\sum_{l=1}^{U} e_{lj}\cdot k_l -e_{ij}k_i \right) \cdot k_i \right]  }{\sum_{j=1}^{N} e_{ij}} \\
    &= \sum_{i=1}^{U} w_i {v_{0}}_i \frac{(1-k_{i}^2)\sum_{j=1}^{N} e_{ij} - k_i \sum_{j=1}^{N} \sum_{l=1}^{U} e_{ij}e_{lj}k_l}{\sum_{j=1}^{N} e_{ij}}\\
    &= \sum_{i=1}^{U} w_i {v_{0}}_i \left[ (1-k_{i}^2)- \frac{k_i\sum_{j=1}^{N} \sum_{l=1}^{U} e_{ij}e_{lj}k_l}{\sum_{j=1}^{N} e_{ij}} \right]\\
    &= \sum_{i=1}^{U} w_i {v_{0}}_i\cdot (1-k_{i}^2)- g(\mathbf{e}_{U\times N})
\end{aligned}
$$

where

$$
    \begin{aligned}
    g(\mathbf{e}_{U\times N}) &= \sum_{i=1}^{U} w_i {v_{0}}_i k_i \frac{\sum_{j=1}^{N} \sum_{l=1}^{U} e_{ij}e_{lj}k_l}{\sum_{j=1}^{N} e_{ij}}\\
    &= \sum_{i=1}^{U} \beta_i  \frac{\sum_{j=1}^{N} \sum_{l=1}^{U} e_{ij}e_{lj}k_l}{\sum_{j=1}^{N} e_{ij}}\\
    \end{aligned}
$$
$$
    \begin{aligned}
    v_{ij} &= {v_{0}}_i \left[ 1-\left(\sum_{l=1, l \neq i}^{U} e_{lj}\cdot k_l \right) \cdot k_i \right] \\
    &={v_{0}}_i \left[ 1-\left(\sum_{l=1}^{U} e_{lj}\cdot k_l -e_{ij}k_i \right) \cdot k_i \right]
    \end{aligned}
$$

subject to

Data size Limit (main):
$$
    \sum_{j=1}^{N} e_{ij}\cdot D(v_{ij}) \geq d_i,\ \forall i \in \left\{ 1, \ldots , U \right\} 
$$

where $$ d^{\prime}_{ij} = D(v_{ij}) $$ 
is a mapping function, 
$$ \mathbb{R} \mapsto \mathbb{D} $$.

User number Limit (strict):
$$
    \sum_{i=1}^{U} e_{ij} \leq  M,\ \forall j \in \left\{ 1, \ldots , N \right\} 
$$

For fesible solutions, find $\arg \max_{\mathbf{e}} f(\mathbf{e}) = \arg \min_{\mathbf{e}} g(\mathbf{e})$.

If Data size Limit cannot be fulfilled, counted as infesible solutions.

Penalty term (related to data loss):

$$
    P(\mathbf{e}_{U\times N}) = -\alpha\cdot \frac{\sum_{i=1}^{U} \left[d_i - \sum_{j=1}^{N} e_{ij}\cdot D(v_{ij})  \right]}{\sum_{i=1}^{U} d_i}
$$

Goal Function with Penalty term:

$$
    f_p(\mathbf{e}_{U\times N}) = f(\mathbf{e}_{U\times N}) + P(\mathbf{e}_{U\times N})
$$

### Test Case Range

| id | $M$ | $N$ | $U$ | $\alpha$ |
| --- | --- | --- | --- | --- |
| 1 | 16 | 25 | 80 | 10000 |
| 2 | 16 | 32 | 40 | 1000 |
| 3 | 16 | 100 | 80 | 10000 |
| 4 | 16 | 128 | 300 | 1000 |
| 5 | 16 | 250 | 400 | 1000 |
| 6 | 20 | 800 | 200 | 1000 |
| 7 | 20 | 1600 | 1000 | 1000 |
| 8 | 20 | 1600 | 50 | 1000 |
| 9 | 20 | 1600 | 2000 | 1000 |
| 10 | 16 | 275 | 440 | 100 |

### Mapping Function

$$ D(v_{ij}) = \tilde{d}_{\left\lfloor \tilde{v}_{ij} \right\rfloor +1} $$
where 
$$ \tilde{v}_{ij} = \min(\max(v_{ij},0), |\tilde{\mathbf{d}}|-1) $$ .

$\tilde{\mathbf{d}} = [$ 0, 290, 575, 813, 1082, 1351, 1620, 1889, 2158, 2427, 2696, 2965, 3234, 3503, 3772, 4041, 4310, 4579, 4848, 5117, 5386, 5655, 5924, 6093, 6360, 6611, 6800 $].$

## Algorithms

The winning team gave a lot of interesting insights.

First of all: most of the feasible solutions for the main objective were obtained by randomized algorithms shuffle-relax, heuristic objectives (example: sorting by factor likelihood).

In terms of optimizing the objective function:
- Simulated Annealing, SA
- Heuristic Dynamic Searching
- ...

## Data Structure

The data structure affects much the coding normalization and running efficiency. During the design, an elegent and efficient structure with functions like -- searching by index (direct/inverse), adding, deleting, inquiring and modifying -- should be supported.

# Conclusion

All in all, it was still a rewarding day of hammering through. trying to form a strong team next time and try again!

Below is a picture of Stockholm City Hall lit up and glowed just in time for Nobel Night:
![](https://img2023.cnblogs.com/blog/2134749/202212/2134749-20221221035623081-1348047583.png)

Thanks for reading.