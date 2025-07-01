# Secure Role Bot

![License](https://img.shields.io/badge/license-MIT-green)

## Description

**Secure Role Bot** est un bot de sécurité Discord permettant de détecter et bloquer toute tentative non autorisée d’ajout de rôles sensibles ou privé à un membre.

Dès qu’un rôle classé comme sécurisé (défini dans la configuration) est ajouté manuellement à un utilisateur, le bot intervient automatiquement :

- Il supprime immédiatement les rôles ajoutés.
- Il identifie le responsable via les **logs d’audit**.
- Il envoie une alerte avec des **boutons interactifs** pour que les owners puissent valider ou refuser l’attribution.

Le système est conçu pour fonctionner en toute autonomie et garantit un niveau de sécurité optimal contre les abus internes (staff malintentionné, vol de compte, etc.).

Le bot utilise exclusivement des commandes slash (full slash commands) pour une meilleure intégration et ergonomie.
---

## Fonctionnalités principales

- Surveillance des ajouts de rôles sécurisés.
- Vérification via les **logs d’audit Discord** pour identifier l’auteur de l’ajout.
- Blocage automatique si l’auteur n’est pas autorisé.
- Interface claire via embed avec :
  - Utilisateur ciblé
  - Auteur de l’ajout
  - Rôle ajouté
- Boutons `Autorisé ✅` / `Refusé ❌` disponibles uniquement pour les owners.
- Boutons automatiquement désactivés après validation ou refus.
---

## Crédits & Contact

Développé par **Developpeur1337**  
Pour toute question, suggestion ou besoin de support, contacte-moi sur Discord : **@developpeur1337**

---

## Installation

1. Clone ce dépôt :

```bash
git clone https://github.com/Developpeur1337/secure-role.git
cd secure-role
npm install
node index.js
