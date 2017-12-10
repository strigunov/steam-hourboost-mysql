# Steam HourBoost Script with MySQL-Support
This is a simple Steam HourBoost Script with MySQL-Support written in NodeJS.

If you find any bugs, please do not hesitate to report them to me.

[![GitHub issues](https://img.shields.io/github/issues/Triniayo/steam-hourboost-mysql.svg)](https://github.com/Triniayo/steam-hourboost-mysql/issues)
[![GitHub stars](https://img.shields.io/github/stars/Triniayo/steam-hourboost-mysql.svg)](https://github.com/Triniayo/steam-hourboost-mysql/stargazers)
[![GitHub license](https://img.shields.io/github/license/Triniayo/steam-hourboost-mysql.svg)](https://github.com/Triniayo/steam-hourboost-mysql)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Triniayo/steam-hourboost-mysql.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FTriniayo%2Fsteam-hourboost-mysql)

# Requirements
* MySQL Server
* NodeJS
* Node-Packages: steam, mysql, crypto

# How to install

```
git clone https://github.com/Triniayo/steam-hourboost-mysql.git
npm install .
```

### ✏️ Edit the 'client.js'-File

```Enter the IP, Username, Password and Database of your MySQL-Server.```

### ▶️ Batch the .SQL-File into your MySQL-Database

### ▶️ Run the Hourboost-Script

```
node client.js
```

### ▶️ Run the Hourboost-Script in the background

```
npm i pm2
pm2 start client.js
```

### 🎓 You are done.

### 🤖 Authors
- Triniayo

### ❤️ Credits
- [Sapphyrus](https://github.com/sapphyrus/nbhourboost)
