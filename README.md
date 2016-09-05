**Johdanto**
Tietotekniikkaa opiskellessa useimmat kurssit keskittyvät vain yhteen tiukasti rajattuun aiheeseen. Koska pelkkien kurssien perusteella näistä aiheista on vaikea muodostaa järkevää kokonaisuutta, päätin aloittaa projektin, jossa voisin hyödyntää useita oppimiani aiheita. Päädyin siis rakentamaan eräänlaisen robotin. Tätä projektia on tarkoitus käyttää alan opiskeluun, sekä oman osaamisen näyttämiseen.

**Rakenne ja osat**
Laite koostuu pyöreästä 3D-tulostetusta rungosta, johon on kiinnitetty kolme askelmoottoria omni wheel -renkaineen. Jokaista askelmoottoria ohjaa yksi moottoriohjain. Moottoriohjaimet on liitetty Teensy 3.0 -alustaan, joka puolestaan on liitetty Raspberry Pi 2 Model B -alustaan.

**Ohjelmisto**
Laitetta ohjataan Raspberry Pi:lla suoritettavalla Node.js-ohjelmalla Johnny-Five-kirjaston avulla. Node.js-ohjelma lähettää halutut moottorien kierrosnopeudet I2C-väylän avulla Teensy-alustalle, joka antaa niiden perusteella askelkäskyjä moottoriohjaimille. Projektiin kuuluu myös julkisessa verkossa ajettava Node.js-palvelin, joka mahdollistaa laitteen ohjaamisen selainkäyttöliittymän avulla.