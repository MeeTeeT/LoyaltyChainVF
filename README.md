# Projet de certification "Exploiter la blockchain dans le développement d’applications - RS5000"

## Rendu

Projet LoyaltyChain

- Déploiement de la dApp sur Vercel : https://loyalty-chain-vf.vercel.app/
- Lien vers la vidéo de démo de dApp : https://www.loom.com/share/761d6f14633949e797f9ade2710dd3d8?sid=a900969f-aaba-4725-b179-3e6313028e33

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

- LTYAccount.sol : Gère les comptes des enseignes qui peuvent créer des LoyaltyNFT.
- LTYMarketplace.sol : Gère la création de NFT par les enseignes ainsi que la marketplace (achat/vente/retrait de la marketplace).

Front :

- Gestion d'un contexte pour récupérer notamment la notion des 2 contrats dans tous les composants de l'app afin d'interragir avec les 2 smart contracts

## Résultat du déploiement du contrat sur mumbai :\*\*

```
thibaut@MacBook-Air-de-Thibaut-2 backendTruffle % truffle migrate --network mumbai
bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'mumbai'
> Network id:      80001
> Block gas limit: 20000000 (0x1312d00)


01_script.js
============

   Replacing 'LTYAccount'
   ----------------------
   > transaction hash:    0x24b97dd5876d2e457b5c8b368d7c7d8df89d9bd14d2045feda2fbd9aad272b7c
   > Blocks: 1            Seconds: 4
   > contract address:    0x8cf1eDb896d55a39aD548Bfeb760b0154633E61d
   > block number:        38225317
   > block timestamp:     1690111244
   > account:             0xC8ba90127db6f4E2AE3d63dB8B2ca52CFB7CD716
   > balance:             1.835806181085692469
   > gas used:            1962206 (0x1df0de)
   > gas price:           2.500000017 gwei
   > value sent:          0 ETH
   > total cost:          0.004905515033357502 ETH


   Replacing 'LTYMarketplace'
   --------------------------
   > transaction hash:    0x645718e64605a4ec5668930f8adac99706184cabfa979660ccda04fbf6454506
   > Blocks: 1            Seconds: 4
   > contract address:    0xED6cca12F58EcA9C0e7cF129e8099f07620EF8b9
   > block number:        38225319
   > block timestamp:     1690111252
   > account:             0xC8ba90127db6f4E2AE3d63dB8B2ca52CFB7CD716
   > balance:             1.823337418500904884
   > gas used:            4987505 (0x4c1a71)
   > gas price:           2.500000017 gwei
   > value sent:          0 ETH
   > total cost:          0.012468762584787585 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.017374277618145087 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.017374277618145087 ETH
```

## Pour démarrer

```bash
npm i
npm start
```
