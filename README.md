**Tila**

Robotti on purettu muiden projektien tieltä. En kehota käyttämään näitä koodeja sellaisenaan mihinkään, enkä anna takuuta nykyisen version toimivuudesta.

**Johdanto**
Tietotekniikkaa opiskellessa useimmat kurssit keskittyvät vain yhteen tiukasti rajattuun aiheeseen. Koska pelkkien kurssien perusteella näistä aiheista on vaikea muodostaa järkevää kokonaisuutta, päätin aloittaa projektin, jossa voisin hyödyntää useita oppimiani aiheita. Päädyin siis rakentamaan eräänlaisen robotin.

**Rakenne ja osat**
Laite koostuu suunnittelemastani pyöreästä 3D-tulostetusta rungosta, johon on kiinnitetty kolme askelmoottoria omni wheel -renkaineen. Jokaista askelmoottoria ohjaa yksi moottoriohjain. Moottoriohjaimet on liitetty Teensy 3.0 -alustaan, joka puolestaan on liitetty Raspberry Pi 2 Model B -alustaan. Navigointia varten on eri versioissa käytetty ultraääni- ja TeraRanger-sensoreita etäisyyksien mittaamiseen, sekä kiihtyvyysantureita ja elektronista kompassia asennon määrittämiseen.

**Ohjelmisto**
Laitetta ohjataan Raspberry Pi:lla suoritettavalla Node.js-ohjelmalla Johnny-Five-kirjaston avulla. Node.js-ohjelma lähettää halutut moottorien kierrosnopeudet I2C-väylän avulla Teensy-alustalle, joka antaa niiden perusteella askelkäskyjä moottoriohjaimille. Projektiin on kuulunut myös julkisessa verkossa ajettava Node.js-palvelin, joka mahdollistaa laitteen ohjaamisen selainkäyttöliittymän avulla mistä tahansa, jos robotilla ja sen ohjaajalla on yhteys verkkoon. Viimeisessä versiossa laitetta ohjattiin lähiverkossa. Kehittyneimmässä versiossa robotti kykeni liikkumaan haluttuun suuntaan mitaten etäisyyksiä ympärillään oleviin kohteisiin ja piirtäen niistä karttaa ohjauskäyttöliittymään. Laitteeseen oli myös kiinnitetty Raspberry Pi -kameramoduuli, jonka ottamaa videokuvaa lähetettin ohjaajalle WebSocket-yhteydellä.

![alt tag](js-robots/chassis.jpg)


