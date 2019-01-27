---
layout: post
title: (CZ) Lineární diofantické rovnice
---

Diofantické rovnice jsou <span class="hint" title="mající více neznámých, než rovností">podurčené</span> polynomiální rovnice, u kterých se hledá
řešení v $\mathbb{Z}$.

Lineární diofantická rovnice je rovnice ve tvaru součtu dvou polynomů prvního řádu:

$$ax+by=c\,.$$

Takovým rovnostem se také říká [Bézoutovy](https://cs.wikipedia.org/wiki/B%C3%A9zoutova_rovnost). Lze je vyřešit pomocí [rozšířeného Euklidova algoritmu](https://cs.wikipedia.org/wiki/Roz%C5%A1%C3%AD%C5%99en%C3%BD_Eukleid%C5%AFv_algoritmus).

K čemu se ale řešení takových rovnic hodí? Pojďme se podívat na jednu úlohu,
která se objevila v matematickém testu pro čtvrtou třídu základní školy.

> Mimoni založili orchestr. Umí hrát jen na basu nebo kytaru. Jejich basy mají 5 strun a jejich kytary mají 6 strun. Celkem mají nástroje v jejich orchestru 39 strun. Kolik Mimoňů hraje v orchestru?

Po přečtení by měl být každý schopen převést slovní vyjádření do matematické notace

$$5x+6y=39\,.$$

Žáci čtvrté třídy většinou neznají rozšířený Euklidův algoritmus. Naštěstí jsou
zde malé koeficienty a s trochou pokusu a omylu by měli přijít na to, že řešením
je $[x;y]=[3;4]$, neboli Mimoňů hraje v orchestru 7.

Pojďme si ale ukázat, jak by vypadalo obecné řešení, které lze aplikovat na
podobné úlohy pro jakákoli čísla $a, b, c\in \mathbb{Z}$.

[Bézoutova rovnost](https://cs.wikipedia.org/wiki/B%C3%A9zoutova_rovnost) říká,
že

$$ax+by=c; a,b,c\in\mathbb{Z}; x,y\in\mathbb{Z} \wedge |K|=\infty \iff gcd(a,b)\mid c\,.$$

Jelikož $gcd(5,6)=1$, naše rovnice má celočíselná řešení. Abychom je zjistili, musíme
nejdříve nalézt řešení pro $5x+6y=gcd(5,6)=1$. K tomu lze využít [Euklidův algoritmus](https://cs.wikipedia.org/wiki/Eukleid%C5%AFv_algoritmus).

1. $6=5(1)+1$
2. $5=1(5)+0$

Zpětným dosazením zjistíme, že
$5(-1)+6(1)=1$. U tohoto triviálního příkladu je to zřejmé, ale u složitějších verzí
je zpětné dosazování delší. Toto dosazování je právě *rozšířením* Euklidova algoritmu.

Nyní, když jsme nalezli řešení pro $5x+6y=1$, jednoduše vynásobíme celou rovnici tak,
abychom na pravé straně dostali požadované $c$. V našem případě 39.

$$5(-39)+6(39)=39$$

Získali jsme tak jedno z řešení $[x_1;y_1]=[-39;39]\in K$. Všechna ostatní řešení mají
následující tvar:

$$\bigg[x_1-r\frac{b}{gcd(a,b)}; y_1+r\frac{a}{gcd(a,b)}\bigg]\in K; r\in \mathbb{Z}\,,\\
[-39-6r;39+5r]\in K; r\in \mathbb{Z}\,.$$

Pro vyřešení původní úlohy musíme nalézt uspořádanou dvojici $[x;y]$ takovou, že $x>0\wedge y>0$. Toho lze jednoduše dosáhnout nerovnicemi.

$$-39-6r>0 \wedge 39+5r>0\,,\\
r<-\frac{13}{2} \wedge r>-\frac{39}{5}\,,\\
r<-6,5\wedge r>-7,8\,.
$$

Jediné celé číslo vyhovující této nerovnici je $r=-7$. Po dosazení $r$ do vzorce dostáváme
$[x;y]=[3;4]$.

---

Protože se jedná o algoritmus, jeho manuální exekuce je náchylná na chyby a často také fádní. Mnohem výhodnější je implementovat pro tento účel skript. Níže můžete vidět mé řešení v Pythonu. Pokud máte nějaké nápady na jeho vylepšení, můžete
navštívit [tento repozitář](https://github.com/sorashi/linear-diophantine-equation-solver) na GitHubu.

<script src="https://gist.github.com/sorashi/38b41cee935504e6c9509fcec299ca93.js"></script>
