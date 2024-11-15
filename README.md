# Programsko inženjerstvo (StyleTrack)

# Opis projekta
Ovaj projekt je rezultat timskog rada u sklopu projektnog zadatka kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu.

Aplikacija je službeno objavljena na [ovoj stranici](https://styletrack.onrender.com/) [**UPOZORENJE!** Zbog "cold starta" backend servera koji koristimo prolazak prvog zahtjeva (najčešće prijave) trenutno može potrajati podosta. Ispričavamo se pokušati ćemo naše usluge ubrzati u što kraćem roku.]

Ova aplikacija omogućuje korisnicima upravljanje stvarima u svojim ormarima, dijeljenje odjevnih predmeta s drugim korisnicima u blizini te pregled ponuda oglašivača. Korisnici koristeći mapu unutar aplikacije mogu vidjeti javne ormare drugih korisnika u stvarnom vremenu. Aplikacija je istovremeno korisna za organizaciju i za razmjenu stvari s drugim korisnicima. Projekt obuhvaća funkcionalne i nefunkcionalne zahtjeve koji omogućuju jednostavno korištenje, skalabilnost i proširivost aplikacije.

# Funkcijski zahtjevi
- Aplikacija treba omogućiti korisniku da ju koristi kao prijavljeni korisnik i kao gost (neprijavljeni korisnik)
- Aplikacija treba imati pristup korisnikovoj lokaciji i prikazati ju kroz grafičko sučelje
- Korisnik mora moći dodavati/uklanjati/uređivati/pretraživati stvari koje posjeduje u svojim ormarima i sustav to mora trajno pamtiti. Isto vrijedi i za virtualne ormare.
- Kada korisnik želi vidjeti što su ostali korisnici (u njegovoj) blizini postavili na dijeljenje aplikacija mu to treba prikazati preko mape kroz grafičko sučelje
- Iz gornjeg zahtjeva vidimo da sustav mora pamtiti koji je ormar na kojoj geolokaciji i kojem korisniku pripada kako bi imao sve relevantne informacije
- Sustav bi trebao moći labelirati sve odjevne predmete kako bi kasnije na osnovu tih labela mogao kategorizirati, filtrirati i pretraživati iste na brz i efikasan način
- Sustav treba omogućiti i oglašivačima da stvore svoje profile, dodaju artikle i nakon toga ih predstaviti korisnicima na suptilan način kako bi korisnici mogli pogledati što koji oglašivač nudi
- Sustav mora moći primati i slati fotografije jer su potrebne za slike artikala, logo firme itd.

# Tehnologije
- PostgreSQL
- Java Spring Boot
- React

## Instalacija
> TBD

# Članovi tima 
[Lucija Bralić](https://github.com/lucija3462)
[Marko Lujo](https://github.com/MarkoLujo)
[Benjamin Teskera](https://github.com/BenjaminTeskera)
[Ivan Džankić](https://github.com/dzankicivan)
[Dominik Kos](https://github.com/dominikKos9)
[Domagoj Radman](https://github.com/dr54426)
[Ivan Došlić](https://github.com/ivandoslic-fer)

# Kontribucije
> TBD

# 📝 Kodeks ponašanja [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
Kao studenti sigurno ste upoznati s minimumom prihvatljivog ponašanja definiran u [KODEKS PONAŠANJA STUDENATA FAKULTETA ELEKTROTEHNIKE I RAČUNARSTVA SVEUČILIŠTA U ZAGREBU](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), te dodatnim naputcima za timski rad na predmetu [Programsko inženjerstvo](https://wwww.fer.hr).
Očekujemo da ćete poštovati [etički kodeks IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html) koji ima važnu obrazovnu funkciju sa svrhom postavljanja najviših standarda integriteta, odgovornog ponašanja i etičkog ponašanja u profesionalnim aktivnosti. Time profesionalna zajednica programskih inženjera definira opća načela koja definiranju  moralni karakter, donošenje važnih poslovnih odluka i uspostavljanje jasnih moralnih očekivanja za sve pripadnike zajednice.

Kodeks ponašanja skup je provedivih pravila koja služe za jasnu komunikaciju očekivanja i zahtjeva za rad zajednice/tima. Njime se jasno definiraju obaveze, prava, neprihvatljiva ponašanja te  odgovarajuće posljedice (za razliku od etičkog kodeksa). U ovom repozitoriju dan je jedan od široko prihvaćenih kodeks ponašanja za rad u zajednici otvorenog koda.
>### Poboljšajte funkcioniranje tima:
>* definirajte načina na koji će rad biti podijeljen među članovima grupe
>* dogovorite kako će grupa međusobno komunicirati.
>* ne gubite vrijeme na dogovore na koji će grupa rješavati sporove primijenite standarde!
>* implicitno podrazumijevamo da će svi članovi grupe slijediti kodeks ponašanja.
 
>###  Prijava problema
>Najgore što se može dogoditi je da netko šuti kad postoje problemi. Postoji nekoliko stvari koje možete učiniti kako biste najbolje riješili sukobe i probleme:
>* Obratite mi se izravno [e-pošta](mailto:vlado.sruk@fer.hr) i  učinit ćemo sve što je u našoj moći da u punom povjerenju saznamo koje korake trebamo poduzeti kako bismo riješili problem.
>* Razgovarajte s vašim asistentom jer ima najbolji uvid u dinamiku tima. Zajedno ćete saznati kako riješiti sukob i kako izbjeći daljnje utjecanje u vašem radu.
>* Ako se osjećate ugodno neposredno razgovarajte o problemu. Manje incidente trebalo bi rješavati izravno. Odvojite vrijeme i privatno razgovarajte s pogođenim članom tima te vjerujte u iskrenost.

# 📝 Licenca
Važeća (1)
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

Ovaj repozitorij sadrži otvoreni obrazovni sadržaji (eng. Open Educational Resources)  i licenciran je prema pravilima Creative Commons licencije koja omogućava da preuzmete djelo, podijelite ga s drugima uz 
uvjet da navođenja autora, ne upotrebljavate ga u komercijalne svrhe te dijelite pod istim uvjetima [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License HR][cc-by-nc-sa].
>
> ### Napomena:
>
> Svi paketi distribuiraju se pod vlastitim licencama.
> Svi upotrijebljeni materijali  (slike, modeli, animacije, ...) distribuiraju se pod vlastitim licencama.

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: https://creativecommons.org/licenses/by-nc/4.0/deed.hr 
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

Original [![cc0-1.0][cc0-1.0-shield]][cc0-1.0]
>
>COPYING: All the content within this repository is dedicated to the public domain under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
>
[![CC0-1.0][cc0-1.0-image]][cc0-1.0]

[cc0-1.0]: https://creativecommons.org/licenses/by/1.0/deed.en
[cc0-1.0-image]: https://licensebuttons.net/l/by/1.0/88x31.png
[cc0-1.0-shield]: https://img.shields.io/badge/License-CC0--1.0-lightgrey.svg

### Reference na licenciranje repozitorija
