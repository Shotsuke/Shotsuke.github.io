---
title: 密码学原理 <Elements of Cryptography>
date: 2023-09-01 14:06:57
categories: "Course Notes"
tags: Course
---

## Perfect Security （完美保密性）

### One-Time Pad 算法
![One-Time Pad](\../imgs/Crypto/otp.jpg)
M,K,C全部一样，$\{0,1\}^l$表示l位比特串（这仅是一个例子）

gen：随机生成密钥k

enc：位异或

dec：位异或

这是一个完美保密的算法。代入$\frac{1}{2^l}$ 则易证明.

这个算法保证了攻击者得到任何密文的概率都是相同的.

#### One-Time Pad算法的缺点

密钥长度与明文长度相等

仅能使用一次.一旦使用第二次,产生了$m1,m2,c1,c2$,那么必定有$m1 \bigoplus  m2 = c1 \bigoplus c2$

这时不符合$Pr[M1=m1,M2=m2 | C1=c1,C2=c2]$,因为不符合的m1,m2对会被直接排除

仅能保证对cighertext-only的攻击



### 定理5.1

##### 如果完美保密,那么 密钥空间大小 不小于 明文空间大小

考虑到明文空间经过加密之后的空间大小，即密文空间大小不小于明文空间大小。

这首先密文空间是存在的。

$Pr[M=m|C=c] = Pr[M=m]$ 右边大于0，

对于任意选取的c，必定有对应的**互不相同的**密钥使之解密到明文，

否则会有某个明文$m^*$的概率为0 ，则知之。



### 定理6.1 （香农定理）

若$|M|=|C|=|K|$，那么该加密算法完美保密 $\iff$

每个密钥等概率选取。

任取m和c，均有密钥能够对应。



## Computational Security （计算安全）

我们对对手并没有一个能力上的假设，对于信息论上的安全，甚至假定对手是无限计算能力的。

但是这是不大现实的。我们需要实现的是在我们计算能力的增加之下设计密钥，

使其复杂程度远高于对手计算能力的增加所能解决的范围。



我们假定有效率的对手为：

Efficient adversaries = Randomized algorithms + Polynomial time bounded

= Probabilistic Polynomial time bounded 

也即使用多项式时间复杂度的对手，其可能使用各种优化。

其运行算法至多运行**多项式**步。



允许**微不足道(negligible)的**成功概率：

认为攻击者成功的概率小于$negl(n)$即有。或：可忽略的。


##### super-polynomial（超多项式）

$$superpoly(n) > n^c$$
when n is sufficiently large.

如果对手使用的算法复杂度是超多项式的，那么我们通过扩大数据规模能够使对手GG。

superpoly(n)和negl(n)互为倒数。



### Def 1.1 $negl（n）$

对于任意的多项式p，均能找到N，使得n>N时，$negl(n) < \frac{1}{p(n)}$。

**def 1.2** 等价地，$negl(n) < \frac{1}{n^c}$，其中c是任意正整数。



### Def 1.3 计算安全

对于所有的多项式攻击对手，他们的成功概率都是可忽略函数。

等价地，**def 1.4** 对于足够大的n，任意攻击者的成功概率小于$\frac{1}{p(n)}$



### Def 2.1 私钥加密算法

Gen：$k \leftarrow Gen(1^n)$ 这表示的是n个1的串，其中key-Gen读到的是n

Enc：$m \in \{0,1\}^*$ 星星表示的是明文m是有限长度的

Dec。

如果Enc仅仅在明文为l(n)位时有定义，那么我们说这是一个定长的私钥加密算法。

Almost always, Gen($1^n$ ): k \$← $\{0, 1\}^n$


##### 语义安全(semantic security)

攻击者无法从密文上得到任何信息。

等价与不可区分性



### Def 2.2 对于窃听者的不可区分性(or: EAV-secure)

$$Pr[PrivK^{eav}_{A,\pi} (n) = 1] \leq 0.5 + negl(n)$$

等价地，**def 2.3 :** $$Pr[out_A(PrivK^{eav}_{A,\pi} (n,0)) = 1] \leq Pr[out_A(PrivK^{eav}_{A,\pi} (n,1)) = 1] + negl(n)$$

即指以m0进行加密时和以m1进行加密时二者猜对的概率相差可忽略。



##### One-Time Pad + Eav-Secure

$$ M = \{0,1\}^l , K = \{0,1\}^l , C = \{0,1\}^l$$

可以去缩减一下密钥的长度，小小的给出一点点破绽



### Def 3.1 Pseudo-randon Generator（伪随机生成器）

设l是一个多项式，令G是一个确定的多项式时间算法，使得$G(s)$输出一个长度为$l(n)$的字符串。

**拓展性：** $l(n) > n$，这保证使用短长度的密钥来生成长长度的密钥

**Pseudo-randomness：** 对于任意的PPT算法D，

$$\mid Pr[D(G(s)) = 1] - Pr[D(r) = 1] \mid \le negl(n) $$

其中r是一个随机的长度为l(n)的比特串

在此时去分辨以r作为密钥和以G去生成密钥的区别十分小，此时即可

我们称l为G的拓展因子(**expansion factor**)（种子）
![prg](\../imgs/Crypto/prg.jpg)



Key->Pseudorandom generator->pad->new Key

Plaintext->new Key->cipher text



### Construction 3.1

G为一个PRG，种子为l，其与OTP进行复合。在此时这个构造符合EAV-secure。



### Reduction paradigm

要证明这个，我们需要使用归约算法。

假设现在我们提出了一个密码学方案或者协议 $\Pi$   ,我们需要证明它是安全的。怎么证明？

我们的协议一般是建立在已经被证明安全的协议/方案上面，或者建立在某些困难问题上面（记为X），比如RSA公钥加密算法就是建立在因数分解困难问题上。为了简化证明，站在巨人的肩膀上，我们希望通过搭建下面的逻辑命题关系来完成我们的证明。

**条件命题**：只要X是安全的，那么方案$\Pi$就是安全地。或者，若X被PPT攻击者攻破，那么$\Pi$就不再是安全地。

通过等价变换，我们去得到：

#### 如果方案$\Pi$不是安全的，那么X就不是安全的。

即：**如果存在PPT的敌手可以攻破$\Pi$，那么我们就能够构造一个PPT的敌手来攻破$\Pi$。**

在归约证明中，我们令X的敌手来模拟$\Pi$的挑战者。要求有：

- X的敌手在接受挑战者的输入之后的输出，即此时模拟的挑战者足够的“逼真”，使得$\Pi$的敌手无法区分这是真实的还是模拟的，除了negl

- 所模拟的挑战者的执行时间是PPT的

***

X挑战者 -> X敌手 -> 模拟为$\Pi$的挑战者输入 -> $\Pi$输出 -> X敌手转化回来 ->  X输出

***

对于Construction 3.1的证明，我们转化为证明PRG。

#### Proof：

G  is PRG $\rightarrow \Pi$ is EAV-secure

假设存在一个PPT攻击者A能够攻击系统$\Pi$，并且假定$\frac{1}{2} + \epsilon (n)$是A在一个挑战者实验中胜出$\Pi$的概率。

现在我们想要构造一个攻击者A'去攻击G，而G使用PRG算法。也即我们想要的攻击者A'满足：
$$ \mid Pr[A'(G(s)) = 1] - Pr[A'(r) = 1] \mid = p(n) * \epsilon (n) $$ 其中$\epsilon$是non-negl的

而我们已有$$ \mid Pr[PrivK ^{eav} _{A , \Pi} = 1] - \frac{1}{2}] \mid = \epsilon (n) $$

如何构造？

使用A去模拟一个分辨的实验，使其判断G(s)和r谁是随机而谁是伪随机。如果A胜出，则输出1.

当输入$k = r$时，因为是纯随机，此时必定有$Pr[A'(r) = 1] = Pr[PrivK^{eav} _{A,\Pi} = 1] =1/2$

当输入$k = G(s)$ ， 有$Pr[A'(G(s)) = 1] = Pr[PrivK ^{eav} _{A , {\Pi}} = 1]$

代入即有。



### stream cipher （流密码）

流密码是一对确定的算法

Init: state0 := Init(s , [IV]) (Init Vector)

Getbits: (yi,statei) := Getbits(statei-1) for i = 1,2,3,...



### Linear-feedback shift registers (线性反馈移位寄存器)

ITS EZ.



### RC4 (Rivest Cipher 4)

一种密钥长度可变的流加密算法，为流加密添加了非线性元素


```c++
/*初始化函数*/
void rc4_init(unsigned char* s,unsigned char* key, unsigned long Len)
{
  int i=0,j=0;
  //char k[256]={0};
  unsigned char k[256]={0};
  unsigned char tmp=0;
  for(i=0;i<256;i++) {
    s[i]=i;
    k[i]=key[i%Len];
  }
  for(i=0;i<256;i++) {
    j=(j+s[i]+k[i])%256;
    tmp=s[i];
    s[i]=s[j];//交换s[i]和s[j]
    s[j]=tmp;
  }
}
```

```c++
/*加解密*/
void rc4_crypt(unsigned char* s,unsigned char* Data,unsigned long Len)
{
  int i=0,j=0,t=0;
  unsigned long k=0;
  unsigned char`tmp;
  for(k=0;k<Len;k++)
  {
    i=(i+1)%256;
    j=(j+s[i])%256;
    tmp=s[i];
    s[i]=s[j];//交换s[x]和s[y]
    s[j]=tmp;
    t=(s[i]+s[j])%256;
    Data[k]^=s[t];
  }
}
```




### CPA Security and Pseudorandom Functions (CPA 安全与伪随机函数)



在$PrivK_{A,\Pi}^{eav}$中，敌手仅仅被允许查看一段密文。如果敌手能够看到多段密文呢？

我们使用$PrivK_{A,\Pi}^{mult}$来表示这种情况。（多消息的窃听实验）

仍然由挑战者自己来选择两段明文发送，原先的m0，m1改为：$$M_0 = (m_{0,1} , ... , m_{0,t}) , M_1 = (m_{1,1} , ... , m_{1,t})$$

其中对应的明文段的长度相等。将其全部加密后二选一，$C = (c_1,...,c_t)$发送给挑战者，然后令其输出0，1.

相似的，$\mid Pr[PrivK ^{mult} _{A , \Pi} = 1] - \frac{1}{2}] \mid = \epsilon (n)$代表不可区分性。

但是此时，单次加密的不可区分性不等于多次加密的不可区分性。

例如对于凯撒密码，选择明文{“cat”，“cat”}和{“cat”，“dog”}即可攻击成功。

因此，如果是确定性的加密算法，在此时会立刻崩溃。故多次加密的不可区分性相较于单次加密的不可区分性更强。此时是**已知明文攻击**，这与下文的选择明文攻击不一样。



### CPA indistinguishability experiment（选择明文攻击-不可区分实验）
![cpa](\../imgs/Crypto/cpa.jpg)

敌手能够自主地选择明文(chosen-plaintext attacks)**是什么**，攻击者能够选择**任何**明文进行加密。

定义cpa不可区分性实验：$$PrivK_{A,\Pi}^{cpa}(n)$$

①密钥k由$Gen(1^n)$生成

②攻击者拥有明文数据长度、对于$Enc_k(·)$有**神谕访问权限**（他会告诉你结果，但不会告诉你过程）

③随机选择$b \in \{0,1\}$，然后将$c \leftarrow Enc_k(M_b)$返还给攻击者A

④A**仍然**拥有**神谕访问权限**，仍然可以继续使用enc玩，最后输出b‘

⑤判断成功与否

相似的，$$ \mid Pr[PrivK ^{cpa} _{A , \Pi} = 1] - \frac{1}{2}] \mid = \epsilon (n) $$代表不可区分性。

之所以给A两轮神谕访问权限，是为了给A多次的信息。

有隐藏的限制：总计访问应当控制在多项式步中，不允许访问超多项式的步数。



我们可以使用伪随机函数来构造一个CPA安全的加密算法。可以使用伪随机函数来生成伪随机函数。

对于$Fun_{c_n}$表示所有函数，定义域和值域都为$\{0,1\}^n$，其大小为$2^{n2^n}$

一个随机的函数是从funcn中随机选取的。



##### Key function

$$F:\{0,1\}^{L_{key}} *  \{0,1\}^{L_{in}} \rightarrow \{0,1\}^{L_{out}}$$

如果能够有多项式时间的算法使得在多项式时间内计算出$F(k,x)$，那么我们称F是高效的。在实际应用中，密钥k的选择常常已经定下来了，此时我们关心单输入函数：

$$F_k(x) = F(k,x)$$

若我们随机地挑选密钥k，那么keyed function F将会产生一个在$Fun_c$上的自然的分布。

如果$F_k$从一个随机选取的密钥k产生，和纯随机一个$F(k,x)$是不可区分的，那么我们说$F_k$是伪随机的。

伪随机函数的定义：$$\mid Pr[D^{F_k(·)} (1^n) = 1] - Pr[D^{f(·)} (1^n) = 1] \mid \le negl(n)$$

其中f是真随机，Fk是伪随机。即他们的分布之差小于等于negl（n）



#### 由伪随机函数构造的CPA安全加密算法

input: $1^n$

Gen: 随机选取$k \in \{0,1\}^n$

Enc: $k \in \{0,1\}^n \ m \in \{0,1\}^n$，随机选择$r \in \{0,1\}^n$并且输出：$c := <r,F_k(r) \bigoplus m>$

Dec: 输入$c = <r,s>$和k，输出明文$m:=F_k(r)\bigoplus s$



##### proof

考虑构造一个加密算法$$\Pi'=(Gen',Enc',Dec') $$，其与$\Pi$唯一的不同是将Fk替换为纯随机函数f。

首先，没有一个PPT的攻击者可以区分这两个加密算法，因为伪随机函数和纯随机函数之间的不可区分性。也即：$$\mid Pr[PrivK^{cpa}_{A,\Pi}] - Pr[PrivK^{cpa}_{A,\Pi'}] \mid \le negl(n) $$

然后，我们证明没有一个PPT的攻击者可以在CPA实验中赢下 $\Pi'$，也即：$$Pr[PrivK^{cpa}_{A,\Pi'}] \le \frac{1}{2} + \frac{q(n)}{2^n}$$

其中q(n)是攻击者A发出加密请求的上界，这是限定A是一个PPT的攻击者。

更详细地，

$$Pr[PrivK^{cpa}_{A,\Pi'} = 1]$$

$$=Pr[PrivK^{cpa}_{A,\Pi'} = 1]$$

$$=Pr[PrivK^{cpa} _{A,Π˜} = 1|no\ queries\ match] · Pr[no\ queries\ match]$$

$$+Pr[PrivK^{cpa} _{A,Π˜} = 1| \ge 1 \ query\ matches] · Pr[\ge 1\ query\ matches] $$

$$\le \frac{1}{2}·1 + 1 · \frac{q(n)} {2^n} $$

$$\le \frac{1}{2} + \frac{q(n)}{2^n}$$

代入即有。



#### Theorem

任何私钥加密算法，如果是CPA安全的，那么对多个加密也是CPA安全的。

也就是说，我们只需要证明一个私钥加密方案对单次加密攻击是CPA安全的，然后我们就可以"免费"获得对多次加密攻击也是CPA安全的保证。这是因为我们直接给予了敌手关于系统的神谕访问权，其在挑战时就能获得其想要的任意的（多项式时间内的）消息。

定理的成立基本原因如下：

1. CPA-Secure加密是非确定性的：CPA-Secure（选择明文攻击安全）的加密方案是非确定性的，这意味着每次相同的明文可能会被加密成不同的密文。这是为了防止敌手从密文中获得关于明文的任何有用信息。
2. 在CPA不可区分性实验中的观察已包括在CPA多次加密区分性实验中：在CPA安全性的实验中，敌手可以在两个阶段观察加密方案的行为，即选择明文阶段和加密查询阶段。在单次加密实验中，这些阶段已经包括了一次明文的选择和一次加密查询的观察。

因此，由于CPA-Secure加密方案是非确定性的，对于每次不同的加密查询，加密方案会产生不同的密文。在多次加密攻击中，敌手将多次执行单次加密攻击，每次明文和加密查询都是不同的，因此敌手在多次加密攻击中看到的内容是单次加密攻击中所看到的内容的累积。由于CPA-Secure加密方案的安全性在每次加密中都已经得到了保证，因此在多次加密攻击中也会保持安全性。



#### Permutation Function(排列函数)

是一个双射。排列函数将输入数据的元素重新排列，以创建一个新的排列或置换，从而隐藏原始数据的结构或特征。

设F是一个密钥函数，如果$I\_{in} = I\_{out}$，并且对于所有的k，$F\_k:\{0,1\}^{ I\_{in} } \rightarrow \{0,1\}^{ I_{out} }$
是一一对应的，那么我们称F是一个密钥排列（置换）。

称$I_{in}$是F的**块长度**，也就是接受多少位的输入数据

如果Fk(x)和它的逆函数F^(-1)_k(y)都可以在多项式时间内计算（即，计算的时间复杂度是多项式级别），那么我们说F是**高效的**。

**Pseudorandom Permutation（伪随机排列）**：如果没有高效的算法能够在统一的密钥k下区分Fk（具有统一密钥的函数）和一个随机排列（随机选择的排列函数），那么我们说Fk是一个伪随机排列。这意味着在外部观察者的角度来看，Fk的行为看起来与随机排列的行为是不可区分的，即Fk的输出看起来是随机的，尽管它是由密钥控制的。



#### Proposition

如果F是一个伪随机排列，并且块长度大于n，那么F也是一个随机函数。

事实上，如果一个伪随机排列的块长度足够长，那么它与一个随机函数PRF不可区分。

**Strong pseudorandom permutation**

有时我们的接收者可能计算$F_k$的逆函数，因此我们假设敌手也能执行如此，并要求$F_k^{-1}$在一定程度上和Fk难以区分，即使区分者被赋予了对改置换逆的访问权限。如果这样，那么F被称为**强伪随机置换**。



#### PRF - PRG

PRG是生成长长度伪随机串的函数。

PRF是伪随机地实例化出一个函数的函数集合。

对PRF进行多次叠加可以得到PRG。

对PRG进行定长采样即得PRF。



### Block Cipher（块密码）

#### 定义

**块密码**是**高效的、密钥重排函数**：$$F:\{0,1\}^n * \{0,1\}^l \rightarrow \{0,1\}^l$$

输入长度**必须**为**l个比特**，其映射到一个新的l个比特的串。

其就是一个密钥的重排，高效的表明其逆函数能够在多项式时间内计算出来，重排说明其是一个双射。

n是密钥长度，l称为块长度。

在实际应用中，我们希望块密码是一个（强）伪随机置换。我们希望最佳的攻击者也需要$2^n$的复杂度来攻击块密码。



#### Modes of opration （工作模式）

工作模式是一个方案，其安全高效地加密**长明文**，使用流密码或者块密码。

“ block/string ciphers + mode of operation ” = long-message encryption schemes

##### ECB mode

F是一个块密码，假定明文m长度是n的l倍。ECB将其分割称若干段，每段长度为n，依次投喂到块密码F中，将其结果拼接为密文。这也要求了解密时用到的F的逆函数是存在的并且是高效的。

这并不是一个CPA安全的，因为这是应用了确定性的加密算法。

##### CBC mode

类似EBC，将每次得到的$c\_i$，与下一次的输入$m\_{i+1}$进行异或后投喂到Fk中，得到$c_{i+1}$，如此循环。这更加要求了Fk的逆函数。
![CBC-Mode](\../imgs/Crypto/CBC-Mode.png)
对于CBC模式安全性的分析：因为每次加密前都会引入一个随机的因子来和m1异或，所以在此模式下弥补了EBC的缺陷。可以证明，如果F是一个PRF，那么CBC是一个CPA安全的方案。

##### OFB mode

类似CBC，每次的输出直接投喂到Fk中，将其输出①与mi进行异或得到ci，②投喂到下一个Fk中。

优点是可以先得到一个加密的序列，提前地算好一串东西，待到接受数据后直接进行异或加密。Fk不需要有逆函数。如果F是PRF，那么OFB是CPA安全的。

##### CTR mode

ctr,ctr+1,...,ctr+n分别投喂到Fk中，结果分别与mi异或，得到密文ci



#### 设计块密码

##### 雪崩效果

A small change in the input must “affect” every bit of the output

输入的微毫之差应当引起输出的大幅度的改变，称为雪崩效应。



#### 块密码举例

##### DES

##### 3DES

##### AES



### Message Authentication（消息认证）

分为消息来源和消息内容两部分，消息认证要求这两部分均保持完好。

#### tag校验

例子：商标，戳戳

将内容或者标签的值改动，或者两者均改动，那么接收者会拿到inv tag。

Gen：input 1n，输出长于n的密钥k

Mac：$tag := Mac_k(m)\ or\ \leftarrow$

Vrfy：$b:=Vrfy_k(m,t)$

要求：

**正确性**：$$Vrfy(m,Mac_k(m)) = 1$$

**安全性**：以消息认证实验定义。$$Mac-forge_{A,\Pi}(n)$$

输出的密钥key是不会让敌手知道的，但是密钥的长度会。

给予敌手这个标签生成算法的**神谕机**$Mac_k( )$，敌手可以知道任意自己想知道的明文的标签（多项式时间内）。

如果敌手A能够针对一个自己没有访问过的明文k给出正确的tag，那么敌手A成功。

$\Pi = (Gen , Max , Vrfy)$是安全地，对于所有的PPT敌手，其成功的概率都是negl(n)。


#### $Mac-sforge_{A,\Pi}(n)$


1.敌手是自适应的，这是说，敌手先能够神谕访问，之后再动态地选择想要攻击的明文-tag对。其他的攻击者模型可能是事先定下攻击的明文。

2.这是（可能）建立在一个明文是可能对应多个tag的情况。
如果敌手能够针对一个先前访问过的明文-tag对给出一个明文相同但是tag不同的明文-tag对，那么我们也认为这是成功的。如果是确定性的算法，那么这个实验等价于之前的实验。在这个实验中存活的PI系统称为**强安全**。



#### 拓展长度的tag

##### 错误案例

将长消息M分割成若干段，分别打tag后拼接-不安全

$$<m_2||m_1,t_2||t_1>\ <m_1||m_2 , t_1||t_2>$$

添加index：将每个m前添加下标-不安全。

$$<m_1||m_2 , t_1||t_2> <m_1,t_1>$$

再添加长度l：不安全

$$<m_1'||m_2',t_1'||t_2'><m_1||m_2,t_1||t_2>\rightarrow<m_1||m_2',t_1||t_2'>$$

#### CBC-MAC

![CBC-Mode](\../imgs/Crypto/CBC-Mode.png)
![由CBC构造的MAC算法](\../imgs/Crypto/由CBC构造的MAC算法.png)
![CBC-MAC对比CBC](\../imgs/Crypto/CBC-MAC对比CBC.png)

上述是CBC和CBC-MAC的示意图。注意在此时CBC-MAC仅仅输出最后一个$t_l$作为tag。在F为伪随机函数的情况下，令l为多项式，上述的构造对于$l(n)*n$长度的消息的加密是安全的。

#### AE(Authenticated Encryption)经过身份验证的加密

**定义**：既有CCA-secure，其对应数据的安全性；又有不可伪造性，其对应数据的独立性。

#### CCA（自适应选择密文攻击）不可区分性实验

Gen：生成$k \leftarrow Gen(1^n)$
敌手A能够得到长度和$Enc_k(·)$、$Dnc_k(·)$的神谕访问权限。这输出一对相同长度的消息$m_0,m_1$
随机选择b，随机加密，密文c给A
A允许继续使用神谕机，但是禁止给DEC输入c，最后输出b‘

选择明文攻击的安全性：$$Pr[PrivK^{cca} _{A,\Pi(n)} = 1] ≤ 1/2 + negl(n)$$
CCA安全是不可延展（或：不可锻造）的。
![CCA](\../imgs/Crypto/CCA.png)

![CCA-example](\../imgs/Crypto/CCA-example.png)

![CCA性质](\../imgs/Crypto/CCA性质.png)
### 哈希函数及其应用

哈希函数常见于压缩，我们要求：
**collision resitant抗碰撞**：难以找到m和m’，使得经过哈希后得到相同的值；
**completely unpredictable难以预测（a.k.a. random oracles）**：哈希函数同一个随机函数不可区分。

考虑**密钥**哈希函数：$H^s(x)$，其中s是个key，为定值，此时的哈希函数也写成 $H(s,x)$
在使用密钥哈希函数时，我们甚至要求密钥也是公开的（当然函数加密也是公开的），此时哈希函数所有的性质都是公开的，我们希望这样的情况下都是抗碰撞的。

#### Def Of Hash Func

哈希函数时一对PPT时间的算法$(Gen,H)$:
Gen时一个概率函数，接受$1^n$的输入，输出密钥s
H接受s和一个字符串$x \in \{0,1\}^*$并且输出$H^s(x) \in \{0,1\}^{l(n)}$

如果$H^s$仅仅定义在输入$l^{'}$的输入而输出l位，那么称为定长的哈希函数。在这种情况下，我们也称H是压缩函数。

#### 碰撞寻找实验$Hash-coll_{A,\Pi}(n)$

能在PPT时间内寻找到x和x'即可。s是给出的。

相对应的，抗碰撞的定义为
$$Pr[Hash-coll_{A,\Pi}(n) = 1] \leq negl(n)$$

对其而言更弱一些的条件为：

**第二前向抗碰撞**：x不再是挑战者自定的，而是系统随机给出的。这防止了有某人“恰好”知晓了一对x、x’。

更强一些的条件为：

**前象拒绝**：随机挑选一个输出值y，挑战者需要找到输入值x。

#### Merkle-Damgard Transform

![Merkle-Damgard-哈希1](\../imgs/Crypto/Merkle-Damgard-哈希1.png)
![Merkle-Damgard-哈希2](\../imgs/Crypto/Merkle-Damgard-哈希2.png)
输入长度(a+b)，输出长度a。构造(Gen,H):
Gen：same
H：接受s和任意长度的x，将x切为若干固定长度，最终的输出仅会有最终的$H^s(x)$

由如此的h来构造H，如果h是抗碰撞的话，那么H也是抗碰撞的。

#### 使用哈希函数来对MAC的定义域进行拓展

在密钥生成Gen的时候获得s，并且在MAC和Vrfy时调用哈希函数。

如果MAC-secure + 抗碰撞，那么拓展得到的拓展MAC也是MAC-secure的。


#### HMAC

![Merkle-Dangard-哈希3](\../imgs/Crypto/Merkle-Dangard-哈希3.png)

## One-Way Functions and Hard-Core Predicates (单向函数与硬核谓词)

### One-Way Functions and One-Way Function Families

#### DEF 单向函数

![定义：单向函数](\../imgs/Crypto/定义：单向函数.png)

这是说，从x计算到fx很容易，但是从fx到x的计算很困难。

对于任意敌手A，其从一个随机给出的象fx出发找出其对应的原象是可忽略的概率。

其对应有逆转试验：随机选择x，计算fx，交给A，A需要计算其原象。成功的条件：$Pr[Invert_{A,f}(n) = 1] \leq negl(n)$

#### OWF candidates

现在并**不知道**单向函数是否存在，有些仅仅是我们暂时没能找出其PPT的解法而未被证明。
我们希望单向函数是存在的。

一个可能的单向函数的候选：质因数分解。$f(x,y) = xy$，其正向容易计算，但是分解质因数（目前）并不是PPT。

另一个例子：$f\_{ss}(x\_1 , \dots , x\_n , l) = \Sigma _{i \in l} x\_i$，其中l是$\{1,2,\dots,n\}$的一个子集。


#### Hard-core predicates （硬核谓词）

单向函数一定是隐藏了一些关于其输入的一些信息，否则一定可以有效率地找出输出。

但是并不是说输入的所有信息都被隐藏，例如$f(x_1 \mid \mid x_2) = x_1 \mid \mid g(x_2)$，其中g是OWF，那么可见f仍然是一个单向函数。因此可以有部分信息能被给出。

##### DEF 硬核谓词

![定义：硬核谓词](\../imgs/Crypto/定义：硬核谓词.png)

硬核谓词被设计用于探究单向函数隐藏的那部分关于输入的信息，其是关于f输入每个比特的一些信息的汇合。如果hc是一个f的硬核谓词，那么其能够在多项式的时间内计算出，但是在给出f的情况下能够不被高于1/2的概率计算出。这就表明这部分信息的汇合无法被观测到。

##### Goldreich-Levin Theorem

假定f是一个单向函数，那么可以构造出一个单向函数g，并且给出其的一个hc。
![定理：Goldreich-Levin-Theorem](\../imgs/Crypto/定理：Goldreich-Levin-Theorem.png)

#### Constructing PRGs with One-Way Function

$G(s) = f(s) \mid \mid hc(s)$是一个PRG，如果f是一个单向的重排函数。如此迭代能够得到一个任意（多项式）长度的PRG。

## Number Theory and Cryptographic Hardness Assumptions (数论与密码学困难度假设)-1


### 1. Where we are now
![目前大纲](\../imgs/Crypto/目前大纲.png)

### 2. Preliminaries and Basic Group Theory

#### Primes and Divisibility

##### Basic notations

$a = qb + r$，能够证明q和r唯一；对于q和r的计算能够在多项式时间$\Vert N \Vert = \lfloor \log N \rfloor + 1$之内计算出来。

一定存在整数X，Y，使得$Xa + Yb = \gcd (a,b)$。更加的，gcd是能够被表示成这种形式的最小的正整数。其可以被辗转相除法算出。但是另外：**拓展欧几里得算法**。

#### Modular Arithmetic

#### Groups

## Key Management and the Public-Key Revolution (密钥 管理与公钥加密变革)

### Key Management in Private-key Cryptography

### A Partial Solution: Key-Distribution Centers

在两者之间直接构建安全的通道（例如武装押运）代价太大，因此采用KDC。

由**可信任的KDC**给会话的所有人分发各自不同的密钥，每次通讯的消息由KDC进行加密，在另一侧解密。在会话结束后需要擦拭掉密钥。

![KDC协议](\../imgs/Crypto/KDC协议.png)


###  Achieving Private Communications without Pre-existence of Secure Channel

#### Diffie-Hellman key-exchange protocol

![Diffie-Hellman-key-exchange-protocol](\../imgs/Crypto/Diffie-Hellman-key-exchange-protocol.png)
首先通信双方都需要输入一个安全参数1n，然后运行协议：

1. Alice运行 $ç(1^n)$ 从而获得(G, q, g)
2. Alice随机的在Zq中选择一个x，然后计算$h_A := g^x$
3. Alice发送(G, q, g, hA)给Bob
4. Bob收到(G, q, g, hA)后，随机的在Zq中选择一个y，然后计算$h_B := g^y$，并将hB发送给Alice，然后输出密钥$k_B := h_A^y$
5. Alice收到hB后输出密钥$k_A := h_B^x$

定义其的安全性如下：
![key-exchange-experiment](\../imgs/Crypto/key-exchange-experiment.png)

但是这不能抵御**中间人攻击**

![中间人攻击](\../imgs/Crypto/中间人攻击.png)

## Public-Key Encryption (公钥加密)

### 1 What is Public-Key Encryption

![公钥加密算法](\../imgs/Crypto/公钥加密算法.png)

公钥加密由三个PPT算法构成。
Gen：生成一对钥匙，public key和secret key。
Enc：将消息m和公钥作为两个参数交给Enc加密，得到密文c。
Dec：将密文c和私钥作为两个参数交给Dec解密。

注意到任何公钥加密算法都是有可能出错的，但是我们可以通过特定的算法使其出错的概率降低到negl(n)。

对其的窃听者实验为：$PubK^{eav}_{A , \Pi} (n)$
生成pk，sk，将pk交给挑战者，生成一对明文$m_0,m_1$，随机选择一个进行加密，将密文c返回给挑战者，猜对算作胜利。这是CPA安全。

CCA安全：$PubK^{cca}_{A , \Pi} (n)$
相比CPA安全实验，CCA实验中的挑战者额外地拥有Dec的神谕访问权限。

需要注意的是，具有CPA安全的公钥加密算法是允许多次调用加密然后进行简单的拼接的，但是CCA不允许，那会破坏安全性。

### 2 Hybrid Encryption and the KEM/DEM Paradigm

### 3 CDH/DDH-Based Encryption

El Gamal encryption scheme:

令G是一个PPT算法，接受一个n长度的比特串，输出一个阶为n的循环群G，和G的generator。

Gen：执行G，获得$(\mathbb{G} , q , g)$，在$\mathbb{Z}_q$中随机选择一个元素x，计算$h := g^x$。公钥为：$<\mathbb{G} , q , g , h>$，私钥为：$<\mathbb{G} , q , g , x>$。明文空间为$\mathbb{G}$。

Enc：得到公钥和明文，在$\mathbb{Z}_q$中随机选择一个元素y，输出密文：$<g^y , h^y * m>$。

Dec：得到私钥和密文$<c_1 , c_2>$，输出明文：$m := c_2 / c_1^x$

对其的安全性证明：如果DDH问题对于群G而言是难的，那么El Gamal加密算法是CPA安全的。但是要注意的是，El Gamal加密算法一定不是CCA安全的。因为$<c_1^2 , c_2^2>$是$m^2$的密文。

### 4 RSA Encryption

RSA加密依托在如下的单向函数上：$$c = [m^e \mod N]$$
Gen：接受n位的比特串，输出N，e，d。
	1. $(N , p , q) \leftarrow GenModulus(1^n)$,其中p，q为不同的质数，N = p * q;
	2. $\Phi(N) = (p - 1)(q - 1)$
	3. 任选与$\Phi(N)$互质的大于1的e
	4. 计算$d := [E^{-1} \mod \Phi(N)]$
	5. 返回N,e,d.
	6. 其中<N,e>是公钥，<N,d>是私钥
Enc：$c := [m^e \mod N]$
Dec：$m := [c^d \mod N]$

RSA并不是一个CPA安全的加密方法，因为没有哪个确定性的公钥加密算法是CPA安全的。

## Digital Signature Schemes (数字签名机制)

### 1 An Overview of Digital Signatures

使用私钥和明文得到数字签名，再将数字签名、明文和公钥一起进行验证来判定是否是本人发送。即是以私钥进行生成而使用公钥进行解密。

数字签名可以被公钥验证，但是MAC不可。其具有抗抵赖性，这是说，如果验证算法验证得到了这是你发送的消息，那么你无法反驳。

通常来讲，数字签名相较于MAC效率较低。

#### DEF

key-gen-algo：接受$1^n$，输出一对key（pk，sk），即是公钥-私钥对。

sign-algo：接受sk和明文m，输出$\sigma$数字签名。

verify-algo：接受pk，明文m和签名$\sigma$，输出1或者0，表示通过签名或者不通过。

定义对其的安全性实验：$Sig-forge_{A , \Pi}(n)$

挑战者接受pk和sign-algo的神谕访问权限，如果其能够输出一个不在其访问过队列中的明文-签名对，则视为成功。

定义安全性：$Pr[Sig-forge_{A , \Pi} (n) = 1] \leq negl(n)$

定理：如果$\Pi$是一个安全的加密长度l的数字签名算法，并且$\Pi_H$是一个抗碰撞的长度为l的哈希函数，那么这个基于这两个算法构造的新的数字签名对于任意长度的明文都是安全的。

### 2 RSA Signatures

#### Plain RSA 数字签名算法：

Gen：接受长度为n的比特串，得到(N,e,d)。公钥为<N,e>，私钥为<N,d>。

Sign：$\sigma := [m^d \mod N]$

Vrfy: $m = [\sigma^e \mod N]$

但这是不安全的。

可以对特定的消息直接签名：$m = \sigma = 1$

可以对不可控的消息签名：选取任意签名，计算其e次方作为消息m。

可以由两条签名合成第三条签名，$<m_1 , \sigma_1> , <m_2 , \sigma_2> \rightarrow <m_1 * m_2 , \sigma_1 * \sigma_2>$

#### RSA-FDH

Gen: 相比RSA，多确定一个随机函数$H:\{0,1\}^{\*} \rightarrow \mathbb{Z}_N ^{\*}$

Sign: $\sigma := [H(m)^d \mod N]$

Vrfy: $\sigma^e = H(m) \mod N$

这个多出来的随机函数应当具有：单向函数（或者说难以逆转）；不易受影响的；抗碰撞的。FDH(Full Domain Hash)正如其意，全域哈希，是指把消息m随机映射在$\mathbb{Z}_n^*$的范围里，这样计算m的d次方就是个离散数学难题。

这对之前问题的解决：

1.很难计算H(1)的开e次方根也即计算$H(1) \ne 1$的d次方，因为d是保护起来的。

2.你可以从$\delta$ 获得H(m)的值，但是hash是单向函数，你很难从H(m)中得到m。

3.m1的Hash与m2的hash的乘积不等于m1与m2的乘积的Hash。

### 3 Signatures from the Discrete-Logarithm Problem

认证算法：认证算法被用作证明消息发送者的身份给另外一方。我们将注意集中在公钥认证算法。在公钥设置中，认证算法允许将自己证明给另一方，自己是与一个特定公钥相匹配的。但是如何证明这一点？也即，如何证明您知道私钥？

考虑离散对数问题。公钥$y = g^x$，其中x是私钥。我们想要证明我们自己知道私钥x。

但是私钥应当在任何时候都被保持私有，我们不可能直接将我们的私钥x发送出去。

接下来我们的问题是如何证明我们知晓x，并且以一种不暴露其的方式告诉他人。

#### Schnorr identification scheme

1.随机选择$b \leftarrow \mathbb{Z}_q$，计算$I = g^b$并且将$I$发送给验证者。

2.验证者生成一个随机的$a \leftarrow \mathbb{Z}_q$，这称之为一个“挑战”，并且将其发送回给证明者。

3.作为回应，证明者发送$X = [ax + b \mod q]$给验证者。

4.验证者验证$y^a * I = g^X$

相较于直接发送私钥x，我们将私钥作了一个仿射变换，这对其便是一个加密。

显然地，$y^a \* I = g^{ax} \* g^b = g^X$，y是公钥。如果证明者知道私钥，那么显然可以通过验证。但是如果其不知道，那么其仅有一个negl(n)的概率通过验证。

![Schnorr-signature-scheme](\../imgs/Crypto/Schnorr-signature-scheme.png)

### 4 Certificates and Public-Key Infrastructure

## Advanced Topic Cryptographic Protocols

### Bit Commitment

#### 基本思想

发送者 Alice 向接收者 Bob 承诺一个比特b (如果是多个比特，即比特串t ，则称为比特 串承诺)，要求：  
在第 1 阶段即**承诺阶段** Alice 向 Bob 承诺这 个比特b ，但是 Bob 无法知道b 的信息；  
在第 2 阶段即**揭示阶段** Alice 向 Bob 证实她在第 1 阶段承诺的确实是b ，但是 Alice 无法欺骗 Bob(即不能在第 2 阶段篡改b 的值)。

#### 经典环境示例

Alice将待承诺的比特或秘密写在一张纸上，然后将这张纸锁进一个保险箱， 该保险箱只有唯一的钥匙可以打开。  
在承诺阶段， Alice 将保险箱送给 Bob，但是保留钥匙；  
到了揭示阶段，Alice 将比特或秘密告诉 Bob，同时将钥匙传给 Bob 使其相信自己的承诺。  
需要指出的是，保险箱不能被“暴力破解”的性质甚至允许 Alice 在揭示阶段无需向 Bob 说明承诺的比特或秘密，只要将钥匙发送给 Bob 即可。

#### 性质

一个比特承诺方案必须具备下列性质：

- **正确性**  
    如果 Alice 和 Bob 均诚实地执行协议，那么在揭示阶段 Bob 将正确获得 Alice 承诺的比特b 。
- **保密性**：在揭示阶段之前 Bob 不能获知b 的信息。
- **绑定性** ：在承诺阶段结束之后， Bob 只能在揭示阶段获得唯一的b (即 Alice 无法将b 反转，就好像 Alice 与b “绑定”在一起一样)。  
    如果一个比特承诺协议同时满足保密性和绑定性，且没 有对攻击者的计算能力做任何限制性假设，则称该比特承诺 协议是无条件安全的。在经典的计算环境下所构造的比特承诺方案都无一例外地进行了一些密码学假设，如假设承诺者(证明者)或验证者的计算能力是有限的，或者单向函数是存在的等等，而这些假设对于拥有量子计算能力的对手来说，是相当脆弱的。另一方面， Mayers， Lo 和 Chau 等人证明了，无论是在经典环境下，还是量子计算环境下，标准模型下的比特承诺协议也不可能是无条件安全的，他们的结论称为 Mayers-Lo-Chau 不可能性定理(no go theorem)。目前该定理的正确性得到绝大多数学者的认可，但是还有少量的学者在努力寻找它的破绽，并积极努力地构建真正无条件安全的量子比特承诺方案。
### Secret Sharing

任何小于t的群体无法得知秘密，而任意大于等于t的群体能够非常轻松地获得秘密。

**Shamir密钥分享算法**最早在1970年基于Lagrange插值和矢量方法提出的，基本思想是分发着通过秘密多项式，将秘密s分解为n个秘密，分发给持有者，其中任意不少于t个秘密均能恢复密文，而任意少于t个秘密均无法得到密文的任何信息。

假设有秘密S要保护，任意取t-1个随机数，构造t-1次的多项式，而常数项为S。将$(x , f(x))$分发到各个服务器上。

但是如何保证得到的这个秘密S是正确的呢？我们显然无法询问其他t个个体的答案，那么这就需要比特承诺来保证正确性。如此使用的称为Verifiable Secret Sharing。
# Oblivious Transfer （不经意传输）

不经意传输（oblivious transfer）是一个密码学协议，在这个协议中，消息发送者从一些待发送的消息中发送一条给接收者，但事后对发送了哪一条消息仍然oblivious（不知道），这个协议也叫茫然传输协议。

Alice选择两个大质数p，q，创建密钥$N = p * q$，创建$(e,d)$这一对加密、解密。对消息m使用RSA加密，密钥为(N,e)。将得到的(c,N,e)发送给Bob。

Bob随机选择一个$a \leq n_A$，计算$b = a^2 \mod N$，将b发送给Alice

Alice计算$x_1^2 = b \mod N$，将所得的根发送给Bob。

如果Bob得到了a或-a，那么gg；如果不是，那么Bob可以分解N然后计算出m。注意到这里b不止有两个平方根，而是四个。
# Secure Computation