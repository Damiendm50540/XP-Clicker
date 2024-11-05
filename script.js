class Jeu {
    constructor() {
        this.XP = 0;
        this.ameliorationXP = 10;
        this.coutAutoClic = 20;
        this.XPparClic = 1;
        this.autoClickers = 0;
        this.intervalleAutoClic = null;
        this.fortune = 0;
        this.intervalleDeBaseAutoClic = 1000;
        this.dernierXPVerifie = 0;
        this.sonXP = new Audio('Sound/XP Level Up.mp3');
        this.sonAnvil_1 = new Audio('Sound/anvil_1.mp3');
        this.sonAnvil_2 = new Audio('Sound/anvil_2.mp3'); 
        this.sonBouleXP = new Audio('Sound/XP_ramasser.mp3'); 
        this.XPparClicMultiplier = 1;

        document.addEventListener("DOMContentLoaded", () => {
            this.init();
            this.TimerapparaitreBouleXP();
        });
    }

    init() {
        document.getElementById("cookie-image").addEventListener("click", (event) => {
            this.ajouterXP();
            this.animerClic();
            this.afficherPlusUn(event);
            spawnMiniCookie(event);
        });
        document.getElementById("upgrade-button").addEventListener("click", () => {
            this.acheterAmelioration();
            this.sonAnvil_1.play();
        });
        document.getElementById("auto-clicker-button").addEventListener("click", () => {
            this.acheterAutoClic();
            this.sonAnvil_2.play(); 
        });
        document.getElementById("reset-button").addEventListener("click", () => {
            this.reset();
        });
    }

    ajouterXP() {
        const gain = this.XPparClic * this.XPparClicMultiplier;
        this.XP += gain;
        this.mettreAJourScore();
        this.verifierSonXP();
        this.plusUn(`+${gain}`);
    }

    animerClic() {
        const cookieImage = document.getElementById("cookie-image");
        cookieImage.classList.add("clicking");
        setTimeout(() => {
            cookieImage.classList.remove("clicking");
        }, 200);
    }

    afficherPlusUn(event) {
        const plusUn = document.createElement("div");
        plusUn.classList.add("plus-one");
        plusUn.innerText = `+${this.XPparClic * this.XPparClicMultiplier}`;
        document.body.appendChild(plusUn);
        plusUn.style.left = `${event.clientX}px`;
        plusUn.style.top = `${event.clientY}px`;
        setTimeout(() => {
            plusUn.remove();
        }, 1000);
    }

    mettreAJourScore() {
        document.getElementById("score").innerText = "XP: " + this.XP;
    }

    verifierSonXP() {
        const seuils = [100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
        for (const seuil of seuils) {
            if (this.XP >= seuil && this.dernierXPVerifie < seuil) {
                this.sonXP.play();
                break;
            }
        }
        this.dernierXPVerifie = this.XP;
    }

    mettreAJourCoutAutoClic() {
        document.getElementById("auto-clicker-info").innerText = "Mending : " + this.autoClickers;
        document.getElementById("auto-clicker-price").innerText = this.coutAutoClic + " XP";
    }

    mettreAJourAmeliorationXP() {
        document.getElementById("upgrade-message").innerText = "Fortunes achetées : " + this.fortune;
        document.getElementById("upgrade-price").innerText = this.ameliorationXP + " XP";
    }

    afficherErreur(message) {
        const popupErreur = document.getElementById("error-popup");
        const messageErreur = document.getElementById("error-message");
        messageErreur.innerText = message;
        popupErreur.classList.add("active");
        setTimeout(() => {
            popupErreur.classList.remove("active");
        }, 2000);
    }

    acheterAmelioration() {
        if (this.XP >= this.ameliorationXP) {
            this.XP -= this.ameliorationXP;
            this.fortune += 1;
            this.XPparClic = this.fortune + 1;
            this.ameliorationXP = Math.ceil(this.ameliorationXP * 1.2);
            this.mettreAJourScore();
            this.mettreAJourAmeliorationXP();
            this.verifierSonXP();
        } else {
            this.afficherErreur("Pas assez d'XP !");
        }
    }

    acheterAutoClic() {
        if (this.XP >= this.coutAutoClic) {
            this.XP -= this.coutAutoClic;
            this.autoClickers += 1;
            this.coutAutoClic = Math.ceil(this.coutAutoClic * 1.5);
            this.mettreAJourScore();
            this.mettreAJourCoutAutoClic();
            this.demarrerAutoClic();
            this.verifierSonXP();
        } else {
            this.afficherErreur("Pas assez d'XP !");
        }
    }

    demarrerAutoClic() {
        if (!this.intervalleAutoClic) {
            this.intervalleAutoClic = setInterval(() => {
                this.XP += this.autoClickers * this.XPparClicMultiplier;
                this.mettreAJourScore();
                this.verifierSonXP();
            }, this.intervalleDeBaseAutoClic);
        }
    }

    TimerapparaitreBouleXP() {
        setInterval(() => {
            if (Math.random() < 0.2) {
                this.apparaitreBouleXP();
            }
        }, 6000); 
    }

    apparaitreBouleXP() {
        if (document.querySelector('.xp-boule')) return;

        const bouleXP = document.createElement("div");
        bouleXP.classList.add("xp-boule");
        bouleXP.style.left = `${Math.random() * 90}vw`;
        bouleXP.style.top = `${Math.random() * 85}vh`;
        document.body.appendChild(bouleXP);

        bouleXP.addEventListener("click", () => {
            this.activerXPparClicMultiplier();
            bouleXP.remove();
        });
    }

    activerXPparClicMultiplier() {
        this.XPparClicMultiplier = 10;
        this.creerParticules();
        this.afficherTimer(10);
        this.sonBouleXP.play(); 
        setTimeout(() => {
            this.XPparClicMultiplier = 1;
            this.supprimerParticules();
            this.cacherTimer();
            this.sonBouleXP.pause(); 
            this.sonBouleXP.currentTime = 0; 
        }, 10000);
    }

    creerParticules() {
        this.particleInterval = setInterval(() => {
            const particle = document.createElement("img");
            particle.src = "image/XP.png";
            particle.classList.add("particle");
            particle.style.left = `${Math.random() * 100}vw`;
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, 100);
    }

    supprimerParticules() {
        clearInterval(this.particleInterval);
    }

    afficherTimer(duree) {
        const timerElement = document.getElementById("timer");
        timerElement.style.display = "block";
        timerElement.innerText = `00:${duree}`;
        let tempsRestant = duree;

        this.timerInterval = setInterval(() => {
            tempsRestant--;
            timerElement.innerText = `00:0${tempsRestant}`;
            if (tempsRestant <= 0) {
                clearInterval(this.timerInterval);
            }
        }, 1000);
    }

    cacherTimer() {
        const timerElement = document.getElementById("timer");
        timerElement.style.display = "none";
    }

    reset() {
        location.reload();
    }

    plusUn(gain) {
        const gainElement = document.createElement('span');
        gainElement.classList.add('points-gain');
        gainElement.textContent = gain;

        const xOffset = Math.random() * 100 - 25; 
        const yOffset = Math.random() * 10 - 5;
        const clickBtnRect = document.getElementById("cookie-image").getBoundingClientRect();

        gainElement.style.left = `${clickBtnRect.left + xOffset}px`;
        gainElement.style.top = `${clickBtnRect.top + yOffset}px`;

        document.body.appendChild(gainElement);

        setTimeout(() => {
            gainElement.remove();
        }, 2000);
    }
}


const jeu = new Jeu();