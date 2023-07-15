# Projet de certification "Exploiter la blockchain dans le développement d’applications - RS5000"

## Rendu

Projet LoyaltyChain

- Déploiement de la dApp sur Vercel : https://loyalty-chain-vf.vercel.app/
- Lien vers la vidéo de démo de dApp :

## Environnement

BackEnd :  
📁 Repertoire backendTruffle

- Déploiement avec Truffle (possibilité dans le script de déploiement pré-créer des comptes de marque)
- Script web3

<u>_Remarque : Il existe un repertoire "backend" que j'ai créé pour réaliser le déploiement sous hardhat mais j'ai rencontré des soucis dans la configuration. Par manque de temps pour corriger le problème de configuration, je suis passé sous truffle._</u>

Front End :  
📁 Repertoire frontend

- React + etherjs
- Tailwind pour le css

## Principe de fonctionnement

Smart Contract :
2 SC :

- LTYAccount.sol : Gère les comptes des enseignes qui peuvent créer des LoyaltyNFT
- LTYMarketplace.sol : Gère la création de NFT par les enseignes ainsi que la marketplace (achat/vente/retrait de la marketplace)

Front :

- Gestion d'un contexte pour récupérer notamment la notion des 2 contrats dans tous les composants de l'app afin d'interragir avec les 2 smart contracts

## Résultat du déploiement du contrat sur goerli :\*\*

```

```

## Coverage des tests unitaires :\*\*

```

```

## Pour démarrer

```bash
npm i
npm start
```
