---
title: Number of zeros at the end of factorial in logarithmic time
date: 2020-12-21
tags:
  - math
slug: number-of-zeros-at-the-end-of-factorial-in-logarithmic-time
---

You might think that knowing the number of zeros that suffix the value of $n!$
is useless. And you might be right. At least I haven't thought of any use.

Even though, I want to leave this here, because I found this out while solving
something else.

So the problem is:

_Given $n$, return the maximum number of zeros, that suffix $n!$. For example
for $n=25$, $n! = 15511210043330985984000000$, so the answer would be $6$._

We could compute the value of the factorial and count the number of zeros. We'd
get the result this way in $\mathcal O(n + \log (n!))$ time (compute $n!$ plus
count the zeros), [which is](https://math.stackexchange.com/questions/2152256/big-o-notation-on-the-log-factorial) $\mathcal O(n\log (n))$.

Let's use the following fact

_The number of zeros at the end of a number $n$ is equivalent to the number of
times $n$ can be evenly divided by ten._

So an equivalent problem to the one given above is: How many 10s can you factor
out of $n!$.

We could scan the numbers 1 through $n$ and find the number of 10s that get made
when computing the factorial. For example, $2\cdot 5$ makes a ten, $10$ makes a
ten, $15\cdot 4=60$ makes a ten, $20$ makes a ten, $25*8=200$ makes two tens!
That's 6 tens in total, the answer to the example of $25!$.

A pattern appears here. For each number $x$ in $(1\dots n)$, sum the number of
times we can divide $x$ by 5, and that's our result.

$$
\sum_{x=1}^n \max\left(\left\{k\in\mathbb N^+\mid x\equiv 0\ (\text{mod } 5^k)\right\}\cup \{0\}\right)
$$

Why is that? Well, a ten is made from 2 and 5. Informally, there is so many 2s
to pair with 5s, that **we can just count the 5s**. 5 can be paired with 2. 10 can be paired with the two in 4. The five in 15 can be paired with the second two in 4. 20 can be paired with a two in 8. And so on.

More formally, let's define

$$
g(n, a):= \sum_{x=1}^n \max\left(\left\{k\in\mathbb N^+\mid x\equiv 0\ (\text{mod } a^k)\right\}\cup \{0\}\right)\,,
$$

then for a given large $n$, it holds $g(n, 5)\leq g(n, 2)$, which can be easily
seen. Generally $a>b \iff g(n,a)\leq g(n,b)$.

Now how do we compute $g(n, 5)$ efficiently? A straight-forward way is to go through each number and try each $k$, that would be $\mathcal O(n^2)$. With a more clever approach, I'm sure this can be made $\mathcal O(n)$.

But let's think even smaller.

I propose

$$
g(n, a) = \sum_{i=1}^{\left\lfloor \log_a n \right\rfloor}\left\lfloor \frac{n}{a^i}\right\rfloor\,.
$$

Why does this count the number of times we find the factor $a$ in the numbers
from $1$ to $n$? Well, it takes into account all powers of $a$. First, it divides
by $a^1$, which finds how many $a$'s there are in $n$. That includes even numbers that contain $a\cdot a$ as a factor, or $a\cdot a \cdot a$, and so on.
For each of these, it adds one to the sum.

Next, we divide $n$ by $a^2$. This finds the number of times $a\cdot a$ appears as a factor.
It counts when $a\cdot a$ or $a\cdot a\cdot a\cdots$ appear, but not when $a$ appears alone.
For each of these, it adds one to the sum.
Which is correct -- we already added one for the second $a$ that appears in $a\cdot a$.

This continues while $a^i\leq n$. Let's see an example. For $g(25, 5)$, we get

$$
\left\lfloor\frac{25}{5}\right\rfloor+\left\lfloor\frac{25}{25}\right\rfloor=5+1=6\,.
$$

The first division counts a single five in $5, 10, 15, 20$ and $25$. The second division counts the second five in $25$.

Our original problem is the result of $g(n,5)$. This runs in $\mathcal O(\log
n)$ time. Nice.

Now what's interesting, and is just my unproven funny informal small conjecture (which I plan to think about later)

$$
\sum_{i=1}^{\left\lfloor \log_a n \right\rfloor}\left\lfloor \frac{n}{a^i}\right\rfloor=\left\lfloor \frac{n}{a-1}\right\rfloor -\xi(n, a)\,,
$$

where $\xi\colon (\mathbb N\times \mathbb N)\to \mathbb N$ is an unknown function, with an average
value of around 5, which is not a lot. That means we have a
good approximation for $g(n, a)$. That one is for the engineers. Bye~

![A plot of xi function](/fig1.svg)
