---
layout: post-toc
title: Concurrent Computing Summary
subtitle: CS-453, 2023 Autumn, EPFL
categories: course
tags: [course]
permalink: concurrent_computing
---
> This is the quick summary from course material [Concurrent Computing](https://edu.epfl.ch/coursebook/en/concurrent-computing-CS-453).

# Registers

A register has two operations: `read()` and `write()`

### Sequential specification
```c
read():
  return(x)

write(v):
  x <- v; return(ok)
```

## Simplifications
We assume that registers contain only integers

Unless explicitly stated otherwise, registers are initially supposed to contain 0

## Dimensions
- Dimension 1: binary (boolean) – multivalued
- Dimension 2:
    - SRSW (single reader, single writer) 
    - MRSW (multiple reader, single writer) 
    - MRMW (multiple reader, multiple writer)
- Dimension 3: safe – regular – atomic

    - Safe execution
```c
if read() after write(v): return(v)
else return(random anything)
```

    - Regular execution
```c
if read() after write(v): return(v)
else return(last written v’) or return(this written v)
```

    - Atomic execution<br>
Appeared as sequential (Only consider as a linearization point)
```c
if read() after write(v): return(v)
else return(last written v’)
```

## 2 decades of hard work
**Theorem**: A multivalued MRMW atomic register can be implemented with binary SRSW safe registers

### Conventions (1)
The process executing the code is implicitly assumed to be pi

We assume a system of n processes

NB. We distinguish base and high-level registers

### Conventions (2)
The operations to be implemented are denoted `Read()` and `Write()`

Those of the base registers are denoted `read()` and `write()`

We omit the `return(ok)` instruction at the end of `Write()` implementations

## (1) From (binary) SRSW safe to (binary) MRSW safe
We use an array of SRSW registers `Reg[1,…,N]`
```c
Read():
  return(Reg[i].read());

Write(v):
  for j = 1 to N 
	  Reg[j].write(v);
```

The transformation works also for multi-valued registers and regular ones

It does not however work for atomic registers

SRSW safe -> MRSW safe ✅<br>
SRSW regular -> MRSW regular ✅<br>
SRSW atomic -> MRSW atomic ❌

## (2) From binary MRSW safe to binary MRSW regular
We use one MRSW safe register
```c
Read():
  return(Reg.read());

Write(v):
  if old ≠ v then 
    Reg.write(v);
    old := v;
```

The transformation works for single reader registers

It does not work for multi-valued registers

It does not work for atomic registers 

## (3) From binary to M-valued MRSW regular
We use an array of MRSW registers  `Reg[0,1,…,M]` init to `[1,0,…,0]` (Unary Coding)
```c
Read():
  for j = 0 to M
	  if Reg[j].read() = 1 then return(j)

Write(v):
  Reg[v].write(1);
    for j = v-1 downto 0
	  Reg[j].write(0);
```

The transformation would not work if the `Write()` would first write 0s and then 1

The transformation works for regular but **NOT** for atomic registers

## (4) From SRSW regular to SRSW atomic
We use one SRSW register `Reg` and two local variables `t` and `x`
```c
Read():
  (t’,x’) := Reg.read();
  if t’ > t then t := t’; x := x’; 
  return(x)

Write(v):
  t := t+1;
  Reg.write(v,t);
```

The transformation would not work for multiple readers

The transformation would not work without timestamps
(variable `t` represents logical time, i.e., timestamp)

## (5) From SRSW atomic to MRSW atomic
We use N*N SRSW atomic registers `RReg[(1,1),(1,2),…,(k,j),…,(N,N)]` to communicate among the readers
- In `RReg[(k,j)]` the reader is pk and the writer is pj
- We also use N SRSW atomic registers `WReg[1,…,N]` to store new values
- the writer in all these is p1
- the reader in `WReg[k]` is pk

```c
Write(v):
  t1 := t1+1;
  for j = 1 to N
    WReg[j].write(v,t1);

Read():
  for j = 1 to N do
    (t[j],x[j]) := RReg[i,j].read();
  (t[0],x[0]) := WReg[i].read();
  (t,x) := highest(t[..],x[..]); // Value with highest timestamp
  for j = 1 to N do
    RReg[j,i].write(t,x);
  return(x)
```

The transformation would not work for multiple writers

The transformation would not work if the readers do not communicate (i.e., if a reader does not write)

## (6) From MRSW atomic to MRMW atomic
We use N MRSW atomic registers `Reg[1,…,N]`; the writer of `Reg[j]` is pj
```c
Write(v):
  for j = 1 to N do
    (t[j],x[j]) := Reg[j].read();
  (t,x) := highest(t[..],x[..]);
  t := t+1;
  Reg[i].write(t,v);

Read():
  for j = 1 to N do
    (t[j],x[j]) := Reg[j].read();
  (t,x) := highest(t[..],x[..]);
  return(x)
```

## Transformation Table
The entry in the table shows the base component and the method to form the corresponding register.

(1) Dimension 1 - Binary

  | Binary  | SRSW         | MRSW            | MRMW           |
  |---------|--------------|-----------------|----------------|
  | Safe    |              | (1) Safe SRSW   |                |
  | Regular |              | (1) Regular SRSW<br>(2) Safe MRSW|                |
  | Atomic  | (4) Regular SRSW | (5) Atomic SRSW | (6) Atomic MRSW |

(2) Dimension 1 - M-valued

  | M-valued| SRSW         | MRSW            | MRMW           |
  |---------|--------------|-----------------|----------------|
  | Safe    |              | (1) Safe SRSW    |                |
  | Regular |              | (1) Regular SRSW<br>(3) Binary Regular MRSW |                |
  | Atomic  | (4) Regular SRSW | (5) Atomic SRSW | (6) Atomic MRSW |

# The Power of Registers

Question 1: what objects can we implement with registers?

Question 2: what objects we cannot implement?

#### Wait-free implementations of atomic objects
- An object is defined by its sequential specification; i.e., by how its operations should be implemented when there is no concurrency: being atomic means preserving the sequential semantics
- Implementations should be wait-free: every process that invokes an operation eventually gets a reply (unless the process crashes)

## Counter 
A counter has two operations `inc()` and `read()` and maintains an integer `x` init to 0

### Sequential Spec
```c
read():
  return(x)

inc():
  x := x+1; return(ok)
```

### Naive implementation
The processes share one register `Reg`
```c
read():
  return(Reg.read())

inc():
  temp := Reg.read()+1;
  Reg.write(temp);
  return(ok)
```

### Atomic implementation
The processes share an array of registers `Reg[1,…,N]`
```c
inc():
  Reg[i].write(Reg[i].read()+1);
  return(ok)

read():
  sum := 0;
  for j = 1 to n do
    sum := sum + Reg[j].read();
  return(sum)
```

## Snapshot
A snapshot has operations `update()` and `scan()` and maintains an array `x` of size N

### Sequential Spec
```c
scan():
  return(x)

update(i,v):
  x[i] := v;
  return(ok)
```

### Naive implementation
The processes share one array of N registers `Reg[1,…,N]`
```c
scan():
  for j = 1 to N do
    x[j] := Reg[j].read();
  return(x)

update(i,v):
  Reg[i].write(v);
  return(ok)
```

### Non-atomic vs atomic snapshot
What we implement here is some kind of regular snapshot:

A scan returns, for every index of the snapshot, the last written values or the value of any concurrent update

We call it collect

### Key idea for atomicity
To scan, a process keeps reading the entire snapshot (i.e., it collect), until two results are the same<br>
This means that the snapshot did not change, and it is safe to return without violating atomicity

#### Same value vs. Same timestamp
Same value ↛ Same timestamp<br>
Same value ← Same timestamp

### Enforcing atomicity
The processes share one array of N registers `Reg[1,…,N]`; each contains a value and a timestamp

We use the following operation for modularity
```c
collect():
  for j = 1 to N do
    x[j] := Reg[j].read();
  return(x)

scan():
  temp1 := self.collect();
  while(true) do
    temp2 := self.collect();
    if (temp1 = temp2) then
      return(temp1.val)
    temp1 := temp2;

update(i,v):
  ts := ts + 1;
  Reg[i].write(v,ts);
  return(ok)
```

#### Wait-freedom?

**Key idea for atomicity & wait-freedom**<br>
The processes share an array of registers `Reg[1,…,N]` that contains each:
- a value (`v`),
- a timestamp (`ts`), and
- a copy of the entire array of values (`v1',…,vN'`)

To **scan**, a process keeps collecting and returns a collect if it did not change, or some collect returned by a concurrent scan<br>
Timestamps are used to check if the collect changes or if a scan has been taken in the meantime

To **update**, a process scans and writes the value, the new timestamp and the result of the scan

### Snapshot implementation
Every process keeps a local timestamp `ts`
```c
update(i,v):
  ts := ts+1;
  Reg[i].write(v,ts,self.scan());
  return(ok)

scan():
  t1 := self.collect(); 
  t2 := t1
  while(true) do
    t3 := self.collect();
    if (t3 = t2) then return (t3[..].value); // Return value for 1 to N in t3
    for j = 1 to N do
      if (t3[j].timestamp ≥ t1[j].timestamp+2) then // Have update after scan() begin
        return (t3[j].scancopy)
    t2 := t3
```

Possible execution?

# Writing while reading registers

We have seen how to:<br>
Transform Safe SRSW to Atomic MRMW registers:
1. By writing (the underlying registers) while reading
2. By using infinite memory/registers (timestamps are forever increasing)

Can we do better?

### Bound on SWSR atomic register implementations
**Theorem 1.** There is **no** wait-free algorithm that:
- Implements a SRSW atomic register,
- Uses a finite number of bounded SRSW regular registers,
- And where the base registers can only be written by the writer (of the atomic register).

### Proving an impossibility result
#### General strategy
Build a “general” counter-example (adversarial model)

For any algorithm (given the hypotheses), you (the adversary) can always create a scenario/example that violates (one of) the properties it is meant to achieve

#### Building an adversarial counter-example
 Good strategies/steps:
1. Simplify the problem as much as possible (without loss of generality)
2. Carefully analyse the hypotheses to get ideas

#### Simplify the problem
Let us assume (without loss of generality) that (**Hypothesis**):
1. The higher-level register is binary (i.e., the atomic SWSR register)
2. Instead of finitely many SWSR regular registers, there is only one SWSR regular register (called `reg`)

#### Analyzing the “ingredients” (hypotheses)
We are the adversary crafting a general counter-example. Consider any algorithm that implements the atomic SWSR register.
- What are the limitations of the algorithm?
- What properties the algorithm ensure that force it to act in a certain way?

1. Wait free → any operation must eventually complete if run infinitely long
2. Finite number of bounded registers → the underlying register `reg` can only take a finite (limited) number of different values
3. Reg is regular → `reg.read()` can return its previous value when if there is a concurrent write to `reg`
4. The base registers can only be written by the writer → the `Read()` operation does not change `reg` → the state of `reg` is controlled entirely by the writer

#### Constructing the adversarial example
The writer alternates between writing 0 and 1 on the atomic register, forever.

What is the state of reg after each `Write(0)`?

In **Hypothesis 2**: Finite number of bounded registers → the underlying register `reg` can only take a finite (limited) number of different values<br>
There is a value v0 that appears an infinite number of times after `Write(0)`<br>
There is an infinite number of `Write(1)` operations, starting after `reg` in state v0, in which `reg` ends in state vn after the `Write(1)`.<br>
A `Write(1)` might perform multiple writes to `reg`, so `reg` might not change from v0 to vn immediately.

Claim: there are values v0, v1, … vn, such that `reg` changes directly from v(i) to v(i+1) infinitely often.

### Bound on SWMR atomic register implementations
**Theorem 2.** There is **no** wait-free algorithm that:
- Implements a SWMR atomic register,
- Uses any number of SWSR atomic registers,
- And where the base registers can only be written by the writer (of the SWMR register).

# The Limitations of Registers

**Question 1**: what objects can we implement with registers? 
- Counters and snapshots (previous lecture)

**Question 2**: what objects we cannot implement? 
- All objects that (together with registers) can implement consensus (this lecture)

## Fetch&Inc
- A counter that contains an integer
- Operation `fetch&inc()` increments the counter and returns the new value

### The consensus object
One operation `propose()` which returns a value. When a propose operation returns, we say that the process decides
- No two processes decide differently
- Every decided value is a proposed value

- Proposition:
Consensus can be implemented among two processes with Fetch&Inc and registers
- Proof (algorithm): 
Consider two processes p0 and p1 and two registers `R0` and `R1` and a Fetch&Inc `C`.

### 2-Consensus with Fetch&Inc
Uses two registers `R0` and `R1`, and a Fetch&Inc object `C` (with one `fetch&inc()` operation that returns its value)
(NB. The value in `C` is initialized to 0) 

Process pI:
```c
propose(vI):
	R[I].write(vI)
	val := C.fetch&inc()
	if(val = 1) then return(vI) // Implying self gets initial increment (winner), decides on own proposed value
	else return(R[1-I].read()) // Implying other gets initial increment (loser), decides on other's proposed value
```

### Impossibility [FLP85,LA87]
- Proposition: 
No **asynchronous deterministic** algorithm implements **consensus** among two processes using only **registers**
- Corollary: 
No algorithm implements Fetch&Inc among two processes using only registers

## Queue
- The queue is an object container with two operations: enq() and deq()
- Can we implement a (atomic wait-free) queue?

### 2-Consensus with queues
Uses two registers `R0` and `R1`, and a queue `Q`; `Q` is initialized to {winner, loser}

Process pI:
```c
propose(vI):
	R[I].write(vI)
	item := Q.dequeue()
	if item = winner return(vI)
	else return(R[1-I].read())
```

### Correctness
Proof (algorithm):
- **Wait-freedom**<br>
By the assumption of a wait-free register and a wait-free queue plus the fact that the algorithm does not contain any wait statement
- **Validity**<br>
If pI dequeues winner, it decides on its own proposed value. If pI dequeues loser, then the other process pJ dequeued winner before. By the algorithm, pJ has previously written its input value in RJ. Thus, pI decides on pJ’s proposed value;
- **Agreement**<br>
If the two processes decide, they decide on the value written in the same register.

## More consensus implementations
- A Test&Set object maintains binary values `x`, init to 0, and `y`; it provides one operation: `test&set()`

Sequential spec:
```c
test&set():
	y := x; x: = 1; return(y)
```

- A Compare&Swap object maintains a value `x`, init to ⊥, and provides one operation: `compare&swap(v,w)`

Sequential spec:
```c
compare&swap(old,new):
	if x = old then x := new; return(x)
```

### 2-Consensus with Test&Set 
Uses two registers `R0` and `R1`, and a Test&Set object `T`

Process pI:
```c
propose(vI):
	R[I].write(vI)
	val := T.test&set()
	if(val = 0) then return(vI)
	else return(R[1-I].read())
```

### N-Consensus with Compare&Swap
Uses a Compare&Swap object `C`

Process pI:
```c
propose(vI):
	val := C.compare&swap(⊥, vI)
	if(val = ⊥) then return(vI)
	else return(val)
```

## Impossibility (Proof)

- Proposition: no algorithm implements consensus among two processes using only registers
- Proof (by contradiction): consider two processes p0 and p1 and any number of registers, `R1 … Rk …`
- Assume that a consensus algorithm `A` for p0 and p1 exists.

### Elements of the model
- Configuration is a global state of the distributed system<br>
A new configuration is obtained by executing a step on a previous configuration: the step is the unit of execution<br>
The adversary decides which process executes the next step and the algorithm deterministically decides the next configuration based on the current one
- Schedule is a sequence of steps represented by process ids<br>
The schedule is chosen by the system<br>
An asynchronous system is one with no constraint on the schedules: any sequence of process ids is a schedule

#### Distributed computing is a game
- A game between an adversary and a set of processes
- The adversary decides which process goes next
- The processes take steps

### Consensus
- The algorithm must ensure that _agreement_ and _validity_ are satisfied in every schedule
- Every process that executes an infinite number of steps eventually decides

### Impossibility (elements)
1. a (initial) **configuration** C is a set of (initial) values of p0 and p1 together with the values of the registers: `R1 … Rk …`;
2. a **step** is an elementary action executed by some process pI: it consists in reading or writing a value in a register and changing pI’s state according to the algorithm A;
3. a **schedule** S is a sequence of steps; S(C) denotes the configuration that results from applying S to C.

- Consider u to be 0 or 1; 
- a configuration C is **u-valent** if, starting from C, no matter how the processes behave, no decision other than u is possible
- We say that the configuration is **univalent**. Otherwise, the configuration is called **bivalent**.

### Impossibility (structure)
- **Lemma 1**: there is at least one initial **bivalent** configuration
- **Lemma 2**: given any bivalent configuration C, there is an **arbitrarily long schedule** S(C) that leads to another bivalent configuration

#### Lemma 1
The initial configuration C(0,1) is bivalent.

**Proof**: <br>
Consider C(0,0) and p1 not taking any step:
- p0 decides 0;
- p0 cannot distinguish C(0,0) from C(0,1) and can hence decides 0 starting from C(0,1);
- similarly, if we consider C(1,1) and p0 not taking any step, p1 eventually decides 1;
- p1 cannot distinguish C(1,1) from C(0,1) and can hence decides 1 starting from C(0,1).

Hence the bivalency.

#### Lemma 2
Given any bivalent configuration C, there is an arbitrarily long schedule S such that S(C) is bivalent.

**Proof** (by contradiction):<br>
Let S be the schedule with the maximal length such as D = S(C) is bivalent; 
p0(D) and p1(D) are both univalent: 
one of them is 0-valent (say p0(D)) and the other is 1-valent (say p1(D))

- To go from D to p0(D) (vs p1(D)) p0 (vs p1) accesses a register;<br>
the register must be the same in both cases;<br>
otherwise p1(p0(D)) is the same as p0(p1(D)):<br>
in contradiction with the very fact that p0(D) is 0-valent whereas p1(D) is 1-valent

- To go from D to p0(D), p0 cannot read R;<br>
otherwise R has the same state in D and in p0(D);<br>
in this case, the registers and p1 have the same state in p1(p0(D)) and p1(D);<br>
if p1 is the only one executing steps, then p1 eventually decides 1 in both cases: <br>
a contradiction with the fact that p0(D) is 0-valent;<br>
the same argument applies to show that p1 cannot read R to go from D to p1(D)

Thus both p0 and p1 write in R to go from D to p0(D) (resp., p1(D)).
But then p0(p1(D)) = p0(D) (resp. p1(p0(D)) = p1(D)) --- a contradiction.

#### Conclusion
- Lemmas 1 and 2 imply that there is a configuration C and an infinite schedule S such that, for any prefix S’ of S, S’(C) is bivalent.
- In infinite schedule S, at least one process executes an infinite number of steps and does not decide
- A contradiction with the assumption that A implements consensus.

#### Reference
Encyclopedia of Algorithms, Second Edition, Page 152, _Asynchronous Consensus Impossibility_, 1985; Fischer, Lynch, Paterson

# Universal constructions

## Universality [Her91]
- **Definition 1**: A type T is _universal_ if, together with registers, instances of T can be used to provide a wait-free linearizable implementation of any other type (with a sequential specification)
- **Definition 2**: The implementation is called a _universal construction_

## Consensus
**Theorem 1**: Consensus is universal [Her91]
- Corollary 1: Compare&swap is universal
- Corollary 2: Test&set is universal in a system of 2 processes (it has consensus number 2)
- Corollary to FLP/LA: Register is _not_ universal in a system of at least 2 processes

Shared memory model = Registers (read-write) + Consensus objects

### The consensus object
One operation `propose()` which returns a value. When a propose returns, the process decides.
- Agreement: No two processes decide differently
- Validity: Every decided value is a proposed value
- Termination (wait-free): Every correct process that proposes a value eventually decides

### Universality
- We consider first **deterministic** objects and then **non-deterministic** ones
- An object is **deterministic** if the result and final state of any operation depends solely on the initial state and the arguments of the operation

### Example 
- (FIFO Queue) Sequential deterministic specification
- (Set) Sequential non-deterministic specification

### Universal construction (1)
- We assume a deterministic object
- We give an algorithm where
  - every process has a copy of the object (inherent for wait-freedom)
  - processes communicate through registers and consensus objects (linearizability)

Example (FIFO Queue) Non-linearizable execution

### Universal algorithm (1)

#### Shared objects
- The processes share an array of n SWMR registers `Lreq` (theoretically of infinite size)
  - This is used to **inform** all processes about which requests need to be performed
- The processes also share a consensus list `Lcons` (also of infinite size)
  - This is used to ensure that the processes **agree** on a total order to perform the requests (on their local copies)

We use an ordered list of consensus objects:
- Every such object is uniquely identified by an integer
- Every consensus object is used to agree on a set of requests (the integer is associated to this set)

The algorithm combines the shared registers `Lreq[I]` and the consensus object list `Lcons` to ensure that:
- Every request invoked by a correct process is performed and a result is eventually returned (wait-free)
- Requests are executed in the same total order at all processes (i.e., there is a linearization point)
- This order reflects the real-time order (the linearization point is within the interval of the operation)

Linearization (FIFO Queue)

#### Local data structures
Every process also uses two local data structures:
- A list of requests that the process has performed (on its local copy): `lPerf`
- A list of requests that the process has to perform: `lInv`

Every request is uniquely identified

#### Tasks
Every process pI executes three // tasks:
- Task 1: whenever pI has a new request, pI adds it to ` Lreq[I]`
- Task 2: periodically, pI adds the new elements of every `Lreq[J]` into `lInv`
- Task 3: while (`lInv – lPerf`) is not empty, pI performs requests using `Lcons`

While (`lInv – lPerf`) is not empty
- pI proposes `lInv – lPerf` for a new consensus in `Lcons`(increasing the consensus integer)
- pI performs the requests decided (that are not in `lperf`) on the local copy
- For every performed request:
  pI returns the result if the request is in  `Lreq[I]` pI puts the request in `lPerf`

Example (FIFO Queue)

#### Correctness
- Lemma 1 (wait-free): every correct process pI that invokes req eventually returns from that invocation

**Proof** (sketch):<br> 
Assume by contradiction that pI does not return from that invocation;<br>
pI puts req into `Lreq` (Task 1);<br>
eventually, every proposed `lInv - lPerf` contains req (Task 2);<br>
and the consensus decision contains req (Task 3);<br>
the result is then eventually returned (Task 3)

- Lemma 2 (order): the processes execute the requests in the same total order

**Proof** (sketch): the processes agree on the same total order for sets of requests and then use the same order within every set of requests (the linearization order is determined by the integers associated with the consensus)

- Lemma 3 (real-time): if a request req1 precedes in real-time a request req2, then req2 appears in the linearization after req1

**Proof** (sketch): it directly follows from the algorithm that the result of req2 is based on the state of req1

#### Why not?
Every process pI executes three // tasks:
- Task 1: whenever pI has a new request, pI adds it to `linv`
- Task 3: while (`lInv – lPerf`) is not empty, pI performs requests using `Lcons`

Universality (1 + 2)
- We consider first deterministic objects and then non-deterministic ones
- An object is non-deterministic if the result and final state of an operation might differ even with the same initial state and the same arguments

#### A restricted deterministic type
- Assume that a non-deterministic type T is defined by a relation $\delta$ that maps each state $s$ and each request $o$ to a set of pairs $(s’,r)$, where $s’$ is a new state and $r$ is the returned result after applying request $o$ to an object of T in state $s$.
- Define a function $\delta'$ as follows: For any $s$ and $o$, $\delta’(s,o) \in \delta(s,o)$.

The type defined by $\delta’$ is deterministic

It is sufficient to implement a type defined by $\delta'$ !
- Every execution of the resulting (deterministic) object will satisfy the specification of T.

Task 3 (Preserving non-determinism)<br> 
While `lInv–lPerf` is not empty
- pI produces the reply and new state (`update`) from request by performing: `(reply,update) := object.exec(request)`
- pI proposes `(request,reply,update)` to a new consensus in `Lcons` (increasing the consensus integer) producing `(request',reply',update') `
- pI updates the local copy: `object.update(update')` 
- pI returns the result if the request is in `Lreq[I]`
- pI puts `(request',reply',update')` in `lPerf`

# Implementing the Consensus Object with Timing Assumptions

## A modular approach
We implement __Wait-free Consensus (Consensus)__ through:<br>
_Lock-free Consensus (L-Consensus)_
and
__Registers_

We implement __L-Consensus__ through:<br>
_Obstruction-free Consensus (O-Consensus)_
and
_<>Leader_ (encapsulating timing assumptions and
sometimes denoted by $$\Omega$$)

### Consensus
- **Wait-Free-Termination**: If a correct process proposes, then it eventually decides
- **Agreement**: No two processes decide differently
- **Validity**: Any value decided must have been proposed

### L-Consensus
- **Lock-Free-Termination**: If a correct process proposes, then _at least one_ correct process eventually decides
- **Agreement**: No two processes decide differently
- **Validity**: Any value decided must have been proposed

### O-Consensus
- **Obstruction-Free-Termination**: If a correct process proposes and _eventually executes alone_, then the process eventually decides
- **Agreement**: No two processes decide differently
- **Validity**: Any value decided must have been proposed

## O-Consensus

### Idea
- A process that is eventually « left alone » to execute steps, eventually decides
- Several processes may keep trying to concurrently decide until some unknown time: agreement and validity should be preserved during this preliminary period

### Data
- Each process pi maintains a timestamp `ts`, initialized to `i` and incremented by `n`
- The processes share an array of register pairs `Reg[1,…,n]`; each element of the array contains two registers:
     - `Reg[i].T` contains a timestamp (init to 0)
     - `Reg[i].V` contains a pair (value,timestamp) (init to (⊥,0))

### Functions
To simplify the presentation, we assume two functions applied to `Reg[1,…,N]`

- `highestTsp()` returns the highest timestamp among all elements `Reg[1].T`, `Reg[2].T`, …, `Reg[N].T`
- `highestTspValue()` returns the value with the highest timestamp among all elements `Reg[1].V`, `Reg[2].V`, …, `Reg[N].V`

### Algorithm
```c
propose(v): 
  while(true) do
    Reg[i].T.write(ts); // (1)
    val := Reg[1,…,n].highestTspValue(); // (2)
    if val = ⊥ then val := v;
    Reg[i].V.write(val,ts); // (3)
    if ts = Reg[1,…,n].highestTsp() then return(val) // (4)
    ts := ts + n
```

- (1) pi announces its timestamp
- (2) pi selects the value with the highest timestamp (or its own if there is none)
- (3) pi announces the value with its timestamp
- (4) if pi’s timestamp is the highest, then pi decides (i.e., pi knows that any process that executes line 2 will select pi’s value)

## L-Consensus

We implement L-Consensus using <>leader (`leader()`) and the O-Consensus algorithm

The idea is to use <>leader to make sure that, eventually, one process keeps executing steps alone, until that process decides

### <> Leader

- One operation `leader()` which does not take any input parameter and returns a boolean
- A process considers itself leader if the boolean `leader()` is true

**Property**: If a correct process invokes leader, then the invocation returns and _eventually_, some correct process is _permanently_ the only leader

### Algorithm
```c
propose(v):
  while(true) do
    if leader() then
      Reg[i].T.write(ts);
      val := Reg[1,…,n].highestTspValue();
      if val = ⊥ then val := v;
      Reg[i].V.write(val,ts);
      if ts = Reg[1,…,n].highestTsp() then return(val)
      ts := ts + n
```

### From L-Consensus to Consensus (helping)
- Every process that decides writes its value in a register `Dec` (init to ⊥)
- Every process periodically seeks for a value in `Dec`

## Consensus
```c
propose(v):
  while (Dec.read() = ⊥) do
    if leader() then
      Reg[i].T.write(ts);
      val := Reg[1,…,n].highestTspValue();
      if val = ⊥ then val := v;
      Reg[i].V.write(val,ts);
      if ts = Reg[1,…,n].highestTsp() then Dec.write(val)
      ts := ts + n;
  return(Dec.read())
```

## <> Leader
- One operation `leader()` which does not take any input parameter and returns a boolean
- A process considers itself leader if the boolean is true

**Property**: If a correct process invokes leader, then the invocation returns and _eventually_, some correct process is _permanently_ the only leader

### Algorithm
- We assume that the system is <>synchronous
    - There is a time after which there is a lower and an upper bound on the delay for a process to execute a local action, a read or a write in shared memory
    - The time after which the system becomes synchronous is called the global stabilization time (GST) and is unknown to the processes
- This model captures the practical observation that distributed systems are usually synchronous and sometimes asynchronous

#### Shared Variables
- Every process pi elects (stores in a local variable leader) the process with the lowest identity that pi considers as non-crashed; if pi elects pj, then j < i
- A process pi that considers itself leader keeps incrementing `Reg[i]` , i.e., claiming leadership
- Eventually, only the leader keeps incrementing `Reg[i]`

#### Local Variables
- Every process periodically increments local variables `clock` and `check`, as well as a local variable delay whenever its leader changes
- Process pi maintains `last[j]` to record the last value of `Reg[j]` pi has read (pi can hence know whether pj has progressed)
- The next leader is the one with the smallest id that makes some progress; if no such process pj such that j < i exists, then pi elects itself (`noLeader` is true)

#### Initialization
- `check`, and `delay` are initialized to 1 
- `last[j]` and `Reg[j]` are initialized to 0

#### Algorithm
```c
leader():
  clock := 0;
  while(true) do
    if (leader=self) then
      Reg[i].write(Reg[i].read()+1);
    clock := clock+1;
    if (clock = check) then elect();

elect():
  noLeader := true;
  for j = 1 to (i-1) do
    if (Reg[j].read() > last[j]) then
      last[j] := Reg[j].read();
      if (leader ≠ pj) then delay := delay*2;
      leader:= pj;
      noLeader := false; 
      break (for);
  check := check + delay
  if (noLeader) then leader := self;
```

#### Consensus = Registers + <> Leader
<>Leader encapsulates the following synchrony assumption:<br>
There is a time after which a lower and an upper bound hold on the time it takes for every process to execute a step (eventual synchrony)

## Minimal Assumptions
- Consensus is impossible in an asynchronous system with Registers (FLP83, LA88)
- Consensus is possible in an eventually synchronous system (i.e., <>Leader) with Registers (DLS88, LH95)

# Computing with anonymous processes
## Counter
### Sequential Spec
A counter has two operations `inc()` and `read()` and maintains an integer `x` init to 0
```c
read():
  return(x)
  
inc():
  x := x+1;
  return(ok)
```
### Atomic Implementation
The processes share an array of SWMR registers
`Reg[1,…,n]` ; the writer of register `Reg[i]` is pi
```c
inc():
  temp := Reg[i].read()+1;
  Reg[i].write(temp);
  return(ok)

read():
  sum := 0;
  for j = 1 to n do
    sum := sum + Reg[j].read();
  return(sum)
```

## Weak Counter
A **weak counter** has one operation `wInc()`
```c
wInc():
  x := x+1;
  return(x)
```

Correctness:<br>
1. if op1 precedes another op2, then op2 returns a value that is larger than op1;
2. the value returned does not exceed the number of invocations

NB. Resembles a regular Fetch&Inc object

### Lock-free Implementation
The processes share an (infinite) array of MWMR registers `Reg[1,…,n,…]`, init to 0
```c
wInc():
  i := 0;
  while (Reg[i].read() ≠ 0) do
    i := i+1;
  Reg[i].write(1);
  return(i);
```

### Wait-free Implementation
The processes also use a MWMR register `L`
```c
wInc():
  i := 0;
  while (Reg[i].read() ≠ 0) do
    // if L has been updated n times then return the largest value seen in L
    i := i+1;
  L.write(i);
  Reg[i].write(1);
  return(i);
```

Organized Vers: 
```c
wInc():
  t := l := L.read();
  i := k := 0;
  while (Reg[i].read() ≠ 0) do
    i : = i+1;
    if L.read() ≠ l then
      l := L.read();
      t := max(t,l);
      k := k+1;
      if k = n then return(t);
  L.write(i);
  Reg[i].write(1);
  return(i);
```

## Snapshot
### Sequential Spec
A **snapshot** has operations `update()` and
`scan()` and maintains an array `x` of size n
```c
scan():
  return(x)
```
NB. No component is devoted to a process
```c
update(i,v):
  x[i] := v;
  return(ok)
```

### Key idea for atomicity & wait-freedom
- The processes share a **Weak Counter**: `Wcounter`, init to 0;
- The processes share an array of **registers** `Reg[1,…,N]` that contains each:
    - a value,
    - a timestamp, and
    - a copy of the entire array of values

- To **scan**, a process keeps collecting and returns a
collect if it did not change, or some collect returned
by a concurrent **scan**<br>
Timestamps are used to check if a scan has
been taken in the meantime
- To **update**, a process **scan**s and writes the value,
the new timestamp and the result of the scan

###  Implementation
Every process keeps a local timestamp `ts`
```c
update(i,v):
  ts := Wcounter.wInc();
  Reg[i].write(v,ts,self.scan());
  return(ok)

scan():
  ts := Wcounter.wInc();
  while(true) do
    // If some Reg[j] contains a collect with a higher timestamp than ts, then return that collect
    // If n+1 sets of reads return identical results then return that one
```

## Consensus
### Obstruction-free
We consider binary consensus

The processes share two infinite arrays of registers: `Reg0[i]` and `Reg1[i]`

Every process holds an integer `i` init to 1

Idea: to impose a value `v`, a process needs to be fast enough to fill in registers `Reg{v}[i]`

```c
propose(v):
  while(true) do
    if Reg{1-v}[i] = 0 then
      Reg{v}[i] := 1;
      if i > 1 and Reg{1-v}[i-1] = 0 then return(v);
    else v := 1-v;
    i := i+1;
```

### solo process & lock-step

### Binary
```c
propose(v):
  while(true) do
    if Reg{1-v}[i] = 0 then
      Reg{v}[i] := 1;
      if i > 1 and Reg{1-v}[i-1] = 0 then return(v);
    else if Reg{v}[i] = 0 then v := 1-v;
    if v = 1 then wait(2*i)
    i := i+1;
```

# Transactional Memory

## Introduction
Locking is "history"

Lock-freedom is "difficult"

Wanted:  A synchronisation abstraction that is simple, robust and efficient

Back to the sequential level
```
atomic {
  accessing object 1;
  accessing object 2;
}
```

### Semantics (serialisability)
Every transaction appears to execute at an indivisible point in time
(linearizability of transactions)

### TM
The TM Topic has been a VERY HOT topic
- Sun/Oracle, Intel, AMD, IBM, MSR
- Fortress (Sun); X10 (IBM); Chapel (Cray)

### The TM API
(a simple view)
- `begin()` returns `ok`
- `read()` returns a value or `abort`
- `write()` returns `ok` or `abort`
- `commit()` returns `ok` or `abort`
- `abort()` returns `ok`

## Two-phase locking
### Idea
To `write` or `read` O, T requires a `lock` on O;<br>
T `waits` if some T’ acquired a `lock` on O;<br>
At the end, T `releases` all its locks.

Every object O, with state s(O) (a **register**), is protected by a lock l(O) (a `c&s`)<br>
Every transaction has local variables `wSet` and `wLog`<br>
Initially: l(O) = unlocked, `wSet` = `wLog` = ∅

### Algorithm
```c
Upon op = read() or write(v) on object O
  if O ∉ wSet then
    wait until unlocked = l(O).c&s(unlocked,locked)
    wSet := wSet U O
    wLog := wLog U S(O).read()
  if op = read() then return S(O).read()
  S(O).write(v)
  return ok
```
```c
Upon commit()
  cleanup()
  return ok
```
```c
Upon abort()
  rollback()
  cleanup()
  return ok
```
```c
Upon rollback()
  for all O ∈ wSet do S(O).write(wLog(O))
  wLog := ∅
```
```c
Upon cleanup()
  for all O ∈ wSet do l(O).write(unlocked)
  wSet := ∅
```

### Why two phases?
#### Original Idea
- To `write` or `read` O, T requires a `lock` on O; T `waits` if some T’ acquired a `lock` on O
- T `releases` the lock on O when T is done with O

#### Read-write Lock
(1) Wait
- To `write` O, T requires a `write-lock` on O; T `waits` if some T’ acquired a `lock` on O
- To `read` O, T requires a `read-lock` on O; T `waits` if some T’ acquired a `write-lock` on O
- Before committing, T `releases` all its locks

(2) Better dead than wait
- To `write` O, T requires a `write-lock` on O; T `aborts` if some T’ acquired a `lock` on O
- To `read` O, T requires a `read-lock` on O; T `aborts` if some T’ acquired a `write-lock` on O
- Before committing, T `releases` all its locks
- A transaction that aborts restarts again

(3) Better kill than wait
- To `write` O, T requires a `write-lock` on O; T `aborts` **T’** if some T’ acquired a `lock` on O
- To `read` O, T requires a `read-lock` on O; T `aborts` **T’** if some T’ acquired a `write-lock` on O
- Before committing, T `releases` all its locks
- A transaction that is aborted restarts again

(4) Better kill than wait, revised
- To `write` O, T requires a `write-lock` on O; T `aborts` **T’** if some T’ acquired a `lock` on O
- To `read` O, T requires a `read-lock` on O; T `waits` if some T’ acquired a `write-lock` on O
- Before committing, T `releases` all its locks
- A transaction that is aborted restarts again

### Visible Read
(SXM, RSTM, TLRW)
- **Write is mega killer**: to write an object, a transaction aborts any live one which has read or written the object
- **Visible but not so careful read**: when a transaction reads an object, it says so

- A visible read invalidates cache lines
- For read-dominated workloads, this means a lot of traffic on the bus between processors
    - This reduces the throughput
    - Not a big deal with single-CPU, but with many core machines

### Two-phase locking with invisible reads
- To `write` O, T requires a `write-lock` on O; T `waits` if some T’ acquired a `write-lock` on O
- To `read` O, T checks if **all objects read remain valid** - else T `aborts`
- Before committing, T checks if **all objects read remain valid** and releases all its locks

### Invisible reads
- Every object O, with state s(O) (register), is protected by a lock l(O) (`c&s`)
- Every transaction maintains, besides `wSet` and `wLog`
- A local variable `rset(O)` for every object

```c
Upon write(v) on object O
  if O ∉ wSet then
    wait until unlocked = l(O).c&s(unlocked,locked)
    wSet := wSet U O
    wLog := wLog U S(O).read()
  (*,ts) := S(O).read()
  S(O).write(v,ts)
  return ok
```
```c
Upon read() on object O
  (v,ts) := S(O).read()
  if O ∈ wSet then return v
  if l(O) = locked or not validate() then abort()
  if rset(O) = 0 then rset(O) := ts
  return v
```
```c
Upon validate()
  for all O s.t rset(O) > 0 do
    (v,ts) := S(O).read()
    if ts ≠ rset(O) or (O ∉ wset and l(O) = locked) then 
      return false
    else return true
```
```c
Upon commit()
  if not validate() then abort()
  for all O ∈ wset do
    (v,ts) := S(O).read()
  S(O).write(v,ts+1)
  cleanup()
```
```c
Upon rollback()
  for all O ∈ wSet do S(O).write(wLog(O))
  wLog := ∅
```
```c
Upon cleanup()
  for all O ∈ wset do l(O).write(unlocked)
  wset := ∅
  rset(O) := 0 for all O
```

### DSTM (SUN)
- To `write` O, T requires a `write-lock` on O; T `aborts` T’ if some T’ acquired a `write-lock` on O
- To `read` O, T checks if all objects read remain valid – else T `aborts`
- Before committing, T releases all its locks

- **Killer write**(ownership)
- **Careful read**(validation)

### More efficient algorithm?
Apologizing versus asking permission
- **Killer write**
- **Optimistic read**: validity check only at commit time

#### Example
Invariant: 0 < x < y

Initially: x := 1; y := 2

#### Division by zero
T1: x := x+1 ; y:= y+1

T2: z := 1 / (y - x)

#### Infinite loop
T1: x := 3; y:= 6

T2: a := y; b:= x; repeat b:= b + 1 until a = b

#### Opacity
- Serializability
- Consistent memory view

### Trade-off
The read is either **visible** or **careful**

#### Read invisibility
- The fact that the read is invisible means T1 cannot inform T2, which would in turn abort T1 if it accessed similar objects (SXM, RSTM)

NB. Another way out is the use of multiversions: T2 would not have written “on” T1

#### Aborting is a fatality

### Conditional progress (obstruction-freedom)
- A correct transaction that eventually does not encounter **contention ** eventually commits
- **Obstruction-freedom** seems reasonable and is indeed possible

#### DSTM
- To `write` O, T requires a `write-lock` onO (use `C&S`); T `aborts` T’ if some T’ acquired a `write-lock` on O (use `C&S`)
- To `read` O, T checks if all objects read remain valid - else abort (use `C&S`)
- Before committing, T releases all its locks (use `C&S`)

#### Progress
- If a transaction T wants to write an object O owned by another transaction T’, T calls a **contention manager**
- The contention manager can decide to wait, retry or abort T’

#### Contention managers
- **Aggressive**: always aborts the victim
- **Backoff**: wait for some time (exponential backoff) and then abort the victim
- **Karma**: priority = cumulative number of shared objects accessed – work estimate. Abort the victim when number of retries exceeds difference in priorities.
- **Polka**: Karma + backoff waiting

#### Greedy contention manager
- State
    - Priority (based on start time)
    - Waiting flag (set while waiting)
- **Wait** if other has Higher priority AND not waiting
- **Abort** other if Lower priority OR waiting

## Concluding remarks
- TM does not always replace locks: it hides them
- Memory transactions look like db transactions but are different

### The garbage-collection analogy
- In the early times, the programmers had to take care of allocating and de-allocating memory
- Garbage collectors do it for you: they are now incorporated in Java and other languages
- Hardware support was initially expected, but now software solutions are very effective

### Reference
Principles of Transactional Memory by _Rachid Guerraoui_, _Michal Kapalka_

# Register implementations out of faulty base registers
## Failure modes
- Responsive: once ⟂, forever ⟂
- Non-responsive: no reply

`t` denotes the number of base objects that can fail

NB. In the asynchronous model, it is impossible to distinguish a _non-responsive_ from a _slow_ object

## Algorithms
1. Implements a SWMR register out of `t+1` SWMR base responsive failure-prone registers
2. Implements a SWSR register out of `2t+1` SWSR base non-responsive failure-prone registers

### Responsive model
```c
Write(v):
  for j = 1 to (t+1) do
    Reg[j].write(v);
   return(ok)
   
Read():
  for j = t+1 downto 1 do
    v := Reg[j].read();
    if v ≠ ⟂ then return(v)
```

### Non-responsive model
```c
Init: seq := 1

Write(v):
  w_seq := w_seq + 1;
  for j = 1 to (2t+1) do
    Reg[j].write(w_seq, v);
  // wait until a majority of oks are returned
  return(ok)
```
```c
Init: (sn,val) := (-1, ⟂);

Read():
  for j = 1 to (2t+1) do
    (s,v) := Reg[j].read();
  (sn,val) := (s,v) with the highest s from majority, including (sn,val)
  return (val)
```